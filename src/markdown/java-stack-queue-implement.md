# 栈和队列的实现

之前学习数据结构的时候，是使用C++实现各种数据结构，现在初学Java，所以想尝试用Java语言实现一遍曾经学习过的数据结构。两种语言实现的方式差别并不大，只是把C++里的指针变成了Java中对对象的引用而已。

<br>

## 栈的实现

栈是一种线性数据结构，其特点就是数据只能从它的一端进入和弹出，符合“先进后出”的规则。

在Oracle给出的`JDK 11`的文档中，栈中共有以下几个函数

| Modifier and Type | Method             | Description                                                  |
| :---------------- | :----------------- | :----------------------------------------------------------- |
| `boolean`         | `empty()`          | Tests if this stack is empty.                                |
| `E`               | `peek()`           | Looks at the object at the top of this stack without removing it from the stack. |
| `E`               | `pop()`            | Removes the object at the top of this stack and returns that object as the value of this function. |
| `E`               | `push(E item)`     | Pushes an item onto the top of this stack.                   |
| `int`             | `search(Object o)` | Returns the 1-based position where an object is on this stack. |

分别实现判断是否为空、查看栈顶元素、弹出栈顶元素、压栈和输出指定对象位置的功能。

<br>

在《Java编程思想》的“持有对象”这一章，给出了使用`LinkedList`简单实现栈的代码：

```java
import java.util.LinkedList;

public class Stack<T> {
    private LinkedList<T> storage = new LinkedList<T>();
    public void push(T v) {
        storage.addFirst(v);
    }
    public T peek() {
        return storage.getFirst();
    }
    public T pop() {
        return storage.removeFirst();
    }
    public boolean empty() {
        return storage.isEmpty();
    }
    public String toString() {
        return storage.toString();
    }
}
```

<br>

栈和队列都可以用顺序存储和链式存储来实现，官方的栈是继承与Vector类实现的。本文中使用链式存储实现栈。

首先定义节点Node类，其中的指针域、数据域和构造方法都采用默认的包访问权限：

```java
public class Node<E> {
    Node<E> next;   // 指针域
    E data;     // 数据域
    Node() {}
    Node(Node<E> next, E data) {
        this.next = next;
        this.data = data;
    }
}
```

<br>

然后便是Stack类，实现了文档中给出的几个方法：

```java
public class Stack<E> {
    private Node<E> top;   // 指向栈顶的指针
    private int size;   // 栈的大小
    public boolean empty() {
        return size == 0;
    }
    public E peek() {
        return top.data;
    }
    public E push(E item) {
        Node<E> tempNode = new Node<E>();
        tempNode.data = item;
        tempNode.next = top;
        top = tempNode;
        size++;
        return item;
    }
    public E pop() {
        if(size > 0) {
            E temp = top.data;
            top = top.next;
            size--;
            return temp;
        }
        return null;
    }
    public int search(Object o) {
        int i = 1;
        for(Node<E> cur = top; cur.data != o; cur = cur.next)
            i++;
        if(i == 0) return -1;
        return i;
    }
}
```

<br>

进行测试：

```java
public class Test {
    public static void main(String[] args) {
        Stack<Integer> s = new Stack<Integer>();
        for(int i=0;i<5;i++)
            System.out.print(s.push(i)+" ");
        System.out.println();
        System.out.println(s.search(3));
        while(!s.empty()) {
            System.out.print(s.peek()+" "+s.pop()+" ");
        }
    }
}
// 输出结果：
0 1 2 3 4 
2
4 4 3 3 2 2 1 1 0 0 
```

<br>

---

<br>

## 队列的实现

队列也是一种典型的线性数据结构，数据只能从队尾插入，从队头弹出，符合“先进先出”的规则。

`JDK 11`的文档显示，Queue只是一个接口（interface），如果要使用可以用`LinkedList`向上转型而来，其中需要实现的方法有：

| Modifier and Type | Method       | Description                                                  |
| :---------------- | :----------- | :----------------------------------------------------------- |
| `boolean`         | `add(E e)`   | Inserts the specified element into this queue if it is possible to do so immediately without violating capacity restrictions, returning `true` upon success and throwing an `IllegalStateException` if no space is currently available. |
| `E`               | `element()`  | Retrieves, but does not remove, the head of this queue.      |
| `boolean`         | `offer(E e)` | Inserts the specified element into this queue if it is possible to do so immediately without violating capacity restrictions. |
| `E`               | `peek()`     | Retrieves, but does not remove, the head of this queue, or returns `null` if this queue is empty. |
| `E`               | `poll()`     | Retrieves and removes the head of this queue, or returns `null` if this queue is empty. |
| `E`               | `remove()`   | Retrieves and removes the head of this queue.                |

<br>

节点使用和Stack中相同的节点类，这里只实现了比较基本的功能。Queue类：

```java
package Linear;

public class Queue<E> {
    private Node<E> front, rear;    // 指向队首和队尾的指针
    private int size;   // 队列的大小
    public boolean empty() {
        return size == 0;
    }
    public E peek() {   // 返回队首数据
        return front.data;
    }
    public void offer(E e) {    // 在队尾添加元素
        Node<E> tempNode = new Node<E>();
        tempNode.data = e;
        if(size == 0) { // 队列为空的情况
            front = rear = tempNode;
        }
        else {
            rear.next = tempNode;
            rear = tempNode;
        }
        size++;
    }
    public E poll() {
        if(size > 0) {
            E temp = front.data;
            if(front == rear) { // 只有一个元素的情况
                front = rear = null;
            }
            else {
                front = front.next;
            }
            size--;
            return temp;
        }
        return null;
    }
}
```

测试：

```java
package Linear;

public class Test {
    public static void main(String[] args) {
        Queue<Integer> q = new Queue<Integer>();
        for(int i=0;i<5;i++)
            q.offer(i);
        while(!q.empty()) {
            System.out.print(q.peek()+" "+q.poll()+" ");
        }
    }
}
//  输出结果：
0 0 1 1 2 2 3 3 4 4
```



