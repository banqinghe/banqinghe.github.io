# HTML笔记(1) 文档和多媒体

这里是MDN网站上HTML入门教程的学习笔记，MDN上的教程讲的比我看到的其他网站上都要详细且更加新鲜（使用HTML5规范和习惯）。HTML不难，是舍友所说的“有手能写”系列的语言，但是痛点是确实有点琐碎，我觉得记录下来可能印象会深一点。因为我现在抱有一点“速成”的想法，所以教程中的一些地方对我来说确实有点详细太过，所以笔记记得也比较粗略，估计也会有不少错误。

我所参阅的教程：[学习 HTML ：指南与教程](https://developer.mozilla.org/zh-CN/docs/Learn/HTML)



## 基本知识

### 元素

在HTML中有两种你需要知道的重要元素类别，**块级元素**和**内联元素**。

- 块级元素在页面中以块的形式展现 —— 相对于其前面的内容它会出现在新的一行，其后的内容也会被挤到下一行展现。块级元素通常用于展示页面上结构化的内容，例如段落、列表、导航菜单、页脚等等。一个以block形式展现的块级元素不会被嵌套进内联元素中，但可以嵌套在其它块级元素中。
- 内联元素通常出现在块级元素中并环绕文档内容的一小部分，而不是一整个段落或者一组内容。内联元素不会导致文本换行：它通常出现在一堆文字之间例如超链接元素`<a>`或者强调元素`<em>`和`<strong>`



### 布尔属性

布尔属性，他们只能有跟它的属性名一样的属性值。例如`disabled` 属性，他们可以标记表单输入使之变为不可用(变灰色)，此时用户不能向他们输入任何数据。

```html
<input type="text" disabled>
或
<input type="text" disabled="disabled">
```



### 关于空格

无论你用了多少空白(包括空白字符，包括换行), 当渲染这些代码的时候，HTML解释器会将连续出现的空白字符减少为一个单独的空格符。



### 实体引用

在HTML中，字符 `<`, `>`,`"`,`'` 和 `&` 是特殊字符. 它们是HTML语法自身的一部分，如果想在文本中使用它们，必须使用实体引用：

| 原义字符 | 等价字符引用 |
| :------- | :----------- |
| <        | \&lt;        |
| >        | \&gt;        |
| "        | \&quot;      |
| '        | \&apos;      |
| &        | \&amp;       |



## HTML头部

### title

设置页面的名称：

```html
<title>bqh的测试</title>
```

### 元数据：\<meta>元素

元数据即为关于数据的数据。

1. 指定字符编码：

   ```html
   <meta charset="utf-8">
   ```

2. 添加作者和描述

   ```html
   <meta name="author" content="Chris Mills">
   <meta name="description" content="The MDN Learning Area aims to provide complete beginners to the Web with all they need to know to get started with developing web sites and applications.">
   ```

   description也被使用在搜索引擎显示的结果页中。

3. 有的网站有自己专有的元数据协议，可以让用户拥有更好的体验。

### 站点的自定义图标

```html
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
```

图标也可以是`.png`，`.gif`，但`.ico`类型可以让更古老的浏览器使用（IE6）

### 应用CSS和JavaScript

`rel="stylesheet"`表明这是文档的样式表，而 `href`包含了样式表文件的路径

```html
<link rel="stylesheet" href="my-css-file.css">
```

`<script>`一般放在`<\body>`之前，确保在加载脚本之前浏览器已经解析了HTML内容（如果脚本加载某个不存在的元素，浏览器会报错）。

```html
<script src="my-js-file.js"></script>
```



### 设置主语言

```html
<html lang="en-US">
```

为某一部分设置语言：

```html
<p>Japanese example: <span lang="jp">ご飯が熱い。</span>.</p>

```



## 重点强调

### \<em>：强调

`<em>`和`<i>`都对字体做斜体表示，但是语义不同。

`<em>` 标签表示其内容的着重强调，而 `<i>` 标签表示从正常散文中区分出的文本，例如外来词，虚构人物的思想，或者当文本指的是一个词语的定义，而不是其语义含义。（作品的标题，例如书籍或电影的名字，应该使用 `<cite>`。）

### \<strong>：非常重要

在HTML中我们用`<strong>`(strong importance) 元素来标记这样的请况。这样做既可以让文档更加地有用，也可以被屏幕阅读器识别出来，并以不同的语调发出。浏览器默认风格为粗体，但你不应该纯粹使用这个标签来获得粗体风格，为了获得粗体风格，你应该使用`<span>`元素和一些CSS，或者是`<b>`元素。

### 表象元素

`<b>`, `<i>`, 和 `<u>` 的情况却有点复杂。它们出现于人们要在文本中使用粗体、斜体、下划线但CSS仍然不被完全支持的时期。像这样的元素，仅仅影响表象而且没有语义，被称为**表象元素**（presentational elements）并且**不应该再被使用**（应使用CSS取代）。

> 注：**人们很容易把下划线和超链接联系起来**。因此，在Web上，最好只在链接上使用下划线。



## 超链接

### 链接的解析

基本形式：

```html
<a href="https://www.mozilla.org/en-US/">the Mozilla homepage</a>
```

使用title添加支持信息（鼠标放在链接上有文字显示）

```html
<a href="https://www.mozilla.org/en-US/"
   title="The best place to find more information about Mozilla's
          mission and how to contribute">the Mozilla homepage</a>

```

块级链接：比如可以把图像放在`<a></a>`之间：

```html
<a href="https://www.mozilla.org/en-US/">
  <img src="mozilla-image.png" alt="mozilla logo that links to the mozilla homepage">
</a>

```

### 统一资源定位符(URL)与路径(path)

**指向当前目录、指向子目录、指向上级目录**：略

链接到文档片断：

要做到这一点，你必须首先给要链接到的元素分配一个`id`属性：

```html
<h2 id="Mailing_address">Mailing address</h2>

```

使用井号（#）链接：

```html
<p>Want to write us a letter? Use our <a href="contacts.html#Mailing_address">mailing address</a>.</p>

```

当然也可以在同一份文档下，通过链接文档片段，来链接到同一份文档的另一部分（`herf="#Mailing_address"`）

当链接到要下载的资源而不是在浏览器中打开时，可以使用 download 属性来提供一个默认的保存文件名:

```html
<a href="https://download.mozilla.org/?product=firefox-latest-ssl&os=win64&lang=en-US"
   download="firefox-latest-64bit-installer.exe">
  Download Latest Firefox for Windows (64-bit) (English, US)
</a>

```

### 电子邮件链接

`mailto:链接`

```html
<a href="mailto:nowhere@mozilla.org">Send email to nowhere</a>

```

任何标准的邮件头字段可以被添加到你提供的邮件URL。 其中最常用的是主题(subject)、抄送(cc)和主体(body) ：

```html
<a href="mailto:nowhere@mozilla.org?cc=name2@rapidtables.com&bcc=name3@rapidtables.com&subject=The%20subject%20of%20the%20email&body=The%20body%20of%20the%20email">
  Send mail with cc, bcc, subject and body
</a>

```



## 高阶文字排版

### 描述列表

是不同于有序列表和无序列表的另一种列表。

描述列表使用与其他列表类型不同的闭合标签— `<dl>`; 此外，每一项都用 `<dt>` (description term) 元素闭合。每个描述都用 `<dd>` (description description) 元素闭合。浏览器的默认样式会在**描述列表的描述部分**（description description）和**描述术语**（description terms）之间产生缩进。

```html
    <dl>
        <dt>内心独白</dt>
        <dd>戏剧中，某个角色对自己的内心活动或感受进行念白表演，这些台词只面向观众，而其他角色不会听到。</dd>
        <dt>语言独白</dt>
        <dd>戏剧中，某个角色把自己的想法直接进行念白表演，观众和其他角色都可以听到。</dd>
        <dt>旁白</dt>
        <dd>戏剧中，为渲染幽默或戏剧性效果而进行的场景之外的补充注释念白，只面向观众，内容一般都是角色的感受、想法、以及一些背景信息等。</dd>
    </dl>
```

<dl>
    <dt>内心独白</dt>
    <dd>戏剧中，某个角色对自己的内心活动或感受进行念白表演，这些台词只面向观众，而其他角色不会听到。</dd>
    <dt>语言独白</dt>
    <dd>戏剧中，某个角色把自己的想法直接进行念白表演，观众和其他角色都可以听到。</dd>
    <dt>旁白</dt>
    <dd>戏剧中，为渲染幽默或戏剧性效果而进行的场景之外的补充注释念白，只面向观众，内容一般都是角色的感受、想法、以及一些背景信息等。</dd>
</dl>

### 引用

使用`<blockquote><\blockquote>`包裹，浏览器在渲染块引用时默认会增加缩进，作为引用的一个指示符。

`<cite></cite>`表示对作品的引用，默认斜体，其中往往包含（或者被包含？）`<a>`元素

`<q cite="">`后面的句子会带双引号

### 缩略语

例：

```html
<p>我们使用 <abbr title="超文本标记语言（Hypertext Markup Language）">HTML</abbr> 来组织网页文档。</p>
```

<p>我们使用 <abbr title="超文本标记语言（Hypertext Markup Language）">HTML</abbr> 来组织网页文档。</p>

### 标记联系方式

`<address>`元素是为了标记编写HTML文档的人的联系方式

```html
<address>
  <p>Chris Mills, Manchester, The Grim North, UK</p>
</address>
```

<address>
  <p>Chris Mills, Manchester, The Grim North, UK</p>
</address>

### 上标和下标

`<sup>`：上标

`<sub>`：下标

```html
<p>咖啡因的化学方程式是 C<sub>8</sub>H<sub>10</sub>N<sub>4</sub>O<sub>2</sub>。</p>
<p>如果 x<sup>2</sup> 的值为 9，那么 x 的值必为 3 或 -3。</p>
```

<p>咖啡因的化学方程式是 C<sub>8</sub>H<sub>10</sub>N<sub>4</sub>O<sub>2</sub>。</p>
<p>如果 x<sup>2</sup> 的值为 9，那么 x 的值必为 3 或 -3。</p>

### 计算机代码

- `<code>` 用于标记计算机通用代码。
- `<pre>`用于保留空白字符（通常用于代码块）——如果您在文本中使用缩进或多余的空白，浏览器将忽略它，您将不会在呈现的页面上看到它。但是，如果您将文本包含在``标签中，那么空白将会以与你在文本编辑器中看到的相同的方式渲染出来。
- `<var>` 用于标记具体变量名。
- `<kbd>`用于标记输入电脑的键盘（或其他类型）输入。
- `<samp>` 用于标记计算机程序的输出。

### 日期

```html
<time datetime="2016-01-20">2016年1月20日</time>
```

世界上有许多种书写日期的格式，但是这些不同的格式不容易被电脑识别 — 假如你想自动抓取页面上所有事件的日期并将它们插入到日历中，`<time>`元素允许你附上清晰的、可被机器识别的 时间/日期来实现这种需求。h

## 文档与网站架构

### 文档的基本组成部分

- **`<header>`：**页眉。如果它是 `<body>` 的子元素，那么就是网站的全局页眉。如果它是 `<article>` 或`<section>` 的子元素，那么它是这些部分特有的页眉（此 `<header>` 非彼 标题）。
- **`<nav>`：**导航栏。其中不应包含二级链接等内容。
- **`<main>`：**主内容，主内容中还可以有各种子内容区段，可用`<article>`、`<section>` 和 `<div>` 等元素表示。每个页面上只能用一次 ，且直接位于`<body>`中。最好不要把它嵌套进其它元素。
- **`<article>`：**包围的内容即一篇文章，与页面其它部分无关（比如一篇博文）。
- **`<section>`：**与`<article>` 类似，但 `<section>` 更适用于组织页面使其按功能（比如迷你地图、一组文章标题和摘要）分块。一般的最佳用法是：以 [标题](https://developer.mozilla.org/en-US/Learn/HTML/Howto/Set_up_a_proper_title_hierarchy) 作为开头；也可以把一篇 `<article>` 分成若干部分并分别置于不同的 `<section>` 中，也可以把一个区段 `<section>` 分成若干部分并分别置于不同的 `<article>` 中，取决于上下文。
- **`<aside>`：**侧边栏，经常嵌套在`<main>`中
- **`<footer>`：**页脚

我们要敬畏语义，做到**正确选用元素**。这是因为**视觉效果并不是一切**。

### 无语义元素

上面的元素都是有语义的，但有时我们可能只想将一组元素作为一个单独的实体来修饰来响应单一的用 CSS 或 JavaScript。为了应对这种情况，HTML提供了 `<div>` 和 `<span>` 元素。应配合使用 class 属性提供一些标签，使这些元素能易于查询。

- `<span>` 是一个**内联**的（inline）无语义元素，最好只用于无法找到更好的语义元素来包含内容时，或者不想增加特定的含义时

- `<div>`是一个块级无语义元素，应仅用于找不到更好的块级元素时，或者不想增加特定的意义时。例如，一个电子商务网站页面上有一个一直显示的购物车组件。

换行`<br>`

水平线`<hr>`



## HTML中的图片

### \<img>基本属性

一般推荐把图片放在和html文件同级的images目录下。

```html
<img src="images/dinosaur.jpg" alt="备注信息">
```

如果图片仅仅用于装饰则alt为空即可。

可以使用属性`width`和`height`指定图片的大小，这会让图片无法显示的时候浏览器仍然为图片留出空间。但是如果我们需要改版图片的尺寸，应该使用CSS而不是HTML。

可以使用`title`属性，鼠标悬停在图片上的时候会显示title内容。

### 图片语义容器

我们可以在图片后面跟一个`<p></p>`来解说图片，但是在语义上`<p>`和`<img>`并没有什么关系。HTML5中的`<figure>`和`<figcaption>`在标题和图片之间建立清晰的关系。

```html
<figure>
  <img src="https://raw.githubusercontent.com/mdn/learning-area/master/html/multimedia-and-embedding/images-in-html/dinosaur_small.jpg"
     alt="一只恐龙头部和躯干的骨架，它有一个巨大的头，长着锋利的牙齿。"
     width="400"
     height="341">
  <figcaption>曼彻斯特大学博物馆展出的一只霸王龙的化石</figcaption>
</figure>
```

这一结构不止可以用于图片，也可以用于代码、音频、方程、表格等内容。

### CSS背景图片

CSS 属性 `background-image` 和另其他 `background-*` 属性是用来放置背景图片的。相较于
HTML的图片，CSS的图片是用于装饰，而没有语义，也没有备选文本。

为所有段落设置一个背景图片：

```css
p {
  background-image: url("images/dinosaur.jpg");
}
```



## 视频和音频

曾经使用flash，但如今HTML5提供了`<video>`和`<audio>`用来插入视频和音频。

### \<video>视频

```html
<video src="video/UML_Lec02_b1_UML引言v2.mp4" controls>
    <p>你的浏览器不支持 HTML5 视频。可点击<a href="rabbit320.mp4">此链接</a>观看</p>
</video>
```

- **src**
  同 `<img>` 标签使用方式相同，src 属性指向你想要嵌入网页当中的视频资源，他们的使用方式完全相同。
- **controls**
  用户必须能够控制视频和音频的回放功能。你可以使用浏览器提供的控制接口，同时你也可以使用合适的 JavaScript API构建控制接口。至少，这些媒体应该包括开始和停止，以及调整音量的功能。
- **\<video> 标签内的段落**
  这个叫做后备内容 — 当浏览器不支持 `<video>` 标签的时候，它将会显示出来，它使我们能够对旧的浏览器做一些兼容处理。你可以添加任何后备内容，在这个例子中我们提供了一个指向这个视频文件的链接，从而使用户可以至少访问到这个文件，而不会局限于浏览器的支持。

我们需要准备不同的格式来兼容不同的浏览器，为此，我们可以去除`<video>`中的src属性，并将视频链接放在其内部的`<source>`元素中：

```html
<video controls>
  <source src="rabbit320.mp4" type="video/mp4">
  <source src="rabbit320.webm" type="video/webm">
  <p>你的浏览器不支持 HTML5 视频。可点击<a href="rabbit320.mp4">此链接</a>观看</p>
</video>
```

浏览器将会检查 `<source>` 标签，并且播放第一个与其自身 codec 相匹配的媒体。

其他新特性：

- `width` 和 `height`

  你可以用属性控制视频的尺寸，也可以用 [CSS](https://developer.mozilla.org/zh-CN/docs/Glossary/CSS) 来控制视频尺寸。 无论使用哪种方式，视频都会保持它原始的长宽比 — 也叫做**纵横比**。如果你设置的尺寸没有保持视频原始长宽比，那么视频边框将会拉伸，而未被视频内容填充的部分，将会显示默认的背景颜色。

- `autoplay`

  这个属性会使音频和视频内容立即播放，即使页面的其他部分还没有加载完全。建议不要应用这个属性在你的网站上，因为用户们会比较反感自动播放的媒体文件。

- `loop`

  这个属性可以让音频或者视频文件循环播放。同样不建议使用，除非有必要。

- `muted`

  这个属性会导致媒体播放时，默认关闭声音。

- `poster`

  这个属性指向了一个图像的URL，这个图像会在视频播放前显示。通常用于粗略的预览或者广告。

- `preload`

  这个属性被用来缓冲较大的文件，有3个值可选：`"none"` ：不缓冲`"auto"` ：页面加载后缓存媒体文件`"metadata"` ：仅缓冲文件的元数据

我们并没有使用 `autoplay` 属性在这个版本的例子中 — 如果当页面一加载就开始播放视频的话，就不会看到 poster 属性的效果了。



### \<audio>音频

使用方式和`<video>`基本相同，但因为没有视觉部件，所以不支持`width`、`height`、`poster`

### 音轨文本

用 `<track>` 标签链接 .vtt 文件， `<track>` 标签需放在 `<audio>` 或 `<video>` 标签当中，同时需要放在所有 `<source>` 标签之后。使用 `kind` 属性来指明是哪一种类型，如 subtitles 、 captions 、 descriptions。然后，使用 `srclang` 来告诉浏览器你是用什么语言来编写的 subtitles。

- **subtitles：**通过添加翻译字幕，来帮助那些听不懂外国语言的人们理解音频当中的内容。
- **captions：**同步翻译对白，或是描述一些有重要信息的声音，来帮助那些不能听音频的人们理解音频中的内容。
- **descriptions：**将文字转换为音频，用于服务那些有视觉障碍的人。

```html
<video controls>
    <source src="example.mp4" type="video/mp4">
    <source src="example.webm" type="video/webm">
    <track kind="subtitles" src="subtitles_en.vtt" srclang="en">
</video>
```



## 其他嵌入技术

### iframe

可以将其他Web文档嵌入到当前文档中。

```html
<iframe src="https://player.bilibili.com/player.html?aid=19390801&cid=31621681&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe> 
<p>改革春风吹满地</p>
```



<iframe src="https://player.bilibili.com/player.html?aid=19390801&cid=31621681&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe> <p>改革春风吹满地</p>

<iframe src="https://banqinghe.com" border="1"></iframe>

- **src：**要插入文档的链接
- **width，height：**设置宽度和高度
- **allowfullscreen：**设置之后可通过全屏API设置为全屏模式
- **frameborder：**为1有边框（默认），为0无边框
- 和video相同有备选内容
- **sandbox：**较为现代的浏览器支持，提高安全性

**安全问题**：

- 有些页面在服务器上设置了不允许被嵌入到`<iframe>`
- 只有在必要时嵌入
- 使用HTTPS，不能使用HTTP嵌入第三方内容
- 始终使用sandbox

一个允许包含在其里的代码以适当的方式执行或者用于测试，但不能对其他代码库（意外或恶意）造成任何损害的容器称为[沙盒](https://en.wikipedia.org/wiki/Sandbox_(computer_security))。

应该使用没有参数的`sandbox`属性来强制执行所有可用的限制，如我们前面的示例所示。如果绝对需要，可以逐个添加权限（`sandbox=""`属性值内）。



### \<embed>和\<object>元素

是用来嵌入多种类型（Flash、PDF）的外部内容的通用嵌入工具。但是现在并不常用。

大致用法：

|                                                              | \<embed>                     | \<object>                                                    |
| :----------------------------------------------------------- | :--------------------------- | ------------------------------------------------------------ |
| 嵌入内容的[网址](https://developer.mozilla.org/en-US/docs/Glossary/URL) | `src`                        | `data`                                                       |
| 嵌入内容的*准确*[媒体类型](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type) | `type`                       | `type`                                                       |
| 由插件控制的框的高度和宽度（以CSS像素为单位）                | `height` `width`             | `height` `width`                                             |
| 名称和值，将插件作为参数提供                                 | 具有这些名称和值的ad hoc属性 | 单标签[``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/param)元素，包含在内`` |
| 独立的HTML内容作为不可用资源的回退                           | 不支持（``已过时）           | 包含在元素``之后``                                           |

不常用所以未详细记录。



## 在网页中添加矢量图形

- **位图**：个位图文件精确得包含了每个像素的位置和它的色彩信息。

  例：`.bmp`、`.png`、`.jpg`、`.gif`

- **矢量图**：一个矢量图文件包含了图形和路径的定义，电脑可以根据这些定义计算出当它们在屏幕上渲染时应该呈现的样子。例：`.svg`

矢量图通常体积更小。

SVG是用来描述矢量图像的XML语言：

```xml
 <svg version="1.1"
     baseProfile="full"
     width="300" height="200"
     xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="black" />
  <circle cx="150" cy="100" r="90" fill="blue" />
</svg>
```

对于复杂SVG图像，手工编码变得不切实际，所以大多数人使用矢量图编辑器。

**嵌入SVG的三种方式:**

1. **使用`<img>`元素**：可以使用alt，也可以使用`<a>`轻松让它成为超链接，但是无法使用js操纵图像，也不好使用CSS控制其内容。

2. **直接使用SVG代码**（就像上面的SVG代码，也被称为内联SVG）：减少加载时间，可以分配class和id，便于用CSS修改演示样式，也可以包在`<a>`中成为超链接，但是只适用于在一个地方使用SVG，且不能被浏览器缓存。

3. **使用iframe**：浏览器可能不支持iframe，除非 SVG 和您当前的网页具有相同的 [origin](https://developer.mozilla.org/zh-CN/docs/Glossary/源)，否则你不能在主页面上使用 JavaScript 来操纵 SVG。

   

## 自适应图片

我们有时候会使用一些窄屏的设备查看网页（平板、手机等），这时候显示大的没必要的图像是比较浪费带宽的，所以我们需要使用自适应的图片解决这一问题。

> [CSS是比HTML更好的响应式设计的工具](http://blog.cloudfour.com/responsive-images-101-part-8-css-images/)，我们会在未来的CSS模块中讨论。

### 不同尺寸图像的切换

```html
<img srcset="elva-fairy-320w.jpg 320w,
             elva-fairy-480w.jpg 480w,
             elva-fairy-800w.jpg 800w"
     sizes="(max-width: 320px) 280px,
            (max-width: 480px) 440px,
            800px"
     src="elva-fairy-800w.jpg" alt="Elva dressed as a fairy">
```

关于上述代码：

- **srcset：**
  - 文件名
  - 空格
  - 图像固有宽度，w为单位而不是px，表示图像真实大小（还是不太懂）
- **sizes：**
  - 媒体条件
  - 空格
  - 媒体条件为真时，图片将填充的槽的宽度（最后条件后的槽宽被省略）
- 浏览器要做的事：
  1. 查看设备宽度
  2. 检查`sizes`列表中哪个媒体条件是第一个为真
  3. 查看给予该媒体查询的槽大小
  4. 加载`srcset`列表中引用的最接近所选的槽大小的图像

> **注意**: 在 HTML 文件中的`<head>`标签里， 你将会找到这一行代码 `<meta name="viewport" content="width=device-width">`: 这行代码会强制地让手机浏览器采用它们真实可视窗口的宽度来加载网页。

### 分辨率切换

不同图片具有相同的尺寸，不同的分辨率。

```html
<img srcset="elva-fairy-320w.jpg,
             elva-fairy-480w.jpg 1.5x,
             elva-fairy-640w.jpg 2x"
     src="elva-fairy-640w.jpg" alt="Elva dressed as a fairy">
```

在这种情况下，`sizes`并不需要——浏览器只是计算出正在显示的显示器的分辨率，然后提供`srcset`引用的最适合的图像。因此，如果访问页面的设备具有标准/低分辨率显示，一个设备像素表示一个CSS像素，`elva-fairy-320w.jpg`会被加载（1x 是默认值，所以你不需要写出来）。如果设备有高分辨率，两个或更多的设备像素表示一个CSS像素，`elva-fairy-640w.jpg` 会被加载。640px的图像大小为93KB，320px的图像的大小仅仅有39KB。

### 美术设计：使用picture

就像\<video>和\<audio>，\<picture>素包含了一些\<source>元素，它使浏览器在不同资源间做出选择，紧跟着的是最重要的\<img>元素。

```html
<picture>
  <source media="(max-width: 799px)" srcset="elva-480w-close-portrait.jpg">
  <source media="(min-width: 800px)" srcset="elva-800w.jpg">
  <img src="elva-800w.jpg" alt="Chris standing up holding his daughter Elva">
</picture>
```

这允许我们在宽屏和窄屏上都能显示合适的图片。

> 不要使用`media`属性，除非你也需要美术设计



这章的两个要点：

- **美术设计：**当你想为不同布局提供不同剪裁的图片——比如在桌面布局上显示完整的、横向图片，而在手机布局上显示一张剪裁过的、突出重点的纵向图片，可以用 \<picture> 元素来实现。
- **分辨率切换：**当你想要为窄屏提供更小的图片时，因为小屏幕不需要像桌面端显示那么大的图片；以及你想为高/低分辨率屏幕提供不同分辨率的图片时，都可以通过 vector graphics (SVG images)、 srcset 以及 sizes 属性来实现。

