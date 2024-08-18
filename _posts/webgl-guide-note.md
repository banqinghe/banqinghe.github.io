---
title: "WebGL Guide Note"
date: "2022-01-12 22:51:06"
---

## Chapter 1: Draw Point

有两种方式可以从 JavaScript 程序中传递数据到顶点着色器中，分别是使用 `attribute` 和 `uniform`

`attribute` 是顶点有关的（传递给特定顶点），必须定义为全局变量
`uniform` 是顶点无关的（传递给每个顶点）

设置 `attribute` 的同族函数：

- `gl.vertexAttrib1f(location, v0)`
- `gl.vertexAttrib2f(location, v1)`
- `gl.vertexAttrib3f(location, v2)`
- `gl.vertexAttrib4f(location, v3)`

第 2，3，4 个分量的默认值分别为 0.0, 0.0, 1.0，和 `gl.uniform[1234]f` 同理。

这些函数有矢量化版本，接收的参数为类型化数组

WebGL 的绘制操作实际上是在颜色缓冲区中进行绘制的，当绘制结束后颜色缓冲区会被重置，其中内容会丢失。（我理解为默认 clear 掉整个画布）

`attribute` 变量只能被顶点着色器使用，若希望向片元着色器传递数据，只能使用 `uniform` 变量（以及后续会学到 `varying` 变量）

## Chapter 2: Draw Triangle

WebGL 提供了**缓冲区对象（buffer object）**，允许我们一次性向缓冲区内传入多个顶点的数据。

使用缓冲区对象的步骤：

1. 创建缓冲区对象 `gl.createBuffer()`
2. 绑定缓冲区对象 `gl.bindBuffer()`
3. 将数据写入缓冲区对象 `gl.bufferData()`，第三个参数是帮助 WebGL 做优化的，见 P73
4. 将缓冲区对象分配给一个 `attribute` 变量 `gl.vertexAttribPointer()`
5. 开启 `attribute` 变量 `gl.enableVertexAttribArray()`

不能直接向缓冲区写入数据，只能向“目标”写入数据，这里我们用的“目标”就是 `gl.ARRAY_BUFFER`，所以需要先将目缓冲区绑定到目标上。

赋值过程为：`data -> ARRAY_BUFFER -> buffer`

`gl_PointSize` 只有在绘制单个点的时候才会生效

可以直接将一个 Float32Array 作为矩阵传入着色器中

WebGL 中的矩阵是“列主序”的，当我们使用类型化数组中存储的值去填充矩阵的时候，是从左至右按列填充的

```text
// TypedArray
[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0.1, 0.2, 0.3, 1]

// matrix
1 0 0 0.1
0 1 0 0.2
0 0 1 0.3
0 0 0   1
```

通过数组初始化矩阵的时候可能会因为这个比较疑惑，不过知道了这个现象就好

旋转默认正方向是逆时针的

## Chapter 3: Color and Texture

### 渐变色三角形

当我们希望同时向多个顶点传入位置信息和尺寸信息的时候，可以创建两个 buffer 分别用以传递位置信息和尺寸信息。但是同时，WebGL 也允许我们分别访问缓冲区对象中不同种类的数据，因此我们可以将尺寸和位置信息交错放置在同一个 buffer 中

之前我们使用 `uniform` 变量从 JavaScript 程序向偏远着色器中传递数据，但是 `uniform` 是顶点无关的，若要达到每个顶点颜色不同的目的，则需要使用 `varying` 变量

`varying` 变量的作用是将数据从顶点着色器传递到片元着色器，只能是 `float` 以及相关的 vec、mat 类型，片元着色器中声明与顶点着色器中同名的 `varying` 变量就可以实现数据传递

当三个顶点颜色不同，而将 `gl.drawArrays()` 的第一个参数设为 `gl.TRIANGLES` 时，会绘制出一个出现颜色过渡的三角形。要理解这个过程，需要知道从顶点着色器到片元着色器发生了什么

顶点着色器到片元着色器有着以下过程：

```text
顶点坐标
↓
图形装配：将孤立的顶点装配为几何图形，装配方式由 `gl.drawArrays()` 的第一个参数决定（被装配出的几何图形也被称为“图元”）
↓
光栅化：将装配好的几何图形转化为片元
↓
执行片元着色器
```

生成的每个片元都带有坐标信息，可以通过片元着色器中内置的变量 `gl_FragCoord` 访问到

`varying` 变量在光栅化的过程中经过了“内插”过程，这意味着 `varying` 在由顶点着色器传递到片元着色器的过程中是会发生变化的，这也正是只指定了三个顶点颜色，却得到了一个具有渐变色三角形的原因

### 纹理贴图

主要步骤：

1. 配置纹理映射方式，即选择如何将片元与纹理上的像素点对应。这里使用纹理坐标映射到 WebGL 坐标的方式
2. 加载纹理图像
3. 将纹素赋值给片元

纹理坐标以纹理的左下角为原点，右上角坐标固定为 (1.0, 1.0)，为了与 WebGL 的坐标系名称区分开，纹理坐标系的横纵坐标用 `s` 和 `t` 表示

纹理映射：根据纹理图像为光栅化后得到的每个片元涂上合适的颜色，组成纹理图像的元素被称为纹素（texels，texture elements）

在代码中使用纹理主要有以下步骤：

1. 设置纹理坐标，声明好纹理映射在画布上的范围
2. 配置纹理
    - 创建纹理对象 `gl.createTexture()`
    - 将图像做 Y 轴翻转处理，这是因为图片的坐标系原点在左上方，和 WebGL 纹理的 st 坐标系（原点在右下方）不同

        ```javascript
        // 第2个参数表示是否开启 Y 轴翻转，参数可以是布尔值，也可以用0和非0来表示
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        ```

      如果不进行 Y 轴翻转（默认不开启），会得到纵向镜像翻转的结果
3. 开启纹理单元 `gl.activeTexture(gl.TEXTURE0)`

    WebGL 使用纹理单元来同时使用多个纹理（只用一个纹理也需要用）。一共有 8 个纹理单元可以使用，分别是 `gl.TEXTURE0`，`gl.TEXTURE1`，... `gl.TEXTURE7`，这里只有一个纹理，所以只用 `TEXTURE0` 即可
4. 绑定纹理对象 `gl.bindTexture(gl.TEXTURE_2D, texture)`

    纹理和 buffer 类似，不能直接操作，将 2D 纹理对象绑定至 `gl.TEXTURE_2D` 类似于将 buffer 绑定至 `gl.ARRAY_BUFFER`

    这一函数也使 `gl.TEXTURE_2D` 与 `gl.TEXTURE0` 建立了联系
5. 配置纹理对象参数 `gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)`，详细参数项见 P168，这里是指使用缩小方法，缩小后的纹理像素值由最近4像素加权得到
6. 将图像分配给纹理对象 `gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)`，第3和第4个参数必须相同，不仅可以是 `gl.RGB`，也可以是 `gl.RGBA` 等（由图像本身决定），最后一个参数是决定如何压缩数据的
7. 将采样器赋值给 `uniform`，`gl.uniform1i(uniformSampler, 0)`，0表示0号纹理单元

在片元着色器程序中会得到采样器数据类型（`sampler2D`）的变量，利用内置的 `texture2D()` 函数，传入采样器和纹理的坐标就能得到片元的颜色值。纹理的坐标通过 `varying` 由顶点着色器传递并经过自动的内插后得到。

（疑惑：纹理坐标的内插怎么这么智能？）

## Chapter 4: GLSL ES

GLSL ES（OpenGL for Embedded Systems）是 GLSL 的精简版，它本身是为嵌入式设备设计的标准，WebGL 使用的便是这种标准。

语言风格整体上和 C 语言相近，无论是操作符还是函数定义、预处理指令等设计。

数据类型有三种，分别为 `int`，`float`和`bool`，操作符与 C 语言相似度很高，每种有与数据类型同名的类型转化函数，用法形如 `float a = float(10)`

矢量和矩阵类型，矢量类型有 `(i|b)?vec(2|3|4)`，矩阵有 `mat(2|3|4)`，矩阵中的值均为 `float` 类型

矢量构造方式：

```c
vec3 v3 = vec3(1.0, 2.0, 3.0);  // 指定每个数值
vec2 v2 = vec2(vec3);           // 截断更长的矢量或直接 copy 另一个相同长度矢量
vec4 v4_0 = vec4(1.0);          // 仅指定一个数值，矢量所有项均为该值
vec3 v4_1 = vec2(vec2, vec3);   // 多个矢量作为参数，截断多余项
```

矩阵构造方式：

```c
mat4 = mat4(1.0, 2.0, ...);                     // 列主序，指定每个数值
mat3 = mat2(vec2(1.0, 2.0), vec2(3.0, 4.0));    // 多个矢量构造
mat4 = mat4(1.0)                                // 只传递一个数值，构造数量矩阵（单位矩阵的整数倍）
```

矢量可使用 `.` 和 `[]` 运算符访问其中的项，`.` 操作符可以允许 `xyzw`、`rgba`、`stpq`作为分量名访问，均等同于`[0][1][2][3]`。使用`.`操作符也允许“混合”（swizzling）的用法，如 `vec4(1.0, 2.0, 3.0, 4.0).br === vec2(3.0, 1.0)`，混合用法可以用来取值和赋值

矩阵使用一个 `[]` 得到的是一个矢量

GLSL 还支持结构体、数组、取样器类型

支持 `if-else` 语句，和 `for` 语句，循环中可以 `break` 和 `continue`，也可以 `discord`，指跳过当前片元。

函数定义方法与 C 语言相同。函数参数有 `in`（默认）、`const in`、`out`、`inout` 四个限定字

内置一些数学函数，三角函数、幂运算等

与存储有关的限定字：`attribute`（矩阵、矢量和`float`），`uniform`（处理数组和结构体），`varying`（支持的类型与 `attribute` 相同）

精度限定字有 `highp`（高），`mediump`（中），`lowp`（低），用于限定 `int`和`float` 的存储精度。

举例：

```c
// case 1：声明变量时指定精度
medium int size;
highp vec4 color;

// case 2：使用 precision 关键字在程序开头指定某一类型的精度
precision mediump float; // 包括 vec 和 mat 中的 float 精度
```

**注意：** 只有片元着色器中的 `float` 变量没有默认精度，所以需要在片元着色器中手动指定

<!-- todo:
gl.bindBuffer 的第二个参数的 `gl.ELEMENT_ARRAY_BUFFER` (第六章)  -->
