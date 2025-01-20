# Reconciliation

## Target
* -> when using React, at a single point in time we can think of the **`render() function`** as **creating a tree of React elements**
* -> on the **`next state or props update`**, that _render() function_ will **return a different tree of React elements**

* => **`React`** then needs to **figure out how to efficiently update the UI to match the most recent tree**

## Solution
* _React implements a **`heuristic O(n) algorithm`** based on two assumptions:_
* -> **two elements of different types** will **`produce different trees`**
* -> the **developer can hint at which child elements** may be **`stable across different renders`** with a **key** prop

================================================================
# Diffing Algorithm
* -> When **`diffing two trees`**, React first **compares the two root elements**
* -> the behavior is different depending on the **types of the root elements**

## Elements Of Different Types
* whenever the **`root elements have different types`**, React will **tear down the old tree and build the new tree from scratch**
* -> _when `tearing down` a tree_, **`old DOM nodes are destroyed`**; _Component instances_ receive **componentWillUnmount()**
* -> _when `building up a new` tree_, **`new DOM nodes are inserted into the DOM`**; _Component instances_ receive **UNSAFE_componentWillMount()** (_legacy_) and then **componentDidMount()**
* => **`any state`** associated with the old tree is lost; **`any components`** below the root will also get **unmounted** and have their **state destroyed**

```js
// this diffing will destroy the old "Counter" and remount a new on
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

## DOM Elements Of The Same Type
* -> when comparing **`two React DOM elements of the same type`**, React **looks at the attributes** of both; **keeps the same underlying DOM node**, and **only updates the changed attributes**
* -> after handling the DOM node, React then **`recurses on the children`**

```js
<div className="before" title="stuff" />
<div className="after" title="stuff" />
// -> by comparing these two elements, React knows to "only modify the className" on the underlying DOM node.

<div style={{color: 'red', fontWeight: 'bold'}} />
<div style={{color: 'green', fontWeight: 'bold'}} />
// -> when updating style, React also knows to "update only the properties that changed"
// -> React knows to only modify the 'color' style, not the 'fontWeight'
```

## Component Elements Of The Same Type
* -> when **`a component updates`**, **the instance stays the same**, so that **state is maintained across renders**; 
* -> React **`updates`** the **props of the underlying component instance** to **`match the new element`**
* -> and calls **UNSAFE_componentWillReceiveProps()**, **UNSAFE_componentWillUpdate()** and **componentDidUpdate()** on the **`underlying instance`**
* -> next, the **render() method** is called and the **diff algorithm recurses on** the **`previous result and the new result`**

## Recursing On Children
* -> **by default**, when **`recursing on the children of a DOM node`**, React just **iterates over both lists of children at the same time** and **generates a mutation whenever there’s a difference**

```js
// when adding an element at the end of the children, converting between these two trees works well
// React will match the two <li>first</li> trees, match the two <li>second</li> trees, and then insert the <li>third</li> tree
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>

// if we implement it naively, inserting an element at the beginning has worse performance
// React will mutate every child instead of realizing it can keep the <li>Duke</li> and <li>Villanova</li> subtrees intact.
// this converting between these two trees works poorly
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

## Keys
* -> in order to solve the issue above, React supports a **'key' attribute**
* -> **`when children have keys`**, **React uses the key to match children** in the original tree with children in the subsequent tree
* -> **keys** should be **`stable, predictable, and unique`**; _unstable keys_ (like those produced by **Math.random(),...**) will cause many component instances and DOM nodes to be **`unnecessarily recreated`**

```js
// adding a key to the inefficient example above can make the tree conversion efficient
// now React knows that the element with key '2014' is the new one, and the elements with the keys '2015' and '2016' have just moved
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

* -> in practice, finding a key is usually not hard; usually the element we are going to display **may already have a unique ID**, so the key can just **`come from our data`**
* -> when that’s not the case, we can **add a new ID property to our model** or **hash some parts of the content to generate a key**
* -> the key only has to be **unique among its siblings**, **`not globally unique`**

* -> as a last resort, we can **pass an item's index in the array as a key**; this can work well **`if the items are never reordered`**, but **reorders will be slow**
* -> **`reorders`** can also **cause issues with component state** when **`indexes are used as keys`**; 
* -> Component instances are **`updated and reused based on their key`**; if the key is an index, moving an item changes it 
* -> as a result, **`component state`** for things like uncontrolled inputs can get **`mixed up and updated in unexpected ways`**





