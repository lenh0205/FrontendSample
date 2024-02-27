# Problem
* -> **`Node is single thread`** - no matter how many cores you have, node **only uses a single core of our CPU**
* -> this is **`fine for I/O operations`** but if the code has **long running** and **CPU intensive operations**, our application might **`struggle from a performance point of view`**

* => to solve this, Nodejs introduced the **Cluster module**

```js - if not using "cluster"
// simple HTTP server 
const http = require("node:http");

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Home page");
    } else if (req.url === "/slow-page") {
        for (let i = 0; i < 6000000000; i++) {} // Simulate CPU work

        res.writeHead(200, { "Content-Type": "text/plain" })
        res.end("Slow Page");
    }
});

sever.listen(8000, () => console.log("Server is running on port 8000"))

// Khi ta load lần lượt từng trang,
// -> load "/" page mất 3 milisecond
// -> load "/slow-page" page mất 4.72 second
// => "/slow-page" page có thời gian load lâu hơn "/"; đây là tất nhiên vì nó phải chạy 1 long running loop 

// Nhưng vấn đề là nếu ta load "/slow-page" trước, rồi trong lúc nó load ta nhanh chóng load "/" page   
// -> "/slow-page" page mất 5.73 seconds
// -> "/" page cũng mất 4.9 seconds
// => chênh lệch 0.8s là thời gian mà ta chuyển tab và bấm nút refresh page "/" (chứ thực sự 2 trang tốn thời gian như nhau)
// => nhưng vấn đề chính là "/" page đáng lẽ chỉ tốn < 5ms bây giờ lại mất 5s

// => Reason: "single thread" of Nodejs is "blocked" by the for loop and the server won' be able to respond to any new requests
// => Solution: fix this with "cluster module"
```

=======================================================
# Cluster module
* -> the _cluster module_ enables the **`creation`** of **child processes** (also called **workers**) that run **`simultaneously`**
* -> **`all created workers`** **share the same server port**

* _basically, the `cluster module` gives us a quick win when it comes to **`handling the workload`** in nodejs application_

## Mechanism
* -> _when we run a .js file in terminal_, **`the file`** is treated as a **Cluster Master** 
* -> and **`this master`** is in charge of **spawning new workers** which **`run an instance`** of our node application
* => **`Master`** is only **`in charge of the workers`** (_starting, stopping, restarting, ..._), it **doesn't execute the application code** itself (_handling incomming request, reading file, ..._)
* => that job is up to the **individual worker instance** 

## Worker
* **`Each Worker`** gets its **own Event Loop, memory, and V8 instance**
* -> this help us to **share the workload** across **`different instances`** without having to **`block execution`** (_Ex: handling incoming requests in http_)

* _write code to distinguish between Master and Worker; ensure they are responsible for the right type of work_
```js
// cluster.js
// ->  we need 2 snippets of code execution depending on whether the file is treated as "Master" or "Worker"

const cluster = require("node:cluster");
const http = require("node:http");

if (cluster.isMaster) 
{ // in charge of creating "Workers"
    console.log(`Master process ${process.pid} is running`);

    // create 2 new "Workers":
    cluster.fork();
    cluster.fork();
} 
else 
{ // in charge of handling incomming requests
    console.log(`Worker ${process.pid} started`);

    const server = http.createServer((req, res) => {
        if (req.url === "/") {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Home page");
        } else if (req.url === "/slow-page") {
            for (let i = 0; i < 6000000000; i++) {} // Simulate CPU work

            res.writeHead(200, { "Content-Type": "text/plain" })
            res.end("Slow Page");
        }
    });
    sever.listen(8000, () => console.log("Server is running on port 8000"))
}

// when we first run "node cluster.js" in the terminal, Node treate this file as "Master" and set ".isMaster" to true

// Output:   
// Master process 3242 is running
// Worker 3244 started
// Worker 3243 started
// Server is running on port 8000
// Server is running on port 8000

// Back to Browser:
// -> if resfresh "/", it takes 24 miliseconds
// -> if resfresh "/slow-page", it takes 4.72 seconds

// But what happen if we 2 request in parallel, "/slow-page" first followed by "/" page
// -> the "/" page response right away in 2 miliseconds
// -> the "show-page" page take 5.75 seconds

// the second request (load "/" page) is not blocked while the first request is being served
// -> the first worker with its own node instance handles the first request
// -> the second worker with its own node instance handles the first request
// => better performance
```

===============================================================

# Create "Worker" in right way
* it is very important to **`create worker threads`** **at minimum as the number of executions**
* -> if we **`create only one`**, than it is the **`same as no cluster scenario`**
* -> the **`Master`** will **`no handle any other execution`** resulting in just **1 node instance responsible for both execution**

* we should only create **as many workers as there are CPU cores** on the machine the app is running
* -> if we **`create more workers`** than the number of **`logical cores on the computer`** it can cause **an overhead** 
* -> as **`the system`** will have to **`schedule all the the created workers`** with **`fewer numbers of cores`**

* _For example: the Macbook have 10 logical cores, so we should only ever create 10 workers to get the maximum performance_

## Verify the number workers we can create 
* _By checking _
```js
const OS = require("node:os");
console.log(OS.cpus().length());

// Output: "10" if it's a Macbook
```

## use "pm2" npm package for auto easy setup "Worker"
* an esier way to do this is using **pm2 package** for to **`run our application`** as **a cluster** and also decide the **`best number of workers`** to create for our machine
* -> after installing successfully, we can ask pm2 to **`run our no cluster file`** in cluster mode
* -> tức là về cơ bản ta không phải manually handle cluster 

```js
// no-cluster.js
const http = require("node:http");

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Home page");
    } else if (req.url === "/slow-page") {
        for (let i = 0; i < 6000000000; i++) {} // Simulate CPU work

        res.writeHead(200, { "Content-Type": "text/plain" })
        res.end("Slow Page");
    }
});

sever.listen(8000, () => console.log("Server is running on port 8000"))

// in terminal: pm2 start no-cluster.js -i 0
// -> the "zero" indicates we want "pm2" to figure out the optimum number of workers to create
// -> if we specify the number as "2", "pm2" will create only 2 workers
// -> when run the CLI, a table has been displayed to visualize all the workers

// Now in browser, run "/slow-page" and quickly run "/" page
// -> the "/" page still load in 3ms, and "/slow-page" page is loading without block other request

// Now to stop "pm2", type and run the "pm2 stop no-cluster.js" in terminal 
```