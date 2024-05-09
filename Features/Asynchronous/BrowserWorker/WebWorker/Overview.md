
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

## Data Communication
* -> data is sent **`between workers and the main thread (JavaScript code that created it)`** via **a system of messages**
* -> both sides **`send their messages`** using the **postMessage()** method, and **`respond to messages`** via the **onmessage event** handler 
* _the message is contained within the message event's data property; **the data is copied rather than shared**_

=============================================================================
# Worker types
## Dedicated workers 
* -> are **`workers`** that are **utilized by a single script** 
* -> this **`context`** is represented by a **DedicatedWorkerGlobalScope object**

* _A dedicated worker is only accessible from the script that first spawned it_

## Shared workers 
* -> are workers that can be **utilized by multiple scripts** running in different windows, IFrames, ..., as long as they are in the **`same domain as the worker`** 
* -> they are a little more complex than dedicated workers — **`scripts must communicate via an active port`**

* _shared workers can be accessed from multiple scripts_

## Service Workers 
* -> essentially act as **proxy servers that sit between web applications, the browser, and the network (when available)**

* -> intended to **enable the creation of effective offline experiences**, 
* -> **intercept network requests** and **`take appropriate action`** based on whether the network is available
* -> **update assets residing on the server**
* -> they will also allow access to **push notifications and background sync APIs**

===================================================
# Worker global 'contexts' and 'functions'
* -> workers run in **a different global context** than the **current 'window'** (_the interface represents a window containing a DOM document_)
* -> while _Window_ is **`not directly available to workers`**, many of the **`same methods`** are defined in a **`shared mixin`** - **WindowOrWorkerGlobalScope**
* -> and made available to workers through their own **WorkerGlobalScope** derived contexts: **`DedicatedWorkerGlobalScope`**, **`SharedWorkerGlobalScope`**, **`ServiceWorkerGlobalScope`**

## Note
* -> almost **`any code can be run inside a worker thread`**
* -> but there're some **`exception`**: can't _directly manipulate the DOM_ from inside a worker, or use some _default methods and properties of the Window object_
* -> but can still use a large number of items available under **window**, including **`WebSockets`**, and data storage mechanisms like **`IndexedDB`**
* -> using the **window** shortcut to get the **`current global scope`** (instead of **self**) within a Worker will return an error

## common functions (a subset) available to all 'workers' and to the 'main thread'
* _from **WindowOrWorkerGlobalScope** are:_
* -> **`fetch()`**
* -> **`atob()`**, **`btoa()`**
* -> **`setInterval()`**, **`clearInterval()`**, **`setTimeout()`**, **`clearTimeout()`**
* -> **`createImageBitmap()`**
* -> **`queueMicrotask()`**
* -> **`reportError()`**
* -> **`structuredClone()`**
* -> **`requestAnimationFrame()`**, **`cancelAnimationFrame()`** (dedicated workers only)

## function only avaiable to workers: 
* -> **`importScripts()`**,
* -> **`postMessage()`** (dedicated workers only)

# Supported Web APIs
* to see list Supported Web APIs: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API#:~:text=dedicated%20workers%20only).-,Supported%20Web%20APIs,-Note%3A%20If

==================================================================
# Thread Safety
* -> the **`Worker interface`** **spawns real OS-level threads**
* -> mindful programmers may be **`concerned that concurrency`** can cause "interesting" effects in our code if we aren't careful
* -> however, since **`web workers`** have **`carefully controlled communication points with other threads`**, it's actually very **hard to cause concurrency problems**
* -> there's **`no access to non-threadsafe components or the DOM`**; and we **`have to pass specific data in and out of a thread`** through **`serialized objects`** 
* => so we have to work really hard to cause problems in our code

===================================================================

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

======================================================================
# Content security policy
* -> **`workers`** are considered to **have their own execution context**, **`distinct from the document that created them`**
* -> for this reason they are, in general, not governed by the **content security policy** of the **`document (or parent worker) that created them`**
* -> to specify a **`content security policy for the worker`**, **set a Content-Security-Policy response header** for the **`request which delivered the worker script itself`**

* -> the **`exception`** to this is if the **worker script's origin is a globally unique identifier** (_for example, if its URL has a scheme of data or blob_)
* -> in this case, the worker does **`inherit the CSP`** of the document or worker that created it.

```js - Ex: suppose a document is served with the following header:
Content-Security-Policy: script-src 'self'

// -> this will prevent any scripts it includes from using "eval()"
// => however, if the script constructs a worker, code running in the worker's context will be allowed to use "eval()"
```

=======================================================================
# Other types of workers
* _in addition to **`dedicated web worker`** and **`shared web workers`**, there are other types of workers available:_

* -> **ServiceWorkers** essentially act as **proxy servers** that sit between **`web applications`**, and **`the browser`** and **`network`** (_when available_)
* -> they are intended to (amongst other things) **enable the creation of effective offline experiences**
* -> **`intercepting network requests`** and taking appropriate action based on whether the **`network is available`** and **`updated assets reside on the server`**
* -> also **`allow access`** to **push notifications and background sync APIs**

* -> **Audio Worklet** provide the ability for **`direct scripted audio processing`** to be done in a **worklet** (_a lightweight version of worker_) context.

=======================================================================
# Debugging worker threads
* -> most browsers enable you to **`debug web workers in their JavaScript debuggers`** in exactly **`the same way as debugging the main thread`**
* -> _for example, both Firefox and Chrome list JavaScript source files for both the main thread and active worker threads, and all of these files can be opened to set breakpoints and logpoints_

To learn how to debug web workers, see the documentation for each browser's JavaScript debugger:

Chrome Sources panel
Firefox JavaScript Debugger

=======================================================================
# Functions and interfaces available in workers
* -> _we can use **`most standard JavaScript features`** inside a web worker, including:_ **Navigator**, **fetch()**, **Array**, **Date**, **Math**, **String**, **setTimeout()** and **setInterval()**
* -> the main thing we **`can't do in a Worker`** is **directly affect the parent page** (_includes **`manipulating the DOM`** and **`using that page's objects`**_)
* -> we have to do it indirectly, by sending a message back to the main script via **`DedicatedWorkerGlobalScope.postMessage`**, then doing the changes in event handler