
# "stream" module
* -> is infact **`a built-in node module`** that **`inherits`** from the **EventEmitter  class** 
* -> when we have **`a large files`** that are megabytes in size, **`streaming the data`** from 1 file another will **save a lot of time and memory**

* _`fs` module is just one of the many modules that uses streams_
* _in `http` module_,  **HttpRequest is a readable stream**  **HttpResponse is a writable stream**

```js - transfer the contents from "file.txt" to "file2.txt"
// -> create "file2.txt" which is empty

// file.txt
Hello Codevolution

// index.js
const fs = require("node:fs");

// use "readable stream" to read data in chunks from "file.txt"
// -> arg1 is "file path", arg2 is "option obj"
// -> "readableStream" emits a "data" event to which we can listen
const readableStream = fs.createReadStream("./file.txt", { encoding: "utf-8" });

// create a "writable stream" to write data in chunks to "file2.txt"
// -> arg1 is "path to file get written"
const writableStream = fs.createWriteStream("./file2.txt");


// the callback function is the listener
// -> which automatically receives "a chunk" of data
readableStream.on("data", (chunk) => { 
    console.log(chunk);

    // write to "file2.txt" using "writable stream"
    writableStream.write(chunk);
})

// Output:
// Console window: Hello Codevolution 
// "file2.txt" content: Hello Codevolution

// => our "chunk" is the entire file content of "file.txt"
// -> this is becaus the "buffer" that "stream" use has a default size of "64 kilobytes"
// -> our file content has a total of 18 characters which is just 18 bytes
// => so the "chunk" contains the entire 18 bytes
```

* _add **`an option`** to manipulate the chunk when reading data_
```js
const readableStream = fs.createReadStream("./file.txt", { 
    encoding: "utf-8",
    highWaterMark: 2, // deal with data in chunks of 2 bytes
});

const writableStream = fs.createWriteStream("./file2.txt");

readableStream.on("data", (chunk) => { 
    console.log(chunk);
    writableStream.write(chunk);
})

// Output:
// Console window: He // ll // o // Co // de // vo // lu // ti // on
// "file2.txt" content: Hello Codevolution
```

===================================================
# 4 Type of Streams
* **Readable streams** from which **`data can be read`**
* **Writable streams** to which we **`can write data`**
* **Duplex streams** that are **`both Readable and Writable`**
* **Transfrom streams** that can **`modify or transform the data`** as it is written and read 

```r - Ex:
// "Reading from a file" as readable stream
// "Writing to a file" as writable stream
// "Sockets" as a duplex stream
// File compression - where you can "write compressed data to a file" and "read de-compressed data" from a file as a transform stream
```