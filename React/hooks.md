> về cơ bản, **`useEffect() dùng để quản lý side effect`**; 
> còn những hook như **`useState, useRef, useCallback dùng để mantain/persist state`** (_giúp state không bị mất giá trị khi component re-render_)

==================================================
https://dev.to/romaintrotard/react-context-performance-5832
https://stackoverflow.com/questions/73599444/reacts-context-api-re-renders-all-components-that-are-wrapped-inside-the-contex

# React-render 
* React uses a process called **reconciliation** to determine which parts of the UI need to be updated (re-render)
* -> compares the current state of the UI to the desired state
* -> only updates the parts of the UI that have changed

* if **state is an object**
* ->  `setState(state)` will not make the component re-render
* ->  `setState(...state)` will make the component re-render

* if pass a prop to a child component using **React.memo**
* the child component will `not re-render` if it not using that `prop` event when the `prop change`

==================================================
# useState
* React recommend to **`split state into multiple state`** variables based on which values tend to **`change together`**
* _tức là những state không liên quan thì maintain riêng, còn state có liên quan thì bỏ vô 1 object rồi matain object đó là được (_nên dùng `useReducer hoặc custom hook` nếu quá complex)_
* -> vì nếu ta setState() 1 object trong khi chỉ update 1 property của nó, thì React sẽ update tất cả React element s/d property của object đó
* -> những hook có [dependecies] thì việc phụ thuộc vào những giá trị cụ thể cũng dễ dàng hơn

===================================================
# useEffect
* -> thường dùng để quản lý **Effect** vì nó khác function bình thường ở chỗ nó có **`clean-up function`**
* -> 1 mình nó có thể làm việc của 3 Life Cycle method: **DidMount**, **DidUpdate**, **WillUnMount**

* => vậy nên ta có thể clear những event; 
* => hoặc với những `pending Promise` có logic tham chiếu đến 1 biến tại lần re-render hiện tại, ta có thể modify biến đó trong clean-up function trước khi lần re-render tiếp theo xảy ra

==================================================
# useReducer:
* Dùng thay thế cho useState
* s/d với **`state transitions complex`** or reply on the **`previous state`**

===================================================
# useCallback & useMemo
* performance matters -> dodge unwanted re-render or recalculations

==================================================
# useRef
* **`persist a value between renders of component`** and **`doesn't cause component to re-render when value changes`**
* -> _ref chỉ đơn giản là 1 object with "current" property và khi ta update "current" property value của nó sẽ đc persist between renders_
* -> **useRef vs useState** - để hiển thị số lần component bị re-render khi ta nhập vào 1 input; ta phải dùng useRef mà không thể dùng useState
```js
// initial:
const renderCount = useRef(1); // -> return an object { current: 1 }

// setter:
useEffect(() => {
    renderCount.current = renderCount.current + 1
}) 
// -> không có [deps] nên mỗi lần component re-render sẽ update "current"
// -> nếu s/d setState để update thì sẽ tạo 1 vòng lặp vô hạn

// getter:
<div>Component have rendered {renderCount.current} times</div>
```

* **common use case**: dùng useRef để reference DOM elements 
* -> the same as using **`document.querySelector`**
```js
const inputRef = useRef();
function focus {
    inputRef.current.focus();
}

<input ref={inputRef}/>
<button onClick={focus}>Focus</button>
```

====================================================
# useCallback
*  to **`not re-create a wrapped function`** when a component re-renders, unless any of the useCallback's dependencies change

* in most situations, **useCallback() is no need** because React kind of smart
* -> can just be moved wrapped function `outside of a component body` and into its own scope
* -> or places it into `useEffect` 

* React guarantees that state setters **setState** have **`stable references`**, so no need to list it as a dependency if callback use `setState` inside
```js
const [count, setCount] = useState(0);

const myFunc = useCallback(e => {
    setCount(a => ++a);
}, []);
// instead of:
const myFunc = useCallback(e => {
    setCount(a => ++a);
}, [setCount]);
```

===================================================
# useContext
* giải quyết vấn đề **`drop drilling`** (_However, there might be a **`performance issue`**_)
* **props** are **`not passed to each and every child`**, just for those who use the context

* React suggest use it to store `global state` that does `not change much` (_Theme, Authentication/Login state, Language/i18n_)
* -> if changed, should trigger a "global" re-render as it'll affect the App, as a whole
* -> do not change that much (or do not change at all) on each App interaction
* -> will be used on different nesting levels

## Performance issue
* in reality, the **Provider** often provides `a big tree object containing many branches and leaves`; However each **Consumer** may only `need a small portion` of it, even a single leaf value on that tree
* -> Even if only `update a single leaf value`, you still need to `update the tree root object’s reference` in order to signal a change
* -> and it will turn notifies **`every single Consumer`** that useContext => re-render even if they don't use the piece of information that changed

* Fundamentally this is a pub-sub model, and if you don’t have a mechanism to allow subs to decide which channel to tune in, the only thing you can do is to broadcast to all subs about everything

```js
// Doing this, you will may encounter some performance issues when parent re-render if you pass an object as value
// "MemoizedComponent" will re-render even it's memoized because the value in the context changes
const MyContext = React.createContext();

function MyProvider({ children }) {
  const [data, setData] = useState(null);
  const onClick = (e) => {
    // Whatever process
  };
  return (
    <MyContext.Provider value={{ data, onClick }}>
      {children}
    </MyContext.Provider>
  );
}

function ComponentUsingContext() {
  const { onClick } = useContext(MyContext);

  return <button onClick={onClick}>Click me</button>;
}
const MemoizedComponent = React.memo(ComponentUsingContext);

function App() {
  const [counter, setCount] = useState(0);
  return (
    <div>
      <button
        onClick={() => setCounter((prev) => prev + 1)}
      >
        Increment counter: counter
      </button>
      <MyProvider>
        <MemoizedComponent />
      </MyProvider>
    </div>
  );
}

// the solution is to memoized the value:
const value = useMemo(() => {
  const onClick = (e) => {
    // Whatever process
  };
  return {
    data,
    onClick,
  };
}, [data]);
// "MemoizedComponent" do not render anymore when incrementing the counter.
```

### Deep dive Performance issue
* It's important to clarify the difference between a **re-render** and a **re-evaluation**
* -> If you have `a state tree in a context`, _every component_ that uses that context will **`re-evaluate`** `every time the context object changes`
* -> but it will only **`re-render`** if the JSX returned from the component has changed since the last render. 

* **Re-evaluation** is generally `not expensive` as long as you are memoizing any complex data transformations that run inside the component body
* -> we'd need to have a _very large and complex component tree_ to start noticing any slowdowns related to component re-evaluation
* -> but it's definitely something to keep an eye on in a customer facing _commercial application_

* **optimizing for performance** 
* -> when and only when we have screen updates that take longer than ~20ms regularly
* -> In practice, your bloated UI framework, CSS-in-JS library, and massively redundant graphql requests are far more likely to cause performance issues than keeping your global state tree in context

```js
const Context = React.createContext<{ foo: string; bar: string }>({ foo: '', bar: '' })

function Foo() {
  const { foo } = React.useContext(Context);
  console.log('rendering Foo');
  return <h1>{foo}</h1>;
}

function Bar() {
  const { bar } = React.useContext(Context);
  console.log('rendering Bar');
  return <h2>{bar}</h2>;
}

function App() {
  const [foo, setFoo] = React.useState('foo');
  const [bar, setBar] = React.useState('bar');
  return (
    <Context.Provider value={{ foo, bar }}>
      <div className="App">
        <Foo />
        <Bar />
      </div>
      <input value={foo} onChange={e => setFoo(e.target.value)} />
      <input value={bar} onChange={e => setBar(e.target.value)} />
    </Context.Provider>
  );
}

// If the user updates the value of the foo input, the console will log "rendering Foo" and "rendering Bar" on every keypress
// But only "Foo" component re-render
```

### Solution
* every one of Consumer should be notified of a change, but it’s not true that all of them should re-render
* only those Consumer which depend on the updated leaf value should re-render
* => **`Solution 1`**: **use-context-selector** bring back the **`selector pattern`** back into our sight

* => **`Solution 2`**: using **react-tracked**

* => **`Solution 3`**: **creating many contexts/Split Context into n context** để xử lý trường hợp phải pass 1 complex object

* => **`Solution 4`**: **Wrap the value provider using React.Memo**: I saw a lot of articles suggesting to the React.Memo API as follows:
```js
<CounterContext.Provider
  value={useMemo(
    () => ({ increment, decrement, counter, hello }),
    [increment, decrement, counter, hello]
    )}
>
  {children}
</CounterContext.Provider>
```

* The requirements for `not having to deal with the performance issues` are:
* -> a global state that does not change so frequently
* -> will be used on different nesting levels

*  don't nest too many components (_for example: Multi-page Forms_) if you create the context at the Route level and not at the App level

## Apply:
* Define a **Context**:
```js
// creation of a context:
const MyContext = React.createContext();
```

* **Provider**:
```js
// "Provider" Usage - right way:
function MyProvider({ children }) {
  const [data, setData] = useState(null);

  return (
    <MyContext.Provider value={{ data, setData }}>
      {children}
    </MyContext.Provider>
  );
}
function App() {
  return (
    <MyProvider>
      <Panel>
        <Title />
        <Content />
      </Panel>
    </MyProvider>
  );
}

// "Provider" Usage - wrong way:
function App() {
  const [data, setData] = useState(null);

  return (
    <MyContext.Provider value={{ data, setData }}>
      <Panel>
        <Title />
        <Content />
      </Panel>
    </MyContext.Provider>
  );
}
// putting directly components in the Provider like this, each time the setData is called, it will render all components Title, Content and Panel even if they do not use the data
```

* **Consumer**: 2 way
```js
// use "Consumer" component provided by the context:
<MyContext.Consumer>
  {(value) => {
    // Render stuff
  }}
</MyContext.Consumer>

// use "useContext" hook:
const myValue = useContext(MyContext);
// or create a custom hook useMyContext not to export the context directly:
const useMyContext = () => {
  const value = useContext(MyContext);
  if (!value) {
    throw new Error(
      "You have to add the Provider to make it work"
    );
  }
  return value;
};
```

* **Nested Provider**: Consumers will get the value of the closest Provider to them
```js
export default function App() {
  return (
    <MyContext.Provider value="parent">
      <ParentSubscriber />
      <MyContext.Provider value="nested">
        <NestedSubscriber />
      </MyContext.Provider>
    </MyContext.Provider>
  );
}
```

## Note:
* do not put all our **Providers** `at the top of your app`
* put **Providers** the `closest to where it's being used`
* => separation of concern; help React to be slightly faster because would not have to cross all the tree components

* nhưng những Provider chứa Global state (I18nProvider, SettingsProvider, UserProvider, ...) nên được đặt `at the top of your application`

## Replacement
* **Redux** creates a **parallel store** from your App and `doesn't pass the values as props` to each and every component
* -> Redux have the same performance problem exists in barebone Redux setup
* -> which is why **`selector pattern`** from **react-redux** used to be very popular

*  **Redux Thunk** allows performing **`requests inside actions`**; `breaking the pure functions concept` in writing actions from Redux

* **React Query**/**TanStack Query**, the **`state related to the requests`** is starting to be handled also as a **`parallel "global state"`** even with **`cache`** and a lot more features
* => dropping the usage of _Redux Thunk_ and _Redux_ as a consequence to `solve the "global state" from requests`
