# Stream
* the **sequential movement of binary data** is called a stream
* -> _stream data_ in broken parts called **`chunks`**; 
* -> the computer starts **`processing the data as soon as it receives a chunk`**, not waiting for the whole data

* **`a stream`** is an _abstract interface_
* -> allow to work with **streaming data** in Node.js
* -> allows to deal with portions of data (**chunks**) arriving at different moments

==================================================
# NodeJS "stream" Module
* -> provides **EventEmitter** - **`an API for implementing the stream interface`**
* -> provides **`many stream instances`** (_VD: a request to an HTTP server, process.stdout, ..._)
* => handle and manipulate (**`read, write, or both`**) the `streaming data` like _a video, a large file,..._

```js
const stream = require('stream'); 
```

## Mechanism
* _streams are not eager_
* -> they **`don’t read all the data in one go`**
* -> **`the data is read in chunks`**, small portions of data
* -> we **`can immediately use a chunk`** as soon as it is available through the **data event**
* -> when a new chunk of data is _available in the source stream_, we **`immediately write it to the destination stream`**
* => this way, we never have to **keep all the file content in memory**


```js - WARNING: this implementation here is not bullet-proof, there are some rough edge cases
// stream-copy.js
import { createReadStream, createWriteStream } from 'fs'

const [ , , src, dest] = process.argv

// create source stream
const srcStream = createReadStream(src)

// create destination stream
const destStream = createWriteStream(dest)

// when there's data on the source stream,
// write it to the dest stream
srcStream.on('data', (chunk) => destStream.write(chunk))
```

## 4 fundamental stream types within Node.js:
* **Writable**: streams to which data **`can be written`** (Ex: _fs.createWriteStream()_)
* **Readable**: streams from which data can be read (Ex: _fs.createReadStream()_)
* **Duplex**: streams that are **`both Readable and Writable`** (Ex: _net.Socket_)
* **Transform**: **`Duplex streams`** that can **`modify or transform the data`** as it is written and read (Ex: _zlib.createDeflate()_)

```js - Readable streams
// This stream is used to create a data stream for reading, as to read a large chunk of files

const fs = require('fs');

const readableStream = fs.createReadStream('./article.md', {
    highWaterMark: 10
});
readableStream.on('readable', () => {
    process.stdout.write(`[${readableStream.read()}]`);
});
readableStream.on('end', () => {
    console.log('DONE');
});
```

```js - Writable streams
// This creates a stream of data to write. For example: to write a large amount of data in a file
const fs = require('fs'); 

const file = fs.createWriteStream('file.txt'); 
for (let i = 0; i < 10000; i++) { 
    file.write('Hello world ' + i); 
}
file.end();
```

```js - Duplex streams
// This stream is used to create a stream that is both readable and writable at the same time
const server = http.createServer((req, res) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        console.log(body);
        try {
            // Send 'Hello World' to the user
            res.write('Hello World');
            res.end();
        } catch (er) {
            res.statusCode = 400;
            return res.end(`error: ${er.message}`);
        }
    });
});
```

## 2 types of "readable streams" in NodeJs
* **Flowing stream** — A stream used to pass **`data from the system`** and provide this data to your programs.
* **Non-flowing stream** — The non-flowing stream that does not push data automatically. Instead, the non-flowing stream **`stores the data in the buffer`** and explicitly calls the **`read()`** method of the stream to read it

## Memory usage, execution Time - Comparison between "buffer" and "stream"
* we can see how much data is being allocated in buffers by a Node.js script is by calling **`process.memoryUsage().arrayBuffers`**

* **Buffer Approach**
* -> Memory usage: read the entire file into a buffer before compressing it, so lead to `significant memory usage` (but buffer size can be adjusted for more optimization)
* -> Execution Time: while reading/writing the whole file at once might seem faster, the initial memory allocation and copying of data can slow down the process

* **Streaming Approach**
* -> Memory usage: chunks and compresses them on the fly; only a small buffer is needed for processing each chunk
* -> Execution Time: is faster; and compression can happen concurrently with reading/writing

```js
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function runBufferApproach(filePath) {
  // Capture baseline memory usage
  const baselineMemory = process.memoryUsage().arrayBuffers;

  // Read, compress, write the entire file into a buffer
  const buffer = await fs.promises.readFile(filePath);
  const compressedBuffer = await zlib.gzipSync(buffer);
  await fs.promises.writeFile(filePath + '.gz', compressedBuffer);

  // Calculate and print total memory usage
  const totalMemoryDelta = process.memoryUsage().arrayBuffers - baselineMemory;
  console.log(`Buffer approach: Peak memory usage: ${totalMemoryDelta}`);
}

async function runStreamingApproach(filePath) {
  // Capture baseline memory usage
  const baselineMemory = process.memoryUsage().arrayBuffers;

  // Create read, compress, and write streams
  const readStream = fs.createReadStream(filePath);
  const gzipStream = zlib.createGzip();
  const writeStream = fs.createWriteStream(filePath + '.gz');

  // Pipe the streams together
  await pipeline(readStream, gzipStream, writeStream);

  // Calculate and print memory usage
  const memoryDelta = process.memoryUsage().arrayBuffers - baselineMemory;
  console.log(`Streaming approach: Peak memory usage: ${memoryDelta}`);
}

(async () => {
  const filePath = 'your/file/path.txt';
  await runBufferApproach(filePath);
  await runStreamingApproach(filePath);
})();
```