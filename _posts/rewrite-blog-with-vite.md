---
title: "使用 Vite 重写博客"
date: "2021-11-23 17:30:11"
---

就使用体验来说，感觉 create-react-app 还是不太好用，不是真正的“开箱即用”，最近 Vite 比较火，看了眼文档感觉确实不错（比 webpack 文档强多了），于是想试试 Vite 用起来咋样。

之前的 repo 里也有些自己觉得写得很离谱的地方（虽然整个 repo 只能算是“极小”的级别），这次也算是重构一下吧。

几个月以来也一直听说 Tailwind CSS，很多人推荐，于是也试了一下。虽然最开始会觉得有些颠覆之前的样式书写习惯，但是整个目录下只有一个 `.css` 文件还是挺爽的一件事。

这里记录的主要是感觉需要记录的一些点吧。

## markdown 文件导入问题

之前使用的 create-react-app 已经在 webpack 层面配置了 `.md` 文件的模块化，然后使用以一个 adapter 文件做转接，然后在博文组件里根据 `pathname` 动态导入文本内容。

Vite 在静态资源导入方面有更多选择：

- 使用 `?url` 后缀将资源导入为 URL 形式
- 使用 `?raw` 后缀将资源导入为字符串形式

最开始的想法是用 `?raw` 后缀配合 `import()` 函数在博文页组件动态导入 markdown 文本，没有任何像 `adapter.ts` 这种看起来很冗余的处理。但是现实比较骨感，这一方式在本地调试环境可行，但是在 build 完成后再 serve 就报错了。

在 Vite 的 issue 里有提到这个问题，但是似乎尚未有有效的解答：[Production Build Failed for Dynamic Import of ?raw Files #3222](https://github.com/vitejs/vite/issues/3222)。

等这个 issue 被解决了写起来应该就方便多了。但是现在我还是选择了跟原来差不多方案，使用了一个 `adapter.ts` 的文件，负责导出文件的 url 信息，然后在博客页组件动态 fetch。虽然还是很麻烦，但是相比之前的做法，少了一步动态 import adapter，简洁了一点点。

```typescript
// adapter.js
export { default as ReactMarkdownTest } from '../markdown/react-markdown-test.md?url';
export { default as VueNative } from '../markdown/vue-native.md?url';
export { default as JavascriptNoteForBadMemory } from '../markdown/javascript-note-for-bad-memory.md?url';

...
```

```typescript
// 动态 fetch
fetch(mdUrl)
  .then(res => {
    // Vite converts files smaller than 4kb to base64 by default, so the
    // url of markdown file may be a base64 string that start with 'data:text'
    // or the filename that end with '.md'.
    if (!(/^data:text/.test(res.url) || /\.md$/.test(res.url))) {
        throw new Error(`Wrong path: '${location.pathname}'. Redirect to 404 page.`);
    }
    return res.text();
  })
  .then(text => {
    setMarkdownText(text);
  })
  .catch(err => {
    setIsNoContent(true);
    console.error(err);
  });
```

这里有一个值得注意的地方是，在验证 markdown 资源是否存在的同时，我也验证了这个 url 是否是以 `data:text` 为开头的。起初并没有做这步处理，结果发现打包后有几个 markdown 文件不翼而飞，博文也加载不出来，直到我看到文档里的这句话：

> 较小的资源体积小于 assetsInlineLimit 选项值 则会被内联为 base64 data URL。

默认的 assetsInlineLimit 是 4kb，所以比较小的 markdown 文件的 url 被转化为了 base64 格式。**不好好看文档就会踩坑**。

## 代码高亮问题

这次换了个代码高亮方案，用了 `rehype-highlight` 插件，这个插件依赖了 `lowlight.js` 库，`lowlight.js` 是对 `highlight.js` 的封装。然后 CDN 引入一个主题 CSS 文件即可。

有一个问题是 build 的时候会报错：

```bash
node_modules/rehype-highlight/index.d.ts:11:59 - error TS2694: Namespace '"node_modules/lowlight/lib/core"' has no exported member 'LowlightRoot'.
```

手动把 `node_modules` 里的 `LowlightRoot` 改成 `Root` 才可以。这个问题有点怪。

> **2021-12-19 更：** 十几天之前 `rehype-highlight` 官方解决了这个问题，并发布了新版本。
> 将版本从 `5.0.0` 升级为 `5.0.1` 之后解决

## 目录功能

之前的做法是用 react-markdown 的 `components` props 在处理标题 tag 的同时向外传输各级标题信息，之前遇到的问题现在也遇到了，调试时回调函数会执行两次，非常奇怪。

这次换了一个思路，分成两步执行：

1. 在 markdown 文本更新后，逐行读取文本，将 '#{1,6}' 开头的字符串认为是标题信息，逐渐构建一棵目录树结构
2. 然后再 通过 `Selector API` 获取所有标题 tag 元素，与之前目录树的结构通过 id 一一对应

```typescript
useEffect(() => {
  setCatalogList(getHeadingInfo(markdownText));
  const markdownBody = document.querySelector('.markdown-body');
  if (markdownBody) {
    for (let i = 1; i <= 6; i++) {
      (markdownBody as unknown as Element).querySelectorAll('h' + i).forEach((el, index) => {
        el.id = 'h' + i + '-' + (index + 1);
      });
    }
  }
}, [markdownText]);
```

其实 id 的标记思路是用的 `h + level + 该级别标题出现的次数`，这样的话其实并不需构建树结构，直接遍历就行了。构建树是因为最开始想在 id 上体现目录层级结构，后来觉得比较麻烦就放弃了，但是我还是觉得树结构可能后面会用到吧。

## Tailwind CSS 预设样式

Tailwind CSS 预设了一些样式，比如列表项默认没有样式:

```css
ol,
ul {
  list-style-type: none;
}
```

这会和我们期望的 markdown 展示效果有所冲突，需要手动添加一些修改。使用 `@layer` 可以防止样式顺序先后引发的问题。

```css
// index.css
@layer base {
    .markdown-body ol,
    .markdown-body ul {
        list-style-type: unset;
    }
}
```

## react-router 版本升级

原本用的 v5，这才没过多久就是 v6 了，而且重要的 API 都发生了改变。匹配也都是 exact 匹配了，而不是原来的前缀匹配。使用体验上还不错。

## 评论

使用 `Waline` 做了评论系统，基于 `Valine`，目测更新频率还不错，而且有很友好的文档。照着文档配合 Vercel 和 LeanCloud 做了一个效果很好的评论系统。

支持 markdown 和微博表情，好看的：

![waline test](https://raw.githubusercontent.com/banqinghe/blog/main/images/rewrite-blog-with-vite/waline-test.png)

## Vercel 部署

原本一直都是用 Github Page 做静态页面部署，但是最近发现了更为优秀的 Vercel，使用体验和访问速度都可以说有了巨大提升。

在 Vercel 上需要做的事情非常简单，只需关联上 github 仓库就好，build 和 deploy 工作全部是自动完成的。每次仓库的更新都会自动触发部署的更新，极其方便。

另外一个很好的点竟然是自定义域名竟然也可以被生成 SSL，体验很好。

同时 Vercel 通过 rewrite 配置也可以让我们用上 `BrowserRouter`（[Why does react-router not works at vercel?](https://stackoverflow.com/questions/64815012/why-does-react-router-not-works-at-vercel#:~:text=If%20you%27re%20using%20react-router-dom%20with%20BrowserRouter%20you%20should,%22source%22%3A%20%22%2F%20%28%28%3F%21api%2F.%2A%29.%2A%29%22%2C%20%22destination%22%3A%20%22%2Findex.html%22%20%7D%20%5D%20%7D)）。之前把网站托管在 github page 上的时候只能被迫用 `HashRouter`，总觉得有点蹩脚。

## 代码分割

Vite 配置中有一项 `build.chunkSizeWarningLimit`，默认值为 500，这意味着编译完成后第三方包大于 500 KB 的时候就会触发 Warning，告知用户需要做一些代码分割之类的工作了。最开始我图省事把这个值改成了 1000，后来装了几个包之后发现 vendor.js 又已经超过 1000 KB 了。所以开始着手开搞 code split。

由于 Vite 支持使用 Rollup 插件，所以在前人的铺垫下这件事做起来并不困难。

首先，`rollup-plugin-analyzer` 插件可以检测打包时各个 bundle 的大小，给出一个包大小降序排列的统计表：

```shell
Rollup File Analysis
-----------------------------
bundle size:    1.281 MB
original size:  1.428 MB
code reduction: 10.25 %
module count:   421

███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
file:            D:/repo/banqinghe.github.io/node_modules/parse5/lib/tokenizer/named-entity-data.js
bundle space:    7.26 %
rendered size:   93.089 KB
original size:   73.717 KB
code reduction:  0 %
dependents:      2
  - D:/repo/banqinghe.github.io/node_modules/parse5/lib/tokenizer/named-entity-data.js?commonjs-proxy
  - D:/repo/banqinghe.github.io/node_modules/parse5/lib/tokenizer/index.js

...
```

通过这个插件可以找到是哪些包占据了主要的第三方包体积，我现在比较占地方的包主要是：

- `react`，`react-dom`
- `waline`（评论插件）
- `katex`（数学公式支持）

减小包体积地主要思路有两个：

- 引入 CDN
- 用 `React.lazy()` 做组件懒加载

代码分割方法也比较好实现，引入 CDN 再做一些配置就好了。这里主要用到了 [`rollup-plugin-external-globals`](https://www.npmjs.com/package/rollup-plugin-external-globals) 插件，可以比较方便地把代码中的模块引用转化为对全局变量的引用。

```typescript
rollupOptions: {
  plugins: [
    externalGlobals({
      'react': 'React',
      'react-dom': 'ReactDOM',
      katex: 'katex',
      '@waline/client': 'Waline',
      'highlight.js/lib/core': 'hljs',
    }),
  ],
}
```

组件懒加载在路由处配置即可，将静态引用组件更改为使用 `React.lazy()` 引入：

```typescript
import PostPage from './PostPage';
          ↓
const PostPage = React.lazy(() => import('./PostPage'));
```

同时需要配合 `React.Suspense` 组件来规定当组件未加载完成时展示的加载页。

一通操作之后终于让每个包的体积都降低到了 500 KB 以下，剩下体积较大的包都来自 [`parse5`](https://github.com/inikulin/parse5)，并没有找到 CDN 资源，就先不管了。
