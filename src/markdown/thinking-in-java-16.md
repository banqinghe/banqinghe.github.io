# 《Java编程思想》读书笔记 —— 第16章 数组

虽然我们都会说Java中“一切都是对象”，但是作者仍然表示Java并不是纯面向对象语言，而原因正是数组这种低级绊脚石。现在的容器功能越来越强大，由于泛型的使用也确保了类型安全，容器唯一落后于数组的地方在于效率，但是只要这里的性能不是我们需要深究的问题，我们完全有理由在编码工作中使用容器代替数组。

这一章介绍的知识点很简单，也是放松一下下吧。

## 数组是第一级对象

为什么说数组是第一级对象？既然有第一级对象，就会有第二级对象。数组本身就是一个对象，而第一级指的就是这个对象。每个数组标示符都是一个引用，第二级对象就是指每个数组标示符指向的对象。

数组的初始化过程刚好说明了有两级对象的存在：

```java
Object[] array = new Object[10];	// 实例化第一级对象
for(int i=0; i<array.length; i++)
    array[i] = new Object[];	// 实例化第二级对象
```

只读的成员**length**是数组对象的一部分，它是数组的大小，而不是实际保存元素的个数。当数组对象还没有初始化时，无法使用**length**。



---



## 多维数组

多维数组也可以使用大括号初始化： 

```java
int[][] a = { {1, 2, 3}, {4, 5, 6}};
```

打印多维数组的数据需要使用**deepToString()**方法，而非toString()。

Java多维数组和C/C++的多维数组很不一样的地方是，Java中数组构成矩阵的每个向量都可以具有任意长度（这被称为**粗糙数组**），下面给出一个创建粗糙数组的例子：

```java
int[][] a = new int[2][];
a[0] = new int[3]; // 矩阵第3行有3个元素
a[1] = new int[4]; // 矩阵第2行有4个元素
```



---



## 数组与泛型

由于Java泛型的擦除特性，数组和泛型一般不能很好地结合。

- 无法实例化具有参数化类型的数组：

  ```java
  // 下面的代码均无法编译
  T[] array = new T[10];
  Peel<Banana>[] peels = new Peel<Banana>[10];
  ```

  这是因为创建数组时，数组必需知道它们所持有的确切类型，以强制确保类型安全，但是擦除会移除参数类型信息。

- 可以参数化数组本身的类型：

  ```java
  public <T> T[] f(T[] arg) {
      return arg;
  }
  ```

我们无法创建持有泛型的数组对象，但是可以创建非泛型数组，然后将其转型：

```java
List<String>[] ls = (List<String>[]) new List[10];	// 但是这里的转型操作会引发warning
ls[0] = new ArrayList<String>();
```

使用泛型是为了类型安全，但是我们却可以让一个`Object`数组引用指向上面的`ls`，从而向其中添加原本泛型所不允许的`ArrayList<Integer>`元素：

```java
Object[] objects = ls;
objects[1] = new ArrayList<Integer>();
```

---

下面依然是一段迷惑的代码，我们试图在类中创建参数类型(T[])的数组，使用的方法是先创建`Object[]`再将其转型为`T[]`，但是我们可以看到创建的这个数组是`String`元素装不进去，`Object`元素也装不进去：

```java ArrayOfGenericType.java
import java.util.Arrays;

public class ArrayOfGenericType<T> {
    T[] array;
    public ArrayOfGenericType(int size) {
        array = (T[])new Object[size];
    }
    public static void main(String[] args) {
        ArrayOfGenericType<String> obj = new ArrayOfGenericType<String>(5);
//        obj.array[0] = "Hello"; // Object数组无法转型成String数组（运行时出错）
//        obj.array[0] = new Object(); // 无法编译
        System.out.println(Arrays.toString(obj.array));
    }
}
```

我自己理解的原因（我觉得还是不靠谱）是，由于`T[]`类型被擦除，所以在内部`array`仍是一个`Object`数组，当我们试图向其中添加`String`元素的时候，**编译器会认为我们想把`Object[]`转型为`String[]`**（为啥？），但是当我们想装入`Object`对象的时候，泛型又会阻止我们，并说只有`String`元素才可以装入。

可以看到泛型数组在这里工作的并不好。泛型往往在类或方法的**边界处**工作的很好，比如方法参数列表处的泛型，但是在类或方法的内部往往就会有很多问题。



**关于包装类的Tips：**（这里的Integer也可以换成其他基本类型的包装类）Integer可以自动装箱拆箱，但是Integer[]不会，int[]和Integer[]之间的转化需要我们自己实现。



---



## Arrays实用功能

### 填充数组 Arrays.fill()

类似于C语言中的`memset()`，基本使用方法有两种：

**1.** 两个参数，将一个数组的所有项都置为某一值：

```java
Arrays.fill(numArray, 0);	// 将数组中的所有项置为0，
```

**2.** 四个参数，将数组中某一区间范围内的项置为某一值：

```java
Arrays.fill(numArray, 3, 5, 0);	// 将[3, 5)项置为0
```

如果填充的是对象数组，那么只是让被填充的每一项都指向同一个对象，例子见下面`System.arraycopy()`方法的说明。

---

### 复制数组 System.arraycopy()

这是Java标准类库中的static方法，比for循环复制数组的效率要高很多。

方法一共有5个参数：

```java
System.arraycopy(a1, 0, a2, 0, 5);
```

依次是指：**源数组、源数组复制起始位置、目标数组、目标数组复制起始位置、复制长度**。

该方法适用于基本类型数组和对象数组，需要注意，复制对象数组的时候只是复制了对象的引用，而不是对对象本身的拷贝，这被称为**浅复制**。下面是一个具体的例子：

```java ArrayCopy.java
import java.util.*;

class Num {
    public int number = 0;
    public String toString() {
        return String.valueOf(number);
    }
}

public class ArrayCopy {
    public static void main(String[] args) {
        Num[] n1 = new Num[4];
        Num[] n2 = new Num[4];
        Arrays.fill(n1, new Num());
        System.arraycopy(n1, 0, n2, 0, n1.length);
        System.out.println("n1 = " + Arrays.toString(n1));
        System.out.println("n2 = " + Arrays.toString(n2));
        System.out.println("-------改变一个引用的指向的内容之后-------");
        n1[0].number = 1;
        System.out.println("n1 = " + Arrays.toString(n1));
        System.out.println("n2 = " + Arrays.toString(n2));
    }
}
```

```text 输出结果：
n1 = [0, 0, 0, 0]
n2 = [0, 0, 0, 0]
-------改变一个引用的指向的内容之后-------
n1 = [1, 1, 1, 1]
n2 = [1, 1, 1, 1]
```

`Arrays.fill()`也是复制引用，所以自始至终，这两个数组里的引用只指向同一个对象实例。

---

### 数组比较 Arrays.equals()

数组的`equals()`方法用于比较两个数组是否相等（`deepEquals()`用于比较多维数组），若两数组中每一对对应元素都相等，则`equals()`方法返回`true`。这一方法也有使用索引的形式，可以使比较更加灵活，但是需要注意索引区间不是左闭右开，而是两边都为闭的。

---

### 数组排序 Arrays.sort()

对于任意的基本类型数组，只需要直接使用`Arrays.sort()`就可以将数组进行升序排序。但是对于对象数组，JVM自己不知道怎么比较数组元素的大小，就需要我们自己去制定元素比较的规则，我们有两种实现这种操作的方式：

**1.** 让需要实现大小比较的类implements **Comparable\<T>**接口，并实现其中的**compareTo()**方法：

```java CompType.java
public class CompType implements Comparable<CompType>{
    int i;
    int j;
    private static int count = 1;
    public CompType(int i, int j) {
        this.i = i;
        this.j = j;
    }
    public String toString() {
        ...
    }
    public int compareTo(CompType rv) {
        return Integer.compare(i, rv.i);
    }
    private static Random r = new Random();
    public static Generator<CompType> generator() {
		...
    }
    public static void main(String[] args) {
        CompType[] a = Generated.array(new CompType[12], generator());
        System.out.println("before sorting:");
        System.out.println(Arrays.toString(a));
        Arrays.sort(a);
        System.out.println("after sorting:");
        System.out.println(Arrays.toString(a));
    }
}
```

上面的例子中我们创建了一个`CompType`数组，为了给这个数组排序，我们就需要让它实现`Comparable`接口，在`compareTo()`方法中，本元素小于传入元素需返回负值，等于返回0，大于范围正值即可。对于数组，最好是使用包装类自带的compare()方法，就像上面代码中的`return Integer.compare(i, rv.i);`，而String和大数类也都提供了`compareTo()`方法，可以直接用于这个方法。



**2.** 当我们无法或者是不愿改动需要在排序中比较大小的类元素的时候，可以创建一个新的类，并让这个类去实现**Comparator\<T>**接口，这个接口中有**compare()**和**equals()**两个方法，往往只需要实现**compare()**这一个方法就足够了。

使用这种方式和使用前一种方式的区别是，使用这种方式需要使用**Arrays.sort()**方法的另一重载版本，第二个参数为一个“比较类”的对象：

```java
class CompTypeComparator implements Comparator<CompType> {
    public int compare(CompType o1, CompType o2) {	//  两个参数，分别是第一个元素的引用和第二个元素的引用
        return Integer.compare(o1.j, o2.j);
    }
}

public class ComparatorTest {
    public static void main(String[] args) {
        CompType[] a = Generated.array(new CompType[12], CompType.generator());
        System.out.println("before sorting:");
        System.out.println(Arrays.toString(a));
        Arrays.sort(a, new CompTypeComparator());	// 第二个参数是比较类的对象
        System.out.println("after sorting:");
        System.out.println(Arrays.toString(a));
    }
}
```

下面两种排序都使用了排序函数的这一重载版本：

- 反向排序：**Arrays.sort(a, Collections.reverseOrder())**
- String忽略大小写排序：**Arrays.sort(sa, String.CASE_INSENSITIVE_ORDER)**



关于该排序方法的性能：

> Java标准类库中的排序算法针对正排序的特殊类型进行了优化——针对基本类型设计的“快速排序”（Quicksort），以及针对对象设计的“稳定归并排序”。所以无须担心排序的性能，除非你可以证明排序部分的确是程序效率的瓶颈。

---

### 二分查找 Arrays.binarySearch()

二分查找只适用于有序数组。参数分别是待查找数组和查找目标：

```java
Arrays.binarySearch(a, 10);
```

如果找到了目标，这个方法会返回目标的索引位置，但是如果目标并不在数组中，则会返回负值。负值的计算公式：

$-(插入点)-1$

插入点：第一个大于查找对象的元素在数组中的位置，如果数组中所有的元素都小于要查找的对象，插入点就等于**a.length**

**ps:** 如果是使用**Comparator**对数组进行排序的，那我们在使用**Arrays.binarySearch()**的时候同样需要提供**Comparator**对象：

```java
Arrays.binarySearch(sa, "hello", String.CASE_INSENSITIVE_ORDER);
```

