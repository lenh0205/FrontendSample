# where to use "stream"
* stream could be literally everything: reading or writing files, network communications, end-to-end information exchange
* Ex: stream in MongoDb, knexjs ORM, Cassandra, Oracle DB

============================================================
# Read/Write Streams
* -> the 2 most common used event that **`readStream`** give is **data** and **end**
* -> the **highWaterMark** **`by default`** is **16 kilobytes** (tức là mỗi chunk đến nơi trong data event có size là 16 kilobytes)
* -> the most common used event that **`writeStream`** give is **write**, that accept only **`a buffer`** or **`a string`**
* -> **Notice**: we need to **end** **`writeStream`** when not needed anymore

```js - copy content of a file to another file
const fs = require("fs");

const main = async() => {
    // create "read stream"
    const readStream = fs.createReadStream("./data/import.csv", {
        highWaterMark: 100
    });

    // create "write stream"
    const writeStream = fs.createWriteStream('./data/export.csv');

    // "data" event give us "chunks of data" as "buffer"
    readStream.on("data", (buffer) => {
        console.log(">>> DATA: ");
        console.log(buffer);
        console.log(buffer.toString()); // to see file content in text

        writeStream.write(buffer);
    })

    // "end" event give notification when the "stream" has ended
    readStream.on("end", () => {
        console.log("Stream ended");
        writeStream.end(); // end the "writeStream"
    })
}
main();

// Ouput:
// >>> DATA: 
// (buffer của chunk thứ 1 đến)
// (nội dung dạng text của chunk thứ 1 đến)
// >>> DATA: 
// (buffer của chunk thứ 2 đến)
// (nội dung dạng text của chunk thứ 2 đến)
// ................coninuous
// Stream ended

// and the content of "import.csv" file is copied to "export.csv" successfully
```

==========================================================
## Backpressuring in Streams
* Ex: reading from HDD then writing on SSD is not a problem as SSD is really fast, but if we are reading from an SSD under writing on an HDD, 
* -> the both **`streams`** are **`not running in with the same speed`** 
* => this cause the **Backpressure** issue - which will lead to **`memory leak`** in our program
* => we need to **`adjust the speed of between the Write and Read`** - easy way to do that is using **Pipe**

## Solve the "Backpressuring" with "Pipe"

```js
const fs = require("fs");

const main = async() => {
    const readStream = fs.createReadStream("./data/import.csv");
    const writeStream = fs.createWriteStream('./data/export.csv');

    readStream.pipe(writeStream)
}
main();
// the content of "import.csv" file is copied to "export.csv" successfully without "Backpressure"
```