=======================================================
# Network I/O
* -> **`https.request`** is a **network input/ouput** operation and **not a CPU bound** operation
* -> it does **not use the thread pool**
* -> **`Libuv`** instead **`delegates the work`** to the **operating system kernel** and **`whenever possible`**, it will **`poll the kernell`** and see if the request has completed

```js
const https = require("node:https"); // secure version of "http" module

const MAX_CALLS = 1;

const start = Date.now();
for (let i = 0; i < MAX_CALLS; i++) {
    https
        .request("https://www.google.com", (res) => { // make a request to an endpoint
            res.on("data", () => {});
            res.on("end", () => {
                // time taken for the request 
                console.log(`Request ${i + 1}:`, Date.now() - start);
            })
        })
        .end();
}

// when run this, 
// -> the output is "Request 1: 211"; 
// -> it is around 200 to 300 miliseconds

// now run with "MAX_CALLS = 2", 
// -> the output is "Request 1: 193  Request 2: 321" 
// -> it is around 200 to 300 miliseconds

// now run with "MAX_CALLS = 6" which is bigger than the "default thread pool size"
// -> the output is "Request 4: 208  Request 3: 212  Request 1: 213  Request 6: 216  Request 2: 242  Request 5: 311" miiseconds
// -> the average is still 200 to 300 miliseconds

// now run with "MAX_CALLS = 12"
// -> suprisingly, the average is still 200 to 300 miliseconds

// => the "average time" remain the same for 1 or 6 or 8 different requests
// -> normally, the "async method" have to take a larger average time for more than 4 (default thread)
// -> normally, the "async method" have to take a larger average time for more than 8 (cores)

// => although both "crypto.pbkdf2" and "https.request" are asynchronous, but "https.request" method doesn't seem to use the "thread pool"
// => "https.request" doesn't seem to be affected by the number of CPU cores either
```

## Summary
* -> in Nodejs, **`async methods`** are handled by **`libuv`**
* -> they are handled in 2 different ways **Native async mechanism** or **Thread pool** 

========================================================

# Native async mechanism
* -> **whenever possible**, Libuv will use **`native async mechanism in the OS`**, so as to **`avoid blocking the main thread`**
* -> example of this type is **a network I/O operation**
* -> since this is the **`part of the kernel`**, there's **`different mechanism for each OS`**; we have _`epoll for Linux`, `Kqueue for MacOS` and `IO Completion Port on Windows`_

* => replying on _native async mechanism_ **`makes Node scalable`** as the **only limitation is the operating system kernel**

# Thread pool
* -> if there is **`no native async support`** and the task is **file I/O or CPU intensive**, libuv uses the **`thread pool to avoid blocking the main thread`**
* -> although the _thread pool_ **`preserves asynchronicity with respect to Node's main thread`**, it can still become **a bottleneck if all threads are busy**
