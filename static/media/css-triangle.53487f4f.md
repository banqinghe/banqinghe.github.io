# CSS 实现三角形和对话框箭头

在直觉里CSS一直是在对矩形进行操作，而对于绘制其他几何图形则无能为力。但是借助一些有趣的特性，我们确实可以使用CSS绘制一些矩形之外的图形，本文中所讲的三角形是一个相当典型的例子。

## 绘制三角形

这里使用`border`属性生成三角形。首先我们绘制一个带有较粗边框矩形看看，为了辨别每个边框，我们为不同边框赋予了不同的颜色：

```css CSS
.box {
  width: 100px;
  height: 75px;
  border: 50px solid;
  border-top-color: red;
  border-right-color: green;
  border-bottom-color: orange;
  border-left-color: blue;
}
```

```html HTML
<div class="box"></div>
```

<div style="box-sizing: content-box;width: 100px; height: 75px; border: 50px solid; border-top-color: red; border-right-color: green; border-bottom-color: orange; border-left-color: blue;"></div>
这里就可以明显地看出在这种情况下，每个方向的边框其实并不是一个矩形，而是一个等腰梯形。

如果将`width`和`height`都置为0呢：

```css
.box {
  width: 0;
  height: 0;
  ...
}
```

<div style="width: 0; height: 0; border: 50px solid; border-top-color: red; border-right-color: green; border-bottom-color: orange; border-left-color: blue;"></div>


继续尝试去除上边的边框：

```css
.box {
  width: 0;
  height: 0;
  border: 50px solid;
  border-top: none;
  ...
}
```

<div style=" width: 0; height: 0; border: 50px solid; border-top: none; border-right-color: green; border-bottom-color: orange; border-left-color: blue;"></div>


然后把左右两边的边框设为透明：

```css
.box {
  width: 0;
  height: 0;
  border: 50px solid;
  border-top: none;
  border-right-color: transparent;
  border-bottom-color: orange;
  border-left-color: transparent;
}
```

  <div style="width: 0; height: 0; border: 50px solid; border-top: none; border-right-color: transparent; border-bottom-color: orange; border-left-color: transparent;"></div> 
至此，我们就成功得到了一个等腰直角三角形。

所以我们可以总结出：**使用`border`绘制三角形一共需要三条边框，三角形的高由构成三角形的边框宽度决定，而底长则由两条透明边宽度决定。**

使用这样方法绘制稍高一点、倾斜一些的三角形：

```css
.box {
  width: 0;
  height: 0;
  border-right: 60px solid transparent;
  border-left: 20px solid transparent;
  border-bottom: 80px orange solid;
}
```

<div style="width: 0; height: 0;border-right: 60px solid transparent; border-left: 20px solid transparent; border-bottom: 80px orange solid;"></div>
绘制成功



## 实现对话框箭头

一个带箭头的对话框其实就是一个矩形和三角形的组合：

![](https://gitee.com/banqinghe/blog-images/raw/master/CSS%E5%AE%9E%E7%8E%B0%E4%B8%89%E8%A7%92%E5%BD%A2%E5%92%8C%E5%AF%B9%E8%AF%9D%E6%A1%86%E7%AE%AD%E5%A4%B4/%E5%AF%B9%E8%AF%9D%E6%A1%86.png)

这里的箭头我们一般使用`::before`或`::after`来实现：

```css 对话框
.box {
  position: relative;
  padding: 10px;
  background-color: #eee;
  width: 200px;
}

.box::before {
  content: "";
  position: absolute;
  top: -10px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #eee;
}
```

这里需要注意有以下几点：

- `::before`伪元素使用`absolute`定位的位置是相对于`.box`的。

- `::before`伪元素的初始位置是content的左上角，这里由于为`.box`设置了padding，所以在未设置`left`和`right`的情况下箭头默认在content最左侧的上方。



以上代码可以很好的实现我们的目的，[nodejs.org](https://nodejs.org/)的导航栏就是使用的这种方式。但是这种方法也有其局限性，由于是使用边框来实现三角形，当我们想为这个对话框（包括三角箭头）添加一个边框的时候，使用这种方法就没有办法做到了。



## 实现箭头的方法二

对话框上的箭头不仅仅可以用`border`形成的三角形实现，也可以使用**矩形的一个角**来实现。

一个正方形，顺时针旋转45度，就可以露出一个方向朝上的直角：

<div style="width: 100px; height: 100px; border: 2px solid #000; border-right: none; border-bottom: none; background-color: #eee; transform: rotate(45deg); margin: 30px;"></div>
这个直角可以构成对话框的三角箭头，并且可以很方便地添加边框。

下面是一个对话框的实现示例：

```css
.box {
  position: relative;
  padding: 10px;
  border: 1px solid #000;
  background-color: #eee;
  width: 200px;
}

.box::before {
  content: "";
  position: absolute;
  top: -8px;
  left: 14px;
  padding: 7px;
  background: inherit;
  border: inherit;
  border-right: 0;
  border-bottom: 0;
  transform: rotate(45deg);
}
```

实现的结果：

![](https://gitee.com/banqinghe/blog-images/raw/master/CSS%E5%AE%9E%E7%8E%B0%E4%B8%89%E8%A7%92%E5%BD%A2%E5%92%8C%E5%AF%B9%E8%AF%9D%E6%A1%86%E7%AE%AD%E5%A4%B4/%E5%AF%B9%E8%AF%9D%E6%A1%862.png)

这种方法我是在《CSS揭秘》（<cite>CSS Secrets</cite>）上看到的，作者其实是想使用这个例子说明CSS中`inherit`为我们带来的便利。对于伪元素来说，它会继承宿主元素的属性值，因此我们能够方便直观地设置三角箭头的背景颜色和边框样式。

