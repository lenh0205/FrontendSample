# I/O queue
* -> to **`queue up a callback function`** into I/O queue, there're a number of methods
* -> **`most of async method`** from the **built-in modules** queue the callback function in the **`I/O queue`**

## Experiment
* -> callbacks in the **`microtask queue`** are **executed before** callbacks in the **`I/O queue`**
```js - VD: fs.readFile()
const fs = require("fs");

fs.readFile(__filename, () => { // read the current file contents
    console.log("this is readFile 1");
})

process.nextTick(() => console.log("this is process.nextTick 1"));
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));

// Output:
// this is process.nextTick 1
// this is Promise.resolve 1
// this is readFile 1

// Visualize:
// -> when "call stack" executes all the statements in our code snippet, we end up with 1 callback in the "nextTick queue", 1 in "promise queue", 1 in "I/O queue"
// -> there's no further code to execute, control enter the "Event Loop" 
// -> "nextTick queue" gets top priority, followed by "promise queue", followed by "I/O queue"
// -> firts callbacks from "nextTick queue" is "dequeued" and executed 
// -> now the "nextTick queue" is empty, "Event Loop" proceeds to "promise queue"; the callback is dequeued and executed on "call stack" logging message to console
// -> now "promsie queue" is empty, "Event Loop" proceeds to "timer queue"
// -> since there is "no callbacks in the timer queue", the Event Loop proceed to the "I/O queue"
// -> it have one callback that is dequeued and executed result the message to the console
```

* -> when running **`setTimeout with deplay 0ms`** and **`an I/O async method`**, the **`order of execution`** can **never be guaranteed**
* => this anomaly is because of how **`a minimum delay`** is set for **`timers`**; when we **set the 0ms delay, it will overrides to 1ms delay**
```js
const fs = require("fs");

setTimeout(() => console.log("this is setTimout 1"), 0);

fs.readFile(__filename, () => {
    console.log("this is readFile 1");
})

// Output 1:
// this is readFile 1
// this is setTimout 1

// Output 2:
// this is setTimout 1 
// this is readFile 1

// Visualize:
// -> when we set 0 milisecond delay; at the start of the Event Loop, Nodejs needs to figure out if the "1 milisecond timer" has elapsed or not

// case 1
// -> if Event Loop enter the timer at 0.05 miliseconds, the "1 milisecond callback" "hasn't been queued" and the control moves on to the "I/O queue" executing the "readFile" callback
// -> in the next "iteration" of the Event Loop, the "timer queue" callback will be executed

// case 2
// -> if the CPU is busy and enters the "timer queue" at 1.01 miliseconds, timer would have elapsed and callback function which is queued in the "timer queue" is executed first
// -> the control will then proceed to "I/O queue" and "readFile" callback will be executed

// => we can never guarantee the order of execution between a "0ms timer" and a "I/O callback"
```

* -> I/O queue callbacks is executed after Microtask queues callbacks and Timer
```js - microtask queue, timer queue, I/O queue
const fs = require("fs");

fs.readFile(__filename, () => {
    console.log("this is readFile 1");
})

process.nextTick(() => console.log("this is process.nextTick 1"));
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
setTimeout(() => console.log("this is setTimeout 1"), 0);

// create a loop to ensure that when control enters the "timer queue", the "setTimeout" timer has elapsed and call back is ready to be executed
for (let i = 0; i < 2000000000; i++) {}

// Output:
// this is process.nextTick 1
// this is Promise.resolve 1
// this is setTimeout 1
// this is readFile 1

// Visualize:
// -> the "call stack" executes all the statements, we end up with 1 callback in the "nextTick queue", 1 in "promise queue", 1 in "timer queue", 1 in "I/O queue"
// -> there is no further code to execute and control enters Event Loop
// -> first is callback of "nextTick" is dequeued and executed
// -> "nextTick queue" is empty, Event Loop proceed to "promise queue" ......
// -> "promise queue" is empty, Event Loop proceed to "timer queue" ......
// -> "timer queue" is empty, Event Loop proceed to "I/O queue"
// -> there is 1 callback which is dequeued and executed resulting "readFile" log message in the console
```