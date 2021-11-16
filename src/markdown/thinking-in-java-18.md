# 《Java编程思想》读书笔记 —— 第18章 Java I/O系统

本章介绍了Java的I/O系统，主要是基于本地文件的读写，首先说明了`java.io`库的主要用法，也介绍了JDK 1.4引入的`java.nio`类库。在看这本书之前我已经对Java的文件读写知识有了一定的了解，但是并不深刻，这本书把很多细节，如面向字节和面向字符的读写以及它们的互相转化、NIO库的作用和底层原理都讲得很清楚。这一章的最后一些内容我没有深入地做笔记，如文件压缩和对象序列化等内容，我觉得需要的时候查询使用方法就可以了。

## File类

File对象可以指某个特定的文件，也可以指一个目录下的一组文件。常用的做法是使用文件的路径字符串创建File对象。File类的构造函数如下：

| Constructor                         | Description                                                  |
| :---------------------------------- | :----------------------------------------------------------- |
| `File(File parent, String child)`   | Creates a new `File` instance from a parent abstract pathname and a child pathname string. |
| `File(String pathname)`             | Creates a new `File` instance by converting the given pathname string into an abstract pathname. |
| `File(String parent, String child)` | Creates a new `File` instance from a parent pathname string and a child pathname string. |
| `File(URI uri)`                     | Creates a new `File` instance by converting the given `file:` URI into an abstract pathname. |

### 遍历File

File对象中有一个成员方法`list`，这个方法的作用是返回一个子文件/目录名组成的String数组。`list`方法有有参和无参两种形式，无参方法返回所有子文件名组成的数组，有参形式接收一个文件名过滤器对象，即`FilenameFilter`对象，返回一个经过筛选后的文件名数组。

`FilenameFilter`是一个接口，实现该接口需要实现其中的`accept`方法，用于判断文件名是否符合要求。下面的程序展示了该类的一个典型使用方法，用以实现输出所有以`.pdf`为后缀的文件名：

``` java DirList.java
package io;
import java.util.*;
import java.util.regex.*;
import java.io.*;

public class DirList {
    public static void main(String[] args) {
        // 相对路径是相对当前Project
        File path = new File("../../");
        String[] list;
        if (args.length == 0)
            list = path.list();
        else
            list = path.list(new FilenameFilter() {
                // regex: .*\.pdf
                private Pattern pattern = Pattern.compile(args[0]);

                @Override
                public boolean accept(File file, String s) {
                    return pattern.matcher(s).matches();
                }
            });
        Arrays.sort(list, String.CASE_INSENSITIVE_ORDER);
        for (String dirItem : list)
            System.out.println(dirItem);
    }
}
```

```text 运行输出：
JAVA编程思想（第四版）答案.pdf
阿里巴巴Java开发手册（华山版）.pdf
```

另外，File类中有一个与`list`方法类似的方法`listFile`，同样有无参和接受`FilenameFilter`对象两种形式，它和`list`方法的不同之处在于，其返回值是一个File对象组成的数组。

书中给出了一个递归遍历目录树的工具类，见528页。

### File对象中的工具方法

File对象还有很多成员方法，用于对文件进行各种操作（如创建、删除、重命名等）或获取文件属性（文件名，大小，路径，是否可读/可写）。一些常用的方法见下表：

| Modifier and Type | Method                | Description                                                  |
| :---------------- | :-------------------- | :----------------------------------------------------------- |
| `String`          | `getName()`           | Returns the name of the file or directory denoted by this abstract pathname. |
| `String`          | `getParent()`         | Returns the pathname string of this abstract pathname's parent, or `null` if this pathname does not name a parent directory. |
| `String`          | `getPath()`           | Converts this abstract pathname into a pathname string.      |
| `long`            | `length()`            | Returns the length of the file denoted by this abstract pathname. |
| `boolean`         | `isFile()`            | Tests whether the file denoted by this abstract pathname is a normal file. |
| `boolean`         | `isDirectory()`       | Tests whether the file denoted by this abstract pathname is a directory. |
| `boolean`         | `renameTo(File dest)` | Renames the file denoted by this abstract pathname.          |
| `boolean`         | `createNewFile()`     | Atomically creates a new, empty file named by this abstract pathname if and only if a file with this name does not yet exist. |
| `boolean`         | `mkdir()`             | Creates the directory named by this abstract pathname.       |
| `boolean`         | `mkdirs()`            | Creates the directory named by this abstract pathname, including any necessary but nonexistent parent directories. |
| `boolean`         | `delete()`            | Deletes the file or directory denoted by this abstract pathname. |

> **注：** 文档中的“abstract pathname”其实是指File对象。

这列出的也只是一部分，具体见方法见[官方文档](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/File.html)。

这里有一个值得注意的地方是下面四个方法：

| Modifier and Type | Method               | Description                                                  |
| :---------------- | :------------------- | :----------------------------------------------------------- |
| `File`            | `getAbsoluteFile()`  | Returns the absolute form of this abstract pathname.         |
| `File`            | `getCanonicalFile()` | Returns the canonical form of this abstract pathname.        |
| `String`          | `getAbsolutePath()`  | Returns the absolute pathname string of this abstract pathname. |
| `String`          | `getCanonicalPath()` | Returns the canonical pathname string of this abstract pathname. |

`getAbsoluteFile`方法是通过调用`getAbsolutePath()`来创建File对象，同理，`getCanonicalFile()`是通过`getCanonicalPath()`创建的File对象。所以我们现在要讨论的是：`getAbsolutePath()`和`getCanonicalPath()`有何不同？

通过查阅资料得知，这二者得到的均为绝对路径，但是通过`getCanonicalPath()`得到的路径是“规范化”的。何为规范化？一些博客中说规范化的定义是由操作系统本身来决定的，StackOverflow上的[一个回答](https://stackoverflow.com/questions/1099300/whats-the-difference-between-getpath-getabsolutepath-and-getcanonicalpath)给出了例子：

> `C:\temp\file.txt` - This is a path, an absolute path, and a canonical path.
>
> `.\file.txt` - This is a path. It's neither an absolute path nor a canonical path.
>
> `C:\temp\myapp\bin\..\\..\file.txt` - This is a path and an absolute path. It's not a canonical path.

可以看出，规范化的路径其实是绝对路径的一个子集，对于任意一个文件，规范化路径都是**唯一**的。

另一篇博客里提出了三个函数得出的路径的区别：

> 1. `getPath()`返回的是File构造方法里的路径，是什么就是什么，不增不减
>
> 2. `getAbsolutePath()`返回的其实是`user.dir+getPath()`的内容，从上面看：`D:\workspace\java_io\.\src\test.txt`，`D:\workspace\java_io\..\src\test.txt`，可以得出。
>
> 3. `getCanonicalPath()`返回的就是标准的将符号完全解析的路径

---

## 输入和输出

java.io库中的类分为“输入”和“输出”两部分。

输入的基本类为`InputStream`和`Reader`，由这两个类派生而来的类都含有名为`read()`的基本方法。

输出的基本类为`OutputStream`和`Writer`，由这两个类派生而来的类都含有名为`wirter()`的基本方法。

但是我们一般情况下并不会使用这些方法，我们通常通过叠合多个对象来达到需要的目的，这是装饰器模式的一种体现。

### InputStream和OutputStream

这两者从Java 1.0开始出现，是**面向字节**的输出和输出方式。输入的来源可以是字节数组（`ByteArrayInputStream`）、String对象（`StringBufferInputStream`）、文件（`FileInputStream`）、管道（`PipeInputStream`）、由其他种类的流（`SequenceInputStream`）组成的序列、其他数据源。输出的目标可以是字节数组（`ByteArrayOutputStream`）、文件（`FileOutputStream`）、管道（`PipeOutputStream`）。

前面提到的流对象都继承自`InputStream`或`OutputStream`，用以处理不同的数据来源/目标，具体说明见534页。同时，作为“装饰器”的接口的抽象类`FilterInputStream`和`FilterOutputStream`也继承自这二者，它们用以为其他流对象提供不同的功能。

`InputStream`的子类中，常用的装饰器类有两个：

- `DataInputStream`：和`DataOutputStream`配合使用，按照可移植的方式从流中读取基本的数据类型
- `BufferedInputStream`：使用缓冲区，防止每次读取都要进行实际的写操作

上面两种装饰器类的构造器参数均为`InputStream`，其中缓冲器类可以设置缓冲区大小。

`OutputStream`子类中的装饰器类：

- `DataOutputStream`：和`DataInputStream`搭配使用，按照可移植的方式写入基本类型
- `PrintStream`：用于产生格式化的输出
- `BufferedOutputStream`：使用缓冲区

### Reader和Writer

Java 1.0时，设计者限定与输入有关的所有类都继承自`InputStream`，与输出有关的类都继承自`OutputStream`，但是Java 1.1对基本的I/O流类库进行了重大的修改，添加了`Reader`类和`Writer`类，这两个类提供了兼容Unicode与**面向字符**的I/O功能。

为了让面向字节的类和面向字符的类相配合，Java 1.1中向`InputStream`和`OutputStream`的继承层次中添加了两个适配器类：

- `InputStreamReader`：将`InputStream`转化成`Reader`（`FileReader`是它的子类）
- `OutputStreamWriter`：将`OutputStream`转化成`Writer`（`FileWriter`是它的子类）

一般情况下，我们使用`Reader`和`Writer`，在某些特定情况下，比如使用`java.util.zip`库的时候，才使用面向字节的方式。面向字节和面向字符的两种类在继承层次上也很类似，可以查看538页的比较。

需要注意的一点是，面向字符的类也提供了缓冲类`BufferedWriter`和`BufferedReader`，它们是直接继承自`Writer`和`Reader`的，而`BufferedInputStream`却是继承自适配器类。



### I/O流的典型使用方式

#### 面向字符的方式

**1. 文件输入**

使用`new BufferedReader(new FileReader(filename))`的方式，使用`readline()`方法每次读取一行内容。下面程序的作用是显示该Java文件的内容。

```java BufferedInputFile.java
import java.io.*;

public class BufferedInputFile {
    public static String
    read(String filename) {
        try(BufferedReader in =
                    new BufferedReader(new FileReader(filename))) {
            String s;
            StringBuilder sb = new StringBuilder();
            while ((s = in.readLine()) != null)
                sb.append(s).append("\n");
            return sb.toString();
        }
        catch(Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static void main(String[] args) {
        System.out.print(read("./src/io/BufferedInputFile.java"));
    }
}
```

**2. 文件输出**

忽略下面文件的输入方式，只看输出方式：`new PrintWriter(new BufferedWriter(new FileWriter(filename)))`。可以看到，在缓冲器类的外面，我们使用了`PrintWriter`类进行装饰，这样做的目的是便于格式化输出，如果只使用`BufferedWriter`，就只能使用`writer()`方法写入文件，很不方便。

```java BasicFileOutput.java
import java.io.*;

public class BasicFileOutput {
    static String file = "IOTest/BasicFileOutput.out";
    public static void main(String[] args) {
//        try(BufferedReader in = new BufferedReader(
//                new FileReader("src/io/BasicFileOutput.java"));
        try(LineNumberReader in = new LineNumberReader( // 使用LineNumberReader代替BufferedReader
                new FileReader("src/io/BasicFileOutput.java"));
//                new StringReader(
//                        BufferedInputFile.read(
//                                "src/io/BasicFileOutput.java")));
//            BufferedWriter out = new BufferedWriter(new FileWriter(file))) {
            PrintWriter out = new PrintWriter(
                    new BufferedWriter(new FileWriter(file)))) {
//            int lineCount = 1;
            String s;
            while((s = in.readLine()) != null) {
//                out.write(lineCount++ + ": " + s + "\n");
                out.println(in.getLineNumber() + ": " + s);
//                out.println(lineCount++ + ": " + s);
            }
        } catch(IOException e) {
            e.printStackTrace();
        }
        // 如果在try块中使用，对file的写入还没有被关闭，所以无法输出（但是却没有异常）
        System.out.println(BufferedInputFile.read(file));
    }
}
```

在Java 5中引入了`PrintWriter`的快捷方式，`PrintWriter`的构造器参数可以只是文件名，不再需要使用多层包装。

#### 面向字节的方式

下面是一个典型的例子，我们通过在缓冲器类外面加上`DataInputStream`和`DataOutputStream`，可以实现对不同数据类型的写入和读取。不同种类的`write`方法和`read`方法是对应的。

```java StorinAndRecoveringData.java
import java.io.*;

public class StoringAndRecoveringData {
    public static void main(String[] args) {
        try(DataOutputStream out = new DataOutputStream(
                new BufferedOutputStream(
                        new FileOutputStream("IOTest/Data.txt")))) {
            out.writeDouble(3.14159);
            out.writeUTF("That is pi");
            out.writeDouble(1.41413);
            out.writeUTF("Square root of 2");
        } catch(IOException e) {
            e.printStackTrace();
        }

        try(DataInputStream in = new DataInputStream(
                new BufferedInputStream(
                        new FileInputStream("IOTest/Data.txt")))) {
            System.out.println(in.readDouble());
            System.out.println(in.readUTF());
            System.out.println(in.readDouble());
            System.out.println(in.readUTF());
        } catch(IOException e) {
            e.printStackTrace();
        }
    }
}
```

```text 运行输出：
3.14159
That is pi
1.41413
Square root of 2
```

由于其中的数字是以二进制的形式写入，所以用户是无法正常查看的，文件内容为：

```text Data.txt
@	!���n 
That is pi?��F�d�  Square root of 2
```

使用`DataInputStream`和`DataOutputStream`的优势是，在不同的平台上我们都可以正常读写数据，但是前提是我们需要明确地知道数据的结构（避免“用`readUTF`去读`writeInt`写入的数据”这种问题）。

> **关于UTF-8的注意事项**
>
> UTF-8将ASCII字符编码成单一字节的形式，而非ASCII字符则编码成两到三个字节的形式。字符串的长度存储在UTF-8字符串的前两个字节中。
>
> 但是，`writeUTF()`和`readUTF()`的使用是适合于Java的UTF-8变体，并不是标准的UTF-8。非Java程序需要特殊的编码才能正确读取这些字符串。
>
> [Modified UTF-8官方文档](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/DataInput.html#modified-utf-8)

### 读写随机访问文件

 java.io库中提供了一个很特别的类`RandomAccessFile`，它面向字节，但是并不继承自`InputStream`或`OutputStream`，而是一个完全独立的类。利用它的`seek()`方法，我们可以做到在文件中随机访问指定字节，除此之外使用方式和`DataInputStream`和`DataOutputStream`有些类似。

使用示例：

```java UsingRandomAccessFile.java
import java.io.*;

public class UsingRandomAccessFile {
    static String file = "IOTest/rtest.dat";
    static void display() {
        //  第二个参数为mode的选择，"r"表示“只读”，"rw"表示“读写”
        try(RandomAccessFile rf = new RandomAccessFile(file, "r")) {
            for(int i = 0; i < 7; i++)
                System.out.println("Value " + i + ": " + rf.readDouble());
            System.out.println(rf.readUTF());
        } catch(IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        try(RandomAccessFile rf = new RandomAccessFile(file, "rw")) {
            for(int i = 0; i < 7; i++)
                rf.writeDouble(i * 1.414);
            rf.writeUTF("The end of the file");
        } catch(IOException e) {
            e.printStackTrace();
        }

        display();

        try(RandomAccessFile rf = new RandomAccessFile(file, "rw")) {
            rf.seek(5 * 8); // 第40个字节，即5号double的前面
            rf.writeDouble(47.0001);    // 覆盖掉5号double数
        } catch(IOException e) {
            e.printStackTrace();
        }

        display();
    }
}
```

```text 运行输出：
Value 0: 0.0
Value 1: 1.414
Value 2: 2.828
Value 3: 4.242
Value 4: 5.656
Value 5: 7.069999999999999
Value 6: 8.484
The end of the file
Value 0: 0.0
Value 1: 1.414
Value 2: 2.828
Value 3: 4.242
Value 4: 5.656
Value 5: 47.0001
Value 6: 8.484
The end of the file
```

---



## 标准I/O

标准I/O由“标准输入”，“标准输出”，“标准错误”三者构成。Java按照此模型，提供了`System.in`，`System.out`和`System.out`。`System.out`和`System.err`都被包装成了`PrintStream`类型，但是`System.in`则是未被加工的`InputStream`类型，这意味着标准输入在被读入前需要我们手动包装一下。

下面的例子中，我们使用`InputStreamReader`类将`System.in`转换成`Reader`，然后读内容。该程序的作用是读取标准输入，之后用标准输入的方式打印标准输入流中的字符。

```java Echo.java
import java.io.*;

public class Echo {
    public static void main(String[] args) {
        try(BufferedReader stdin = new BufferedReader(
                new InputStreamReader(System.in))) {
            String s;
            while((s = stdin.readLine()) != null && s.length() != 0)
                System.out.println(s.toUpperCase());
        } catch(IOException e) {
            e.printStackTrace();
        }
    }
}
```

我们在Linux操作中经常需要使用重定向这一操作，即更改输出流的目标或是更改输入流的源头。现在Java中也为我们提供了重定向方法。

- `System.setIn(InputStream)`：重定向标准输入流，bash中的`<`
- `System.setOut`：重定向标准输出流，bash中的`>`
- `System.setErr`：重定向标准错误流，bash中的`2>`

下面是一个重定向的使用示例，让标准输入流的源头是`src/io/Redirecting.java`，标准输出流的目标变为`IOTest/text.out`文件：

```java Redirect.java
import java.io.*;

public class Redirecting {
    public static void main(String[] args) {
        PrintStream console = System.out;
        try (BufferedInputStream in = new BufferedInputStream(
                new FileInputStream("src/io/Redirecting.java"));
             PrintStream out = new PrintStream(new BufferedOutputStream(
                     new FileOutputStream("IOTest/test.out")))) {
            System.setIn(in); // 把in作为标准输入
            System.setOut(out);
            System.setErr(out); // 将标准输出流和标准错误流都重定向至out
            // 读取标准输入流并进行标准输出
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(System.in))) {
                String s;
                while ((s = br.readLine()) != null)
                    System.out.println(s);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.setOut(console); // 把标准输出复原
    }
}

```

上述程序的效果等价于bash中的：

```shell
cat src/io/Redirecting.java > IOTest/test.out

```

---



## 进程控制

有时候我们需要在JavaScript中执行其他程序，比如shell命令、其他语言写成的程序，这时候我们就需要用到`Process`类。

在Java中调用其他程序有两种方式：

```	java 第一种方式
Runtime runtime = Runtime.getRuntime();
Process p = runtime.exec(cmd);

```

```java 第二种方式
Process p=new ProcessBuilder(cmd).start();

```

书中使用第二种方式运行程序，`ProcessBuilder`类的构造器接受String数组或String组成的List，使用`start()`方法获取一个`Process`对象。

与`Process`对象交互主要使用下面三种方式，作用可以通过函数名看出来，分别是获取错误流、获取输入流和获取：

| Modifier and Type       | Method              | Description                                                  |
| :---------------------- | ------------------- | ------------------------------------------------------------ |
| `abstract InputStream`  | `getErrorStream()`  | Returns the input stream connected to the error output of the process. |
| `abstract InputStream`  | `getInputStream()`  | Returns the input stream connected to the normal output of the process. |
| `abstract OutputStream` | `getOutputStream()` | Returns the output stream connected to the normal input of the process. |

`Process`的具体说明见[官方文档](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/Process.html)。

下面是一个书中给出的用法示例：

```java OSExecute.java
package io;
import java.io.*;

public class OSExecute {
    public static void command(String command) throws OSExecuteException {
        boolean err = false;
        try {
            Process process =
                    new ProcessBuilder(command.split(" ")).start();
            // 捕获程序执行后的标准输入流
            BufferedReader results = new BufferedReader(
                    new InputStreamReader(process.getInputStream()));
            String s;
            while((s = results.readLine()) != null)
                System.out.println(s);
            // 捕获程序执行后的标准错误流
            BufferedReader errors = new BufferedReader(
                    new InputStreamReader(process.getErrorStream()));
            while((s = errors.readLine()) != null) {
                System.err.println(s);
                err = true;
            }
        } catch(Exception e) {
            throw new RuntimeException(e);
        }
        if(err) {
            throw new OSExecuteException("Error executing " + command);
        }
    }
}

```

其中`OSExceteException`是一个自定义异常，上述代码主要提供了一个工具方法`command`，用以执行命令行并将程序的标准输出和标准错误都输出到控制台。

上面的代码中没有用到`getOutputStream`方法，该方法的作用是向程序写入数据：

```java
OutputStream out = process.getOutputStream();
out.write(("中国"+"\n").getBytes());
```

这个流需要我们手动关闭以完成：

```java
out.flush();
out.close();

```



---



## 新I/O：NIO

JDK 1.4中引入了新的I/O库，即`java.nio`，它的出现是为了提高I/O速度。但是实际上旧的I/O库也已经用新I/O库重新实现过，所以即使我们只使用旧I/O里的类，也能从新I/O中受益。

新I/O之所以能够带来性能上的提高，是因为它所使用的结构更接近操作系统本身执行I/O的方式，即**通道`Channel`和缓冲器`Buffer`**。通道与底层数据相关联，我们使用缓冲器来与通道进行交互。这里需要注意的是，所有的`Buffer`的派生类中中，**只有`ByteBuffer`是能与通道直接交互的**。

旧的I/O库中有三个类被修改了，分别是`FileOutputStream`，`FileInputStream`，`RandomAccessFile`，这些类中添加了`getChannel()`方法，用以产生通道。这种方式是面向字节的，而面向字符的`Reader`和`Writer`则不能用于产生通道，但是我们可以使用`java.nio.channels.Channels`类在通道中产生`Reader`和`Writer`。

`ByteBuffer`的底层结构是一个字节数组，现在我所掌握的向其中存入数据的方式有三种：

- 使用`	ByteBuffer.wrap()`方法，通过传入一个byte数组进行初始化。
- 通过`allocate()`方法分配空间，之后可以通过`put()`方法向其中存入内容。
- 通过`allocate()`方法分配空间，之后通过通道的`read()`方法读入数据。

### 基本使用

下面是使用通道和缓冲器进行操作的一个简单例子：

```java GetChannel.java
package io;
import java.nio.*;
import java.nio.channels.*;
import java.io.*;

public class GetChannel {
    private static final int BSIZE = 1024;
    public static void main(String[] args) throws Exception {
        FileChannel fc =
                new FileOutputStream("IOTest/data.txt").getChannel();
        fc.write(ByteBuffer.wrap("Some text ".getBytes()));
        fc.close();

        fc = new RandomAccessFile("IOTest/data.txt", "rw").getChannel();
        fc.position(fc.size());
        fc.write(ByteBuffer.wrap("Some more".getBytes()));
        fc.close();

        fc = new FileInputStream("IOTest/data.txt").getChannel();
        ByteBuffer buff = ByteBuffer.allocate(BSIZE);
        fc.read(buff); // FileChannel会将内容读取至buff中
        buff.flip(); // limit置为current position，position归零

        while(buff.hasRemaining()) { // 这种方式不支持中文，用decode解码的方式才可以正确输出中文
            System.out.print((char) buff.get());
        }
    }
}

```

```text 运行输出：
Some text Some more

```

上面的代码展示了 三种类产生通道，并使用`ByteBuffer`进行操作，运行过程是`data.txt`中被写入文本，之后读取该文件中的文本并输出至控制台。

上面的代码中用到了一些需要进行一些讲解的方法。首先我们需要了解`Buffer`中的几个属性，即`position`，`limit`，`capacity`，`mark`。在空间刚刚分配的时候，`position`默认为0，`limit`和`capacity`相同，都为分配的空间大小。

一些方法说明：

| Modifier and Type | Method                    | Description                                                  |
| ----------------- | ------------------------- | ------------------------------------------------------------ |
| int               | position()                | 获取当前`position`                                           |
| Buffer            | position(int newPosition) | 设置`position`                                               |
| int               | limit()                   | 获取当前`limit`                                              |
| Buffer            | limit(int newLimit)       | 设置`limit`                                                  |
| int               | remaining()               | 获取`limit-position`                                         |
| boolean           | hasRemaining()            | 判断`limit-position`是否为0                                  |
| Buffer            | mark()                    | 将`mark`置为当前`position`                                   |
| Buffer            | rewind()                  | `position`置为0，取消`mark`                                  |
| Buffer            | reset()                   | 将`position`置为`mark`的值，无`mark`则抛出异常               |
| Buffer            | flip()                    | `limit`置为当前`position`，`position`置为0，取消`mark`       |
| Buffer            | clear()                   | 清空缓存，`position`、`capacity`、`limit`置为初始值，取消`mark` |

我们在操作`Buffer`的时候经常用到上述方法，同时，对于各种`Buffer`，都实现了自己的`get()`和`put()`方法，用于取出或写入内容。带有索引的`get()`和`put()`方法不会改变`position`的值，大部分`get()`和`put()`方法会造成`position`的改动。

现在我们可以完全理解`GetChannel.java`的过程了。首先使用`ByteBuffer.wrap(byte[])`方法来获取`ByteBuffer`对象（这种方法不需要使用`allocate()`方法分配空间）。使用`FileChannel`中的`write()`方法写入字节数据。在读取通道中的数据时，首先为新的`ByteBuffer`分配空间，然后使用`FileChannel`中的`read()`方法向缓冲器中写入数据。然后使用`filp()`方法，将`limit`置为原本的`position`，使用`flip()`方法前后各属性的变化：

```text
使用flip()之前：java.nio.HeapByteBuffer[pos=19 lim=1024 cap=1024]
使用flip()之后：java.nio.HeapByteBuffer[pos=0 lim=19 cap=1024]
```

然后使用`get()`方法获取每一个字节，并将字节转为`char`类型，然后输出。这里需要注意的是，**每`get()`一次，`position`都会增加1**。

我们也会意识到，这种写法是不会支持中文的。当我们使用`getBytes()`方法由String得到字节数组的时候，每个字节都会成为数组中的一项，我们需要使用两个字节才可以表示一个汉字，但是解析的时候我们将每个单独的字节都转型为`char`类型，这样肯定无法得到中文字符。



**文件的复制**

仿照上面的使用方式，我们可以很简单地实现文件复制操作：

```java
FileChannel in = new FileInputStream(args[0]).getChannel(),
	out = new FileOutputStream(args[1]).getChannel();
ByteBuffer buffer = ByteBuffer.allocate(BSIZE);
while(in.read(buffer) != -1) {
    buffer.flip();
    out.write(buffer);
    buffer.clear(); // 清空内容 limit=capacity，position=0
}

```

我们可以使用`transferTo()`或`transferFrom()`方法实现通道与通道的连接，从而更简单地实现文件的复制：

```java
FileChannel in = new FileInputStream("IOTest/test.txt").getChannel();
FileChannel out = new FileOutputStream("IOTest/test3.txt").getChannel();
in.transferTo(0, in.size(), out);
// 或
// out.transferFrom(in, 0, in.size);
```



### 编码问题

`java.nio.CharBuffer`的`toString()`方法会返回一个底层字符组成的字符串，而我们可以用`ByteBuffer`对象的`asCharBuffer()`方法生成一个`CharBuffer`对象，那么

```java
System.out.println(buff.asCharBuffer())
```

这种方式能正常输出我们存入`buff`中的字符串吗，很遗憾，我们无法使用这种方式达到预期的结果。

下面我们会以书中554页的`BufferToText.java`来说明这一问题。

**Method 1：直接尝试输出buff.asCharBuffer()**

```java
// Method 1 Doesn't work
FileChannel fc = new FileOutputStream("IOTest/data2.txt").getChannel();
fc.write(ByteBuffer.wrap("Some text".getBytes()));
fc.close();

fc = new FileInputStream("IOTest/data2.txt").getChannel();
ByteBuffer buff = ByteBuffer.allocate(BSIZE);
fc.read(buff);
buff.flip();

System.out.println(buff.asCharBuffer());
```

```text 运行输出：
卯浥⁴數
```

我们将"Some text"这个文本存入data2.txt这个文件，文件的内容是正常的字符串"Some text"，但是我们读取其内容输出在控制台的却是我们不希望看到的乱码。这里的问题出在`getBytes()`方法上，关于这个函数的无参形式，文档中的描述是：

> Encodes this `String` into a sequence of bytes using the platform's default charset, storing the result into a new byte array.

我的IDEA设置的编码格式为UTF-8，所以`"Some text".getBytes()`得到的字节数组是通过UTF-8编码得到的，每个英文字符会占用一个字节，我们可以输出这个数组验证一下：

```java Method 1
// test1
System.out.println(Arrays.toString("Some text".getBytes())); 
// [83, 111, 109, 101, 32, 116, 101, 120, 116]

// test2
System.out.println(Arrays.toStrig("我Some text".getBytes()));
// [-26, -120, -111, 83, 111, 109, 101, 32, 116, 101, 120, 116]

```

可以看到，每个英文字符会被编码成1个字节，而一个中文字符则会被编码为3个字节。由于Java中的一个char型变量占用2个字节，所以当我们使用`asCharBuffer()`方法的时候，上面的字节数组会被粗暴地两两成对解析，比如大写字母`S`和`o`，16进制表示分别为`0x53`h和`0x6f`，会被认为是字符`0x536f`，在Unicode中对应字符`卯`，因此得到了我们上面看到的结果。

**Method 2：使用UTF-8进行解码**

`buff`和文件均与Method 1中相同。输出的时候加上解码操作：

```java Method 2
 String encoding = System.getProperty("file.encoding"); // 简单，支持中文
        System.out.println("Decode using " + encoding + ": " +
            Charset.forName(encoding).decode(buff)); 
// decode之后返回新的CharBuffer对象，position会变为limit

```

```text 运行输出：
Decode using UTF-8: Some text

```

这一操作与Method 1的不同之处在于，将直接打印`buff.asCharBuffer`换成了打印`Charset.forName(encoding).decode(buff)`。

我们首先使用`System.getProperty("file.encoding")`获得了系统默认编码格式，也就是`getBytes()`的编码格式，然后`Charset.forName(encoding)`会产生一个该编码格式对应的`Charset`对象，`Charset`的成员方法`decode`接受一个`ByteBuffer`返回一个解码后的`CharBuffer`。这一操作实际上是`ByteBuffer.wrap("Some text".getBytes()`的逆过程。

我们可以查看解码后`CharBuffer`底层的数组：

```java
System.out.println(Arrays.toString(Charset.forName(encoding).decode(buff).array()));
// [S, o, m, e,  , t, e, x, t]

```

底层的字节数组应该是:

```text
[0, 83, 0, 111, 0, 109, 0, 101, 0, 32, 0, 116, 0, 101, 0, 120, 0, 116]

```

而不再是buff底层的:

```text
[83, 111, 109, 101, 32, 116, 101, 120, 116]

```

**Method 3：使用UTF-16BE编码写入**

Method 2解决乱码的方法是使用写入时的字符编码解码得到的字节数组，而在Method 3的解决方法中，我们试图在将文件存入数据的解决问题：

```java Method 3
FileChannel fc = new FileOutputStream("IOTest/data2.txt").getChannel();
fc.write(ByteBuffer.wrap("Some text".getBytes(StandardCharsets.UTF_16BE)));
fc.close();

fc = new FileInputStream("IOTest/data2.txt").getChannel();
buff.clear();
fc.read(buff);
buff.flip();
System.out.println(buff.asCharBuffer());

```

```text 运行输出：
Some text

```

在上面的代码中，我们使用了`getBytes()`方法的有参形式`getBytes(Charset)`，该函数会使用我们传入的编码格式进行编码，并返回编码后的数组。`UTF-16BE`的编码方式是每两个字节表示一个字符，并使用大端(Big Endian)的方式存放，这中编码方式刚好迎合了`ByteBuffer`转化为`CharBuffer`的默认过程，因此可以正常地读出数据。但是我们用编辑器去打开数据文件的时候就要专门设置一下打开文本的编码格式，要不然会出现乱码的现象（尤其是使用中文字符的时候）

**Method 4：使用CharBuffer的put()方法**

上面的几种方式都是将字符串转化为字节数组生成`ByteBuffer` 中，然后使用`asCharBuffer()`由`ByteBuffer`生成`CharBuffer`。现在我们改变一下这一操作的顺序，先为调用`ByteBuffer`中的`asCharBuffer()`方法获取`CharBuffer`对象，然后使用`CharBuffer`对象的`put()`方法放入字符串。

```java Method 4
FileChannel fc = new FileOutputStream("IOTest/data2.txt").getChannel();
ByteBuffer buff = ByteBuffer.allocate(24); // 没有使用wrap包装的方式，而是使用put方法存入字符串

buff.asCharBuffer().put("Some text");
fc.write(buff);
fc.close();

fc = new FileInputStream("IOTest/data2.txt").getChannel();
buff.clear();
fc.read(buff);
buff.flip();
System.out.println(buff.asCharBuffer());

```

```text 运行输出：
Some text

```

这样其实和使用`UTF-16BE`格式存入是一样的。



### 视图缓冲器

如果查阅文档，我们会发现`Buffer`有很多派生类，与`ByteBuffer`并列的类还有`CharBuffer`（前面已经使用到了）,`FloatBuffer`，`DoubleBuffer`，`IntBuffer`，`LongBuffer`，`ShortBuffer`，这些类的含义是自解释的，就是用于存放特定数据类型的缓冲器，调用这些类对象的`put()`和`get()`方法，可以放入/取出特定类型的数据。

> 使用`ShortBuffer`的`put()`方法时，需要手动进行数据转化，如`sbuffer.put((short)12345)`

需要注意的是，基本数据类型对象都只能通过`ByteBuffer`对象的`asXXX()`方法得到，且得到的对象虽然`position`，`limit`，`mark`都是独立的 ，但是他们底层都还是原始的字节数组，所以上层缓冲器和下层缓冲器的改动会影响彼此。示意图见559页。

`ByteBuffer`对象中有一系列`getXXX()`方法（无参或索引作为参数）,如`getChar()`，`getInt()`用于取出特定的`char`类型数据和`int`型数据。这和`asCharBuffer().get()`与`asIntBuffer().get()`是等效的。

既然视图缓冲器的每一个单元都是由多个字节组成的，那这里就涉及到一个字节存放顺序的问题。之前学习计算机系统的时候曾经接触过大端存储（big endian）和小端存储（little endian）的概念，在书中大端存储被称为“高位优先”，即高位数据存在地址更小的地方，小端存储被称为低位有限，即低位数据存在地址更小的地方。我自己的电脑时小端存储，但是Java默认的存储方式是大端存储。对于比如数字`97`，在`ByteBuffer`中默认的存储顺序为：`0x00 0x97`，若使用小端存储则存储顺序为：`0x97 0x00`。

我们可以使用`ByteBuffer`对象中的`order(ByteOrder bo)`方法设置存储顺序，下面是一个典型的例子：

```java Endians.java
package io;

import java.nio.*;
import java.util.Arrays;

public class Endians {
    public static void main(String[] args) {
        ByteBuffer bb = ByteBuffer.wrap(new byte[12]); // pos=0
        bb.asCharBuffer().put("abcdef");
        System.out.println(Arrays.toString(bb.array()));
        bb.rewind();

        bb.order(ByteOrder.BIG_ENDIAN); // 默认存储方式，所以输出结果不变
        bb.asCharBuffer().put("abcdef");
        System.out.println(Arrays.toString(bb.array()));
        bb.rewind();

        bb.order(ByteOrder.LITTLE_ENDIAN); // 低位存储在地址较小的位置
        bb.asCharBuffer().put("abcdef");
        System.out.println(Arrays.toString(bb.array()));
    }
}
```

```text 运行输出：
[0, 97, 0, 98, 0, 99, 0, 100, 0, 101, 0, 102]
[0, 97, 0, 98, 0, 99, 0, 100, 0, 101, 0, 102]
[97, 0, 98, 0, 99, 0, 100, 0, 101, 0, 102, 0]

```



### 内存映射

内存映射允许我们将一个大文件的一部分放入内存进行文件内容的读取和修改，并假定整个文件都在内存中，可以把它当作一个很大的数组访问。下面是一个例子：

```java LargeMappedFiles.java
package io;

import java.nio.*;
import java.nio.channels.*;
import java.io.*;

public class LargeMappedFiles {
    static int length = 0x8FFFFFF; // 128MB
    public static void main(String[] args) throws Exception {
        MappedByteBuffer out =
                new RandomAccessFile("IOTest/test.dat", "rw").getChannel()
                .map(FileChannel.MapMode.READ_WRITE, 0, length); // 映射模式，映射文件的初始位置，映射长度
        for (int i = 0; i < length; i++) {
            out.put((byte)'x');
        }
        System.out.println("Finished writing");
        for (int i = length / 2; i < length / 2 + 6; i++) {
            System.out.print((char)out.get(i));
        }
    }
}
```

```text 运行输出：
Finished writing
xxxxxx
```

我们通过调用文件管道的`map()`方法来生成`MappedByteBuffer`对象，该类是`ByteBuffer`的派生类，是一种特殊类型的直接缓冲器。该缓冲器需要我们指定初始位置和映射长度，这意味着我们可以只产生一个文件一部分内容的缓冲器。在上面的程序中，我们首先写入了128MB的字符数据，然后对其中的6个字符进行读取并显示。

这种方式能让我们高效地修改大型文件。并且如果使用“映射文件访问”地方式，即使映射长度和文件大小相同，它依然会比传统的访问方式更加高效。

注意我们只能从`FileInputStream`和`RandomAccessFile`来产生`MappeByteBuffer`，而不包括`FileOutputStream`（向文件中写入数据使用`RandomAccessFile`）



### 文件加锁

锁是操作系统中经常要使用到的一种工具，用所可以保证各个进程运行的正确性不会受到彼此的影响。Java中的文件锁对于操作系统中的其他进程也是可见的，因为Java的文件加锁直接映射到本地操作系统的加锁工具。

下面是一个文件加锁的例子：

```java FileLocking.java
package io;

import java.nio.channels.*;
import java.util.concurrent.*;
import java.io.*;

public class FileLocking {
    public static void main(String[] args) throws Exception {
        FileOutputStream fos = new FileOutputStream("IOTest/file.txt");
        FileLock fl = fos.getChannel().tryLock();
        if (fl != null) {
            System.out.println("Locked File");
            TimeUnit.MILLISECONDS.sleep(100);
            fl.release();
            System.out.println("Release Lock");
        }
        fos.close();
    }
}
```

我们使用`FileChannel`对象的`tryLock()`方法来对文件加锁，并获取一个`FileLock`对象，在进行完我们需要的操作时，使用`release()`方法释放锁。

注意我们可以用`tryLock()`和`lock()`两种方式来获得文件锁，但是二者有差别：

- `tryLock()`是非阻塞式的，它设法获取锁，但是如果不能获得（当其他一些进程已经持有相同的锁，并不共享时），它将直接从方法调用返回。
- `lock()`是阻塞式的，它会阻塞进程直到锁可以获得、或调用`lock()`的线程中断、或调用`lock()`的通道关闭。

我们也可以调用上面两个方法的有参形式，可以为文件一部分加锁，并选择是否为共享锁：

```java
try(long position, long size, boolean shared);
tryLock(long position, long size, boolean shared);
// 初始位置，大小，是否共享
```

Java虚拟机会自动释放锁，或关闭加锁通道。但我们也可以使用`release()`方法显式地关闭锁。



## 后面的内容

这一章后面的内容不是很多，更像是I/O功能的 一些扩展应用，这里不再详细叙述。

**1. 文件压缩**

介绍了`GZIP` 和`ZIP`压缩文件的两种方式，前者较为简单，适用于单文件的压缩，后者可以选择校验方法、对多文件进行压缩。

同时也介绍了Java自身的压缩格式`jar`和使用方式。

**2. 对象序列化**

将对象保存至文件的方法。以便在我们需要的时候从文件中恢复对象。基本过程是，让需要序列化的类实现`Serializable`或`Externalizable`接口，然后使用`ObjectOutputStream`的`writeObjetc()`方法写文件。

`Externalizable`比`Serializable`更加灵活，可以自己控制写入对象的哪些属性，以及如何写入。

**3. XML**

主要是使用类库对XML文件进行操作，书中给出的例子是使用`nu.xml`类库，也可以使用`javax.xml`类库。

**4. Preferences**

用于存储用户偏好等内容，和对象序列化的不同之处在于，`Preferences`不需要我们指定保存信息的文件，而是由操作系统来保存。比如在`Windows`系统中，会使用注册表来保存`Preferences`。