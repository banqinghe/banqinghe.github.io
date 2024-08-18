---
title: "《Java编程思想》读书笔记 —— 第9章 接口"
date: "2020-01-18 22:09:13"
---

其实原本计划的时候是打算把这一章和第十章的内部类一起写的，因为接口和抽象类这些语法我自己认为都还是语法中蛮基础的部分，做完记录应该也不需要很大的篇幅才对，但是我读了一遍这一章之后发现我错了……我现在是能感觉出来，*Think in Java*之所以是本这么厚的书，是因为里面真的不仅仅是Java的语法知识，冷不丁就冒出来一个设计模式的名词，让人有点摸不着头脑，所以读的进度是又要比计划慢一点了。希望这个寒假能看个差不多吧。



通过这章我们可以认识到接口在实际的编码工作中起到的作用，为了规范化、为了解耦，嵌套使用的方法也确实很灵活（虽然还没有遇到能够使用到的场合）。

但同时，使用是否使用接口也是需要考量的事情，作者提醒我们使用什么语言特性应该视情况而定。

> 恰当的原则应该是优先选择类而不是接口。从类开始，如果接口的必需性变得非常明确，那么就进行重构。接口是一种重要的工具，但是它们容易被滥用。

<!--more-->

---



## 抽象方法、抽象类、接口

这三种概念通过学习在小学期的教程，我自认为在我心里已经算是比较明确的了。

- 抽象方法：仅有声明而没有方法体，用`abstract`关键字标识

  ```java
  abstract void f();
  ```

- 抽象类：包含抽象方法的类叫做抽象类，也是使用`abstract`关键字标识。抽象类无法被实例化，但是可以被继承，当一个类实现了抽象类中所有的抽象方法，这个类就可以作为普通类，并可以被实例化

抽象方法和抽象类的使用可以使类的抽象性明确起来。

- 接口：其中的方法全都只有声明，没有方法体。使用`interface`关键字标识

  ```java
  interface Instrument {
      int VALUE = 5;
      void play(Note n);
      void adjust();
  }
  ```

接口中的方法默认都是`public`的，再加上`public`关键字没有意义，加上其他权限关键字则不被允许。

接口中的变量都默认是常量，即`static`且`final`，所以其中的变量使用全大写。

接口可以被接口用`extend`继承，可以被类使用`implements`实现。

接口被用来建立类与类之间的**协议**，它表示“**所有实现了该特定接口的类看起来都像这样**”



---



## 完全解耦

这一节讲述了两种设计模式，分别是**策略**模式和**适配器**模式。重点放在了如何使用接口在这两种模式中实现解耦操作。

在这里书上引用了很多行代码作为例子方便理解（P174-P178）,但是我觉得作为总结笔记不应该照搬所有的代码（其实还是懒），所以这一节基本就是白话解释，自己可能理解地也不太好，害。

### 策略模式

创建能够根据所传递的参数对象不同而具有不同行为的方法。经过我的观察这个好像就是向上转型的应用嘛……函数的形参是一个范围比较大的引用，而实际传参的时候穿进去的是一个具体的、“窄化”的对象，由于后期绑定的缘故，就实现了传进去的对象不同而行为不同的目的。



书中给出的例子中，主要是`Apply`类中具有一个`process`函数，策略模式的使用发生在这个函数中：

```java
class Processor {
    public String name() {
        return getClass().getSimpleName();
    }
    Object process(Object input) { return input; }
}

public class Apply {
    public static void process(Process p, Object s) {
        System.out.println("Using Processor " + p.name());
        System.out.println(p.process(s));
    }
	...
}
```

问题是现在有了一个滤波器类：

```java
public class Filter {
    public String name() {
        return getClass().getSimpleName();
    }
    public Waveform process(Waveform input) { return input }
}
```

通过观察可以看到`Filter`类和`Processor`类中的方法其实是基本一样的，我们想让`Filter`也能使用`Apply.process()`方法，从而达到代码复用的目的，但是目前来看这是无法实现的。因为`Filter`在编译器看来是跟`Processor`一点关系都没有的，`process`方法的返回值也有所不同。为了让`Filter`也用于`Apply.process()`方法，书中给出了解决之道。

首先，将`Processor`变成一个接口，这会使`Process`和`Apply.process()` 之间的耦合松动一些。然后让希望使用`Apply.process()`方法的类去实现这个接口，就可以达到目的。书中为了达到更大程度的代码复用，使用了一个中间类实现`Processor`接口，再让那些想用`Apply.process()`方法的类去继承这个中间类。（具体见177页代码）



但是这种方法听起来美好，却忽略了重要的一点。有时候我们并不能随心所欲地让希望使用`Apply.process()`方法的类作出改变，再重新加上代码让它去实现`Processor`接口。对于眼前的这个`Filter`类，我们假定是不能修改类的内部代码的，但是我们仍然希望它能使用`Apply.process()`，那就需要适配器的使用了。



---



### 适配器模式

适配器在生活中很常见，我能想到最普通的例子应该就是数据线转接头了，可以让一种接口转换成另一种接口，帮助我们很方便地解决了接口不统一的问题。适配器模式其实和数据转接头基本是一样的东西，我们需要引入一个适配器类，从而解决上面让`Filter`使用`Apply.process()`方法的问题。

**适配器例子1：**

```java
// 适配器类
class FilterAdapter implements Processor {
    Filter filter;
    public FilterAdapter(Filter filter) {
        this.filter = filter;
    }
    public String name() { return filter.name; }
    public Waveform process(Object input) {
        return filter.process((Waveform)input);
    }
}

public class FilterProcessor {
    public static void main(String[] args) {
        Waveform w = new Waveform();
        // 这里的LowPass、HighPass、BandPass都是Filter的子类，但是他们都通过FilterAdapter类可以传进Apply.process()中
        Apply.process(new FilterAdapter(new LowPass(1.0)), w);
        Apply.process(new FilterAdapter(new HighPass(2.0)), w);
        Apply.process(new FilterAdapter(new BandPass(3.0, 4.0)), w);
}
```

我们可以看到，虽然`Filter`不能再被修改，不能让它去实现`Processor`接口，但是我们可以利用适配器类实现`Processor`接口，并把`Filter`对象封装进适配器类里，这样就达到了让`Filter`也使用`Apply.process()`的目的。



---



**适配器例子2：**

在第183页出现了适配器的用法，只是实现的方式和上面的代码略有不同。

首先我们拥有一个名为`RandomDoubles`的类，作用是可以产生随机的浮点数：

```java
// P183
import java.util.*;

public class RandomDoubles {
    private static Random rand = new Random();
    public double next() { return rand.nextDouble(); }
    public static void main(String[] args) {
        RandomDoubles rd = new RandomDoubles();
        for(int i=0; i<7; i++)
            System.out.print(rd.next() + " ");
    }
}
```



我们现在想要让这个类可以使用Java中的`Scanner`类，而实现了`Readable`接口中`read`方法的类才可以使用`Scanner`，现在`RandomDoubles`类已经无法修改，所以我们可以创建一个适配器类实现我们的目标。

```java
import java.nio.*;
import java.util.*;

public class AdaptedRandomDoubles extends RandomDoubles implements Readable {
    private int count;
    public AdaptedRandomDoubles(int count) { this.count = count; }
    public int read(CharBuffer cb) {	// 实现了Readable接口中的 int read(CharBuffer cb); 方法
        if(count-- == 0)
            return -1;
        String result = Double.toString(next()) + " ";
        cb.append(result);
        return result.length();
    }
    public static void main(String[] args) {
        Scanner s = new Scanner(new AdaptedRandomDoubles(7));	// 因为适配器实现了Readable接口，所以就可以用于构造Scanner类了
        while(s.hasNextDouble())
            System.out.print(s.nextDouble());
    }
}
```



这两个例子刚好说明了**复用代码可以有组合和继承两种方式**。

虽然也看懂了这些代码，但是我觉得我对于适配器模式的理解还是处在很肤浅的阶段，毕竟还没开始认真专项地学习设计模式。



---



## 多重继承和嵌套接口

### 多重继承语法

- 一个类能继承一个类
- 一个类能实现多个接口（类可以向上转型为它实现的任意一个接口）
- 一个接口能继承多个接口

多重继承的使用给代码的编写带来了极大灵活性，比如可以通过继承一个类从而实现一个接口，这在Java中是顺理成章的。

- **使用接口的核心原因：**能够向上转型为多个基类型（以及由此带来的灵活性）
- **使用接口的另一个原因：**（和使用抽象类的原因相仿）防止客户端程序员创建该类的对象，确保这仅仅是一个接口。

> 如果知道某事物应该成为一个基类，那么第一选择应该是让它成为一个接口。



---



### 通过继承扩展接口

类中可以通过继承来扩展接口，但是需要注意的是，不能让两个参数列表相同、函数名相同，但是返回值不同的函数一起出现，这样就会引起错误。如下：

```java
interface I1 { void f(); }
interface I3 { int f(); }

// interface I4 extends I1, I3 { } 	// 出现了函数的冲撞
```



---



### 嵌套接口

接口中也可以有接口，这和后面一章所讲的内部类是很相似的东西。

- 接口中的一切都默认是`public`的，接口中的接口当然也会是`public`的。
- 类中的接口可以是`private`的，实现这种接口是一种方式，可以强制接口中的方法定义不要添加任何类型信息（也就是说，不允许向上转型）
- 当实现某个接口时，并不需要实现嵌套在其内部的任何接口。
- `private`不能在定义它的类之外被实现。

书中185页的代码说明了以上提到的所有语法：

```java
class A {
    interface B {
        void f();
    }
    public class BImp implements B {
        public void f() {}
    }
    private class BImp2 implements B {
        public void f() {}
    }

    public interface C {
        void f();
    }
    class CImp implements C {
        public void f() {}
    }
    private class CImp2 implements C {
        public void f() {}
    }

    private interface D {	// 这是一个private的接口
        void f();
    }
    private class DImp implements D {
        public void f() {}
    }
    public class DImp2 implements D {
        public void f() {}
    }
    public D getD() { return new DImp2(); }
    private D dRef;
    public void receiveD(D d) {
        dRef = d;
}
```

```java
interface E {
    interface G {
        void f();
    }

    // 这里的public其实是多余的，因为默认就是public
    public interface H {
        void f();
    }
    void g();

    // interface中不能有private的东西
    // private interface I {}
}
```

```java
public class NestingInterfaces {
    // 因为A.B和A.C都是public的接口，所以在这个类中也可以将它们实现
    public class BImp implements A.B {
        public void f() {}
    }
    class CImp implements A.C {
        public void f() {}
    }

//    因为D是class A中的private接口，所以只有在A类中才可以implements D接口
//    class DImp implements A.D {
//        public void f() {}
//    }

    class EImp implements E {	// 实现E接口并不需要实现其中嵌套的类
        public void g() {}
    }
//    E是一个接口，所以其中的接口G是public的，就可以在这个类中implements
    class EGImp implements E.G {
        public void f() {}
    }
    class EGImp2 implements E {
        public void g() {}
        class EG implements E.G {
            public void f() {}
        }
    }

    public static void main(String[] args) {
        A a = new A();
//        A.D ad = a.getD();    // A中的接口D是private，所以A.d ad是无法声明的（ps: a.getD()可以正常调用）

// 下面两部分代码都表明了私有类对向上转型的限制
//        A.DImp2 di2 = a.getD();   // a.get()的返回值是class D，想要传给A.DImp2类型的di2需要手动向下转型，如下
        A.DImp2 di2 = (A.DImp2) a.getD();

//        a.getD().f(); // D是一个private的接口，所以不能直接这样调用，而是需要经过一次向下转型
        ((A.DImp2) a.getD()).f();

        A a2 = new A();
        a2.receiveD(a.getD());
    }
}
```



## 接口与工厂

这一节主要讲述了接口实现工厂模式的操作。对于一个作为基本类型的接口，需要有一个与之对应的工厂接口，对于每个`implements`了基本接口的类，也应该分别有一个负责生成这些类的工厂类。

可以看如下的代码了解工厂模式的实现：

```java
interface Game {
    boolean move();
}

interface GameFactory {
    Game getGame();
}

class Checkers implements Game {
    private int moves = 0;
    private static final int MOVES = 3;
    public boolean move() {
        System.out.println("Checker move " + moves);
        return ++moves != MOVES;
    }
}

class CheckerFactory implements GameFactory {
    public Game getGame() { return new Checkers(); }
}

class Chess implements Game {
    private int moves = 0;
    private static final int MOVES = 4;
    public boolean move() {
        System.out.println("Chess move " + moves);
        return ++moves != MOVES;
    }
}

class ChessFactory implements GameFactory {
    public Game getGame() { return new Chess(); }
}

public class Games {
    public static void playGame(GameFactory factory) {
        Game s = factory.getGame();
        while(s.move());
    }
    public static void playGame(Game game) {
        while(game.move());
    }
    public static void main(String[] args) {
//        playGame(new CheckerFactory());
//        playGame(new ChessFactory());
        playGame(new Checkers());
        playGame(new Chess());
    }
}
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
输出结果：
Checker move 0
Checker move 1
Checker move 2
Chess move 0
Chess move 1
Chess move 2
Chess move 3
```

从`main`函数中可以看到，即使不使用工厂类，也可以正常地创建对象并使用，那为什么还需要多此一举，新创一个工厂类去专门负责对象的创建呢？这是我们需要探究的问题了，基本可以在这里给出的两篇博客里有所了解：[第一篇博客](https://blog.csdn.net/DreamWeaver_zhou/article/details/78858195)、[第二篇博客](https://blog.csdn.net/lovelion/article/details/7523392)。

总的来说，创建对象的任务被全权交给了工厂类之后，这样的话，“对象本身的属性”、“对象的创建、“对象的使用”这三部分就完全被区分开了，实现了低耦合的目的。

**适用于工厂模式的情况：**

- 当创建、实例化对象的工作很复杂，需要初始化很多参数、查询数据库等操作时。
- 类本身有好多子类，这些类的创建过程在业务中容易发生改变，或者对类的调用容易发生改变。

