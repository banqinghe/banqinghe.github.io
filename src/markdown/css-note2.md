# CSS 笔记(2) 样式化和布局

本篇笔记承接上一节，主要讲述的是对元素的样式化（包括对字体、表格、列表、链接的样式化）和布局排版（flex和grid）的问题。了解了这些知识，就基本可以看懂网站的CSS代码了，并且可以做一些很基础的网站布局。

但愿足够应付数据库大作业……

---

## 基本文本和字体样式

### 字体

**1. 颜色**

使用`color`设置文字的颜色。

**2. 字体种类**

使用`font-family`设置字体，该属性的值被称为**字体栈**，浏览器会选择第一个可行的字体。如果不设置此属性，则使用浏览器默认字体。

- **网页安全字体**

  只有某几个字体通常可以应用到所有系统，因此可以毫无顾忌地使用。这些都是所谓的 **网页安全字体**。目前我们认为下面的字体是网页安全的：

  | 字体名称        | 泛型       | 注意                                                         |
  | :-------------- | :--------- | :----------------------------------------------------------- |
  | Arial           | sans-serif | 通常认为最佳做法还是添加 Helvetica 作为 Arial 的首选替代品，尽管它们的字体面几乎相同，但 Helvetica 被认为具有更好的形状，即使Arial更广泛地可用。 |
  | Courier New     | monospace  | 某些操作系统有一个 Courier New 字体的替代（可能较旧的）版本叫Courier。使用Courier New作为Courier的首选替代方案，被认为是最佳做法。 |
  | Georgia         | serif      |                                                              |
  | Times New Roman | serif      | 某些操作系统有一个 Times New Roman 字体的替代（可能较旧的）版本叫 Times。使用Times作为Times New Roman的首选替代方案，被认为是最佳做法。 |
  | Trebuchet MS    | sans-serif | 您应该小心使用这种字体——它在移动操作系统上并不广泛。         |
  | Verdana         | sans-serif |                                                              |

- **默认字体**

  CSS 定义了 5 个常用的字体名称: `serif`, `sans-serif`, `monospace`, `cursive,`和 `fantasy`。当使用这些通用名称时，使用的字体完全取决于每个浏览器，而且它们所运行的每个操作系统也会有所不同。

  五个名称定义如下：

  | 名称         | 定义                                                         |
  | :----------- | :----------------------------------------------------------- |
  | `serif`      | 有衬线的字体 （衬线一词是指字体笔画尾端的小装饰，存在于某些印刷体字体中） |
  | `sans-serif` | 没有衬线的字体。                                             |
  | `monospace`  | 每个字符具有相同宽度的字体，通常用于代码列表。               |
  | `cursive`    | 用于模拟笔迹的字体，具有流动的连接笔画。                     |
  | `fantasy`    | 用来装饰的字体                                               |



**3. 字体大小**

使用`font-size`设置，具体参见前文**CSS的值和单位**一节。浏览器的`font-size`默认为16px。在`html`选择器中设置`font-size`为10px是一个不错的选择，这样就可以很直观的使用`em`设置字体大小。	



**4. 字体样式，字体粗细，文本转换和文本装饰**

- **font-style**: 用来打开和关闭文本 italic (斜体)。 可能的值如下 (你很少会用到这个属性，除非你因为一些理由想将斜体文字关闭斜体状态)：

  - `normal`: 将文本设置为普通字体 (将存在的斜体关闭)
  - `italic`: 如果当前字体的斜体版本可用，那么文本设置为斜体版本；如果不可用，那么会利用 oblique 状态来模拟 italics。
  - `oblique`: 将文本设置为斜体字体的模拟版本，也就是将普通文本倾斜的样式应用到文本中。

- **font-weight**: 设置文字的粗体大小。这里有很多值可选 (比如 *-light*, *-normal*, *-bold*, *-extrabold*, *-black*, 等等), 不过事实上你很少会用到 `normal` 和 `bold`以外的值：

  - `normal`, `bold`: 普通或者**加粗**的字体粗细
  - `lighter`, `bolder`: 将当前元素的粗体设置为比其父元素粗体更细或更粗一步。`100`–`900`: 数值粗体值，如果需要，可提供比上述关键字更精细的粒度控制。

- **text-transform**: 允许你设置要转换的字体。值包括：

  - `none`: 防止任何转型。
  - `uppercase`: 将所有文本转为大写。
  - `lowercase`: 将所有文本转为小写。
  - `capitalize`: 转换所有单词让其首字母大写。
  - `full-width`: 将所有字形转换成全角，即固定宽度的正方形，类似于等宽字体，允许拉丁字符和亚洲语言字形（如中文，日文，韩文）对齐。

- **text-decoration**：设置/取消字体上的文本装饰 (你将主要使用此方法在设置链接时取消设置链接上的默认下划线。) 可用值为：

  - `none`: 取消已经存在的任何文本装饰。
  - `underline`: <span style="text-decoration: underline wavy blue">文本下划线(wavy)</span>
  - `overline`: <span style="text-decoration: overline red">文本上划线(red)</span>
  - `line-through`: 穿过文本的线 <span style="text-decoration: line-through purple">strikethrough over the text</span>.

  同时注意 [`text-decoration`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-decoration) 是一个缩写形式，它由 [`text-decoration-line`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-decoration-line), [`text-decoration-style`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-decoration-style) 和 [`text-decoration-color`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-decoration-color) 构成。



**5. 文字阴影**

使用[`text-shadow`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-shadow)属性设置文字阴影。属性值的数量不同时的情况：

| 四个值 | 水平方偏移，垂直方向偏移，模糊半径，阴影颜色 |
| ------ | -------------------------------------------- |
| 三个值 | 水平方偏移，垂直方向偏移，阴影颜色           |
| 两个值 | 水平方偏移，垂直方向偏移                     |

> **注：**阴影颜色可以也可以作为第一个值



font还有其他属性可供选择（参见[此处](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font)），也有简写的`font`形式，若使用简写形式，`font-size`和`font-famliy`必需被指定，



### 文本布局

**1. 文本对齐**

使用`text-align`属性控制文本如何和它所在的内容盒子对齐。

- `left`: 左对齐文本。
- `right`: 右对齐文本。
- `center`: 居中文字
- `justify`: 使文本展开，改变单词之间的差距，使所有文本行的宽度相同。你需要仔细使用，它可以看起来很可怕。特别是当应用于其中有很多长单词的段落时。如果你要使用这个，你也应该考虑一起使用别的东西，比如 [`hyphens`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/hyphens)，打破一些更长的词语。

还有`start`和`end`用于处理从右向左写的文字。



**2. 行高**

`line-height`用来设置行高。可以接受大多数单位，但是也可以无单位，无单位的值乘以`font-size`来获得`line-height`。推荐的行高大约是 1.5–2 。



**3. 字母和单词间距**

[`letter-spacing`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/letter-spacing) 和 [`word-spacing`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-spacing) 属性允许你设置你的文本中的字母与字母之间的间距、或是单词与单词之间的间距。你不会经常使用它们，但是可能可以通过它们，来获得一个特定的外观，或者让较为密集的文字更加可读。



## 样式化表格

**1. 间距和布局**

看一段CSS代码：

```css
/* spacing */

table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    border: 3px solid purple;
}

thead th:nth-child(1) {
    width: 30%;
}

thead th:nth-child(2) {
    width: 20%;
}

thead th:nth-child(3) {
    width: 15%;
}

thead th:nth-child(4) {
    width: 35%;
}

th,
td {
    padding: 20px;
}
```

通常情况下，表列的尺寸会根据所包含的内容大小而变化，这会产生一些奇怪的结果。通过 `table-layout: fixed`，您**可以根据列标题的宽度来规定列的宽度**，然后适当地处理它们的内容。

我们在上面的CSS代码中所做的：

- 通过 `table-layout: fixed`，您可以根据列标题的宽度来规定列的宽度，然后适当地处理它们的内容。
- 使用了`thead th:nth-child(n)` 选择了四个不同的标题([`:nth-child`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-child))选择器（“选择第n个子元素，它是一个顺序排列的`<th>`元素，且其父元素是元素`<thead>`）并给定了它们的百分比宽度。
- 设置`border-collapse`属性为` collapse`。我们设置表元素的边框的时候，默认情况下它们之间是有间隔的，这一设置可以将这些边框合为一条。
- 我们在`<th>`和`<td>`元素上设置了一些[`padding`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/padding)，这些元素使数据项有了一些空间，



**2. 文字排版**

```css
/* typography */

html {
    font-family: 'helvetica neue', helvetica, arial, sans-serif;
}

thead th,
tfoot th {
    font-family: 'Rock Salt', cursive;
}

th {
    letter-spacing: 2px;
}

td {
    letter-spacing: 1px;
}

tbody td {
    text-align: center;
}

tfoot th {
    text-align: right;
}
```

- 设置了字体，在html中插入：

  ```html
  <link href='https://fonts.googleapis.com/css?family=Rock+Salt' rel='stylesheet' type='text/css'>
  ```

  引入字体

- `letter-spacing`：设置字符之间的距离（默认是0，甚至可以是负值）

- `text-align`：设置文字对齐方式，默认为`left`



**3. 图形和颜色**

```css
thead, tfoot {
  background: url(leopardskin.jpg);
  color: white;
  text-shadow: 1px 1px 1px black;
}

thead th, tfoot th, tfoot td {
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5));
  border: 3px solid purple;
}
```

- 设置了背景图像和字体颜色（总是觉得字体颜色属性是`font-color`，但其实是`color`）
- 渐变背景`linear-gradient`



**4. 斑马条纹图案**

```css
tbody tr:nth-child(odd) {
  background-color: #ff33cc;
}

tbody tr:nth-child(even) {
  background-color: #e495e4;
}

tbody tr {
  background-image: url(noise.png);
}

table {
  background-color: #ff33cc;
}
```

使用`nth-child`选择器分别选择偶数行和奇数行，赋予不同的背景颜色。





## 样式列表

### 列表特定样式

**1. 符号样式**

[`list-style-type`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/list-style-type) 属性允许你设置项目符号点的类型，常用的值如下：

<ol>
    <li style="list-style-type: disc">disc</li>
    <li style="list-style-type: circle">circle</li>
    <li style="list-style-type: square">square</li>
    <li style="list-style-type: decimal">decimal</li>
    <li style="list-style-type: upper-roman">upper-roman</li>
    <li style="list-style-type: lower-roman">lower-roman</li>
    <li style="list-style-type: georgian">georgian</li>
    <li style="list-style-type: trad-chinese-informal">trad-chinese-informal</li>
    <li style="list-style-type: kannada">kannada</li>
    <li style="list-style-type: none">none</li>
</ol>

也可以使用指定的字符串或者字符，譬如`list-style-type: "\1F44D"; `这样会是一个指定的emoji作为列表符号。



**2. 项目符号位置**

[`list-style-position`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/list-style-position) 设置在每个项目开始之前，项目符号是出现在列表项内，还是出现在其外。默认值为 `outside`，这使项目符号位于列表项之外。也可以设置为`inside`，这样项目符号会位于行内。



**3. 使用自定义的项目符号图片**

[`list-style-image`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/list-style-image) 属性允许对于项目符号使用自定义图片。一个简单的示例：

```css
ul {
  list-style-image: url(star.svg);
}
```

然而，这个属性在控制项目符号的位置，大小等方面是有限的。 **所以我们最好使用[`background`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background) 系列属性。**参考下面的代码：

```css
ul {
  padding-left: 2rem;  /* 原本为40px，现在为20px */
  list-style-type: none;
}

ul li {
  padding-left: 2rem;
  background-image: url(star.svg);
  background-position: 0 0;
  background-size: 1.6rem 1.6rem;
  background-repeat: no-repeat;
}
```

- 将 [`<ul>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/ul) 的 [`padding-left`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/padding-left) 从默认的 `40px`设置为 `20px`，然后在列表项上设置相同的数值。 这就是说，整个列表项仍然排列在列表中，但是**列表项产生了一些用于背景图像的填充**。
- 将`list-style-type`设置为none，去除原生的项目符号，便于我们下面使用`background`作为项目符号。
- `background-position`的值代表背景图像放置在列表项左上角。
- `background-size`将图像设置为合适大小，使用`background-repeat`设置图像只会出现一次。



上面的属性有速记属性`list-style`，使用示例：

```css
ul {
  list-style: none url(example.png) inside;
}
```



### 管理列表属性

HTML中有一些设置计数的属性。

- `start`可以用来设置从哪个数字开始计数
- `reverse`将启动列表倒计数。
- value可以用来设置列表表项为指定数值

```css
<ol start="4" reversed>
  <li>Toast pitta, leave to cool, then slice down the edge.</li>
  <li>Fry the halloumi in a shallow, non-stick pan, until browned on both sides.</li>
  <li value="100">Wash and chop the salad.</li>
  <li>Fill pitta with salad, humous, and fried halloumi.</li>
</ol>
```

<ol start="4" reversed>
  <li>Toast pitta, leave to cool, then slice down the edge.</li>
  <li>Fry the halloumi in a shallow, non-stick pan, until browned on both sides.</li>
  <li value="100">Wash and chop the salad.</li>
  <li>Fill pitta with salad, humous, and fried halloumi.</li>
</ol>

> **注意**: 纵然你使用非数字的 [`list-style-type`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/list-style-type), 你仍需要使用与数值同等意义的值作为 value 的属性。



**更高自由度的计数器：**

CSS计数器提供用于自定义列表计数和样式的高级工具，但它们相当复杂。 如果你想更深入了解，请查看如下资源：

- [`@counter-style`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@counter-style)
- [`counter-increment`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/counter-increment)
- [`counter-reset`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/counter-reset)



## 样式化链接

### 基本规则

**1. 链接的一些状态：**

- **Link (没有访问过的)**: 这是链接的默认状态，当它没有处在其他状态的时候，它可以使用[`:link`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:link) 伪类来应用样式。
- **Visited**: 这个链接已经被访问过了(存在于浏览器的历史纪录), 它可以使用 [`:visited`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:visited) 伪类来应用样式。
- **Hover**: 当用户的鼠标光标刚好停留在这个链接，它可以使用 [`:hover`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:hover) 伪类来应用样式。
- **Focus**: 一个链接当它被选中的时候 (比如通过键盘的 Tab 移动到这个链接的时候，或者使用编程的方法来选中这个链接 [`HTMLElement.focus()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/focus)) 它可以使用 [`:focus`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:focus) 伪类来应用样式。
- **Active**: 一个链接当它被激活的时候 (比如被点击的时候)，它可以使用 [`:active`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:active) 伪类来应用样式。



**2. 链接的默认样式：**

- 链接具有下划线。
- 未访问过的 (Unvisited) 的链接是蓝色的。
- 访问过的 (Visited) 的链接是紫色的.
- 悬停 (Hover) 在一个链接的时候鼠标的光标会变成一个小手的图标。
- 选中 (Focus) 链接的时候，链接周围会有一个轮廓，你应该可以按 tab 来选中这个页面的链接 (在 Mac 上, 你可能需要使用*Full Keyboard Access: All controls* 选项，然后再按下 Ctrl + F7 ，这样就可以起作用)
- 激活 (Active) 链接的时候会变成红色 (当你点击链接时，请尝试按住鼠标按钮。)



**3. CSS链接规则的顺序**

```css
a {

}


a:link {

}

a:visited {

}

a:focus {

}

a:hover {

}

a:active {

}
```

这几个规则的顺序是有意义的，因为链接的样式是建立在另一个样式之上的，比如，第一个规则的样式也会在后面的规则中生效，一个链接被激活 (activated) 的时候，它也是处于悬停 (hover) 状态的。如果你搞错了顺序，那么就可能不会产生正确的效果。要记住这个顺序，你可以尝试这样帮助记忆：**L**o**V**e **F**ears **HA**te.



### 在链接中包含图标

```css
a[href*="http"] {
  background: url('https://mdn.mozillademos.org/files/12982/external-link-52.png') no-repeat 100% 0;
  background-size: 16px 16px;
  padding-right: 19px;
}
```

- `background`中的`100% 0`指明了链接的位置，在最右测，与上方距离为0，且避免了图像的重复。
- `padding-right`在链接文本右侧为图标预留了位置。

![效果展示](https://gitee.com/banqinghe/blog-images/raw/master/CSS%E7%AC%94%E8%AE%B0-2-%E6%A0%B7%E5%BC%8F%E5%8C%96%E5%92%8C%E5%B8%83%E5%B1%80/%E9%93%BE%E6%8E%A5%E5%9B%BE%E6%A0%87.png)

`a[href*="http"] `为属性选择器的语法，表示`href`属性中包含`http`的元素。



### 样式化链接为按钮

CSS代码

```css
body,html {
  margin: 0;
  font-family: sans-serif;
}

ul {
  padding: 0;
  width: 100%;
}

li {
  display: inline;
}

a {
  outline: none;
  text-decoration: none;
  display: inline-block;
  width: 19.5%;
  margin-right: 0.625%;
  text-align: center;
  line-height: 3;
  color: black;
}

li:last-child a {
  margin-right: 0;
}

a:link, a:visited, a:focus {
  background: yellow;
}

a:hover {     
  background: orange;
}

a:active {
  background: red;
  color: white;
}
```

html代码：

```html
<ul>
  <li><a href="#">Home</a></li><li><a href="#">Pizza</a></li><li><a href="#">Music</a></li><li><a href="#">Wombats</a></li><li><a href="#">Finland</a></li>
</ul>
```

将`a`的`display`属性设置为`inline-block`，使其虽然不会主动换行，但是可以把它当做block对待。

需要注意的是在html中，如果`<li>`之间换行或者有空格，生成的按钮之间也会有空格的存在，这会使我们的布局有失精确性。所以上面的HTML代码中`<li>`元素之间既没有换行也没有空格。

这一问题有很多解决方案：

- 换一种`<li>`的写法

  ```html
  <li>1</li
  ><li>2</li
  ><li>3</li>
  ```

  缺点是看上去丑了点。

- 使用负margin：

  ```css
  nav a {
    display: inline-block;
    margin-right: -4px;
  }
  ```

教程中推荐了[这篇博文](https://css-tricks.com/fighting-the-space-between-inline-block-elements/)，比较详细地讨论了这个问题。



## 弹性盒子 flex

弹性盒子是一种用于按行或按列布局元素的一维布局方法 。虽是一维的布局方式，但是通过嵌套能完成较为复杂的布局任务。设置`display:flex`可以让一个元素成为flex容器。

模型说明：

- **主轴（main axis）**是沿着 flex 元素放置的方向延伸的轴（比如页面上的横向的行、纵向的列）。该轴的开始和结束被称为 **main start** 和 **main end**。
- **交叉轴（cross axis）**是垂直于 flex 元素放置方向的轴。该轴的开始和结束被称为 **cross start** 和 **cross end**。
- 设置了 `display: flex` 的父元素被称之为 **flex 容器（flex container）。**
- 在 flex 容器中表现为柔性的盒子的元素被称之为 **flex 项**（**flex item**）

![flex model](https://gitee.com/banqinghe/blog-images/raw/master/CSS%E7%AC%94%E8%AE%B0-2-%E6%A0%B7%E5%BC%8F%E5%8C%96%E5%92%8C%E5%B8%83%E5%B1%80/flex_terms.png)

**方向和宽度**

`flex-direction`可以调整盒子排列的方向，默认值为`row`，即横向排列，还可以是`column`，`row-reverse`，`column-reverse`（表示反向排列）。

`flex-wrap`可以指定 flex 元素单行显示还是多行显示 。可以是`wrap`，`nowrap`，`wrap-reverse`，默认值为`nowrap`，即单行显示，但可能造成溢出的现象。使用`wrap`可以将多个flex元素打断分多行显示。

flex元素可以通过设置`flex`属性来规定宽度，其实`flex`也是一个缩写，由[`flex-grow`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-grow)，[`flex-shrink`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-shrink)，[`flex-basis`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-basis)组合而成，下面的例子没有用到`flex-shrink`:

- 无单位值：用以说明比例，比如两个元素，分别为`flex: 1`和`flex: 2`，那么它们宽度的比例就为1:2

- 有单位值：规定宽度
- 同时使用无单位和有单位值：规定比例的同时也规定了最小宽度

`flex-direction`和`flex-wrap`可以缩写为`flex-flow`，用法示例：

```css
flex-flow: row wrap
```



**水平和垂直对齐**

下面将一个`div`元素当做flex容器。

```css
div {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
```

[`align-items`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-items) 控制 flex 项在**交叉轴**上的位置。

- 默认的值是 `stretch`，其会使所有 flex 项沿着交叉轴的方向拉伸以填充父容器。如果父容器在交叉轴方向上没有固定宽度（即高度），则所有 flex 项将变得与最长的 flex 项一样长（即高度保持一致）。我们的第一个例子在默认情况下得到相等的高度的列的原因。
- 在上面规则中我们使用的 `center` 值会使这些项保持其原有的高度，但是会在交叉轴居中。这就是那些按钮垂直居中的原因。
- 你也可以设置诸如 `flex-start` 或 `flex-end` 这样使 flex 项在交叉轴的开始或结束处对齐所有的值。查看 [`align-items`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-items) 了解更多。

> ps：align-self 可以覆盖align-items

[`justify-content`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/justify-content) 控制 flex 项在主轴上的位置。

- 默认值是 `flex-start`，这会使所有 flex 项都位于主轴的开始处。
- 你也可以用 `flex-end` 来让 flex 项到结尾处。
- `center` 在 `justify-content` 里也是可用的，可以让 flex 项在主轴居中。
- 而我们上面用到的值 `space-around` 是很有用的——它会使所有 flex 项沿着主轴均匀地分布，在任意一端都会留有一点空间。
- 还有一个值是 `space-between`，它和 `space-around` 非常相似，只是它不会在两端留下任何空间。



**排序**

示例中给出了五个按钮，我们使用了如下CSS规则：

```css
button:first-child {
  order: 1;
}
```

然后发现第一个按钮被挪到了最后面。

原因是所有的flex项order的默认值都为0，order值越小，就排在越前面，我们也可以把某一元素的order值设为负值，让其排在最前面。



这里的介绍较为简单，进一步参考可以看[阮一峰的博客](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)，更加详细直观。



## 网格布局 grid

不同于flex，使用grid布局是在二维平面上操作。网格通常具有**列（column）**，**行（row）**，以及在每行和列之间的间隙——通常称为**沟槽（gutter）**。

可以使用`grid-template-column`定义每一列的宽度，其值可以是百分比和长度单位，也可以使用`fr`表示比例，如：

```css
grid-template-columns: 2fr 1fr 1fr;
```

表示2:1:1的列宽，我们也可以将`fr`和百分比/长度单位一起使用，百分比和长度单位的优先级更高，它们剩下的空间才用于比例分配。

可以使用`gap`属性规定gutter的宽度，这个属性是`row-gap`和`column-gap`的组合起来的属性。

> **注：**其实原本的gap需要加上‘grid-’作为前缀，但是为了支持更多的布局方式，grid-gap，grid-row-gap这样的用法已经过时了，如今并不推荐使用。但是有时候出于安全考虑，我们可以将gap作为备用选项：
>
> ```css
> grid-gap: 20px;
> gap: 20px;
> ```



### repeat和minmax函数

repeat函数用于代替需要重复的字符串，下面两句代码含义完全相同：

```css
grid-template-columns: 1fr 1fr 1fr;
grid-template-columns: repeat(3, 1fr);
```



在讲述minmax函数之前，我们需要了解**显式网格**和**隐式网格**的定义。

在上面的例子中，我们使用的都是`grid-template-columns`，这一属性规定了每列的具体长度/比例，使用`grid-template-columns`和`grid-template-rows`定义的网格就被称为显式网格。如果具体定义了每一列的宽度，再具体定义每一行的高度是一件比较繁琐的工作，不过幸好有隐式网格属性`grid-auto-rows`和`grid-auto-columns`可供使用。

将显式网格和隐式网格配合使用会使我们的工作方便一些。下面两种写法的作用是相同的：

```css
grid-template-columns: repeat(3, 1fr);
grid-template-rows: 100px 100px 100px;
```

```css
grid-template-columns: repeat(3, 1fr);
grid-auto-rows: 100px;
```

但是使用上面的代码会有一个问题，每个网格的高度固定，这就可能导致内容因为太多而溢出。为了使网格有自适应的高度，我们可以使用minmax函数，这一函数可以同时规定最小值和最大值。向下面这样设置就可以避免溢出问题：

```css
grid-auto-rows: minmax(100px, auto);
```



repeat函数和minmax函数可以很好地配合：

```css
.container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));  /* 使用auto-fill使列数根据大小自适应 */
    grid-auto-rows: minmax(100px, auto);
    grid-gap: 20px;
}
```



### 基于线的放置（line-based）

当我们定义好网格之后，就可以决定每个元素放在哪个格子里，线的序号从1开始，按照书写方向递增（我们的书写方向是从左至右，从上到下），也可以使用负数倒过来标序号，示意图如下：

![grid line](https://gitee.com/banqinghe/blog-images/raw/master/CSS%E7%AC%94%E8%AE%B0-2-%E6%A0%B7%E5%BC%8F%E5%8C%96%E5%92%8C%E5%B8%83%E5%B1%80/grid-lines.png)

最前面的线可以用`grid-column-start`，`grid-row-start`表示，末尾的线可以使用`grid-column-end`和`grid-row-end`代替。

知道了线在哪里，我们就可以使用`grid-column`和`grid-row`来表示内容位于哪里，示例如下：

```css
header {
  grid-column: 1 / 3;
  grid-row: 1;
}
```

上面代码的含义是，`header`元素放在第1条和第3条列线之间，第一行（如果不使用`/`就默认是指定的是具体的某列或某行，此时就不用考虑线了）。

> Grid "frameworks" tend to be based around 12 or 16 column grids and with CSS Grid
>
> 一般我们习惯使用等宽的12列或16列的排版方式。



### 使用grid-template-areas

首先看一段代码：

```css
.container {
  display: grid;
  grid-template-areas: 
      "header header"
      "sidebar content"
      "footer footer";
  grid-template-columns: 1fr 3fr;
  grid-gap: 20px;
}

header {
  grid-area: header;
}

article {
  grid-area: content;
}

aside {
  grid-area: sidebar;
}

footer {
  grid-area: footer;
}
```

`grid-template-areas`后面的字符串指出的是排版的形式，`grid-area`则为某元素确定标识名称。重复表示该元素跨越多格。如果需要空白则使用小数点`.`代替。



## 浮动 float

我们在word里面经常会使用“文字环绕图片”的效果，此外我们也经常在文章里见到“首字下沉（drop-caps）”的效果，这些都可以使用`float`属性来实现。

浮动的作用就是让元素靠在其父容器的指定一侧，按照正常布局流本应在其下面显示的内容会环绕着该元素显示。

假如有如下HTML，我们希望box可以浮动在文字的左侧：

```html
<h1>Simple float example</h1>

<div class="box">Float</div>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus aliquam dolor, eu lacinia lorem placerat vulputate. Duis felis orci, pulvinar id metus ut, rutrum luctus orci. Cras porttitor imperdiet nunc, at ultricies tellus laoreet sit amet. </p>
    
<p>Sed auctor cursus massa at porta. Integer ligula ipsum, tristique sit amet orci vel, viverra egestas ligula. Curabitur vehicula tellus neque, ac ornare ex malesuada et. In vitae convallis lacus. Aliquam erat volutpat. Suspendisse ac imperdiet turpis. Aenean finibus sollicitudin eros pharetra congue. Duis ornare egestas augue ut luctus. Proin blandit quam nec lacus varius commodo et a urna. Ut id ornare felis, eget fermentum sapien.</p>
```

那么我们只需要设置`box`的`float`属性即可：

```css
.box {
  float: left;
  margin-right: 15px;
  width: 150px;
  height: 100px;
  border-radius: 5px;
  background-color: rgb(207,232,220);
  padding: 1em;
}
```

结果如下图所示：

<div style="border: 2px solid #eee">
<strong>Simple float example</strong>
<div style="float: left;
  margin-right: 15px;
  width: 150px;
  height: 100px;
  border-radius: 5px;
  background-color: rgb(207,232,220);
  padding: 1em;">Float</div>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus aliquam dolor, eu lacinia lorem placerat vulputate. Duis felis orci, pulvinar id metus ut, rutrum luctus orci. Cras porttitor imperdiet nunc, at ultricies tellus laoreet sit amet. </p><p>Sed auctor cursus massa at porta. Integer ligula ipsum, tristique sit amet orci vel, viverra egestas ligula. Curabitur vehicula tellus neque, ac ornare ex malesuada et. In vitae convallis lacus. Aliquam erat volutpat. Suspendisse ac imperdiet turpis. Aenean finibus sollicitudin eros pharetra congue. Duis ornare egestas augue ut luctus. Proin blandit quam nec lacus varius commodo et a urna. Ut id ornare felis, eget fermentum sapien.</p></div>



**clear 清除浮动**

我们可以使用`margin-right`控制文字和浮动盒子之间的间隔，但是无法使用文字的`margin-left`达到相同的目的。因为浮动的盒子并不属于正常布局流，有很多地方都看起来不太“正常”。

有时候我们希望某一段不再环绕盒子，可以通过设置`clear`属性实现这一目的。值为`left`代表不环绕左侧盒子，值为`right`代表不环绕右侧盒子，值为`both`代表两侧都不环绕。

下面为示例，我们将`clear: left;`规则赋予第二段：

<div style="border: 2px solid #eee">
<strong>Simple float example</strong>
<div style="float: left;
  margin-right: 15px;
  width: 150px;
  height: 100px;
  border-radius: 5px;
  background-color: rgb(207,232,220);
  padding: 1em;">Float</div>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus aliquam dolor, eu lacinia lorem placerat vulputate. Duis felis orci, pulvinar id metus ut, rutrum luctus orci. Cras porttitor imperdiet nunc, at ultricies tellus laoreet sit amet. </p>
<p style="clear: left;">Sed auctor cursus massa at porta. Integer ligula ipsum, tristique sit amet orci vel, viverra egestas ligula. Curabitur vehicula tellus neque, ac ornare ex malesuada et. In vitae convallis lacus. Aliquam erat volutpat. Suspendisse ac imperdiet turpis. Aenean finibus sollicitudin eros pharetra congue. Duis ornare egestas augue ut luctus. Proin blandit quam nec lacus varius commodo et a urna. Ut id ornare felis, eget fermentum sapien.</p></div>



**背景延伸**

有如下代码：

```css
.float {
  float: right;
}
```

```html
<div class="box">
  <div class="float">Float</div>
  <p>This sentence appears next to the float.</p>
</div>
```

实现的效果如下：

<div class="box">
  <div style="float: right; margin-left: 15px;
  width: 150px;
  height: 100px;
  border-radius: 5px;
  background-color: rgb(207,232,220);
  padding: 1em;"">Float</div>
  <p>This sentence appears next to the float.</p>
</div>



<p style="clear: right;">我们希望加上背景的时候：</p>
效果是这样：

<div style="background-color: rgb(79,185,227);">
  <div style="float: right; margin-left: 15px;
  width: 150px;
  height: 100px;
  border-radius: 5px;
  background-color: rgb(207,232,220);
  padding: 1em;"">Float</div>
  <p>This sentence appears next to the float.</p>
</div>



<p style="clear: right">可以看到浮动的盒子虽然在box中，但是对box设置背景颜色却无法使这个整体都有我们需要的背景颜色。</p>
这时候有几种方式可供使用：

1. 使用伪元素选择器after：

   ```css
   .box::after {
     content: "";
     clear: both;
     display: block;
   }
   ```

2. 使用`overflow`属性：

   ```css
   .box {
     background-color: rgb(79,185,227);
     padding: 10px;
     color: #fff;
     overflow: auto; 
   }
   ```

3. flow-root：

   ```css
   .box {
     background-color: rgb(79,185,227);
     padding: 10px;
     color: #fff;
     display: flow-root; 
   }
   ```

   前两种方式都是hack的手段，第三种才是比较正式的方式。



## 定位 position

设置元素的`position`可以修改定位方式，有静态定位，相对定位，绝对定位，固定定位，sticky定位这些方式可供选择。

**1. 静态定位**

即默认的定位方式，遵循正常布局流（Normal Layout Flow）。



**2. 相对定位**

相对与静态定位的定位。

```css
p {
    position: relative;
    top: 30px;
    left: 30px;
}
```

上面的代码可以使元素**往右移30px，往下移30px**，我们可以把`top`和`left`属性当做一个推力，这两个力使得元素远离力的起点。



**3. 绝对定位**

将`position`设置为`absolute`使用绝对定位。如果所有的父元素都是默认的静态定位，绝对定位元素会被包含在**初始块容器**中，初始块容器和浏览器视口一样大，`<html>`也处于初始块容器中。有时候我们想让元素对于某父元素实现绝对定位，那么只需要改变**定位上下文（绝对定位的元素的相对位置元素）**，把一个父元素设置为`position: relative`，绝对定位的相对位置元素将会是这个父元素，而不再是初始块容器。



**4. z-index**

我们可以很轻易的使用定位将元素重叠，重叠的顺序是，按照正常布局流，后出现的元素会在重叠时显示在更上层。有时候我们想改变默认的重叠顺序。

`z-index`属性可以被认为是垂直于屏幕的z轴的坐标值，其值越大，元素在重叠中更靠前。此属性的值没有单位，默认值为0。



**5. 固定定位**

`position: fixed`设置为固定定位。固定定位和绝对定位很像，但是并不相同。绝对定位固定元素是相对于`<html>`元素或其最近的定位祖先，而固定定位**固定元素则是相对于浏览器视口本身**。这使我们可以做到元素不会随着页面的滚动而改变位置。



**6. sticky定位**

`position: sticky`，它允许被定位的元素表现得像相对定位一样，直到它滚动到某个阈值点（例如，从视口顶部起10像素）为止，此后它就变得固定了。例如，它可用于使导航栏随页面滚动直到特定点，然后粘贴在页面顶部。

例如我们进行如下设置：

```css
.positioned {
  position: sticky;
  top: 30px;
  left: 30px;
}
```

这个元素起初会随着页面滚动，但是当它距离顶部为30px的时候会固定在视口上。



## 多列布局

**1. column-count**

在容器中设置`column-count`属性可以设置文章的列数，每列的宽度自动分配。

**2. column-width**

使用`column-width`设置每列的宽度，此时浏览器将**按照你指定的宽度尽可能多的创建列**；任何剩余的空间之后会被现有的列平分。 这意味着你可能无法期望得到你指定宽度，除非容器的宽度刚好可以被你指定的宽度除尽。

**3. column-gap 和 column-rule**

`column-gap`设置间隙宽度

`column-rule`是`column-rule-color`和`column-rule-style`，在间隙处显示分割线。

```css 示例
.container {
  column-count: 3;
  column-gap: 20px;
  column-rule: 4px dotted rgb(79, 185, 227);
}
```

**4. 内容折断**

如果内容由多个盒子组成，默认情况下盒子可能会被折断，在规则 `.card` 上添加属性[`break-inside`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/break-inside)，并设值 `avoid` 可以防止盒子被折断，现阶段，增加旧属性 `page-break-inside: avoid` 能够获得更好的浏览器支持。

```css 示例
.card {
  break-inside: avoid;
  page-break-inside: avoid;
  background-color: rgb(207,232,220);
  border: 2px solid rgb(79,185,227);
  padding: 10px;
  margin: 0 0 1em 0;
}
```



## 媒体查询

主要用于实现响应式设计。基础语法：

```css
@media media-type and (media-feature-rule) {
  /* CSS rules go here */
}
```

- **媒体类型**：

  - `all`
  - `print`
  - `screen`（常用）
  - `speech`

- **媒体特征规则：**

  - 宽和高（width，height，max-width，min-width等）

  - 朝向：`orientation: landscape`横向,`orientation: portrait`竖向

  - 使用指点设备：

    ```css
    @media (hover: hover) {
        body {
            color: rebeccapurple;
        }
    }
    ```

    这一媒体特征说明用户正在使用指点设备，而不是触摸屏或键盘导航。

**逻辑运算**

- 与：`and`
- 或：逗号
- 非：`not`



我们用媒体查询实现响应式设计，一般是使用**移动优先的响应式设计**，即从最小的视图开始设计，然后随着窗口越来越宽，我们加入一些媒体查询语句来使布局更适应页面。

