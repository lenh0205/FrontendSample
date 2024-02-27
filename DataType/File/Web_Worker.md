
# Web Worker
* -> makes it possible to **run a script operation in a background thread** **`separate from the main execution thread of a web application`**

* _advantage_: 
* => laborious processing (tiến trình nặng) can be performed in a separate thread, 
* => allowing the **`main (usually the UI) thread to run without being blocked/slowed down`**

## Worker
* **`a worker`** is _an object_ created using **a constructor that runs a named JavaScript file** (Ex: **Worker()**) 
* -> this file contains the **`code that will run in the worker thread`**

* _Workers_ may in turn **`spawn new workers`**, as long as those workers are hosted within the **`same origin as the parent page`**

* _workers_ can **`make network requests`** using the fetch() or XMLHttpRequest APIs (although note that the responseXML attribute of XMLHttpRequest will always be null).

## Run code inside a "worker thread"
* we can **run almost any code inside a worker thread**
* -> the `standard JavaScript set of functions` (_such as String, Array, Object, JSON, ..._),  or `non-standard`
* -> there are some exceptions: for example, you can't directly manipulate the DOM from inside a worker, or use some default methods and properties of the Window object. 

## System of Message 
* -> **data** is sent **`between workers and the main thread`** via a **`system of messages`**
* -> both sides **`send their messages`** using the **postMessage()** method, and **`respond to messages`** via the **"onmessage" event handler** 
* -> the **message** is contained within the **`message event's data property`**
* -> the **`data is copied rather than shared`**

## Worker types
### Dedicated workers 
* -> are workers that are **utilized by a single script** 
* -> this context is represented by a **DedicatedWorkerGlobalScope** object

### Shared workers 
* -> are workers that can be **utilized by multiple scripts** running in different windows, IFrames, ..., as long as they are in the **`same domain as the worker`** 
* -> they are a little more complex than dedicated workers — **`scripts must communicate via an active port`**`

### Service Workers 
* -> essentially act as **proxy servers that sit between web applications, the browser, and the network (when available)**
* -> intended to **`enable the creation of effective offline experiences`**, 
* -> **`intercept network requests`** and **`take appropriate action`** based on whether the network is available, 
* -> **`update assets residing on the server`**
* => they will also allow access to push notifications and background sync APIs

===================================================
# Worker global contexts and functions
* -> workers run in **`a different global context than the current window`**! 
* -> while **`Window`** is not directly available to workers, many of the **`same methods`** are defined in a **`shared mixin`** - **WindowOrWorkerGlobalScope**
* -> and made available to workers through their own **WorkerGlobalScope**-derived contexts: 
**`DedicatedWorkerGlobalScope`**, **`SharedWorkerGlobalScope`**, **`ServiceWorkerGlobalScope`**

* some of the functions (a subset) that are common to **`all workers`** and to the **`main thread`** from **`WindowOrWorkerGlobalScope`** are:
* -> **fetch()**
* -> **atob()**, **btoa()**
* -> **setInterval()**, **clearInterval()**, **setTimeout()**, **clearTimeout()**
* -> **createImageBitmap()**
* -> **queueMicrotask()**
* -> **reportError()**
* -> **structuredClone()**
* -> **requestAnimationFrame()**, **cancelAnimationFrame()** (dedicated workers only)

* function only avaiable to workers: 
* -> **importScripts()**,
* -> **postMessage()** (dedicated workers only)

# Supported Web APIs
* to see list Supported Web APIs: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API#:~:text=dedicated%20workers%20only).-,Supported%20Web%20APIs,-Note%3A%20If

================================================
# Web Worker interfaces
* **Worker** - represents **`a running worker thread`**, allowing you to pass messages to the running worker code

* **WorkerLocation** - defines the **`absolute location of the script executed`** by the Worker

* **SharedWorker** - represents a specific kind of **`worker that can be accessed from several browsing contexts`** (i.e. windows, tabs, or iframes) or even other workers

* **WorkerGlobalScope**
* -> represents the **`generic scope of any worker`** (doing the same job as Window does for normal web content)
* -> different types of worker have **`scope objects`** that **`inherit from this interface`** and add more specific features.

* **DedicatedWorkerGlobalScope** - represents the **`scope of a dedicated worker`**, inheriting from _WorkerGlobalScope_ and adding some dedicated features.

* **SharedWorkerGlobalScope** - represents the **`scope of a shared worker`**, inheriting from _WorkerGlobalScope_ and adding some dedicated features.

* **WorkerNavigator** - represents the **`identity and state`** of the **`user agent`** (the client).

================================================
# Example
* https://github.com/mdn/dom-examples/tree/main/web-workers/simple-web-worker
* https://mdn.github.io/dom-examples/web-workers/simple-shared-worker/
* https://github.com/mdn/dom-examples/tree/main/web-workers/offscreen-canvas-worker 