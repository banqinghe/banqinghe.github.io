---
title: "[Note] Computer Graphics from Scratch - Part I: Raytracing"
date: "2025-11-09 14:40:40"
---

「渲染」这个动词可以理解成把「看到」的三维世界绘制在一个二维的平面上。要做到这一点，需要一些定义：

|     |     |
| --- | --- |
| 场景（scene） | 我们需要观测的三维空间 |
| 摄像机（camera） | 用来观测三维空间的相机 |
| 视口（viewport） | 在三维空间里放置的一扇「窗户」，所有透过这扇窗、射入 camera 的光，组成了需要被渲染的 2D 图像 |
| 画布（canvas） | 2D 图像实际被绘制的地方，在 Web 中，它一般是 canvas 元素 |

坐标系说明：

::: table-fixed-container
|  scene  | viewport | canvas |
| --- | --- | --- |
|  ![](/images/computer-graphics-from-scratch-part1/scene.svg)  |  ![](/images/computer-graphics-from-scratch-part1/viewport.svg) | ![](/images/computer-graphics-from-scratch-part1/canvas.svg) |
| 场景坐标系是一个*右手坐标系*，x y 轴分别指向右方和上方，z 轴指向前方 | 视口坐标系是一个常规的 2D 坐标系，原点位于正中央 | canvas 是我们要绘制的对象，它的坐标系默认是原点在左上方，且绘制的时候是需要以 px 为单位的，测试的时候我们设画布尺寸为 400px × 400px |
:::

定义好坐标系之后，就能把渲染要做的事情串联起来了：

![](/images/computer-graphics-from-scratch-part1/render-pipeline.svg)

我们设 viewport 尺寸是 1 × 1（单位不重要，所以这里省去），其中心位于 scene 坐标系的 $(0, 0, 1)$ 位置，camera 在 scene 坐标系的原点。场景中有一个球体，在 viewport 后方。

如何计算 viewport 上应该绘制什么呢？从 camera 发射光线，由于 canvas 是 400px 的长宽，那我们就发射 400 × 400 条光线，均匀射向 viewport 上的每个区域，从左上角到右下角，按 viewport 的坐标来看，它们分别是：

```
(-0.5 +   0/400, -0.5 +   0/400, 1) -> (-0.5, -0.5, 1) 左上角
(-0.5 +   1/400, -0.5 +   1/400, 1)
(-0.5 +   2/400, -0.5 +   2/400, 1)
...
(-0.5 + 400/400, -0.5 + 400/400, 1) -> ( 0.5,  0.5, 1) 右下角
```

如果射出的这条线击中了物体，则这个对应的位置就渲染相应的颜色，否则就展示场景的背景色。至于击中物体时展示什么颜色，那就是光线追踪算法的主要部分了。

有了整个链路大概做什么，我们就可以把代码框架写出来了。我的实现里使用了 `gl-matrix` 来做向量计算，`vec3` 就来自它。

```js
function main() {
    for (let x = -400 / 2; x < 400 / 2; x++) {
        for (let y = -400 / 2; y < 400 / 2; y++) {
            // 从 camera 指向 viewport 上的向量
            const direction = vec3.fromValues(x * (1 / 400), y * (1 / 400), 1);

            // 追踪每一条射出的光线, 得到最终颜色绘制在 canvas 上
            const color = traceRay(camera.position, direction);

            // 由于 canvas 的坐标原点在左上角, 和 viewport 不一致, 所以这里转换一下
            putPixel(x + 400 / 2, -y + 400 / 2, color);
        }
    }
}
```

## 基本实现

最基本的实现是先把球的形状画出来，即如果射出的光线击中了球体，我们就让这条光线返回球体的颜色。这里我们会遇到第一个问题，如何判断光线是否击中了球体？

我们选择球体作为场景中的物体是有原因的——它的表示方程十分简单：

$$
|\vec{P} - \vec{C}|^2 = r^2
$$

其中 $\vec{P}$ 是球体表面的点，$\vec{C}$ 是球体中心，而 $r$ 是球的半径。

光线的方程也很简单，出发点加上一个方向向量即可：

$$
\vec{P} = \vec{O} + t\vec{D}
$$

只需改变 $t$，就能表示空间中一条线上的任意一点。如果这一点位于球的表面，不就说明光线击中了球体吗？所以把光线方程代入球方程，就得到了一个关于 $t$ 的一元二次方程：

$$
\begin{aligned}
(\vec{O} + t\vec{D} - \vec{C})\cdot(\vec{O} + t\vec{D} - \vec{C}) &= r^2 \\
t^2(\vec{D}\cdot\vec{D}) + 2t(\vec{OC}\cdot\vec{D}) + (\vec{OC}\cdot\vec{OC} - r^2) &= 0 \\
\end{aligned}
$$

如果方程有解，则说明光线击中了球体。而恰好判断一元二次方程是否有解有个简单的式子：$b^2 - 4ac \geq 0$。而在上面的方程中

$$
a = \vec{D}\cdot\vec{D}, \quad b = 2(\vec{OC}\cdot\vec{D}), \quad c = \vec{OC}\cdot\vec{OC} - r^2
$$

所以判断是否击中球体的代码就呼之欲出了：

```js
function intersectRaySphere(origin, direction, sphere) {
    const CO = vec3.create();
    vec3.subtract(CO, origin, sphere.center);

    const a = vec3.dot(direction, direction);
    const b = 2 * vec3.dot(CO, direction);
    const c = vec3.dot(CO, CO) - sphere.radius * sphere.radius;

    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
        return [Infinity, Infinity];
    }

    const sqrtDiscriminant = Math.sqrt(discriminant);
    const t1 = (-b + sqrtDiscriminant) / (2 * a);
    const t2 = (-b - sqrtDiscriminant) / (2 * a);

    return [t1, t2];
}
```

`intersectRaySphere` 函数不仅做了判断，还返回了两个解 $t_1$ 和 $t_2$。这两个解分别表示击中点位置。求解出来是有必要的，因为每一条光线可能会击中不止一个球体，而我们需要选取距离 camera 最近的那个击中点进行渲染。

所以对于每条光线，我们需要遍历场景中的所有物体，计算击中点，并选取最近的那个。值得注意的是，$t$ 需要 > 1 才可以，因为 viewport 在 z=1 的位置，$t < 1$ 的点是在 viewport 后方的点，是不可见的。所以这里引入了 minT 和 maxT 的概念，表示允许的击中点范围。在 `main()` 中调用 `traceRay()` 的时候，我们传入 minT=1 和 maxT=Infinity。

```js
function getClosestIntersection(origin, direction, tMin, tMax) {
    let closestT = Infinity;
    let closestSphere = null;
    for (const sphere of scene.spheres){
        const [t1, t2] = intersectRaySphere(origin, direction, sphere);
        if (t1 < closestT && t1 > tMin && t1 < tMax) {
            closestT = t1;
            closestSphere = sphere;
        }
        if (t2 < closestT && t2 > tMin && t2 < tMax) {
            closestT = t2;
            closestSphere = sphere;
        }
    }
    return [
        closestSphere,
        closestT
    ];
}

function traceRay(cameraPosition, direction, minT, maxT) {
    const [closestSphere, closestT] = getClosestIntersection(cameraPosition, direction, minT, maxT);
    if (closestSphere === null) {
        return scene.backgroundColor;
    }
    return closestSphere.color;
}
```

我们在空间里放置三小一大四个不同颜色的球体，渲染出来的效果如下：

<iframe loading="lazy" src="https://bqh.me/pages/cgfs-step/01-basic/ " style="width:100%;height:440px;border:none"></iframe>

## 光线

上面我们把球体渲染出来了，但很显然看着非常不真实，一个很大的原因是没有光照效果。我们可以把现实世界中的光大致概括成三种：

- 环境光（ambient light）：均匀照亮场景的光，没有方向性
- 平行光（directional light）：从一个方向照射过来的光，光线是平行的
- 点光源（point light）：从一个点向四面八方发射的

环境光是最简单的，我们认为它均匀地照亮场景中的每个点。

平行光源也会照亮整个场景，但是光照的强度会和光线和物体表面的夹脚相关。这也是地球会有热带、温带、寒带的原因——太阳光是平行光源，赤道附近的光线和地面夹角大，光照强度高，而两极附近的光线和地面夹角小，光照强度低。

![](/images/computer-graphics-from-scratch-part1/earth.svg)

有了感性认知，之后，我们需要关心的是，既然光照强度与夹角相关，我们如何计算这个夹角呢？

考虑一束宽度为 $w$ 的平行光，它和物体表面法线的夹角为 $\theta$，那么光照在物体表面的投影宽度就是 $w \cos\theta$。而光照强度与投影面积成正比，所以光照强度也与 $\cos\theta$ 成正比。

![](/images/computer-graphics-from-scratch-part1/directional-light.svg)

所以如果平行光本身强度为 $I$，物体表面的法线为 $\vec{N}$，平行光的方向为 $\vec{L}$，那么物体表面的光照强度 $I_{surface}$ 就是：

$$
I_{surface} = I \cdot \max(0, \cos\theta) = I \cdot \max\left(0, \frac{\vec{N} \cdot \vec{L}}{|\vec{N}||\vec{L}|}\right)
$$

一个值得注意的点是这里的 $\vec{L}$ 是**指向光源的方向**，而不是光线射来的方向，这样我们才能取到符合预期的 $\theta$ 值。

球体的表面法线 $\vec{N}$ 很容易计算出来，就是击中点 $\vec{P}$ 减去球心 $\vec{C}$。

有了这些知识，点光源的问题也可以解决了，因为点光源的光线强度其实也是根据夹角计算，和平行光源并无本质区别。唯一的区别是，点光源有一个光源位置，后面计算阴影的时候需要考虑这一点。

下面开始实现光照的代码，在场景中添加三种光源（光源类的定义省去了）：

```js
export const scene = {
    // ...
    lights: [
        new AmbientLight(0.2),                               // 强度为 0.2 的环境光
        new PointLight(0.6, vec3.fromValues(2, 1, 0)),       // 强度为 0.6，位置为 (2, 1, 0) 的点光源
        new DirectionalLight(0.2, vec3.fromValues(1, 4, 4)), // 强度为 0.2，方向为 (1, 4, 4) 的平行光
    ],
}
```

在 `traceRay()` 函数中, 计算击中点的光照强度，然后根据光照强度调整颜色值：

```js
function traceRay(cameraPosition, direction, minT, maxT) {
    const [closestSphere, closestT] = getClosestIntersection(cameraPosition, direction, minT, maxT);
    if (closestSphere === null) {
        return scene.backgroundColor;
    }

    // 击中点: P = O + tD
    const intersectionPoint = vec3.create();
    vec3.scaleAndAdd(intersectionPoint, cameraPosition, direction, closestT);
    // 击中点法线: N = P - C
    const normal = vec3.create();
    vec3.subtract(normal, intersectionPoint, closestSphere.center);
    vec3.normalize(normal, normal);
    // 最终颜色为球体颜色 * 光照强度
    return vec3.scale(vec3.create(), closestSphere.color, computeLighting(intersectionPoint, normal));
}
```

光照强度的计算在 `computeLighting()` 函数中实现，对于每个击中点，遍历场景中的所有光源，并计算该光源在当前点的光照强度，最后累加起来：

```js
function computeLighting(point, normal) {
    let intensity = 0;
    for (const light of scene.lights){
        if (light instanceof AmbientLight) {
            // 环境光直接累加强度
            intensity += light.intensity;
        } else {
            let l = vec3.create();
            if (light instanceof PointLight) {
                // 点光源: 计算从击中点指向光源的向量
                vec3.subtract(l, light.position, point);
            } else {
                // 平行光: 方向向量就是光源方向
                l = light.direction;
            }
            // 如果 cos(θ) > 0, 则累加光照强度
            const nDotL = vec3.dot(normal, l);
            if (nDotL > 0) {
                intensity += light.intensity * nDotL / (vec3.length(normal) * vec3.length(l));
            }
        }
    }
    return intensity;
}
```

<iframe loading="lazy" src="https://bqh.me/pages/cgfs-step/02-light/ " style="width:100%;height:440px;border:none"></iframe>

## 高光

有了光照效果之后渲染结果看起来真实了很多，但还差点意思。因为我们之前默认每个球体的表面都只会产生漫反射，现实中的一些物体会有高光存在，比如金属、塑料、瓷器，甚至一个苹果。

<img src="/images/computer-graphics-from-scratch-part1/shinny-apple.png" alt="a shinny apple" style="width:400px;max-width:100%;height:auto" />

这个闪亮的斑块形成的原因是，苹果表面的这个区域较多反射了来自光源的光线，或者说，苹果的这片区域产生了镜面反射，而反射的光线正好射入了我们的眼睛。我们希望渲染时也能模拟出这种效果。

在理想情况下，如果有一个完美光滑的镜面球体，并且只有一个点光源，那么理论上，只有一个点会精确地反射光源到观察者的眼睛，这个点就是「镜面反射点」，也叫「高光点」。在这种理想情况下，高光是一个点。但是现实中我们看到的往往是一个光斑，而非一个点，这是因为现实世界里的物体本身不完美光滑，表面会有微小的凹凸，这些凹凸会让光线反射的角度略偏于入射角。

![](/images/computer-graphics-from-scratch-part1/reflect-reality.svg)

正是这种偏移存在，在理想高光点附近的区域，光线也有可能反射到观察者眼睛里，从而形成一个高光区域。那这个高光区域有多大呢？

根据经验判断，我们可以知道高光区域其实是一个中间最亮，四周逐渐变暗的区域。用 CSS 的模拟一下大概长这样：

<div>
<style>
.highlight-container {
    background: #333;
    width: 150px;
    margin: 0 auto;
}
.highlight {
    width: 150px;
    height: 150px;
    background: radial-gradient(
        circle,
        rgba(255,255,255,1) 0%,      /* 中心最亮 */
        rgba(255,255,255,0.95) 30%,  /* 亮度缓慢减弱 */
        rgba(255,255,255,0) 100%      /* 边缘完全透明 */
    );
    margin: 0 auto;
}
</style>
<div class="highlight-container">
<div class="highlight"></div>
</div>
</div>

随着与高光点的距离增加，亮度会先缓慢减弱，再快速减弱，最后在边缘完全消失。由于离高光点比较近的区域光照减弱地很缓慢，所以形成了一片比较明亮的区域。这就是高光区域的形成原理。如何模拟这个随距离变化的亮度呢？我们不做复杂的物理计算，而是使用一个经验公式：

$$
I_{specular} = I \cdot \max(0, \cos\alpha
)^p
$$

对于 $\cos\alpha$ 函数，在 $[0, \frac{\pi}{2}]$ 区间，它的值从 1 减小到 0，并且是先缓慢减小，再快速减小，符合我们观测到的高光的行为。而 $p$ 是一个控制高光区域大小的参数，$p$ 越大，高光区域越小，反之亦然。我们可以把 $p$ 理解成物体表面的光滑程度，$p$ 越大，表面越光滑，高光区域越小。这是因为 $\cos\alpha$ 函数指数的性质，指数越大，会更快地迎来快速下降。

<iframe loading="lazy" src="https://bqh.me/pages/cgfs-step/cos-function/ " style="width:100%;height:400px;border:none"></iframe>

所以我们可以把 $p$ 作为物体的一个属性，名为 `specular`，该值越大，物体表面越光滑，高光区域就越小。在场景中为每个球体添加 `specular` 属性（第三个参数）：

```js
export const scene = {
    // ...
    spheres: [
        new Sphere(vec3.fromValues(0, -1, 3), 1, vec3.fromValues(255, 0, 0), 500),
        new Sphere(vec3.fromValues(2, 0, 4), 1, vec3.fromValues(0, 0, 255), 500),
        new Sphere(vec3.fromValues(-2, 0, 4), 1, vec3.fromValues(0, 255, 0), 10),
        new Sphere(vec3.fromValues(0, -5001, 0), 5000, vec3.fromValues(255, 255, 0), 1000)
    ],
}
```

对于每个击中的点，首先根据 `specular` 属性判断该点是否会产生高光。有两种情况不产生高光：

1. 物体表面无任何镜面反射，`specular = 0`
2. $\cos\alpha <= 0$，即实际反射的光线并没有射入观察者眼睛

怎么计算 $\cos\alpha$ 呢？

我们现在有指向光源的向量 $\vec{L}$，物体表面的法线 $\vec{N}$，以及观察者视线方向 $\vec{V}$（从击中点指向 camera 的向量）。根据反射定律，理想情况下，反射光线 $\vec{R}$ 可以通过下面的公式计算出来：

$$
\vec{R} = 2\vec{N}(\vec{N}\cdot\vec{L}) - \vec{L}
$$

这个公式可以通过图像直观理解，$\vec{N}\cdot\vec{L}$ 计算出光线在法线方向上的投影，然后把这个投影向量放大两倍，再减去入射光线 $\vec{L}$，就得到了反射光线 $\vec{R}$。

![](/images/computer-graphics-from-scratch-part1/compute-r.svg)

有了 $\vec{R}$ 和 $\vec{V}$，$\cos\alpha$ 就可以通过经典的两个向量夹角公式计算：

$$
\cos\alpha = \frac{\vec{R} \cdot \vec{V}}{|\vec{R}| |\vec{V}|}
$$

现在条件都具备了，在 `computeLighting()` 函数中，计算出高光强度并累加到总光照强度中：

```js
function computeLighting(point, normal, specular) {
    // ...
    for (const light of scene.lights){
        // ...

        // 无反射光
        if (specular < 0) {
            continue;
        }

        // 计算理想反射光 R = 2N(N·L) - L
        const r = vec3.create();
        vec3.scale(r, normal, 2 * vec3.dot(normal, l));
        vec3.subtract(r, r, l);

        // 计算视线方向 V, 即击中点指向 camera 的向量
        const v = vec3.create();
        vec3.subtract(v, cameraPosition, point);

        // 计算 R·V, 如果夹角小于 90 度, 则视线方向上有反射光
        const rDotV = vec3.dot(r, v);
        if (rDotV > 0) {
            // cos(α) = (R·V) / (|R||V|)
            // I_specular = I * (cos(α))^specular
            intensity += light.intensity * Math.pow(
                rDotV / (vec3.length(r) * vec3.length(v)),
                specular,
            );
        }
    }
    // ...
}
```

完成了！从现在的视角里主要能看到绿色球和红色球的高光，绿球的 specular 值较小，所以高光区域较大，而红球的 specular 值较大，所以高光区域较小，符合预期。

<iframe loading="lazy" src="https://bqh.me/pages/cgfs-step/03-specular/ " style="width:100%;height:440px;border:none"></iframe>

## 阴影

有了光，随之而来的就是阴影。球体和球体之间有遮挡关系，如果一个球体挡住了另一个球体和光源之间的光线，那么被挡住的球体表面就应该变暗，形成阴影效果。而之前的视线里我们并没有考虑这一点。

核心还是修改 `computeLighting()` 函数，环境光无需考虑遮挡关系，而对于点光源和平行光源，则需要在计算光照强度之前考虑，射到当前击中点的光是否已经被其他物体挡住了。我们之前已经有了 `getClosestIntersection()` 函数来计算光线最先击中的物体，如果当前击中点所在球体并非是光线最先击中的物体，那么说明当前击中点处于阴影中，不应该计算该光源的光照强度。

在计算光线强度的时候已经有了指向光源的向量 $\vec{L}$（代码中的 `l`），那我们就从击中点向光源方向模拟发射一条光线，如果有击中的物体，则说明当前击中点处于阴影中。

之前我们也有设置 minT 和 maxT 来限定击中点的范围，前面一直没用到 maxT，现在能派上用场了。值得注意的一点是，由于点光源是有位置的，所以 maxT 不能是无限大，而是到点光源的距离，而对于平行光源 maxT 则仍然是无限大。

```js
function computeLighting(point, normal, specular) {
    let intensity = 0;
    for (const light of scene.lights){
        // ...
        let l = vec3.create();
        let tMax;
        if (light instanceof PointLight) {
            // 点光源: 计算从击中点指向光源的向量
            vec3.subtract(l, light.position, point);
            // 为什么设置为 1？因为 l 由点光源位置减去击中点位置得到，t 为 1 时表示击中点光源
            tMax = 1;
        } else {
            // 平行光: 方向向量就是光源方向
            l = light.direction;
            tMax = Infinity; // 平行光没有距离限制
        }
        // 检查点是否在阴影中
        const [shadowSphere, shadowT] = getClosestIntersection(
            point,
            l,
            0.001, // 避免自相交
            tMax
        );
        if (shadowSphere !== null) {
            continue; // 在阴影中, 不计算该光源的光照强度
        }
        // ...
    }
    return intensity;
}
```

还有一个注意点是 minT 是 0.001 而非 0。这是因为 `getClosestIntersection()` 中会遍历所有物体，包括出发点所在的物体，如果 minT 是 0, 得到的结果将会是当前物体会是最近的击中物体，从而导致错误地判断当前击中点处于阴影中。将 minT 设为一个很小的值（0.001）就能避免这个问题。

阴影效果的实现还挺简单的，但效果很不错：

<iframe loading="lazy" src="https://bqh.me/pages/cgfs-step/04-shadow/ " style="width:100%;height:440px;border:none"></iframe>

## 反射

感觉现在实现的物体很像台球……现实中如果台球很亮很光滑，是可以反射出外界物体的镜像的，这里也希望实现这个效果。为什么在一个物体上会映出别的物体的样子？比如，我们在物体 A 上看到了物体 B 的镜像。这是由于环境中的光线先集中了物体 B，物体 B 吸收了一些光线，反射了一些携带自身颜色的光线，这些反射光线射向物体 A，物体 A 再把这些光线反射到我们的眼睛里，我们就看到了物体 B 的镜像。

![](/images/computer-graphics-from-scratch-part1/reflection.svg)

物体 B 发出的光也可能是从物体 C 反射而来的，物体 C 也可能是从物体 D 反射而来的……最终这些光线都源自光源发出的白色光线。所以反射其实就是一个递归的过程，或者说，是 `traceRay()` 不断调用自身的过程。

为了防止栈溢出，我们得设置一个最大递归深度，书里说设置为 3 就足够了。在 `traceRay()` 函数中添加一个 `maxDepth` 参数，在 main 中调用该函数时将它设置为 3。

```js
const color = traceRay(cameraPosition, direction, 1, Infinity, 3);
```

在 `traceRay()` 函数中，之前一系列的高光、阴影计算之后得到的颜色我们称之为 `localColor`，表示物体本身的颜色。然后我们需要计算反射光线的颜色 `reflectedColor`，最后将两者按比例混合得到最终颜色。混合的比例也是物体的一个属性，我们命名为 `reflective`，表示物体的反射程度，取值范围是 $[0, 1]$，0 表示不反射，1 表示完全反射。因此得到最终颜色的公式是：

$$
Color = Color_{local} \cdot (1 - reflective) + Color_{reflected} \cdot reflective
$$

原本 `computeLighting()` 函数中需要 `cameraPosition` 来计算视线方向，需要主动传一个视线方向了，因为反射的光不止指向 camera 了。


```js
// 主动传入 view, 在之前的实现里, 这个向量是 cameraPosition - point 得来, 但在 traceRay() 会递归
// 调用的情况下, 我们把它的计算过程放在 traceRay() 函数内
function computeLighting(point: vec3, normal: vec3, view: vec3, specular: number): number {
    // ...

    // 将理想反射光的计算（R = 2N(N·L) - L）提取为 reflectRay() 函数
    const r = reflectRay(l, normal);

    // 高光计算
    const rDotV = vec3.dot(r, view);
    if (rDotV > 0) {
        intensity += light.intensity * Math.pow(
            rDotV / (vec3.length(r) * vec3.length(view)),
            specular,
        );
    }

    // ...
}
```

最主要的还是对 `traceRay()` 函数的修改，我们需要计算出 `reflectedColor`，最终将 `localColor` 和 `reflectedColor` 加权返回：

```js
// 由于 `traceRay()` 现在不止是计算摄像机发出的光了，所以函数签名需要修改一下
- function traceRay(cameraPosition, direction, minT, maxT) {
+ function traceRay(startPoint, direction, minT, maxT, maxDepth) {
    // ...

    // computeLighting 第三个参数为指向视线的方向, direction 向量是出发点指向物体, 因此视线方向为 -direction
    const view = vec3.negate(vec3.create(), direction);

    // 计算高光和阴影
    const localColor = vec3.scale(vec3.create(), closestSphere.color, computeLighting(intersectionPoint, normal, view, closestSphere.specular));

    // 递归计算反射光, 达到递归次数上限或击中物体无反光时停止
    if (recursionDepth <= 0 || closestSphere.reflective <= 0) {
        return localColor;
    }

    // 从物体 A 指向物体 B 的光线, 可以作为下个 traceRay 的 direction
    const reflectedRay = reflectRay(view, normal);
    const reflectedColor = traceRay(intersectionPoint, reflectedRay, EPSILON, Infinity, recursionDepth - 1);

    // 最终颜色为局部颜色和反射颜色的加权和
    return vec3.add(
        vec3.create(),
        vec3.scale(vec3.create(), localColor, 1 - closestSphere.reflective),
        vec3.scale(vec3.create(), reflectedColor, closestSphere.reflective),
    );
}
```

为红、蓝、绿、黄球分别添加 0.2、0.3、0.4、0.5 的 `reflective` 参数，渲染出来看看：

<img style="display:block;margin:0 auto;width:400px" src="/images/computer-graphics-from-scratch-part1/reflection-not-good.png" />

它看起来不是那么好，表示地面的这个大球上出现了奇怪的光斑。一通排查下来发现还是之前提到的「自相交」问题。前面我们是把 minT 设为 0.001，但是引入反射之后，在计算球与球之间反射光线的交叉点时，P = O + tD 中 t 值会变大一些，使它落入了 [minT, maxT]，从而导致了自相交。临时的解决方案是把 0.001 改成 0.01，GPT 跟我说了一个更好的方案，即把出发点稍微沿着法线方向移动一点点：

```js
// 计算击中点: P = O + tD
const intersectionPoint = vec3.create();
vec3.scaleAndAdd(intersectionPoint, cameraPosition, direction, closestT);
// 沿法线方向移动一点点，避免自相交
vec3.scaleAndAdd(intersectionPoint, intersectionPoint, normal, 0.001);
```

效果立竿见影，自相交的产生的阴影消失了：

<iframe loading="lazy" src="https://bqh.me/pages/cgfs-step/05-reflection/ " style="width:100%;height:440px;border:none"></iframe>

> 书中作者的实现其实没有自相交问题，因为他自己实现了向量类，使用的是 JavaScript 的 Number 类型，而我使用的 `gl-matrix` 库底层是使用 `Float32Array` 来存储向量数据的，比 JavaScript 原生的 Number 类型精度低一些。

GPT 说，在现实世界中的渲染软件中，起点偏移是很常用的防止自相交的技巧。为了保险，这个方式和 minT 限制可以结合使用。

## 结语

在看这本书之前，我还看过 *Ray Tracing in One Weekend*，它也是实现了一个简单的光线追踪渲染器，但其中没有讲述光照和阴影的部分，但同时也介绍了一些 *Computer Graphics From Scratch* 里没实现的如玻璃材质、散焦模糊、抗锯等操作。而且 *Ray Tracing in One Weekend* 还有两个续作，大概看起来是提到了更多的光线追踪技术。所以 *Computer Graphics From Scratch* 在光线追踪部分相对而言是更简略和简单一些的教程。

书里作者还提到了一些优化，例如并行化、用空间盒减少计算量等。我让 Copilot 在不更改算法的情况下把这些代码移植到了 WebGL，确实有立竿见影的加速效果，渲染 400px 宽高的场景时间由 250ms 降到了 10ms 左右。如果要求 60 FPS，渲染时间其实是需要低于 16.7ms。介于本文中渲染的只是一个尺寸较小、没做抗锯齿优化的场景，感性判断，在现代场景中实现实时光线追踪还是很难的，估计 UE 这种游戏引擎做了相当多的黑魔法。
