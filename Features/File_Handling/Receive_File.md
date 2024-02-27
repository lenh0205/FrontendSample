
# Request Handler in Nuxt.js

```js
// Nuxt.js calling a global function called "defineEventHandle" for defining API routes 
export default defineEventHandler((event) => {
  // "event" provides access to work directly with "IncomingMessage" through event.node.req
  // "IncomingMessage" - the underlying Node.js request object 
  const nodeRequestObject = event.node.req;

  doSomethingWithNodeRequest(event.node.req);

  return { ok: true };
});

/**
 * @param {import('http').IncomingMessage} req
 */
function doSomethingWithNodeRequest(req) {
  // Do not specific stuff here
}
```

# Dealing with "multipart/form-data" in Node.js

* **to Upload file to server through a Connection**:
* -> **`uploading a file`** requires sending a **`multipart/form-data request`**
* -> in these requests, the **`browser`** will **`split the data`** into little **chunks**
* -> and send them through the connection, **`one chunk at a time`** 
* => this is necessary because **`files can be too large to send`** in as one massive payload

* **Streams**: 
* -> **`chunks of data`** being **`sent over time`** make up what’s called a "stream"
* -> _về cơ bản, stream như 1 băng chuyền dữ liệu (chunk); each chunk can be processed as it comes in_
* -> in terms of an HTTP request, the backend will `receive parts of the request`, `one bit at a time`

* **Data nhận được**:
* -> some pieces called **buffers**, each pieces (_buffer_) represent a **`chunk of data`** that **`made up the request stream`** containing the **`file content`**
* -> **buffer** - **`a storage in physical memory`** used to **`temporarily store data`** while it is being **`transferred from one place to another`**

```js - VD: khi ta gửi 1 bức ảnh
function doSomethingWithNodeRequest(req) {
  // Node.js provides an event handler through the request object’s "on" method
  // allows to listen to "data" events as they are streamed into the backend
  req.on("data", (data) => {
    console.log(data);
  })
  // <Buffer 2d 2d 2d 2d 2d 2d 57 65 62 4b 69 74 46 6f 72 6d 42 6f 75 6e 64 61 72 79 73 4c 78 57 64 41 4a 37 6f 6e 32 5a 6f 4c 42 66 od 0a 43 6f 6e 74 65 6e 74 2d ... 64617 more bytes>
  // <Buffer 88 3c 83 ab al 99 cc de 73 a6 1f 88 52 a3 b8 99 11 06 79 19 4f 71 d8 of 2c 0e 9e 15 89 51 55 07 86 bd 16 19 88 f3 5a 2e 02 b5 62 44 89 78 a5 17 33 4c ... 17766 more bytes>
}
```

# Dealing with binary in javascript
* _JavaScript doesn’t work directly on binary data, so we need buffers_

* _working with one partial chunk of data is not super useful_
* -> provide **`an Array to store the chunks of data`** to **`use later on`**
* -> listen for the **data** event to work with each chunk of data as it arrives (**`add the chunks to the collection`**), gives us **`access to the request stream`**
* -> listen to the **end** event and **`convert the chunks`** into something can work with

```js
/**
 * @param {import('http').IncomingMessage} req
 */
function doSomethingWithNodeRequest(req) {
  return new Promise((resolve, reject) => {
    /** @type {any[]} */
    const chunks = [];
    req.on('data', (data) => {
      chunks.push(data);
    });
    req.on('end', () => {
      const payload = Buffer.concat(chunks).toString()
      resolve(payload);
    });
    req.on('error', reject);
  });
}

export default defineEventHandler((event) => {
  const nodeRequestObject = event.node.req;

  const body = await doSomethingWithNodeRequest(event.node.req);
  console.log(body)
  // -> log ra text content of the file  - 1 chuỗi những ký tự khó hiểu
  // -> nếu mở file trên 1 basic text editor, ta sẽ thấy nội dung tương tự

  return { ok: true };
});
```

* **if upload a basic file**: _like **`.txt`** file with some plain text in it_
* -> we will see the **`request is broken up into different sections`** for **each form field**
* -> the sections are separated by the **form boundary** - which the **`browser will inject by default`**

```js - , the body might look like this:

Content-Disposition: form-data; name="file"; filename="dear-nugget.txt"
Content-Type: text/plain

I love you!
------WebKitFormBoundary4Ay52hDeKB5x2vXP--
```

* **buil-in tools**: 
* -> most `server frameworks` provide `built-in tools` to **`access the body of a request`**
* -> we can replace all the code above with:

```js - Nuxt provides a global "readBody" function
// replace the code above with "built-in" tool
export default defineEventHandler((event) => {
  const nodeRequestObject = event.node.req;

  const body = await readBody(event.node.req);
  console.log(body)

  return { ok: true };
});
```

# Problem with "a very large file" is uploaded
* -> works fine for other content types, but for **`multipart/form-data`**, it has issues
* -> the **`entire body of the request`** is being **`read into memory`** as one **`giant string of text`**
* -> this includes the **`Content-Disposition`** information, the **`form boundaries`**, and the **`form fields`** and **`values`**
* => the big issue here is if a very large file is uploaded, it could **consume all the memory of the application** and **cause it to crash**

* **Solution**: working with **`stream`**
* -> when our **`server receives a chunk of data`** from the **`request stream`**,
* -> instead of **`storing it in memory`**, we can **pipe it to a different stream** 
* -> specifically, we can **send it to a stream that writes data to the file system** using **fs.createWriteStream** 
* -> this is low-level code to create a **WritableStream** that can write to the file system (_but we can use high-level "formidable" library instead_)
* => _as the **`chunks come in`** from the request_, that **`data gets written to the file system`**, then **`released from memory`**
* => _each chunk is received, processed, then released from memory_
* => 

# Stream data onto disk (using library)
* _we need an library to handle file uploads, which includes:_
* -> **`parse multipart/form-data requests`**
* -> **`separate the files`** from the other form fields
* -> **`stream the file data into the file system`** (disk)
* -> provide with the **form field data** as well as **useful data about the files**

* **Note**:  
* -> in a standard application, it’s a good idea to **`store some of file information`** in **`a persistent place`** - like a **database**, 
* -> so you can **`easily find all the files`** that have been uploaded

```js - using "formidable" library 
// provides us with a handy function to parse multipart/form-data using promises 
// access the request’s regular form fields, as well as information about the files that were written to disk using "streams"

/**
 * @param {import('http').IncomingMessage} req
 */
function doSomethingWithNodeRequest(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true }) //  create a formidable instance
    form.parse(req, (error, fields, files) => { 
    // parse the request object, writes files to the disk (their storage location)
      if (error) {
        reject(error);
        return;
      }
      resolve({ ...fields, ...files }); 
      // resolve the promise with form fields data and the files data
    });
  });
}
```

* _examine the request body_
* -> **`an object`** containing **`all the form fields and their values`**
* -> but for each **`file input`**, we’ll see an **object that represents the uploaded file**, and **`not the file itself`**
* -> this object contains all sorts of **`useful information`** including its **path on disk**, **name**, **mimetype**, and more

```js
const body = await doSomethingWithNodeRequest(event.node.req);
console.log(body)

// Output:
{
  file-input-name: PersistentFile {
    _events: [Object: null prototype] { error: [Function (anonymous)] },
    _eventsCount: 1,
    _maxListeners: undefined,
    lastModifiedDate: 2023-03-21T22:57:42.332Z,
    filepath: '/tmp/d53a9fd346fcc1122e6746600',
    newFilename: 'd53a9fd346fcc1122e6746600', // hashed value to avoid loosing data if two files are uploaded with the same name
    originalFilename: 'file.txt',
    mimetype: 'text/plain',
    hashAlgorithm: false,
    size: 13,
    _writeStream: WriteStream {
      fd: null,
      path: '/tmp/d53a9fd346fcc1122e6746600',
      flags: 'w',
      mode: 438,
      start: undefined,
      pos: undefined,
      bytesWritten: 13,
      _writableState: [WritableState],
      _events: [Object: null prototype],
      _eventsCount: 1,
      _maxListeners: undefined,
      [Symbol(kFs)]: [Object],
      [Symbol(kIsPerformingIO)]: false,
      [Symbol(kCapture)]: false
    },
    hash: null,
    [Symbol(kCapture)]: false
  }
}
```

# create a reusable code:
* _API accept multipart/form-data, plain text, or URL-encoded requests_
* -> check the request headers, and assign the value of the **`body`** based on the **`Content-Type`**
* -> only use "formidable" for **`process "multipart/form-data" requests`**
* -> **`everything else`** can be handled by **`a built-in body parser`** 

```js
import formidable from 'formidable';

export default defineEventHandler(async (event) => {
  let body;
  const headers = getRequestHeaders(event); // Nuxt,js build-in function 

  if (headers['content-type']?.includes('multipart/form-data')) {
    body = await parseMultipartNodeRequest(event.node.req);
  } else {
    body = await readBody(event);
  }
  console.log(body);

  return { ok: true };
});

/**
 * @param {import('http').IncomingMessage} req
 */
function parseMultipartNodeRequest(req) {
  // return a promise 
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true })
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ ...fields, ...files });
    });
  });
}
```

