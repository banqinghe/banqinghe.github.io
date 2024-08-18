---
title: "《Java编程思想》读书笔记 —— 第5章 初始化与清理"
date: "2020-01-15 15:53:17"
---

顾名思义，本章很全面地讲述了类中多种初始化的方法，成员变量如何初始化，构造器的使用，以及利用static块和匿名块进行对类的初始化。同时也兼顾了数组的初始化，并且引入了可变参数列表的概念。顺便简单介绍了枚举类型。

对于内存清理方面，本章讲述了Java中垃圾处理器的工作机制，也介绍了不太常用的finalize()方法。

## 构造器的使用

这一节主要介绍的是构造器的作用，即在创建一个对象时，Java会自动调用对象的构造器，以完成程序员所需要的初始化。我没有感觉到它和C++中的构造函数有任何的区别。

值得注意的一点是，当我们没有为一个类创建构造器时，Java会默认为它加上一个没有参数、同时也没有函数内容的构造器，并默认在创建对象时调用这个构造器。但是当我们已经声明了含有参数的构造器，却没有声明没有参数的构造器时，此时如果想要不用参数创建一个对象，则是会编译错误的。

```java
public class Tree {
    public Tree(int a) { }
   	public static void main(String[] args) {
        Tree tree = new Tree();	// 这种情形下是会报错的
    }
}
```



---





## 函数的重载

### 何为重载

重载(overload)，即可以声明多个**函数名和返回值都相同，但是参数列表不相同的函数**，当需要调用其中一个函数时，只需根据传入的参数就可以判断调用的是哪一个函数。重载的用法在构造器中十分常用。（和C++中的函数重载语法上没有区别，不再赘述）



### 涉及基本类型的重载

按照语法，程序会根据参数来寻找正确的函数。当参数是基本类型时，如何选择相应函数，就会是一个值得讨论的问题。

书中使用大量的代码去验证了传入某种参数的情况下程序会如何选择函数。总的来说，程序会优先选择参数格式与传入参数完全匹配的函数，比如如下代码

```java
f(char a) {}
f(int a) {}
f(long a) {}
f(float a) {}
f(double a) {}
```

如果使用语句`f('a')`，程序会理所当然地选择上面代码块中的第一行函数。

但是值得讨论的是，当函数中的参数与传入的参数并不能够做到“完全匹配”的时候，程序会如何选择？答案是会选择一个**更大**的数据类型作为匹配。譬如我们仍然试图使用`f('a')`调用函数，而上面代码块中刚好没有`f(char a) {}` 这一项，那么程序会选择`f(int a) {}`来负责处理我们传入的参数，如果再没有这句，则会选择`f(long a) {}`这句来选择，以此类推。

而且可以观察到，参数类型的大小排序为：**char < int < long <float < double**

没有参数是`char`的函数，程序会选择参数列表是`int`的函数，而不是`short`。



当传入参数是比较大的数据类型，而函数参数列表中是比较小的数据类型时，则需要经过手动的强制类型转化使传入参数**主动适应**函数参数列表，否则只会出现编译错误。



---



## this关键字

`this`关键字的作用是代表本类，我认为在以下两种情况下具有比较好的用途

**1. 需要return本类时**

当一个函数需要返回自身这个class时，无疑只能使用`return this;`这一种最直接方法。

**2. 在构造器中调用构造器**

这是一种节省代码量的措施，也会让程序更加简洁、可读。

下面是一个类的三个构造器，可以看出`this`关键字在其中起到的作用：

```java
public MyPairNumber() {
    this(0, 0); // 这样的方式相当于MyPairNumber(m,n),this起到了代替构造函数的作用,但是并不能写成调用构造函数的形式
    // MypairNumber(m,n),这种写法是错误的
}

public MyPairNumber(int m) {
	this(m, 0);
}

public MyPairNumber(int m, int n) { // 上面两个构造函数中的this都是使用的此函数
    this.m = m;
    this.n= n;
}
```



---



## 垃圾回收处理

垃圾处理器是Java语言的一大特色，当一个对象不需要使用时，Java程序员无需像C++程序员那样专门写一个析构函数去释放原本申请的堆内存，Java中的垃圾回收器会取代C++中的析构函数，在对象不需要使用时释放掉它所占用的内存。

### 垃圾回收器如何工作

根据书上所说，Java虚拟机在分配堆内存时使用的是**连续分配内存**的方式，分配的都是成块的内存，这样做会使得即使分配的是堆内存，却仍**能达到与分配栈内存相当的速度**。根据所学的操作系统知识，这样势必会有很多内存碎片的产生，所以，垃圾回收器每次回收内存时，都会进行一次内存的“紧缩”操作，确保有足够大的连续内存片。

Java虚拟机使用一种自适应的垃圾回收技术，当新垃圾较少时，使用*标记—清扫* 技术，当新垃圾较多时，使用*停止—复制* 技术。

通常情况下，当程序濒临存储空间要用完时，它才会使用垃圾回收器进行内存的回收，这是一种减少开销的策略。

### 关于finalize()方法

一旦垃圾回收器准备好释放对象占用的内存空间时，将首先调用`finalize()`方法，这个方法与C++中的析构函数有着本质上的区别，它的作用主要是垃圾回收之前做一些必要的处理，而非释放曾经申请的空间（因为这项工作是垃圾回收器的）。

用到`finalize()`方法的场合：

**1. 释放并非是用new获得的内存块**

>假定你的对象（并非使用new）获得了一块“特殊”的内存区域，由于垃圾回收器只知道释放那些经由new分配的内存，所以它不知道该如何释放该对象的这块“特殊”内存。为了应对这种情况，Java允许在类中定义一个名为**finalize()**的方法。

假如Java调用外部的C语言，使用`malloc`函数申请了内存空间，那么垃圾回收器并不知道如何清楚这些空间，这时就需要在`finalize()`方法中使用`free`来释放对应的空间。



虽然我似乎已经明确了`finalize()`方法的作用，但是实际上种种渠道都告诉我这不是一个好用的方法，它是否被调用似乎也是无法被确定的，IDEA会主动提醒这个方法是不被推荐使用的。书中描述道：

> 通常，不能指望**finalize()**，必须创建其他的“清理”方法，并且明确地调用它们

基本可以确定的是，`finalize()`作为一种清楚垃圾回收器无法清楚的内存的方法来说，是晦涩难懂、一般都不推荐使用的。



**2. 用来判断对象终结条件**

既然`finalize()`方法是对象内存释放前调用的，那么可以用这个方法查看对象内存释放之前对象的状态如何。这应该是一种调试的手段。书中给出了示例代码：

```java
class Book {
    boolean checkedOut = false;
    Book(boolean checkOut) {
        checkedOut = checkOut;
    }
    void checkIn() {
        checkedOut = false;
    }
    protected void finalize() {
        if(checkedOut)
            System.out.println("Error: checked out");
        // Normally, you'll also do this
        // super.finalize(); // Call the base-class version
    }
}

public class TerminationCondition {
    public static void main(String[] args) {
        Book noval = new Book(true);
        // Proper cleanup:
        noval.checkIn();
        // Drop the reference, forget to clean up:
        new Book(true);
        // Force garbage collection & finalization:
        System.gc();
    }
}

输出结果：
Error: checked out
```

这里`System.gc()`的作用是强制进行终结动作。`finalize()`方法可以用来判断对象终结前是否已经经过`checkIn`操作了。



---



## 成员/构造器初始化

### 成员初始化

- 在函数中使用的局部变量需要手动初始化，否则会出现编译错误
- 类中的成员变量是不强制手动初始化的
  - 在获得一片对象的内存空间后，JVM会将其清零，也就是说，成员变量默认的值都是0
  - 也可以在生命成员变量时直接赋值，将其初始化，初始化的顺序就是代码从上到下的顺序，不可“向前引用”



### 构造器初始化

**1. 初始化顺序**

在成员变量全部声明、初始化完毕之后，才会调用构造器，完成初始化的最后一步。



**2. 静态数据的初始化**

static变量初始化先于普通变量的初始化，且无论声明几次对象，static变量都只会初始化一次

**ps:**  构造器实际上也是一种static方法



**3. 显式的静态初始化**

这里指的是static块的初始化，即下面代码块中的结构：

```java
static { }
```

> 这段代码仅执行一次，当首次生成这个类的一个对象时，**或者首次访问属于那个类的静态数据成员时**（即便从未生成过那个类的对象）

97页的代码是一个标准示例（~~太 长 了 懒 得 打 了~~）。



**4. 非静态示例初始化**

也就是原本网课上说的匿名块，是在类中用`{}`包裹着，和函数并列的一种结构。会在构造方法前面执行，和static块不同，每次声明新的对象的时候都会执行一遍匿名块的内容。

这么一看似乎看不出来匿名块的具体作用，既然每次都执行，为什么不直接放在构造器中呢？匿名块的用武之地恰恰是每次都执行。一个类可以有多个构造器，每个执行不同的动作，但是这些动作可能是有所重叠的，那么把每个构造器都需要执行的语句提取出来放在匿名块里，就达到了精简构造器，使得代码更加简洁的效果。



---



## 数组初始化

### 使用花括号的初始化方式

数组可以逐项赋值，也可以使用下面的方法直接在声明的时候初始化：

```java
int[] a = {1, 2, 3, 4, 5}
// int[] a = {1, 2, 3, 4, 5, } // 最后的逗号可要可不要
```

 这种方法等价于先用new分配了空间，再逐项赋值。



### 可变参数列表的使用

有时候我们会传给一个函数一个数组：

```java
static void printArrray(Object[] args) {
    for(Object obj : args) {
        System.out.println(obj);
    }
}

public static void main(String[] args) {
    printArray(new Object[]{new Integer(47), new Float(3.14), new Double(11.11)});
}
```

可以使用可变参数的语法实现和上面完全相同的功能，而且让代码看起来更加简洁了：

```java
static void printArrray(Object... args) {
    for(Object obj : args) {	// 可以看出，虽然外部传参时没有声明Object数组，但是传进函数内之后，函数仍然将通过可变参数传进来的参数当做一个数组处理
        System.out.println(obj);
    }
}

public static void main(String[] args) {
    printArray(new Integer(47), new Float(3.14), new Double(11.11));	// 这里不用再声明一个Object数组了，可以直接写入数据
}
```



在使用可变参数列表的时候，一定要注意不要让传入的参数和重载的几个函数参数列表都匹配：

```java
public class OverloadingVarargs {
    static void f(float i, Character... args) {
        System.out.println("first");
    }
    static void f(char c, Character... args) {
        System.out.println("second");
    }
//    static void f(char... args) {
//        System.out.println("second");
//    }
//    static void f(Character... args) {
//        System.out.println("second");
//    }

    public static void main(String[] args) {
        f(1, 'a');
        f('a', 'b');	// 对于这个语句，上面注释掉的语句都无法和第一个构造器同时存在，会显示和二者都匹配的错误
    }
}
```

其实上面的问题确实让我很困扰，在网上也没有找到一个让我感到很清晰明了的答案，为什么`f(char... args)`不是和`f('a', 'b')`完美匹配的，反而会和`f(float i, Character... args)`冲突，实在是让人摸不着头脑。

书中给出的建议是：你应该只在重载方法的一个版本上使用可变参数列表，或者压根就不使用它。（好自暴自弃的办法……）



---



## 枚举类型

枚举类型在开发中是一个常用的类型，可以 使用这一类型来表示多种状态，兼顾可读性和实用性。

Java中的枚举类型更像是一个类，`public`的枚举类型也需要放在一个单独的`.java`文件中，声明方式如下：

```java
public enum Spiciness {
    NOT, MILD, MEDIUM, HOT, FLAMING
}
```

枚举类型有自己的`toString()`方法，使用静态方法`values()`方法可以返回一个包含所有枚举项的数组，对于单个的枚举对象，可以使用`ordinal()`方法查看这个枚举对象是第几个声明的。

```java
enum Spiciness {
    NOT, MILD, MEDIUM, HOT, FLAMING
}

public class EnumOrder {
    public static void main(String[] args) {
        Spiciness howHot = Spiciness.HOT;
        System.out.println(howHot);
        System.out.println(howHot.ordinal());	// HOT是第四个声明的，序号为3
        System.out.println(Spiciness.values());
    }
}

输出结果：
HOT
3
[LSpiciness;@c818063
```

