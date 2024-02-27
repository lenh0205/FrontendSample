
# The order of execution of asynchronous methods for "microtask queue" in Node.js

## queue up a callback function in each of queues
* _how to add functions into the microtask queues_

### nextTick queue
* to **`queue a callback function`** into the **nextTick queue**
* -> we use a built-in **process.nextTick()** method, it accepts a **`callback`** function
* -> when **`process.nextTick is executed on the call stack`**, the pass in **`callback`** function will be **`on queued in the nextTick queue`**
```js
process.nextTick(() => {
    console.log("this is process.nextTick 1");
})
```

### Promise queue
* to **`queue a callback function`** into the **Promise queue**
* -> there are a few different ways, but we will only focus on **Promise.resolve().then()** with a **`callback`** function
* -> when **`the promise resolve`**, the function passed into then() block will be **`queued up in the promise queue`** 
```js
Promise.resolve().then(() => {
    console.log("this is Promise.resolve 1");
})
```

## Experiment
* -> all **`user written synchronous Javascript code`** **takes priority** over **`async code`** that the **`runtime`** would like to **`eventually execute`**
```js - dealing with the 2 "microtask queue"
console.log("console.log 1");
process.nextTick(() => console.log("this is process.next 1"));
console.log("console.log 2");

// Output:
// console.log 1
// console.log 2
// this is process.next 1
// => 2 "console.log" statements are executed before the callback function passed to process.nextTick

// Process:
// -> first, "console.log 1" is pushed onto the "call stack"; log message to console and then poped off the stack

// -> next, "process.nextTick" is pushed onto the "call stack"
// -> queues up a "callback" function into the "nextTich queue" 
// -> then is poped off

// we still have "user written code" to execute so the "callback" has to wait for its turn

// -> execution moves on and "console.log 2" is pushed to the stack; the message is logged to the "Console" and the function is popped off the "stack"

// now there is no more "user written synchronous code" to executed; and control enters the "Event Loop"
// -> the "callback" from "nextTick" queue is "dequeue"
// -> pushed onto the "stack"
// -> "console.log" pushed onto the "stack"; executed then message is logged to the "Console"
// -> "console.log" popped off the stack; than the "callback" popped off the stack 
```

* -> **`all callbacks in nextTich queue`** are **executed before** **`callbacks in promise queue`**
```js - VD 1:
// queue up a callback function in the "Promise" queue
Promise.resolve().then(() => console.log("this is Promise.resolve 1"))

// queue up a callback in the "nextTick" queue
process.nextTick(() => console.log("this is process.nextTich 1"))

// Output:
// this is process.nextTich 1
// this is Promise.resolve 1
// => the "nextTich" message is logged before the "Promise" message

// Visualize:
// -> when the "call stack" executes Line 1, it will queue the "callback" in the "Promise queue"
// -> when the "call stack" executes Line 2, it will queue the "callback" function in the "nextTich queue" 
// -> after line 2, there is no more "user written code" to execute; the control enters the "Event Loop"
// -> in the Event Loop, "nextTick queue" gets priority over "Promise queue"
// -> the "Event Loop" executes the "nextTick callback function", log the approriate message; popped off the "console.log" than "callback" out of "stack"
// -> then executes the "Promise callback function", log the approriate message; popped off the "console.log" than "callback" out of "stack"
```

```js - VD 2:
process.nextTick(() => console.log("this is process.nextTick 1"));
process.nextTick(() => {
    console.log("this is process.nextTick 2");
    process.nextTick(() => console.log("this is the inner nextTick inside nextTick"));
})
process.nextTick(() => console.log("this is process.nextTick 3"));


Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
Promise.resolve().then(() => {
    console.log("this is Promise.resolve 2");
    process.nextTick(() => console.log("this is the inner nextTick inside Promise then block"))
})
Promise.resolve().then(() => console.log("this is Promise.resolve 3"));

// Output:
// this is process.nextTick 1
// this is process.nextTick 2
// this is process.nextTick 3
// this is the inner nextTick inside nextTick
// this is Promise.resolve 1
// this is Promise.resolve 2
// this is Promise.resolve 3
// this is the inner nextTick inside Promise then block

// Visualize:
// -> when the "call stack" executes all the 6 statements: there're 3 "callbacks in the nextTick queue" and 3 "callbacks in the Promise queue"
// -> there is no further code to execute, control enters the "Event Loop"
// -> the "nextTick queue" gets priority
// -> "first callback" is executed and the "console.log" statment is executed
// -> next, the "second callback function" is executed which logs the second log statement
// -> this time though the callback function contain "process.nextTick", this will queue up the "inner nextTick callback" at "the end of the nextTick queue"
// -> Node than execute the "nextTick 3" callback
// -> the "Event Loop" will push the "inner nextTick callback" and the "console.log" statement are executed

// now the "nextTick queue" is empty, control move on to the "Promise queue"
// -> "promise.resolve 1" is logged, followed by "promise.resolve 2"
// -> there's a call to "process.nextTick" which add a "callback" to the "nextTick queue"
// -> however, the control is still inside "Promise queue" and will continue to execute other "callback" functions in "Promise queue"
// -> "promise.result 3" is logged
// -> at this point the "Promise queue" is empty, Node will one again "check if there are new callbacks in the `microtask queue` 
// -> there is 1 in the "nextTick queue", it will go ahead and execute that and log the "inner nexTick" statement 
```

===========================================================
# process.nextTick
* -> the **`use of process.nextTick`** is **discouraged** as it can cause **`the rest of the Event Loop`** to **starve**
* -> if we endlessly call process.nextTick; the control will never make it past the microtask queue
* -> _even if we were to have a large number of `nextTick` calls, we are effectively starving the **I/O queue** from getting to run its own callbacks_

## 2 main reasons to use "process.nextTick"
* -> allow users to handle errors, cleanup any then unneeded resources, or perharps try the request again before the Event Loop continues
* -> to allow a callback to run after the call stack has unwound but before the Event Loop continues