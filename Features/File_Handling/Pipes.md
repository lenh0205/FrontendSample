
# Pattern
* _streams in the context of reading and writing file content, we create readable stream that reads from a file and create writable stream that writes to a file_
* => this is **`a common pattern`**, that is using **Pipes**

# Pipes
* -> in Nodejs, **`a pipe`** **takes a readable stream** and **connects it to a writable stream**
* -> we use the **pipe method** on **`a readable stream`** to implement the functionality
* -> **`a pipe`** return the **`destination stream`** which enables **chaining**, but the condition is that the destination stream is **readable, duplex, transfrom** stream

```r - in non-technical terms
// a "pipe" to connects a tank to a kitchen sink
// the tank feeds water into the "pipe" which can released through the tap in the sink
// from a "pipe" point of view, we are "reading" water from the tank and "writing" it to the sink
```

```js
// -> create a "file2.txt" with empty content

const fs = require("node:fs");

const zlib = require("node:zlib"); 
// -> provides "compression" funtionality implemented using "gzip" algorithm
// -> nó chung nó giúp ta tạo zipped files
// -> "zlib" has a built-in "transform stream"

const gzip = zlib.createGzip();

const readableStream = fs.createReadStream("./file.txt", { 
    encoding: "utf-8",
    highWaterMark: 2
});

readableStream.pipe(gzip).pipe(fs.WriteStream("./file2.txt.gz"));
// -> "readableStream.pipe" return a "transfrom stream"
// -> then from a "transfrom stream" to "writable stream"

const writableStream = fs.createWriteStream("./file2.txt");
readableStream.pipe(writableStream)

// Ouput:
// "file2.txt" content: Hello Codevolution
// a new file name "file2.txt.gz" is created
```