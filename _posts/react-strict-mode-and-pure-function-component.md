---
title: "React strict mode 和 纯函数组件"
date: "2022-07-31 21:54:32"
---

现在的 React 框架基本都会自动为整个组件包裹一层 `<React.StrictMode>` 全局打开严格模式。严格模式会有一系列额外的行为来帮助我们构建“更符合 React 哲学”的组件。

本文只讨论函数式组件。

React 中一大推荐的操作就是，把每个函数组件都保持为纯函数，即相同的输出在任何时候一定会渲染出相同的结果。在 React 还在 beta 的文档里，就有一篇文章专门讲述这个主题：[Keeping Components Pure](https://beta.reactjs.org/learn/keeping-components-pure#purity-components-as-formulas)。

> 说到这里，之前在知乎上看到一个关于纯函数组件的问题：[React推荐函数组件是纯函数，但是组件有状态就不可能是纯函数，怎么理解有状态的纯函数？](https://www.zhihu.com/question/537538929/answer/2527746562)，感觉对理解 React 的这套思想会有点帮助。

纯函数之所以能做到是“纯”的，最关键的点是，它不会改变在渲染之前就已经存在的对象或者变量，比如函数之外的变量：

```jsx
let count = 0;
function Counter() {
  count++;
  return <div>{count}</div>;
}
```

这种行为会由于在开发模式下函数体执行两次而出现预期之外的效果，React Strict Mode 希望以此来警告开发者。

同理，state、props、context 都不应该由组件在内部改变。否则渲染多次的时候在严格模式下一定会暴露出问题。

严格模式下会重复调用的函数有（[React Docs - 检测意外的副作用](https://zh-hans.reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)）：

- `class` 组件的 `constructor`，`render` 以及 `shouldComponentUpdate` 方法
- `class` 组件的生命周期方法 `getDerivedStateFromProps`
- 函数组件体
- 状态更新函数（即 `setState` 的第一个参数） → 这意味着在 `setState` 回调中不可以做有副作用的操作。
- 函数组件通过使用 `useState`，`useMemo` 或者 `useReducer`

之前写博客网站的时候，遇到了一个问题：

```js
const submitHeading = useCallback(({ level, children }) => {
  if (level === 1) {
    levelCounter.current.fill(0);
  }
  levelCounter.current[level]++;
  const id = `${level}-${levelCounter.current[level]}`;
  onDirChange({id, content: children});
  return React.createElement(`h${level}`, { id }, children);
}, [onDirChange]);
```

当时没想明白为啥 submitHeading 里的内容在开发环境会调用两次，现在看起来就很清晰了，`useCallback` 本身是 `useMemo` 实现的，useMemo 中的内容是会执行两次的。这里在 `useCallback` 中改变了一个 ref 的值，造成了副作用，这一操作本身是 React 不希望我去做的。
