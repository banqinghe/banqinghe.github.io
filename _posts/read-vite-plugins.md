---
title: "读几个我常用的 Vite plugin"
date: "2025-12-03 19:59:10"
---

Vite 已经内置了相当多能力，所以平时做简单 Side Project 的开发用到的 plugin 比较少，基本只会使用下面几个（可能也有些别的特好使的我不知道）。本文会从源码层面分别分析它们的实现。

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)：官方 react 插件，支持 Fast Refresh、React Compiler
- [vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr)：可以使用 `import xxx from 'xxx.svg?react'` 的方式将 SVG 引入为 react 组件
- [vite-tsconfig-paths](https://github.com/aleclarson/vite-tsconfig-paths)：将 tsconfig 中的 paths 同步到 Vite 解析系统中，不用额外配置 alias
- [vite-plugin-qrcode](https://github.com/svitejs/vite-plugin-qrcode)：使用 `--host` 时在控制台展示二维码，用手机访问就不用输入 IP 地址了

::: text-mask
最近**又**开始准备找工作，读这些也是为了免得被问 Vite plugin 有哪些 hook 这种垃圾问题又说不出个所以然来，要不没事儿确实不太想看这玩意儿……
:::

## @vitejs/plugin-react

> 这个插件内现在做了很多 rolldown 兼容操作，这里先不讨论

引入方式是：

```js
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
})
```

这里的 `react()` 函数实际返回的是一个 Plugin 数组，不管 rolldown 专用的 plugin 和 SSR 等特殊场景，它主要导出两个 Plugin：

```ts
return [
    viteBabel,
    viteReactRefresh,
]
```

逐个分析，先说 viteBabel。

这个插件的一个功能是配置 JSX 的转换方式，默认使用 'automatic' 模式。它是[react 17 引入的特性](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)，旨在去除使用 JSX 就得 import React 这一麻烦的行为。原本 JSX 代码会被转换为 `React.createElement` 的形式，但开启这一转换之后，jsx 语法会被转换为一个 `jsx()` 函数的调用，这一函数是由 `react/jsx-runtime` 提供（在开发环境是 `react/jsx-dev-runtime`）。

Vite 内部使用 esbuild 做这一转换工作，所以实际上要做到这一点，只要主动把 esbuild 的选项配置对就可以了。viteBabel 使用 `config` hook 来做到。`config` 是最基础的生命周期 hook 之一，它能读取用户配置，并在上面做进一步修改，从而产生最终完整的 Vite config。viteBabel 所做的就是判断用户有没有主动指定使用经典（classic）模式，也就是 createElement 那种模式转换 jsx，并配置相应的 esbuild config：

```ts
config(_userConfig, { command }) {
    if (opts.jsxRuntime === 'classic') {
        return {
            esbuild: {
                jsx: 'transform',
            },
        }
    } else {
        return {
            esbuild: {
                jsx: 'automatic', // <- 自动注入 jsx-runtime
                jsxImportSource: opts.jsxImportSource,
            },
            optimizeDeps: { esbuildOptions: { jsx: 'automatic' } },
        }
    }
}
```

与 `config` 对应的是 `configResolved`，它用来得到最终生成的 vite config，一般用来把一些配置信息存成全局变量供别处使用。

顾名思义，viteBabel 最重要的工作是和 babel 配合做代码转换。这主要通过 [`transform`](https://cn.rollupjs.org/plugin-development/#transform) hook 实现。它可以是一个接收源码和 id 的函数形式，也可以是一个带有 filter 和 handler 的对象，后者是最近一些版本的能力，通过过滤减少需要处理的文件，从而减少 js 与 rust 之间的通信开销（参考 [钩子过滤功能](https://cn.vite.dev/guide/api-plugin#hook-filters)）。viteBabel 使用了这种过滤功能，默认只处理 `[jt]sx?` 文件。

重点关注 handler 的实现，它做的事情：

- 引入 `babel/core`
- 调用 babel 做代码转换：`babel.transformAsync(code, {/* babelOptions */}`
    - 引入 `react-refresh/babel`、将最终的代码用 `RefreshRuntime` 相关的一系列代码包裹以支持 fast-refresh，
    - 根据选项引入 react-compiler 插件

这个插件使用了 `enforce: 'pre'` 使得 transform 是发生在 esbuild 之前，所以 babel 也引入了 jsx 和 typescript 的 parser，从而能解析这些代码。读到这里我其实很疑惑，不是要用 esbuild 做转换吗，为啥 babel 又转换一遍？到底是谁将 tsx 变成的 js 代码。问了一通 LLM 外加通过 [vite-plugin-inspect](https://github.com/antfu-collective/vite-plugin-inspect) 观察 transform 过程，我明白了。parse 和 transform 是两个分开的过程，parse 了不代表就要 transform，所以 babel 引入的 jsx/typescript 插件只是为了能正确地 parse 代码，并非要将它们转换成 js。

我用了一个很简单的例子观察 viteBabel 插件的转换，没有开启 react-compiler，可以看到它基本只是做了 fast refresh 相关的一些代码包裹：

![viteBabel](/images/read-vite-plugins/vite-react-babel.png)

而 jsx 的转换确实发生在后面的 esbuild 执行阶段：

![esbuild](/images/read-vite-plugins/esbuild.png)

要做到 fast refresh，transform 代码只是第一步，还需要载入 react 官方提供的运行时，加上 dev server 和浏览器的通信逻辑，这在 viteReactRefresh 这个插件中实现。

在经过 babel 转换后，组件代码里会生成一句 `import * as RefreshRuntime from "/@react-refresh";`，这里的 `/@react-refresh` 实际上是个虚拟的模块，其内容，需要注入，这一逻辑通过 `resolveId` 和 `load` 配合实现。

```ts
export const runtimePublicPath = '/@react-refresh'
// ...
resolveId: {
    filter: { id: exactRegex(runtimePublicPath) },
    handler(id) {
        if (id === runtimePublicPath) {
            return id
        }
    },
},
load: {
    filter: { id: exactRegex(runtimePublicPath) },
    handler(id) {
        // 这里 filter 和 handler 里都做了 id 判断，handler 中的 id 判断是为了向后兼容，这是官方文档建议的写法
        if (id === runtimePublicPath) {
            return readFileSync(refreshRuntimePath, 'utf-8').replace(
                /__README_URL__/g,
                'https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react',
            )
        }
    },
},
transformIndexHtml() {
    if (!skipFastRefresh && !isFullBundle)
        return [
            {
                tag: 'script',
                attrs: { type: 'module' },
                children: getPreambleCode(base),
            },
        ]
},
```

`resolveId` 会识别 `import xxx from 'yyy'` 的语法，通过判断 import 的 source（前面的 yyy） 决定是否返回某个 id，如果返回，则说明这是个被拦截的虚拟模块，vite 会查找所有插件的 `load`，查看它们能否提供内容。这里的 load 会从本地读取一个 Meta 团队提供的 runtime js 文件，注入 `/@react-refresh` 中。由此，本地通过 `http://localhost:5173/@react-refresh` 中就能访问到指定的 runtime 文件了。

此外，html 中还需要注入一些代码以实现通信，这是通过 `transformIndexHtml` 做到的，它在 html 中加了个 script 标签：

![inject script](/images/read-vite-plugins/inject-html.png)

可以看出来，要实现 fast refresh，基本就是按照 react 团队的要求 transform 代码、把它们提供的 runtime 文件加载进去。

## vite-plugin-svgr

有了前面的经验，大概可以知道用 `resolveId` 和 `load` 就能实现 svgr 的功能。首先在 `resolveId` 里判断是否以 `.svg?react` 结尾，如果是，则在 `load` 里生成一个 react 组件返回。

查看实际的代码发现没有使用 `resolveId`，直接在 `load` 中做了过滤：

```ts
export default function vitePluginSvgr({
  svgrOptions,
  esbuildOptions,
  include = "**/*.svg?react",
  exclude,
}: VitePluginSvgrOptions = {}): Plugin {
  const filter = createFilter(include, exclude);
  const postfixRE = /[?#].*$/s;

  return {
    name: "vite-plugin-svgr",
    enforce: "pre", // to override `vite:asset`'s behavior
    async load(id) {
      if (filter(id)) {
        const { transform } = await import("@svgr/core");
        const { default: jsx } = await import("@svgr/plugin-jsx");
        //...
```

用 `resolveId` 也没毛病，它就是用来声明一个虚拟模块的。但当我尝试加入的时候发现如果要使用 `resolveId`，就得自己计算文件路径传给 `load`：

```js
resolveId(source, importer) {
    if (source.startsWith('.')) {
        const resolved = importer
            ? path.resolve(path.dirname(importer), source)
            : path.resolve(process.cwd(), source);
        return resolved; // 返回绝对路径
    }
    return null;
},
```

所以这里不用 `resolveId` 的好处就显现了，`load` 中的 id 参数直接就是个绝对路径，方便 readFile 操作。

此外，通过 enforce: 'pre' + `load`，也覆盖了 vite:asset，也就是说 Vite 不会将这导入视为对静态资源的导入了，而是全权由 `load` 产生它的内容。我之前还在想把 `load` 换成 `transform` 是不是也能跑，实际上发现会有点问题，因为 vite:asset 是在 load 阶段执行的，`transform` 拿到的将会是它处理后的内容。

在 `load` 里做了两件事情，一是调用 svgr 这个包的能力，将 svg 文件转换为 react 组件，二是使用 esbuild 或 oxc（如果使用了 rolldown）将 jsx 转换为 js 文件。

```ts
const { transform } = await import("@svgr/core");
const { default: jsx } = await import("@svgr/plugin-jsx");

const filePath = id.replace(postfixRE, "");
const svgCode = await fs.promises.readFile(filePath, "utf8");

const componentCode = await transform(svgCode, svgrOptions, {
  filePath,
  caller: {
    defaultPlugins: [jsx],
  },
});

const res = await transformWith(componentCode, id, useOxc ? {
  // @ts-ignore - "lang" is required for transformWithOxc
  lang: "jsx",
  ...esbuildOptions,
} : {
  loader: "jsx",
  ...esbuildOptions,
});

return {
  code: res.code,
  map: null, // TODO:
};
```

到此处，我还有个疑惑是为什么要自己处理一下 jsx 的转换，esbuild 不是会做这部分么。LLM 告诉我 esbuild 只会处理 `[jt]sx?` 文件，这是个 svg，不会被匹配到。我尝试去除 `transformWith()` 函数的执行，确实后续确实报错了。

![](/images/read-vite-plugins/svgr-without-jsx-transform.png)

我觉得可以修改 esbuild 的 include 配置来避免使用 `transformWithEsbuild()`：

```js
config() {
    return {
        esbuild: {
            include: /\.(tsx?|jsx|svg\?react)$/,
            loader: 'jsx',
        }
    }
},
```

试了一下确实能跑，但是要覆盖 esbuild 原有的默认设置，让整个 vite 的 esbuild 都变得更脆弱了。原版插件的实现确实更精简可靠。

顺带一提，这个报错的 vite:import-analysis 模块作用是把 import 内容处理为正确的引用路径。比如

```ts
import * as React from "react";
```

实际上会被转换为：

```ts
import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=da3bfe9f";
const React = ((m) =>
    m?.__esModule
        ? m
        : {
              ...((typeof m === "object" && !Array.isArray(m)) ||
              typeof m === "function"
                  ? m
                  : {}),
              default: m,
          }
)(__vite__cjsImport0_react);
```

Vite 会处理 `http://localhost:5173/node_modules/.vite/deps/react.js?v=da3bfe9f`，使它返回 node_modules 中的正确内容。

## vite-tsconfig-paths

这个插件的实现比我想的复杂多了……

在看代码之前，我想的就是读取一下 tsconfig 中的 paths 内容，通过 `config` hook 将它们映射到 Vite 的 alias 设置上。但是其实完全不是这么做的。

主要是因为 tsconfig 本身具有复杂性，它支持继承，monorepo 中可能有多个有引用关系的 tsconfig，此外，paths 某个 key 对应的 value 可以是一个多项的数组，用来表示多层的备份关系，例如：`"*": ["types/*", "*"]` 就表示 `types/*` 找不到就去找 `*`，这种匹配关系难以直接映射到 alias 上。

插件使用了四个生命周期 hook，整个链路也就有 4 个阶段：

1. **配置解析（configResolved）：**读取 Vite 配置，确定根目录、工作区、TypeScript 依赖等环境变量。
2. **构建准备（buildStart）：**扫描并解析所有 tsconfig，建立路径解析器缓存，支持多项目和懒加载。buildStart 这一 hook 是在 Vite 打包启动的时候调用，适合做一些初始化工作
3. **开发服务器启动（configureServer）：**监听 tsconfig 文件变动，动态更新解析器和缓存，保证热更新和多项目兼容
4. **模块解析阶段（resolveId）：**每次模块导入时，动态查找对应 tsconfig，按 paths/baseUrl 规则解析路径，优先最长前缀（这是 tsconfig paths 的匹配逻辑），支持多路径 fallback，确保与 TypeScript 行为一致

（这些总结是 LLM 做的，我也就看明白个大概 - -）

最终的替换是由 `resolveId` 做到的，如果它返回的是实际路径（不是 `\0` 开头的虚拟模块路径），就会在 vite:import-analysis 中将别名转换为 `resolveId` 吐出来的路径：

![tsconfig-paths vite:import-analysis](/images/read-vite-plugins/tsconfig-paths.png)

## vite-plugin-qrcode

这个插件简单直白，却很好用：

<pre style="border-radius:0;line-height:1.25">➜  react-demo-ts nr dev --host

> react-demo-ts@0.0.0 dev /Users/banqinghe/repo/check-vite-plugin/react-demo-ts
> vite --host


  VITE v7.2.6  ready in 135 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.19.106:5173/
  ➜  Inspect: http://localhost:5173/__inspect/
  ➜  press h + enter to show help

  Visit page on mobile:
  http://192.168.19.106:5173/
<div style="line-height:1">  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  █ ▄▄▄▄▄ █ ▀▀▄ ▀ █ █ ▄▄▄▄▄ █
  █ █   █ ███ ▄▄ ▄  █ █   █ █
  █ █▄▄▄█ █ ▄▄ █▄██ █ █▄▄▄█ █
  █▄▄▄▄▄▄▄█ █ ▀ █ █▄█▄▄▄▄▄▄▄█
  █▄▄ ▀▀ ▄█   █▄█  █  ▄▄▀█  █
  █▄▀▄█▄▄▄ ▄▀█ ▀▄▄  ▄ █  ▄█▄█
  ██▄█ ██▄▀▀▄█▀▄█ ▀▄▄ ████▀ █
  █▄▄█ ▄ ▄▀█▀  ███▄▄█▀█▄▄▄█▄█
  █▄▄▄▄██▄▄▀ ▄ █▀ ▀ ▄▄▄ █▀▄▀█
  █ ▄▄▄▄▄ █▀▀▄ ▀█▄█ █▄█ ▄█▀ █
  █ █   █ ████ ██ ▄ ▄▄   ▀ ██
  █ █▄▄▄█ █ ▀ ▄█▄▀▀ ██  ██▄▄█
  █▄▄▄▄▄▄▄█▄█▄▄██▄▄▄█▄██▄██▄█</div>
</pre>

主要做的事情：

1. 在 dev server 启动之后，拿到 network url
2. 用 network url 生成二维码打印出来

这个插件使用 `configureServer` 和 `configPreviewServer` 分别监听开发服务器和预览服务器。这两个函数都有一个 server 参数，`server.resolvedUrls` 中可以得到 local 和 network 地址：

```js
{
    local: [ 'http://localhost:5173/' ],
    network: [ 'http://192.168.19.106:5173/' ]
}
```

读取到 `server.resolvedUrls.network` 之后，再使用第三方库 [`qrcode-terminal`](https://github.com/gtanner/qrcode-terminal) 生成 terminal 中的二维码文本，然后通过 Vite 提供的 `server.config.logger.info()` 将信息打印出来即可。

```ts
configureServer(server) {
    const _listen = server.listen;
    server.listen = function () {
        const isRestart = arguments[1] === true;
        if (!isRestart) {
            server.httpServer?.on('listening', () => {
                setTimeout(() => logQrcode(server, options), 0);
            });
        }
        return _listen.apply(this, arguments);
    };
},
```

有两个细节值得注意：

1. 这里劫持了真正的 `listen()` 函数，这样才能有时机做到在每次 listen 之前判断当前是否在重启状态（Vite 会在配置变化、或者用户主动键入 `r` 重启服务器），二维码应该只在首次 listen 时打印
2. 使用 setTimeout 使二维码在 Vite 基础信息之后打印，而不是之前
