# 《Java编程思想》读书笔记 —— 第12章 通过异常处理错误

## 概念

我们最希望的是所有的错误在编译阶段就可以发现，但是这是不够实际的，可能运行的时候接受了外部的数据之后，错误才会被触发，Java的异常机制就是为了处理这种错误。使用异常，可以将业务的主干代码和错误处理代码分离，只在异常处理程序中处理错误。作者还提到：“报告”功能是异常的精髓所在。

---

## 基本异常

要区分**异常情形**和**普通问题**的概念：

- 异常情形：当前环境下无法获得必要的信息来解决问题，所能做的就是从当前环境跳出，将问题提交给上一级环境（抛出异常）。
- 普通问题：当前环境下能够得到足够的信息，总能处理这个错误。

抛出异常后Java会做的事情：

1. 使用`new`在堆上创建异常对象
2. 当前的执行路径被终止，从当前环境中弹出对异常对象的引用
3. 异常处理程序处理异常



**异常的参数：**

所有的标准异常都有两个构造器，一个是默认构造器，另一个是接受**字符串**作为参数，以便能把相关信息放入异常对象的构造器。

通常，异常对象中仅有的信息就是异常类型，除此之外不包含任何有意义的内容。（这印证了“‘报告’功能是异常的精髓所在”的观点）



---



## 捕获异常

使用try-catch的形式捕获并处理异常，try块中的区域就是**监控区域**，catch捕获了相应的异常后，作出相应的处理措施。



**终止与恢复**

异常处理理论上有终止模型和恢复模型两种。

- 终止模型是指一旦异常被抛出，表示错误已无法挽回，也不能回来继续执行。
- 恢复模型是指在遇到错误时不抛出异常，而是调用方法来修正错误。或者把try块放在while循环里，这样就不断地进入try块，直到得到满意的结果为止。

恢复模型并不实用（导致耦合），恢复性的处理程序需要了解异常抛出的地点，这势必要包含依赖于抛出位置的非通用性代码。



---



## 创建自定义异常

**自定义异常必须从已有的异常类继承，最好是选择意思相近的异常类继承。**

### 自定义异常

一般情况下为自定义异常创建默认构造器，或者是既有默认构造器又有字符串作为参数的构造器。

```java
class MyException extends Exception {
    public MyException() {}
    public MyException(String msg) { super(msg); }
}
```

也可以在异常类中添加其他信息，继续重载构造器，还可以覆盖`Throwable`中的`getMessage()`方法，这个方法的功能基本和`toString()`类似，使用`printStackTrace()`的时候会将异常的信息输出：

```java
class MyException extends Exception {
    int x;
    public MyException() {}
    public MyException(String msg) { super(msg); }
    public MyException(String msg, int x) {
        super(msg);
        this.x = x;
    }
    public String getMessage() {
        return x + super.getMessage();
    }
}
```



**关于printStackTrace()方法：**打印异常从方法调用处直到异常抛出处的方法调用序列，默认打印的是输出到标准错误流（`System.err`）的信息，若使用打印到**标准输出流**，则需：

```java
e.printStackTrace(System.out);	// System.out表示标准输出流
```



---



### 使用记录日志

这一方面不太理解，而且也不知道使用的场合，不再叙述。



---



## 异常说明

某个方法可能会抛出异常时，在声明该方法的时候会在它的后面加上潜在的异常类型的列表（**RuntimeException**除外）：

```java
void f() throws TooBig, TooSmall, DivZero { // ...
```

使用这个方法时，必需对潜在的异常有所反应，处理掉这个异常或者是继续向外抛出异常。



---



## 捕获所有异常

可以使用

```java
catch(Exception e) { ...}
```

捕获所有的异常，这一个`catch`块当做最后一个`catch`块。

这样的原因是因为**派生类的对象也可以匹配其基类的处理程序**，如果把基类异常子句放在派生类异常子句上面，则下面的语句永远无法被执行，编译器是不允许这种写法的。

---

可以使用多种方式打印异常信息：

- e.getMessage();
- e.getLocalizedMessage();
- System.out.println(e); （使用`toString()`）
- e.printStackTrace();

每个提供的信息都是前面的超集。

---

### 栈轨迹

`printStackTrace()`方法提供的信息可以通过`getStackTrace()`方法来直接访问，这个方法将返回一个由栈轨迹中的元素所构成的数组。

```java WhoCalled.java
public class WhoCalled {
    static void f() {
        try {
            throw new Exception();
        } catch (Exception e) {
            for(StackTraceElement ste : e.getStackTrace())	// 数组中每个元素都是StackTraceElement类型
                System.out.println(ste.getMethodName());
        }
    }
    static void g() { f(); }
    static void h() { g(); }
    public static void main(String[] args) {
        f();
        System.out.println("--------------------------------");
        g();
        System.out.println("--------------------------------");
        h();
    }
}
```

```text 输出结果
f
main
--------------------------------
f
g
main
--------------------------------
f
g
h
main
```



---



### 重新抛出异常

可以在catch到一个异常之后再重新抛出异常

```java
catch(Exception e) {
    System.out.println("An exception was thrown");
    throw e;
}
```

使用`printStackTrace()`方法显示的是原来的异常抛出点的调用栈信息，可以调用`fillInStackTrace()`方法更新这一信息，这个方法将返回一个**Throwable**对象，它是通过把当前调用栈信息填入原来那个异常对象而建立的。

```java fillStackTrace使用示例：
public static void f() throws Exception {
    throw new Exception("throw from f()");
}
public static void h() throws Exception {
    try {
        f();
    } catch(Exception) {
        throw (Exception)e.fillInStackTrace();
    }
}
public static void main(String[] args) {
    try {
        h();
    } catch(Exception) {
        e.printStackTrace(System.out);
    }
}
```

```text  输出结果:
java.lang.Exception: thrown from f()
		at Rethrowing.h(...)
		at Rethrowing.main(...)
```

打印栈轨迹的时候是从h()方法开始的，而不是从f()方法开始，也就是说调用`fillStackTrace()`的那一行就成了异常的新发生地了。



也可以在捕获到一个异常之后抛出另一种异常，这样前一个异常的信息会丢失，只剩下新抛出点的信息存在。



---



### 异常链

捕获一个异常之后又抛出另一个异常，且把原本异常的信息保存下来，这样形成的一个逻辑结构叫做异常链。

在`Throwable`的子类中，只有三种基本的异常类提供了带`cause`参数的构造器，它们是**Error**、**Exception**、**RuntimeException**。如果要把其他异常类型链接起来，应该使用`initCause()`方法而不是构造器。

```java
public static void f() throws ExceptionOne {	// f()方法会抛出一个自定义异常
    throw new ExceptionOne();
}
```

```java 使用构造器链接异常：
public static void g() throws Exception {
    try {
        f();
    } catch(ExceptionOne e) {
        throw new Exception(e);
    }
}
```

```java 使用initCause()方法链接异常：
public static void h() throws ExceptionTwo {
    try {
        f();
    } catch(ExceptionOne e) {
        ExceptionTwo e2 = new ExceptionTwo();
        e2.initCause(e);	//  这里需要抛出的异常无法使用带有cause作为参数的构造器，所以需要使用initCause方法传递信息
        throw e2;
    }
}
```

```java getCause()的使用
try {
    g();
} catch (Exception e) {
    e.printStackTrace();
    e.getCause();	// 这一语句会打印出引起异常e的异常的栈轨迹
}
```



---



## Java标准异常

**Throwable**这个类表示任何可以作为异常被抛出的类，可以分为两种类型：**Error**和**Exception**。

- **Error：**表示编译时和系统错误
- **Exception：**可以被抛出的基本类型，在Java类库、用户方法以及运行时故障中都可能抛出Exception型异常。

**ps：**异常并非全是在**java.lang**包里定义的。



---



**RuntimeException**

运行时异常，也被成为不受检查异常，是`Exception`中的一个特例，这种异常是会被自动捕获的异常，不需要程序员去检查，主要是引用空指针、数组越界、除以零这种异常，如果每次编写都要检查则会使代码混乱，浪费精力。

如果`RuntimeException`没有被主动捕获而直达`main()`，那么在程序退出前将调用异常的`printStackTrace()`方法。

---

异常处理机制不仅用来处理代码控制能力之外的因素导致的错误，也需要**发现某些编译器无法发现的编程错误**。



---





## 使用finally进行清理

finally块放在try-catch块的后面，无论异常是否发生，finally块中的内容总是会被执行。

### finally的基本用途

**当要把除了内存之外的资源恢复到它们的初始状态时**，就要用到finally子句。比如关闭已打开的文件或者网络连接，绘制的图形或者是外部的某个开关。

如果没有finally语句，这些关闭动作要写在每个catch块里面，就会造成代码的重复编写。

finally块中的语句一定会执行，即使在try-finally结构中，try块中向外抛出异常。

---

### 在return中使用finally

即使在try块中return，finally中的内容依然会被执行。



---



### 异常丢失

异常丢失是Java异常设计的瑕疵，在某型特别的情况下会导致异常的丢失。

**情况1：**

```java
try {
    LostMessage lm = new LostMessage();
    try {
        throw new VeryImportantException();
    } finally {
        throw new HoHumException();
    }
} catch(Exception e) {
    System.out.println(e);
}
```

在try块和finally块中都抛出异常，但是外围的catch只能捕获到finally块中抛出的异常，而内部try块中的异常却丢失了。



**情况2：**

```java
public static void main(String[] args) {
    try {
        throw new RuntimeException();
    } finally {
        return;
    }
}
```

在finally块中返回。运行没有任何输出，说明`RuntimeException`异常丢失了。



## 异常的限制

- 当覆盖方法时，只能抛出在基类方法的异常说明里列出的那些异常。一个出现在基类方法的异常说明中的异常，不一定会出现在派生类方法的异常说明里。换句话说，在继承和覆盖的过程中，某个特定方法的“异常说明的接口”不是变大了而是变小了——这和类接口在继承时的情形相反。

- 如果一个派生类又实现了一个接口，并且这个类要覆盖的方法在基类和接口中同时拥有，那么这个方法要么不能抛出任何异常，要么只能抛出基类和接口的同名同参方法中共有的异常说明。否则的话，向上转型之后就不能判断是否捕获了正确的异常。

- 异常限制对构造器不起作用，派生类的构造器的异常说明中必需包括基类构造器中可能抛出的异常，但是也可以包括其他异常。

- 创建一个类的对象的时候，如果不使用向上转型，则只需要捕获这个类可能抛出的异常，如果使用了向上转型，还需要捕获基类中的异常。

（示例代码在书中269页）



---



## 构造器

前面提到的使用finally清理其实是可能有一定问出现的。比如在try中打开某个文件，但是打开失败，但是在finally中我们写了关闭文件的代码，原本的额文件就没有打开，我们在这时关闭是会导致错误的。

**书中给出的解决方案：**对于在构造阶段可能会抛出的异常，并且要求清理的类，最安全的使用方式是**使用嵌套的try子句**：

```java Cleanup.java
public class Cleanup {
    public static void main(String[] args) {
        try {
            InputFile in = new InputFile("/home/bqh/文档/Java/source/chapter12/src/Cleanup.java");
            try {
                String s;
                int i = 1;
                while((s = in.getLine()) != null) {
                    ;
                }
            } catch (Exception e) {
                System.out.println("Caught Exception in main");
                e.printStackTrace(System.out);
            } finally {
                in.dispose();
            }
        } catch (Exception e) {
            System.out.println("InputFile construction failed");
        }
    }
}
```

在上面的代码中打开文件的操作失败之后，不会进入内部的try-catch-finally结构，而是会被外围的catch捕获到异常，避免了错误地关闭文件。只有当打开文件成功之后，才会进入内部结构，这样才会有关闭文件的操作。



这种通用的清理习惯在构造器不抛出任何异常时也应该运用，其基本规则是：在创建需要清理的对象之后，立即进入一个**try-finally**语句块：

```java
NeedsCleanup nc1 = new NeedsCleanup();
try {
    // ...
} finally {
    nc1.dispose();
}
```

将清理动作放在finally块中确保清理的实现（应该是这个目的）。



---



## 其他可选方式

Java中发明了“被检查异常（CheckedException）”这在其他语言中都是不存在的，这种类型的异常带来了**更丰富的示意性**，但是也带来了一些问题。当项目由小项目编程庞大的项目时，被检查异常越来越多，以至于后来就无法管理了。

当”我不知道该这样处理这个异常，但是也不想把他‘吞’了，或者打印一些无用的消息“这种情况时，我们可以选择直接把”被检查异常“包装进**RuntimeException**：

```java
try {
    // ... to do something useful
} catch (IDonKnowWhatToDoWithThisCheckedException e) {
    throw new RuntimeException(e);
}
```

同时可以使用`getCause()`方法捕获并处理特定的异常（前面的异常链中提到了这种操作）。

```java
try {
    // ...
} catch (RuntimeException e) {
    try {
        throw e.getCause();	// 将原本的异常提取出来再次抛出，实现细化处理
    } catch(...) {
        // ...
    } catch(...) {
        
    }
}
```



---



## 异常使用指南

书中给出了9种应该使用异常的情况：

1. 在恰当的级别处理问题。（在知道该如何处理的情况下才捕获异常。）
2. 解决问题并且重新调用产生异常的方法。
3. 进行少许修补，然后绕过异常发生的地方继续执行。
4. 用别的数据进行计算，以代替方法预计会返回的值。
5. 把当前运行环境下能做的事情尽量做完，然后把**相同的**异常重抛到更高层。
6. 把当前运行环境下能做的事情尽量做完，然后把**不同的**异常抛到更高层。
7. 终止程序
8. 进行简化。（如果你的异常模式使问题变得太复杂，那用起来会非常痛苦也很烦人。）
9. 让类库和程序更安全。（这既是在为调试做短期投资，也是在为程序的健壮性做长期投资。）

