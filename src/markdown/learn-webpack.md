# webpack基础学习

wepack是一种前端资源构建工具，一个静态模块打包工具。前端的所有资源（js/css/html/img/less/sass/...）在webpack看来都是模块，webpack对它们进行整合，并打包成对应的静态资源（bundle）。

## 基础知识

**1. 基本原理**

webpack将需要打包成的资源划分成多个模块（chunk），并将它们打包生成目标文件bundle：

![webpack打包流程](https://gitee.com/banqinghe/blog-images/raw/master/webpack%E5%9F%BA%E7%A1%80%E5%AD%A6%E4%B9%A0/webpack%E6%89%93%E5%8C%85%E6%B5%81%E7%A8%8B.png)

从上图我们可以看到，一个chunk其实就是靠依赖关系连接起来的一个文件资源的集合，webpack首先会对其中的文件进行处理（如把less格式转化为css格式），然后将处理后的资源进行打包。



**2. 五个核心概念**

webpack有5个核心概念：

- **Entry：**入口，指示打包起点，webpack会从起点文件开始构建依赖图、划分chunk
- **Output：**输出，指示webpack打包后的得到的bundle输出到哪里，以及如何命名
- **Loader：**用于对模块的源代码进行转换，处理css/ts/img等资源（webpack本身只认识js/json）

- **Plugins：**插件，可以执行比Loader范围更广的任务，如代码的压缩

- **Mode：**指定打包模式，有`development`（开发模式）和`production`（生产模式），和`none`三种。不同模式会默认开启相应的插件，具体如下：

  | 选项          | 描述                                                         |
  | :------------ | :----------------------------------------------------------- |
  | `development` | 会将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `development` . 启用 `NamedChunksPlugin` 和 `NamedModulesPlugin` 。 |
  | `production`  | 会将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `production` . 启用 `FlagDependencyUsagePlugin` , `FlagIncludedChunksPlugin` , `ModuleConcatenationPlugin` , `NoEmitOnErrorsPlugin` , `OccurrenceOrderPlugin` , `SideEffectsFlagPlugin` 和 `TerserPlugin` 。 |
  | `none`        | 不使用任何默认优化选项                                       |



**3. 简单使用**

```bash
cnpm i webpack webpack-cli -g # 全局安装webpack 和 webpack-cli
```

我们有一个`src/index.js`文件，并在文件中引入`./data.json`

使用命令（`./src/index.js`为入口文件，输出文件为`./build/build.js`）：

```bash
webpack ./src/index.js -o ./build/build.js --mode=development
```

```bash
Hash: 6d600b25d47f4727941a
Version: webpack 4.44.1
Time: 45ms
Built at: 2020-09-11 10:10:24
   Asset      Size  Chunks             Chunk Names
build.js  4.83 KiB    main  [emitted]  main
Entrypoint main = build.js
[./src/data.json] 44 bytes {main} [built]
[./src/index.js] 375 bytes {main} [built]
```

可以看到我们有一个默认名为`main`的chunk，被打包成了名为`build.js`的输出文件。

如果我们试图在入口文件中引入CSS文件`./index.css`，然后使用上面的打包语句，会显示打包错误。这是因为webpack只能打包js/json，并不能直接处理CSS文件和其他资源。



**4. 配置文件**

上面我们是使用命令行完成了简单的打包工作，但是一般情况下我们还是使用配置文件的方式进行配置，然后在命令行直接输入`webpack`进行打包。

webpack命令会默认使用当前目录下的`webpack.config.js`文件作为配置，配置文件的基本结构如下：

```javascript webpack.config.js 基本模板
const { resolve } = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'build.js',
        // __dirname是node.js的一个变量，指当前文件目录的绝对路径
        path: resolve(__dirname, 'build')
    },
    // loader配置
    module: {
        rules: [
        ]
    },
    // plugins配置
    plugins: [
    ],
    // 模式
    mode: 'development'
}
```



## 开发环境配置

### 打包 CSS

在module 中的rules数组中添加：

```js
{
  // 匹配哪些文件（使用正则表达式）
  test: /\.css$/,
  // 使用哪些loader进行处理
  use: [
    // 执行顺序：从右到左，从下到上
    // 创建style标签，将js中的样式资源插入进行，添加到head中生效
    'style-loader',
    // 将css文件变成commonjs模块加载到js中，里面是样式字符串
    'css-loader'
  ]
}
```

打包之后我们可以发现CSS代码实际上被整合进了`build/build.js`文件中。如果我们创建一个HTML文件`index.html`并引入`build.js`，在服务其上运行的时候，可以看到样式生效了，这是因为`style-loader`将`<style>`元素插进了`<head>`。

如果需要打包less文件，则需要在使用`css-loader`之前将less文件转化为css文件，`less-loader`可以实现此功能：

```js
use: [
  'style-loader',
  'css-loader',
  'less-loader'
]
```



### 打包 html

我们如果我们想引入并打包自己的html文件，需要使用`html-webpack-plugin`插件。

使用插件和使用loader的步骤有所不同：

- loader: 1. 下载  2. 使用

- plugins: 1. 下载  2. 引入  3. 使用 

我们需要在`webpack.config.js`文件中引入该插件才可以使用：

```js 引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
```

```js
plugins: [
  // 创建一个空HTML文件，引入打包输出的所有资源（JS/CSS）
  new HtmlWebpackPlugin({
    // 复制./src/index.html文件，并自动引入打包输出的所有资源（JS/CSS）
    template: './src/index.html'
  })
],
```

打包生成的html会引入生成的`build.js`文件。



### 打包图片

在CSS代码中我们通常需要引入一些图片文件，我们可以使用`url-loader`对CSS文件中引入的图片进行打包：

```js
{
  test: /\.(png|jpg|gif)$/,
  // 如果只使用一个loader，不必使用use数组，只需使用loader属性
  // 需要下载url-loader, file-loader 因为url-loader是依赖file-loader的
  // 问题：默认处理不了html中的img
  loader: 'url-loader',
  options: {
    // 图片小于8kb，就会被base64处理
    // 优点：减少请求数量（减轻服务器压力）
    // 缺点：图片体积会更大（文件请求速度更慢）
    limit: 8 * 1024,
    // 给图片重命名
    // [hash:10]: 图片hash的前10位
    // [ext]: 图片原扩展名
    name: '[hash:10].[ext]'
  }
}
```

在这里我们规定小于8KB的图片不会被作为图片打包，而是被base64处理，作为字节码存储在`build.js`中。

看如下示例：

<img src="https://gitee.com/banqinghe/blog-images/raw/master/webpack%E5%9F%BA%E7%A1%80%E5%AD%A6%E4%B9%A0/pack-img.png" width="280">

`src`中有3张图片，但是打包之后输出的文件只有张了。这是因为其中的`github.png`这张图到只有5.1KB的大小，所以被转化为了base64的字符码。在`build.js`文件中可以找到这一串字符：

```txt
(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAk1BMVEX///8NJjYAGy4AITIJJDQAHS8AHzEAFSoAABsAACAAAB4AFCkAECcACyRtdn0AGCzy8/QABiIAABj19vfZ3N7k5+nd4OLz9PWiqa7N0dRxe4Pr7e61 ...
```

`url-loader`可以很好地打包css文件引入的图片，但是如果我们在html的`<img>`内直接引入图片则不能被打包。为了解决这个问题，需要使用新的loader：`html-loader`：

```js
{
  test: /\.html$/,
  // 引入html中的img图片，从而可以让url-loader进行处理
  loader: 'html-loader',
}
```

这样html文件和css文件中引入的图片就都可以被打包了。



### 打包其他资源

除了js/css/img这些资源，我们还可能会用到其他种类的资源，如svg文件，tff字体文件等，对于这些资源，我们使用`file-loader`进行统一打包：

```js
// 打包其他资源（js/css/html以外的资源）
{
  // exclude: 排除js/css/html资源
  exclude: /\.(js|css|html)$/,
  loader: 'file-loader'
}
```

> 除了可以使用`test`匹配文件，也可以使用`exclude`取补集来逆向匹配文件

打包之后生成的文件名默认使用哈希值，也可以仿照`url-loader`使用`options`调整文件名。



### 开发服务器 devServer

在开发的时候，我们会希望每次更改代码都可以直接在页面上看到响应，而不是重新打包再显示。`devServer`功能可以帮我们实现这一目的。

在`module.exports`中加入：

```js
// 开发服务器 devServer: 用来自动化（自动编译、打开浏览器、刷新浏览器）
// 特点：只会在内存中编译打包，不会有任何输出（即使没有build目录也可以）
devServer: {
  // 构建后的项目路径
  contentBase: resolve(__dirname, 'build'),
  // 启动gzip压缩
  compress: true,
  port: 4000,
  // 自动打开浏览器
  open: true
}
```

要使用`devServer`，需要安装`webpack-dev-server`，如果我们想调用`node_modules/`下的可执行程序（而不是本机上`PATH`中的），可以使用`npx`命令。

在本例中我们没有全局安装，仅仅在开发环境下安装了`webpack-dev-server`，所以需要使用`npx webpack-dev-server`来启动开发服务器。



## 生产环境配置

### 提取 CSS 成单独文件

在开发环境配置中，我们使用`style-loader`创建style标签，将js中的样式资源插入进行，添加到`<head>`中生效。也就是说CSS文件的内容是被存储在js中，在网页服务器运行的时候动态插入html文件的。这样会让打包生成的js文件体积偏大，渲染速度慢，目录结构较差，也不利于我们后面的优化工作。

在生产环境下，最好将CSS打包成单独的文件，为了实现这一目的我们需要下载`mini-css-extract-plugin`这个包并引入：

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
```

- 在module中，我们需要使用`MiniCssExtractPlugin.loader`代替开发环境中的`style-loader`

- 在plugins中，我们需添加新的插件以指定打包后输出文件的位置：

  ```js
  new MiniCssExtractPlugin({
    // 对输出文件进行重命名
    filename: 'css/build.css'
  })
  ```



### CSS兼容性处理

使用`postcss-loader`进行CSS的兼容性处理，需要安装`postcss-loader` 和`postcss-preset-env`两个包。

> **ps:** `postcss-loader`需要在`css-loader`之前调用

使用`postcss-loader`有两种方式，可以选择使用`postcss-loader`的默认配置，也可以使用`options`手动设置：

```js 设置postcss-loader
{
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [
          // postcss的插件，帮助postcss找到package.json的browserslist里面的配置，通过配置加载指定的css兼容性样式
          require('postcss-preset-env')()
        ]
      }
    }
  ]
}
```

在`package.json`中设置`browerslist`：

```js package.json browerslist
"browserslist": {
  // 默认是生成环境（production），若要使用开发环境，需在webpack.config.js中设置node环境变量：
  // process.env.NODE_ENV = development
  "development": [
    // 开发环境的目标：可以运行即可
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ],
  "production": [
    // 生产环境的目标：满足绝大多是浏览器的兼容
    ">0.2%",
    "not dead",
    "not op_mini all"
  ]
}
```



### 压缩 CSS

只需使用插件`optimize-css-assets-webpack-plugin`

```js
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
```

然后在`plugins`中添加该插件即可：

```js
plugins: [
  ...
  // 压缩CSS
  new OptimizeCssAssetsWebpackPlugin()
],
```



### JavaScript 语法检查

为了保证代码的规范性，我们使用`eslint-loader`进行js的语法检查。需要知道的是，`eslint-loader`只是语法检查的工具，而语法检查标准需要我们自己来配置。这里使用的是`airbnb`风格规范。

首先，需要下载的包有：

```js
cnpm install eslint-loader eslint eslint-config-airbnb-base eslint-plugin-import -S 
```

然后需要在`package.json`中设置`eslintConfig`：

```js
"eslintConfig": {
  // // 继承airbnb的风格规范
  "extends": "airbnb-base",
  "env": {
    // 可以使用浏览器中的全局变量（如可以使用window）
    "browser": true
  }
}
```

配置`webpack.config.js`中的loader：

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'eslint-loader',
  options: {
    // 自动修复
    fix: true
}
```

注意这里使用了`exclude`排除了`node_modules`中的代码，这是因为我们只想检查自己的代码，而不要求第三方代码也遵循我们所使用的代码风格。

这一规范不允许我们使用调试用的`console.log`语句，将会报出以下错误：

```bash
7:1  warning  Unexpected console statement  no-console
```

我们可以设置`eslint`不检查`console.log`这一句来避免这一问题，需使用`// eslint-disable-next-line`注释：：

```js
// eslint-disable-next-line
console.log(add(2, 3));
```



### JavaScript 兼容性处理

箭头函数、`Promise`亦或是`async/await`语法，这些元素都是在`es6`及其以上的版本才支持的，然而一些版本较低的浏览器并不支持高版本的js语法，所以我们需要对我们所写的高级语法进行兼容处理（生产环境需要考虑大部分用户）。

对js进行处理的loader为`babel-loader`，需要下载的包有：

```bash
babel-loader @babel/core @babel/preset-env
```

兼容性处理有三种手段：

**1. 基本js兼容性处理** 使用`@babel/preset-env` （只能转化基本语法，如Promise不能转换）

**2. 全部js兼容性处理** 使用`@babel/polyfill`（我们只需要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大）

**3. 需要做兼容性处理就做，按需加载** 使用`core-js`

下面的用法为`@babel/preset-env`和`core-js`结合。

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    // 预设：指示babel做怎样的兼容性处理
    presets: [
      [
        '@babel/preset-env',
        {
          // 按需加载
          useBuiltIns: 'usage',
          // 指定core-js版本
          corejs: {
            version: 3
          },
          // 指定兼容性做到哪个版本的浏览器
          targets: {
            chrome: '60',
            firefox: '60',
            ie: '9',
            safari: '10',
            edge: '17'
          }
        }
      ]
    ]
  }
}
```

还有一点需要注意的是，`babel-loader`的使用一定是在`eslint`语法检查之后的。



### JavaScript 压缩

生产环境下（`mode: 'production' `）webpack会自动应用`TerserPlugin`插件，这一插件会自动进行js代码的压缩工作。



### HTML 压缩

视频中使用`HtmlWebpackPlugin`插件来进行html代码的压缩，这一插件不止可以生成html，也可以通过设置压缩html代码：

```js
new HtmlWebpackPlugin({
  template: './src/index.html',
  minify: {
    // 移除空格
    collapseWhitespace: true,
    // 移除注释
    removeComments: true
  }
})
```

不过这并不是压缩html代码的唯一途径，通过[官网](https://webpack.docschina.org/loaders/html-loader/)可以看到，`html-loader`也可以实现html代码的压缩。在前文的学习中，我们仅仅是使用这一loader引入html中的图片以配合`url-loader`。但是我们可以通过配置`html-loader`的选项实现html代码的压缩：

```js
{
  test: /\.html$/,
  loader: 'html-loader',
  options: {
    minimize: true
  }
}
```

使用这一方式实现的压缩同样会移除空格和注释。



## 优化配置（开发环境/生产环境）

性能优化有开发环境优化和生产环境优化两部分，这两部分的优化目标是不同的。

**开发环境性能优化：**

- 优化打包构建速度
  - HMR
- 优化代码调试
  - source-map

**生产环境性能优化**

- 优化打包构建速度

  - oneOf

  - babel缓存

  - 多进程打包

  - externals

  - dll

- 优化代码运行的性能

    - 文件资源缓存(hash - chunkhash - contenthash)
    - tree shaking 
    - code split
    - 懒加载 / 预加载
    - PWA

### 开发环境性能优化

#### HMR

HMR（Hot Module Replacement）热模块替换的作用是：当一个模块发生变化的时候，只会重新打包这一个模块，而不是打包所有模块，极大提升构建速度。（注意热模块替换不是热更新）

启用HMR需要修改`devServer`配置，将`hot`属性设置为`true`：

```js
devServer: {
  contentBase: resolve(__dirname, 'build'),
  compress: true,
  port: 4000,
  open: true,
  // 开启HMR功能
  // 注意：新配置若要生效，必需重启webpack服务
  hot: true
}
```



这里考虑三种资源的HMR：

- **CSS文件：** 可以使用HMR功能，因为`style-loader`内部已经实现了

- **JavaScript文件：** 默认不能使用HMR功能，需要修改js代码以添加HMR功能。

  在示例中，我们在入口文件`index.js`中引入了另一个模块`print.js`，为了对`print.js`模块实现HMR，我们需添加如下语句：

  ```js
  if (module.hot) {
      // 一旦module为true，说明开启HMR功能 --> 让HMR功能生效
      module.hot.accept('./print.js', () => {
          // 方法会监听 print.js 文件的变化，一旦发生变化，其他默认不会打包构建，
          // 会执行后面的回调函数
          print();
      })
  }
  ```

  > **注意：**HMR对js的处理，只能处理非入口js文件的其他文件（入口文件修改了，还是要重新打包所有文件）

- **HTML文件：** 默认不能使用HMR功能，并且使用HMR会导致html文件无法热更新了。（其实html文件不需要HMR，因为一般都是只有一个html文件）

  解决html文件无法HMR：修改`entry`入口，将html文件也加入

  ```js
  entry: ['./src/js/index.js', './src/index.html']
  ```



#### source-map

`source-map`是一种提供源代码到构建后代码映射技术（如果构建后代码出错了，通过映射关系，可以追踪到源代码的错误）。详细信息最好查看[官网文档](https://webpack.docschina.org/configuration/devtool/#root)。

使用`source-map`需要在module.exports内添加新条目：

```js
devtool: '[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map'
```

各种`source-map`的特点总结：

| 名称                      | 位置 | 提供的信息                                                   |
| ------------------------- | ---- | ------------------------------------------------------------ |
| source-map                | 外部 | 错误代码准确信息 和 源代码的错误位置                         |
| inline-source-map         | 内联 | 错误代码准确信息 和 源代码的错误位置                         |
| hidden-source-map         | 外部 | 代码错误原因，但是只能提示到构建后代码位置                   |
| eval-source-map           | 内联 | 错误代码准确信息 和 源代码的错误位置                         |
| nosources-source-map      | 外部 | 错误代码准确信息 但是没有任何源代码信息                      |
| cheap-(module-)source-map | 外部 | 错误代码准确信息 和 源代码的错误位置（但是只能精确到行 而不是列）<br>`module`的作用是会加入loader 的source map。 |

外部和内联的区别：

- 外部是生成一个source map文件（形如`build.js.map`）
- 内联是将source map内容存储在js源码中。`inline`和`eval`虽然都是内联，但是`eval`的模块都在`eval()`中。

内联source map的构建速度是快于外部文件的，此外，根据官网的对比，`eval`是比`inline`重新构建的速度要快的。



教程中给出了一些source map推荐：

**开发环境**：需要考虑速度快，调试更友好

- 速度快( eval > inline > cheap >... )

  - eval-cheap-souce-map

  - eval-source-map

- 调试更友好

  - souce-map

  - cheap-module-souce-map

  - cheap-souce-map

**最终得出最好的两种方案：** 

- eval-source-map（完整度高，内联速度快）

  > vue和react脚手架默认使用 eval-source-map

- eval-cheap-module-souce-map（错误提示忽略列但是包含其他信息，内联速度快）

**生产环境**：需要考虑源代码要不要隐藏，调试要不要更友好

- 内联会让代码体积变大，所以在生产环境不用内联
- 隐藏源代码
  1. nosources-source-map 全部隐藏
  2. hidden-source-map 只隐藏源代码，会提示构建后代码错误信息

**最终得出最好的两种方案：**

- source-map（最完整）
- cheap-module-souce-map（错误提示一整行忽略列）



### 生产环境性能优化

#### oneOf

正常情况下，一种文件只会被一种（一系列）loader处理，使用oneOf可以让loader匹配过程无需遍历整个rules数组，从而提高匹配速度。

如果同一种文件需要执行两种loader，可以使用`enforce: 'pre'`指定优先执行

```js
rules: [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    // 优先执行
    enforce: 'pre',
    loader: 'eslint-loader',
    options: {
      fix: true
    }
  }
  {
    oneOf: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }
      ...
    ]
  }
]
```



#### 缓存

**1. babel 缓存**

babel进行js兼容性处理其实是相当耗时的一项工作，这时使用缓存就可以大大提升重新打包的速度。开启缓存的方法是向babel的options中添加`cacheDirectory: true`。这样babel会将处理后的js缓存起来，js代码的哪里改变了，就重新处理改变的这一段，从而提升二次打包速度。

**2. 文件资源缓存**

**文件名不变，就不会重新请求，而是再次用之前缓存的资源。** 

视频教程中介绍了三种hash：

- **hash：** 每次webpack构建打包生成唯一哈希值

  **问题：** 因为js和css同时使用一个哈希值，如果重新打包，会导致所有缓存失效。（可能我们却只改动了一个文件）

- **chunkhash：** 根据chunk生成hash值，如果打包来源于同一个chunk，那么hash值就一样

  **问题：** js和css的hash值还是一样

- **contenthash：** 根据文件内容生成hash值，不同文件的hash值不同

为了分别缓存每个文件，我们选择使用`contenthash`；因为哈希值的前10位基本已经能唯一标识一个文件了，所以在文件名中只需使用`[contenthash:10]`。

- js文件（output）：

  ```js
  output: {
    filename: 'js/build.[contenthash:10].js',
    path: resolve(__dirname, 'build')
  }
  ```

- css文件（`MiniCssExtractPlugin`插件）

  ```js
  new MiniCssExtractPlugin({
    filename: 'css/build.[contenthash:10].css'
  })
  ```

> 有服务端的时候才能体现文件资源缓存的作用，所以教程中使用了一个简单的express服务端。



#### tree shaking

tree shaking的直译是摇树，这样就可以把树上枯萎的叶子摇晃掉。在打包构建的时候，使用tree shaking可以去除没有使用到的代码（dead code），从而减小代码体积。

做到后面两点就可以使用tree shaking：**1. 使用ES6模块化 2. 开启`production`环境（`mode: 'production'`）**

举例：`math.js`向外暴露了两个函数`func1`和`func2`，我们在`index.js`中引入了`math.js`中的`func1`，而`func2`从来没有被使用过，那么在最终被输出的bundle中就不会包含`func2`相关的代码。

前面提到tree shaking需要在ES6模块化的条件下使用，但是我们的项目可能并不是纯ES6模块化的，所以，我们可能需要使用`package.json`中的`sideEffects`属性提示webpack complier，官方文档描述如下：

>在一个纯粹的 ESM 模块世界中，很容易识别出哪些文件有 side effect。然而，我们的项目无法达到这种纯度，所以，此时有必要提示 webpack compiler 哪些代码是“纯粹部分”。
>
>通过 package.json 的 `"sideEffects"` 属性，来实现这种方式。
>
>```json
>{
>  "name": "your-project",
>  "sideEffects": false
>}
>```
>
>如果所有代码都不包含 side effect，我们就可以简单地将该属性标记为 `false`，来告知 webpack，它可以安全地删除未用到的 export。

如果有的代码确实有一些副作用，我们可以将`sideEffects`设置为一个数组，如：

```js
"sideEffects": [
  "./src/some-side-effectful-file.js"
]
```

教程中提到对于某些版本的webpack，设置`sideEffects`可能会导致css / @babel/polyfill文件被清除，但是我目前没有遇到这一问题。



#### code split

之前的打包工作都是只有一个chunk，打包后输出一个bundle。其实我们可以使用一些方法让bundle分割成几个更小的文件，便于并行加载，减少加载时间。

**方法一：多入口打包**

`entry`的内容也可以是一个对象，用来指定多个入口文件，同时为每个入口指定名称（之前只有一个入口的时候名称默认为'main'）：

```js
entry: {
  main: './src/js/index.js',
  test: './src/js/test.js'
},
output: {
  // [name]：文件名（entry中的入口名称 ）main、test
  filename: 'js/[name].[contenthash:10].js',
  path: resolve(__dirname, 'build')
},
```

打包之后输出的信息为：

```bash
Built at: 2020-09-13 14:46:20
                Asset        Size  Chunks                         Chunk Names
           index.html   285 bytes          [emitted]              
js/main.e68ef89e6d.js  1020 bytes       0  [emitted] [immutable]  main
js/test.5f4037a072.js    1.05 KiB       1  [emitted] [immutable]  test
Entrypoint main = js/main.e68ef89e6d.js
Entrypoint test = js/test.5f4037a072.js
[0] ./src/js/index.js 184 bytes {0} [built]
[1] ./src/js/test.js 94 bytes {1} [built]
```

可以看到打包后输出了两个文件：`main.e68ef89e6d.js`和`test.5f4037a072.js`。

多入口打包一般用于多页应用，而我们目前使用单页面应用较多，所以这种方式并不常用。

**方法二：splitChunks**

需要在`webpack.config.js`中设置：

```js
optimization: {
  splitChunks: {
    chunks: 'all'
  }
},
```

作用：

- 可以将`node_nodules`中的代码（大小超过30kb）单独打包成一个chunk最终输出，将自己的代码和第三方代码分离（单、多入口皆适用）

  分割的chunk最小为30Kb是因为`splitChunks`中的`minSize`属性默认值为：

  ```js
  minSize: 30 * 1024
  ```

- 自动分析多入口chunk中，有没有公共文件，如果有，会打包成单独的一个chunk

在示例代码中，我们在`main.js`引入了第三方库`jquery`，打包后就会输出两个文件`main.e909d46c46.js`和`vendors~main.17b2d7e07c.js`，后者是分离后的`jquery`代码。

**方法三：splitChunks + import函数**

方法二中只能单独打包第三方库，如果还需要让某个文件单独打包成一个chunk，则可以使用js中的import动态导入语法实现这一目的。

import动态导入语法能将某个文件单独打包，默认打包后生成的文件名是chunk的id，也可以在import函数中传入参数自定义输出名。下面是在`main.js`中使用import动态导入`test.js`并设置chunk name的示例：

```js
import(/* webpackChunkName: 'test' */'./test')
  .then(({ mul, count }) => {
    console.log('文件加载成功');
    // eslint-disable-next-line
    console.log(mul(2, 3));
    console.log(count(2, 3)); 
  })
  .catch(() => {
    // eslint-disable-next-line
    console.log('文件加载失败')
  })
```

打包后生成`main.c5581566bd.js`和`test.a5419b5143.js`。如果不设置chunk name，`test.js`打包输出的文件名则为`1.a5419b5143.js`。



#### lazy loading / prefetch

**正常加载**可以认为是并行加载（同一时间加载多个文件）没有先后顺序，先加载了不需要的资源就会浪费时间。

**懒加载（lazy loading）**是指引入的模块只有在需要使用的时候才会加载。但是如果资源较大，加载时间就会较长，有延迟。

**预加载（prefetch）**的资源会等其他资源加载完毕，浏览器空闲时，才会加载资源。（预加载兼容性较差）

代码示例：

```js
document.getElementById('btn').onclick = function() {
  // 将import的内容放在异步回调函数中使用，点击按钮，test.js才会被加载(不会重复加载)
  // webpackPrefetch: true表示开启预加载
  import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test').then(({ mul }) => {
    console.log(mul(4, 5));
  });
  import('./test').then(({ mul }) => {
    console.log(mul(2, 5))
  })
};
```



#### PWA

PWA（Progressive Web Application）渐进式网络开发应用程序，其实就是离线可访问技术。需要用到插件`WorkboxWebpackPlugin`。

在`webpack.config.js`的`plugins`中添加：

```js
new WorkboxWebpackPlugin.GenerateSW({
  /*
    1. 帮助serviceworker快速启动
    2. 删除旧的 serviceworker

    生成一个 serviceworker 配置文件
  */
  clientsClaim: true,
  skipWaiting: true
})
```

在`index.js`中添加代码注册`serviceWorker`

```js
/*
  1. eslint不认识 window、navigator全局变量
    解决：需要修改package.json中eslintConfig配置
    "env": {
      "browser": true // 支持浏览器端全局变量
    }
  2. sw代码必须运行在服务器上
    --> nodejs
    或-->
      npm i serve -g
      serve -s build 启动服务器，将打包输出的build目录下所有资源作为静态资源暴露出去
*/
if ('serviceWorker' in navigator) { // 处理兼容性问题
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js') // 注册serviceWorker
      .then(() => {
        console.log('sw注册成功了~');
      })
      .catch(() => {
        console.log('sw注册失败了~');
      });
  });
}
```



#### 多进程打包

一些打包工作很复杂，所以需要相对较长的时间，一个很典型的例子是使用babel进行js代码的兼容性处理。使用多进程打包可以提高打包速度。多进程打包的功能由`thread-loader`提供。

> thread应该被翻译为线程，可是官方文档确说打包使用的是多个node进程

`thread-loader`应该放在需要多进程运行的loader前面，下面为`thread-loader`作用于`babel-loader`的示例：

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: [
     /* 
     * 启动的线程数默认为：CPU核数 - 1
     * 可以使用options中的workers属性自定义线程数
     */
    {
      loader: 'thread-loader',
      options: {
        workers: 2
      }
    },
    {
      loader: 'babel-loader',
      options: {
        ...
      }
    }
  ]
```

每启动一个进程就需要耗时越600ms，再加上进程间通信的时间，使用多进程本身会带来不小的开销，所以不耗时的工作使用`thread-loader`是得不偿失的。



#### externals

上线的时候很多库可以使用cdn的方式引入，这时我们就不需要将本地的第三方库打包了。

例如，在`index.html`中，使用cdn引入了`jquery`：

```html
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
```

在`webpack.config.js`中使用`externals`属性阻止本地的`jquery`库打包进来：

```js
externals: {
  // 拒绝jQuery被打包进来
  jquery: 'jQuery',
}
```

这里字符串`'jQuery'`的含义我自己不是很理解，官网上的说明是：

> 请查看上面的例子。属性名称是 `jquery`，表示应该排除 `import $ from 'jquery'` 中的 `jquery` 模块。为了替换这个模块，`jQuery` 的值将被用来检索一个全局的 `jQuery` 变量。换句话说，当设置为一个字符串时，它将被视为`全局的`（定义在上面和下面）。

我的理解是之所以使用`jQuery`，是因为有全局的`window.jQuery`变量（推测）。

具体说明可以看[官方文档](https://webpack.docschina.org/configuration/externals/#root)。



#### dll

单独打包第三方库，可以让这些库不用每次都被打包一次。可以与code split

首先，我们需要一个新的webpack配置文件用于第三方库的打包，这里将该文件命名为`webpack.dll.js`。

打包第三方库有两个主要步骤：

1. 输出打包后的第三方库，并指明向外暴露的名字（在output中实现）
2. 生成`manifest.json`文件，映射第三方库暴露的名称（使用`webpack.DllPlugin`插件）

```js webpack.dll.js
const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    // 最终打包生成的[name] --> jquery
    // ['jquery'] --> 要打包的库是jquery
    jquery: ['jquery'],
  },
  output: {
    filename: '[name].js', // jquery.js
    path: resolve(__dirname, 'dll'),
    library: '[name]_[hash:10]', // 打包的库里面向外暴露出去的内容叫什么名字
  },
  plugins: [
    // 打包生成一个 manifest.json --> 提供和jquery的映射
    new webpack.DllPlugin({
      name: '[name]_[hash:10]', // 映射库的暴露的内容名称
      path: resolve(__dirname, 'dll/manifest.json'), // 输出文件路径
    }),
  ],
  mode: 'production'
};
```

由于`webpack`命令会默认使用`webpack.config.js`文件，为了使用上面的配置，需要：

```bash
webpack --config webpack.dll.js
```



单独打包第三方库之后在`webpack.config.js`中：

```js
const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'build.js',
        path: resolve(__dirname, 'build')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        // 告诉webpack哪些库不参与打包，同时使用名称也得变
        new webpack.DllReferencePlugin({
            manifest: resolve(__dirname, 'dll/manifest.json')
        }),
        // 将某个文件打包输出出去，并在html中自动引入该文件
        // ps: 其实在html中手动引入js也可以，但是没有这种自动引入的方式方便
        new AddAssetHtmlWebpackPlugin({
            filepath: resolve(__dirname, 'dll/jquery.js')
        })
    ],
    mode: 'production'
}
```

也是两个步骤：

1. 告诉webpack不需要打包哪个第三方库（插件`webpack.DllReferencePlugin`）
2. 将dll处理生成的第三方包打包输出，并在html中自动引入（插件`AddAssetHtmlWebpackPlugin`）

将dll总结一下就是吧第三方库单独拿出来打包后放在一个目录下，然后在打包源码的时候只需取这个目录下打好包的第三方库。



## webpack配置详解

下面是对某些属性设置的汇总，包括`entry`，`output`，`module`，`resolve`，`devServer`，`optimization`。

### entry

`entry`是webpack打包的入口，也是chunk形成的的地方。

`entry`的参数可以有以下几种：

1. **string** → `'./src/index.js'`，单入口

   打包形成一个 chunk。 输出一个 bundle 文件。此时 chunk 的名称默认是 main

2. **array** → `['./src/index.js', './src/add.js']`，多入口

   所有入口文件最终只会形成一个 chunk，输出出去只有一个 bundle 文件。

   （一般只用在 HMR 功能中让 html 热更新生效）

3. **object** → 多入口

   ```js
   entry: {
     index: './src/index.js',
     add: './src/add.js'
   }
   ```

   有几个入口文件就形成几个 chunk，输出几个 bundle 文件，此时 chunk 的名称是 key 值



### output

```js
output: {
  // 文件名称：指定名称 + 目录
  filename: 'js/[name].js',
  // 输出文件目录（将来所有资源输出的公共目录）
  path: resolve(__dirname, 'build'),
  // 所有资源引入的公共路径前缀：'images/a.jpg' → '/images/a.jpg
  // 若使用下一行的配置，html文件中引入js的路径则为 '/js/index.js'
  // 一般用于生产环境
  // publicPath: '/'

  // 非入口chunk的名称
  // 例1：通过import()函数的方式单独打包的chunk
  // 例2：通过optimization 将 node_modules 中的模块单独作为chunk
  // 这里的 [name] 其实是id命名
  chunkFilename: 'js/[name]_chunk.js',

  // 整个库向外暴露的变量名 （常配合dll使用）
  // library: '[name]',
  // 变量名添加到什么上
  // libraryTarget: 'window', // browser
  // libraryTarget: 'global', // node
  // libraryTarget: 'commonjs'
}
```



### module

```js
module: {
  rules: [
    // loader配置
    {
      test: /\.css$/,
      // 多个loader用use
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.js$/,
      
      // 排除node_modules下的js文件
      exclude: /node_modules/,
      
      // 只检查src下的js文件
      include: resolve(__dirname, 'src'),

      // 优先执行
      ecforce: 'pre',
      // 延后执行
      // enforce: 'post',

      // 单个loader用loader
      loader: 'eslint-loader',
      options: {}
    },
    {
      // 以下配置只会生效一个
      oneOf: [

      ]
    }
  ]
}
```



### resolve

```js
// 解析模块的规则 
resolve: {
  // 配置解析模块的路径别名: 优点 简写路径，缺点 路径没有提示
  alias: {
    $css: resolve(__dirname, 'src/css')
  },

  // 配置省略文件路径后缀名（这种写法需要注意文件重名问题）
  extensions: ['.js', '.json', '.css','jsx'], // 默认值为 ['.js', '.json']

  // 告诉 webpack 解析模块是去找哪个目录
  modules: [resolve(__dirname, '../../node_modules'), 'node_modules'] // 默认为['node_modules']
}
```

vue脚手架默认使用`@`表示`src`就是使用reslove中的alias实现的。



### devServer

```js
// 用于开发环境
devServer: {
  // 运行代码的目录
  contentBase: resolve(__dirname, 'build'),
  // 监视 contentBase 目录下的所有文件，一旦文件发生变化就会 reload
  watchContentBase: true,
  watchOptions: {
    // 忽略文件
    ignored: /node_modules/
  },
  // 启动gzip压缩
  compress: true,
  // 端口号
  port: 4000,
  // 域名
  host: 'localhost',
  // 自动打开浏览器
  open: true,
  // 开启HMR功能
  hot: true,
  // 不显示启动服务器日志信息
  clientLogLevel: 'none',
  // 除了一些基本的启动信息以外，其他内容都不要显示
  quiet: true,
  // 如果出现错误，不要全屏提示
  overlay: false,
  // 服务器代理 --> 解决开发环境跨域问题
  proxy: {
    // 一旦devServer(4000)服务器接收到 /api/xxx 的请求，就会把请求转发到另外一个服务器(8080)
    '/api': {
      target: 'http://localhost:8080',
      // 发送请求时，请求路径重写： /api/xxx -> /xxx  （去掉/api）
      pathRewrite: {
        '^api': ''
      }
    }
  }
}
```

跨域问题：同源策略中不同的协议、端口号、域名会产生跨域。但服务器之间没有跨域。

生产环境下不会有跨域问题，但是开发的时候会有。



### optimization

```js
optimization: {
  splitChunks: {
    chunks: 'all',
    // 默认值，可以不写，一般不用修改
    /*minSize: 30 * 1024, // 分割的chunk最小为30KB
    maxSize: 0, // 最大没有限制
    minChunks: 1, // 要提取的chunks最少被引用1次，
    maxAsyncRequests: 5, // 按需加载的时候并行加载的文件的最大数量
    maxInitialRequests: 3, // 入口js文件最大并行请求数量
    automaticNameDelimiter: '~', // 名称连接符
    name: true, // 可以使用命名规则
    cacheGroup: { // 分割chunk的组
      // node_modules中的文件会被打包到 vendors 的chunk中 --> vendors~xxx.js
      // 满足上面的公共规则，如：大小超过30KB，至少被引用一次
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        // 优先级
        priority: -10
      },
      default: { // 默认组
        // 要提取的chunks最少被引用2次（覆盖掉上面的minChunks的值）
        minChunks: 2,
        priority: -20,
        // 如果当前要打包的模块，和之前已经被提取的模块是同一个，就会复用，而不是重新打包模块
        reuseExistingChunk: true
      }
    }
  } */
  },
  // 由于前面的chunkFilename使用了contenthash，所以a.js更改时其文件名会改变。因为index.js中引入了a.js文件，所以打包后的
  // index.js中记录了a.js的contenthash，因此a.js的改变会致使index.js的重新打包，
  // 为了避免这种情况，我们需要将index.js记录其它模块的部分单独打包

  // 将当前模块的记录其他模块的hash单独打包为一个文件 runtime
  runtimeChunk: {
    name: entrypoint => `runtime-${entrypoint.name}`
  },
  minimizer: [
    // 配置生产环境的压缩方案：js和css
    // webpack版本升级到4.26以上时，压缩js就是不用uglifyjs而是terser了
    new TerserWebpackPlugin({
      cache: true, // 开启缓存
      parallel: true, // 开启多进程打包
      sourceMap: true, // 启用source-map
    })
  ]
}
```



## webpack 5的使用

当前（2020-09-23）webpack最新的稳定版本还是`4.44.1`，webpack 5.0依然只有beta版本。官方release日志：[release](https://github.com/webpack/webpack/releases)

下载命令：

```bash
npm install webpack@next webpack-cli -D
```

webpack 5的变化：

- **自动删除 Node.js Polyfills**

  webpack 的目标是允许在浏览器中运行大多数 node.js 模块，但是模块格局发生了变化，许多模块用途现在主要是为前端目的而编写的。webpack <= 4 附带了许多 node.js 核心模块的 polyfill，一旦模块使用任何核心模块（即 crypto 模块），这些模块就会自动应用。webpack 5 会自动停止填充这些核心模块，并专注于与前端兼容的模块。

- **Chunk ID**

  你可以不用使用 `import(/* webpackChunkName: "name" */ "module")` 在开发环境来为 chunk 命名，生产环境还是有必要的

  webpack 内部有 chunk 命名规则，不再是以 id(0, 1, 2)命名了

- **Tree Shaking**

  1. 可以对嵌套的模块进行tree shaking（webpack 5之前是不可以的）

     ```js
     // inner.js
     export const a = 1;
     export const b = 2;
     
     // module.js
     import * as inner from './inner';
     export { inner };
     
     // user.js
     import * as module from './module';
     console.log(module.inner.a);
     ```

     在生产环境中, `inner` 模块暴露的 `b` 会被删除

  2. webpack 现在能够多个模块之前的关系

     ```js
     import { something } from './something';
     
     function usingSomething() {
       return something;
     }
     
     export function test() {
       return usingSomething();
     }
     ```

     当设置了`"sideEffects": false`时，一旦发现`test`方法没有使用，不但删除`test`，还会删除`"./something"`

  3. webpack 现在能处理对 Commonjs 的 tree shaking

- **output**

  webpack 4 默认只能输出 ES5 代码

  webpack 5 开始新增一个属性 `output.ecmaVersion`, 可以生成 ES5 和 ES6 代码。

- **SplitChunk**

  可以针对不同种类的文件规定`minSize`的大小：

  ```js
  // webpack 4
  minSize: 30000;
  // webpack 5
  minSize: {
    javascript: 30000,
    style: 50000,
  }
  ```

- **Cache**

  ```js
  // 配置缓存
  cache: {
    // 磁盘存储
    type: "filesystem",
    buildDependencies: {
      // 当配置修改时，缓存失效
      config: [__filename]
    }
  }
  ```

  缓存将存储到 `node_modules/.cache/webpack`

- **监视输出文件**

  之前 webpack 总是在第一次构建时输出全部文件，但是监视重新构建时会只更新修改的文件。

  此次更新在第一次构建时会找到输出文件看是否有变化，从而决定要不要输出全部文件。

- **默认值**
  - `entry: "./src/index.js`
  - `output.path: path.resolve(__dirname, "dist")`
  - `output.filename: "[name].js"`



## 参考

- 本文是对bilibili上[尚硅谷2020最新版Webpack5实战教程(从入门到精通)](https://www.bilibili.com/video/BV1e7411j7T5)课程的学习笔记
- [webpack中文文档](https://www.webpackjs.com/concepts/)
- 有关代码放在了gitee上：[bqh / learn-webpack](https://gitee.com/banqinghe/learn-webpack)

