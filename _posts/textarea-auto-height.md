---
title: "<textarea> 高度自适应"
date: "2022-06-06 14:30:41"
---

`<textarea>` 元素可以通过 `rows` 属性设置默认行数，但是它的高度不会自动调整。我查到了一些自动调整高度的方式，但是或多或少有些瑕疵。下面是我所作的一些尝试。

## 设置 height = scrollHeight

即在每次 `value` 发生改变时：

```js
textArea.style.height = textArea.scrollHeight + 'px';
```

这种方式在 `<textarea>` 中的内容一直增加时效果很好，但是在 `<textarea>` 行数有内容缩减时，`scrollHeight` 则并不会有相应的减少，所以并不可靠。

## 两次设置 height

这是在 StackOverflow 上赞同数很多的方式，即在每次 `value` 发生改变时，先设置 `<textarea>` 的高度为 `auto`，然后再立刻将高度设置为 `scrollHeight`。这样就能解决 `<textarea>` 内容减少时高度不会相应缩减的问题。

```js
textArea.style.height = 'auto';
textArea.style.height = textArea.scrollHeight + 'px';
```

但是我发现这种方案依然有缺陷。当 `<textarea>` 内容很长从而导致外层容器发生滚动行为时，如果用户输入的指示光标原本在输入框元素的靠下方（比如一篇长文的靠近末尾的地方），由于将高度设置为 `auto` 的瞬间会造成输入框高度的减少，即使后来高度被置为 `scrollHeight`，输入框依然会自动向上滚动一些距离，使用户光标处于页面最下方，输入的体验很差。

![viewport change](https://raw.githubusercontent.com/banqinghe/blog/main/images/textarea-auto-height/viewport-change.webp)

## 借助 `<div>` 元素计算高度

`<div>` 元素会根据内容自动调整高度，那么如果 `<textarea>` 中的内容和 `<div>` 的 `innerText` 完全一样，是不是就可以通过实时获取 `<div>` 的高度而设置 `<textarea>` 的高度了呢？

为了确保两个元素中的内容一样，需要设置一样的字体大小、行高以及高度，同时为 `<div>` 设置 `overflow-wrap: break-word`，这样做我遇到了两个问题：

### 末尾空行问题

通过 `innerText` 设置 `<div>` 中的内容，换行符会被转化为 `<br>` 元素，但是 `<br>` 元素本身不具有高度，如果在内容末尾有一个换行，在 `<textarea>` 中会产生一个末尾的空行，但是在 `<div>` 末尾不会有空行的产生。为了保证末尾空行的正常出现，在末尾出现空行时，需要在设置 `innerText` 之前，手动确定是否添加一个新的 `\n`：

```js
if (value.split('\n').at(-1).trim() === '') {
  innerText = value + '\n';
} else {
  innerText = value;
}
```

### 空格合并问题

当使用 `innerText` 设置 `<div>` 中的文本时，空格会被自动合并。我尝试使用 `<pre>` 元素代替 `<div>`，但是这样就无法自动断行了，这一行为也无法用样式覆盖。使用 `&nbsp;` 替换掉所有空格，然后用 `innerHTML` 的方式插入是另一种方式，这样算是较好地解决了空格合并问题。但我感觉 `innerHTML` 太不安全还是算了。

## 使用另一个 `<textarea>`

这是我最终使用的方法，从简便性和功能性上来看都很不错。用一个 `invisible` 且行数固定为 1 的 `<textarea>` 来同步填充文本内容，用这一 `<textarea>` 的 `scrollHeight` 设置用户使用的 `<textarea>` 的高度。使用简单，效果也很好。

```js
const resizeTextArea = () => {
  const textArea = textAreaRef.current!;
  const textRuler = textRulerRef.current!;
  textRuler.value = textArea.value;
  textArea.style.height = textRuler.scrollHeight + 'px';
};
```
