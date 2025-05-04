---
title: "Web 上的 custom context menu"
date: "2025-05-04 20:39:47"
---

使用 JavaScript 拦截 `contextmenu` 主要有两个目的，一是拦截系统原生的右键功能，二是在此基础上实现一个自定义的右键菜单（context menu）。最近我在尝试复刻一个体验接近的 Chrome Devtools 内置 JSON Viewer 的组件，我已经很习惯使用它自带的 context menu，因此也想把这部分实现一下。

<img src="/images/web-custom-context-menu/p6NLZ39UFChuNJpp-zAwvsSV56KZ3s552JcW51ArPcs=.png" alt="Chrome Devtool 上的 context menu" style="width:400px;max-width:100%">

Chrome Devtools 虽然是用 JavaScript 实现的，但是它并不是一个纯粹的 Web 项目，context menu 这部分是使用的系统原生能力。我们在纯 Web 环境下实现接近它体验的交互会遇到一些阻碍。

实现自定义 context menu 的基础很简单直接：

1. 监听拦截 `contextmenu` 事件
2. 新建一个菜单 DOM，使用 `position: fixed`，将当前鼠标坐标作为该元素的 left 和 top
3. 将这个 DOM 挂载到 document 上

这么做能简单实现一个看着还不错的 context menu，但是还有一些交互问题可以优化，下面是一些需要考虑的原生行为：

**1. context menu 存在时，鼠标不会触发菜单之外的 hover 事件；首次左键点击其他元素只会触发销毁 context menu，不会触发对于点击元素的 click 事件；首次右键点击其他元素会触发 `contextmenu` 事件**

左键不触发 hover 和不触发 click 都可以通过加一个全局的遮罩来做到。但是单纯加一个遮罩没法完全模拟右键的行为，所以在遮罩上右键时，还需拦截遮罩的 `contextmenu` 事件，然后在遮罩下方的元素上主动 dispatch 一个 `contextmenu` 事件。`document.elementFromPoint` 可以让我们获取某个坐标下的元素，`Element.prototype.dispatch` 则可以主动在某个元素上触发指定事件，将二者结合就能很好地模拟原生 `contextmenu` 的行为了：

```typescript
// 监听遮罩元素
overlay.addEventListener('contextmenu', e => {
    e.preventDefault();

    // 销毁遮罩旧 context menu 的 DOM
    dispose();

    // 获取当前鼠标位置的元素
    const pointElement = document.elementFromPoint(e.clientX, e.clientY);
    if (pointElement) {
        // 创建并触发新的 context menu 事件
        const newContextMenuEvent = new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 2,
            buttons: 2,
            clientX: e.clientX,
            clientY: e.clientY,
        });
        pointElement.dispatchEvent(newContextMenuEvent);
    }
});
```

**2. 按下 esc 键的时候当前 context menu 应该被销毁**

监听 keydown 事件，触发 dispose 行为即可。

**3. 点击任何浏览器视口之外的地方，context menu 都应该被销毁**

这一步比较难做到，因为浏览器并没有提供一个「点击视口之外的地方」的可监听事件，所以只能通过一些事件尽可能模拟，包括：

* document 的 visibilitychange 事件
* window 上的 blur 事件

通过监听这两个事件会在很多操作时触发，如切换标签页，切换至浏览器之外的应用等。但这种实现并不能完全做到对「点击视口之外的地方」进行监听，比如在用户点击浏览器工具栏的时候，自定义的 context menu 理应销毁，但是用户的这一行为无法被监听到，所以无法实现。
