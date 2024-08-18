---
title: "因为我记性差才做的 JavaScript 笔记"
date: "2020-12-02 23:05:06"
---

今年开始学习了 JavaScript 这门语言，随着学习的深入，我逐渐发现了我的记忆力好像弱到有些无法忍受，所以就有了这份笔记。

## String

字符转 ASCII 码：

```javascript
'a'.charCodeAt(0); // 97
```

ASCII 转字符串：

```javascript
String.fromCharCode(num1[, ...[, numN]])
String.fromCharCode(97); // 'a'
```

`String.fromCharCode` 函数其实是返回指定的 `UTF-16` 代码单元创建的字符串，有一个更加先进的方法 `Stirng.fromCodePoint`也可以用于 ASCII 转 字符串，支持扩展的 Unicode 编码：

```javascript
String.fromCodePoint(num1[, ...[, numN]])
String.fromCodePoint(9731, 9733, 9842, 0x2F804)); // "☃★♲你"
```



## Array

`Array.prototype.push()` 方法可以接收多个参数，并将每个参数都放在数组的末尾（而不是只能有一个参数）

不推荐使用 `for...in` 语法访问数组，因为可能会有数组下标之外的

## Object

### 描述符

从 ES5 开始，所有的对象属性都有了属性描述符（descriptor）

- **value**：值
- **writable**：是否可写
- **enumrable**：是否可迭代
- **configurable**：是否可配置（包含不可删除）
- **getter**：[[GET]]（访问器属性）
- **setter**：[[SET]]（访问器属性）

对象的属性分为两种：**数据属性**和**访问器属性**

- **数据属性：** `value`，`writable`，`enumrable`，`configurable`
- **访问器属性：** `get`，`set`，`enumrable`，`configurable`

两种属性是不能共存的，如果既定义了 `value` 和 `writable` ，又定义了 `get` 和 `set`，则会报出错误：

> TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute

```javascript
Object.getOwnPropertyDescriptor(obj, a); // 获取某一属性的属性描述符，返回值为一个对象
// {
//     configurable: true,
//     enumerable: true,
//     value: 2,
//     writable: true
// }

Object.getOwnPeropertyDescriptors(obj) // 获取所有属性的属性描述符，返回值为一个对象，对象的每个属性对应该属性的属性描述符对象。
```

也可以通过 `Object.defineProperty()` 和 `Object.defineProperties()` 方法定义属性（当属性 `configurable: true` 时），同时规定其属性描述符（当然也可以用于修改）

```javascript
// 3个参数，定义属性是时，未明确说明的属性描述符一律为 false，修改时未说明则遵循原样
Object.defineProperty(object1, 'property1', {
  value: 42,
  writable: false
});

// 2个参数，第二个参数为所有属性的描述符组成的对象
Object.defineProperties(object1, {
  property1: {
    value: 42,
    writable: true
  },
  property2: {}
});
```

> **例外：** 即使 configurable：false，也可以将 writable 由 true 改为 false，但不能反过来从 false 修改成 true。



### 获取属性

- `Object.keys(obj)` 获取 obj 的可枚举自有属性
- `Object.getOwnPropertyNames(obj)` 获取 obj 的所有自有属性（包括不可枚举属性）

`in` 操作符可以检测一个属性是否在某个对象上，会检查原型链，也包括不可枚举属性。



## 迭代器

迭代器对象的 `next()` 方法返回包含 `value` 和 `done` 的对象，`done`  为一个布尔值，表示迭代是否结束，`value` 则是当前值。

```javascript 示例
let s = new Set();
s.add('a').add('b').add('c');
let iter = s.values();
console.log(iter.next()); // { value: "a", done: false }
console.log(iter.next()); // { value: "b", done: false }
console.log(iter.next()); // { value: "c", done: false }
console.log(iter.next()); // { value: undefined, done: true }
```

`Map` 对象的 `entries()`方法返回一个对键值对的迭代器，形如 `{ value: [ 'a', 1 ], done: false }`，数组中第一个值为 key，第2个值为 value。`Set`对象也有 `entries()` 方法，由于 `Set` 不是键值结构，所以 `entries()` 中的 value 是两个元素相同的数组。



## Map 和 Set

`Map` 和 `Set` 对应的 `set()` 和 `add()` 方法都可以链式调用。

`Map` 和 数组互相转化，这一操作可用于 `Map` 内元素的排序。

```javascript Map 和数组互相转化
// 1. Map 对象转化为数组
// m 为 Map { 'a' => 1, 'b' => 2 }
Array.from(m) // [ [ 'a', 1 ], [ 'b', 2 ] ]
[...m] // [ [ 'a', 1 ], [ 'b', 2 ] ]

// 2. 数组转化为 Map
new Map([ [ 'a', 1 ], [ 'b', 2 ] ]) // Map { 'a' => 1, 'b' => 2 }
```



## ES6 Module

### 导出

- 命名导出（named export）

  1. 在声明时导出
  2. 使用花括号

- 默认导出（default export）

  ```javascript
  export default foo
  或
  export { foo as default }
  ```

命名导出和默认导出可以混合使用

### 导入

命名和默认导出的内容有不同导入形式。

若通过标识符原生原生加载模块，泽文件必须带有 `.js` 扩展名。



## This

观察下面代码的输出

```javascript 你不知道的JS P97
function foo() {
    console.log(this.a);
}

let a = 2;
let o = {a: 3, foo: foo};
let p = {a: 4};

o.foo(); // 3
(p.foo = o.foo)(); // 2
```

上面的 `p.foo = o.foo` 不是输出2，而是输出了3，这有一些违反直觉。实际上，表达式 `p.foo = o.foo` 的返回值是目标函数的引用，所以这里的 `this` 不是隐式绑定而是**默认绑定**，这种情况下我们创建了一个函数的**间接引用**。



## DOM

`property` 和 `attribute` 的区别是，`property` 是 DOM 对象的属性，而 `attribute` 则是我们写在 HTML 标签中的键值。`property` 和 `attribute` 并非完全一一对应，但会有对应的情况，比如 `id`，也会有不同名称不同但内容对应的情况，比如 `attribute` 中的 `class` 和 `property` 中的 `className`。



## 参考

- 《JavaScript高级程序设计》：第4版
- 《你不知道的JavaScript》
- [MDN web docs](https://developer.mozilla.org/zh-CN/)

