
# Shared Worker
* -> a shared worker is **accessible by multiple scripts** — even if they are being **`accessed by different windows, iframes or even workers`**
* -> if SharedWorker can be **`accessed from several browsing contexts`**, all those **browsing contexts must share the exact same origin** (_same protocol, host, and port_)

## Spawning a shared worker
```js
const myWorker = new SharedWorker("worker.js");
```

* -> with a shared worker, we have to **communicate via a port object** — an **`explicit port is opened`** that the scripts can use to communicate with the worker (_this is **`done implicitly in the case of dedicated workers`**_)
* -> the **port connection** needs to be started either implicitly by use of the **onmessage** event handler or explicitly with the **start()** method **`before any messages can be posted`**

* -> _l **`calling start()`** is only needed if the message event is wired up via the **`addEventListener() method`**_
* -> when **`using the start() method to open the port connection`**, it needs to be **called from both the parent thread and the worker thread** if **`two-way communication`** is needed

## Sending messages to and from a shared worker
* _the **postMessage()** method has to be invoked through the **`port object`**_
```js
squareNumber.onchange = () => {
  myWorker.port.postMessage([squareNumber.value, squareNumber.value]);
  console.log("Message posted to worker");
};
```

* _,**`in the worker`**_
* -> use an **onconnect** handler to **fire code** when **`a connection to the port happens`** (_i.e. when the onmessage event handler in the parent thread is set up, or when the start() method is explicitly called in the parent thread_)
* -> we use the **`ports`** attribute of this **`event object`** to grab the port and store it in a variable
* -> next, add an **onmessage** handler on the **port** to do the **`calculation and return the result to the main thread`**
* -> **`setting up the onmessage handler in the worker thread`** also **implicitly opens the port connection** back to the **`parent thread`** (_means the call to port.start() is not actually needed, as noted above_)
```js
onconnect = (e) => {
  const port = e.ports[0];

  port.onmessage = (e) => {
    const workerResult = `Result: ${e.data[0] * e.data[1]}`;
    port.postMessage(workerResult);
  };
};
```

* _back **`in the main script`**, we deal with the message_
```js
myWorker.port.onmessage = (e) => {
  result2.textContent = e.data;
  console.log("Message received from worker");
};
```

