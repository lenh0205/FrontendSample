=========================================================================
# "passing props" problem
* -> **`passing props`** is a great way to **explicitly pipe data** through our **`UI tree to the components`** that use it
* -> but passing props can become **`verbose and inconvenient`** when we need to **pass some prop deeply through the tree**, or if **many components need the same prop** - **`prop drilling`** problem

# Context: an alternative to passing props
* -> **`Context`** lets **a parent component provide data to the entire tree below it** 

=========================================================================
# when to use context
* -> context is very tempting to use so this means it’s **too easy to overuse it**
* -> just because we need to **`pass some props several levels deep`** doesn’t mean we should **put that information into context**

## Other approach before consider using "context"
* -> **passing props**
* -> if our **components are not trivial**, it’s **`not unusual to pass a dozen props down through a dozen components`**
* -> it may feel like a slog, but it **`makes it very clear which components use which data`**
* -> the person maintaining our code will be glad we've made **`the data flow explicit with props`**

* -> **Extract components and pass JSX as children to them**
* -> if we **`pass some data through many layers`** of **intermediate components that don’t use that data** (_and only pass it further down_)
* -> this often means that we **forgot to extract some components along the way**
* _For example, maybe we pass data props like posts to `visual components that don’t use them directly`, like <Layout posts={posts} />. Instead, make Layout take children as a prop, and render <Layout><Posts posts={posts} /></Layout>_
* -> this **reduces the number of layers** between **`the component specifying the data and the one that needs it`**

## Use cases for context:
* -> in general, if **some information is needed by distant components in different parts of the tree**, it’s a good indication that **`context will help`** us
* -> _context_ is **`not limited to static values`**
* -> if you **`pass a different value on the next render`**, React will **`update all the components reading it below`**; this is why **context is often used in combination with state**

### Theming: 
* -> if our app **lets the user change its appearance** (e.g. dark mode), we can put a context provider at the top of our app, and **`use that context in components that need to adjust their visual look`**

### Current account:
* -> many **components might need to know the "currently logged in user"**
* -> putting it in context makes it **`convenient to read it anywhere in the tree`**

* -> some apps also let us **`operate multiple accounts at the same time`** (_e.g. to leave a comment as a different user_)
* -> in those cases, it can be convenient to **wrap a part of the UI into a nested provider with a different current account value**

### Routing: 
* -> _most routing solutions_ **use context internally to hold the current route**
* -> this is **`how every link "knows" whether it’s active or not`**; if we build our own router, we might want to do it too

### Managing state: 
* -> as our app grows, we might end up with **a lot of state closer to the top of our app**
* -> many distant components below may **`want to change it`**; it is common to **use a reducer together with context** to **`manage complex state`** and **`pass it down to distant components`** without too much hassle

=========================================================================
# 3 steps of using Context: 

```js
// <Heading/> component that accepts a "level" for its size
// how can the <Heading> component know the "level" of its closest <Section>

<Section level={1}>
  <Heading>Title</Heading>
  <Section level={2}>
    <Heading>Sub-heading</Heading>
    <Heading>Sub-heading</Heading>
    {/* .... */}
  </Section>
</Section>
```

## Step 1: Create the context
* -> **`create the context`** by using **createContext()**; the **only argument to createContext** is **`the default value`**
```js
import { createContext } from 'react';
export const LevelContext = createContext(1);
```

## Step 2: Use the context (from the component that needs the data)
* -> import the **useContext hook** from React and **`our context`**
* -> **`call a hook immediately`** inside a React component (not inside loops or conditions)
* -> _useContext_ tells React that the **`Component wants to read the the Context`**

* -> if we **`don't provide the context`**, **React will use the default value** we're specified when create the context 

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

## Step 3: Provide the context (rom the component that specifies the data)
* -> wrap childrens of parent component with **`a context provider`** to provide the "context" to them
* -> this tell React: if any children component for this "context", give them this value;
* -> the component will **use the value of the nearest context provider** in the UI tree above it

```js
export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

# Using and providing context from the same component
* _cách này thì hơi phức tạp vì nó giống như vòng lặp với số lần lặp là số lần phân cấp của những component cùng kiểu; 1 biến được pass vào 1 component rồi update rồi pass vào 1 component rồi lại được update theo cùng 1 logic , ...._

```js 
// Expect: not need to pass "level" to <Section/> anymore
export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        {/* .... */}
      </Section>
    </Section>
  );
}

// implement
export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```


