# Close Queue
* _last queue in Event Loop_
* -> to **`queue up a callback function`** into **close queue**, we attach **close event listeners** 

## Experiment
* -> **`close queue callbacks`** are **executed after** **`all other queues callbacks`** in **`a given interation`** of the even loop
```js
const fs = require("fs");

const readableStream = fs.createReadStream(__fileName);
readableStream.close(); // "close" the stream

// listen to "close" event which is emmitted when stream is closed (previous line)
// this is how to "queue a callback" function into the "close queue"
// by adding listeners to "close" events
readableStream.on("close", () => { 
    console.log("this is from readableStream close event callback");
})

setImmediate(() => console.log("this is setImmediate 1"));
setTimeout(() => console.log("this is setTimeout 1"), 0);
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
process.nextTick(() => console.log("this is process.nextTick 1"));

// Output:
// this is process.nextTick 1
// this is Promise.resolve 1
// this is setTimeout 1
// this is setImmediate 1
// this is from readableStream close event callback

// Visualize:
// -> when "call stack" executes all the statements, we ends up with 1 callback in each queue exept the I/O queue
// -> when there is no futher code to execute, control enters the Event Loop
// -> nextTick queue -> promise queue -> timer queue -> check queue -> close queue (callback is dequeued and executed)
```