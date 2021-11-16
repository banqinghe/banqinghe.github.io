# 《Java编程思想》读书笔记 —— 第13章 字符串

对String的处理是工作时经常需要做的事情。这一章主要讲述的是String类本身的特性以及对字符串的可以进行的操作。主要的内容是**String类中的方法介绍、格式化输出字符串以及正则表达式**。和 持有对象那一章很相似，这一章理论知识少，主要是要求读者掌握既有的方法，但是应用方法多且杂，所以初学不是很容易。

---

## 不可变String

在初学Java的时候曾接触过不可变对象的概念，而String类的对象就是不可变对象的一个典型例子。不可变对象的特点是：对象引用指向的对象实例不可改变，如果试图改变，就会开辟一片新的空间，对象引用指向这个新的对象。

下面给出一个很典型的例子：

```java
public static void change(String b)
{
	b = "def";
}
public static void main(String[] args) {
    String a = new String("abc");
    String b = a;
    System.out.println(b);	// 输出abc 
    a = "def";
    System.out.println(b);
    // 输出abc，因为String为不可变对象，所以a指向"def"后,初始的"abc"并不会消失 b依然指向"abc"
    a=new String("abc");
    change(a);
    System.out.println(a); // 输出abc
}
```



## 重载“+”与StringBuilder

Java并不允许用户自己运算符重载，只有两个特殊的运算符“+”和“+=”被重载用于字符串的操作。

Java支持下面的String初始化操作：

```java
String mango = "mango";
String s = "abc"  + mango + " def" + 47;
```

上面的 String对象mango和数字47都被自动转化为了字符串，并成为了s的一部分。通过反汇编这串代码我们可以看到JVM是怎么在底层实现这一句代码的。我们观察到，编译器首先创建了一个`StringBuilder`对象，并使用这个对象完成了append字符串的操作，最后将这个`StringBuilder`对象转化为一个String对象，并将其赋给s。这是编译器主动做出的优化，使字符串的加法更为高效。

如果需要频繁多次地使用字符串的append方法，最好创建一个`StringBuilder`对象来完成这一操作。使用`StringBuilder`含参构造器可以指定该对象初始空间的大小，如果可以预估到最终的字符串大概有多长，就可以一开始就设置合适的大小，避免多次重新分配缓冲。

**注意：**如果使用**append(a + ":" + c)**这种形式，编译器就会掉入陷阱，以为这样会额外地创建`StringBuilder`对象进行括号内的字符串操作。

除了StringBuilder，**StringBuffer**也可以实现比String更高效的字符串拼接操作，且**StringBuffer线程更安全**，所以它所需的花销也会略大（速度慢于StringBuilder）。



---



## 无意识地递归

**试图使用this关键字打印出对象的地址会导致无意识的递归。**

```java 例：
public class InfiniteRecursion {
    public String toString() {
    	return "infiniteRecursion address: " + this + "\n";
    }
}
```

`toString()`方法中，编译器试图将`this`转化为字符串，就会又调用本类的`toString()`方法，如此`toString()`不停反复调用自身，陷入了无限的递归，最终导致栈溢出异常。

打印本对象地址应该将`this`换成`super.toString()`。



---



## String上的操作

这一节只是列出了一张表格，介绍了一些String方法。下面是我认为值得记录的方法：

| 方法                          | 参数                                                         | 应用                                         |
| ----------------------------- | ------------------------------------------------------------ | -------------------------------------------- |
| **charAt()**                  | int索引                                                      | 索引位置上的字符                             |
| **toCharArray()**             |                                                              | **生成**一个char[]，包含String的所有字符     |
| **compareTo()**               | 另一个String                                                 | 比较两个字符串的大小，返回负数，零，或者正数 |
| **startsWith() / endWith()**  | 可能起始/后缀的String<br>startsWith()参数可包括偏移量        | 返回boolean                                  |
| **indexOf() / lastIndexOf()** | char / char + 起始索引 / <br>String / String + 起始索引      | 不包含返回-1，否则返回找到的起始索引         |
| **replace()**                 | 要替换的字符 / CharSequence<br>用来替换的字符 / CharSequence | 返回替换操作后的String                       |
| **trim()**                    |                                                              | 返回删除字符串两端空格后的String             |
| **valueOf() （静态方法）**    | 字符数组 (+偏移量) / 多种类型数据                            | 返回一个表示参数内容的String                 |
| **intern()**                  |                                                              | 将字符串放入常量池，返回池中的String         |

这种字典式的表格在这一章中出现了很多次，主要执行的还是记住常用的，记不住的查表这种策略。



---



## 格式化输出

### System.out.format()方法

C语言中支持使用`printf()`函数进行输出，Java也支持使用**printf()**方法，且使用方法就我了解的来看，和C语言中的printf函数完全一致。但是这是一种较老的方法了，书中建议还是使用新一点的方法`format()`，其实使用方法还是没变，和C语言是基本相同的。

```java
int x = 5;
double y = 5.332542;
System.out.format("x = %d\n", x);
System.out.format("y = %f\n", y);
```

值得注意的是，这里的**%d**包括所有类型的整型数，**%f**包括所有的浮点型数，甚至大数也可以使用这个输出。



---



### Formatter类

和前面提到的`format`方法其实异曲同工，`Formatter`对象类似于一个翻译器，使用`Formatter`对象的`format`方法可以输出指定格式的字符串。

`Formatter`构造器中的参数是输出字符串的目的地，最常用的是**PrintStream**（包括System.out），**OutputStream**和**File**。

```java
Formatter f = new Formatter(System.out);
f.format("x = %d\n", x);
```

使用`format`实现输出**数据的对齐**也很容易,和C语言printf函数和实现方式是相同的，对于字符串的示例：

```java
f.format("%-15.15s", str);	// 负号表示右对齐，第一个小数点前的数字表示最小宽度，小数点后的数字表示最大宽度
```

---

**Formatter转换**

需要注意：

**%h：**散列码	**%e：**浮点数**（科学计数）	**%b：布尔值	**%%：**表示字符‘%’

在format方法中

- **字符不可以转化成数字**，**整型**数字可以转化成字符（ASCII码转化）
- 所有数据类型都可以转化成散列码和字符串
- 所有数据类型都可以转化成布尔值，除非原本就是布尔型，其他的一律转化成**true**

---

**String.format()**

当只需要使用format方法一次的时候，使用`String.format`方法是比使用`Formatter`类更加方便的，这是一个静态方法，返回格式化后的String对象，使用方式和`Formatter.format`类似：

```java
System.out.println(String.format("x = %d\n", x));
```



---



## 正则表达式

正则表达式的使用是这一章的重点所在，使用正则表达式，字符串的匹配操作达到了空前的灵活性。使用正则表达式主要依靠的是String类本身的一些方法，或者是`Pattern`和`Matchcer`这两个类配合使用。

### 基础

正则表达式的格式，根据书中所说，可以在Java文档的[java.util.regex.Pattern](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Pattern.html)部分找到。因为要列举出来都可以另写一篇博客了，而且全抄下来实际意义确实也不大，所以需要的时候动手查是更好的选择。



### String类中的正则表达式工具

**1. matches()方法**

该方法返回一个布尔值，用来判定一个String是否和传入的正则表达式相匹配。

```java
System.out.println("-1234".matches("-?\\d+"))	// true
```

**2. split()方法**

这个方法被用来将字符串**按照正则表达式分割**，返回一个字符串型的数组。

```java
System.out.println(Arrays.toString(str.split("\\W+")));
```

**3. replaceFirst()和replaceAll()方法**

两个都是替换方法，且名称可以自解释其作用。第一个参数是正则表达式字符串，第二个参数是要替换的成的字符串。返回的结果是替换完成的String对象。

```java
System.out.println(s.replaceAll("f\\w+", "located"));
```

> 如果正则表达式不是只使用一次的话，非**String**对象的正则表达式明显具备更佳的性能。



---



### Pattern和Matcher

使用的一般步骤是：

1. 使用**static Pattern.complie()**编译正则表达式，生成一个`Pattern`对象
2. 调用`Pattern`对象的`matcher()`方法（该方法参数为需处理字符串），生成一个`Matcher`对象
3. 使用`Matcher`对象的方法进行操作

### 基本使用

**1. find()** 类似于一个迭代器，返回一个Boolean值，并且准备指向下一个匹配子字符串，如果有整数参数，则从参数表示位置的开始向后搜索，否则默认从第0个位置开始搜索。

**ps：**注意**lookingAt()**和**matches()**方法也返回Boolean，lookingAt只有当正则表达式和字符串开头相匹配的时候为true，matches当正则表达式和整个字符串匹配时才返回true。

**2.group()** 正则表达式中，被一对括号括起来的一部分被称为一组，比如被第一对括号括起来的就是第一组，group()（无参）返回匹配整个正则表达式的字符串。

**3. start()和end()** 表示匹配正则表达式部分的起始位置和终止位置，依然是**左闭右开**的形式，比如对于"a123b"，使用"\\\d+"去匹配，start()返回1，end()返回4。

下面给出一个典型应用：

```java
for(String arg : args) {
    System.out.println("Regular expression: \"" + arg + "\"");
    Pattern p = Pattern.compile(arg);	// 创建Pattern对象编译正则表达式
    Matcher m = p.matcher(args[0]);	// 使用Pattern的matcher方法创建Matcher对象，并传入需要匹配操作的字符串
    while(m.find()) {
        System.out.println("Match \"" + m.group() + "\" at positions " + m.start() + "-" + (m.end()-1));
    }
}
```

---

### Pattern标记

Pattern.complie的一种重载版本为：**Pattern.complile(String ragex, int flag)**，这里的`flag`就是需要传入的Pattern标记，可以指定一些额外操作，也可以在方法中不指定，在正则表达式开头放入指定的标志达到相同效果：

- **Pattern.Case_INSENSITIVE(?i) | Pattern.Case_UNICODE_CASE(?u)**  这两个标记经常配合使用，这样可以实现基于Unicode的大小写不敏感的匹配。
- **Pattern.COMMENTS(?x)**  空格符会被忽略，以#开头直到行末的注释也会被忽略
- **Pattern.DOTALL(?s)** '.'可以匹配任何字符，包括行终结符
- **Pattern.MULTILINE(?m)** 多行模式，^和$分别匹配每行的开始和结束

还有**Pattern.CANON_EQ**和**Pattern.UNIX_LINE(?d)**，但是我现在还不太理解，还不知道应该在什么场合用。

下面的例子是在忽略大小写的前提下进行的正则表达式匹配工作：

```java ReFlags.java
import java.util.regex.*;

public class ReFlags {
    public static void main(String[] args) {
        Pattern p = Pattern.compile("^java", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE);
        Matcher m = p.matcher(
            "java has regex\nJava has regex\n" +
            "JAVA has pretty good regular expressions\n" +
            "Regular expressions are in Java"
        );
        while(m.find())
            System.out.println(m.group());
    }
}
```

```text 输出结果：
java
Java
JAVA
```

---

### split()

和String中的`split()`方法的使用方法类似，`Pattern`中的`split()`方法也返回分割后的的字符串数组。

这个`split()`有两种重载版本，第一中是只接受一个**CharSequence**，第二种是接受一个CharSequence和一个用来限制分割成字符串数量的整型数。

以下两句输出的结果是完全相同的：

```java
System.out.println(Arrays.toString(Pattern.compile("!!").split(input, 3)));	// 使用Pattern对象的split()方法
System.out.println(Arrays.toString(input.split("!!", 3)));	// 使用String对象的split()方法
```

---

### 替换操作

**replaceFirst()**和**replaceAll()** 这两个方法的使用不用多说，这里主要介绍**appendReplacement()**方法，这个方法有两种重载版本：

- **appendReplacement(StringBuffer sb, String replacement)**
- **appendReplacement(StringBuilder sb, String replacement)**

它能允许我们实现渐进式的字符串替换，一般要和**appendTail()**方法一起使用，下面给出例子：

```java
StringBuffer sbuf = new StringBuffer();
Pattern p = Pattern.compile("[aeiou]");
Matcher m = p.matcher(s);
while(m.find()) {
    System.out.print("m.group: " + m.group());
    m.appendReplacement(sbuf, m.group().toUpperCase());
}
m.appendTail(sbuf);
System.out.println(sbuf);
```

每次循环，sbuf中的就会追加上一次替换完成的字符串，最后使用appendTail()加上未加到sbuf中的字符串末尾部分。

---

### reset()

Matcher对象用来切换需要做匹配处理的字符串：

```java
m.reset(anotherString);
```



---



## 扫描输入

目前读取一个文件或者是标准输入的内容，处理方式还是每次读入一行（readLine()方法），然后逐行进行分析以分离出我们想要的数据，这种逐行读数据再处理的方式是相当麻烦的。Java SE5中新增的**Scanner**类可以让我们按照类型读数据而不是傻傻地逐行读入。

Scanner有多种构造器重载版本，可以传入**File、InputStream、String、Readable、Path**。

```java BetterReader.java
// public static BufferedReader input = new BufferedReader(
//    new StringReader("Sir Robin of Camelot\n22 1.61803"));  // String将String转化为可读的流对象

import java.util.*;

public class BetterReader {
    public static void main(String[] args) {
        Scanner stdin = new Scanner(SimpleRead.input);  // 一个BufferedReader作为构造器的参数
        System.out.println("What is your name");
        String name = stdin.nextLine();	// 读取一行
        System.out.println(name);
        System.out.println("How old are you? What is your favorite double?");
        System.out.println("(input: <age> <double>)");
        int age = stdin.nextInt();	// 读取整型数
        double favorite = stdin.nextDouble();	// 读取浮点数
        System.out.println(age);
        System.out.println(favorite);
        System.out.format("Hi %s.\n", name);
        System.out.format("In 5 years you will be %d.\n", age+5);
        System.out.format("My favorite double is %f.", favorite/2);
    }
}
```

关于IO异常，文档中是这样写：

> A scanner can read text from any object which implements the [`Readable`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/Readable.html) interface. If an invocation of the underlying readable's [`read()`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/Readable.html#read(java.nio.CharBuffer)) method throws an [`IOException`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/IOException.html) then the scanner assumes that the end of the input has been reached. The most recent `IOException` thrown by the underlying readable can be retrieved via the [`ioException()`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Scanner.html#ioException()) method.
>
> 扫描程序可以从实现Readable接口的任何对象中读取文本。 如果对底层可读对象的read()方法的调用引发IOException，则扫描程序将假定已到达输入的结尾。 可以通过ioException()方法检索由底层可读内容引发的最新IOException。

即Scanner将IOException当做读取结束的标志，可以使用特定方法捕获最新的IOException。

### 指定定界符

Scanner默认使用空格作为分词标志，但是也可以使用**useDelimiter()**方法，利用正则表达式使用自定义的定界符。

```java ScannerDelimiter.java
import java.util.*;

public class ScannerDelimiter {
    public static void main(String[] args) {
        Scanner scanner = new Scanner("12, 42, 78, 99, 42");
        scanner.useDelimiter("\\s*,\\s*");	// 指定了定界符（分隔符）
        while(scanner.hasNextInt())
            System.out.println(scanner.nextInt());
    }
}
```

```text 输出结果：
12
42
78
99
42
```

### 使用正则表达式扫描

Scanner使用正则表达式扫描的使用和迭代器的使用很像，主要使用的方法有：

- **hasNext()** 参数为一个正则表达式，判断有没有下一个和正则表达式匹配的部分
- **next()**  参数为正则表达式，如果已经hasNext()成功，那么就执行这一方法，使scanner指向匹配部分
- **match()**  返回一个MatchResult对象，使用这个对象的方法（group(), start()...）对匹配到的部分进行操作

**注意：**因为匹配时只会关注每个分词，所以正则表达式中不能包括定界符，否则不可能匹配成功。

```java 正则表达式包括定界符的情况：
import java.util.Scanner;
import java.util.regex.MatchResult;

public class ScannerTest {
    public static void main(String[] args) {
        Scanner scanner = new Scanner("11211211211211");
        scanner.useDelimiter("2");
        String pattern = "121";
        while(scanner.hasNext(pattern)) {
            scanner.next(pattern);
            MatchResult match = scanner.match();
            System.out.println(match.group());
        }
    }
}
```

上面的代码没有任何输出，因为我们设定了定界符为"2"，所以在匹配正则表达式时，scanner看到的相当于是"11 11 11 11 11"，没有与"121"相匹配的部分，当然也就没有任何输出。

---

## 关于StringTokenizer

在正则表达式和Scanner出现之前，StringTokenizer是分割字符串的唯一方法，这个方法不支持正则表达式，灵活性已经落后了。下面给出基本的使用方法：

```java
        String s = "1, 2, 3, 4, 5";
        StringTokenizer stoke = new StringTokenizer(s, ", ");	// 默认空格为定界符，这里设置为", "
        while(stoke.hasMoreElements())
            System.out.println(stoke.nextElement());
```

```text 输出结果：
1
2
3
4
5
```

