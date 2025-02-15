---
title: "用 lit-html 制作简易 react"
date: "2025-02-15 13:48:56"
---

写这篇文章的起因有两个：

* [Can Swyx recreate React Hooks and useState in under 30 min? - JSConf.Asia - YouTube](https://youtu.be/KJP1E-Y-xyo) 通过这个视频，我发现只需要小几十行代码就能实现一个能跑的 react hook 模型。
* [yyx990803/vue-lit](https://github.com/yyx990803/vue-lit) 这是一个基于 `vue/reactivity` 和 `lit-html` 的实现，可以利用 Vue 响应式的能力做一个简易版本的 lit。

自制 react hook 能够实现 react 的数据变化模型，再加上 lit-html 替代掉 jsx 和 react-dom，一个能跑的 tiny react 就诞生了。lit-html 自带了 diff 能力，当数据变更时只会触发相对应的 DOM 变更，这也帮我们替代掉了 react 虚拟 DOM Diff 的这部分功能。此外，lit-html 还提供了事件绑定方法，完美！

## 自制 hook

如果你查看了上面提到的油管视频，就会知道 react hook 是利用闭包的能力把需要存储的值们放在了一个数组里，useState 存储的是 state，而 useEffect 存储的就是依赖数组。每个 hook 声明对应一个数组下标值 idx，通过 `hooks[idx]` 这种形式访问到每个 hook 对应的值。

每次渲染都会重置 idx = 0，hook 每执行一次 idx++ 一下，这样每个 hook 内部就能对对应的值进行 get/set 操作了。

具体的实现如下：

```javascript
const hooks = [];
let idx = 0;

function useState(initialState) {
    if (hooks[idx] === undefined) {
        hooks[idx] = initialState;
    }

    const _idx = idx;
    const state = hooks[idx];
    const setState = newState => {
        if (typeof newState === 'function') {
            hooks[_idx] = newState(hooks[_idx]);
        } else {
            hooks[_idx] = newState;
        }
    };
    idx++;

    return [state, setState];
}

function useEffect(cb, deps) {
    const oldDeps = hooks[idx];
    let hasChanged = true;
    if (oldDeps) {
        hasChanged = deps.some((dep, i) => !Object.is(dep, oldDeps[i]));
    }
    if (hasChanged) {
        cb();
    }
    hooks[idx] = deps;
    idx++;
}

function render(Component, container) {
    idx = 0;
    const template = Component();
    // 将 template 渲染到 dom
    return template;
}

export { useState, useEffect, render };
```

useState 就是简单的从 `hooks` 数组里拿取和更新值，useEffect 则是每次对比依赖数组的每一项是否发生了变化，如果发生变化就执行回调函数。

值得注意的一点时 useState 需要记录下来本身的 idx 值，在上述代码对应的变量为 `_idx`，以此才能在 setState 操作中正确地更新到当前 useState 对应的 state。

之前说 `hooks` 变量是放在闭包里，这里放在一个 ES6 Module 里，打包之后也确实是放进一个闭包了。

好，现在完善一下 render 函数，我们的 react 就能跑起来了。

## 渲染到 DOM

lit-html 的使用方法很简单，主要利用两个函数，分别是 `html` 和 `render`，顾名思义，`html` 用来编写 HTML 模板，`render` 则可以把模板渲染到对应的 DOM 节点上。

> 关于 lit-html 的使用，这篇 lit 官方的文档写得很清晰易懂：[面向 React 开发者的 Lit - 4. JSX 和模板](https://codelabs.developers.google.com/codelabs/lit-2-for-react-devs?hl=zh-cn#3)

首先在 `react.js` 中补全 render 函数：

```javascript
function render(Component, container) {
    idx = 0;
    const template = Component();
    litRender(template, container);
    return template;
}
```

然后新建一个 react 组件：

```javascript
import {useState, useEffect, render} from './react.js';
import {html} from 'lit-html';

function App() {
    const [count, setCount] = useState(1);
    const [text, setText] = useState('apple');

    useEffect(() => {
        console.log('useEffect: log at every render');
    });

    useEffect(() => {
        console.log('useEffect: word change to', text);
    }, [text]);

    useEffect(() => {
        console.log('useEffect: init');
    }, []);

    return html`
        <div>
            <p>${count} + ${text}</p>
            <button
                @click=${() => {
                    setCount(prev => prev + 1);
                    setText('Counting');
                }}
            >
                Click
            </button>
            <!-- 这里需要用 .value 而非 value，从而正确更新 property 而不是 HTML attribute -->
            <input @input=${e => setText(e.target.value)} .value=${text} />
        </div>
    `;
}

render(App, document.body);
```

现在 UI 已经能正确渲染了，但是 button 的 click 事件似乎并不能触发 UI 的更新。这是因为之前我们忽略了如何触发重新 render 操作。

state 的变化应该使得 `render` 函数再次执行，我们在 setState 的实现中做一些修改：

```javascript
  const setState = newState => {
      if (typeof newState === 'function') {
          hooks[_idx] = newState(hooks[_idx]);
      } else {
          hooks[_idx] = newState;
      }
      render(currentComponent, currentContainer);
  };
```

渲染总是需要 component 和 container 两个参数，为了在 setState 拿到它们，得用两个全局变量（`currentComponent` 和 `currentContainer`）记录一下。

好，现在大功告成，整个组件已经能够通过事件即时更新了，变成了一个有模有样的 *react。*

> 完整的代码在 [https://github.com/banqinghe/reaclit](https://github.com/banqinghe/reaclit)

## 改进空间

虽然 react 总是自称自己是一个 library，但是代码量大概是数十万的量级，我们可以只用不到 100 行代码写一个及其玩具的实现，但是距离真正生产可用的 react 还差着十万八千里。

只论我们上文中的实现，很直接的改进空间还有不少：

* 缺少批处理：在 click 事件中进行了两次 setState 操作，在 react 的真正实现里，应该只会触发一次 render
* 还需要更多 hook：useRef、useMemo、…
* 无法组件化：App 组件里应该能嵌入别的组件，现在还无法做到这一点
