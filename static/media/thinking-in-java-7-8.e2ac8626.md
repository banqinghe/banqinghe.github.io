# 《Java编程思想》读书笔记 —— 第7章 复用类，第8章 多态

## 第七章  复用类

在Java中可以通过创建新类来实现代码的复用，为了达到这一目的，有两种方式可供选择，它们是**组合**和**继承**。

### 组合语法

组合，即是在新的类中产生现有类的对象，新的类由现有类的对象组成。譬如，在一个类中使用了多个`String`类，这其实也是一种组合的使用。

使用组合时可以考虑多种对象初始化的时机：

1. 在刚声明时初始化
2. 在构造器之前初始化（放置于匿名块中）
3. 在构造器中初始化
4. 惰性初始化（需要用到该对象之前再将其初始化）

组合的方法好像从一开始学习Java就在使用，语法并没有什么很值得当心的地方。



---



### 继承语法

继承，在C++中已经使用过，使用子类继承父类的`public/protected`成员或者方法，从而达到代码复用的目的。

**1. 子类可以覆盖父类的方法，也可以重载父类的方法。**

在覆盖方法时，可以加上一个`@override`注解表示这是一个覆盖操作，如果因为参数列表写错而成为方法的重载，编译器会因为注解的存在而报错。所以`@override`注解的使用提升了编码的安全性以及代码的可读性。

**ps:** C++中如果子类重新定义父类中的方法名称，会屏蔽父类该方法的所有版本，也就是根本不存在父类子类之间的方法重载。Java中则是允许的。



**2. 关于初始化**

子类的构造器会默认在第一行之前调用父类的不带参数的构造器，如果想调用父类的带参构造器，则需要在第一行使用`super(arguments)`的方式调用。



---



### 向上转型

子类的对象可以转变成父类的类型：

```java
Father obj = new Son() 
```

即是一个较为专用的类型向较为通用的类型转换。这种操作是安全的。



---



### 代理

书中描述到**代理**是一种继承和组合的中庸之道。如果子类继承了父类，那么父类中的所有`public`方法都会暴露给子类，这可能会引起一些麻烦，因为对于特定的子类，有时候父类只想向它暴露一部分方法，这时就可以用代理的方式达到这一目的。

具体的实现为，在原本的父类和子类中间加上一个代理类。即代理类中生成原本的父类中的对象，并把需要的方法封装展示给外界，然后，原本的子类只需要继承这个代理类，就可以获得有限的原本父类的方法了：

<img src="https://gitee.com/banqinghe/blog-images/raw/master/《Java编程思想》读书笔记-——-第七章-复用类，第八章-多态/使用代理.png" style="zoom:60%" />

网上关于代理还有静态代理和动态代理的区别，我没有细看，所以这里应该只是最基础简单的说法。



---



### 组合与继承的结合和选择使用

组合技术通常用于想在新类中使用现有类的功能而非它的接口的情形。继承则是使用某一个现有的类，并开发它的一个特有版本。

- **“is-a”**的关系用继承来表达

- **“has-a”**的关系用组合来表达

继承虽然是一个需要强调的技术，但是应该**慎用**，需要的场合才须使用，否则还是用组合为宜。

>到底是用组合还是用继承，一个最清晰的判断方法就是问一问自己是否需要从新类向基类进行向上转型。如果必须向上转型，则继承是必要的；但如果不需要，则应当好好考虑自己是否需要继承。



---



### protected关键字

在前面的章节也提到了，为基类的导出类也提供访问权限，同时也提供了包访问权限。



### final关键字

表示一个量是无法改变的。

- `final`数据：数据无法改变，也就是常量。

- `final`引用：指向了一个对象实例后不能再指向一个新的对象实例了。

  **ps:** 注意要和“不可变对象”区分开，不可变对象是指对象实例的内容不能再改变，类是`final`的,或者所有的方法都是`final`的。

- `final`类：不可被继承（所以`final`类中的方法都隐式地是`final`的）

- `final`方法：在被继承后不可被覆盖 



---



### 有继承情况下的初始化

 刚开始看的时候，书里的这部分代码真的让我迷糊了很久

```java
// P146 
class Insect {
    private int i = 9;
    protected int j;
    Insect() {
        System.out.println("i = " + i + ", j = " + j);
        j = 39;
    }
    private static int x1 = printInit("static Insect.x1 initialized");
    static int printInit(String s) {
        System.out.println(s);
        return 47;
    }
}

public class Beetle extends Insect {
    private int k = printInit("Beetle.k initialized");
    public Beetle() {
        System.out.println("k = " + k);
        System.out.println("j = " + j);
    }
    private static int x2 = printInit("static Beetle.x2 initialized");
    public static void main(String[] args) {
        System.out.println("Beetle constructor");
        Beetle b = new Beetle();
    }
}
```

输出结果：

```
static Insect.x1 initialized
static Beetle.x2 initialized
Beetle constructor
i = 9, j = 0
Beetle.k initialized
k = 47
j = 39
```

迷惑的主要原因其实还是初始化顺序没搞清楚，调试捋一捋之后就开始清晰起来了。

程序运行，首先进入主类，但是这时候编译器发现这个类还有一个基类，所以它会转头先进入基类，初始化基类的`static`部分，然后初始化导出类的`static`部分。在所有的`static`部分都已经全部初始化完毕之后，开始运行main函数中的代码。

在main函数中试图调用构造器生成导出类的对象，但在这之前，会进入基类先初始化非`static`变量，然后进入基类构造器，接着才返回导出类中，初始化非`static`变量，然后进入构造器。

初始化顺序基本可以概括为：

1. 基类`static`
2. 导出类`static`
3. 基类非`static`
4. 基类构造器
5. 导出类非`static`
6. 导出类构造器

至于匿名块，它是和非`static`并列的，同理，`static`块应该也是和`static`变量并列，遵循从上到下的初始化方式。



---

<br>

## 第八章 多态

由于多态和继承的关系十分密切，所以在这里就把第七、八章写在一起了。

多态，从字面上理解就是多种状态，书中描述的是“多态方法调用允许一种类型表现出与其他相似类型之间的区别，只要它们都是通从同一基类导出来的”。



### 再论向上转型

以我的理解，向上转型是多态的基石。正是因为可以向上转型，所以才会有通用类型可以展现出多种状态的情形。

```java
class Instrument {
    public void play(Note n) {
        System.out.println("Instrument.play()");
    }
}

// Wind.java
public class Wind extends Instrument {
    public void play(Note n) {
        System.out.println("Wind.play() " + n);
    }
}

// Percussion.java
public class Percussion extends Instrument {
    public void play(Note n) {
        System.out.println("Percussion.play() " + n);
    }
}

// Music.java
public class Music {
    public static void tune(Instrument i) {
        i.play(Note.MIDDLE_C);
    }
    public static void main(String[] args) {
        Instrument flute = new Wind();
        Instrument drum = new Percussion();
        tune(flute);
        tune(drum);
        
        Wind brass = new Wind();
        tune(brass);
    }
}
```

通过上面的代码可以看到，将`Instrument`的多个子类对象通过向上转型，都可以调用参数是`Instrument`的`tune`函数，并且可以产生不同的效果。这是多态的一个很典型的例子。



---



### 关于绑定

将一个方法调用同一个方法主体关联起来被称作绑定，绑定可以分为前期绑定和后期绑定。

- **前期绑定：**在程序执行之前绑定（如果有的话，由编译器和连接程序实现）

  C语言只有一种方法调用，即前期绑定

- **后期绑定：**也叫**动态绑定**、**运行时绑定**，就是在运行时根据对象的类型进行绑定。当发送消息给某个对象，让该对象去断定该做什么事。

  Java中除了`static`方法和`final`方法 （`private`方法属于`final`方法）之外，其他所有方法都是后期绑定，这是多态实现的前提。

导出类可以通过覆盖基类的方法，来为每种特殊的类型提供单独的行为。



### 容易出错的两个陷阱

**1. “覆盖”私有方法**

若导出类试图“覆盖”基类中的`private`方法，其实就相当于在导出类中创建了一个新的方法。因为基类中的`private`方法对于导出类来说是不可见的，所以实际上并不存在覆盖。

观察代码：

```java
// P156
public class PrivateOverride {
    private void f() { System.out.println("private f()"); }
    public static void main(String[] args) {
        PrivateOverride po = new Derived();
        po.f();
    }
}

class Derived extends PrivateOverride {
    public void f() { System.out.println("public f()"); }
}

输出结果：
private f()
```

通过观察上面的代码可以发现，虽然我们试图使用向上转型的方式，并期望得到`publci f()`的输出结果，但是事与愿违，输出的却是`private f()`。这是因为`private`方法是和它的对象绑定的，和后面的对象实例无关了。因为怕引起混淆，所以不要用这样的写法。



**2. 域与静态方法**

域即是值成员变量，分为静态域（`static`变量）和实例域（非`static`变量）。与和`static`方法都是不具有多态性的。

因为域和`static`方法都是事先和类绑定好的。所以出现的效果和上面那份代码的结果类似，无法获得多态的特性。



---



### 构造器和多态

首先要知道的是，**构造器实际上也是一种`static`方法**，并不具有多态性。

初始化的顺序前面已经介绍了：基类成员初始化->基类构造器->成员初始化->本类构造器

#### 继承与清理

虽然有垃圾处理器的存在，但是有时我们是需要自己完成一些清理工作的，清理的顺序是值得注意的一个点。

**1. 一般情况下的清理**

初始化顺序应该和清理顺序完全相反（或者理解成完全对称）。初始化从继承链的头部开始，清理工作就从继承链的末尾开始，一个自顶向下，一个自下向上。

同时，如果类中申请了其他对象的空间，注意清理顺序也应该相反：

```java
创建：
new p;
new t;

清理
dispose t;
dispose p;
```



**2. 一个成员对象被多个对象共享的情况**

应该引入**引用计数器** 来统计正在使用共享对象的对象的个数。每当一个对象试图清楚共享的这一对象实例时，将其引用计数器的值减一，当引用计数器的值成为0时才真正清楚掉共享的对象实例。



#### 构造器内部的多态方法的行为

首先观察一段令人困惑的代码：

```java
class Glyph {
    void draw() { System.out.println("Glyph.draw()"); }
    Glyph() {
        System.out.println("Glyph() before draw()");
        draw();
        System.out.println("Glyph() after draw()");
    }
}

class RoundGlyph extends Glyph {
    private int radius = 1;
    RoundGlyph(int r) {
        radius = r;
        System.out.println("RoundGlyph.RoundGlyph(), radius = " + radius);
    }
    void draw() {
        System.out.println("RoundGlyph.draw(), radius = " + radius);
    }
}

public class PolyConstructors {
    public static void main(String[] args) {
        new RoundGlyph(5);
    }
}
```

根据前面有关初始化顺序的知识，我原本认为输出结果应该是：

```
Glyph() before draw()
Glyph.draw()
Glyph() after draw()
RoundGlyph.RoundGlyph(), radius = 5
```

但是真正的输出结果是：

```
Glyph() before draw()
RoundGlyph.draw(), radius = 0
Glyph() after draw()
RoundGlyph.RoundGlyph(), radius = 5
```

区别出在第二句，我原本凭直觉认为，既然是基类的构造器，其中调用的方法也应该是基类中的方法。所以应该输出`Glyph.draw()`。

但是事实时，由于`draw()`方法已经在导出类中被覆盖了，且这个构造器是因为导出类需要创建对象实例而调用的，所以这时候基类构造器中的`draw()`调用的是被覆盖后的，也就是导出类中的版本。因为调用这个`draw()`方法时，`radius`还没有经过初始化变为1，所以这时输出的`radius`的值是默认值0。



**编写构造器的一条准则：**

> “用尽可能简单的方法使对象进入正常状态；如果可以的话，避免调用其他方法”。在构造器内唯一能够安全调用的那些方法是基类中的`final`方法（也适用于`private`方法，它们自动属于`final`方法）



---



### 协变返回类型

协变返回类型是在Java SE 5 中引入的。

在导出类中的被覆盖方法可以返回基类方法的返回类型的某种导出类型：

```java
class Grain {
    public String toString() { return "Grain"; }
}

class Wheat extends Grain {
    public String toString() { return "Wheat"; }
}

class Mill {
    Grain process() { return new Grain(); }
}

class WheatMill extends Mill {
    Wheat process() { return new Wheat(); }	// 这里使用函数覆盖，但是返回值却与原函数不同了. amazing
}

public class CovariantReturn {
    public static void main(String[] args) {
        Mill m = new Mill();
        Grain g = m.process();
        System.out.println(g);

        m = new WheatMill();
        g = m.process();
        System.out.println(g);
        
        // Wheat w = m.process(); 这样会报出编译错误：Grain类型无法转化为Wheat类型
        Wheat w = (Wheat) m.process();	// 使用强制类型转换（向下转型）可以避免上一句的编译错误
        System.out.println(w);
    }
}
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
输出结果：
Grain
Wheat
Wheat
```

代码中有两点需要注意：

- 我们可以看到第14行的`process()`方法其实是在覆盖第10行的`process`方法，但是第10行方法的返回值却不是`Mill`，而是`Wheat`了。

  这其实就是所谓的协变类型转换，因为`WheatMill`是`Mill`的导出类，所以这种看起来返回值不同的操作是被允许的。

- 注意看第27行的操作，虽然这里的`m.process()`按理来说返回的确实是`Wheat`类型，但是却无法直接赋给`Wheat`对象`w`, 反而会报错“Grain类型无法转化为Wheat类型”，我自己推测协变类型转换应该**并不是一种“纯粹”的类型转换**，只能选择通过强制转换进行向下转型或者是赋给基类对象。



---



### 关于向下转型

首先我们知道的是，类之间的继承分为纯继承和有扩展的继承两种。扩展即是指子类拥有自己的特有方法，这时，如果向上转型，就会失去子类这些特有的方法。根据我的理解，向下转型的作用就是在需要的时候挽回这些子类特有方法。

具体的使用可以看[这里](https://zhuanlan.zhihu.com/p/34026293)，解答了我现在的问题。



<br><br>

日更千字，自己好像成了一个网络写手😥……