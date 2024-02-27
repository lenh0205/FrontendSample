# React HOC 
* -> **a higher-order component** is **a function (pure function)** that **`takes a component`** and **`returns a new component`**
* -> _về cơ bản_, ta sẽ định nghĩa `1 function nhận vào 1 component`, `function này sẽ trả về function (hoặc "class") con`; function con này sẽ chịu trách nhiệm render component được nhận vào

```js
// Define HOC:
const myHOC = (WrappedComponent) => {
    return (props) => {
        return <WrappedComponent {...props}/>
    }
}
// Use HOC: 
const EnhancedComponent = myHOC(SomeComponent);

const SomeComponent = ({ propA }) => {
    return <div>{propA}</div>
}

// Usage:
const ComponentA = () => {
    return <EnhancedComponent propA="hello"/>
}
// => we can replace "SomeComponent" with "EnhancedComponent" for higher functionality
```

=======================================================================
# Convention

## Convention: Maximizing Composability
* _về cơ bản, s/d "compose" function để viết chuỗi HOC rõ ràng hơn_
* -> the **compose** **`utility function`** is provided by many third-party libraries including _`lodash, Redux, and Ramda`_

```js - VD: "connect" of "Redux" - the most common signature for HOCs
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);

// for better visualize:
// "connect" is a function that returns /another function/
const enhance = connect(commentListSelector, commentListActions);
// The returned function is a "HOC", which returns a component that is connected to the Redux store
const ConnectedComment = enhance(CommentList);

// => "connect" is a "higher-order function" that returns a "higher-order component"
// => "Single-argument HOCs" returned by the "connect" function have the signature "Component => Component"
// => Functions whose output type is the same as its input type are really easy to "compose" together 
```

```js - Implement "compose" function
const f = (x) => x + 3;
const g = (x) => x - 2;
const h = (x) => x + 1;

// compose(f, g, h) is the same as (...args) => f(g(h(...args)))
const compose = (...funcs) => {
    return (...args) => {
        return funcs?.reverse()?.reduce((acc, curr) => {
            return curr(acc);
        }, ...args)
    }
}
const enhanced = compose(f, g, h);
const result = enhanced(5);

// nếu ta expect "enhanced" là 1 HOC nhận vào 1 Component, tức () => JSX.Element, và trả về 1 Component 
// -> thì f(g(h(...args))) phải trả về () => JSX.Element
// -> nếu ta expect "f" là 1 HOC thì g(h(...args)) phải trả về () => JSX.Element
```

## Convention: Pass Unrelated Props Through to the Wrapped Component
* _về cơ bản là HOC sẽ thêm bớt prop để chỉ truyền những props cần thiết cho Component_
* -> HOCs should pass through **`props that are unrelated to its specific concern`** 
* -> Most HOCs contain a `render` method that looks something like this:
```js
render() {
  // Filter out extra props that are specific to this HOC and shouldn't be passed through
  const { extraProp, ...passThroughProps } = this.props;

  // Inject props into the wrapped component. These are usually state values or instance methods
  const injectedProp = someStateOrInstanceMethod;

  // Pass props to wrapped component
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

## Convention: Wrap the Display Name for Easy Debugging
* -> the **container components** **`created by HOCs`** show up in the **`React Developer Tools`** like any other component
* => ta nên cho nó 1 cái tên để Debug dễ dàng hơn 

* _The most common technique is set **displayName** to **`MyHOC(MyWrappedComponent)`**_

* **"displayName" là 1 Best Practice của React**, used in **`debugging messages`**
* -> **`no need to set it explicitly`** because it’s inferred from the name of the function or class that defines the component (**Component.name**)
* -> **`set it explicitly`** if we want to display **`a different name for debugging`** purposes or when you create **`a higher-order component`**
* -> when bundle React code, the **`name of Component will change`**; so we can set **Component.displayName = specific_Name; export Component;** to find the Error Component in Dev Enviroment that cause error on Production Env

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {
    /* ... */
  }

  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```

===================================================================
# Notice

## Don't Mutate the Original Component:
* _tức là HOC nhận component vô, thay vì **`modify component đó rồi trả về luôn`** thì ta nên trả về 1 **container funtion** (function/class) để render component đó

* **Stop**: temptation to **`modify a component’s prototype`** (or otherwise **`mutate it`**) inside a HOC
* -> `VD`: Modify "ComponentDidUpdate" of "InputComponent"
* => the **`input component cannot be reused separately`** from the enhanced component
* => if we apply another HOC to EnhancedComponent that also mutates componentDidUpdate, the **`first HOC’s functionality will be overridden`**
* => this HOC also **`won’t work with function components`**, which do not have lifecycle methods

```js - wrong way
function logProps(InputComponent) {
  InputComponent.prototype.componentDidUpdate = function(prevProps) {
    console.log('Current props: ', this.props);
    console.log('Previous props: ', prevProps);
  };
  // The fact that we're returning the original input is a hint that it has been mutated.
  return InputComponent;
}

// EnhancedComponent will log whenever props are received
const EnhancedComponent = logProps(InputComponent);
```

```js - right way
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('Current props: ', this.props);
      console.log('Previous props: ', prevProps);
    }
    render() {
      // Wraps the input component in a container, without mutating it. Good!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

## Don’t Use HOCs Inside the render Method
* -> apply a HOC to a component within the render method will cause it **`unmounted when Reconciliation`**
* => the problem here **`isn’t just about performance`** — remounting a component causes the **state of that component and all of its children to be lost**

* **Reason**:
* -> **`React’s diffing algorithm`** - **`Reconciliation`** uses component identity to determine whether it should update the existing subtree or throw it away and mount a new one
* -> if the component returned from render is identical (===) to the component from the previous render, React **`recursively updates the subtree`** by diffing it with the new one
* -> if they’re not equal, the **`previous subtree is unmounted completely`**

* **Solution**: 
* -> apply **`HOCs outside the component definition`** so that the resulting component is created only once
* => its identity will be consistent across renders
* -> **in rare cases** where we need to apply a HOC dynamically, we can also do it **inside a component’s lifecycle methods** or its **constructor**

```js - Don't do this
render() {
  // A new version of EnhancedComponent is created on every render
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // That causes the entire subtree to unmount/remount each time!
  return <EnhancedComponent />;
}
```

## Static Methods Must Be Copied Over
* -> _về cơ bản, đối với Class Component có Static method thì khi ta s/d HOC thì ta cần copy lại Static method đó_
* -> because when we apply a HOC to a component, though, the **`original component is wrapped with a container component`** 
* => means the new component **`does not have any of the static methods`** of the original component

```js - case
// Define a static method
WrappedComponent.staticMethod = function() {/*...*/}
// Now apply a HOC
const EnhancedComponent = enhance(WrappedComponent);

// The enhanced component has no static method
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

```js - solution
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Must know exactly which method(s) to copy :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

* But this requires us to know exactly which methods need to be copied. 
* => so we can use **hoist-non-react-statics** library to **`automatically copy all non-React static methods`**
```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

* Hoặc ta cũng có thể **`export the static method separately`** from the component itself
```js
// Instead of...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...export the method separately...
export { someFunction };

// ...and in the consuming module, import both
import MyComponent, { someFunction } from './MyComponent.js';
```

## Refs Aren’t Passed Through
* -> can't pass refs as a prop to HOC
* -> because ref is not really a prop — like key, it’s handled specially by React
* -> if we add a ref to an element whose component is the result of a HOC, the ref refers to an instance of the outermost container component, not the wrapped component
* => the solution for this problem is to use the **React.forwardRef** API 