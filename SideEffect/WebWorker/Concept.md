
# Web Worker - Worker Thread of Web Content
* -> makes it possible for **`web content`** to **run a script operation in a background Thread** _separate from the main execution thread_ of a web application
* -> **`the laborious processing`** (_tiến trình nặng_) can be **performed in a separate thread** 

* => allowing **the main (usually the UI) thread to run without being blocked/slowed down**
* => the **`worker thread`** can **perform tasks without interfering with the user interface**

==========================================================================
# Worker
* a worker is **`an object`** created using **`a constructor`** (_Ex: **Worker()**)_ that **runs a named JavaScript file** - contains the **`code that will run in the worker thread`**

* -> Workers may in turn **spawn new workers**, as long as **`those workers are hosted within the same origin as the parent page`** (_using **`Worker`**, **`WorkerGlobalScope`**, **`WorkerLocation`**, **`WorkerNavigator`**_)
* -> workers can **make network requests** using the **`fetch() or XMLHttpRequest APIs`** (_although note that the `responseXML` attribute of `XMLHttpRequest` will always be null_)

## Note
* -> almost **`any code can be run inside a worker thread`**
* -> but there're some **`exception`**: can't _directly manipulate the DOM_ from inside a worker, or use some _default methods and properties of the Window object_

## Data Communication
* -> data is sent **`between workers and the main thread (JavaScript code that created it)`** via **a system of messages**
* -> both sides **`send their messages`** using the **postMessage()** method, and **`respond to messages`** via the **onmessage event** handler 
* _the message is contained within the message event's data property; **the data is copied rather than shared**_

=============================================================================
# Worker types
## Dedicated workers 
* -> are **`workers`** that are **utilized by a single script** 
* -> this **`context`** is represented by a **DedicatedWorkerGlobalScope object**

## Shared workers 
* -> are workers that can be **utilized by multiple scripts** running in different windows, IFrames, ..., as long as they are in the **`same domain as the worker`** 
* -> they are a little more complex than dedicated workers — **`scripts must communicate via an active port`**`

## Service Workers 
* -> essentially act as **proxy servers that sit between web applications, the browser, and the network (when available)**

* -> intended to **enable the creation of effective offline experiences**, 
* -> **intercept network requests** and **`take appropriate action`** based on whether the network is available
* -> **update assets residing on the server**
* -> they will also allow access to **push notifications and background sync APIs**

===================================================
# Worker global 'contexts' and 'functions'
* -> workers run in **a different global context** than the **current window** (_the interface represents a window containing a DOM document_)
* -> while _Window_ is **`not directly available to workers`**, many of the **`same methods`** are defined in a **`shared mixin`** - **WindowOrWorkerGlobalScope**
* -> and made available to workers through their own **WorkerGlobalScope** derived contexts: **`DedicatedWorkerGlobalScope`**, **`SharedWorkerGlobalScope`**, **`ServiceWorkerGlobalScope`**

* _using the **`window`** shortcut to get the **current global scope** (instead of **`self`**) within a Worker will return an error_

* some of the functions (a subset) that are common to **all workers and to the main thread** from **WindowOrWorkerGlobalScope** are:
* -> **`fetch()`**
* -> **`atob()`**, **`btoa()`**
* -> **`setInterval()`**, **`clearInterval()`**, **`setTimeout()`**, **`clearTimeout()`**
* -> **`createImageBitmap()`**
* -> **`queueMicrotask()`**
* -> **`reportError()`**
* -> **`structuredClone()`**
* -> **`requestAnimationFrame()`**, **`cancelAnimationFrame()`** (dedicated workers only)

* function **only avaiable to workers**: 
* -> **`importScripts()`**,
* -> **`postMessage()`** (dedicated workers only)

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

