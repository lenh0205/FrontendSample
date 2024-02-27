
================================================
# Buffer / Data Buffer
* is a **region of a memory** (_usually in RAM_) used to **store data temporarily** _while it is being moved from one place to another_
* -> more specifically, to manage **chunks** data and sends it for processing

* sometimes, _`the processing speed is less than the rate of receiving chunks`_ or _`faster than the rate of receiving chunks`_; 
* => in both cases, it is **necessary to hold the chunks** because **processing requires a minimum amount of it**, which is done using the **`buffers`**

* a suitable very small-sized block for binary data
* => **`if the buffer is full then the data is sent for processing`**

* sometimes, buffer is used as **`middleware between the "processing of data" and "incoming"`**
* -> sometimes processor is busy with some other task so we need to transfer the data somewhere need to be stored

## Ứng dụng
* -> thường áp dụng cho các quá trình input/output, khi mà tốc độ nhận và xuất dữ liệu có sự khác biệt lớn

* VD: _thường được áp dụng rất nhiều trên các website `nghe nhạc, xem phim, livestream`_
* -> thay vì `tải toàn bộ dữ liệu` của video, nhạc rồi mới chạy
* -> `tải từng phần` của video, nhạc và `chạy từng phần` nội dung đó mỗi khi dữ liệu được tải về máy
* => nếu xem nhanh quá thì phải chờ dữ liệu được tải thêm cho đến khi hoàn thành
* => ngược lại, nếu tốc độ tải về từng phần này nhanh hơn tốc độ xem video của user thì user sẽ có thể xem một cách liên tục mà không bị giật

===================================================
# "buffer" module of NodeJS
* **`Buffer`** - is an **abstraction** allow to **`deal with raw binary data`** in Node.js
* -> particularly relevant when dealing with _files_ and _networks_ or _I/O_ in general
* -> is implemented using Uint8Array

* **`a buffer`** - represents **a chunk of memory** that is allocated to our computer
* -> is used to **`store bytes`**
* -> the size of the buffer, once set, **`cannot be changed`**

```js - "Khởi tạo" buffer
// create an buffer of 5 octets:
var ubuf = Buffer.alloc(5); 

// creates the buffer from "HEX string":
const bufferFromHex = Buffer.from('4369616f2068756d616e', 'hex');
console.log(bufferFromHex) // <Buffer 43 69 61 6f 20 68 75 6d 61 6e>

// creates the buffer from given "Array":
const bufferFromByteArray = Buffer.from([67, 105, 97, 111, 32, 104, 117, 109, 97, 110]);
console.log(bufferFromByteArray) // <Buffer 43 69 61 6f 20 68 75 6d 61 6e>

// creates the buffer from "Base64 string":
const bufferFromBase64 = Buffer.from('Q2lhbyBodW1hbg==', 'base64')
console.log(bufferFromBase64) // <Buffer 43 69 61 6f 20 68 75 6d 61 6e>

// creates the buffer from "string":
const bufferFromString = Buffer.from('Ciao human');
console.log(bufferFromString) // <Buffer 43 69 61 6f 20 68 75 6d 61 6e>

// Raw buffer data can be "visualized" as a string / hex / base64:
console.log(bufferFromString.toString('utf-8')) // Ciao human ('utf-8' is the default)
console.log(bufferFromString.toString('hex')) // 4369616f2068756d616e
console.log(bufferFromString.toString('base64')) // Q2lhbyBodW1hbg==

// get the size of a buffer in bytes:
console.log(bufferFromString.length) // 10

// create a buffer from "string" with "ascii" encoding
var sbuf = new Buffer("GeeksforGeeks", "ascii");
```

```js - "write data" into a node buffer
buf.write(string, offset, length, encoding)
// -> string - string data to be written into the buffer
// -> offset -  the index at which buffer starts writing (default = 0)
// -> length - the number of bytes we want to write (default = buffer.length)
// -> encoding -  encoding mechanism (default is "utf-8")
```
* -> return the **`number of octets in which string is written`**
* -> if buffer does not have enough space to fit the entire string, it will **`write a part of the string`**

```js - "read data" from a node buffer
buf.toString(encoding, start, end)
// -> start - the index to start reading (default = 0)
// -> end - the index to end reading (default is "complete buffer")

rbuf = new Buffer(26); 
var j; 
for (var i = 65, j = 0; i < 90, j < 26; i++, j++) {  
    rbuf[j] = i ;  
}  
console.log(rbuf.toString('ascii')); // ABCDEFGHIJKLMNOPQRSTUVWXYZ      
```

================================================
# using "Buffer" to copy file:

```js - a Node.js script to copy a file from one place to another
// buffer-copy.js
import { readFile, writeFile } from 'fs/promises'

// `src` is the first argument from cli, `dest` the second
const [src, dest] = process.argv

async function copyFile (src, dest) {
  // read entire file content
  const content = await readFile(src)
  // write that content somewhere else
  return writeFile(dest, content)
}

// start the copy and handle the result
copyFile(src, dest)
  .then(() => console.log(`${src} copied into ${dest}`))
  .catch((err) => { console.error(err); process.exit(1) })
```

* **Problem**:
* -> if it's _a small file_, then everthing is OK
* -> but when it come to _copy a big file_ (_VD: 3 Gb_), then **`script dramatically failing`** with the error:
```r
RangeError [ERR_FS_FILE_TOO_LARGE]: File size (3221225472) is greater than 2 GB
    at readFileHandle (internal/fs/promises.js:273:11)
    at async copyFile (file:///.../streams-workshop/01-buffer-vs-stream/buffer-copy.js:8:19) {
  code: 'ERR_FS_FILE_TOO_LARGE'
}
```

* **Reason**:
* -> when we use _fs.readFile_ we load all the binary content from the file in memory **`using a Buffer object`** 
* -> but by design Buffers are **`limited in size`** as they live in memory.

* **Solution**: **`create a buffer with the maximum allowed size`**
```js - Careful, this will allocate a few GBs of memory!
// biggest-buffer.js:
import buffer from 'buffer'

// creates a buffer with the maximum possible size
const biggestBuffer = Buffer.alloc(buffer.constants.MAX_LENGTH) 

console.log(biggestBuffer);
// <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 4294967245 more bytes>
```

================================================
# The  is ArrayBuffer – basic binary object 
* a reference tới 1 **`vùng nhớ liền kề có độ dài cố định`**