# PWA 笔记

## 介绍



## Service Worker

### Service Worker 结构

- **ServiceWorkerContainer**：提供 service worker 容器的功能，用于 service worker 的注册、卸载、更新以及状态访问，可以控制 service worker 控制的 URL 范围，service worker 文件是否经过 HTTP 缓存。

  获取方式：

  ```javascript
  window.navigator.serviceWorker
  ```

- **ServiceWorkerRegistration**：service worker 文件注册成功后的实例，可以控制共享相同源的一个或多个页面，用于。

  获取方式：

  ```javascript
  // method 1: ServiceWorkerContainer.ready
  await navigator.serviceWorker.ready
  
  // method 2: ServiceWorkerContainer.getRegistration()
  await navigator.serviceWorker.getRegistration()
  
  // method 3: ServiceWorkerGlobalScope.registration
  self.registration
  ```

  

- **ServiceWorker**：对 service worker 线程的引用。

  获取方式：

  ```javascript
  window.navigator.serviceWorker.controller;
  ServiceWorkerRegistration['installing', 'waiting', 'active']
  ```

  

  service worker 有6种状态：

  **1. parsed 已解析**

  **2. installing 安装中**，频繁用于填充缓存，任何资源缓存失败都会跳转到 redundant 状态，可以使用 `waitUntil()` 方法停留在 installing 状态做缓存处理，一般做法如下：

  ```javascript
  const CACHE_KEY = 'v1';
  
  self.oninstalling = (installEvent) => {
    installEvent.waitUntil(
    	caches.open(CACHE_KEY)
      	.then((cache) => cache.addAll([
          'foo.js',
          'bar.html',
          'baz.css',
        ]));
    );
  };
  ```

  **3. installed 已安装**

  **4. activating 激活中**，Service Worker 被选中即将变为可控制页面的 Service Worker。

  **5. activted 已激活**，表示 Service Worker 正在控制一个或多个客户端，这个状态 Service Worker 会捕获 fetch、通知和推送事件。

  > **注意：**  ServiceWorkerRegistration.active 属性的 Service Worker 可能在激活中，也可能在已激活状态

  **6. redundant 已失效**

  

- **ServiceWorkerBlobalScope**：service worker 中的全局引用。

  获取方式：

  ```javascript
  self
  ```

  

  可用于监听 fetch/notification/message/push 事件。



### 使用注意事项

当一个 service worker 被初始注册时，**页面在下次加载之前不会使用它**。 `claim()` 方法会立即控制这些页面。请注意，这会导致 service worker 控制通过网络定期加载的页面，或者可能通过不同的 service worker 加载。

```javascript
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});
```



## 可安装

提供一个**Web 应用程序清单（Web App Manifest）**可以使 Web 程序被安装到设备的主屏幕。

文件名一般为 `manifest.json`， 使用方式为：

```html
<link rel="manifest" href="/manifest.json">
```



mainfest 文件至少满足以下条件才是有效的：

- 在 https 或本地环境
- 注册 service worker 且监听 fetch 事件
- 有 icons，且至少有 144x144 图像
- diaplay 需设置为 `standalone` 或 `fullscreen`
- 设置 name 或 short_name
- 有 start_url
- prefer_related_applications 未设置或设置为 false



## fetch 与缓存

Service Worker  可以通过编程的方式实现真正的网络请求缓存机制。

Service Worker 缓存的特点：

- 不自动缓存任何请求
- 没有缓存到期的概念
- 必须手动更新和删除
- 缓存版本必须手动管理（Service Worker 更新时，新的 Service Worker负责提供新的缓存键以保存新缓存）
- 唯一的浏览器强制逐出策略基于 Service Worker 缓存占用的空间（超过限制的时候使用的 LRU 策略替换，可以通过 `navigator.storage.estimate()` 查看近似可用空间）

Service Worker  的缓存依赖 CacheStorage 实现，CacheStorage 对象本质上是一个二级嵌套字典（嵌套关系为  `CacheStorage > Cache `，`Cache` 是一个从 `Request` 对象到 `Response`  对象的映射），可以通过 `caches` 属性访问到。

> 虽然 CacheStorage 是 Service Worker 定义的，但是也可以在主页面或其他工作者线程中访问到。

### CacheStorage API介绍

**1. CacheStorage**

`Cache` 对象通过 `caches.open(key)` 得到，同时 `CacheStorage` 对象也支持 `has()`，`delete()`，`keys()` 方法。前面所述的方法都基于 Promise。

`CacheStorage` 的 `match()` 方法可以通过 `Request` 对象找到第一个匹配的 `Cache` 对象的 `key` 。

**2. Cache**

`Cache` 对象的键可以是 URL 字符串或 `Request` 对象。

- **填充方法：** 
  - `put(request, response)`添加缓存项
  - `add(request)`发送请求并缓存响应
  - `addAll(requests)`接收数组，对每一项分别调用 `add()`
- **检索方法：**
  - `matchAll(request, options)`，解决为 `Response` 数组
  - `match(request, options)`，相当于 `matchAll(request, options)[0]`
- `delete()`
- `keys()`

上述方法均返回 `Promise`。



### 拦截 fetch 事件

**1. 从网络返回**，简单转发 fetch 事件，比如需要发送到服务端的 POST 请求需要使用此策略：

```javascript
self.onfetch = (fetchEvent) => {
  fetchEvent.respondWith(fetch(fetchEvent.request));
};
```

**2. 从缓存返回**，对于任何肯定有缓存的资源（如在安装阶段缓存的资源），可以采用此策略：

```javascript
self.onfetch = (fetchEvent) => {
  fetchEvent.respondWith(caches.match(fetchEvent.request));
};
```

**3. 从网络返回，缓存作为后备**，尽可能展示最新信息，但是离线情况下展示缓存资源：

```javascript
self.onfetch = (fetchEvent) => {
  fetchEvent.respondWith(
    fetch(fetchEvent.request)
    .catch(() => caches.match(fetchEvent.request))
  );
};
```

**4. 从缓存返回，网络作为后备**，优先考虑访问速度，但是仍会在没有缓存的情况下发送网络请求，这是大多数 PWA 的首选策略：

```javascript
self.onfetch = (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request)
      .then((response) => response || fetch(fetchEvent.request));
  );
};
```

**5. 通用后备**，考虑缓存和网络均不可用的情况下，返回后备资源：

```javascript
self.onfetch = (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request)
      .then((response) => response || fetch(fetchEvent.request))
    	.catch(() => caches.match('/fallback.html'));
  );
};
```



> 参考文章：[The offline cookbook](https://jakearchibald.com/2014/offline-cookbook/)

