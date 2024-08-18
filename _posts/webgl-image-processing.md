---
title: "WebGL 图像处理"
date: "2022-07-03 21:17:40"
---

Web 前端可以利用 Canvas API 和 WebGL 这两种技术实现在浏览器本地的图像处理。Canvas API 是最直观且方便的图像处理方式，但缺点是如果图片的像素数过高，逐像素的处理速度就会很慢，毕竟 JavaScript 这门语言的执行效率摆在这里，肯定不如更贴近底层的诸如 C++ 这种语言跑得快（Python 也是解释型语言，虽然没试过，但 Python 估计要更快一点）。

WebGL 为 Web 端的图像处理提供了弯道超车的机会，作为 OpenGL 的子集，通过借助 GPU 硬件加速，WebGL 理论上可以得到比使用 Canvas API 快得多的处理速度。我的本科毕业论文基于的一个重要技术点就是这个，虽然对于图形学开发者来说，这种处理没比 Hello World 难多少，但对我自己来说还算有点说头吧。

## 原理

WebGL 在向一个二维的平面上绘制纹理的时候主要会经历如图所示的以下步骤：

![WebGL 绘制纹理的过程](https://raw.githubusercontent.com/banqinghe/blog/main/images/webgl-image-processing/webgl-process.png)

对于一张矩形的图片来说，要将其显示到 WebGL 的画布上主要是经过两步的处理：

1. 利用顶点着色器将图片的四个顶点和画布的四个顶点联系起来
2. 利用片元着色器逐像素地对图像进行绘制操作

我们要处理的图像都是矩形的图像，所以顶点着色器这部分对于任何一种图像处理方式来说，都无需变化，毕竟只是简单地绑定图像顶点而已。图像处理算法实现的部分则是实现在片元着色器当中。

图形学中的“片元”这个概念，其实就是图片的像素，片元着色器会逐片元执行，也就是说，这套逻辑会自动对图片的每个像素执行一遍，这不就是一个拥有 GPU 加速的巨大 for 循环吗？

因此只需要在片元着色器里写好每个像素需要执行的逻辑，就可以愉快地完成图像处理操作了。例如，如果要进行一个最简单的反色操作，只需要在片元着色器代码中这样写：

```
precision mediump float;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;

void main() {
  vec4 sample = texture2D(u_Sampler, v_TexCoord);
  gl_FragColor = vec4(1.0 - sample.r, 1.0 - sample.g, 1.0 - sample.b, sample.a);
}
```

这玩意儿的语法类似 C 语言，逻辑编写上没有什么困难的地方。用 `texture2D()` 获取图片原始像素颜色数据，为 `gl_FragColor` 赋值新的处理后颜色数即可。

GLSL 代码里可以 if、while、for、根据相对位置获取周边像素的信息，有了这些实现各种图像处理算法基本上是水到渠成的。

## 实现

WebGL 比较费劲的操作是初始化，编译、链接着色器程序，绑定顶点这些操作都要纯手工打造，还是比较费劲的，我感觉这些繁琐的步骤也是一个劝退因素吧😵‍💫。每个着色器程序在编译和链接完成之后，会成为一个可以被 WebGL Context 利用 `useProgram()` 方法选择调用的 `WebGLProgram` 对象，这样的一个很大的好处是，所有的程序在程序刚刚初始化的时候就可以准备完毕，如果使用过程中需要切换图像处理算法，只需要直接调用即可，而不是调用一次编译一次。

每个图像处理算法可以写成一个单独的模块，由一个会被外部调用的 js 文件和算法实现的片元着色器代码文件实现。最开始顶点位置绑定的操作只需要执行一次，所以这里可以分离出一个单纯进行图像渲染的模块，而别的模块则进行不同的图像处理。

`<canvas>` 元素的 `width` 和 `height` 设置了画布的大小（在这里就是和图像宽高完全一致），而 CSS 样式则可以进一步在这个尺寸上进行拉伸。如果一张图片尺寸大到浏览器视口显示不完全，我们依然可以使用 CSS 减小其显示大小，而不破坏在画布上渲染的精度。

## 我遇到的问题

虽然原理看起来挺简单，但是我在构建整个应用的时候还是遇到了挺多问题的。

### 画布内容转化为图像

一开始我发现 WebGL 的画布保存为图片之后就是一片黑，后来发现源头是在 `getContext` 的时候需要传递 `preserveDrawingBuffer` 这个参数为 `true` 才可以顺利保存。此参数默认值为 `false`，效果是会自动 clear 整个画布。

### 转化为图像速度很慢

我写的应用里有 WebGL 和 Canvas 两种处理方式相互转换的需求，在发生这种模式转换的时候，由于需要新的 context，所以需要保存当前图像并且渲染到新的 `<canvas>` 上去。转换的过程很慢，看了火焰图大概了解了速度是被 `<canvas> -> 图片 URL` 这个过程拖慢的。

一开始我使用的转化图像的方式是 `canvas.toDataURL()`，方法，结果慢得离谱。后来使用更先进的 `toBlob()` 方法，转化速度有所提升，但是图像较大时依然卡顿比较明显。

然后……过了挺久之后，我才看文档发现 `<canvas>` 元素之间传递 canvas DOM 对象也能实现图像的传递，根本不需要转化图片这个过程💢

> `drawImage()` 接受 `HTMLCanvasElement` 作为参数（Canvas）
>
> `texImage2D()` 接受 `HTMLCanvasElement` 作为参数（WebGL）

## 执行效率

虽然理论上 WebGL 的处理速度可以完爆使用 JavaScript 计算的 Canvas API，但是我测试的时候发现，对于一些较小的图片，Canvas API 执行的会更快，这应该是由于 WebGL 需要一定的启动时间导致的。另外，由于 V8 引擎有 JIT 的机制，如果多次利用 Canvas API 执行相同的操作，执行速度会越来越快，最终稳定在一个较小的值，WebGL 则没有这一特点。

这里放一个不权威也不负责的测试结果：

![WebGL 和 Canvas 处理速度同一张图片10次速度对比](https://raw.githubusercontent.com/banqinghe/blog/main/images/webgl-image-processing/duration.png)

其实我感觉 WebGL 处理速度还是太慢了，按理这么底层的技术处理起来应该很快啊，可是使用起来老是卡顿明显。为啥手机上的照片编辑就跑的这么丝滑？

## 应用

毕设项目是这个：[web-image-processing](https://github.com/banqinghe/web-image-processing)，后来还想重构一下，但是写了两天之后又搁置了（懒），不知道啥时候还能再捡起来。

后来因为最近老是要搞电子签名这种东西，又做了一个原理一模一样，但是只是用来进行二值化的东西 [thresholding](https://github.com/banqinghe/thresholding)，这个 repo 代码质量能稍微强点（我应该是比几个月之前有所进步了）。
