> Nodejs has features to do tasks asynchronously without blocking the main thread

# fs - File System module 
* -> allow us to **`work with the file system`** on our computer

* **Read File**
* -> trong 1 số trường hợp ta sẽ phải **`đọc file 1 cách synchronous`** như **`reading configuration data from a file`** and using it further downs the line 
* -> but normally we don't want this synchronous behavios; we will **`read file asynchronous`**
* => because if we have a lot of **concurrent users and the file size is large**, the users will **`be block`** for some time
* => the performace will be really poor

* **Write File**
* -> **by default**, it **`create the file with content`** if the file is not exist and **`override file content`** if it already exist
* -> to **`append new content`** to the existed content, we can add an option as argument

## Examples
```js - read file ".txt" content sync with "utf-8"
// create an "file.txt" file with content "Hello Codevolution"

const fs = require("node:fs");

// Read the content of a file
const fileContents = fs.readFileSync("./file.txt");
console.log(fileContents); // <Buffer 48 65 6c 6c 6f 20 43 6f 64 65 76 6f 6c 75 74 69 6f 6e>

// to view it in human readable format 
const fileContents = fs.readFileSync("./file.txt", "utf-8");
console.log(fileContents); // Hello Codevolution
```

```js - read file ".txt" async with "utf-8"
fs.readFile("./file.txt", (error, data) => { // invoked after the file contents have been read
    if (error) {
        console.log(error)
    } else {
        console.log(data) // <Buffer 48 65 6c 6c 6f 20 43 6f 64 65 76 6f 6c 75 74 69 6f 6e>
    }
}) 

fs.readFile("./file.txt", "utf-8",(error, data) => {
    if (error) {
        console.log(error)
    } else {
        console.log(data) // Hello Codevolution
    }
}) 
```

```js - write contents (a string) into a ".txt" file sync
// Synchronous
// -> first argument is "path to the file"; 
// -> second argument is "file content" we want to write into
fs.writeFileSync("./greet.txt", "Hello world!")
// => khi ta chạy, ta sẽ thấy 1 file mới tên "greet.txt" được tạo ra với nội dung "Hello world!"
```

```js - write contents (a string) into a ".txt" file async
// Asynchronous
// -> first argument is "path to the file"; 
// -> second argument is "file content" we want to write into
// -> third argument is "error first callback"
fs.writeFile("./greet.txt", "Hello Vishwas!", (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("File written");
    }
})
// => khi ta chạy, ta sẽ thấy nội dung file "greet.txt" bị ghi đè lại thành "Hello Vishwas!" và log window hiện "File written"
```

```js - write contents (a string) into a ".txt" file async (append instead override)
fs.writeFile("./greet.txt", " Hello Vishwas!", { flat: "a" }, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("File written");
    }
})
// => khi ta chạy, ta sẽ thấy nội dung file "greet.txt" chuyển thành "Hello Vishwas! Hello Vishwas!"
```

====================================================
## fs Promise module - use "Promise" instead of "callback"