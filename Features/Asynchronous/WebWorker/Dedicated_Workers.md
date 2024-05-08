
# Dedicated Workers
* a dedicated worker is **only accessible by the script that called it**

## Worker feature detection
* controlled **`error handling`** and **`backwards compatibility`**
```js 
if (window.Worker) {
  // …
}
```

## Spawning a dedicated worker
* call the **Worker** constructor + specifying the **`URI of a script`** to execute in the worker thread
```js - 
const myWorker = new Worker("worker.js"); // 
```

## Sending messages to and from a dedicated worker
* -> **onmessage** và **postmessage** cần được **`truy cập thông qua "Worker" object`** khi dùng trong **`main script thread`**; nhưng khi **`dùng trong "worker" thì không cần`**
* -> vì bên trong 1 worker, thì **'worker' đã là global scope**
* -> when a **`message is passed between the main thread and worker`**, it is **copied or "transferred" (moved), not shared**

*  _to **`send a message`** to the worker, we post messages using **postMessage()**:_
```js
first.onchange = () => {
  myWorker.postMessage([first.value, second.value]);
  console.log("Message posted to worker");
};

second.onchange = () => {
  myWorker.postMessage([first.value, second.value]);
  console.log("Message posted to worker");
};
```

* _v **`in the worker`**, we can respond when the message is received by **onmessage** event handler block_
* -> allows us to **`run some code whenever a message is received`**
* -> with the **`message itself being available`** in the message event's **data** attribute
* -> then use **postMessage()** to post the result back to the main thread
```js
onmessage = (e) => {
  console.log("Message received from main script");
  const workerResult = `Result: ${e.data[0] * e.data[1]}`;
  console.log("Posting message back to main script");
  postMessage(workerResult);
};
```

* _back **`in the main thread`**, we use **onmessage** again, to respond to the message sent back from the worker:_
```js
myWorker.onmessage = (e) => {
  result.textContent = e.data;
  console.log("Message received from worker");
};
```

## Terminating a worker
* to **immediately terminate a running worker** from the **`main thread`**, we call the worker's **terminate()** method:
```js 
myWorker.terminate(); // the worker thread is killed immediately
```

## Handling errors
* _when **`a runtime error occurs in the worker`**, its **onerror** event handler is called
* -> it receives an event named **`error`** which implements the **ErrorEvent** interface
* -> the **`event doesn't bubble and is cancelable`**; to prevent the default action from taking place, the worker can call the error event's **preventDefault()** method

* _3 common-used fields of **`error event`**:_ **message** (_human-readable error message_); **filename** (_the name of the script file in which the error occurred_); **lineno** (_the line number of the script file on which the error occurred_)

## Spawning subworkers
* _workers may **spawn more workers if they wish**, so-called **`sub-workers`**_ 
* -> must be **`hosted within the same origin`** as the **`parent page`**
* -> the **`URIs for subworkers`** are resolved **`relative to the parent worker's location`** rather than that of the owning page
* => this makes it easier for workers to keep track of where their dependencies are

## Importing scripts and libraries
* **`worker threads`** have access to a global function - **importScripts()**, which lets them **`import scripts`** (_it accepts zero or more URIs as parameters to resources to import_)
* -> scripts may be **downloaded in any order**, but will be **executed in the order** in which you **`pass the filenames into importScripts()`**. 
* -> this is done synchronously; importScripts() **`does not return until all the scripts have been loaded and executed`**
* -> if the script can't be loaded, **NETWORK_ERROR is thrown**, and subsequent code will not be executed
* -> **`previously executed code`** (_including code deferred using setTimeout()_) will still be functional though
* -> **`function declarations`** after the importScripts() method are also kept, since these are always evaluated before the rest of the code

```js
importScripts(); /* imports nothing */
importScripts("foo.js"); /* imports just "foo.js" */
importScripts("foo.js", "bar.js"); /* imports two scripts */
importScripts(
  "//example.com/hello.js",
); /* You can import scripts from other origins */
```