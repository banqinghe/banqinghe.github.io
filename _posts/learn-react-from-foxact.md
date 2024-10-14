---
title: "从 foxact 中学习 react"
date: "2024-10-14 21:20:42"
---

> foxact 是一个符合 react 哲学的 hook 库，可以通过观察其中的 hook 学习一些 react 最佳实践。
> https://foxact.skk.moe/

## client-only 和 server-only

foxact 中有两个依赖，分别是 `client-only` 和 `server-only` ，这俩 npm lib 在 [next.js 的文档](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#:~:text=a%20Client%20Component.-,To%20use,%2C%20first%20install%20the%20package%3A,-Terminal)中被提及过（在 react.dev 中则没有），用来标识一个 package 是否是 client-only 或 server-only 的。目前看起来 foxact 中的部分 hook 使用了 `client-only` 库，`server-only` 则没有被使用过。

## useAbortableEffect：通过清除副作用避免竞态条件

在 web 开发中竞态条件是一个很普遍的问题，假设这样一种场景：通过分页器更新当前页面数据，使用 `useEffect` 监听当前页数，然后发送请求，更新数据。

```javascript
useEffect(() => {
    fetchData(pageNum).then(data => setData(data));
}, [pageNum])
```

用户如果先点击第二页、然后很快地点击第三页，如果第二页的网络请求结果更慢地返回，第二页的数据就会最终展示给用户，不符预期。

foxact 告诉我应该使用 `useEffect` 清除副作用的能力来避免竞态条件（我之前使用过判断请求对应的时间戳是否最新来避免，但这种方式明显要更符合最佳实践）：

```javascript
useEffect(() => {
    let canceled = false;
    fetchData(pageNum).then(data => {
        if (!canceled) {
            setData(data);
        }
    });
    return () => {
        canceled = true;
    }
}, [pageNum]);
```

`foxact/useAbortableEffect` 通过内置了一个 `AbortController` 来实现与上面相同操作：

```javascript
useAbortableEffect((signal) => {
    fetchData(pageNum).then(data => {
        if (!signal.aborted) {
            setData(data);
        }
    });
}, [pageNum]);
```

## useSingleton：避免重复创建应该是单例的对象

参考这里：[Avoiding recreating the ref contents](https://react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents)

`useRef`、`useState` 的参数会作为初始值，但这并不意味着它们在后续的每一次渲染中不会执行。

```javascript
const [date, setDate] = useState(new Date());
const videoRef = useRef(new VideoPlayer());
```

上面无论是 `Date` 还是 `VideoPlayer` 都会在每一次渲染中创建一个新的实例，即使这些实例并没有被使用到。这无疑带来了一定的无用开销。

`useState` 的参数支持函数，所以改写成这样就能避免这一问题：

```javascript
const [date, setDate] = useState(() => new Date());
```

但是 `useRef` 并不能这么做，官方文档里给出的解决方法是：

```javascript
  const playerRef = useRef(null);
  if (playerRef.current === null) {
      playerRef.current = new VideoPlayer();
  }
```

在渲染过程中读写 ref 是反 react 模式的，但官方的解释是这种写法并不会影响每次渲染的一致性，所以可以接受。

`foxact/useSingleton` 内置了在渲染时判断 ref 是否为空并赋值这一操作，上面的代码变成这样，达到将函数作为 `useState` 参数类似的效果：

```javascript
const playerRef = useSingleton(() => new VideoPlayer());
```

## compositionend 事件的执行时机

我查看了 `useCompositionInput` 的具体实现，发现作者不仅使用了一个 ref 去记录当前是否处于 `compositionstart` 和 `compositionend` 事件之间，还额外使用了一个 ref 去记录 `onChange` 是否被触发了。如果在 `compositionend` 的事件回调中判断到 `onChange` 还未被触发过，就去主动执行 `onChange` 。

这样做的的原因是，在 Chrome v53+ 和 native Apple keyboard（这里我不太明白具体指什么情况）时，`compositionend` 事件会晚于 `input` 事件执行。

所以在当前 Chrome 中，如果没有 `compositionend` 回调中对 `onChange` 的主动调用，callback 会在最后一个 `onChange` 中被阻止掉（因为此时判断是否处于 composition 中的 ref 值还为 true），导致 callback 根本不会执行。

根据作者提供的 [Chromium commit](https://chromium.googlesource.com/chromium/src/+/afce9d93e76f2ff81baaa088a4ea25f67d1a76b3%5E%21/)，Chrome 这么做的理由是符合 web 标准。我查阅了一下具体[标准](https://w3c.github.io/uievents/#event-type-compositionend:~:text=the%20compositionend%20event%20MUST%20be%20dispatched%20after%20the%20control%20is%20updated.)，再回过头来看 Chromium 的这个 commit，发现也挺有道理。标准要求 `compositionend` 事件在**控件被更新后**调用，而 Blink 的 `input` 事件会**更新控件**。

<iframe style="width:100%;height:400px;border:1px solid #e5e7eb" src="https://banqinghe.github.io/pages/use-composition-input/index.html"></iframe>

## useCallback 的使用时机

&#x20;之前我觉得 `useMemo` 和 `useCallback` 在绝大多数情况下都是不需要用到的 React API，在业务开发中不用这些繁琐的优化也不会影响到用户体验。

在工作中我只有一次感到不得不使用它们，场景是我在页面中渲染了一个巨大的表格，不将表格缓存起来会严重影响表格之外的用户交互（现在看起来倒是可以尝试使用 `useDeferredValue` 来避免一部分这个问题）。

foxact 中的 hook 返回的函数都是被 `useCallback` 包裹的，文档中说这样可以使得 hook 返回可以被放心地作为 `useEffect` 等东西的依赖项，很有道理。所以 `useCallback` 除了在需要主动 memo 一些耗性能组件的时候使用，在编写公共 hook 的时候也很有使用的必要，以此来避免不符合预期的行为。

## 及时更新 eslint config

有些 hook 和 `useEffect/useLayoutEffect` 的用法相同，比如前面提到的 `useAbortableEffect`，接收的参数都为 `(callback, deps)`，为了使这些自定义的 hook 也能得到正确的 lint，需要额外配置 eslint：

```json
{
  "rules": {
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        "additionalHooks": "useIsomorphicLayoutEffect"
      }
    ]
  }
}
```

## 关于 \<Suspense>

从 react 文档中 [Preventing already revealed content from hiding](https://react.dev/reference/react/Suspense#preventing-already-revealed-content-from-hiding) 这一节的示例代码中可以看出来如何主动触发 `<Suspense>` loading。

官方文档中 `<Suspense>` 的触发条件有三种：

* Data fetching with Suspense-enabled frameworks like [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) and [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
* Lazy-loading component code with [`lazy`](https://react.dev/reference/react/lazy)
* Reading the value of a Promise with [`use`](https://react.dev/reference/react/use)

第一种需要依赖框架的能力，后两种都可以在客户端渲染的时候实现。在示例代码（https://codesandbox.io/p/sandbox/xcmgz2）中使用了一个自定义的 `use` 函数实现了触发 `Suspense`：

```jsx
export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

这里的 `use` 应该就是 react 19 内置 `use` 的简要实现。

可以观察到， 上文中 `<Suspense>` 触发条件的第三条「Reading the value of a Promise with [`use`](https://react.dev/reference/react/use)」的本质应该是：在 react 渲染函数中 throw 了一个 status 为 pending 的 `Promise`。

Suspense 的一大用处是避免服务端渲染，只要组件在 server 上 throw Error 且被 `Suspense` 包裹，该组件就不会被服务端渲染，服务端只会返回 loading HTML。foxact 中的 `noSSR` 函数是通过这一特性实现的，

> [foxact/src/no-ssr/index.ts at master · SukkaW/foxact](https://github.com/SukkaW/foxact/blob/master/src/no-ssr/index.ts)

核心操作就是在服务端抛出错误：

```typescript
export const noSSR = (extraMessage?: string) => {
  if (typeof window === 'undefined') {
    throw noSSRError(extraMessage);
  }
};
```

## React 中的 useEffectEvent

> 读一下：[Separating Events from Effects – React](https://react.dev/learn/separating-events-from-effects#extracting-non-reactive-logic-out-of-effects)

在写 React 的时候总是会遇到一种场景：我希望在 `useEffect` 中始终能读到一个状态的最新值，但是又不希望将这一状态写进 `useEffect` 的依赖数组里，`useEffectEvent` 可以让我们拥有这种能力。

以文档里的代码举例：

```jsx
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      // 在这里读了 theme，但是并不需要把 onConnected 写进依赖数组里
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}
```

这个 hook 暂时还不能在 react 稳定版本中使用，需要单独安装 experimental 版本。

## useCallback 粗犷的类型

`useCallback` 本身的类型是这样的：

```typescript
useCallback<T extends Function>(callback: T, deps: DependencyList): T
```

改成这样能增强返回参数的类型推导能力（尤其是作为事件 handler 的时候）：

```typescript
useCallback: <Args extends unknown[], R>(
  fn: (...args: Args) => R,
  deps: React.DependencyList
)
```

## 更好地使用 Context

刚开始学 react 并且准备面试的时候就老刷到一个面试题：如何用 React Context 来模拟 Redux（当时 Redux 还几乎是状态管理的唯一选择）。我记得当时我看到的做法是用一个 context 来承载一个 `{value: T, setValue: React.SetStateAction<T>}` 这样的对象。

现在大家终于开始摒弃不好使的 Redux 了，并开始使用 Jotai 这种简单好用的原子化方案。foxact 中的 `createContextState` 函数我觉得是比较符合我自己审美的 React Context 封装：

> [foxact/src/context-state/index.tsx at master · SukkaW/foxact](https://github.com/SukkaW/foxact/blob/master/src/context-state/index.tsx)
