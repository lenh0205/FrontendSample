* while **`ArrayBuffer, Uint8Array and other BufferSource`** are **`binary data`**, **a Blob** represents **binary data with type**
* => that makes **`Blobs convenient for upload/download`** operations, that are so common in the browser

==================================================
# BLOB - binary large object
* -> **`a high-level object`** 
* -> have additional encoding and metadata on top of binary data
* -> are primarily used in **`HTML forms`** when **`uploading attachments`**

* Blob objects are **`immutable`**
* -> can not change data directly in a Blob, 
* -> but we can slice parts of a Blob, create new Blob objects from them, mix them into a new Blob

===================================================

# Blob = type + blobParts
* -> **type** - an optional string (a **`MIME-type`** usually)
* -> **blobParts** - a **`sequence`** of **other Blob objects, strings, BufferSource**

## Constructor
```js
new Blob(blobParts, options);
```

```js - create "Blob"
// create Blob from a string
let blob = new Blob(["<html>…</html>"], {type: 'text/html'});

// create Blob from a typed array and strings
let hello = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in binary form
let blob = new Blob([hello, ' ', 'world'], {type: 'text/plain'});
```

## blobParts
* is **`an iterable object (such as Array) of Blob/BufferSource/String values`**
* -> _ArrayBuffers, TypedArrays, DataViews, Blobs, strings_
* -> strings should be well-formed Unicode, and lone surrogates are sanitized (_can use `String.prototype.toWellFormed()` algorithm_)

## "options" object:
* -> **type** – **`Blob type`**, usually **`MIME-type`**, e.g. image/png,
* -> **endings** – whether to transform end-of-line to make the Blob correspond to current OS newlines (\r\n or \n); By default, "transparent" (do nothing), but also can be "native" (transform)



## extract "Blob slices" 
```js
blob.slice([byteStart], [byteEnd], [contentType]);
```
* -> **byteStart** – the starting byte, by default 0.
* -> **byteEnd** – the last byte (exclusive, by default till the end).
* -> **contentType** – the type of the new blob, by default the same as the source

====================================================
# Blog as URL
* -> **`can be easily used as a URL for <a>, <img> or other tags`**, to **show its contents**
* -> thanks to **type**, we can also **`download/upload Blob objects`**, and the type naturally becomes **Content-Type** in network requests

* **URL.createObjectURL(blob)**
* -> creates **`a unique URL`** in form **`blob:<origin>/<uuid>`**
* -> for each URL generated, the **`browser stores a URL withs Blob mapping internally`** (_so allow to access the Blob with a short URLs_)
* -> a generated URL is only **`valid within the current document, while it’s open`**
* -> it allows to reference the Blob in any object that expects a URL (<img>, <a>, ...)

* **Side Effect**: So if we create a URL, that **`Blob will hang in memory, even if not needed any more`**
* -> while there’s a mapping for a Blob, the Blob itself _`resides in the memory`_. **the browser can’t free it**
* -> the mapping is **`automatically cleared on document unload`**, so **`Blob objects are freed then`**
* -> but if an app is long-living, then that doesn’t happen soon

* **Solution**: **URL.revokeObjectURL(url)**
* -> **`removes the reference from the internal mapping`**
* -> thus allowing the Blob to be deleted (_if there are no other references_), and the memory to be freed
* => tất nhiên, as the mapping is removed, the URL doesn’t work any more

```html - download a dynamically-generated Blob 
<a download="hello.txt" href='#' id="link">Download</a>
<!-- "download" attribute forces the browser to download instead of navigating -->
<!-- if no "download", it will navigate to "blob:http://127.0.0.1:5500/342b1-0b38" -->

<script>
    // down load a "hello.txt" file with the "Hello, world!" as the content
    let blob = new Blob(["Hello, world!"], {type: 'text/plain'}); 
    link.href = URL.createObjectURL(blob);
    // can not call "URL.revokeObjectURL(link.href)", because that would make the Blob url invalid
</script>
```

```js  - use Javascript to create a link dynamically and download starts automatically
let link = document.createElement('a');
link.download = 'hello.txt';

let blob = new Blob(['Hello, world!'], {type: 'text/plain'});
link.href = URL.createObjectURL(blob);

link.click();
URL.revokeObjectURL(link.href);
// Blob is used only once for instant downloading, so just call "URL.revokeObjectURL(link.href)" immediately
```

=======================================================
# Blob to base64
* -> **`an alternative to URL.createObjectURL`** is to _convert a Blob_ into a **base64-encoded string**
* -> _that encoding represents binary data_ as **`a string of ultra-safe "readable" characters with ASCII-codes from 0 to 64`**
* -> and we can use this encoding in **data-urls**

## a "data url" 
* -> has the form data: **`[<mediatype>][;base64],<data>`** 
* -> we can use such urls everywhere, **`on par with "regular" urls`**
* -> **`the browser will decode the string`** and show it

```html
<img src="data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7">
```

## Transform "Blob" into "base64"
* -> _to transform a Blob into base64_, we’ll use the **`built-in`** **FileReader object** (_it can read data from Blobs in `multiple formats`_)

```js - downloading a "blob" via "base-64"
let link = document.createElement('a');
link.download = 'hello.txt';

let blob = new Blob(['Hello, world!'], {type: 'text/plain'});

let reader = new FileReader();
reader.readAsDataURL(blob); // converts the blob to base64 and calls onload

reader.onload = function() {
  link.href = reader.result; // data url
  link.click();
};
// no need to revoke anything   
```

=====================================================
## "Image" to "blob" - canvas
* -> we can create **`a Blob of an image, an image part, or even make a page screenshot`** (_that’s handy to **upload it** somewhere_)
* -> image operations are done via **<canvas> element**:
* => **`draw an image`** (or its part) on canvas using **canvas.drawImage**
* => call canvas method **.toBlob(callback, format, quality)** that **`creates a Blob`** and runs callback with it when done.

```js - VD:
// code này chỉ là copy image, nhưng ta hoàn toàn có thể cut from it, or transform it on canvas prior to making a blob:

// take any image
let img = document.querySelector('img');

// make <canvas> of the same size
let canvas = document.createElement('canvas');
canvas.width = img.clientWidth;
canvas.height = img.clientHeight;

let context = canvas.getContext('2d');

// copy image to it (this method allows to cut image)
context.drawImage(img, 0, 0);
// we can context.rotate(), and do many other things on canvas

// toBlob is async operation, callback is called when done
canvas.toBlob(function(blob) {
  // blob ready, download it
  let link = document.createElement('a');
  link.download = 'example.png';

  link.href = URL.createObjectURL(blob);
  link.click();

  // delete the internal blob reference, to let the browser clear memory from it
  URL.revokeObjectURL(link.href);
}, 'image/png');
```

=================================================
# From "Blob" to "ArrayBuffer"
* -> _Blob constructor_ allows to create a blob **`from almost anything`**, including any **BufferSource**
* -> but if we need to **`perform low-level processing`**, we can get the lowest-level **`ArrayBuffer`** from **blob.arrayBuffer()**

* **Problem**: when we `read and write to a blob of more than 2 GB`, the **use of arrayBuffer becomes more memory intensive** for us
* => **Solution**: we can directly **`convert the blob to a stream`**

```js
// get arrayBuffer from blob
const bufferPromise = await blob.arrayBuffer();
// or
blob.arrayBuffer().then(buffer => /* process the ArrayBuffer */);
```

=================================================
# From "Blob" to "stream"
* -> **`conversion streams`** are very useful when we need to **`handle large blob`**

* **a stream** 
* -> is a _special object_ that allows to **`read from it (or write into it)`** **portion by portion** 
* -> convenient for data that is suitable for processing piece-by-piece
* -> The **`stream() method of Blob interface`** returns a **ReadableStream** - which upon reading will returns the _data contained within the Blob_

```js
// get readableStream from blob
const readableStream = blob.stream();
const stream = readableStream.getReader();

while (true) {
  // for each iteration: value is the next blob fragment
  let { done, value } = await stream.read();
  if (done) {
    // no more data in the stream
    console.log('all blob processed.');
    break;
  }

   // do something with the data portion we've just read from the blob
  console.log(value);
}
```