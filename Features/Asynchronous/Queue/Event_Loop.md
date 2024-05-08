
# Code Execution in Node.js runtime
```r
// First, we have "V8 Engine"
// -> which executes Javascript code 
// -> comprises of a "Memory Heap" and a "Call Stack"
// => whenever we declare variables or function, memory is allocated on the "Heap"
// => whenever we execute code, functions are pushed into the "Call Stack" and when the function returns it is popped off the call stack - "Last in First out" implement of "Stack" data structure

// Second, we have "Libuv"
// -> whenever we execute an "async method", it is offloaded to Libuv
// => Libuv then run the "task" using "Native async mechanism" of the Operation System; 
// => and if that is not possible, it will ultilize its "thread pool" to run that task - ensuring the "main thread" is not blocked
``` 

```js - "synchronous" code execution
console.log("First");
console.log("Second");
console.log("Third");

// ...runtime is executing it

// the "main thread" of execution always starts in the "global scope"
// so when we call (if we can) the global function - "global()", it get pushed onto the "stack"
// -> line 1 the "console.log("First");" statement is pushed onto the stack; assume this happens at 1 milisecond
// -> "First" is logged to the "Console"; then the function popped off the stack
// -> execute come to line 2 the "console.log("Second");" get pushed onto the stack, assume it takes 2 milisecond
// -> "Second" is logged to the "Console"; then the function popped off the stack
// -> execute come to line 3 the "console.log("Third");" get pushed onto the stack, assume it takes 3 milisecond
// -> "Third" is logged to the "Console"; then the function popped off the stack
// -> there is no more code execute and "global" is also popped off 
```

```js - "asynchronous" code execution in Node.js
console.log("First");
fs.readFile(__filename, () => {
    console.log("Second");
})
console.log("Third");

// ...runtime is executing it

// the "main thread" of execution always starts in the "global scope"
// -> so when we call (if we can) the global function - "global()", it get pushed onto the "stack"

// execute come to line 1 - the "console.log("First");"
// -> assume at 1 milisecond,  statement is pushed onto the "Stack" 
// -> "First" is logged to the "Console"; then the function popped off the stack

// execute come to line 2 
// -> at 2 milisecond, the "readFile" method get pushed onto the "Stack" 
// -> "readFile" is an "async operation" that is offloaded to the "Libuv"
// -> now the "Callback" function is handed over to "Libuv"
// -> javascript then simply "pops off" the readFile method from the "Call Stack", because its job is done as far as execution of line 2 is "concerned"
// -> in the background, "libuv" starts to "read the file contents" on a "seperate thread" 

// at 3 miliseconds, javascript proceed to line 3
// -> it push the ".log" function onto the stack
// -> "Third" is logged to the "Console"; then the function popped off the stack

// now there is no more user-written code in the global scope to execute, so "Call Stack" is empty ("global" still exist)

// at 4 miliseconds, assume the "read file task" is completed in the "thread pool"
// -> the associated callback function is now pushed onto the "Call Stack"
// -> within the "Callback" function, we have the "console.log" statement that is pushed onto the call stack
// -> "Second" is logged to the "Console" and the function is popped off
// -> as there is no more statement to execute in the Callback function, the "Callback" is popped off as well

// no more code to run so the "global" function is also popped off the stack 
```

## Problem
* -> when **an async task completes** in libuv, will Node **`wait for Call Stack to be empty`** or **`interrupt the normal flow of execution`** to run the associated callback on the call stack ?
* -> what happen in **`async method`** like **setTimeout or setInterval** which also delay the execution of a callback function ?
* -> if **`2 async tasks`** (_such as `setTimeout` and `.readFile`_) **complete at the same time**, how does Node decide **`which callback function to run first`** on the call stack ?

* => this is why there is a core part of **`Libuv`** which call **Event Loop**

========================================================

# Libuv's "Event Loop"
* -> **a C program** and is part of **`libuv`**
* -> or a design pattern that **`orchestrates or co-ordinates`** the **`execution`** of **synchronous and asynchronous code** in Node.js

## Visual presentation
* -> _Event Loop_ is **`a loop`** that is **alive as long as our Node.js application is up and running**
* -> in **`every iteration`** of the loop we come across **6 different queues**
* -> **`each queue`** holds one or more callback functions that need to be eventually **executed on the call stack**

* -> the **`timer queue, I/0 queue, check queue, close queue`** are **all part of libuv**; the **`2 microtask queues`** **are not**
* -> nevertheless, there's still **`part of the Node runtime`** that play important role in the **order of execution of callbacks**

## Order in the Iteration
* the **microtask queue** as the **center**
* -> this is actually **`2 seperate queues`** 
* -> the **nextTick queue** - contains **`callbacks`** associated with a function called **process.nextTick** (_specific to Node.js_)
* -> the **promise queue** - contains **`callbacks`** associated with the **native promise** in Javascript

1. First, the **timer queue**
* -> contains **`callbacks`** associated with **setTimeout** and **setInterval**

2. Second, the **I/0 queue**
* -> contains **`callbacks`** associated with all the **async method** that we have seen so far (_VD: async method của "fs"_)

3. Third, the **check queue**
* -> contains **`callbacks`** associated with a function called **setImmediate**
* -> this function is **`specific to Node`**, not javascript on Browser

4. Four, the **close queue**
* -> contains **`callbacks`** associated with the **close event** of **`an async task`**

## Priority order of the queues
* -> all **`user-written asynchronous Javascript code`** **takes priority** over **`asynchronous code`** that **`the runtime`** would like to **`execute`** 
* => means **`only after`** the **call stack is empty**, the **`Event Loop comes`** into picture (_the normal flow of execution will not be interrupted to run a callback function_)

* -> _within the Event Loop_, the **sequence of execution follows certain rules**

### Steps
* _this is the role libuv's Event Loop plays in the execution of async code in Node.js_
* _VD: the `setTimeout (timer callback)` are executed before `.readFile (I/O callback)` event if **both are ready at the exact same time**_

1. **any callbacks in the "micro task queues"** are **`executed`**. **First** **`tasks in the nextTick queue`** and **only then** **`task in the promise queue`**

2. **all callbacks within the "timer queue"** are executed 

3. **any callbacks in the "micro task queues"** are **`executed`**. **First** **`tasks in the nextTick queue`** and **only then** **`task in the promise queue`**

4. **all callbacks within the "I/O queue"** are executed

5. **any callbacks in the "micro task queues"** are **`executed`**. **First** **`tasks in the nextTick queue`** and **only then** **`task in the promise queue`**

6. **all callbacks within the "check queue"** are executed

7. **any callbacks in the "micro task queues"** are **`executed`**. **First** **`tasks in the nextTick queue`** and **only then** **`task in the promise queue`**

8. **all callbacks within the close queue** are executed

9. for the **final time in the same loop**, **`the "micro task queues" are executed`**. nextTick queue followed by promise queue

* => the **nexTick** and **Promise** queues are **`executed in between each queue`** and **`also in`** between **`each callback execution`** in the **timer** and **check** queues
* => if there are **`more callbacks to be processed`**, **the loop is kept alive** for **`one more run`** and the **`same steps are repeated`**
* => on the other hand, if **`all callbacks are executed and there is no more code to process`**, **the event loop exits**

