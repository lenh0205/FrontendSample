
# State is tied to a position in the render tree
* -> React builds **render trees** for the **`component structure`** in our UI
* -> When we give a component state, we might think the **`state "lives" inside the component ?`**; but **the state is actually held inside React**
* -> React **`associates each piece of state`** it’s holding **`with the correct component`** by where that **component sits in the render tree**
* -> even 2 components is create from the same constructor, they are **separate** because each is **`rendered at its own position in the tree`**

* => in React, **each component on the screen has fully isolated state**
* => React **preserves a component’s state** around for as long as we **`render the same component at the same position in the tree`**
* _if it `gets removed`, or `a different component gets rendered at the same position`, **React discards its state**_

=============================================================================

# Same component at the same position preserves state
* -> all React sees is **the tree we return** 
* -> so even if we unmount this component and mount another component, but we mount at the **`same position with the same component`**; the **state will not reset**

```js
// -> there are two different <Counter /> tags
// -> but when we change the "counter" state then tick and clear the checkbox, the counter state does not get reset
// -> whether isFancy is true or false, we always have a <Counter /> as the "first child of the div" returned from the root App component

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

# Different components at the same position reset state
* -> when switch between **`different component types at the same position`**, React'll **removed the old Component from the UI tree** and **destroyed its state**
* -> also, when we **`render a different component in the same position`**, it **resets the state of its entire subtree** (_if it has_)
* => this is why we **shouldn't nest component function definitions**

```js
// -> the counter state gets reset when we click the checkbox
// -> although we render a "Counter", the first child of the div changes from "a div" to "a section"
// -> so when the child div was removed from the DOM, the whole tree below it (including the Counter and its state) was destroyed as well

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```js - define nest component
// -> every time we click the button, the input state disappears
// -> this is because "a different MyTextField function" is created for "every render of MyComponent"
// => we're rendering a different component in the same position, so React resets all state below
// => this leads to bugs and performance problems

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Clicked {counter} times</button>
    </>
  );
}
```

=============================================================================

# Resetting state at the same position
* -> by default, React **`preserves state of a component while it stays at the same position`**; but sometimes, we may want to reset a component’s state

```js - default
// when we change the player, the score is preserved
// the two "Counters" appear in the same position, so React sees them as the same "Counter" whose "person" prop has changed 

function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}
```

## Option 1: Rendering a component in different positions 
*
```js
// -> initially, isPlayerA is true; so the first position contains Counter state, and the second one is empty
// -> when we click the "Next player" button the first position clears but the second one now contains a Counter
// => each Counter's state gets destroyed each time it’s removed from the DOM
// => state is reset every time we click the button

function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}
```

## Option 2: Resetting state with a key
* -> _more generic way to `reset a component’s state`_
* -> we usually use **keys** when **`rendering lists`**; however `keys` aren’t just for lists
* -> _keys_ help **`React distinguish between any components`**
* -> **`by default`**, React **uses order within the parent** (_VD: "first Counter", "second Counter"_) to **`discern between components`**
*  -> but keys tell React that this is **`not just a component in order`**, but **a specific component - despite wherever it appears in the tree**
* => React to use the key itself as **part of the position**, instead of their **`order within the parent`**
* => so even though we **`render them in the same place in JSX`**, React sees them as two **different component**, and so they will **never share state**

```js
// switching between Taylor and Sarah does not preserve the state
function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

```