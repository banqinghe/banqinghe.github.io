---
title: "HTML笔记(2) 表格和表单"
date: "2020-04-07 16:27:33"
---

承接前一个笔记，内容相对较少，记录的是HTML中表格和表单的基本用法。这里的一些部分确实需要借助CSS/JavaScript来协作完成，所以我就先搁置了。希望能尽快回来填坑。

## 表格

### 基本元素

- **td（table data）：** 单元格
- **tr（table row）：** 规定一行的开始和结束
- **th（table head）：** 将一个单元格表示为标题，用法和td相同

> **注意**: 即使你不给表格添加你自己的样式，表格标题也会带有一些默认样式：加粗和居中，让标题可以突出显示。

### 允许单元格跨越多行和列

表格中的标题和单元格有 `colspan` 和 `rowspan` 属性，这两个属性可以帮助我们实现这些效果。这两个属性接受一个没有单位的数字值，数字决定了它们的宽度或高度是几个单元格。比如, `colspan="2"` 使一个单元格的宽度是两个单元格。

示例：

```html
<table>
    <tr>
        <th colspan="2">Animals</th>
    </tr>
    <tr>
        <th colspan="2">Hippopotamus</th>
    </tr>
    <tr>
        <th rowspan="2">Horse</th>
        <td>Mare</td>
    </tr>
    <tr>
        <td>Stallion</td>
    </tr>
    <tr>
        <th colspan="2">Crocodile</th>
    </tr>
    <tr>
        <th rowspan="2">Chicken</th>
        <td>Cock</td>
    </tr>
    <tr>
        <td>Rooster</td>
    </tr>
</table>
```

<table>
    <tr>
        <th colspan="2">Animals</th>
    </tr>
    <tr>
        <th colspan="2">Hippopotamus</th>
    </tr>
    <tr>
        <th rowspan="2">Horse</th>
        <td>Mare</td>
    </tr>
    <tr>
        <td>Stallion</td>
    </tr>
    <tr>
        <th colspan="2">Crocodile</th>
    </tr>
    <tr>
        <th rowspan="2">Chicken</th>
        <td>Cock</td>
    </tr>
    <tr>
        <td>Rooster</td>
    </tr>
</table>

### 为表格中的列提供共同的样式

表格是按行写入数据，所以统一控制一整行样式很容易做到，但是为共同的列提供共同样式就有一点困难。好在使用`<col>`和`<colgroup>`元素可以较为轻易地做到这一点。

```html
<table>
    <colgroup>
        <col style="background-color: yellow" span="1">
    </colgroup>
    <tr>
        <th>Data 1</th>
        <th>Data 2</th>
    </tr>
    <tr>
        <td>Calcutta</td>
        <td>Orange</td>
    </tr>
    <tr>
        <td>Robots</td>
        <td>Jazz</td>
    </tr>
</table>
```

    <table>
        <colgroup>
            <col style="background-color: yellow" span="1">
        </colgroup>
        <tr>
            <th>Data 1</th>
            <th>Data 2</th>
        </tr>
        <tr>
            <td>Calcutta</td>
            <td>Orange</td>
        </tr>
        <tr>
            <td>Robots</td>
            <td>Jazz</td>
        </tr>
    </table>

可以分别对每一列作出不同的定义，比如`<colspan>`中可以是：

```html
<col>
<col style="background-color: yellow">
```

上面的代码表示对第一列什么也不做，让第二列背景颜色为黄色。

`span`属性可以指定`<col>`表示的列的跨度。



### 表格标题、表头、页脚、正文

可以将`<caption>`元素放在`<table>`下面，作为表格的标题（下面的course）。

<table>
        <caption>course</caption>
        <colgroup>
            <col>
            <col>
            <col style="background-color: #97DB9A;">
            <col style="width: 42px;">
            <col style="background-color: #97DB9A;">
            <col style="background-color:#DCC48E; border:4px dashed #C1437A;">
            <col style="width: 42px;" span="2">
        </colgroup>
        <tr>
            <td>&nbsp;</td>
            <th>Mon</th>
            <th>Tues</th>
            <th>Wed</th>
            <th>Thurs</th>
            <th>Fri</th>
            <th>Sat</th>
            <th>Sun</th>
        </tr>
        <tr>
            <th>1st period</th>
            <td>English</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>German</td>
            <td>Dutch</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <th>2nd period</th>
            <td>English</td>
            <td>English</td>
            <td>&nbsp;</td>
            <td>German</td>
            <td>Dutch</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <th>3rd period</th>
            <td>&nbsp;</td>
            <td>German</td>
            <td>&nbsp;</td>
            <td>German</td>
            <td>Dutch</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <th>4th period</th>
            <td>&nbsp;</td>
            <td>English</td>
            <td>&nbsp;</td>
            <td>English</td>
            <td>Dutch</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
    </table>

`<thead>`, `<tfoot>`,和 `<tbody>`, 这些元素允许你把表格中的部分标记为表头、页脚、正文部分。

- `<thead>` 需要嵌套在 table 元素中，放置在头部的位置，因为它通常代表第一行，第一行中往往都是每列的标题，但是不是每种情况都是这样的。如果你使用了 `<col>`/`<colgroup>` 元素，那么 `<thead>`元素就需要放在它们的下面。
- `<tfoot>` 需要嵌套在 table 元素中，放置在底部 (页脚)的位置，一般是最后一行，往往是对前面所有行的总结，比如，你可以按照预想的方式将`<tfoot>`放在表格的底部，或者就放在 `<thead>` 的下面。(浏览器仍将它呈现在表格的底部)
- `<tbody>` 需要嵌套在 table 元素中，放置在 `<thead>`的下面或者是 `<tfoot>` 的下面，这取决于你如何设计你的结构。(`<tfoot>`放在`<thead>`下面也可以生效.)

即使代码中么有写，tbody也是被浏览器隐式添加的：

![被隐式添加的tbody](https://raw.githubusercontent.com/banqinghe/blog/main/images/HTML%E7%AC%94%E8%AE%B0-2-%E8%A1%A8%E6%A0%BC%E5%92%8C%E8%A1%A8%E5%8D%95/tbody.png)

即使`<tfoot>`写在`<thead>`下面，它仍然会在表格的最后显示。

表格是可以嵌套的，但是不推荐使用，除非不得已：

<table id="table1">
  <tr>
    <th>title1</th>
    <th>title2</th>
    <th>title3</th>
  </tr>
  <tr>
    <td id="nested">
      <table id="table2">
        <tr>
          <td>cell1</td>
          <td>cell2</td>
          <td>cell3</td>
        </tr>
      </table>
    </td>
    <td>cell2</td>
    <td>cell3</td>
  </tr>
  <tr>
    <td>cell4</td>
    <td>cell5</td>
    <td>cell6</td>
  </tr>
</table>

### 对于视力受损的用户的表格

教程中反复提到视力受损用户这个名词，这相当好。

**1. 使用行和列的标题**

在`<th>`标签中可以使用`scope`属性，用来说明这个标题是一个行标题还是列标题。

```html
<th scope=''row">行标题</th>
<th scope="col">列标题</th>
<th scope="rowgroup">多行的标题</th>
<th scope="colgroup">多列的标题</th>
```

**2. 使用id和header属性**

1. 为每个 元素添加一个唯一的 `id` 。
2. 为每个  元素添加一个 `headers` 属性。每个单元格的`headers` 属性需要包含它从属于的所有标题的id，之间用空格分隔开。

这样可以精确地定义某个td是从属于某个标题，但是容错率比较低，对于大部分情形，使用行和列标题已经够用了。

```html 示例
<thead>
  <tr>
    <th id="purchase">Purchase</th>
    <th id="location">Location</th>
    <th id="date">Date</th>
    <th id="evaluation">Evaluation</th>
    <th id="cost">Cost (€)</th>
  </tr>
</thead>
<tbody>
<tr>
  <th id="haircut">Haircut</th>
  <td headers="location haircut">Hairdresser</td>
  <td headers="date haircut">12/09</td>
  <td headers="evaluation haircut">Great idea</td>
  <td headers="cost haircut">30</td>
</tr>

  ...

</tbody>
```



## 表单

### 表单创建

- **\<form>:** 是一个容器元素，正式定义一个表单。其中所有的属性都是可选的，但是实践中最好需要设置`action`和`method`属性。

  - **method：**定义了在提交表单时,应该把所收集的数据送给谁(/那个模块)(URL)去处理。.
  - 定义了发送数据的HTTP方法(它可以是“get”或“post”).

- **\<label>、\<input>、\<textarea>:**

  ```html
  <form action="/my-handling-form-page" method="post">
    <div>
      <label for="name">Name:</label>
      <input type="text" id="name">
    </div>
    <div>
      <label for="mail">E-mail:</label>
      <input type="email" id="mail">
    </div>
    <div>
      <label for="msg">Message:</label>
      <textarea id="msg"></textarea>
    </div>
      <div class="button">
          <button type="submit">Send your message</button>
      </div>
  </form>
  ```

  注意在所有`<label>`元素上使用for属性；它是将标签链接到表单小部件的一种正规方式。这个属性引用对应的小部件的`id`。这样做有一些好处。最明显的一个好处是允许用户单击标签以激活相应的小部件。

  - **input中的属性：**
    - **text:** 这个属性的默认值。它表示一个基本的单行文本字段，接受任何类型的文本输入
    - **email:** 只接受格式正确的电子邮件地址的单行文本字段。这会将一个基本的文本字段转换为一种“智能”字段，该字段将对用户输入的数据进行一些检查。
  - **textarea：**input是一个空元素，但是textarea不是，它的内容是文本框中的默认值。

- **\<button>：**

  `<button>`元素也接受一个 type属性，它接受submit, reset或者 button 三个值中的任一个

  - **submit：**将表单数据发送到form元素中action指定的网页
  - **reset：**将所有小部件设定为它们的默认值
  - **button：**不会发生任何事

- **\<fieldset> 和 \<legend> 元素**

  `<fieldset>`元素是一种方便的用于创建具有相同目的的小部件组的方式，出于样式和语义目的。 你可以在`<fieldset>`开口标签后加上一个 `<legend>`元素来给`<fieldset>` 标上标签。 `<legend>`的文本内容正式地描述了`<fieldset>`里所含有部件的用途。

  ```html
  <form>
    <fieldset>
      <legend>Fruit juice size</legend>
      <p>
        <input type="radio" name="size" id="size_1" value="small">
        <label for="size_1">Small</label>
      </p>
      <p>
        <input type="radio" name="size" id="size_2" value="medium">
        <label for="size_2">Medium</label>
      </p>
      <p>
        <input type="radio" name="size" id="size_3" value="large">
        <label for="size_3">Large</label>
      </p>
    </fieldset>
  </form>
  ```

  fieldset有一个边框，并在边框上显示标题。

  可以使用fieldset将一个长表单分段。

- **\<label>元素**

  **`label` 标签与 `input` 通过他们各自的`for` 属性和 `id` 属性正确相关联**（label的for属性和它对应的小部件的id属性），这样，屏幕阅读器会读出诸如“Name, edit text”之类的东西。

  一个小部件也可以嵌套在`<label>`标签里面（但是考虑到一些辅助组件不支持，不及上面的好）。

  正确设置标签的另一个好处是可以在所有浏览器中**单击标签来激活相应的小部件**。对于radio或者checkbox来说，点击标签也可以达到激活部件的效果。

  一个小部件上可以放置多个标签，但是最好把它们放在一个`<label>`里面：

  ```html
  <div>
          <label for="username">Name: <abbr title="required">*</abbr></label>
          <input id="username" type="text" name="username">
  </div>
  ```



### 向Web服务器发送表单数据

为了将表单数据发送到服务器，我们需要给数据一个名称：

```html
<form action="/my-handling-form-page" method="post">
  <div>
    <label for="name">Name:</label>
    <input type="text" id="name" name="user_name">
  </div>
  <div>
    <label for="mail">E-mail:</label>
    <input type="email" id="mail" name="user_email">
  </div>
  <div>
    <label for="msg">Message:</label>
    <textarea id="msg" name="user_message"></textarea>
  </div>
    ...
```

即上面的`user_name`，`user_email`，`user_message`，这些数据会使用HTTP的POST方法发送到`/my-handling-form-page`



### 原生表单部件

#### 文本输入框

`<input>`是最基本的表单小部件，只能进行简单的输入，而不能执行富文本输入（支持粗体、斜体等）。富文本编辑器都是程序员使用HTML、CSS、JavaScript自己创建的。

在这里查看input的所有属性和说明：[MDN input文档](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#attr-spellcheck)

所有文本框都有一些通用规范：

- 它们可以被标记为 `readonly` (用户不能修改输入值)甚至是 `disabled` (输入值永远不会与表单数据的其余部分一起发送)。
- 它们可以有一个 `placeholder`，这是文本输入框中出现的文本，用来简略描述输入框的目的（默认为灰色，不是实体文字）。
- 它们可以被限制在`size` (框的物理尺寸) 和`minlength / maxlength`(可以输入的最小 / 最大字符数)。
- 如果浏览器支持的话，他们可以从拼写检查中获益。

`<input>`为单行文本框，此外还有多行文本框`<textarea>`。

- **单行文本框**

通过input的type属性可以指定文本框的类型，`text`为最基本的文本框类型，此外还有`email`，`password`，`search`，`tel`，`url`，`time`，`date`等，详见上文给出的‘MDN input文档’。

单行文本框中的默认文本需要设置value属性。

单行文本框在submit的时候会去除用户输入的换行符。

- **多行文本框**

多行文本框`<textarea>`和`<input>`之间最显著的区别是，多行文本框允许用户输入硬换行符(\n)。而且`<textarea>`不是一个空元素，开始标签和结束标签可以放置文本框的默认文本。

常规属性：

| 属性名 | 默认值 | 描述                                                 |
| :----- | :----- | :--------------------------------------------------- |
| `cols` | `20`   | 文本控件的可见宽度，平均字符宽度。                   |
| `rows` |        | 控制的可见文本行数。                                 |
| `wrap` | `soft` | 表示控件是如何包装文本的。可能的值：`hard` 或 `soft` |

> 关于wrap：
>
> - hard: 在文本到达元素最大宽度的时候，浏览器自动插入换行符(CR+LF) 。比如指定 `cols`值。
> - soft: 在到达元素最大宽度的时候，不会自动插入换行符

在这里查看textarea的属性和说明：[MDN textarea文档](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)

多行文本框右下角可拖拉，可在CSS中将resize属性设置为none来关闭这一特性。



#### 下拉内容

- **选择框**

由`<select>`，多个`<option>`设定作为子元素，使用`<option>`中的selected属性表示该选项默认选项。`<option>`可以嵌套在`<optgroup>`中，为选项分组。

```html
<select id="groups" name="groups">
  <optgroup label="fruits">
    <option>Banana</option>
    <option selected>Cherry</option>
    <option>Lemon</option>
  </optgroup>
  <optgroup label="vegetables">
    <option>Carrot</option>
    <option>Eggplant</option>
    <option>Potato</option>
  </optgroup>
</select>
```

<select id="groups" name="groups">
  <optgroup label="fruits">
    <option>Banana</option>
    <option selected>Cherry</option>
    <option>Lemon</option>
  </optgroup>
  <optgroup label="vegetables">
    <option>Carrot</option>
    <option>Eggplant</option>
    <option>Potato</option>
  </optgroup>
</select>

> **注意：**如果一个`<option>`元素设置了value属性，那么当提交表单时该属性的值就会被发送。如果忽略了value属性，则使用`<option>`元素的内容作为选择框的值。

- **多选选择框**

通过将`multiple`属性添加到`<select>`元素，您可以允许用户通过操作系统提供的默认机制来选择几个值。选择框不再显示值为下拉内容——相反，它们都**显示在一个列表中**。

- **自动补全输入框**

您可以使用`<datalist>`元素来为表单小部件提供建议的、自动完成的值，并使用一些`<option>`子元素来指定要显示的值。

`<input>`使用list属性和`datalist`建立联系。

```html
<label for="myFruit">What's your favorite fruit?</label>
<input type="text" name="myFruit" id="myFruit" list="mySuggestion">
<datalist id="mySuggestion">
  <option>Apple</option>
  <option>Banana</option>
  <option>Blackberry</option>
  <option>Blueberry</option>
  <option>Lemon</option>
  <option>Lychee</option>
  <option>Peach</option>
  <option>Pear</option>
</datalist>
```

可以将option套用在一个`<select>`里面，依次作为不支持`<datalist>`的浏览器的备用选项。



#### 可选中项

使用`type`属性值为`checkbox`的 `<input>`元素来创建一个复选框。

```html
<input type="checkbox" checked id="carrots" name="carrots" value="carrots">
```

使用`type`属性值为`radio`的 `<input>`元素来创建一个单选按钮。

```html
<input type="radio" checked id="soup" name="meal" value="soup">
```

几个单选按钮可以连接在一起。**如果它们的`name`属性共享相同的值，那么它们将被认为属于同一组的按钮。**



#### 按钮

按钮有`submit`，`reset`，`button`三种，可以使用`<button>`创建按钮，也可以使用`<input>`将`type`设置为`submit`、`reset`、`button`来创建按钮。但是使用`<input>`的话，按钮上的文字只能在`value`属性处设置，所以只能是纯文本。



#### 高级表单部件

用以输入不寻常或是复杂的数据。

- **数字**

  将`<input>`的`type`属性设置为`number`，只允许浮点数，而且提供按钮来增大或减少部件的值。

  - 可以通过设置`min`和`max`属性来约束该值。
  - 通过设置`step`属性来指定增加和减少按钮更改小部件的步进值大小。

  下面的例子中，允许出现的值只能是1-10之间的奇数。

  ```html
  <input type="number" name="age" id="age" min="1" max="10" step="2">
  ```

- **滑块**

  从视觉上讲，滑块没有文本字段准确，因此它们被用来选择一个确切值并不重要的数字。

  滑块是通过把`<input>`元素的`type`属性值设置为`range`来创建的。正确配置滑块是很重要的；为了达到这个目的，我们强烈建议您设置`min`、`max`和`step`属性。

  滑块的一个问题是，它们**不提供任何形式的视觉反馈，以了解当前的值是什么。**您需要使用JavaScript来添加这一点，但这相对来说比较容易。

- **日期时间**

  - 本地时间（包含日期和时间）

    ```html
    <input type="datetime-local" name="datetime" id="datetime">
    ```

  - 月

    ```html
    <input type="month" name="month" id="month">
    ```

  - 时间

    ```html
    <input type="time" name="time" id="time">
    ```

  - 星期

    ```html
    <input type="week" name="week" id="week">
    ```

  **所有日期和时间控制都可以使用`min`和`max`属性来约束。**

  ```html
  <label for="myDate">When are you available this summer?</label>
  <input type="date" name="myDate" min="2013-06-01" max="2013-08-31" id="myDate">
  ```

- **拾色器**

  ```html
  <input type="color" name="color" id="color">
  ```

- **文件选择器**

  要创建一个文件选择器小部件，您可以使用[``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input)元素，将它的`type`属性设置为`file`。被接受的文件类型可以使用[accept](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input#attr-accept)属性来约束。此外，如果您想让用户选择多个文件，那么可以通过添加`multiple`属性来实现。

  ```html
  <input type="file" name="file" id="file" accept="image/*" multiple>
  ```

- **隐藏内容**

  有时候，由于为了方便技术原因，有些数据是用表单发送的，但不显示给用户。要做到这一点，您可以在表单中添加一个不可见的元素。要做到这一点，需要使用[``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input)将它的`type`属性设置为`hidden`值。

  ```html
  <input type="hidden" id="timestamp" name="timestamp" value="1286705410">
  ```

- **图像按钮**

  图像按钮控件是一个与`<img>`元素完全相同的元素，除了当用户点击它时，它的行为就像一个提交按钮:

  ```html
  <input type="image" alt="Click me!" src="my-img.png" width="80" height="30" />
  ```

- **进度条**

  一个进度条表示一个值，它会随着时间的变化而变化到最大的值，这个值由`max`属性指定。这样的一个bar是使用`progress`元素创建的。

  ```html
  progress max="100" value="75">75/100</progress>
  ```

- **仪表**

  一个仪表表示一个固定值，这个值由一个`min`和一个`max`值所界定。这个值是作为一个条形显示的，并且为了知道这个工具条是什么样子的，我们将这个值与其他一些设置值进行比较。

  这样的一个工具栏是使用[\<meter>](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meter)元素创建的:

  ```html
  <meter min="0" max="100" value="75" low="33" high="66" optimum="50">75</meter>
  ```



### 表单验证

在客户端主要有两种验证表单合法性的方式：

- HTML5内置的表单验证
- JavaScript验证

> **警告：**永远不要信任从客户端传递到服务器的数据。即使您的表单可以正确验证并防止客户端输入错误，恶意用户仍然可以更改网络请求。

#### 使用内置的表单验证

如果元素有效，会与CSS的`:valid`伪类匹配，否则和`:invalid`伪类匹配。

内置表单验证有下面几种：

- `required`：指定在提交表单之前是否需要填写表单字段。
- `minlength`和`maxlength`：指定文本数据（字符串）的最小和最大长度
- `min`和`max`：指定数字输入类型的最小值和最大值
- `type`：指定数据是数字，电子邮件地址还是其他特定的预设类型。
- `pattern`：指定[正则表达式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)，该正则表达式定义输入的数据需要遵循的模式。

一个CSS例子：

```css
input:invalid {
  border: 2px dashed red;
}

input:invalid:required {
  background-image: linear-gradient(to right, pink, lightgreen);
}

input:valid {
  border: 2px solid black;
}
```

根据上面的CSS代码，用户输入合法时边框为黑色实线，不合法时边框则为红色虚线，如果不满足`required`属性则背景为指定的渐变色。

**使用正则表达式进行验证**

下面的表单只允许用户输入`Cherry`，`cherry`，`Banana`，`banana`这四个单词中的任意一个：

```html
<form>
  <label for="choose">Would you prefer a banana or a cherry?</label>
  <input id="choose" name="i_like" required pattern="[Bb]anana|[Cc]herry">
  <button>Submit</button>
</form>
```

某些`input`元素类型不需要`pattern`针对正则表达式验证属性，如`email`。`<textarea>`不支持`pattern`。



#### 使用JavaScript验证表单

（略 略略略）

