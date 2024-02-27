
# check queue
* -> to **`queue up a callback function`** into the **check queue**, we can use a function called **setImmediate**
```js
setImmediate(() => {
    console.log("this is setImmeditate 1");
})
```
======================================================
# I/O Polling
* -> _happens between I/O queue and check queue_
* -> **I/O events are polled** and callback functions are **`added to the I/O queue`** **only after** the **`I/O is complete`**
```js
const fs = require("fs");

fs.readFile(__filename, () => {
    console.log("this is readFile 1");
})

process.nextTick(() => console.log("this is process.nextTick 1"));
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
setTimeout(() => console.log("this is setTimeout 1"), 0);

setImmediate(() => console.log("this is setImmeditate 1"));

for (let i = 0; i < 2000000000; i++) {}

// Output:
// this is process.nextTick 1
// this is Promise.resolve 1
// this is setTimeout 1
// this is setImmeditate 1
// this is readFile 1
// => normally "I/O queue" is before "check queue", this is strange
// => this is because of the "I/O Polling" between the 2 queues

// Visualize:
// -> all the 5 statements are executed on the "Call Stack"
// -> this will result on callbacks being queued up in the approriate queues; 1 in "nextTick queue", 1 in "promise queue", 1 in "timer queue", 1 in "I/O queue", 1 in "check queue"
// -> exept that the "readFile callback" is not queued up at the same time

// -> when the control enters the Event Loop, the microtask queues are first check for callbacks, one each in the "nextTick queue" and "promise queue", ...
// -> the queue is empty, control move to "timer queue"; one callback which logs "setTimeout 1" to console

// when the control reaches the "I/O queue", we expect "readFile" callback to be present
// -> we have a really long "for" loop, so "read file" should have completed by the time control enters the Event Loop
// -> reality, the Event Loop have to "Poll" to check if "I/O operations" are "completed" and queue up "only the completed operation callbacks"
// -> which means when control enters the "I/O queue" for the first time, it is still empty 
// -> since it is empty, control then proceeds to the "Polling part" of the Event Loop where it asks "readFile" if it has completed
// -> "readFile" says Yes, the Event Loop now queues up the associated callback function "I/O queue"
// -> however, execution is past the "I/O queue" and the callback has to wait for its turn 
// -> control then proceed to the "check queue", it finds 1 callback and log "setImmediate 1" to the console
// -> there is nothing more the current iteration and the Event Loop start a new iteration
// -> it sees the "microtask queue" and "timer queue" is empty, the "I/O queue" now has a callback that get executed and "readFile 1" is logged to the console  
```