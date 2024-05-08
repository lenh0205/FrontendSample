# libuv
* -> is a **`cross-platform open source`** library written in C language
* -> is what **handles asynchronous non-blocking operations** in Nodejs
* -> _help abstracts away all the complexity of **`dealing with the operating system`**_
* -> _nó chung là để lập trình bất đồng bộ trong Nodejs ta cần `libuv`_
* -> there're 2 important feature of "libuv": **Thread Pool** and **Event Loop**

=======================================================
# the Nature of "Javascript" language
* **`Javascript`** is a **synchronous**, **blocking**, **single-threaded** language
* -> **`synchronous`** - code executes top down, with only one line executing at any given time
* -> **`blocking`** - no matter how long a previous process takes, the subsequent processes won't kick off until the former is completed
* -> **`single-thread`** - the "main thread"

## A Thread
* -> a Thread is simply **`a process`** that your **`Javascript program`** can **`use to run a task`**
* -> **`each Thread`** can **only do one task at a time**

* -> _many other languages which support multi-threading and `can thus run multiple tasks in parallel`_
* -> **`Javascript has just the one thread`** called the **main thread** for executing any code 

## the Problem of "synchronous, blocking, single-threaded" model
* this cause limitation of writing apps

```r
// if we have a task to retrieve data from the database and then run some code on the data that is retrieved
// we have to wait for the first line for data to be fetched, and when the data finally comes back we can resume with our normal execution
// it may take 1 second, and during that time we cant run any further code
// => we need a way to have asynchronous with Javascript
```

=========================================================
## Asynchronous programming in Javascript
* -> asynchronous let our code do several things at the same time without blocking the **`main thread`**
* -> just javascript is not enough; we need the support of **`functions and APIs`** define by **`Browser or Nodejs`**
* -> they allows us to **register functions** that shouldn't be executed synchronously and should instead be invoked asynchronously when some kind of event occurs

* _includes:_
* -> **`passage of time`** (_setTimeout, setInterval_), 
* -> **`the user's interaction with the mouse`** (_addEventListener_), 
* -> **`data being read from a file system`**, 
* -> **`the arrival of data over the network`** (_callbacks, Promise, async-await_)

* _this is the way of some Nodejs built-in module code is written_ 

