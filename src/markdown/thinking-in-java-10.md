# 《Java编程思想》读书笔记 —— 第10章 内部类

内部类的定义可以从字面上理解，即一个定义在一个类内部的类，基本上就是“套娃”的意思，和前面一章所提到的嵌套接口其实是差不多的东西，但是语法上要比嵌套接口复杂很多。内部类的特点是允许程序员把逻辑相关的类组织在一起，前一章的简介部分也提到，内部类和接口都是使接口和实现方法分离的结构化方法。

就我的个人体验看来，内部类的语法相较于前面的内容确实是比较复杂的，语法点有点多，上个暑假读过一遍之后现在脑袋中的印象几乎一点不剩，再读起来还是有点吃力。

本章的主要内容有内部类的的基本种类：在外围类中的普通内部类、在方法和作用域中的内部类、匿名内部类、嵌套类，还有关于内部类与外部类互相的访问，以及关于继承的语法，很重要的一部分是说明了内部类的作用究竟是什么。

## 普通的内部类

### 定义和内部外部类的访问交互

也就是定义和外围类的普通方法并列的内部类。如果从外部类的非静态方法之外的任意位置创建某个内部类的对象，那么必须使用`OuterClassName.InnerClassName`的形式。.

内部类拥有外围类所有元素的访问权，这是因为当某个外围类的对象创建了一个内部类对象时，这个**内部对象会秘密捕获一个指向那个外围类对象的引用**。

---

### 使用.this和.new

如果需要在内部类中生成一个外部类对象的引用，可以使用外部类名字后面加上`.this`，如果只使用`this`，那么就和普通类一样指向对本类的引用。

若是想在外部类中创建内部类的对象，必须借助已有的外部类对象使用`.new`关键字来创建，而不能直接引用类名创建。需要使用如下的形式：

```java
Outer obj = new Outer();
Outer.Inner innerObj = obj.new Inner();
// Outer.Inner innerObj = new Outer.Inner();	// 错误的创建方式
```

之所以不能按上面的方式创建，是因为在拥有外部类对象之前不可能拥有内部类对象，因为内部类对象创建需要捕获一个指向外围类对象的引用。

**ps:** 上面的方法也有例外，嵌入类（static）对象的创建不需要对外部类对象的引用。



---



## 内部类与向上转型

在类中的每个内部类都可以自己去实现一个接口，而这个实现是能够对外界完全不可见的，这样就可以很方便地隐藏实现细节。这是内部类的一个很大的优势。

内部类可以是`private`的，也可以是`protected`的，正如这些关键词所表示的，`private`的内部类只有它自己的外部类中才能创建并直接使用其对象。而`protected`则表示外部类及其子类，以及同包拥有对该内部类的访问权限。

书上（194页）给出的代码很好地说明了这一特性：

 ```java Destination.java
public interface Destination {
    String readLabel();
}
 ```

```java Contents.java
public interface Contents {
    int value();
}
```

```java TestParcel.java
class Parcel4 {
    private class PContents implements Contents {
        private int i = 11;
        public int value() { return i; }
    }
    protected class PDestination implements Destination {
        private String label;
        private PDestination(String whereTo) {
            label = whereTo;
        }
        public String readLabel() { return label; }
    }

    public Destination destination(String s) {
        return new PDestination(s);
    }
    public Contents contents() {
        return new PContents();
    }
}

public class TestParcel {
    public static void main(String[] args) {
        Parcel4 p = new Parcel4();
        Contents c = p.contents();
        Destination d = p.destination("Tasmania");
//        Parcel4.PDestination pd = p.new PDestination();	// PDestination的构造函数是private的
//        Parcel4.PContents pc = p.new PContents();	// PContents是private的内部类，连对象引用都无法声明
    }
}
```

对于给出的两个接口，`Parcel4`没有自身解决，而是使用两个内部类分别给出了实现，并且对内部类的权限分别作出了限制，实现细节得到了很好的隐藏。

> `private`内部类给类的设计者提供了一种途径，通过这种方式可以完全阻止任何依赖于类型的编码，并且完全隐藏了实现细节。



---



## 方法和作用域于中的内部类

内部类的使用极为灵活，不仅可以和普通类的方法并列存在，还可以放在方法中、甚至更小的作用域中。

其实将内部类放在方法和更小的作用域中本质上是相同的，放在方法中的一个完整的类被称为**局部内部类**：

```java Parcel5.java
public class Parcel5 {
    public Destination destination(String s) {
        class PDestination implements Destination {
            private String label;
            private PDestination(String whereTo) {
                label = whereTo;
            }
            public String readLabel() { return label; }
        }
        return new PDestination(s);
    }
//    public Destination f(String s) {
//        return new PDestination(s);	// 在类所在的作用域之外就无法再声明对象
//    }
    public static void main(String[] args) {
        Parcel5 p = new Parcel5();
        Destination d = p.destination("Tasmania");
    }
}
```

在上面的方法中，将局部内部类放置在`destination`方法中，并将向上转型后的内部类对象作为函数返回值。这样同样使用内部类实现了`Destination`接口。



将内部类放在其他作用域之中其实是和上面相同的情况，也是只有在类所在的作用域才能直接声明和使用类的对象。



---



## 匿名内部类

相比于上面放置位置不同的各种内部类，匿名内部类就显得特别地多。

### 典型的匿名内部类

```java  Parcel7.java
public class Parcel7 {
    public Contents contents() {
        return new Contents() {	// 返回一个匿名内部类对象
            private int i = 11;
            public int value() { return i; }
        };
    }
    public static void main(String[] args) {
        Parcel7 p = new Parcel7();
        Contents c = p.contents();
    }
}
```

这里`Parcel7`中的函数返回了一个类的对象，这个类很显然实现了`Contents`接口，于是可以在`main`函数中将其向上转型成为一个`Contents`类型的对象。

关于上面的匿名内部类，需要注意到的有以下几点：

- 匿名内部类会**继承/实现**一个指明的**类/接口**，并直接完成向上转型的工作，在上面的代码中，匿名内部类就实现了`Contents`接口，并在实例化的时候就转型为`Contents`对象。
- 匿名内部类实际上**是一种简写的形式**，使用匿名内部类和定义一个普通内部类再在函数中返回这个内部类的对象达到的效果是完全相同的。



---



### 匿名内部类的基类构造器

下面的代码是我们需要使用匿名内部类的基类的带参构造器的情况。

```java Parcel8.java
class Wrapping {
    private int i;
    public Wrapping(int x) { i = x; }
    public int value() { return i; }
}

public class Parcel8 {
    public Wrapping wrapping(int x) {
        return new Wrapping(x) {	// 这样就使用了Wrapping的带参构造器，将参数x传入
            public int value() {
                return super.value() * 47;
            }
        };
    }
    public static void main(String[] args) {
        Parcel8 p = new Parcel8();
        Wrapping w = p.wrapping(10);
    }    
}
```

其实就是简单地把参数简单地放在括号里……



**ps: **当匿名内部类中需要使用一个在它外部定义的对象时，这个对象的参数引用需要是`final`的，但从Java 8开始，`final`关键字可以省略不些，编译器会默认添加。

---



### 匿名内部类的缺陷

- 匿名内部类没有构造器，若想实现构造器的效果，可以把初始化内容写在一个匿名块中（实例初始化），但是这样做也只能有一种初始化的方式，不能重载初始化方法。

- 匿名内部类只能继承一个类，或者是只实现一个接口，和正规类的继承相比是受限的。



---



### 利用匿名内部类实现工厂模式

在第九章介绍工厂模式的时候，每个类都需要一个与之相对应的工厂类，通过工厂类来完成对象的创建工作。但是如果我们使用匿名内部类来实现工厂模式，可以将工厂对象作为类的一个`static`变量，将一个实现了工厂接口的对象赋值给它，这样既实现了对象属性和对象创建的分离，也使得代码更加简洁了。

还是以前一章棋类游戏的例子来说明（201页）：

```java Games.java
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

    public static GameFactory factory = new GameFactory() {
        @Override
        public Game getGame() { return new Checkers(); }
    };
}

class Chess implements Game {
    private int moves = 0;
    private static final int MOVES = 4;
    public boolean move() {
        System.out.println("Chess move " + moves);
        return ++moves != MOVES;
    }

    public static GameFactory factory = new GameFactory() {	
        @Override
        public Game getGame() { return new Chess(); }
    };
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
        playGame(Checkers.factory);
        playGame(Chess.factory);
    }
}
```

通过观察其实可以看出来，对比前一章的代码，这里只是使用匿名内部类代替了原本另写的工厂类，在写法上更加干脆简洁了。



---



## 嵌套类

使用`static`关键字修饰的内部类被称为嵌套类，嵌套类和其外围类对象是没有联系的，也就是说嵌套类是无法使用`.this`来指向外部类的。前面我们提到，需要使用外部类的对象才能创建内部类的对象，而对于嵌套类来说，**创建对象是不需要凭借外部类对象的**。同时，也和嵌套方法很类似，**嵌套类对象无法访问非静态的外部类对象。**

普通内部类的字段与方法，只能放在类的外部层次上，所以**普通内部类不能有`static`数据和`static`字段**，也不能包含嵌套类。

如果在外部创建一个`static`对象，只需要：

```java
Parcel4.PContents pc = new Parcel4.PContents();
```

而不是像之前的不普通内部类：

```java
Parcel4 p = new Parcel4();
Contents c = p.contents();
```

---

### 接口中的嵌套类

虽然正常情况下接口中不能放任何代码，但是却可以放置嵌套类，因为类是`static`的，所以只是将嵌套类放置于接口的命名空间内，**甚至可以在这个内部类中实现它的外围接口**。

> 如果你想创建某些公共代码，使得它们可以**被某个接口的所有不同实现所共有**，那么使用接口内部的嵌套类会显得很方便。

---

### 从多层嵌套类中访问外部类的成员

一个内部类被嵌套多少层并不重要——它能透明地访问所有它所嵌入的外围类的所有成员：

```java MultiNestingAccess.java
class MNA {
    private void f() {}
    class A {
        private void g() {}
        public class B {
            void h() {
                g();	// B可以无障碍地访问MNA和A中的函数
                f();
            }
        }
    }
}

public class MultiNestingAccess {
    public static void main(String[] args) {
        MNA mna = new MNA();
        MNA.A mnaa = mna.new A();
        MNA.A.B mnaab = mnaa.new B();	// 每个内部类的对象通过其外部类的对象创建
        mnaab.h();
    }
}
```

值得注意的是，外部类访问内部类就没那么容易了，因为将内部类理解为外部类的一个普通成员，所以外部类访问内部类需先`new`一个对象。

内部类外部类互访可以参考[这篇博客](https://blog.csdn.net/jueblog/article/details/13434551)



---



## 为什么需要内部类

每个内部类都能独立地继承自一个接口的实现，所以无论外围类是否已经继承了某个接口的实现，对于内部类都没有影响。

- 其实如果想用一个类实现多个接口的话，使不使用内部类都是可以正常实现这一功能的，但是值得注意的是，Java使用的是单根继承原则，也就是说，一个类只能继承自一个抽象的类或者是具体的类，那如果我们想要实现多重继承，就必须需要借助内部类。

- 在一个外围类中，可以使用多个内部类以不同的方式实现同一个接口，或者是继承同一个类。（在下文中的控制框架就用到了这一点）
- 内部类是面向对象的一个**闭包（closure）**，有权操作作用域内所有的成员。通过观察206页的代码，我们发现，如果一个类想要实现一个接口，同时想继承一个类，接口和类中的方法返回值、函数名、参数列表都相同，这样就会导致编译器认为程序员是想用继承的类中的方法来实现接口中的方法。但有时候我们需要让这两者互不影响，不会有覆盖的发生，这时候就不得不使用内部类独立地实现接口。

内部类与控制框架的实现有着紧密的联系：

> 应用程序框架（application framework）就是被设计用以解决某类特定问题的一个类或一组类。

> 控制框架是一类特殊的应用程序框架，它用来解决事件的需求。主要用来响应事的系统被称作*事件驱动系统*。

在208-211页，书中使用了一个具体的例子说明了内部类在控制框架中的应用。对于一个抽象类`Event`，使用外围类中的不同内部类继承它，并以不同的方式实现方法，这样就达到了具有多种事件的目的，也就是让一个`Controller`可以做出多种不同的动作。看起来顺理成章的操作，其背后的内部类是一种必需（简洁的情况下）。



---



## 内部类的继承

如果一个类想继承一个内部类，那么内部类指向外部类的引用也是需要被初始化的。

```java InheritInner.java
class WithInner {
    class Inner {}
}

public class InheritInner extends WithInner.Inner {
    InheritInner(WithInner wi) {	// 构造器必需传入一个外围类对象，并使用固定的语法
        wi.super();		// 必要的固定语法
    }
    public static void main(String[] args) {
        WithInner wi = new WithInner();
        InheritInner ii = new InheritInner(wi);
    }
}
```



---



## 内部类可以被覆盖吗

### 尝试覆盖内部类的情况

```java BigEgg.java
class Egg {
    private Yolk y;
    protected class Yolk {
        public Yolk() { System.out.println("Egg.Yolk()"); }
    }
    public Egg() {
        System.out.println("New Egg");
        y = new Yolk();
    }
}

public class BigEgg extends Egg {
    public class Yolk {	// BigEgg试图覆盖掉Egg中的Yolk
        public Yolk() { System.out.println("BigEgg.Yolk()"); }
    }
    public static void main(String[] args) {
        new BigEgg();
    }
}
```

```text 输出结果：
New Egg
Egg.Yolk()
```



根据初始化的顺序，使用`new BigEgg()`之后会调用`Egg`中的构造器，根据输出结果，其中使用的`new Yolk()`依然是基类中的`Yolk`。并没有实现覆盖。这是因为**这两个内部类是完全独立的两个实体，各自在自己的命名空间内**。



---



### 导出类中的内部类继承基类中的内部类

```java BigEgg2.java
class Egg2 {
    protected class Yolk {
        public Yolk() { System.out.println("Egg2.Yolk()"); }	// 3
        public void f() { System.out.println("Egg2.Yolk.f()"); }
    }
    private Yolk y = new Yolk();	// 1

    public Egg2() { System.out.println("New Egg2"); }	// 2
    public void insertYolk(Yolk yy) { y = yy; }
    public void g() { y.f(); }	// （5）因为Yolk被继承，所以这里调用的是新版的f()了
}

public class BigEgg2 extends Egg2 {
    public class Yolk extends Egg2.Yolk {
        public Yolk() { System.out.println("BigEgg2.Yolk()"); } // 4
        public void f() { System.out.println("BigEgg2.Yolk.f()"); }	// 5
    }
    public BigEgg2() { insertYolk(new Yolk()); }
    public static void main(String[] args) {
        Egg2 e2 = new BigEgg2();
        e2.g();
    }
}
```

```java 输出结果：
Egg2.Yolk()
New Egg2
Egg2.Yolk()
BigEgg2.Yolk()
BigEgg2.Yolk.f()
```



执行顺序见代码注释



---



## 内部类标识符

```java LocalInnerClass.java
interface Counter {
    ...
}

public class LocalInnerClass {
    f() {
     	class LocalCounter{
        	...
    	}   
    }
    g() {
        return new Counter() {
            ...
        }
    }
}
```

上面的代码中有一个接口，一个普通类，一个局部内部类，一个匿名内部类，形成的`.class`文件分别是：

- Counter.class
- LocalInnerClass.class
- LocalInnerClass$1LocalCounter.class (因为是局部内部类,所以在内部类名前加上一个数字标识符)
- LocalInnerClass\$1.class (匿名内部类会在在$的后面加上一个数字标识符)

如果是普通的内部类，形成的是`Outer$Inner.class`这样的class文件。



