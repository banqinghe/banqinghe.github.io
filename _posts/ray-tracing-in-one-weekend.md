---
title: "Ray Tracing in One Weekend 学习记录"
date: "2025-03-02 22:33:40"
---

在第三次开始学习 [Ray Tracing in One Weekend](https://raytracing.github.io/books/RayTracingInOneWeekend.html) 之后，我终于把它[完成了](https://github.com/banqinghe/ray-tracing)。虽然名字里是「One Weekend」，但是实际把整个教程认真看完我应该花了好多个 weekend，这其中一部分是由于语言上的 gap，另一部分则是因为算法本身的一些细节需要仔细思考才能理解。这篇博文主要就是记录一些我觉得思考了不少时间才理解的要点。

## 为什么光线要从相机发射？

在看第一遍教程的时候我感到疑惑，为什么相机是射出光线，然后把光线打到一个距离相机1单位远的虚拟的画布上，这个画布是要渲染的东西。相机约等于人眼，为啥渲染的东西不在人眼上呢？

想了一下人看到东西的原理，我明白了。每个人的眼睛/或者相机都可以抽象成一个点，我们看到的东西取决于什么光线打进了这个点里。我之前一直没有意识到的一点是，**光线是可逆的**。从相机发出射线，最先打到的东西，不就是应该看到的东西吗，悟了。

![](/images/ray-tracing-in-one-weekend/k9imPiPVZWcJMiVlG9bxh-0NFjgEyugDbyJAoK89Zwg=.svg)

渲染的时候是把视野限定成一个矩形，相机的焦距（代码里是 focalLength）固定，也就是视野夹角固定，物体离相机越近，投影越大，符合近大远小的特性。

人眼的视网膜如果是个矩形，看到的世界也大概是这么个样子。

## 光线击中物体

读整篇教程的时候我觉得第一个巧妙的地方就是光线命中球体的计算。光线可以表示成起点+方向\*射出距离 （$P(t) = Q + td$），而球体可以表示成 $(C-P)\cdot(C-P)=r^2$，将光线方程代入球体方程，得到一个未知数是 $t$ 的一元二次方程。方程有解则说明光线命中了球体。

如果光线命中了物体，则使用一个 `HitRecord` 结构来记录下这个点的信息，光线在打到 viewport 的路径上可能击中多个物体，所以需要始终选取离相机最近的 `HitRecord`。

`HitRecord` 存储了诸多数据，包括：

* 击中点的坐标
* 击中点处的球体法向量
* 击中点的材料
* 是否是从物体外部击中

「是否是从物体外部击中」这一数据在渲染玻璃球这种由两面的物体的时候会用到。相应的，法向量也总是取靠近入射光方向的那一边，这意味着如果是从外部集中物体，法向量朝外，反之则朝内。

我们需要存储光线和物体交叉点处的法向量，这一法向量有两种形式选择，但是无论选择哪种方式，我们都需要在着色的时候判断光线是从物体内部还是外部击中它的，这对渲染有两面的物体（例如玻璃球）是必要的。其实 record 里不记录入射光是否是从外部击中的、总是取朝物体外的法向量也可以，那就需要着色的时候再通过向量乘法计算入射光是从内部还是外部击中的。根据作者的描述，由于这个教程里着色函数数量 > 几何体 hit 函数数量，为了方便我们选择了把内外性记录在 `HitRecord` 里。

## Web Worker 和 OffscreenCanvas

在引入抗锯齿处理之后，我遇到了较为明显的性能问题。抗锯齿原理是在 1\*1 像素方格里做 n 个点的随机采样，将这 n 个点作为入射光的出发点，对最终计算出的颜色取平均值就得到更准确的颜色了，但这也使计算量变大了 n 倍，使 web 页面阻塞。

在 AI 的提示下我引入了 [Web Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API) 和 [OffscreenCanvas](https://developer.mozilla.org/zh-CN/docs/Web/API/OffscreenCanvas) 的组合，把整个 camera 类都放在了 worker 里，计算过程完全跑在 worker 里，前台页面没有任何操作上的阻塞（之前卡的标签页都要关不上了……）。worker 中不能访问实际的 DOM，自然也就无法拿到正确的 Canvas2D 对象，但是却可以通过 OffscreenCanvas 另辟蹊径。

```typescript
// camera.ts

const offscreenCanvas = new OffscreenCanvas(this.imageWidth, this.imageHeight);
const ctx = offscreenCanvas.getContext('2d')!;
const imageData = new ImageData(this.imageWidth, this.imageHeight);

...

// canvas 绘制完成之后通过转移所有权的方式把图像数据发送回主线程
ctx.putImageData(imageData, 0, 0);
const imageBitmap = offscreenCanvas.transferToImageBitmap();
self.postMessage({ imageBitmap }, [imageBitmap]);

// main.ts

// 主线程拿到数据后将其渲染到 canvas 上
renderWorker.onmessage = (event: MessageEvent<{ imageBitmap: ImageBitmap }>) => {
    const { imageBitmap } = event.data;
    canvas.ctx.drawImage(imageBitmap, 0, 0);
};
```

> 想起来我以前写的一个图像处理 Web App，不知道 worker 的 postMessage 有第二个参数，还有转移所有权这种操作，就把图像数据作为一个数组直接发送出去，结果巨慢无比😓

用 worker 的一个坑是传输的数据需要被结构化克隆一下，这意味着对象里的函数传不过去。由于整个程序的设计都是面向对象的，所以写到一半发现 new 过的对象传到 worker 那边之后就不正确。只能单独写一些 config 类型，在 worker 中通过这些 config new 出对应的对象们。

## 误差处理

在计算交点时会出现误差（误差的英文是 `error`，翻译原文的时候会把它翻译成「错误」，这就并不准确），这可能导致反射光的起始点位于物体内部，而这束光将从内部再次击中物体，导致交点处的颜色比预期更暗。

![](/images/ray-tracing-in-one-weekend/ft_b7UZw4Z_MjMjeRr7gTiKid8kD1xP3Of3N3A1uIjg=.svg)

因为光线出发点是贴着物体的，所以这次不符合预期的击中 t 值非常小，大概是 0.00000001 这个量级，所以我们把碰撞 interval 的起点设置成稍大于它，就可以过滤掉这次无效的命中了。

下面是 `interval = [0, Infinity)` 和 `interval = [0.001, Infinity)` 的对比，改正之后物体明显更亮了一些，这更符合实际预期。

<div style="display:flex;gap:4px;align-items:center">
<img style="flex:1;width:0" src="/images/ray-tracing-in-one-weekend/0F1ZWZcaiBfjswBymDy3q-fIwMuDDxqRjg1ZEucOBEs=.png" alt="before">
➜
<img style="flex:1;width:0" src="/images/ray-tracing-in-one-weekend/89a70wIcw9tL-qN7S6F5Z2VIwBmCo1U9knhWGzo-lJU=.png" alt="after">
</div>

浮点数计算总是会有误差的存在，代码里经常能见一些避免浮点误差的防御性操作，例如在通过向量点乘计算 cos 值的时候：

```typescript
// due to precision issues, use Math.min() to avoid calculation results slightly greater than 1
const cosTheta = Math.min(dot(uv.negate(), n), 1);
```

cos 值不可能大于1，但是由于精度误差这种情况确实可能存在，所以这里 `Math.min(1)` 的操作就很有必要。

## 伽马矫正

这里我们把球体的灰度设置为 0.5，但是实际渲染出的球体还是太暗，颜色并没有是中灰色，反倒是灰度设置成 0.7 的时候灰度更像是中灰。这是由于计算机在渲染颜色点的时候会对 RGB 分量做一次伽马变换。伽马变换造成的结果就是灰度空间并不是线性的。

这里用 CSS 做个例子，下面的元素使用 `linear-gradient` 染色，但是灰度变换看起来却并不是 linear 的，浅灰度所占的长度明显更小一些。

```css
div {
    background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
}
```

<div style="width:100%;height:60px;background:linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));"></div>

为 RGB 的每个分量做一下平方根，可以近似地做到伽马矫正，让 rgba(0, 0, 0, 0.5) 更接近中灰色。

```typescript
function linearToGamma(linearComponent: number) {
    if (linearComponent > 0) {
        return Math.sqrt(linearComponent);
    }
    return 0;
}

let r = pixelColor.x;
let g = pixelColor.y;
let b = pixelColor.z;

// gamma correction
r = linearToGamma(r);
g = linearToGamma(g);
b = linearToGamma(b);
```

![](/images/ray-tracing-in-one-weekend/djCSQzd4ghMGnCazMzDr5VcowE2-1Y3KfWbY5ew6rnE=.png)

平方根是一种很简易的方式，矫正结果算不上并不准确，但是效果还可以，并且由于简单也节省了计算开销。

## 散焦模糊

通过在一个圆面上偏移光线起点，可以做到焦距上的物体最清晰，离焦距越远的物体越模糊的效果。

![](/images/ray-tracing-in-one-weekend/oI1rLEOQ5yQ1UJsjw0dWaJipUv0guhfq5q_DGlwwzF4=.svg)

这主要是因为起点变化了，就会导致命中点的变化，那视图上实际渲染的颜色就是球体上另一个位置的颜色了。这种色值的不准确导致我们看起来发生了模糊。

如果命中点刚好在焦距距离上（也就是在视图平面上），即使起点偏移，也不会影响最终渲染的颜色；命中点离视图平面越远，则命中点更可能偏移到更远的位置上去，导致色彩不准确程度变大，看起来也就是模糊程度变大了。

## 题外话

原始网页字体实在是不美观，个人觉得到了影响阅读体验的程度，我下载了个 Geist 字体换上之后好多了。发现了一个叫「User JavaScript and CSS」的 Chrome 插件，可以为页面自定义 JavaScript 和 CSS，好用。
