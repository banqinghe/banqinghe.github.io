---
title: "极简的 Python 入门指南"
date: "2020-02-16 22:48:44"
---

说是指南，其实这篇文章基本上就是《Python编程：从入门到实战》前半部分、即1至11章的读书笔记。说它“极简”，是因为我觉得我目前从这本书里学到的知识只是python知识树的主干，还远远不够丰富。但最起码算是对python这个语言有了一定的了解。

## 变量和数据

### 字符串

可以使用双引号或者是单引号包裹字符串。两种引号都支持的好处是，让你能够在字符串中包含引号和撇号：

```python
'I told my friend, "Python is my favorite language!"'
"The language 'Python' is named after Monty Python, not the snake."
```

`str.title()`方法，返回字符串中的单词首字母大写，非首字母小写之后的结果。

`str.upper()`、`str.lower()`：返回字符串全部大写/小写的结果。

使用'+'号来拼接字符串（和Java相同）

```python
print('Hello, ' + full_name.title() + "!");
```

删除字符串头尾的空白，使用`strip()`方法，和Java中的`trim()`方法完全相同。但是python也额外提供了删除头部空白（`lstrip()`）和删除尾部空白（`rstrip()`）的方法。

python 3中的`print`后面必须有一个括号，但是python 2的`print`后面的括号可有可不有，要视具体情况而定。

### 数字

python无法像Java一样识别下面的句子：

```python
age = 18
message = 'Happy ' + age + 'rd Birthday!'
```

Java中，`age`会自动在字符串拼接操作中转化为String，但是python中我们需要使用`str()`函数将非字符串的变量转化为一个字符串，如下：

```python
message = 'Happy ' + str(age) + 'rd Birthday!'
```

整数除法时python 2和python 3有所差异：

```python
>>> python 2
>>> 3 / 2
1
>>> 3 // 2
1

>>> python 3
>>> 3 / 2
1.5
>>> 3 // 2
1
```

不规定小数点位数，使用浮点数运算可能会出现一些意料之外的结果：

```python
>>> 0.2 + 0.1
0.30000000000000004
```

python中执行import this可获取“Python之禅”（彩蛋）



## 列表

Python为访问最后一个列表元素提供了一种特殊语法。通过将索引指定为`-1` ，可让Python返回最后一个列表元素这是因为**负数索引返回离列表末尾相应距离的元素**，-1索引表示倒数第一个元素，-3表示倒数第3个元素。

- 在列表的额末尾添加元素，使用`append()`函数：

  ```python
  >>> motorcycles = [] # 创建列表
  >>> motorcycles.append('ducati')
  >>> print(motorcycles)
  ['ducati']
  ```

- 插入元素 `insert()`:

  ```python
  >>> motorcycles = ['honda', 'yamaha', 'suzuki']
  >>> motorcycles.insert(0, 'ducati')
  >>> print(motorcycles)
  ['ducati', 'honda', 'yamaha', 'suzuki']
  ```

- 删除元素 `del()`:

  ```python
  del motorcycles[0] # 删除该列表索引为0的元素
  ```

- 使用`pop()`删除列表的元素：

  ```python
  motorcycles.pop() # 删除列表末尾元素
  motorcycles.pop(0) # 删除0号索引元素
  ```

  **ps：**`pop()`返回删除的元素

- 根据值删除元素 `remove()` ，会删除第一个匹配的元素：

  ```python
  num = [1, 2, 1]
  num.remove(1)
  print(num)
  输出：[2, 1]
  ```

- 永久性排序 `sort()` ：

  ```python
  cars = ['bmw', 'audi', 'toyota', 'subaru']
  cars.sort() # 升序
  cars.sort(reverse=True) # 降序
  ```

- 临时性排序 `sorted()`：

  ```python
  print(sorted(cars))
  # 打印了排序之后的结果，但是cars列表内元素的顺序还是没有改变
  print(sorted(cars, reverse=True)) # 和sort()一样，可以顺序翻转
  ```

- 列表反转 `reverse()`

  ```python
  cars.reverse()
  ```

- 得到列表长度 `len()`

  ```python
  print(len(cars))
  ```



---



## 操作列表

### for循环

使用`for item in list:`的形式进行for循环，注意语句末尾需要一个冒号，**缩进的语句为循环体内的内容**。

```python
  magicians = ['alice', 'david', 'carolina']
  for magician in magicians:
      print(magician.title() + ", that was a great trick!")
      print("I can't wait to see your next trick, " + magician.title() + ".\n")

print("Thank you, everyone. That was a great magic show!")
```

当然，如果我们作出了不必要的（莫名其妙的）缩进，python将指出这一错误。

### 数值列表

使用`range()`可以产生一个数字列表：

```python
for value in range(1, 5):
    print(value)
```

打印的结果是从1到4，由此可见`range()`函数产生的数字区间是左闭右开的，编程中有关区间的操作基本都是这样。

可使用函数`list()` 将`range()` 的结果直接转换为列表。如果将`range()` 作为`list()` 的参数，输出将为一个数字列表。

```python
num = list(range(1, 5))
print(num)
```

```text 输出结果：
[1, 2, 3, 4]
```



`range()`函数也可以使用第三个参数指定步长：

```python
even_numbers = list(range(2,11,2))
print(even_numbers)
```

```text 输出结果：
[2, 4, 6, 8, 10]
```



对于一个数字列表（digit）执行简单的统计计算：

- **min(digit)** 获取最小值
- **max(digit)** 获取最大值
- **sum(digit)** 获取总和



列表解析：

```python
squares = [value**2 for value in range(1,11)]
print(squares)
```

这里的for循环成为了组建列表的一部分，末尾没有冒号，得到的是一个平方数组成的数字列表，和下面代码的作用相同：

```python
squares = []
for value in range(1, 11):
    squares.append(value**2)
print(squares)
```



### 切片

其实也就是获取列表的子列表，只不过相对于Java中`sublist()`方法要更加易用和灵活：

- **players[0:3]** 获取[0, 3)元素组成的子列表
- **players[:5]** 获取索引为5的元素之前的元素组成的列表
- **players[5:]** 获取索引为5的元素之后的元素组成的列表
- **players[-3:]** 获取后三个元素组成的列表

用切片操作还可以实现对整个列表的拷贝。对于列表来说直接使用'='赋值是只会复制引用的：

```python
a = ['charles', 'martina', 'michael', 'florence', 'eli']
print(a)
a2 = a
print(a2)
a[0] = 'hello'
print(a2)
```

上面的代码表面上看是将a复制给了a2，但是其实却并没有为a2开辟新的空间，a2仍然指向原本a指向的空间，所以改变a[0]的值的时候，a2[0]其实也会被改变，毕竟a[0]和a2[0]指向的是同一个数据，输出结果如下：

```text 输出结果：
['charles', 'martina', 'michael', 'florence', 'eli']
['charles', 'martina', 'michael', 'florence', 'eli']
['hello', 'martina', 'michael', 'florence', 'eli']
```

所以如果想复制一个列表，并且将复制的结果放在一片新的空间上，需要使用

```python
a2 = a1[:]
```



### 元组

元组是元素不可变的列表，普通的列表使用方括号赋值，但是元组使用圆括号：

```python
dimension = (200, 50)
# dimension[0] = 250 # Error: 第一个元素已经是固定的了，不能再修改
```

虽然元组的元素不可变，但是可以让元组指向一片新的空间，也就是说，虽然上面我们没办法把第一个元素改成250，但是却可以：

```python
dimension = (250, 50)
```

这样的操作是合法的。这么看来，元组其实就是一种不可变对象，和Java中的String类似。



---



## if语句

下面是一个简单的选择语句示例，最重要的事情是记得**加冒号**：

``` python
for number in range(1, 10):
    if number % 2 == 0:
        print("It's a even number.")
    elif number % 3 == 0:
        print('It is divisible by 3 and is a odd number')
    else:
        print('Other numbers')
```

```text 输出结果：
Other numbers
It's a even number.
It is divisible by 3 and is a odd number
It's a even number.
Other numbers
It's a even number.
Other numbers
It's a even number.
It is divisible by 3 and is a odd number
```

python通过条件是`True`还是`False`来判断，‘且’操作使用`and`，‘或’操作使用`or`，而不是C或是Java那样使用`&&`和`||`

我们可以通过关键字`in`检查特定值是否包含在列表中，也可以通过关键字`not in`检查特定值是否不包含在列表中：

```python
num = [1, 2, 3, 4]
if 3 in num:
    print("'3' is here")
if 6 not in num:
    print("'6' is not here")
```

```text 输出结果：
'3' is here
'6' is not here
```

if可以直接判断列表是否为空：

```python
if num:
    print(num)
else:
    print('it is empty')
```

python对条件要求没有Java那么死板：

```java
if(1)	// 在Java中这是无法通过编译的
if 1 :	# 在python中，数字为非零即是真
```



---



## 字典

python中的字典，也就是其他语言中的`map`，是一系列**键-值**对组成的结构，可以使用键来访问与之相关联的值。

### 使用字典

字典用放在花括号`{}`中的一系列键值对组成，相关联的键和值之间用冒号分割，键值对之间使用逗号分隔，下面是一个典型的实示例：

```python
alien_0 = { 'color': 'green', 'points': 5  }

print(alien_0['color']);
print(alien_0['points'])
```

```text 输出结果：
green
5
```

**1. 添加键值对：**

向字典中添加键值对的操作简单且直接：

```python
# 基于上面一块代码
alien_0['x_position'] = 0
alien_0['y_position'] = 25
print(alien_0)
```

```text 输出结果
{'color': 'green', 'points': 5, 'x_position': 0, 'y_position': 25}
```

**2. 创建一个空的字典：**

创建空的列表是将一对`[]`赋给一个变量，创建空字典的操作和这是基本一样的操作。

```python
alien_0 = {}
```

**3. 修改键值对：**

假如我们想修改上面外星人的颜色：

```python
alien_0['color'] = 'yellow'
```

**4. 删除键值对：**

和删除列表元素相同，使用`del`关键字

```python
del alien['color']
```

**5. 关于书写格式：**

无论是列表还是字典，如果元素数量很多，且依然把所有的元素都写在一行里，则会造成可读性不佳的情况。虽然python对缩进格式要求严格，却允许我们换行输入列表/字典的元素：

```python
str = [
    'apple',
    'banana'
]
dic = {
    'a': 'apple'
    'b': 'banana'
}
```

`print`其实也允许我们换行输入代码，和Java中相同，同样避免了一行过长的情况：

```python
print('My name' +
      'is Eric.')
```

### 遍历字典

**1. 遍历所有键值对**

调用一个字典的`item()`函数可以返回一个键值对列表，使我们可以通过如下方式遍历整个字典：

```python
for k, v in user_0.items():
    print("Key: " + k)
    print("Value: " + v + "\n")
```

**2. 遍历所有键**

使用字典的`keys()`函数返回一个由键组成的列表，可以通过这种方式只遍历字典的键：

```python
for k in user_0.keys():
    print("Keys: " + k)
```

**3. 遍历所有值**

调用字典的`values()`函数：

```python
for v in user_0.values():
    print("Values: " + v)
```

字典中的键都是唯一的，但是值却很可能重复，如果我们想进行去重操作，可以使用`set()`函数，使列表中的元素都是唯一的：

```python
for v in set(user_0.values()):
    print("Values: " + v)
```

---

**ps:** 值得注意的是，python中的键值对是乱序排列的，所以上面两种遍历都无法保证便利的顺序就是升序、降序，或是我们写在代码里的顺序。

**4. 按顺序遍历**

要想按顺序遍历则需要使用`sorted()`函数对由字典得到的列表进行包装，前面我们提到，这个函数可以返回一个被排序后的列表：

```python
for k in sorted(user_0.keys()):
    print("Keys: " + k)
```

### 嵌套

容器是可以互相嵌套的，字典中可以存储列表，列表中可以存储字典……

**1. 列表中存储字典**

```python
aliens = []
new_alien = {'color': 'green', 'points': 5, 'speed': 'slow'}
for alien_number in range(30):
    aliens.append(new_alien)
```

**2. 字典中存储列表**

比如我们想把每个人和他所养的宠物关联起来，每个人可能养了不止一只宠物

```python
people = {
    'Tom': ['cat', 'dog'],
    'Jake': ['goldfish', 'parrot']
}

# 访问人名和对应的宠物
for person, pets in people.items():
    print(person + " has ", end = '')
    for pet in pets[:-1]:
        print(pet, end = ", " )
    print(pets[-1])
```

```text 输出结果：
Tom has cat, dog
Jake has goldfish, parrot
```

**3. 在字典中存储字典**

下面的例子中使用了嵌套的字典结构，用户的名字和用户信息相关联，用户信息中的项又是一个字典：

```python
users = {
    'aeinstein': {
        'first': 'albert',
        'last': 'einstein',
        'location': 'princeton',
    },

    'mcurie': {
        'first': 'marie',
        'last': 'curie',
        'location': 'paris',
    },

}
```



---



## 用户输入和while循环

### 使用input()

使用`input()`函数可以接受用户的输入，可以在括号里写入提示信息：

```python
>>> name = input("Input your name: ")
Input your name: Eric
>>> name
'Eric'
```

需要注意的是，python会将这里的输入理解成一个字符串，可以使用`int()`将这个字符串转换成一个整数，也可以使用`float()`将字符串转换成一个浮点数：

```python
>>> age = input("Input your age: ")
Input your age: 20
>>> age
'20'
>>> int(age)	# 此时输出的age就没有引号包裹了，说明输出的是一个数字
20
```

**ps:** 如果使用python 2.7获取用户的输入，需要使用`raw_input()`，如果使用`input()`，python则会将用户输入解读为python代码，尝试运行它。



### while循环

无论是C/C++，还是Java，while循环都是可以被for循环代替的，但是目前来看，python中的for循环只能完成起到遍历或是循环指定次数的作用，很难直观地做到“循环不断地运行，直到指定的条件不满足为止”，while循环的作用即是实现这一功能。

用while实现输出1-5的数字：

```python
num = 1
while num <= 5:
    print(num)
    num += 1
```

**1. 使用break退出循环**

```python
while True:
    city = input()
    if city == 'quit':
        break
    else:
        print("I'd love to go to " + city.title() + "!")
```

**2. 使用continue**

使用`continue`关键字可以终止本轮循环，开始下一轮循环。

`break`和`continue`当然也都适用于for循环。

**3. 操作列表/字典**

列表没有提供`removeAll()`函数，所以可以使用while循环来达到相同的效果：

```python
pets = ['dog', 'cat', 'dog', 'goldfish', 'cat', 'rabbit', 'cat']
print(pets)

while 'cat' in pets:
    pets.remove('cat')

print(pets)
```

```text 输出结果：
['dog', 'cat', 'dog', 'goldfish', 'cat', 'rabbit', 'cat']
['dog', 'dog', 'goldfish', 'rabbit']
```



---



## 函数

> 函数是带名字的代码块，用于完成具体的工作。

### 定义函数

一个简单的例子：

```python
def greet_user():
    """显示简单的问候语"""
    print("Hello")

greet_user()
```

- 使用`def`定义一个函数，函数后记得冒号

- 缩进的部分为函数体
- 使用三对引号括起来的是**文档字符串**，Python使用它们来生成有关程序中函数的文档，虽然看起来和注释一样，但是却python却不能根据'#'后面的内容生成函数文档。

### 参数传递

调用函数的时候，把实参和形参关联起来有两种方式：**位置实参**和**关键字实参**。

**1. 位置实参**

是我们直觉中的参数传递方式，根据传入实参的位置将它和形式参数关联起来，第n个实参就和第n个形参关联：

```python
def describe_pet(animal_type, pet_name):
    """显示宠物的信息"""
    print("I have a " + animal_type + ".")
    print("My " + animal_type + "'s name is " + pet_name.title() + ".")

describe_pet('hamster', 'harry')
```

这里实参`'hamster'`对应着形参`animal_type`，`'harry'`对应着`pet_name`。使用位置实参很简洁直观，但是万一搞错了输入实参的顺序，就会出现问题。使用关键字实参可以解决这一可能出现的问题。

**2. 关键字实参**

在调用函数传入参数的时候，使用等号建立实参和形参的关联，这样传入参数的顺序就不是需要关心的事情了。

```python
def describe_pet(animal_type, pet_name):
    """显示宠物的信息"""
    print("I have a " + animal_type + ".")
    print("My " + animal_type + "'s name is " + pet_name.title() + ".")

describe_pet(animal_type='hamster', pet_name='harry')
```

**3. 参数默认值**

在定义参数的时候就可以为各个形参指定一个默认值：

```python
def describe_pet(animal_type, pet_name = 'harry'):
    """显示宠物的信息"""
    print("I have a " + animal_type + ".")
    print("My " + animal_type + "'s name is " + pet_name.title() + ".")
```

如果对应的参数没有传递，则形参对应默认值（C++中似乎也有类似的操作）



### 返回值

在函数中使用`return`返回一个值，下面是一个传入名和姓，返回格式化后的名字的函数：

```python
def get_formatted_name(first_name, last_name):
    """返回整洁的姓名"""
    full_name = first_name + ' ' + last_name
    return full_name.title()

musician = get_formatted_name('jimi', 'hendrix')
print(musician)
```

```text 输出结果：
Jimi Hendrix
```

**可选的实参：**

有的人会有中间名，有的人没有，所以在这个姓名格式化函数中，中间名是否传入就应该是一个可选的操作，我们需要无论中间名传入与否，都要使函数能正确地工作。

下面的代码中使用了形参默认值的语法，如果不传入最后一个参数，则让它为空字符串，这样在接下来的字符串中即可通过判断这个参数是否为空字符串，从而确定作出什么操作。

```python
def get_formatted_name(first_name, last_name, middle_name=''):
    """返回整洁的姓名"""
    if middle_name:
        full_name = first_name + ' ' + middle_name + ' ' + last_name
    else:
        full_name = first_name + ' ' + last_name
    return full_name.title()

get_formatted_name('jimi', 'hendrix')
get_formated_name('john', 'hooker', 'lee')
# 上面两行对函数的调用都是可以正常使用的
```

**返回字典/列表**

```python
def build_person(first_name, last_name):
    """返回一个字典，其中包含有关一个人的信息"""
    person = {'first': first_name, 'last': last_name}
    return person

musician = build_person('jimi', 'hendrix')
print(musician)
```

```text 输出结果：
{'first': 'jimi', 'last': 'hendrix'}
```



### 传递列表

列表可以作为函数的参数，且在函数中可以将列表永久修改：

```python
def change_num(numbers):
    numbers.reverse()

numbers = [1, 2, 3, 4, 5]
change_num(numbers)
print(numbers)
```

```text 输出结果：
[5, 4, 3, 2, 1]
```

到这里我观察到的是，传给函数字符串、数字时，传入的是拷贝的副本，在函数中修改值不会对外部的值有影响，但是传递列表、字典对象的时候，传入的是引用，所以在函数内的修改会影响到函数外的列表/字典。

要想使传入的列表不被修改，只需要主动地传入列表的副本即可：

```python
def change_num(numbers):
    numbers.reverse()

numbers = [1, 2, 3, 4, 5]
change_num(numbers[:])	# 这里使用切片法，传入的是原本列表的另一份拷贝
print(numbers)
```

```text 输出结果：
[1, 2, 3, 4, 5]
```



### 传递任意数量的实参

即函数的可变参数列表，可以根据传入的具体元素，在函数内部生成一个**元组**，然后实现对传入参数的操作。

python实现传递任意数量的实参，只需要在函数的参数列表放置一个带`*`前缀的参数。

```python
def make_pizza(*toppings):
    """打印顾客点的所有配料"""
    print(toppings)

make_pizza('pepperoni')
make_pizza('mushrooms', 'green peppers', 'extra cheese')
```

```text 输出结果：
('pepperoni',)
('mushrooms', 'green peppers', 'extra cheese')
```

可以看到打印的序列是使用圆括号包裹的，证明`toppings`确实是一个元组。

我们不仅可以向函数中传递任意数量的单个元素，也可以向其中传入**任意数量的键-值对**，使用两个`**`作为前缀的变量代表能接受任意数量键-值对的字典：

```python
def build_profile(first, last, **user_info):
    """创建一个字典，其中包含我们知道的有关用户的一切"""
    profile = {}
    profile['first_name'] = first
    profile['last_name'] = last
    for key, value in user_info.items():
        profile[key] = value
    return profile

user_profile = build_profile('albert', 'einstein',
                            location='princeton',
                            field='physics')
print(user_profile)
```

```text 输出结果：
{'first_name': 'albert', 'last_name': 'einstein', 'location': 'princeton', 'field': 'physics'}
```



### 将函数存储在模块中

> 函数的优点之一是，使用它们可将代码块与主程序分离。通过给函数指定描述性名称，可让主程序容易理解得多。你还可以更进一步，将函数存储在被称为**模块**的独立文件中，再将模块**导入**到主程序中。`import` 语句允许在当前运行的程序文件中使用模块中的代码。

使用这种方式可以将函数存储在独立的文件中，从而隐藏代码的细节。

下面的例子中，我们想在`test.py`中调用`module.py`中的`say_hello()`函数。导入的方式有以下两种：

**1. 导入整个模块**

```python module.py
def say_hello():
    print("Hello!")
```

```python test.py
import module

module.say_hello()
```

解释器会帮我们完成代码拼接的工作。值得注意的是，调用模块时仍然需要使用`模块名.函数名`的格式，我原本以为和Java中一样，直接使用函数名就可以，可是却发生了错误。这样的规则保证了函数名的唯一性，import多个模块时，不会导致冲突的发生。

但是如果模块的名字太长，，每次调用函数就都要写一大串模块名，不说编写的问题，程序的可读性也会因为太长的模块名而降低。好在我们可以通过`as`关键字，为模块写一个别名，这样可以有效地使代码更加简洁可读：

```python test.py
import module as md

md.say_hello()
```



**2. 导入特定的函数**

使用下面的格式导入模块中单独的函数：

```python
from module_name import function_name
```

这样再调用函数就不用带上模块名了（带上模块名反而会出错）。

还是上面的例子：

```python test.py
from module import say_hello

say_hello()
```

导入特定的函数时，有时候可能会面临函数的名字太长或者是与其他函数名冲突的问题，那么就需要使用`as`关键字为函数指定别名，下面使用的依然是上面的例子，我们给函数`say_hello`一个别名`hello`：

```python test.py
from module import say_hello as hello

hello()
# say_hello() 这时再使用say_hello()反而是不被允许的
```



**3. 导入模块中所有函数**

使用`*`可以做到导入模块中所有的函数：

```python test.py
from module import *

say_hello()
```

既不用写模块名，也不用挨个导入需要的函数。

但是这种方法虽然易用，却需要慎用。当我们导入的是一个不甚了解的大型模块的时候，一次性导入它的所有函数很有可能导致函数名和参数列表都相同，所以发生了函数的覆盖（重载起码不会影响正常的逻辑，但是无意的覆盖可能会导致麻烦）：

```python test.py
from module import *

def say_hello():
    print("test-hello")

say_hello()
```

我们导入的代码中和本文件中都有一个`say_hello()`函数，且参数列表都为空，可能我们期望调用的是 模块中的函数，但是输出结果却事与愿违：

```text 输出结果：
test-hello
```

由此可见，模块中的函数被我们在本文件中编写的函数覆盖了。

由于上述的隐患，还是建议使用前两种导入函数的方法，而不是看起来最省事的这一种。



### 函数编写指南

- 使用小写字母和下划线，函数要尽可能具有描述性

- 每个函数都要写简要描述其功能的的注释，注释应该紧跟在函数定义的后面，并采用文档字符串格式

- 给形参指定默认值的时候，等号两边不要有空格，函数调用时的关键字实参同理

- 代码行长度不要超过79，为了避免函数定义的代码行过长，可在函数定义时换行处理，换行的定义需要缩进

  ```python
  def function_name(
          parameter_0, parameter_1, parameter_2,
          parameter_3, parameter_4, parameter_5):
      function body...
  ```

- 所有的import语句都应放在文件开头，唯一例外的情形是，在文件开头使用了注释来描述整个程序。



## 类

python也是面向对象的语言呢。

### 创建和使用类

直接看示例，创建一个代表狗的`Dog`类：

```python
class Dog():
    """一次模拟小狗的简单尝试"""

    def __init__(self, name, age):
        """初始化属性name和age"""
        self.name = name
        self.age = age

    def sit(self):
        """模拟小狗被命令时蹲下"""
        print(self.name.title() + " is now sitting.")

    def roll_over(self):
        """模拟小狗被命令时打滚"""
        print(self.name.title() + " rolled over!")

my_dog = Dog('willie', 6)
print("My dog's name is " + my_dog.name.title() + ".")
print("My dog is " + str(my_dog.age) + " years old.")
my_dog.sit()
my_dog.roll_over()
```

- 类名是首字母大写（据观察似乎是驼峰命名），并且创建的时候类名后面有一个**空括号**，这表示我们要从空白创建这个类。

- 类中的函数叫做方法，类中的变量叫做属性。

- 构造器（构造方法）固定命名为`__init__()`，创建对象的时候自动调用这个函数，这个函数可以进行数据的初始化操作。不在方法内初始化成员属性也是可以的，初始化顺序是：先在定义处初始化，再在构造器中初始化，下面是一个将上面的代码修改一些后的例子：

  ```python
  class Dog():
      """一次模拟小狗的简单尝试"""
      my_name='before conductor'

      def __init__(self, name, age, my_name):
           """初始化属性name, age, my_name"""
          self.name = name
          self.age = age
          self.my_name = my_name
     ...
  my_dog = Dog('willie', 6, 'after conductor')
  print(my_dog.my_name)
  ```

  ```text 输出结果：
  after conductor
  ```

  但是如果想要不需要形参就初始化一个成员属性，把初始化的语句放在`__init__()`方法中看起来更好。

- 每个方法定义的时候第一个参数都必须是`self`，这个形参是必不可少的，意思基本和Java中的`this`相同，是一个指向实例本身的引用，能够让实例访问类中的属性和方法。

- **在方法中调用本类中的属性，需要加上`self.`作为前缀**（**调用类中的方法也是这样**），否则会被认为是函数中的局部变量，上面的例子中，如果构造器是这样：

  ```python
  def __init__(self, name, age):
      """初始化属性name和age"""
      self.name = name
      self.age = age
      my_name = 'after conductor'
  ```

  这样的话对类中的属性`my_name`是无法造成影响的，因为这个方法中的`my_name`只被认为是函数的局部变量，对外界类中的变量没有影响。

**ps:** 在python 2.7中创建类的时候，需要在类的括号中包含单词`object`：

```python
class Dog(object):
```

修改类中的属性既可以直接修改，也可以使用函数修改。



### 继承

定义类的时候，在括号中写入父类的类名，这个类即可继承父类的所有方法和属性，下面是一个`ElectricCar`继承`Car`类的例子：

```python
class Base():
    def __init__(self):
        self.number = 10
        self.string = 'hello'

    def print_number_and_string(self):
        print(str(self.number) + ' ' + self.string)

class Derived(Base):
    def __init__(self):
        super().__init__()
        self.derived_number = 20
        self.derived_string = 'goodbye'

    def print_self_info(self):
        print(self.string)
        self.print_number_and_string()

derived = Derived()
derived.print_self_info()
```

```text 输出结果：
hello
10 hello
```

刚开始写的时候，我因为直觉出现了一些错误，导致总是运行不起来。

- **self**一定不要忘记！
- 在派生类的构造器中，`super().__init__()`这个函数的调用是必不可少的，否则编译出错。
- 由于调用基类的构造器需要使用`super().` 作为前缀，我就以为使用基类中的其他方法和属性都需要使用`super().`作为前缀，但是经过试验，派生类调用基类中的属性和普通方法，只需要使用`self.`作为前缀就可以了，就像那些属性和方法完全在自己类中一样。

**python支持函数的覆盖，但是不支持函数的重载。**

关于为何python不支持重载，可以看看知乎上大神们的解答：[知乎链接](https://www.zhihu.com/question/20053359)。简单来说，python不支持重载，是因为它的函数可以支持任何类型的参数，且可以使用缺省参数（给出默认值的参数）解决参数数量的问题。

python也可以使用**组合**的方式将一个大型的类拆分成多个小类，比如可以在`ElectricCar`类的构造器中创建一个电池对象，这样的拆分便于管理，这里不再赘述。



### 导入类

导入类的操作其实和前面的导入函数基本是一样的，方式有以下几种：

**1. 导入整个模块**

```python
import module
```

这样可以将整个模块导入，但是声明模块中类的对象的时候，需要加上`模块名.`前缀，和导入函数是完全相同的：

```python
my_car = module.Car('audi', 'a4', 2016)
```

**2. 从一个模块中导入单个/多个类**

```python
# 导入单个类
from module import Car
# 导入多个类，使用逗号分割开类名即可
from odule import Car, Battery
```

**3. 导入一个模块中的所有类**

同样是不建议使用的。

```python
from module import *
```



在一个模块中也可以导入另一个模块，毕竟都是`.py`文件，处于平等地位。



### Python标准库

Python**标准库** 是一组模块，安装的Python都包含它。

下面的例子中，我们导入了`collections`模块中的`OrderedDict`类，是一个可以按照插入顺序输出的字典：

```python
from collections import OrderedDict

favorite_languages = OrderedDict()

favorite_languages['jen'] = 'python'
favorite_languages['sarac'] = 'c'
favorite_languages['edawrd'] = 'ruby'
favorite_languages['phil'] = 'python'

print(favorite_languages.keys().reverse())

for name, language in favorite_languages.items():
    print(name.title() + "'s favorite language is " +
        language.title() + ".")
```

```text 输出结果：
Jen's favorite language is Python.
Sarac's favorite language is C.
Edawrd's favorite language is Ruby.
Phil's favorite language is Python.
```

从输出结果可以观察到，输出字典的顺序就是我们插入键值对的顺序。

下面是使用`random`模块产生随机数的例子：

```python
from random import randint

cnt = 0
number_count = {}
while cnt < 10000:
    x = randint(1, 5)
    if x in number_count.keys():
        number_count[x] += 1
    else:
        number_count[x] = 1
    cnt += 1

for number, count in number_count.items():
    print(str(number) + ": " + str(count))
```

```text 输出结果：
4: 2029
1: 1976
3: 1980
2: 1984
5: 2031
```

使用输出`randint()`函数产生随机的整型数，值得注意的是，这里的区间是一个闭区间，而不是传统的“左闭右开”，` randint(1, 5)`产生的就是1至5之间（包括1和5）的随机整数。上面的代码通过循环10000次，计算这五个数字分别出现的次数（试了一下一亿次，等得我很没有耐心）。

### 编码风格

类名应采用**驼峰命名法** ，即将类名中的每个单词的首字母都大写，而不使用下划线。实例名和模块名都采用小写格式，并在单词之间加上下划线。

在类中，可使用**一个空行来分隔方法**；而在模块中，可使用**两个空行来分隔类**。

需要同时导入标准库中的模块和你编写的模块时，先编写导入标准库模块的`import` 语句，再添加一个空行，然后编写导入你自己编写的模块的`import` 语句。



---



## 文件和异常

### 读取文件内容

**1. 一次性读取**

使用`open()`函数打开文件，使用`read()`函数获取文件中的全部内容：

```python
filename = 'pi_digits.txt'

with open(filename) as file_object:
    contents = file_object.read()
    print(contents.rstrip())
```

使用`as`为打开的文件对象赋予别名，使用这个名字对文件尽心操作。我们可以使用`open()`和`close()`打开和关闭文件，但是使用`with`关键字更加便捷，它可以在我们不需要使用文件的时候自动关闭文件。

`read()`到达文件末尾的时候会返回一个空字符串（其实是因为前一个非空字符串以`\n`结尾），这会导致输出的末尾有一个空行的出现，为了阻止空字符串的出现，我们可以在打印`contents`时调用`rstrip()`方法。

**2. 逐行读取**

使用for循环即可做到逐行读取：

```python
with open(filename) as file_object:
    for line in file_object:
        print(line.rstrip())
```

但是每行末尾都有一个换行符，且`print`函数又会自动换行，所以如果不使用`rstrip()`方法，输出的每行之间会有一个空行。

**3. 创建一个包含文件各行内容的列表**

打开的文件只可以在`with`之后缩进的代码块中使用，但是我们可以通过将文件各行的内容存储在一个列表中，从而在`with`代码块外面也可以使用文件中的内容，使用`readlines()`方法可以生成一个包含文件各行内容的列表：

```python
with open(filename) as file_object:
        lines = file_object.readlines()

for line in lines:
    print(line.rstrip())
```



### 写入文件

一个写入文件的示例：

```python
filename = 'programming.txt'

with open(filename, 'w') as file_object:
    file_object.write("I love programming.")
```

这里就要开始注意`open()`函数两个参数了，第一个参数是文件名，第二个参数则是一个用来表示**打开模式**的字符串，模式有以下几种：

- **'w'**：写入模式
- **'r'**：读取模式
- **'a'**：附加模式
- **'r+'**：既能读取也能写入的模式

如果不输入第二个参数，那么会默认使用**'r'**读取模式，就像我们前面一节做的那样。这种模式使文件是只读的。

上面的代码中我们使用写入模式，这种模式下，如果我们要写入的文件不存在，则会自动创建，然后写入内容。使用`write()`方法写入内容。

**warning:** 需要注意的地方是，如果文件中原本就有内容，我们使用写入模式写入新的内容之前会把原内容删除。

`write()`方法不会在字符串的末尾插入换行符，所以如果我们想写入多行内容，需要自己在一行的末尾加上换行符：

```python
filename = 'programming.txt'

with open(filename, 'w') as file_object:
    file_object.write("I love programming.\n")
    file_object.write("I love creating new games\n.")
```



**附加到文件**

前面我们说，使用写入模式会把文件原本的内容删除。如果我们想要在保留文件的原内容的前提下写入，就需要使用附加模式（'a'），在保留了前一个文本文件的基础上，我们执行：

```python
with open(filename, 'a') as file_object:
    file_object.write("I also love finding meaning in large datasets.\n")
    file_object.write("I love creating apps that can run in a browser.\n")
```

这样文件的内容就成为了这样：

```text programming.txt
I love programming.
I love creating new games.
I also love finding meaning in large datasets.
I love creating apps that can run in a browser.

```

写入的时候在最末尾一行插入换行符的好处是，如果我们需要继续附加，可以保证附件的文本都在原文本的下面。



### 异常

> Python使用被称为**异常** 的特殊对象来管理程序执行期间发生的错误。每当发生让Python不知所措的错误时，它都会创建一个异常对象。如果你编写了处理该异常的代码，程序将继续运行；如果你未对异常进行处理，程序将停止，并显示一个traceback，其中包含有关异常的报告。

python使用`try-except`模式来捕获和处理异常。

**1. 使用try-except代码块**

最简单和典型的异常是运算时除以零的操作，当我们试图除以零的时候：

```python
print(5 / 0)
```

代码将在此处终止，并输出一大串信息：

```text 异常信息：
Traceback (most recent call last):
  File "test.py", line 1, in <module>
    print(5/0)
ZeroDivisionError: division by zero
Error in sys.excepthook:
Traceback (most recent call last):
  File "/usr/lib/python3/dist-packages/apport_python_hook.py", line 63, in apport_excepthook
...
```

在输出的错误信息中我们可以看到，python在我们进行除以零操作的时候创建了一个名为`ZeroDivisionError`的异常对象，并且终止了代码，输出这个异常信息。

我们可以自己使用`try-except`模式捕获这个异常，并打印我们希望得到的错误提示。而且代码还可以继续向下执行：

```python
try:
    print(5 / 0)
except ZeroDivisionError:
    print("You can't divide by zero.")

print("After try-except")
```

```text 输出结果：
You can't divide by zero.
After try-except
```

`try-except`代码组织的末尾中可以添加`else`关键字，用来处理未捕获到指定异常的情况，下面是一个除法计算器的例子：

```python
print("Give me two numbers, and I'll divide them.")
print("Enter 'q' to quit.")

while True:
    first_number = input("\nFirst number: ")
    if first_number == 'q':
        break
    second_number = input("Second number: ")
    try:
        answer = int(first_number) / int(second_number)
    except ZeroDivisionError:
        print("You can't divide by 0!")
    else:
        print(answer)
```

针对是否有除以零的异常，我们采取了不同的措施。

当我们想要读入一个文件的时候，要提防容易出现的`FileNotFoundError`异常：

```python
filename = 'alice.txt'

try:
    with open(filename) as f_obj:
        contents = f_obj.read()
except FileNotFoundError:
    msg = "Sorry, the file " + filename + " does not exist."
    print(msg)
```

有时候我们捕获到异常之后并不想做出什么行为，而是默默忽略掉异常的发生，那么这时候就可以使用`pass`：

```python
try:
    with open(filename) as f_obj:
        contents = f_obj.read()
except FileNotFoundError:
    pass
```

这样件不存在的话，什么都不会执行。

关于异常的补充：

- `try-except`后面不仅可以加`else`，也可以加`finally`，只是书中没有提到。
- 如果试图把文本转成数字，会引发`TypeError`。
- `str.count('substr')`的用法可以统计字符串中出现了某一子串几次。



### 分析文本

主要使用了字符串的`split()`方法，可以将字符串按空格分隔开，并返回一个列表。通过返回列表的长度，我们就可以得到一个字符串内的单词数，配合文件读入的功能，可以实现文件单词数的统计：

```python
def count_words(filename):
    """计算一个文件大致包含多少个单词"""
    try:
        with open(filename) as f_obj:
            contents = f_obj.read()
    except FileNotFoundError:	# 这里直接pass也是一种选择
        msg = "Sorry, the file " + filename + " does not exist."
        print(msg)
    else:
        # 计算文件大致包含多少个单词
        words = contents.split()
        num_words = len(words)
        print("The file " + filename + " has about " + str(num_words) +
            " words.")

filename = 'alice.txt'
count_words(filename)
```

也可以把多个文件名放在一个列表里，使用`count_words()`函数连续统计多个文件的单词数，即使有一个文件不存在，也会因为有异常处理存在而不会影响对其他文件的操作。



### 存储数据

我们可以把python中的数据结构存储在json（JavaScript Object Notation）文件中，并在需要的时候加载进程序。json本是一种为JavaScript语言开发的格式，但是后来被很多语言支持，python便是其中之一。

**1. 存放数据和载入数据**

存放数据使用json模块中的`json.dump()`函数。下面的例子中，我们将一个列表存入`number.json`文件中：

```python
import json

numbers = [2, 3, 5, 7, 11, 13]

filename = 'numbers.json'
with open(filename, 'w') as f_obj:
    json.dump(numbers, f_obj)
```

代码所做的就是创建了`number.json`文件，并将数字列表存放了进去。我们可以打开这个json文件：

```json
[2, 3, 5, 7, 11, 13]
```

其中就是我们存入的那个列表。

使用`json.load()`函数加载出json文件中的数据结构：

```python
import json

filename = 'numbers.json'
with open(filename) as f_obj:
    numbers = json.load(f_obj)

print(numbers)
```

```text 输出结果：
[2, 3, 5, 7, 11, 13]
```

**2. 关于其他函数**

看网上的教程，都是使用`json.dumps()`和`json.loads()`这两个函数居多，书中教到的两个函数重点在文件操作，而这两个带s的函数则是专门把数据结构转化成正确格式的字符串。（我是这样理解的）

**3. 关于重构**

把所有功能都写在一起是很不明智的，重构就是改进代码，将代码划分为一系列具体工作的函数，下面是一个重构好的、能够实现记住用户的程序。用户第一次运行的时候会被要求输入用户名，程序会将用户名存储在json文件中，之后再次运行程序的时候，程序就可以自己读入原本存入的用户名，从而达到记住用户名的效果。分为“存储用户名”、“获得用户名”和“问候用户”三个功能块。

```python
import json

def get_stored_username():
    """如果存储了用户名，就获取它"""
    filename = 'username.json'
    try:
        with open(filename) as f_obj:
            username = json.load(f_obj)
    except FileNotFoundError:
        return None
    else:
        return username

def get_new_username():
    """提示用户输入用户名"""
    username = input("What is your name? ")
    filename = 'username.json'
    with open(filename, 'w') as f_obj:
        json.dump(username, f_obj)
    return username

def greet_user():
    """问候用户，并指出其名字"""
    username = get_stored_username()
    if username:
        print("Welcome back, " + username + "!")
    else:
        username = get_new_username()
        print("We'll remember you when you come back, " + username + "!")

greet_user()
```



## 测试代码

对代码的测试，也就是给出输入和期望得到的输出，观察运行得到的结果是否符合期望。

测试分为一下几种：

- **单元测试** 用于核实函数的某个方面没有问题。
- **测试用例** 是一组单元测试，这些单元测试一起核实函数在各种情形下的行为都符合要求。
- **全覆盖式测试** 用例包含一整套单元测试，涵盖了各种可能的函数使用方式。

### 测试函数

下面是一个对`get_formatted_name()`函数的测试代码，这个函数的作用是接受名和姓，然后返回规范格式的全名。创建测试用例，需要导入`unittest`模块和需要测试的函数，然后创建一个继承`unittest.TestCase`的类，并使用**test**为函数名开头的函数对需要测试的函数进行测试。

```python
import unittest
from module import get_formatted_name

class NamesTestCase(unittest.TestCase):
    """测试name_function.py"""

    def test_first_last_name(self):
        """能够正确地处理像Janis Joplin这样的姓名吗？"""
        formatted_name = get_formatted_name('janis', 'joplin')
        self.assertEqual(formatted_name, 'Janis Joplin')

    def test_first_last_middle_name(self):
        """能够正确地处理像Wolfgang Amadeus Mozart这样的姓名吗？"""
        formatted_name = get_formatted_name(
            'wolfgang', 'mozart', 'amadeus')
        self.assertEqual(formatted_name, 'Wolfgang Amadeus Mozart')


unittest.main()
```

调用`unittest.main()`让python运行这个文件中的测试，所有以test打头的方法都将自动运行。

这里测试函数中最重要的一条是使用**断言**方法，`assertEqual()`方法用来判断`formatted`是否和我们期望的值是一样的。通过断言的结果，我们可以得到测试结果，下面是测试通过后的输出：

```text 测试通过：
..
----------------------------------------------------------------------
Ran 2 tests in 0.000s

OK
```

两个'.'代表了有两个测试通过了，如果通过修改让第二个测试不通过：

```text 1个测试未通过：
F.
======================================================================
FAIL: test_first_last_middle_name (__main__.NamesTestCase)
能够正确地处理像Wolfgang Amadeus Mozart这样的姓名吗？
----------------------------------------------------------------------
Traceback (most recent call last):
  File "test.py", line 16, in test_first_last_middle_name
    self.assertEqual(formatted_name, 'Wolfgang Amadeus Mozart')
AssertionError: 'Wolfgang Mozart' != 'Wolfgang Amadeus Mozart'
- Wolfgang Mozart
+ Wolfgang Amadeus Mozart
?          ++++++++


----------------------------------------------------------------------
Ran 2 tests in 0.000s

FAILED (failures=1)
```

会给出通过测试的个数、错误的所在。

> 运行测试用例时，每完成一个单元测试，Python都打印一个字符：测试通过时打印一个句点；测试引发错误时打印一个`E` ；测试导致断言失败时打印一个`F` 。这就是你运行测试用例时，在输出的第一行中看到的句点和字符数量各不相同的原因。如果测试用例包含很多单元测试，需要运行很长时间，就可通过观察这些结果来获悉有多少个测试通过了。



### 测试类

**1. unittest中常用的断言方法**

|              方法               |              用途              |
| :-----------------------------: | :----------------------------: |
|       `assertEqual(a, b)`       |          核实`a == b`          |
|     `assertNotEqual(a, b)`      |          核实`a != b`          |
|         `assertTrue(x)`         |        核实`x` 为`True`        |
|        `assertFalse(x)`         |       核实`x` 为`False`        |
|  `assertIn(*item* , *list* )`   |  核实 *`item`* 在 *`list`* 中  |
| `assertNotIn(*item* , *list* )` | 核实 *`item`* 不在 *`list`* 中 |

**2. 使用setUp()方法**

说是对类进行测试，本质上还是对方法的测试。只是我们不希望在每个测试函数中都创建一个测试类的对象实例，这样太过繁琐，所幸可以使用`unittest.TestCase`中的`setUp()`方法，这个方法会在所有的test方法之前调用，我们可以在此处创建对象实例，而在所有的test方法中都可以使用这个对象实例。

下面是一个测试类的示例。

需要测试的类（书中给出的代码，类中的属性调用没有使用`self.`作为前缀，我在自己的电脑上无法运行成功，应该是由于python版本差异造成的，下面是我自己更改后的代码）：

```python module.py
class AnonymousSurvey():
    """收集匿名调查问卷的答案"""

    def __init__(self, question):
        """存储一个问题，并为存储答案做准备"""
        self.question = question
        self.responses = []

    def show_question(self):
        """显示调查问卷"""
        print(self.question)

    def store_response(self, new_response):
        """存储单份调查答卷"""
        self.responses.append(new_response)

    def show_results(self):
        """显示收集到的所有答卷"""
        print("Survey results:")
        for response in self.responses:
            print('- ' + response)
```

```python test.py
import unittest
from module import AnonymousSurvey

class TestAnonymousSurvey(unittest.TestCase):
    """针对AnonymousSurvey类的测试"""

    def setUp(self):
        """
        创建一个调查对象和一组答案，供使用的测试方法使用
        """
        question = "What language did you first learn to speak?"
        self.my_survey = AnonymousSurvey(question)
        self.responses = ['English', 'Spanish', 'Mandarin']

    def test_store_single_response(self):
        """测试单个答案会被妥善地存储"""
        self.my_survey.store_response(self.responses[0])
        self.assertIn(self.responses[0], self.my_survey.responses)

    def test_store_three_responses(self):
        """测试三个答案会被妥善地存储"""
        for response in self.responses:
            self.my_survey.store_response(response)
        for response in self.responses:
            self.assertIn(response, self.my_survey.responses)

unittest.main()
```

上面的测试代码中使用的是`assertIn()`断言方法，用来测试列表中是否包含指定内容。

