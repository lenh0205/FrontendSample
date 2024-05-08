
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
* -> if we have to **`pass some complex data`** and have to **`call many different functions both on the main page and in the Worker`**
* => we can **create a system which groups everything together**

* -> _it is possible to switch the content of each mainpage -> worker and worker -> mainpage message_
* -> _the property names **`queryMethod`**, **`queryMethodListeners`**, **`queryMethodArguments`** can be anything as long as they are consistent in QueryableWorker and the worker_

* First, create reate a **QueryableWorker class** that takes the **`URL of the worker`**, **`a default listener`**, and **`an error handler`**
* => this class is going to **`keep track of a list of listeners`** and help us **`communicate with the worker`**

```js - the main thread
// index.html
...
<script type="text/javascript" src="/main.js"></script>

// main.js 
function QueryableWorker(url, defaultListener, onError) {
  const instance = this;
  const worker = new Worker(url);
  const listeners = {};

  this.defaultListener = defaultListener ?? (() => {});

  if (onError) {
    worker.onerror = onError;
  }

  this.postMessage = (message) => {
    worker.postMessage(message);
  };

  this.terminate = () => {
    worker.terminate();
  };

  // adding/removing listeners:
  this.addListeners = (name, listener) => {
    listeners[name] = listener;
  };
  this.removeListeners = (name) => {
    delete listeners[name];
  };

  // queries if the worker actually has the corresponding methods to do what we want:
  // -> this functions takes at least one argument, the method name we want to query
  // -> then we can pass in the arguments that the method needs
  this.sendQuery = (queryMethod, ...queryMethodArguments) => {
    if (!queryMethod) {
      throw new TypeError(
        "QueryableWorker.sendQuery takes at least one argument",
      );
    }
    worker.postMessage({
      queryMethod,
      queryMethodArguments,
    });
  };

  // -> if the worker has the corresponding methods we queried, it should return the name of the corresponding listener and the arguments it needs, 
  // -> we just need to find it in listeners
  worker.onmessage = (event) => {
    if (
      event.data instanceof Object &&
      Object.hasOwn(event.data, "queryMethodListener") &&
      Object.hasOwn(event.data, "queryMethodArguments")
    ) {
      listeners[event.data.queryMethodListener].apply(
        instance,
        event.data.queryMethodArguments,
      );
    } else {
      this.defaultListener.call(instance, event.data);
    }
  };
}
```

* Example: let the worker handle two simple operations - `getting the difference of two numbers` and `making an alert after three seconds`
```js
// our custom "queryable" worker
const myTask = new QueryableWorker("my_task.js"); // my_task.js (the worker)

// our custom "listeners"
myTask.addListener("printStuff", (result) => {
  document
    .getElementById("firstLink")
    .parentNode.appendChild(
      document.createTextNode(`The difference is ${result}!`),
    );
});

myTask.addListener("doAlert", (time, unit) => {
  alert(`Worker waited for ${time} ${unit} :-)`);
});
```

```js - the worker
// my_task.js 

const queryableFunctions = {
  // example #1: get the difference between two numbers:
  getDifference(minuend, subtrahend) {
    reply("printStuff", minuend - subtrahend);
  },

  // example #2: wait three seconds
  waitSomeTime() {
    setTimeout(() => {
      reply("doAlert", 3, "seconds");
    }, 3000);
  },
};

// system functions

function defaultReply(message) {
  // your default PUBLIC function executed only when main page calls the queryableWorker.postMessage() method directly
  // do something
}

function reply(queryMethodListener, ...queryMethodArguments) {
  if (!queryMethodListener) {
    throw new TypeError("reply - not enough arguments");
  }
  postMessage({
    queryMethodListener,
    queryMethodArguments,
  });
}

onmessage = (event) => {
  if (
    event.data instanceof Object &&
    Object.hasOwn(event.data, "queryMethod") &&
    Object.hasOwn(event.data, "queryMethodArguments")
  ) {
    queryableFunctions[event.data.queryMethod].apply(
      self,
      event.data.queryMethodArguments,
    );
  } else {
    defaultReply(event.data);
  }
};
```

## Passing data by transferring ownership (transferable objects)
* -> modern browsers contain an additional way to **pass certain types of objects** **`to or from a worker with high performance`**
* -> **Transferable objects** are **`transferred from one context to another`** with **a zero-copy operation**, which results in a **vast performance improvement** when **`sending large data sets`**

```js - For example: 
// -> when transferring an "ArrayBuffer" from your main app to a worker script, the original ArrayBuffer is cleared and no longer usable
// -> its content is (quite literally) transferred to the worker context

// Create a 32MB "file" and fill it with consecutive values from 0 to 255 – 32MB = 1024 * 1024 * 32
const uInt8Array = new Uint8Array(1024 * 1024 * 32).map((v, i) => i);
worker.postMessage(uInt8Array.buffer, [uInt8Array.buffer]);
```

=======================================================================
# Embedded "workers" in a web page
* -> there is **not an "official" way** to **`embed the code of a worker`** within a web page 
* -> _like **`<script> elements`** do for **`normal scripts`**_
* -> but a **`<script/> element`** that **`does not have a src attribute`** and has a **`type attribute that does not identify an executable MIME type`** can be considered **a data block element that JavaScript could use**
* => **Data blocks** is a **`more general feature of HTML`** that can **carry almost any textual data**

* => so a worker could be embedded in this way:
* -> the **`embedded worker is nested into a new custom 'document.worker' property`**
* -> 
```html
<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>MDN Example - Embedded worker</title>
    <script type="text/js-worker">
      // This script WON'T be parsed by JS engines because its MIME type is text/js-worker.
      const myVar = 'Hello World!';
      // Rest of your worker code goes here.
    </script>
    <script>
      // This script WILL be parsed by JS engines because its MIME type is text/javascript.
      function pageLog(sMsg) {
        // Use a fragment: browser will only render/reflow once.
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createTextNode(sMsg));
        frag.appendChild(document.createElement("br"));
        document.querySelector("#logDisplay").appendChild(frag);
      }
    </script>
    <script type="text/js-worker">
      // This script WON'T be parsed by JS engines because its MIME type is text/js-worker.
      onmessage = (event) => {
        postMessage(myVar);
      };
      // Rest of your worker code goes here.
    </script>
    <script>
      // This script WILL be parsed by JS engines because its MIME type is text/javascript.

      // In the past blob builder existed, but now we use Blob
      const blob = new Blob(
        Array.prototype.map.call(
          document.querySelectorAll("script[type='text\/js-worker']"),
          (script) => script.textContent,
        ),
        { type: "text/javascript" },
      );

      // Creating a new document.worker property containing all our "text/js-worker" scripts.
      document.worker = new Worker(window.URL.createObjectURL(blob));

      document.worker.onmessage = (event) => {
        pageLog(`Received: ${event.data}`);
      };

      // Start the worker.
      window.onload = () => {
        document.worker.postMessage("");
      };
    </script>
  </head>
  <body>
    <div id="logDisplay"></div>
  </body>
</html>
```

* _we can also convert a function into a Blob, then generate an object URL from that blob_
```js
function fn2workerURL(fn) {
  const blob = new Blob([`(${fn.toString()})()`], { type: "text/javascript" });
  return URL.createObjectURL(blob);
}
```