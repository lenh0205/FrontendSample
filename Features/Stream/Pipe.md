* -> Node **streams** are a fundamental building-block of **`efficient, fast data-processing and tranformation`** appication
* -> it has 2 important model: **Pipe** and **Pipeline**

========================================================
# Pipe
* -> help to **`avoid memory leak`**

```js
const fs = require("fs");
const csv = require("csvtojson"); // to convert a "csv" stream to JSON

const fs = require("fs");

const main = async () => {
    const readStream = fs.createReadStream("./data/import.csv");
    const writeStream = fs.createWriteStream('./data/export.csv');

    readStream
        .pipe(
            csv({ delimiter: ";" }, { objectMode: true })
        )
        .on("data", data => {
            console.log(">>>> data: ");
            console.log(data);
            // vì "objectMode" nên ta sẽ thấy "data" dạng "literal object" thay vì "<Buffer ...>" 
        })
}
main();

// Output:
// >>>> data: 
// object đại diện cho dữ liệu của chunk thứ 1 đến
// .......continuous
```

## Pipe with a "Transform"
* -> **`a class`** import from **`stream`** module
* -> **`Transform`** have both **readable** and **writable** features
* -> _use it to `edit` or `filter` data_

* _when **`an error is thrown`** the stream won't trigger the **`end`** of stream 

```js
const { Transform } = require("stream");

// ...

readStream
    .pipe(
        csv({ delimiter: ";" }, { objectMode: true })
    )
    .pipe(new Transform({ 
        objectMode: true,

        // "transform" method give us access to chunks: the data, encoding, callback
        transform(chunk, enc, callback) {
            console.log(">>> chunk: ", chunk);

            callback("Some error"); 
            // arg1 is throw an "Error", arg2 is argument for "data" event callback
        }
    }))
    .on("data", data => {
        console.log(">>>> data: ");
        console.log(data);
    })
    .on("error", error => {
        console.error("Stream error: ", error);
    })
    .on('end', () => {
        console.log('Stream ended!');
    })

// Ouput:
// >>> chunk: {
//    name: 'Maxilian',
//    email: 'Maxilian_Kihn33@gmail.com',
//    age: '41',
//    salary: '8486',
//    isActive: 'true'
// }
// Stream error: Some error
```

```js - edit stream
const myTransform = new Transform({ 
    objectMode: true,
    transform(chunk, enc, callback) {
        // create "user" object hold modified version of stream
        const user = {
            name: chunk.name,
            email: chunk.email.toLowerCase(),
            age: Number(chunk.age)
            salary: Number(chunk.salary),
            isActive: chunk.isActive === 'true'
        }
        callback(null, user); 
    }
})

readStream
    .pipe(csv({ delimiter: ";" }, { objectMode: true }))
    .pipe(myTransform)
    .on("data", data => {
        console.log(">>>> data: ");
        console.log(data);
    })
    .on("error", error => {
        console.error("Stream error: ", error);
    })
    .on('end', () => {
        console.log('Stream ended!');
    })

// Output:
// >>> chunk: {
//    name: 'Maxilian',
//    email: 'maxilian_kihn33@gmail.com',
//    age: 41,
//    salary: 8486,
//    isActive: true
// }
// ......continuous
// Stream ended!
```

```js - Filtering using Transform
const myFilter = new Transform({
    objectMode: true,
    transform(user, enc, callback) {
        // filter only active user
        if (!user.isActive) { 
            callback(null);
            return
        }
        callback(null, user);
    }
})

readStream
    .pipe(csv({ delimiter: ";" }, { objectMode: true }))
    .pipe(myTransform)
    .pipe(myFilter)
    .on("data", data => {
        console.log(">>>> data: ");
        console.log(data);
    })
    .on("error", error => {
        console.error("Stream error: ", error);
    })
    .on('end', () => {
        console.log('Stream ended!');
    })

// Output: 
// (chỉ hiện những user "active")
// Stream ended!
```

## Pipes Error Management
* -> we have to add an **`error listener right after each pipe`**, or we will end up errors that **`crashing our program`**

* -> if our main method is a **callback** function, we need to **`call this callback`** on **`end`** event and on every **`error listener`** that we have
* -> if we return a **new Promise((resolve, reject) => our_readStream_pipe chaining)**, we need to **`resolve`** on **`end`** event and **`reject`** on **`error`** listener

* => the better way to do this is using **Pipeline**

```js - the "cb" as main method
const main = async (cb) => { 
    const readStream = fs.createReadStream("./data/import.csv");

    const myTransform = new Transform({
        // ....
    })
    const myFilter = new Transform({
        // ....
    })

    readStream
        .pipe(csv({ delimiter: ";" }, { objectMode: true }))
        .on("error", error => {
            console.error("Stream error: ", error);
            cb(error);
        })
        .pipe(myTransform)
        .on("error", error => {
            console.error("Stream error: ", error);
            cb(error);
        })
        .pipe(myFilter)
        .on("data", data => {
            console.log(">>>> data: ");
            console.log(data);
        })
        .on("error", error => {
            console.error("Stream error: ", error);
            cb(error);
        })
        .on('end', () => {
            console.log('Stream ended!');
            cb(null);
        })
}
main();
```

==========================================================
# Pipeline
* -> help to **`avoid memory leak`**

```js
const { pipeline } = require("stream/promises");

const main = async (cb) => { 
    const readStream = fs.createReadStream("./data/import.csv");

    const myTransform = new Transform({
        // ....
    })
    const myFilter = new Transform({
        objectMode: true,
        transform(user, enc, callback) {
            // filter only active user
            if (!user.isActive) { 
                callback(null);
                return
            }

            // because "myFilter" is the last "Transform" in pipeline
            // so it expects the last transform to send nothing (no arg2), and act like writeStream
            callback(null);
        }
    })

    try {
        await pipeline(
            readStream,
            csv({ delimiter: ";" }, { objectMode: true }),
            myTransform,
            myFilter
        )
        console.log('Stream ended!');
    } catch (error) { // Pipeline Error Management
        console.error('Stream ended with error', error   );
    }
}
main();
```
