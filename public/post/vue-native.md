# Vue 中的 .native

之前在使用 `element` 组件库做课程项目的时候，也遇到了点击组件没有效果的问题，当时也是在网上随便一搜，在事件后面加上 `.native` 修饰符就解决了。

这次我遇到了同样的问题：

```html
<el-dropdown-item @click="renameVisible = true">重命名</el-dropdown-item>
```

对于下拉组件的点击并没有达到我所预期的效果，`renameVisible` 并没有被置为 `true`。我上网搜了“el-dropdown-item点击无效”，给出的解决方法十分简短：“在 `@click` 之后加上 `.native`”，我尝试了以下发现程序确实按照我所预期地执行了。



---



但是为什么呢？

Vue 官方API 中对于 `.native` 修饰符的说明是：

> `.native` - 监听组件根元素的原生事件。

好好看了一下文档我才明白，原来在组件上能监听的事件都叫做“自定义事件”，我原来一直以为自定义事件是名字和原生事件不一样的事件，现在才知道原来自定义组件监听的即使是 `click`，它也叫“自定义事件”。

自定义事件应该由组件内部使用 `$emit()` 方法触发，像前面的 `el-dropdown-item` 组件，组件根元素被点击时并没有 `$emit('click')`，所以组件上的 `renameVisible = true` 这个表达式也就根本没有被执行。

使用 `.native` 会让组件把触发的事件当做原生事件而不是自定义事件，所以就可以像监听一个原生 DOM 元素的事件一样处理了。



后面我也发现原来 `dropdown-item` 还有一个 `command` 事件，他是 <em>点击菜单项触发的事件回调</em>，（`click` 事件另有他用） 所以之前的语句有两种写法可以令其生效：

- ```html
  <el-dropdown-item @click.native="renameVisible = true">重命名</el-dropdown-item>
  ```

- ```html
  <el-dropdown-item @command="renameVisible = true">重命名</el-dropdown-item>
  ```



---



我迟迟没有发现这个问题还是有原因的，最起码我在 `<el-button>` 上从未遇到过这个问题，最近开始看源码才知道这个 `click` 其实是自定义事件这回事：

```html
<button
  class="el-button"
  @click="handleClick"
  ...
>
```

```javascript
methods: {
  handleClick(evt) {
    this.$emit('click', evt);
  }
}
```



`<el-dropdown-item>` 中没有那么简单，是当受到点击时，使用 `dispatch` 方法将传递给父组件处理。