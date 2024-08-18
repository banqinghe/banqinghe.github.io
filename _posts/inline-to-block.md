---
title: "inline 元素自动变为 block 元素的两种情况"
date: "2020-10-06 21:26:11"
---

目前为止我遇到了两种不主动设置`display`，但inline元素可以自动转化成block元素的情况，分别是：

- 使用`absolute`和`fixed`定位的时候
- 父元素使用`flex`和`grid`布局的时候

## absolute定位和fixed定位的情况

在使用伪元素`::before`和`::after`的时候，使用`absolute`定位、设置宽度高度都是十分惯用的操作。但是MDN上对`::before`和`::after`的描述都是“It is inline by default.”，也就是说，`::before`和`::after`这两个伪元素默认都是内联（inline）元素，但是在定位操作后它们已经被转化成了块级（block）元素，从而能够设置宽度了。

做一下实验，对于多种`position`的值测试`::before`的表现形式：

```html HTML
<div class="container static"></div>
<div class="container relative"></div>
<div class="container absolute"></div>
<div class="container fixed"></div>
<div class="container sticky"></div>
```

```css CSS
.container {
  width: 200px;
  height: 200px;
  background: #ddd;
  margin: 10px;
  position: relative;
  border: 1px solid #ddd;
}

.container::before {
  width: 100px;
  height: 100px;
  font-size: 1.5em;
  color: red;
  background:yellow;
}

.static::before {
  position: static; /* position的默认值 */
  content: 'static';
}

.relative::before {
  position: relative;
  content: 'relative';
}

.absolute::before {
  position: absolute;
  content: 'absolute';
}

.fixed::before {
  position: fixed;
  content: 'fixed';
}

.sticky::before {
  position: sticky;
  content: 'sticky';
}
```

代码根据针对5种定位情况下的伪元素`::before`都设置了`width`和`height`，显示结果如下：

![](https://raw.githubusercontent.com/banqinghe/blog/main/images/inline%E5%85%83%E7%B4%A0%E8%87%AA%E5%8A%A8%E5%8F%98%E4%B8%BAblock%E5%85%83%E7%B4%A0%E7%9A%84%E4%B8%A4%E7%A7%8D%E6%83%85%E5%86%B5/5%E7%A7%8D%E5%AE%9A%E4%BD%8D.png)

可以很清楚地看到，使用`absolute`或`fixed`定位时，伪元素时block元素，因此`width`和`height`能够生效，但是使用其他三种定位时对宽度和高度的设置则均不生效。



## 使用flex和grid布局的情况

仍然使用上面的例子，在`.conatainer`中添加`flex`定位：

```css CSS
.container {
  width: 200px;
  height: 200px;
  background: #ddd;
  margin: 10px;
  position: relative;
  border: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.container span {
  width: 80px;
  height: 80px;
  background: red;
}
```

在`div`中加入`span`元素：

```html
<div class="container static"><span>static</span></div>
<div class="container relative"><span>relative</span></div>
<div class="container absolute"><span>absolute</span></div>
<div class="container fixed"><span>fixed</span></div>
<div class="container sticky"><span>sticky</span></div>
```

显示结果：

![](https://raw.githubusercontent.com/banqinghe/blog/main/images/inline%E5%85%83%E7%B4%A0%E8%87%AA%E5%8A%A8%E5%8F%98%E4%B8%BAblock%E5%85%83%E7%B4%A0%E7%9A%84%E4%B8%A4%E7%A7%8D%E6%83%85%E5%86%B5/%E4%BD%BF%E7%94%A8flex.png)

flex布局时针对`::before`的`width`和`height`竟然全部都生效了，与此同时，`<span>`元素也被转化为了block元素，所以宽度和高度设置也生效了。`<span>`作为inline元素，也被`flex`布局转化为了block元素。

还有一个问题在于，使用`absolute`和`fixed`定位的伪元素并没有像其他三种伪元素一样与`<span>`元素一起遵循`flex`布局，而是重叠覆盖了`<span>`元素。这两种定位之所以特殊，是因为它们并不属于正常文档布局流。文档的描述如下：

> The element is removed from the normal document flow, and no space is created for the element in the page layout.

我的理解是这时候`::before`和`<span>`元素实际上是处于不同的“次元”当中的，因此对于使用`absolute`和`fixed`定位的元素来说，`flex`布局是对它们独立生效的。

我认为也正是因为这种特殊性，使得由这两种定位控制的元素会默认被转化为块级元素。

<br>

对于`grid`布局，表现与`flex`布局时相同，这里不再赘述。
