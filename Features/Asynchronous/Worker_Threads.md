
# "Worker Threads" module
* -> the **`worker_threads`** module enables **the use of threads** that **`execute javascript`** in **`parallel`** 
* -> **`code executed in a worker thread`** runs in **a seperate child process**, **`preventing`** it from **blocking our main application**

## Cluster vs Worker_Threads
* -> the **`cluster module`** can be used to **run multiple instances** of Nodejs that can **`distribute workloads`**
* -> the **`worker_threads module`** allows **running application threads within a single instance** of Nodejs
* -> when **process isolation** is not needed (_that is **no separate instances** of **`V8, Event Loop, Memory`** are needed_), you should use **`worker_threads`**

* like we have see, the **worker_threads** module is kind similar to **Thread Pool**,
* -> it's **`not true multi-threading`** but it lets you **`execute code in parallel`** outside the **`main thread`** 
* -> a good use case for `using woker_threads module` is when we have to **`resize images or videos or even perhaps encrypt files`**

```js
// main-thread.js
const http = require("node:http");
const { Worker } = require("node:worker_threads");

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Home page");
    } else if (req.url === "/slow-page") {
        // create a new "worker thread", passing "path to worker file" as argument
        const worker = new Worker("./worker-thread.js");

        // listen to "messages" in the "main thread" using "message event"
        worker.on("message", (j) => { // data passed back from "worker-thread"
            res.writeHead(200, { "Content-Type": "text/plain" })
            res.end(`Slow Page ${j}`);
        })
    }
});
sever.listen(8000, () => console.log("Server is running on port 8000"))

// worker-thread.js
// -> move the long operation from "main thread" to "worker thread"
const { parentPort } = require("node:worker_threads");

let j = 0;
for (let i = 0; i < 6000000000; i++) { // Simulate CPU work
    j++;
}
// -> we also send a value (of "j" variable) back to the "main thread"
parentPort.postMessage(j);

// now start the server, go to Browser reload "/slow-page" page and quickly reload "/" page
// -> the "/" page take 2 miliseconds (not blocked by "/slow-page" page)
// -> the "/slow-page" page take 5.1 seconds and display "Slow page 6000000000"

// if not using "worker_threads" module, 
// when run "node main-thread.js" than head to Browser:
// -> "/" take 10 miliseconds
// -> "/slow-page" take 5.05 seconds and display "Slow Page 6000000000" to UI
// now reload the "/slow-page" page then quickly reload the "/" page:
// -> "/" page takes 4.7 seconds (being "blocked" while the first request is being served)
// -> "/slow-page" page takes 5.75 seconds
```