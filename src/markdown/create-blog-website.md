# 使用 create-react-app 构建静态博客

之前一直使用 hexo，也换了几个主题玩，但是 hexo 的主题都是用 ejs 写的，我并不太想学这个东西，所以自定义博客感觉挺麻烦的，于是想试试自己搭一个静态网页玩一玩。

网站使用的框架是 [React](https://reactjs.org/)，因为实习的时候一直在用这个，熟悉一点。脚手架使用 [create-react-app](https://github.com/facebook/create-react-app)，因为除了公司内部使用的我只知道这一个（真滴捞）。

仓库地址在 https://github.com/banqinghe/banqinghe.github.io

## 网站结构

create-react-app 是支持 markdown 模块化的，也就意味着可以直接 import 进来，然后 `fetch` 到其中的文本。

我的基本想法是通过路由的 pathname 获取到 markdown 文件名，然后使用动态引入函数 `import()` 引入模块，获取路径，然后 `fetch` 到文本。但是事与愿违，`import()` 只能引入 JavaScript 文件，于是需要加一层中介。

于是引入了一个 `adapter.js` 文件，文件里只做一件事，就是把 markdown 文件引入然后导出模块。为了方便规定文件名短横线命名，模块名则是大驼峰。

```javascript
export { default as ReactMarkdownTest } from '../markdown/react-markdown-test.md';
export { default as VueNative } from '../markdown/vue-native.md';
...
```

然后需要博文的地方动态引入这个 adapter 就可以了，moduleName 其实就是通过 pathname 得到的：

```javascript
import('../../../../config/adapter.js')
  .then(module => {
    fetch(module[moduleName])
      .then(res => {
        onClear();
        if (!/\.md$/.test(res.url)) {
          throw new Error('no content');
        }
        document.title = getTitle(pathname);
        return res.text();
      })
      .then(setMarkdown)
      .catch(err => {
        console.error(err);
        setMarkdown('# 404 Not Found');
      });
  });
```

## markdown 渲染

[react-markdown](https://github.com/remarkjs/react-markdown) 这个库提供了将 markdown 文本转化为 React 组件的能力，配合插件也支持 LaTex 公式/markdown 内 html（虽说嵌入 html 代码不是一个安全的行为，但是我认为作为前端博客还是很有必要的）。

目前博客 markdown 的主题是 [github-markdown-css](https://github.com/sindresorhus/github-markdown-css)，视觉效果和 GitHub 中的 markdown 相同。后续可以考虑自己重做，就是感觉有点麻烦。

[react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) 提供了很不错的代码高亮方案，也有不少高亮主题可供选择，可惜并没有一个让我很满意的。最后选择了 `vs`，主要原因是配色不错，接近我平时使用的 vscode 浅色主题，但是字体显示不太好看，并且和 markdown 主题出现了一些冲突。

研究了一下发现可以在主题传入组件之前先修改 style，可以修改字体、设置代码块背景色：

```javascript
code({node, inline, className, children, ...props}) {
  vs['code[class*="language-"]'].fontFamily = "Menlo, \"Consolas\", \"Bitstream Vera Sans Mono\", \"Courier New\", Courier, monospace";
  vs['code[class*="language-"]'].lineHeight = "20px";
  vs['pre[class*="language-"]'].border = "";
  vs['pre[class*="language-"]'].backgroundColor = "#1b1f2300";
  const match = /language-(\w+)/.exec(className || '')
  return !inline && match ? (
    <SyntaxHighlighter language={match[1]} style={vs} PreTag="div" children={String(children).replace(/\n$/, '')} {...props} />
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  )
}
```

效果还是很不错的。



## 目录问题

目录问题是最难搞的了，主要是遇到了一个奇奇怪怪的问题，花费了不少时间，并且没有解决。

既然要获取目录，简单的方法肯定是获取每个 h 打头的标签，然后将信息传递出去。react-markdown 提供了 components 接口，可以通过标签同名方法对标签做处理，在这里将目录信息（标题级别、内容）传递给父组件就很不错，于是：

```javascript
const submitHeading = useCallback(({ level, children }) => {
  if (level === 1) {
    levelCounter.current.fill(0);
  }
  levelCounter.current[level]++;
  const id = `${level}-${levelCounter.current[level]}`;
  onDirChange({id, content: children});
  return React.createElement(`h${level}`, { id }, children);
}, [onDirChange]);

const components = useMemo(() => ({
  code({node, inline, className, children, ...props}) {
		...
  },
  h1: submitHeading,
  h2: submitHeading,
  h3: submitHeading,
  h4: submitHeading,
  h5: submitHeading,
  h6: submitHeading,
}), [submitHeading]);
```

一个很诡异的事情是，每次这个 `submitHeading` 都会被一下执行两次，然后目录里就会接收到两个文本一样的目录项，博文本身的 id 也不连续。找了半天都没找到啥原因。

结果发现 build 之后再跑这个问题竟然就消失了，函数不再莫名其妙执行两次了……也是够离谱的，但是在本地 `yarn start` 的时候还是无法避免，会出现列表使用相同 key 的报错信息污染控制台。

但是不耽误部署结果所以暂时不管了，折磨。

## 部署

部署采用的 create-react-app 官方提供的方法，使用 [gh-pages](https://github.com/tschaub/gh-pages) 部署到 Github Page 上，一个命令搞定，还是很方便的。

部署的时候发现 markdown 并不能成功加载，看了下 create-react-app 的文档说是 Github Page 不支持 history 路由，无奈改成了 hash 路由的方式，成功跑起来了。

现在可以在 [banqinghe.github.io](https://banqinghe.github.io) 访问到。

## 命令行

使用 node 的 `readline` 和 `commander` 模块做了个 cli 工具，目前只支持博客创建，不过暂时感觉也足够了，毕竟我之前用 hexo 的时候除了部署和预览也基本只用这一个功能。
