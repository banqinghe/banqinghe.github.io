---
title: "Service worker & Workbox Note"
date: "2022-05-29 22:03:05"
---

## Service worker

### Overview

Service worker 的生命周期可以理解为原生应用的生命周期，网络获取 → 安装 → 执行 → 更新。

两种缓存方式：

- precaching
- runtime caching

### A service worker's life

Step 1：Registration

Step 2: Installation - state: installing → waitUtil → installed

监听 `install` 事件，并在其中做资源的预缓存。`event.waitUntil()` 接收一个 Promise，成功状态会转化为 installed，随后转化为 activate。

Step 3: Activation - state: activating → activated

该阶段的典型任务是当 service worker 更新时修改缓存。

### Handling service worker updates

Service worker 应该始终使用一个固定的文件名。当用户导航到 service worker scope 中的新页面时（跳转或刷新当前页面），浏览器会自动检测是否需要更新 service worker。

浏览器通过以下两个方式判断 service worker 是否变化了：

- Any byte-for-byte changes to scripts requested by importScripts, if applicable.
- Any changes in the service worker's top-level code, which affects the fingerprint the browser has generated of it.

文档中说，如果一个应用少有导航发生，比如只有一个页面，那么就有必要手动触发更新。我对这个说法很迷惑，只有一个页面刚进入时也是 navigate request 啊？为什么需要手动 update。

试了一下手动刷新页面，虽然浏览器检测到了 service worker 的更新，但是新的 service worker 是在将页面关掉再打开之后才 active 的。

也就是文档里说的：新的 service worker 安装完毕后，页面依然会被旧的 service worker 控制，当相关的标签页被全部关闭后，新 service worker 才会取代旧 service worker 进入 activation 阶段。

所以重点是：**仅仅 reload页面能使 service worker update 并 install，但是并不会马上 active，而是在停留在 waiting 的状态，直到页面被全部关闭又重开**。调试的时候立马见效还是要使用 Update on reload 功能。

对于单页面应用，使用 History API 模拟跳转，实际上并不会有 navigate request 的发生，解决方案：[https://web.dev/handling-navigation-requests/#single-page-apps](https://web.dev/handling-navigation-requests/#single-page-apps)

当应用更新时，往往会变更文件名（文件 hash），此时在 install 事件回调中使用另一个 key 的 cache 做 precache。

`self.skipWaiting()` 函数强制当前 service worker 进入 activate 状态，但是并不推荐（This can break [stuff like lazily-loaded subresources](https://dev.to/jeffposnick/paying-attention-while-loading-lazily-45ef) until the next navigation request.） **（没看懂为啥）**。发现了知乎的一篇文章讲这个问题：[谨慎处理 Service Worker 的更新](https://zhuanlan.zhihu.com/p/51118741)，使用 `skipWaiting` 的一个很大问题是，当后来的 service worker 马上接管页面后，它会处理后续的 `fetch` 事件，而之前的请求都是由前一个 service worker 处理的，这样可能会导致不一致问题。知乎的文章中举了网络不佳的情况下缓存 image 的例子。

service worker 在 activate 回调中要做的事是删除旧版本的缓存，example 中的做法是将 key 不是本次所定义的缓存都用 `caches.delete(key)` 删除。

比如上一个缓存使用了 `caches.open('cahce_v1')` 这个版本换成了 `caches.open(cache_v2)`，那么这次就要删除 key 为 `cache_v1` 的缓存。

### Strategies for service worker caching

- Cache Only
- Network Only
- Cache first, falling back to network
- Network first, falling back to cache
- Stale-while-revalidate

precache 的时候使用 `Cache.addAll()` 也会发出一遍 request（标准：[Cache.addAll](https://w3c.github.io/ServiceWorker/#cache-addAll)），所以在 install 中 precache 且是第一次加载时，会发出了两遍请求。

![precache-network](https://raw.githubusercontent.com/banqinghe/blog/main/images/pwa/precache-network.png)

（图中请求的资源都被浏览器缓存了，但这并不影响 service worker的流程）

## Need To Know

### Some backfire

预缓存时会对所有需要缓存的资源进行一次 request，因此：

- 预缓存发生时机很重要，在 `load` 事件之后注册 service worker 以防止 service worker 的预缓存操作阻碍页面正常加载。
- 预缓存很可能造成存储和网络资源的浪费，缓存的资源应该经过较好的计划。对于很大的资源，在运行时缓存是更好的选择（不会重复请求这么大的资源）。

navigate request 一般只需网络获取，但是由于 fetch 事件被触发，发起网络请求之前需要先启动 service worker，启动时间会拖慢页面加载速度。用 preload navigate response 的方式可以解决这一问题。即将 sw boot → navigate request 的串行改为并行发生。

当使用 Cache First 策略时，对于 versioned 的资源（每次 update 文件名都会发生改变）有较为及时的更新处理，但是当资源名是 unversioned 的时候，使用 Cache First 就会导致更新的不及时（若资源名是 unversioned 的，即使文件内容变化，service worker 代码中的 precache 列表不会变化，如果 service worker 的其他部分代码同时也没变化，那么浏览器就不会重新安装 service worker，也就不会重新请求需要缓存的资源了；index.html 中的请求链接也不会变化，导致无法更新）。对于 unversioned 的情况，使用 Network First 或者 stale-while-revalidate 策略更好一些，但最好还是保证所有资源都是 versioned 的。

使用 Cache First 时缓存的资源可能越来越大，可能导致资源容量过量的情况（个人感觉这个问题应该不会很常明显）。用 workbox-expiration-module 可以在一定程度上解决这个问题。

### Removing buggy service workers

如果发现部署了一个有 bug 的 service worker，补救措施是马上发布一个新的无行为（no-op）的 service worker，这个 service worker 不会监听 fetch 事件，在 install 回调中 skipWaiting 以立即接管页面，在 activate 回调中获取所有相关标签页（`self.clientsmatchAll({type: 'window'})`）然后 reload 它们（这个都已经接管了，这个 reload 感觉不是很有必要啊，文中说这个操作是 Optional 的）。新的 service worker 必须和原本的文件名相同，这样才能确保新的 no-op service worker 替代原本的 buggy service worker。浏览器会保证 service worker 文件不会被 HTTP 缓存，使其能得到及时的更新。

（对于上述的流程我感觉不是非常有必要？在企业里可能直接回滚版本就完事了，当然这样不一定能保证 service worker 被及时替换掉，毕竟之前在常规场景下不提倡使用 `skipWaiting`）

如果 service worker 的文件名（或者说是 URL）是未知的，比如 service worker 的文件名是 versioned 的（虽然这样是错误的做法），这种情况下就需要在服务端拦截 HTTP header 中带有 `Service-Worker` 的请求（对 service worker 的请求都会有这个HTTP 头），并将 response 替换为 no-op service worker。

### Local development

本地调试方式：

- 每次都使用无痕窗口调试
- 使用 Chrome Devtool 的 service worker panel 中的功能选项。

service worker panel 中 `Bypass for network` 选项应该是最实用的。屏蔽 service worker 对 fetch 事件的控制。

【Shift + 刷新键】（Windows 中刷新键是 F5），会进行 *force fresh*，这种刷新会绕过 HTTP cache 和 service worker。

### App shell

SPA 中使用 App Shell 是一个不错的选择。App Shell 是一个会被 Cache Storage 缓存的最小 HTML 文件，应该是有 header、sidebar、loading 组件等内容组成，而将需要后续需 Ajax 填充，当用户处于 offline 状态时会展示该 App Shell。

> Note：听起来是很特别的技术，但看起来 App Shell 其实就是单文件组件的入口 HTML 文件。正常使用 Network First 策略。

Twitter 的 HTML 似乎就是一个 App Shell，看起来不是 Network First 而是 Cache First 的。

[Introduction to Progressive Web App Architectures](https://developers.google.com/web/ilt/pwa/introduction-to-progressive-web-app-architectures) 文中说 App Shell 应该使用 Cache First 策略。

有一个问题，缓存的文件需要是 versioned 的，但是 index.html 这个文件则一般没有 hash filename，怎么对 App Shell 缓存及时更新呢？`Cache.addAll()` 会覆盖之前使用 `addAll` 方法的缓存结果，所以好像也没什么问题……

单页应用都是首次加载慢，而后续加载快，多页应用则反过来。在架构上有这两种选择之外的另一种结构，即（MPA with Stream），依然使用多页应用模式，但是对 HTML 中的基础组件用 service worker 做缓存，当用户请求页面的时候，页面内容（Content）是 Network First 的，但是像 Header、Footer 这些基础结构则是使用 Cache First。最终用户得到的 HTML 是使用 Stream API 将 Header、Content、Footer 拼装得到的。

## Dos and Donts

主旨是在保证用户体验的同时不造成资源的浪费。

DO

- 缓存对用户来说的关键资源，一般就是 html/css/js

DONT

- 预缓存 responsive images 和 favicon，因为它们对不同设备用户展示的结果不一样，全部缓存会造成浪费。使用运行时缓存是更好的选择。
- 预缓存 polyfills，一般 polyfill 是根据用户环境加载的，所有最好在运行时缓存

## Workbox

两种模式：

- generateSW：无需编写 service worker 代码，简单但不灵活
- injestManifest：需要编写 service worker 代码，灵活但相对复杂

使用 workbox 的方式：

- `workbox-build`：用来实现 workbox 集成脚本，填写配置、生成 service worker
- `workbox-cli`：基于 `workbox-build`，使用命令行工具生成配置文件
- `workbox-webpack-plugin`：唯一与 builder 工具绑定的官方插件
- `workbox-sw`：不使用打包工具，利用 CDN 引入 workbox 并使用

workbox 的其他包

- `workbox-precaching`: `precacheAndRoute()`，预缓存
- `workbox-strategies`: 缓存策略
- `workbox-routing`: `NavigationRoute()`（针对 navigate request 的路由），`Route()`（）普通资源路由，`registerRoute()`
- `workbox-window`: 一系列 module 的集合，旨在简化使用

### workbox-window

注册 service worker 只需要使用 `workbox-window` 中的 `Workbox` 类，如下：

```js
import { Workbox } from 'workbox-window';

const wb = new Workbox('/sw.js');
wb.register();
```

这种注册方式会自动在 window 的 load 完成后发生。

Workbox 实例的 `messageSW()` 方法可以方便地从 window 向 service worker 发送消息。

### misc

workbox 缓存 opaque response，还没看明白。[https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#cross-origin-considerations](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#cross-origin-considerations)

使用 `NetworkFirst` / `NetworkOnly` 策略的时候可以通过 `networkTimeoutSeconds` 人为设置超时时间，以使请求不用等待太久就回落到缓存上。使用 plugins 中的 `handleDidError()` 方法可以设置默认的 fallback response。

对于 video 和 audio 需要使用 `workbox-range-requests` 包。[详细信息](https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video/)

`workbox-background-sync` 包可以在离线时存储失败的请求，在重新回到在线状态时会再次发起这些请求。
