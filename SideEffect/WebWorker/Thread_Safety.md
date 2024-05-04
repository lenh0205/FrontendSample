
======================================================================
# Content security policy
* -> **`workers`** are considered to **have their own execution context**, **`distinct from the document that created them`**
* -> for this reason they are, in general, not governed by the **content security policyd** of the **`document (or parent worker) that created them`**
* -> the **`exception`** to this is if the **worker script's origin is a globally unique identifier** (for example, if its URL has a scheme of data or blob)
* -> to **`specify a content security policy for the worker`**, **set a Content-Security-Policy response header** for the **`request which delivered the worker script itself`**

```js - Ex: suppose a document is served with the following header:
Content-Security-Policy: script-src 'self'

// among other things, this will prevent any scripts it includes from using eval()
// => however, if the script constructs a worker, code running in the worker's context will be allowed to use "eval()"
```

======================================================================
# Transferring data to and from workers in details
* -> **`data passed between the main page and workers`** - **message** is **copied, not shared**
* -> **`objects`** are **serialized** as they're handed to the worker, and subsequently, **de-serialized** on the other end
* -> the page and worker **`do not share the same instance`**, so the **`end result is that a duplicate`** is created on each end 
* -> Most browsers implement this feature as **structured cloning**
* _the **`structured cloning algorithm`** can accept **`JSON`** and a few things that JSON can't — like **`circular references`**_

```js
// example.html
const myWorker = new Worker("my_task.js");

myWorker.onmessage = (event) => {
  console.log(`Worker said : ${event.data}`);
};

myWorker.postMessage("ali");

// my_task.js
postMessage("I'm working before postMessage('ali').");

onmessage = (event) => {
  postMessage(`Hi, ${event.data}`);
};
```

```js - simulate the behavior of a value that is cloned and not shared during the passage from a "worker" to the "main page" or vice versa:

function emulateMessage(vVal) {
  return eval(`(${JSON.stringify(vVal)})`);
}

// Tests

// test #1
const example1 = new Number(3);
console.log(typeof example1); // object
console.log(typeof emulateMessage(example1)); // number

// test #2
const example2 = true;
console.log(typeof example2); // boolean
console.log(typeof emulateMessage(example2)); // boolean

// test #3
const example3 = new String("Hello World");
console.log(typeof example3); // object
console.log(typeof emulateMessage(example3)); // string

// test #4
const example4 = {
  name: "Carina Anand",
  age: 43,
};
console.log(typeof example4); // object
console.log(typeof emulateMessage(example4)); // object

// test #5
function Animal(type, age) {
  this.type = type;
  this.age = age;
}
const example5 = new Animal("Cat", 3);
alert(example5.constructor); // Animal
alert(emulateMessage(example5).constructor); // Object
```

## Passing complex data and call many function - create a switching system
* _if we have to pass some complex data and have to call many different functions both on the main page and in the Worker_
* _=> we can create a system which groups everything together_

```js - Example: Advanced passing JSON Data and creating a switching system

```


=======================================================================
# Embedded workers
