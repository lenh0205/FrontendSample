
# Thread pool
* -> a pool of threads that Nodejs uses to offload time-consuming tasks and ensure the main thread is not blocked for a long time
* -> every method in Nodejs that **`has the "sync" suffix`** **`always run on the main thread`** an is blocking
* -> the **`async method`** run on **a seperate threads** in **`libuv's thread pool`**; they do **run synchronously in their own thread**
* => _`but as far as the main thread is concerned, it appears as if the method is running asynchronously`_

```js - VD: measure a time for executing a synchronous method
// just like "js", "crypto" also use "libuv's Thread pool" for some of methods
// the "pbkdf2" is a CPU intensive method that takes a long time and is offloaded to "thread pool"
const crypto = require("node:crypto");  

// measure the time taken to run "synchronous" version of "pbkdf2"
const start = Date.now();
crypto.pbkdf2Sync("password", "salt", 100000, 512, "sha512");
console.log("Hash: ", Date.now() - start);
// -> when execute this, the ouput is "261" (depend on hardware) miliseconds it cost
// -> it we duplicate the same "pbkdf2", it will take about double time to do
```

```js - VD: measure a time for executing a asynchronous method
const MAX_CALLS = 1;
const start = Date.now();

for (let i = 0; i < MAX_CALLS; i++) {
    crypto.pbkdf2("password", "salt", 100000, 512, "sha512", () => { // executed when hasing completed
        console.log(`Hash ${i + 1}:`, Date.now() - start())
    });
}
// -> when execute this, the ouput is "Hash 1: 261" miliseconds

// -> when we change "MAX_CALLS = 2", the output is "Hash 2: 264    Hash 1: 269" 
// => a litte higher than a single call; but definitely not "twice as long" 

// -> when we change "MAX_CALLS = 3", the output is "Hash3: 271 Hash 2: 279    Hash 3: 283" 
// => a litte higher than a single call; but definitely not "triple as long"

// => parallel execution, each call to pbkdf2 runs in "seperate thread"   
```

## Visualize
* -> when **`main thread`** encounters an **`asynchronous method`**  
* -> it's ask libuv to help performing the task - that is a time consuming task without blocking further code from being executed during this time 
* -> unlike **`main thread`** that's **`single thread`**, **libuv has a pool of threads** that it can use to run some of these **`time consuming task`** 
* -> when task is done, the associated callback function can be run 

* _this is how main thread offloads async methods into the thread pool_

```js - reading from a file using "fs" module
const fs = require("node:fs");

console.log("First");

fs.readFile("./file.txt", "utf-8", (err, data) => {
    console.log("File Content")
});

console.log("Last");

// Output: First    Last    File Content
// -> "readFile" is an asynchronous non-blocking method allow to execute code further down the line while the file contents is being read
// -> Nodejs can do this because of "Thread pool" of "libuv"
```

==========================================================
# Thread pool size - How many "threads" exist in "libuv's thread pool" ?
* -> **`libuv's thread pool`** has **4 threads** **`by default`**
* -> but we are **able to increase the number of threads** in the "thread pool", so that **`more calls to async method`** can run in parallel leading to **`better performance`**
* => this is how **`Libuv Thread Pool`** helps execute **`some of the async methods`** in Nodejs, but **not all async methods**

```r
// in the example above, if we execute "pbkdf2()" 3 times in parallel we; that means we must have at leat 3 "threads" in the "pool"
// but how many threads are there in total ? 
```

```js
const MAX_CALLS = 1;
const start = Date.now();

for (let i = 0; i < MAX_CALLS; i++) {
    crypto.pbkdf2("password", "salt", 100000, 512, "sha512", () => { 
        console.log(`Hash ${i + 1}:`, Date.now() - start)
    });
}

// if we set "MAX_CALLS = 4"
// -> than run it, the output'll be ""Hash 2: 298   Hash 1: 303   Hash 3: 319   Hash 4: 332"
// -> run it again, the output'll be ""Hash 4: 201   Hash 3: 300   Hash 1: 304   Hash 4: 305"
// => it's just slightly different, but average close to "300"

// but if we set "MAX_CALLS = 5"
// -> than run it, the output'll be "Hash 4: 270  Hash 3: 297  Hash 2: 297  Hash 1: 314  Hash 5: 531"
// -> "Hash 5" takes nearly twice the amount of time as the first ("Hash 4") on average
// => it can only means onething, libuv's thread pool "has 4 threads"

// when we execute pbkdf2 5 times, the first 4 each take their own thread and complete in nearly the same time
// the fifth call however has to "wait for a thread to be free"
// when "Hash 4" is complete, "Hash 5" runs on the thread and finishes; resulting in twice the amount of time taken in total

// => "libuv's thread pool has 4 threads by default"
// => can we 
```

## Increase the "thread pool size" - number of Threads
* -> we can archieve it by **`setting a process enviroment variable`** **process.env.UV_THREADPOOL_SIZE**
* -> by **increase the thread pool size**, we are able to **`improve the total time`** taken to **`run multiple calls of an asynchronous method`**
* => this **`improve perfromance`** but that is **limited by the number of available CPU cores**
* -> so notice that if we increase the thread pool size **`beyound the number of CPU cores`** our machine has, **`the average time taken`** per method execution also **`increases`**
* -> this is because **OS Scheduler** **`switch between threads`**, ensuring they all get **`equal amount of time`**

```js - increate "thread pool size"
process.env.UV_THREADPOOL_SIZE = 5; // set the number of threads to "5"

const MAX_CALLS = 5;
const start = Date.now();

for (let i = 0; i < MAX_CALLS; i++) {
    crypto.pbkdf2("password", "salt", 100000, 512, "sha512", () => { 
        console.log(`Hash ${i + 1}:`, Date.now() - start)
    });
}

// when run it, the output'll be "Hash 3: 281  Hash 4: 286  Hash 2: 290  Hash 5: 295  Hash 1: 299"
// -> the fifth call ("Hash 5") takes almost the same time and not twice as much as the other hashes
```

```js - cross the number of CPU cores
process.env.UV_THREADPOOL_SIZE = 8; 

const MAX_CALLS = 8;
const start = Date.now();

for (let i = 0; i < MAX_CALLS; i++) {
    crypto.pbkdf2("password", "salt", 100000, 512, "sha512", () => { 
        console.log(`Hash ${i + 1}:`, Date.now() - start)
    });
}

// when run it, the output'll be "Hash 2: 272  Hash 3: 278  Hash 5: 278  Hash 7: 278  Hash 8: 278 Hash 6: 278 Hash 4: 302 Hash 1: 327"
// -> we can see all eight calls still consume approximately the same time (about 300 miliseconds on average)

process.env.UV_THREADPOOL_SIZE = 16; 
const MAX_CALLS = 16;
const start = Date.now();

for (let i = 0; i < MAX_CALLS; i++) {
    crypto.pbkdf2("password", "salt", 100000, 512, "sha512", () => { 
        console.log(`Hash ${i + 1}:`, Date.now() - start)
    });
}
// when run this, 
// ->  "Hash 3: 536  Hash 1: 545  Hash 8: 546  Hash 5: 568  Hash 10: 570  Hash 7: 571  Hash 14: 574  Hash 9: 582  Hash 4: 591  Hash 2: 606  Hash 11: 608  Hash 6: 619  Hash 12: 623  Hash 16: 629  Hash 13: 632  Hash 15: 645"
// -> almost all the 16 hashes take the same amount of time as the other; it's around 550 and 600 miliseconds which is double the previous run
// => this is because the OS has to juggle 16 threads across 8 CPU cores (Macbook)
```

```r - Visualize 
// the Macbook has 8 cores (it has 10 cores, but 2 are effiency cores)

// when we only have 1 call to "async method", 
// -> it takes 1 "thread" which takes 1 "core"
// -> this takes approximately 270 miliseconds

// when we change the "thread pool size" to 8 and "number of calls" to 8, 
// -> each call takes 1 "thread" which in turn takes 1 "core" 
// -> this will still result in approximately 270 miliseconds for each call

// when there are 16 "threads" and 16 "async method" calls
// -> we have 1 "thread" per call, but the Operation System has to juggle 16 "threads" across 8 "cores"
// -> and the way "OS Scheduler" does this is to switch between threads, ensuring they all get equal amount of time
// => because of this, 16 threads now have to share 8 cores
// => this results in twice the amount of time for each "async method" calls
// => this is why we see 550 to 600 miliseconds instead of 270 to 300 miliseconds when we had fewer threads than CPU cores
```