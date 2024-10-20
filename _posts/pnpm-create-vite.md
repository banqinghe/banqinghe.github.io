---
title: "pnpm create vite 做了什么？"
date: "2024-10-20 15:51:09"
---

`pnpm create vite` 就能触发初始化 vite 项目的初始化，之前一直好奇背后的原理是什么，今天看了下其实还挺简单的。

pnpm 的[文档](https://pnpm.io/cli/create)说的很简单也很清楚，`pnpm create xxx` 实际上会去找 `create-xxx` 或 `@foo/create-xxx` 这个 npm 包，然后作为一个 node 脚本去执行。`pnpm create vite` 能够成功执行并且初始化是因为有 [create-vite](https://www.npmjs.com/package/create-vite) 这个包。

`create-vite` 是 `vitejs/vite` monorepo 中的一个 package，clone 下来看看它到底做了点啥。

## 打包

`create-vite` 的打包工具是 unbuild，一个基于 rollup 的上层封装，项目本身的打包配置非常简单，我用 gpt-4o 简单加了几行注释：

```typescript
// 在这里省略了 license 相关的 plugin, 只关注构建本身

import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],

  // true 表示在构建开始之前会清理掉之前的构建输出。这有助于保证每次构建都是
  // 干净的，消除旧文件的干扰
  clean: true,

  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: 'node18',
      minify: true,
    },
  },

  // 在项目中使用 prompts 进行模块导入时，实际会导入 prompts/lib/index.js 文件
  alias: {
    // we can always use non-transpiled code since we support node 18+
    prompts: 'prompts/lib/index.js',
  },
})
```

其中的 `rollup.inlineDependencies` 官方文档[没有相关说明](https://github.com/unjs/unbuild/issues/376)，不加这条 build 就会报错...

```
 WARN  Build is done with some warnings:                                                                                            22:43:06

- Inlined implicit external cross-spawn
- Inlined implicit external minimist
...

 ERROR  Exiting with code (1). You can change this behavior by setting failOnWarn: false .                                          22:43:06
```

设置 `failOnWarn: false` 也没看出打包产物有何不同，疑惑。

不过排除这个奇怪的因素，可以看出 unbuild 打包真的非常简单，配一个入口基本就能跑起来了，还能开箱即用地支持 TypeScript。

开发命令行工具的时候（`pnpm dev`）使用 `unbuild --stub`，此时 dist 中的输出会变成 ts 源文件的直接引入，便于直接调试，也算是某种程度上的热更新吧：

```javascript
import jiti from "file:///D:/repo/create-vite/node_modules/.pnpm/jiti@1.21.6/node_modules/jiti/lib/index.js";

/** @type {import("D:/repo/create-vite/src/index")} */
const _module = jiti(null, {
  "esmResolve": true,
  "interopDefault": true,
  "alias": {
    "create-vite": "D:/repo/create-vite",
    "prompts": "prompts/lib/index.js"
  }
})("D:/repo/create-vite/src/index.ts");

export default _module;
```

`jiti` 是一个和 `ts-node`、`tsx` 类似的工具，也在 `unjs` 这个组织下面。

## 执行逻辑

### 参数解析

使用 `minimist` 来解析参数：

```typescript
const argv = minimist<{
  template?: string
  help?: boolean
}>(process.argv.slice(2), {
  default: { help: false },
  alias: { h: 'help', t: 'template' },
  string: ['_'],
})
```

通过泛型可以看到，脚本接受的合法选项有两个，分别是 `--help` 和 `--template` ，字符串内容则被存储在 `_` 这个 key 下面。

如果执行 `node index.js project1 project2 project3 --template react` 则 `argv` 为：

```javascript
{
  _: [ 'project1', 'project2', 'project3' ],
  template: 'react',
  t: 'react',
  help: false,
  h: false
}
```

### help 信息

```typescript
if (help) {
  console.log(helpMessage)
  return
}
```

helpMessage 中的模板是有颜色的文字，这是使用 `picocolors` 这个库做到的：

```typescript
import colors from 'picocolors'

const {
  blue,
  blueBright,
  cyan,
  green,
  greenBright,
  magenta,
  red,
  redBright,
  reset,
  yellow,
} = colors

const helpMessage = `\
Usage: create-vite [OPTION]... [DIRECTORY]

Create a new Vite project in JavaScript or TypeScript.
With no arguments, start the CLI in interactive mode.

Options:
  -t, --template NAME        use a specific template

Available templates:
${yellow    ('vanilla-ts     vanilla'  )}
${green     ('vue-ts         vue'      )}
${cyan      ('react-ts       react'    )}
${cyan      ('react-swc-ts   react-swc')}
${magenta   ('preact-ts      preact'   )}
${redBright ('lit-ts         lit'      )}
${red       ('svelte-ts      svelte'   )}
${blue      ('solid-ts       solid'    )}
${blueBright('qwik-ts        qwik'     )}`
```

<img src="/images/pnpm-create-vite/terminal.png" alt="terminal" style="width:400px;max-width:100%" />

从代码里看函数名和括号之间是可以有空格的，还真是第一次知道这种语法也是被允许的。

### 交互模式

如果 template 和 project name 重有一项未被指定，那么就会进入交互模式，通过逐一询问参数的方式确定使用哪个模板。询问的过程是使用 `prompts` 做到的。

交互模式做了以下操作：

1. 如果命令参数中未指定 project name，则询问 project name
2. 如果指定目录不为空，是覆盖、忽略还是放弃，如果选择放弃则结束命令
3. project name 默认作为 package name，但如果  package name 不合法（只能包括命名空间的开头 `@`、小写字母、数字、`-` 和 `~`），则需要手动输入
4. 如果命令参数中未指定 template，询问 framework 以及其具体配置，如是否使用 TypeScript

询问完成后会得到 `framework, overwrite, packageName, variant` 四个参数

### 生成模板

以 remix 为例，它的模板不在 `create-vite` 库中，而是需要通过 remix 自身的自定义命令 `'npm create remix@latest TARGET_DIR'` 来生成。检测到这种情况后程序会使用 `cross-spawn` 执行对应命令，退出程序。

然后做的基本就是把 template 中的内容粘贴进指定目录下了：

* 粘贴除了 package.json 之外的文件，\_gitignore 改成 .gitignore
* package.json 更改 package name 之后写入指定目录下
* 如果使用的是 react-swc 或 react-swc-ts 模板，需要更改 package.json 和 vite.config.js|ts 中 react plugin 的设置
