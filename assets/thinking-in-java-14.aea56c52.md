# 《Java编程思想》读书笔记 —— 第14章 类型信息

这一章的内容我初学Java的时候并没有接触到，读了一遍感觉还是没太明白。读的不好有很多原因，书写的似乎不是特别清晰，而且最近疫情严重导致我妹没法出门溜达于是整天在家拉着我陪她玩玩具，我的可用时间不是很集中，~~其实主要还是自己注意力不集中还懒~~。

这一章的名字是“类型信息”，其实更具体地说应该是“运行时的类型信息”，也就是**RTTI (Run-Time Type Identification)**，因为我自己读得也不是很懂所以下面有不少部分应该是我的主观理解，也许并不准确。（这是个坏习惯）

作者将RTTI分为两种，一种是“传统”的RTTI，另一种是Java特有的“反射”机制。

本书后面提到的RTTI一般指的都是传统的RTTI，这是一个来自C++的概念，这一机制允许了多态的运行，即JVM可以在运行的时候识别对象的类型信息，但是前提是我们必需在**编译阶段**就明确所有的类型。

反射机制是Java“一切都是对象”这一设计思想的衍生物，我们发现Java中原来还有Class对象，有Constructor对象，Method对象等等，也就是说，一个类中的方法、域，这些类的组成部分都是可以拥有自己的对象的。这样即使我们在运行过程中才得到一个从外界（其他程序、网络…）突然冒出来的对象，也可以通过反射的方法了解并使用它。



---



## Class对象

### 创建Class对象

Class对象就是用来创建类的所有的“常规”对象的。类是程序的一部分，每个类都有一个Class对象，JVM使用一个被称为“类加载器”的子系统来生成类对象。Class对象只有在需要的时候才会被加载，一旦它被载入内存，它就会被用来创建这个类的所有对象。目前我学到了三种创建类对象的方式：

- Class.forName()静态方法，直接通过类名加载
- 类字面常量（.class）/ 包装器类的标准字段（.TYPE）
- 通过已有的对象获得其类的对象（obj.getClass()）

```java 创建类对象的方式：
Class a = Class.forName("typeinfo.Gum"); // 要写全包名
Class b = FancyToy.class;
Class c = Integer.TYPE;	// 和int.class等价
Class d = obj.getClass();
```

使用类字面常量在编译器就会收到检查，不需要使用try块，所以比使用Class.forName()方法更安全。



> 为了使用类而做的准备工作实际包含三个步骤：
>
> - **加载**，这是由类加载器执行的。该步骤将查找字节码，并从这些字节码中创建一个Class对象。
> - **链接**，在链接阶段将验证类中的字节码，为静态域分配存储空间，并且如果必须的话，将解析这个类创建的对其他类的所有引用。
> - **初始化**，如果该类具有超类的话，则对其初始化，执行静态初始化和静态初始化块。

使用Class.forName()的方式会自动初始化，但是使用“.class”的形式却不会，这种情况下会在需要的时候才进行初始化。

`static`变量是一个类共用的，所以也可以用这个类的类对象调用。 `static final`的常量在编译器就已经确定，即使不用初始化也可以使用。

---

### 使用Class对象创建类的对象

这个标题也可以叫做“使用类对象来创建类的对象”，有点拗口但事实确实是这样。

我们可以直接使用Class对象的`newInstance()`方法来创建对象，但是这种方式已经在官方文档中被弃用了，理由是这种方式在类没有默认构造器的情况下，只会抛出**RuntimeException**，而相比之下，使用**class.getDeclaredConstructor().newInstance()**这种方式已经取代了前者，这种方式更安全，需要我们去主动处理没有默认构造器的情况。

```java
Object obj = class.newInstance();	// 已弃用
Object obj2 = class.getDeclaredConstructor().newInstance(); // 建议使用
```



---

### 使用泛化Class

Integer是继承自Number的类，但是下面的代码却并不能通过编译：

```java
Class<Number> genericNumberClass = int.class;
```

因为Integer Class并不是Number Class的子类，解决的方法是使用泛化类型。

首先'?'是一个通配符，代表任何类型，那么"? extends Number"就表示**任何Number的子类型**，所以下面的代码是正确的。

```java
Class<? extends Number> genericNumberClass = int.class;
```

使用泛型有利于在编译器就发现错误。甚至使用Class<?>的做法都是优于Class的，这起码说明我们并不是因为疏忽而没有使用泛型限制。

使用泛化Class的时候需要注意到“含糊性”的问题，例如我们现在有两个类**Toy**和**FancyToy**，FancyToy继承自Toy，我们使用下面的例子说明：

```java
Class<FancyToy> ftClass = FancyToy.class;
FancyToy fancyToy = ftClass.newInstance();
Class<? super FancyToy> up = ftClass.getSuperclass(); // 可以编译
// Class<Toy> up2 = ftClass.getSuperclass(); // 无法通过编译
Object obj = up.newInstance();
```

之所以上面那行代码无法编译，是因为getSuperclass这个方法返回值是` Class<? super T>`，这说明它返回的是“某个类，它是FancyToy的超类”，而不是具体的某个类，所以返回类型的只能适用于`<? super FancyToy>`，而不是具体的`Toy`类型。也正是由于这种含糊性，使用up的`newInstance()`方法创建的对象也只能是Object类型。

---



## 类型转换前先做检查

前面的章节已经提到过，向上转型的操作是安全的，但是向下转型时要很小心，要提防无法转型的情况。这一小节就给出了预防向下转型时出错的方法。

- **instanceof**关键字，使用这个关键字可以判断某个对象是否可以转换成某个类型，使用方法如下：

  ```java 
  if(x instanceof Dog)
      ((Dog)x).bark();
  ```

  局限性是只能将一个对象与命名类型比较，而不能直接与Class对象比较。

- **Class.isInstance()**方法（static），作用和`instanceof`完全相同，但是没有`instanceof`的局限性。



---



## 反射

### 反射的~~\_概念\_~~

反射机制用来应对“运行时遇到了编译期并不在程序空间中的对象的引用”的情况，要想获取这个类的信息，我们需要反射机制的支持。**Class类和java.lang.reflect类库**一起对反射概念提供了支持 ，这个类库包含了**Field**、**Method**和**Constructor**类（每个类都实现了**Member**接口）。这些类的对象是由JVM在运行时创建的，用来表示未知类里对应的成员。

对于一个已经存在的对象，我们可以通过**getClass()**方法获得它的类对象。然后可以通过一系列的方法得到它的构造器对象、方法对象、域对象，并使用这些对象的方法调用方法、获取或者是改变域。

对于一个已知的类，我们可以获取它并使用`newInstance()`方法来创建对象。



---



### get... 方法对比

对于Class类提供的生成Constructor、Field等对象的函数，有好几类，但是功能上有细小的差别，下面用产生Constructor对象的函数们来做对比：

- **getDeclaredConstructor(Class<?>... parameterTypes)**：

  这个方法的参数是构造器的参数对象，以此来识别调用的是哪个构造器，它可以返回任意一个构造器的对象，包括public和非public的（包括private）。

- **getDeclaredConstructs()**：没有参数，返回所有的Constructor对象组成的数组。

- **getConstructor(Class<?>... parameterTypes)**：返回结果是`getDeclaredConstructor`返回结果的子集，只能返回public的构造器。

- **getConstructors()**：返回所有public Constructor对象组成的数组。

同理适用于生成Method和Field对象的函数，但是对于刑如getMethod()的方法来说，参数应该是一个**表示方法名的String+参数类型对象列表**。因为它们不像构造器一样只有一个固定的名字。



---



### 使用反射

现在我们有一个`Person`类，其中有域、构造器、两种方法，下面将使用反射操作Person类中的这些元素。

```java Person.java
public class Person {
    String name;
    int age;
    public Person() {
        name = "default";
        age = -1;
    }
    private Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    public String getName() { return this.name; }
    public int getAge() { return this.age; }
    public void SetName(String newName) { this.name = newName; }
    public void setAge(int newAge) { this.age = newAge; }
}
```



**1. 使用不同构造器创建对象**

```java
Person.class.getDeclaredConstructor().newInstance();
Person.class.getDeclaredConstructor(String.class, int.class).newInstance("Tom", 5);
```

即使带参的构造器是private，我们仍然可以使用`getDeclaredConstructor`方法访问并使用它。



**2. 使用方法**

利用反射使用类的方法需要先创建类的对象，并借助Method类中的**invoke()**方法。

```java
Person obj = Person.class.getDeclaredConstructor(String.class, int.class).newInstance("Tom", 5);
Method m = Person.class.getDeclaredMethod("setName", String.class);
m.invoke(obj, "Jerry");
Method m2 = Person.class.getDeclaredMethod("getName");
System.out.println(m2.invoke(obj));
```

invoke方法的参数是目标对象+需要传入方法的参数列表。



**3. 获取和修改域**

调用Field的**get**方法可以返回一个指定的域，通过**set**方法可以设置一个域，即使是private也是可以更改的。

```java
Field f1 = Person.class.getDeclaredField("name");
System.out.println(f1.get(obj)); // 使用get()方法得到域的值
f1.set(obj, "Tom");	// 使用set()方法修改域的值
System.out.println(obj.name);
```

**ps：**值得注意的一点是，如果域是**final**的，虽然**set()**方法执行并不会报出任何错误，但是这个方法并不会起到任何效果，也就是说即使看起来反射机制拥有所有权限，但是它也无法进行final值的修改。



**4. 关于setAccessible()方法**

无论是书上还是网上找到的例子，很多都会用到**setAccessible()**方法，例如先写`m.setAccessible(true)`，才调用m表示的private方法，但是我上面的代码没有使用这一方法，程序也跑了起来，没有任何warning。

网上的对于setAccessible()方法的解释是：**实际上setAccessible是启用和禁用访问安全检查的开关**，并不是为true就能访问为false就不能访问，使用**setAccessible(true)**只是取消使用反射时的语言访问检查，但是不耽误反射还是可以访问到private的域或是方法。

> 但有的时候这将会成为一个安全隐患，为此，我们可以启用java.security.manager来判断程序是否具有调用setAccessible()的权限。默认情况下，内核API和扩展目录的代码具有该权限，而类路径或通过URLClassLoader加载的应用程序不拥有此权限。



---



## 空对象

之前如果我们表示一个对象不存在的时候，通常会直接让对象的引用为**null**，但是这一节书中提供了一个更好的方法，即使用“空对象”来代替null，引入空对象的意义，就像在数字世界中引入'0'差不多，引入一个对象专门表示这个对象为空，**可以避免我们经常测试对象是否为null，而是直接可以假设所有的对象都是有效的。**

要使用空对象，我们需要一个专门的、用来表明对象是空对象的一个接口，用空对象继承了这个接口，就可以用`instanceof Null`来判断一个对象是不是空对象了：

```java Null.java
public interface Null {}
```

下面是一个运用了空对象的类：

```java Person.java
public class Person {
    public final String first;
    public final String last;
    public final String address;
    public Person(String first, String last, String address) {
        this.first = first;
        this.last = last;
        this.address = address;
    }
    public String toString() {
        return "Person: " + first + " " + last + " " + address;
    }
    public static class NullPerson	// 空对象是一个static的内部类，继承了外部类，并实现了Null接口
    extends Person implements Null {
        private NullPerson() { super("None", "None", "None"); }
        public String toString() { return "NullPerson"; }
    }
    public static final Person NULL = new NullPerson();
}
```

当创建一个Person对象引用的时候，如果需要让它为空，就可以让这个引用指向**Person.NULL**，来表示这是一个空的对象。



---



## 总结

这章的内容还是很丰富的，但是我笔记的字数确实少于前面几篇，有些地方确实一头雾水（或者是看不下去），比如第7节动态代理（337页），理解不到应用的场合，代码也没兴趣看下去，就准备先晾着了。

书中也用一节讲述了一个名为“注册工厂”的东西（331页），也是一种工厂模式，而且我觉得和前面提到的工厂模式好像区别也不大，就没有写出来。

在第9节“接口与类型信息”中，书中讲到接口的使用并不能保证耦合不会发生，因为有时候可以通过向下转型而调用接口中没有的特有方法，这时候把不想暴露出来的特有方法放在另一个包里，并使用包访问权限是一个解决方案（347页）。

这本书一直有一个让我很不爽的地方就是特喜欢import后面章节的代码，虽然是为了方便但是我就是很不舒服……

下一章有八十页？？？

