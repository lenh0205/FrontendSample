# Check Queue Experiment
* -> **`check queue callbacks`** are **executed after** **`Microtask queues callbacks, Timer queue callbacks and I/O queue callbacks`** are executed
```js
const fs = require("fs");

fs.readFile(__filename, () => {
    console.log("this is readFile 1");
    setImmediate(() => console.log("this is inner setImmeditate inside readFile"));
})

process.nextTick(() => console.log("this is process.nextTick 1"));
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
setTimeout(() => console.log("this is setTimeout 1"), 0);


for (let i = 0; i < 2000000000; i++) {}

// Output:
// this is process.nextTick 1
// this is Promise.resolve 1
// this is setTimeout 1
// this is readFile 1
// this is inner setImmeditate 1 inside readFile

// Visualize:
// -> when call stack execute all the statements in our code snippet, we end up with 1 callback in "nextTich queue", 1 in "promise queue", 1 in "timer queue"
// -> there is no callback in the "I/O queue" yet as "I/O Polling" has not been completed
// -> when there is no further code to execute, control enter the Event Loop
// -> nextTich queue -> promise queue -> timer queue (the callback is dequeued and executed in the call stack loggin message to console)
// -> now Event Loop proceeds to "I/O queue", this queue doesn't have any callbacks
// -> it then proceed to the "I/O Polling" phase, during this phase the "readFile" operation is completed which pushed a callback function into the "I/O queue"
// -> the Event Loop then proceed to the "check queue" and "close queue", which are both empty
// -> Event Loop then proceeds to the second iteration, it check "nextTich queue", "promise queue", "timer queue" that all of them are empty
// -> finally it come to "I/O queue", it encounter 1 new callback function and execute it logging message to the console
// -> also a call the "setImmediate" which queues up a callback function in the "check queue" 
// -> the Event Loop then proceeds to the "check queue", dequeued the callback in that queue and execute it in "call stack" logging the "inner setImmeditate" message
```

* -> **`Microtask queue callbacks`** are **executed after** **`I/O queue callbacks`** and **before** **`check queue callbacks`**
```js
const fs = require("fs");

fs.readFile(__filename, () => {
    console.log("this is readFile 1");
    setImmediate(() => console.log("this is inner setImmeditate inside readFile"));

    process.nextTick(() => console.log("this is inner process.nextTick inside readFile"));
    Promise.resolve().then(() => console.log("this is innner Promise.resolve inside readFile"))
})

// Output:
// this is readFile 1
// this is inner process.nextTick inside readFile
// this is inner Promise.resolve inside readFile
// this is inner setImmeditate inside readFile

// Visualize:
// First iteration, Event Loop enter "I/O Polling", during this phase the "readFile" operation is completed which pushed a callback function into the "I/O queue"
// in Second iteration, it check "nextTich queue", "promise queue", "timer queue" all of it is empty
// -> then it proceed to "I/O queue" and encourter 1 callback, dequeue - execute - log the message
// -> "readFile" callback also contains a call to "nextTick", "Promise.resolve", "setImmediate", this results in a callback function being queued up in "nextTick", "promise", "check"queue
// -> it so happens that the Event Loop before leaving the "I/O queue" and entering "check queue" makes another check with "microtask queue"
// -> it first check the "nextTick queue" sees there is a callback and runs that callback; next it checks "promise queue" sees there is a callback and runs that callback
// -> finally when the "microtask queue" are empty, the control returns back to the "check queue" 
// -> it dequeue callback function and execute 
```

* -> **`Microtask queue callbacks`** are **executed in between** **`check queue callbacks`**
```js
setImmediate(() => console.log("this is setImmediate 1"));
setImmediate(() => {
    console.log("this is setImmediate 2");
    process.nextTick(() => console.log("this is process.nextTick 1"));
    Promise.resolve(() => console.log("this is Promise.resolve 1"));
})
setImmediate(() => console.log("this is setImmediate 3"));

// Output:
// this is setImmediate 1
// this is setImmediate 2
// this is process.nextTick 1
// this is Promise.resolve 1
// this is setImmediate 3

// Visualize:
// -> when call stack execute all the statement, we end up with 3 "callbacks" in the "check queue"
// -> when there is no further code to execute, control enters the Event Loop
// -> the initial queues are skipped as there are no callbacks
// -> proceed to "check queue"
// -> "first callback" is dequeued and executed resulting in the log statement
// -> next the "second callback" is also dequeued and executed resulting in the log statement
// -> the "second callback" also queues up a callback in the "nextTick queue" and "promise queue"
// -> turns out these queues have very "high priority" and "are checked in between check queue callbacks executions"
// -> so after the second "setImmediate" callback in the "check queue" is executed, the callback in "nextTich queue" is dequeued and executed, followed by "promise queue" callback 
// -> now the "microtask queue" are empty, the control returns back to the "check queue" and "the thid callback" is dequeued and executed 
```

* -> when **`running setTimeout with delay 0ms`** and **`setImmediate method`**, the **`order of execution`** can **never be guaranteed**
```js - timer anomaly with the "check queue"
setTimeout(() => console.log("this is setTimeout 1"), 0)
setImmediate(() => console.log("this is setImmediate 1"));

// Output 1:
// this is setTimeout 1
// this is setImmediate 1

// Output 2:
// this is setImmediate 1
// this is setTimeout 1
```