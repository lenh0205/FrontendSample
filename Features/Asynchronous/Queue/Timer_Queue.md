# Timer Queue
* -> to **`queue a callback function`** into **a timer queue**, we can use either the **setTimeout** function or the **setInterval** function
* -> actually the **`timer queue`** is technically **not a queue**, it is a **Min Heap** data structure
* _but think it's a queue make process simpler_

```js
// the firt argument is "callback function", the second argument is the "delay"
setTimeout(() => {
    console.log("this is setTimeout 1");
}, 0);
```

## Experiment
* -> callbacks in the **`microtask queues`** are **executed before** callbacks in the **`timer queue`**
```js - queue up tasks in both "microtask queues" and "timer queue"
// callback functions are queued up as soon as each "setTimeout" statement is executed on the "call stack"
setTimeout(() => console.log("this is setTimeout 1"), 0);
setTimeout(() => console.log("this is setTimeout 2"), 0);
setTimeout(() => console.log("this is setTimeout 3"), 0);

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
// ....
// this is setTimeout 1
// this is setTimeout 2
// this is setTimeout 3

// Visualize:
// -> the "call stack" executes all the statements in our code snippet; 
// -> we end up with 3 "callbacks" in the "nextTick queue", 3 "callbacks" in the "Promise queue", 3 "callbacks" in the "timer queue"
// -> there is no further code to execute, control enters the "Event Loop"
// -> here "nextTick queue" get priority, followed by "promise queue", then "followed by "timer queue"

// -> "first callback" from the "nextTick queue" is "dequeue" and executed which logs a message to the "Console"
// -> this is followed by "second callback" which also logs a message
// -> the "second callback" contains an additional call to "process.nextTick" resulting in a new "callback" in the "nextTick queue"
// -> execution continues and the "third callback" is "dequeue" and executed which logs a message 
// -> finally, the newly added callback also is "dequeue" and run on the "call stack" result the fourth log statement in the Console

// now the "nextTick queue" is empty, the "Event Loop" proceeds to the "promise queue"
// -> "first callback" is "dequeue" and executed on the "call stack" printing the message to the console
// -> similar for "second callback", but in addition to the log statement; it also adds a callback to the "nextTick queue" 
// -> next the "third callback" in the "promise queue" is executed resulting in the next log message
// -> at this point the "promise queue" is empty, the "Event Loop" check the "nextTick queue" to see if there're new callbacks
// -> it found one and execute it

// now both the "microtask queue" are empty, "Event Loop" moves on to the "timer queue"
// -> we have 3 "callbacks", each of them are "dequeued" and executed on the "call stack" one by one
// -> this'll print "setTimout 1", "setTimout 2", "setTimout 3"
```

* -> callbacks in **`microtask queues`** are **executed in between the execution** of callbacks in the **`timer queue`**
```js
setTimeout(() => console.log("this is setTimeout 1"), 0);
setTimeout(() => {
    console.log("this is setTimeout 2");
    process.nextTick(() => console.log("this is the inner next tick inside setTimeout"))
, 0});
setTimeout(() => console.log("this is setTimeout 3"), 0);

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
// this is setTimeout 1
// this is setTimeout 2
// this is the inner next tick inside setTimeout
// this is setTimeout 3

// Visualize:
// -> .... callbacks in the "microtask queues" have already been executed

// -> then 3 callbacks are queued up in the "timer queue"
// -> the "first callback" is dequeued and executed on the "call stack" resulting "setTimeout 1" message on the "console"
// -> after "every callback" execution in the "timer queue", the "Event Loop" goes back and check that "microtask queue" is empty; control goes back to the "timer queue"
// -> "Event Loop" proceeds and runs the "second callback" resulting "setTimout 2" message in the console; and also "queue up" a callback function in the "nextTick queue"
// -> after "every callback" execution in the "timer queue", the "Event Loop" goes back and check "microtask queue"
// -> it will check the "nextTick queue" and identify there's a "callback" to be executed; so that "callback" is dequeued and get executed on the "call stack" resulting "inner nextTick" message  
// -> last callback is executed resulting "setTimeout 3" in the console
```

* -> **`Timer queue callbacks`** are executed in **FIFO order** (_First in First out_)
```js
setTimeout(() => console.log("this is setTimeout 1"), 1000);
setTimeout(() => console.log("this is setTimeout 2"), 500);
setTimeout(() => console.log("this is setTimeout 3"), 0);

// Output:
// this is setTimeout 3
// this is setTimeout 2
// this is setTimeout 1
// => the callback with the least delay is the first one to be queued up
```