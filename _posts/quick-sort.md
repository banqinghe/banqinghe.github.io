---
title: "快排、第 K 大元素"
date: "2022-06-15 17:33:17"
---

## 分治

快速排序和寻找数组中第 K 大/小的元素，核心内容都是进行分支操作，将数据分割成比 `pivot` 元素小和比 `pivot` 元素大的两部分。

下面是升序排列的分治函数，这段代码里依次做了以下的事情：

1. 选取左指针指向的元素作为 `pivot`
2. 右指针从最右端开始向左移动，移动至第一个小于 `pivot` 的元素
3. 将右指针所指的元素移动到左指针指向的位置
4. 左指针从最左端开始向右移动，移动至第一个大于 `pivot` 的元素
5. 将左指针所指的元素移动到右指针指向的位置
6. 重复 2 - 5 直到左右指针相遇
7. 将左右指针相遇的位置赋值为 `pivot`

```ts
const partition = (nums: number[], left: number, right: number) => {
  const pivot = nums[left];
  while (left < right) {
    while (left < right && pivot <= nums[right]) {
      right--;
    }
    nums[left] = nums[right];
    while (left < right && pivot >= nums[left]) {
      left++;
    }
    nums[right] = nums[left];
  }
  nums[left] = pivot;
  return left;
}
```

如果是需要降序排列的结果，只需反转 `pivot` 与 `nums[left|right]` 的比较符号即可。

## 快速排序

递归分治即可：

```ts
const quickSort = (nums: number[]) => {
  const recurse = (left, right) => {
    if (left >= right) {
      return;
    }
    const pivotIndex = partition(left, right);
    recurse(left, pivotIndex - 1);
    recurse(pivotIndex + 1, right);
  }

  recurse(0, nums.length - 1);
  return nums;
}
```

## 第 K 小的数

这里沿用之前的 `partition()` 函数，在分治之后判断 `pivotIndex` 的位置，如果左侧元素数小于 K，则分治右侧元素，反之亦然。

```ts
const findKth = (nums: number[], k: index) => {
  // 第 k 小的索引是 k - 1
  const K = k - 1;

  const recurse = (left, right) => {
    const pivotIndex = partition(left, right);
    if (pivotIndex === K) {
      return nums[pivotIndex];
    } else if (pivotIndex < K) {
      return recurse(pivotIndex + 1, right);
    } else {
      return recurse(left, pivotIndex - 1);
    }
  }

  return recurse(0, nums.length - 1);
}
```
