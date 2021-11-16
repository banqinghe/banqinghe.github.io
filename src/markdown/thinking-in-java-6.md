# 《Java编程思想》读书笔记 —— 第6章 访问权限控制

本章讲述的是面向对象编程中较为基础但是不可或缺的一部分。Java特有的`package`，以及在C++中就已经见到的`public`、`protected`、`private`关键字，和与包的概念紧密相连的`包访问权限`。

访问权限的控制提供了很多好处，`package`的出现让代码的逻辑性更强，而且解决了重名方法带来的麻烦。书中也给出了控制对成员的访问权限的两个原因，我认为很有代表性：

> 第一是为了使用户不要触碰那些他们不该触碰的部分
>
> 第二个原因，也是最重要的原因，是为了让类库设计者可以更改类内部工作方式，而不必担心这样会对客户端程序员产生重大的影响。

---



## 包：库单元

“包”也就是我们所说的`package`，它的出现主要是解决了类名之间的潜在冲突，包的名字可以作为类名的唯一标识符，从而很好地解决类名冲突的问题。



### 代码组织

Java并不像C语言一样，将源文件编译之后得到目标文件，然后将目标文件进行链接得到一个可执行文件。**Java的可运行程序是一组可以被打包成`jar`的`.class`文件**，Java解释器查找、装载、解释这些文件（Java解释器不是必要的，因为也存在用来生成一个单一的可执行文件的本地代码Java编译器）。

Java的`.java`和`.class`文件都是通过包组织起来的。



为了创建自己独一无二的包名，通常使用域名倒叙排列作为自己的包名，譬如`package cn.edu.ecnu`，包名会分解成本地的多级目录，如果使用前面所说的包名，实际上会生成一个这样的结构：

```shell
cn
└── edu
    └── ecnu
```

使用目录层次来标识类名，每个类的调用就可以是唯一的。



### 关于CLASSPATH

最初在配置Java环境的时候，就有配置`CLASSPATH`这一步，`CLASSPATH`其实是和操作系统中`PATH`相似的一个变量，当我们在shell中输入一个命令并试图执行的时候，系统会从`PATH`所指示的目录中找到我们输入的可执行文件并执行。而`CLASSPATH`则是当我们使用`import`关键字引入某个类时起作用。当我们试图引入一个类时，Java会将`CLASSPATH`中的目录逐个作为包的根目录（即作为查询我们所需类的起点），从而成功导入我们希望的类。

在Linux、Mac环境下，`CLASSPATH`中的各目录使用':' 隔开，在Windows环境下是用';' 隔开。

我电脑中的`CLASSPATH`写在`~/.bashrc`中：

```shell
export JAVA_HOME=/usr/local/jdk-11.0.4
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH
```

**ps:** 当时是按照网上的指示操作，但是`JAVA_HOME`似乎并没有名为jre的文件夹。



值得注意的是，如果想在`CLASSPATH`中写入jar包，不能只写路径，而应该将整个路径+jar包名称完整写出。



### 其他

Java中没有条件编译的功能，可以通过import导入不同的包来达到调试的效果。



---



## Java访问权限修饰词

**1. 包访问权限（default）**

不加任何修饰词就代表包访问权限，即同包类的都可以该成员/类。如果两个类处于相同的目录下，即使没有设定包的名称，也会被认为隶属于该目录的默认包中。



**2. public: 接口访问权限**

无论是否同包都可以直接访问，任何类都可以直接访问。



**3. protected: 继承访问权限**

子类可以访问父类中的`protected`成员，而且`protected`也提供了包访问权限。

**ps:** 即使父类中的成员是继承的父类的父类的（祖父类）`protected`成员，子类依然可以访问这一成员。



**4. private: 只有在一个类中可访问**

是最小的访问权限，外部类一律无法访问`private`成员。如果不想让外界创建一个类，只需要把它的所有构造器设置为`private`就可以了。正因为这样的特性，可以用来实现单例模式：

```java
public class Singleton {
    // 在类的内部new,自始至终都只使用这一个对象
    private static Singleton obj = new Singleton(); //共享一个对象
    private String content;
    private Singleton(){ //利用private 确保只能在类内部调用构造函数
    	this.content = "abc";
    }
    public String getContent() {
    	return content;
    }
    public void setContent(String content) {
    	this.content = content;
    }
    public static Singleton getInstance() {
        // 静态方法使用静态变量
        // 另外可以使用方法内的临时变量,但是并不能引用非静态的成员变量
        return obj;
    }
    public static void main(String[] args) {
        Singleton obj = Singleton.getInstance();
        System.out.println(obj .getContent()); //abc
        Singleton obj = Singleton.getInstance();
        System.out.println(obj .getContent()); //abc
        obj .setContent("def");
        System.out.println(obj .getContent()); // def
        System.out.println(obj .getContent()); // def
        System.out.println(obj == obj ); //true, obj 和obj指向同一个对象
    }
}
```



**5. 修饰词的总结**

|           | 同一个类 | 同一个包 | 不同包的子类 | 不同包的非子类 |
| :-------- | :------: | :------: | :----------: | :------------: |
| private   |    ✓     |          |              |                |
| default   |    ✓     |    ✓     |              |                |
| protected |    ✓     |    ✓     |      ✓       |                |
| public    |    ✓     |    ✓     |      ✓       |       ✓        |

