---
title: "CSS 笔记(1) 基础知识"
date: "2020-05-15 19:07:49"
---

这是学习CSS的第一篇笔记，讲述的是十分基础的知识点，包括选择器的使用，盒模型，背景边框。并没有详细介绍如何样式化各种元素。和前面的HTML笔记一样，参考的是MDN网站上的CSS入门教程。

## 入门基础

使用类类如下面的HTML语句将CSS引入HTML：

```html
<link rel="stylesheet" href="styles.css">
```

列表里的`list-style-type`，改变项目符号。

### 使用类

使用**类**可以为不同地方的元素设置不同样式，避免所有的元素都一个样子。

在CSS代码中使用 `.类名` 的方式定义一个类：

```css
.special {
  color: orange;
  font-weight: bold;
}
```

在HTML文件中使用`class`属性引用CSS类：

```html
<ul>
  <li>项目一</li>
  <li class="special">项目二</li>
  <li>项目 <em>三</em></li>
</ul>
```

也可以设定好只允许某些元素能使用这个类：

```css
li.special,
span.special {
    color: orange;
    font-weight: bold;
}
```

### 根据不同情况样式

**1. 根据元素在文档中的位置确定样式**

仅选择嵌套在`` 元素内的``我们可以使用一个称为**包含选择符**的选择器，它只是单纯地在两个选择器之间加上一个空格：

```css
li em {
  color: rebeccapurple;
}
```

该选择器将选择`<li>`内部的任何`<em>`元素（`<li>`的后代）。



另一些可能想尝试的事情是在HTML文档中设置直接出现在标题后面并且与标题具有相同层级的段落样式，为此需在两个选择器之间添加一个 `+` 号 (成为 **相邻选择符**)

```css
h1 + p {
  font-size: 200%;
}
```

这样会使`<h1>`相邻后面的`<p>`才会变大，其他的`<p>`则不受影响。

**2. 根据状态确定样式**

当我们修改一个链接的样式时我们需要定位（针对） `<a>` （锚）标签。取决于是否是**未访问的、访问过的、被鼠标悬停的、被键盘定位的，亦或是正在被点击当中的状态**，这个标签有着不同的状态。

```css
/* 未被访问 */
a:link {
    color: pink;
}

/* 访问过 */
a:visited {
    color: green;
}

/* 鼠标悬停 */
a:hover {
    text-decoration: none;
}
```

**3. 将选择子和关系选择器组合起来**

```css
body h1 + p .special {
  color: yellow;
  background-color: black;
  padding: 5px;
}
```

上面的代码为以下元素建立样式：在`<body>`之内，紧接在`<h1>`后面的`<p>`元素的内部，类名为special。



### 在HTML中使用CSS的几种方式

**1. 外部样式表**

在HTML代码`<head>`中引入`.css`文件：

```html
<link rel="stylesheet" href="styles.css">
```

**2. 内部样式表**

在`<head>`中的`<style>`标签内写CSS代码。

**3. 内联样式**

直接使用HTML元素的`style`属性。其特点是每个CSS表只影响一个元素，但是一般情况下并不推荐使用。

```html
<h1 style="color: blue;background-color: yellow;border: 1px solid black;">Hello World!</h1>
```



### 选择器

每个CSS规则都以一个选择器或一组选择器为开始，去告诉浏览器这些规则应该应用到哪些元素上。以下都是有效的选择器或组合选择器的示例。

```css
h1
a:link
.manythings
#onething
*
.box p
.box p:first-child
h1, h2, .intro
```

如果两个选择器都选中了一个元素，CSS有自己的规则判断应该遵守哪一个样式（这些规则称为级联规则和专用规则）。目前需要知道的是如果两个规则同级，以后面的为准。如果是类和普通规则，则类的优先级更高。



### @rules

**@import：**将额外的样式表导入主CSS样式表

```css
@import 'styles2.css'
```

**@media：**使用媒体查询来应用CSS，仅当某些条件成立的时候应用：

```css
@media (min-width: 30em) {
    body {
        background-color: blue;
    }
}
```

**@support：**检查当前浏览器是否支持某一属性。



### 速记属性

一些属性，如 `font`, `background`, `padding`, `border`, and `margin` 等属性称为速记属性——这是因为它们允许您在一行中设置多个属性值，从而节省时间并使代码更整洁。

例如下面两个规则，作用完全相同：

```css
padding: 10px 15px 15px 5px;

padding-top: 10px;
padding-right: 15px;
padding-bottom: 15px;
padding-left: 5px;
```

同理：

```css
background: red url(bg-graphic.png) 10px 10px repeat-x fixed;

background-color: red;
background-image: url(bg-graphic.png);
background-position: 10px 10px;
background-repeat: repeat-x;
background-scroll: fixed;
```



## 层叠与继承

- 两条同级别的规则作用到一个元素的时候，写在后面的是实际使用的规则。
- 浏览器根据优先级选择使用哪个规则，一般会选择更加“具体”的规则，类比普通规则更加具体，所以优先使用类。
- **继承：**一些设置在父元素上的CSS属性是可以被子元素继承的，有些则不能。譬如`color` 和 `font-family`可以被继承，`width`却不会。**哪些属性属于默认继承很大程度上是由常识决定的。**



### 控制继承

CSS 为控制继承提供了四个特殊的通用属性值。每个CSS属性都接收这些值。

<dl>
    <dt><b>inherit</b></dt>
    <dd>设置该属性会使子元素属性和父元素相同。实际上，就是 "开启继承".</dd>
    <dt><b>initial</b></dt>
    <dd>设置属性值和浏览器默认样式相同。如果浏览器默认样式中未设置且该属性是自然继承的，那么会设置为inherit</dd>
    <dt><b>unset</b></dt>
    <dd>将属性重置为自然值，也就是如果属性是自然继承那么就是 inherit，否则和 initial一样</dd>
</dl>

> 注: 还有一个新的属性, revert， 只有很少的浏览器支持。



`all`关键字表示所有的属性，可以使用`all: unset;`来重置所有属性。



### 理解层叠

有三个因素需要考虑，根据重要性排序如下，前面的更重要：

1. **重要程度（!important）：**例如一个属性为`border: none !important;`这时这一属性就不会被其他规则覆盖。谨慎使用。

   > **注**： 覆盖 `!important` 唯一的办法就是另一个 `!important` 具有 相同*优先级* 而且顺序靠后，或者更高优先级。

2. **优先级：**

   不同类型的选择器有不同的分数值，把这些分数相加就得到特定选择器的权重，然后就可以进行匹配。

   一个选择器的优先级可以说是由四个部分相加 (分量)，可以认为是个十百千 — 四位数的四个位数：

   1. **千位**： 如果声明在 `style` 的属性（内联样式）则该位得一分。这样的声明没有选择器，所以它得分总是1000。
   2. **百位**： 选择器中包含ID选择器则该位得一分。
   3. **十位**： 选择器中包含类选择器、属性选择器或者伪类则该位得一分。
   4. **个位**：选择器中包含元素、伪元素选择器则该位得一分。

   下面是一个简单说明：

   | 选择器                                    | 千位 | 百位 | 十位 | 个位 | 优先级 |
   | :---------------------------------------- | :--- | :--- | :--- | :--- | :----- |
   | `h1`                                      | 0    | 0    | 0    | 1    | 0001   |
   | `h1 + p::first-letter`                    | 0    | 0    | 0    | 3    | 0003   |
   | `li > a[href*="en-US"] > .inline-warning` | 0    | 0    | 2    | 2    | 0022   |
   | `#identifier`                             | 0    | 1    | 0    | 0    | 0100   |
   | 内联样式                                  | 1    | 0    | 0    | 0    | 1000   |

3. **资源顺序：**如果你有超过一条规则，而且都是相同的权重，那么最后面的规则会应用。

关于如何组织各种元素，常见的做法是给基本元素定义通用样式，然后给不同的元素创建对应的类。



## CSS选择器

记录选择器的种类：

### 类型、类、ID选择器

**类型选择器**

```css
h1 { }
```

**类选择器**

```css
.box { }
```

**ID选择器**

ID是唯一的。网上看到的建议是ID用于JS，而class用于CSS。

```css
#unique { }
```



### 标签属性选择器

```css
a[title] { }
a[href="https://example.com"] { }
```

**存否和值选择器：**

| 选择器          | 示例                            | 描述                                                         |
| :-------------- | :------------------------------ | :----------------------------------------------------------- |
| `[attr]`        | `a[title]`                      | 匹配带有一个名为*attr*的属性的元素——方括号里的值。           |
| `[attr=value]`  | `a[href="https://example.com"]` | 匹配带有一个名为*attr*的属性的元素，其值正为*value*——引号中的字符串。 |
| `[attr~=value]` | `p[class~="special"]`           | 匹配带有一个名为*attr*的属性的元素 ，其值正为*value*，或者匹配带有一个*attr*属性的元素，其值有一个或者更多，至少有一个和*value*匹配。注意，在一列中的好几个值，是用空格隔开的。 |
| `[attr|=value]` | `div[lang|="zh"]`               | 匹配带有一个名为*attr*的属性的元素，其值正为*value*，或者开始为*value*，后面紧随着一个连字符。 |

**字符串匹配：**

| 选择器          | 示例                | 描述                                                         |
| :-------------- | :------------------ | :----------------------------------------------------------- |
| `[attr^=value]` | `li[class^="box-"]` | 匹配带有一个名为*attr*的属性的元素，其值开头为*value*子字符串。 |
| `[attr$=value]` | `li[class$="-box"]` | 匹配带有一个名为*attr*的属性的元素，其值结尾为*value*子字符串 |
| `[attr*=value]` | `li[class*="box"]`  | 匹配带有一个名为*attr*的属性的元素，其值的字符串中的任何地方，至少出现了一次*value*子字符串。 |

上面的匹配都默认大小写敏感，在方括号末尾添加一个字母`i`，代表大小写不敏感：

```css
li[class^="a" i] {
    color: red;
}
```



### 伪类和伪元素

**伪类**是一个选择处于特定状态的元素的选择器，比如鼠标悬浮的时候。

```css
a:hover { }
```

一个简单的例子是我们每次都想让文章的第一段变大加粗，可以为这个段加上一个类，为这个类添加CSS。手动的为第一个`<p>`添加类并不方便，以为还要考虑到文章随时可能发生变动。所以使用伪类会更加方便。

```css
/* 选中article中的第一个p */
article p:first-child {
    font-size: 120%;
    font-weight: bold;
}
```

> 需要留意`first-child`和`first-of-type`的区别，`first-child` 要求`<article>`中的第一个元素就是`<p>`，而`first-of-type`不需要。



**伪元素**（选择一个元素的某个部分而不是元素自己）例如，`::first-line`总是会选择一个元素中的第一行。

```css
p::first-line { }
```

伪类和伪元素也可以结合起来，比如下面的CSS规则选中了`article`中第一个`p`的第一行：

```css
article p:first-child::first-line {
  font-size: 120%;
  font-weight: bold;
}
```

**生成带有::before和::after的内容**

`::before`和`::after`和`content`一起使用，用于在一段内容的前面或后面添加一个内容：

```css
.box::before {
    content: "This should show before the other content."
}
```

```html
<p class="box">Content in the box in my HTML page.</p>
```

上面代码最终的结果是，显示

```
This should show before the other content.Content in the box in my HTML page.
```

更常用的方式是插入一个图标，比如一个箭头`➥`，作为一个屏幕阅读器不会读出，只作为视觉提示器的元素。这种方式可以被用来生成各东西，比如一个箭头：[cssarrowplease.com](http://www.cssarrowplease.com/)

在这里查看伪类和伪元素的参考：[参考节](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements)



### 关系选择器

**后代选择器**

比如

```css
body article p
```

```css
.box p {
    color: red;
}
```

**子代关系选择器**

可以理解成是后代选择器的子集，只会在**选择器选中直接子元素的时候匹配**。继承关系上更远的后代则不会匹配。例如，

下面的示例用子元素运算符（`>`）选择了`<article>`元素的初代子元素。

```css
article > p { }
```

**邻接兄弟**

邻接兄弟选择器（`+`）用来选中恰好处于另一个在继承关系上同级的元素旁边的物件。例如，选中所有紧随``元素之后的``元素：

```css
p + img
```

**通用兄弟**

如果你想选中一个元素的兄弟元素，即使它们不直接相邻，你还是可以使用通用兄弟关系选择器（`~`）。要选中所有的`<p>`元素**后任何地方**的`<img>`元素，我们会这样做：

```css
p ~ img
```



## 盒模型

### 块级盒子和内联盒子

**块级盒子(block box)** 和 **内联盒子(inline box)**。这两种盒子会在**页面流**（page flow）和**元素之间的关系**方面表现出不同的行为:

- **块级盒子**
  - 盒子会在内联的方向上扩展并占据父容器在该方向上的所有可用空间，在绝大数情况下意味着盒子会和父容器一样宽
  - 每个盒子都会换行
  - [`width`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width) 和 [`height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height) 属性可以发挥作用
  - 内边距（padding）, 外边距（margin） 和 边框（border） 会将其他元素从当前盒子周围“推开”
- **内联盒子**
  - 盒子不会产生换行。
  - [`width`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width) 和 [`height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height) 属性将不起作用。
  - 内边距、外边距以及边框会被应用但是不会把其他处于 `inline` 状态的盒子推开。

除非特殊指定，诸如标题(`<h1>`等)和段落(`<p>`)默认情况下都是块级的盒子。用做链接的 `<a>` 元素、 `<span>`、 `<em>` 以及 `<strong>` 都是默认处于 `inline` 状态的。

我们通过对盒子[`display`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display) 属性的设置，比如 `inline` 或者 `block` ，来控制盒子的外部显示类型。

`display`有一个特殊的值**inline-block**，它在内联和块之间提供了一个中间状态。它会使`width`和`height`生效，使盒子不与其他内容重叠，但是也不会主动换行。

> **补充：关于内部和外部模型**
>
> css的box模型有一个外部显示类型，来决定盒子是块级还是内联。同样盒模型还有内部显示类型，它决定了盒子内部元素是如何布局的。默认情况下是按照 **[正常文档流](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Normal_Flow)** 布局，也意味着它们和其他块元素以及内联元素一样(如上所述)。如果设置 `display: flex`，在一个元素上，外部显示类型是 `block`，但是内部显示类型修改为 `flex`。



这里使用文字介绍还是太抽象了点，用网站给出的例子会更易理解：[不同显示类型的例子](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/The_box_model)



### 什么是CSS盒模型

CSS中组成一个块级盒子需要:

- **Content box**: 这个区域是用来显示内容，大小可以通过设置 [`width`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width) 和 [`height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height).
- **Padding box**: 包围在内容区域外部的空白区域； 大小通过 [`padding`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/padding) 相关属性设置。
- **Border box**: 边框盒包裹内容和内边距。大小通过 [`border`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border) 相关属性设置。
- **Margin box**: 这是最外面的区域，是盒子和其他元素之间的空白区域。大小通过 [`margin`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin) 相关属性设置。

<img src="https://mdn.mozillademos.org/files/16558/box-model.png" style="margin:  0 auto;">

在标准模型中，如果你给盒设置 `width` 和 `height`，实际设置的是 *content box*。 padding 和 border 再加上设置的宽高一起决定整个盒子的大小

```css
.box {
  width: 350px;
  height: 150px;
  margin: 25px;
  padding: 25px;
  border: 5px solid black;
}
```

<img src="https://mdn.mozillademos.org/files/16559/standard-box-model.png" style="magrin: 0 auto;">

无论是`padding`（内边距）还是`margin`（外边距）都有四种指定情况：

- **只有一个** 值时，这个值会被指定给全部的 **四个边**.
- **两个** 值时，第一个值被匹配给 **上和下**, 第二个值被匹配给 **左和右**.
- **三个** 值时，第一个值被匹配给 **上**, 第二个值被匹配给 **左和右**, 第三个值被匹配给 **下**.
- **四个** 值时，会依次按 **上、右、下、左** 的顺序匹配 (即顺时针顺序).

但是二者也有不同的地方：

- 二者均接受`<length>`和`<percentage>`，但是只有`margin`接受`auto`，一般用于控制居中：

  ```css
  /* 水平居中 */
  margin: 0 auto
  ```

- `margin`允许设置为负数，但是`padding`不允许，外边距设置为负时，`border`会超过外边框。



**替代盒模型**

和标准盒模型不同，使用这个模型，所有宽度都是可见宽度，所以内容宽度是该宽度减去边框和填充部分。默认浏览器会使用标准模型。如果需要使用替代模型，您可以通过为其设置 `box-sizing: border-box` 来实现。



### 外边距，内边距，边框

一些特点已经在上一节中叙述，这里是一些补充。

**外边距折叠**

当块级元素（block）的[上外边距(margin-top)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin-top)和[下外边距(margin-bottom)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin-bottom)同时都有设定时只会只会保留最大边距，这种行为称为**边界折叠**（margin collapsing），有时也翻译为**外边距重叠**。

有三种情况会形成外边距重叠：

1. 同一层相邻元素之间
2. 没有内容将父元素和后代元素分开
3. 空的块级元素



> **注意：**
>
> - 如果参与折叠的外边距中包含负值，折叠后的外边距的值为最大的正边距与最小的负边距（即绝对值最大的负边距）的和，也就是说如果有-13px 8px 100px叠在一起，边界范围的技术就是 100px -13px的87px。
> - 如果所有参与折叠的外边距都为负，折叠后的外边距的值为最小的负边距的值。这一规则适用于相邻元素和嵌套元素。



**边框（border）设置**

边框有三种属性可以设置：`width`，`style`，`color`。

- 可以设置每个边的宽度、样式、颜色
  - `border-top`
  - `border-right`
  - `border-bottom`
  - `border-left`
- 设置所有边的宽度、样式、颜色
  - `border-width`
  - `border-style`
  - `border-color`
- 也可以单独设置每个边的属性，如`border-top-width`等



## 背景与边框

### CSS的背景样式

**1. 背景颜色**

使用`background-color`定义。



**2. 背景图片**

使用`background-image`属性定义。

- 默认情况下，**大图不会缩小以适应方框**，因此我们只能看到它的一个小角，而**小图则是平铺以填充方框**。

  大图默认会被裁剪，我们可以使用 [`background-size`]属性，它可以设置长度或百分比值，来调整图像的大小以适应背景。也有下面两个关键字可供选择：

  - `cover` —浏览器将使图像足够大，使它完全覆盖了盒子区，同时仍然保持其高宽比。在这种情况下，有些图像可能会跳出盒子外
  - `contain` — 浏览器将使图像的大小适合盒子内。在这种情况下，如果图像的长宽比与盒子的长宽比不同，则可能在图像的任何一边或顶部和底部出现间隙。



  小图通过平铺填充方框，我们可以使用`background-repeat`来控制平铺行为：

  - `no-repeat` — 不重复。
  - `repeat-x` —水平重复。
  - `repeat-y` —垂直重复。
  - `repeat` — 在两个方向重复。

- **如果除了背景图像外，还指定了背景颜色，则图像将显示在颜色的顶部。**



**3. 背景图像定位**

[`background-position`]属性允许您选择背景图像显示在其应用到的盒子中的位置。它使用的坐标系中，框的左上角是(0,0)，框沿着水平(x)和垂直(y)轴定位。

取值可以是长度单位，百分比和`top`，`right`，`bottom`，`left`和`center`



**4. 渐变背景**

使用渐变图像生成器：[CSS Gradient](https://cssgradient.io/)

效果如下：

```css
background: radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%);
```

<div style="background: radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%); padding: 5em 1em"></div>
渐变背景有线性的和径向的（上面的示例为径向 radial），都可以在上面的网站里选择生成。



**5. 多个背景图像**

在单个属性值中指定多个`background-image`值，用逗号分隔每个值。先列出的在顶部。其他 `background-*`属性也可以有值逗号分隔的方式相同的`background-image`：

```css
background-image: url(image1.png), url(image2.png), url(image3.png), url(image1.png);
background-repeat: no-repeat, repeat-x, repeat;
background-position: 10px 20px,  top right;
```

> 当不同的属性具有不同数量的值时，会发生什么情况呢？答案是较小数量的值会循环—在上面的例子中有四个背景图像，但是只有两个背景位置值。前两个位置值将应用于前两个图像，然后它们将再次循环—image3将被赋予第一个位置值，image4将被赋予第二个位置值。



**6. 背景附加**

是指如何控制背景的滚动，这是由`background-attachment`属性控制的，有`scroll`，`fixed`，`	local`这三个值可以选择。

区别在MDN提供的文档里可以很直观的看出来：[background-attachment](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-attachment)

按我自己的理解，`local`是指背景和内容粘连在一起，背景和内容相对静止，一起滚动；`scroll`和`fixed`有点相像，区别是使用`scroll`时，背景在整个页面滚动时才滚动，否则不随内容滚动；而使用`fixed`时，无论是页面滚动还是仅仅是内容滚动，背景都不会滚动。



**7. 使用background速记属性**

如果使用多个背景，则需要为第一个背景指定所有普通属性，然后在逗号后面添加下一个背景。这里有一些规则，需要在简写背景属性时遵循，例如:

- `background-color` 只能在逗号之后指定。
- `background-size` 值只能包含在背景位置之后，用'/'字符分隔，例如：`center/80%`。

查看[background](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background)的MDN页面，以查看所有的注意事项。



### 边框

盒模型的最后一节已经介绍了一些`border`知识，边框有四个方向，三种属性（`width`，`style`，`color`）。

目前接触到的边框样式有实线（`solid`），虚线（`dashed`），圆点虚线（`dotted`）和双线（`double`）这四种，具体样式参考官方文档：[border-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-style)

**圆角**

通过使用[`border-radius`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-radius)属性和与方框的每个角相关的长边来实现方框的圆角。

可以使用两个长度或百分比作为值，**第一个值定义水平半径，第二个值定义垂直半径**。在很多情况下，您将只传递一个值，这两个值都将使用。

也可以具体的指定某一个角，如使用`border-top-right-radius`指定右上的角。

一个例子：

```css
.box {
  border: 1px solid rebeccapurple;
  border-radius: 0.3em;
  border-top-right-radius: 10% 30%;
}
```

<div style="border: 1px solid rebeccapurple;
  border-radius: 0.3em;
  border-top-right-radius: 10% 30%;">
  <h2>Borders</h2>
  <p>Try changing the borders.</p>
</div>



## 处理不同方向的文本

### 书写模式

使用`writing-mode`设定书写模式，一般有三个值供选择：

- `horizontal-tb`: 块流向从上至下。对应的文本方向是横向的。
- `vertical-rl`: 块流向从右向左。对应的文本方向是纵向的。
- `vertical-lr`: 块流向从左向右。对应的文本方向是纵向的。

<div style="border: 1px solid black; background-color: #eeeeee">
    <div style="wiriting-mode: horizontal-tb; border: 1px solid black; margin: 1em;">
        This is <strong>horizontal-tb</strong> <br>
        second line
    </div>
    <div style="writing-mode: vertical-rl; border: 1px solid black; margin: 1em;">
        This is <strong>vertical-rl</strong> <br>
        second line
    </div>
    <div style="writing-mode: vertical-lr; border: 1px solid black; margin: 1em;">
        This is <strong>vertical-lr</strong> <br>
        second line
    </div>
</div>



### 逻辑属性和逻辑值

如果我们规定了宽度，横向书写文字出错，但是纵向书写文字的时候就可能因为宽度不够而使内容超出边框。

<img src="https://raw.githubusercontent.com/banqinghe/blog/main/images/CSS%E7%AC%94%E8%AE%B0-1-%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86/%E7%BA%B5%E5%90%91%E6%96%87%E5%AD%97%E6%BA%A2%E5%87%BA.png" style="width: 10em">



为了应对这种情况CSS中提供了一系列映射属性。这些属性用逻辑（**logical**）和相对变化（**flow relative**）代替了像宽`width`和高`height`一样的物理属性。

- 使用`inline-size`映射`width`
- 使用`block-size`映射`height`

在上面的例子中，使用`inline-size`代替`width`就可以避免文字超出边框的情况。



**其他映射**

上面提到宽度`width`被映射成了`inline-size`，其实无论是`padding`还是`border`都可以映射，它们都有上下左右四个方向，可以将物理值映射成逻辑值，映射的规律如下：

**top → block-start**

**right → inline-end**

**bottom → block-end**

**left → inline-start**

其实就是水平方向映射为`inline`，垂直方向映射为`block`，具体映射可以看MDN文档：[Logical Properties and Values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)



## 溢出的内容

当我们限制了盒子的大小的时候，如果内容过多，则有可能会有内容溢出。

我们使用`overflow`属性来控制元素溢出的方式，默认值为`visible`，也就是我们看到的溢出的样子。

属性值说明：

```css
/* 默认值。内容不会被修剪，会呈现在元素框之外 */
overflow: visible;

/* 内容会被修剪，并且其余内容不可见 */
overflow: hidden;

/* 内容会被修剪，浏览器会显示滚动条以便查看其余内容 */
overflow: scroll;

/* 由浏览器定夺，如果内容被修剪，就会显示滚动条 */
overflow: auto;

/* 规定从父元素继承overflow属性的值 */
overflow: inherit;
```

如果指定了两个关键字，第一个关键字应用于`overflow-x`，第二个关键字应用于`overflow-y`。否则，`overflow-x`和`overflow-y`都设置为相同的值。



## CSS的值和单位

| 数值类型       | 描述                                                         |
| :------------- | :----------------------------------------------------------- |
| `<integer>`    | `<integer>`是一个整数，比如1024或-55。                       |
| `<number>`     | `<number>`表示一个小数——它可能有小数点后面的部分，也可能没有，例如0.255、128或-1.2。 |
| `<dimension>`  | `<dimension>`是一个`<number>`，它有一个附加的单位，例如45deg、5s或10px。`<dimension>`是一个伞形类别，包括`<length>`、`<angle>`、`<time>`和`<resolution>`类型。 |
| `<percentage>` | `<percentage>`表示一些其他值的一部分，例如50%。百分比值总是相对于另一个量，例如，一个元素的长度相对于其父元素的长度。 |

### 长度单位

**绝对长度单位**

以下都是**绝对**长度单位——它们与其他任何东西都没有关系，通常被认为总是相同的大小。

| 单位 | 名称         | 等价换算            |
| :--- | :----------- | :------------------ |
| `cm` | 厘米         | 1cm = 96px/2.54     |
| `mm` | 毫米         | 1mm = 1/10th of 1cm |
| `Q`  | 四分之一毫米 | 1Q = 1/40th of 1cm  |
| `in` | 英寸         | 1in = 2.54cm = 96px |
| `pc` | 十二点活字   | 1pc = 1/16th of 1in |
| `pt` | 点           | 1pt = 1/72th of 1in |
| `px` | 像素         | 1px = 1/96th of 1in |

这些值中的大多数在用于打印时比用于屏幕输出时更有用。例如，我们通常不会在屏幕上使用cm。惟一一个您经常使用的值，估计就是px(像素)。

**相对长度单位**

相对长度单位相对于其他一些东西，比如父元素的字体大小，或者视图端口的大小。使用相对单位的好处是，经过一些仔细的规划，您可以使文本或其他元素的大小与页面上的其他内容相对应。下表列出了web开发中一些最有用的单位。

| 单位   | 相对于            |
| :----- | :---------------- |
| `em`   | 父元素的字体大小  |
| `ex`   | 字符“x”的高度     |
| `ch`   | 数字“0”的宽度     |
| `rem`  | 根元素的字体大小  |
| `lh`   | 元素的line-height |
| `vw`   | 视窗宽度的1%      |
| `vh`   | 视窗高度的1%      |
| `vmin` | 视窗较小尺寸的1%  |
| `vmax` | 视图大尺寸的1%    |

**em and rem**

概括地说，em单位的意思是“**父元素的字体大小**”，rem单位的意思是“**根元素的字体大小**”



### 百分比

百分比的问题在于，它们总是相对于其他值设置的。例如，如果将元素的字体大小设置为百分比，那么它将是元素父元素字体大小的百分比。如果使用百分比作为宽度值，那么它将是父值宽度的百分比。



### 颜色

现代计算机的标准颜色系统是24位的，它允许通过不同的红、绿、蓝通道的组合显示大约1670万种不同的颜色，每个通道有256个不同的值(256 x 256 x 256 = 16,777,216)。

**1. 颜色关键词**

可以直接使用颜色关键词指定颜色，如`green`，`black`，在[`<color>`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)页面可以查看完整的列表。

**2. 十六进制RGB值**

由三对值组成，每一对值代表一个颜色通道（红色、绿色和蓝色）的取值。也可以只有三个值，比如`#eeeeee`和`#eee`是等价的。

也可以额外加一对值表示透明度，`#eeeeee00`表示完全透明，`#eeeeeeff`则是完全不透明的，同理前面的表示也可以使用四个数字表示`#eee0`。

**3. RGB 和 RGBA 的值**

`rgb`函数有三个参数，分别表示三条颜色通道的数值，`rgba`则多了一条alpha，有四个参数，表示颜色的同时添加了透明度参数，取值在0-1之间。

这里需要注意还有一个属性`opacity`，但是`rgba`设置的是颜色的透明度，而`opacity`设置的是某一元素整体的透明度。

**4. HSL 和 HSLA 的值**

`hsl()` 函数接受色调、饱和度和亮度值作为参数，而不是红色、绿色和蓝色值，这些值的不同方式组合，可以区分1670万种颜色：

- **色调**： 颜色的底色。这个值在0和360之间，表示色轮周围的角度。
- **饱和度**： 颜色有多饱和？ 它的值为0 - 100%，其中0为无颜色(它将显示为灰色阴影)，100%为全色饱和度
- **亮度**：颜色有多亮？ 它从0 - 100%中获取一个值，其中0表示没有光(它将完全显示为黑色)，100%表示完全亮(它将完全显示为白色)



### 位置

`<position>` 数据类型表示一组2D坐标，用于定位一个元素，如背景图像(通过 `background-position`)。它可以使用关键字(如 `top`, `left`, `bottom`, `right`, 以及`center` )将元素与2D框的特定边界对齐，以及表示框的顶部和左侧边缘偏移量的长度。

一个典型的位置值由两个值组成——第一个值水平地设置位置，第二个值垂直地设置位置。如果只指定一个轴的值，另一个轴将默认为 `center`。



## 在CSS中调整大小

**把百分数作为内外边距**

当你用百分数设定内外边距的时候，值是以**内联尺寸**进行计算的，也即对于左右书写的语言来说的宽度。在我们的例子里面，所有的内外边距是这一宽度的10%，也就是说，你可以让盒子周围的内外边距大小相同。在你以这种方式使用百分数的时候，这是一个需要记住的事实。



**min-和max-尺寸**

在宽度和高度都未指定的时，如果不为一个box设置一个最小尺寸，当其中没有任何内容时，box的高度会是0，我们可以使用`min-height`和`max-height`指定最小和最大高度，这在避免溢出的同时并处理变化容量的内容的时候是很有用的。

[`max-width`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/max-width)的常见用法为，在没有足够空间以原有宽度展示图像时，让图像缩小，同时确保它们不会比这一宽度大。如果你使用了`max-width: 100%`，那么图像可以变得比原始尺寸更小，但是不会大于原始尺寸的100%。



## 图像、媒体和表单元素

图像和视频被描述为**[替换元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Replaced_element)**。 这意味着CSS不能影响这些元素的内部布局-仅影响它们在页面上于其他元素中的位置。

某些替换元素（例如图像和视频）也被描述为具有宽高比。 这意味着它在水平（x）和垂直（y）尺寸上均具有大小，并且默认情况下将使用文件的固有尺寸进行显示。



### 调整图像大小

**1. 使用max-width**

防止图像溢出盒子，常设置`img`中的`max-width`属性，值设置为100%。这种方式对`<video>`和`<iframe>`同样适用。

**2. 使用object-fit**

在使用`img`的属性防止图片溢出后，使用`object-fit`调整如何让图像盖住一个盒子。如果值为`cover`，图像会保持原比例，多余的地方被裁剪，如果我们将`contain`作为值，图像将会缩放到足以放到盒子里面的大小。如果它和盒子的比例不同，这将会导致“开天窗”的结果。

```css
img {
    /* 让图像填满盒子，但是长宽比例并不一定正确 */
  height: 100%;
  width: 100%;
   /* object-fit:"cover" */
}

.cover {
    /* 保持图像比例，裁剪多余部分 */
  object-fit: cover;
}

.contain {
  object-fit: contain;
}
```

如果已经使用了`img`中的`height: 100%; width: 100%`，那么`object-fit`的`fill`属性就没有必要了，因为二者作用完全相同。



> **布局时的情况：**在一个flex或者grid布局中，元素默认会把拉伸到充满整块区域。图像不会拉伸，而是会被对齐到网格区域或者弹性容器的起始处。



### form元素

> **重点**：你应该在改变表单样式的时候小心，确保对于用户而言，它们仍然很容易被认出来是表单元素。你也许可以建立一个无边框的表单输入，其背景也与周围的内容难以区分开来，但是这会让表单很难识别和填入。

**1. 继承和表单元素**

在一些浏览器中，表单元素默认不会继承字体样式，因此如果你想要确保你的表单填入区域使用body中或者一个父元素中定义的字体，你需要向你的CSS中加入这条规则。

```css
button,
input,
select,
textarea {
  font-family : inherit;
  font-size : 100%;
}
```

**2. 一般我们书写的模式**

```css
button,
input,
select,
textarea {
  font-family: inherit;
  font-size: 100%;
  box-sizing: border-box;
  padding: 0; margin: 0;
}

textarea {
  overflow: auto;
}
```

