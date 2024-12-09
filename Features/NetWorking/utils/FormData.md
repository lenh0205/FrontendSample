==================================================
# "FormData" in JavaScript
* is is the easiest way to **`upload files`** using JavaScript (**`without submitting an actual HTML form`**)

```js - send a "file"
// <input type="file" id="my-input">

const input = document.querySelector('#my-input');
const formData = new FormData();
formData.append('myFile', input.files[0]);

axios.post('/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

==================================================
# FormData
* -> simply **`a data structure`** that can be used to **`store key-value pairs`** designed for **`holding forms data`**
* -> use it to build **`an object**` that **`corresponds to an HTML form`**

## Method
* **append()** : used to append a key-value pair to the object. If the key already exists, the value is appended to the original value for that key
* **set()**:  used to add a value to the object, with the **`specified key`**. This is going to relace the value if a key already exists,
* **get()**: used to **`return the value`** for **`a key`**. If multiple values are appended, it returns the first value,
* **getAll()**: used to return **`all the values`** for a **`specified key`**,

==================================================
# Posting data as "multipart/form-data" using Axios

```js
// Browser
const form = new FormData();
form.append('my_field', 'my value');
form.append('my_buffer', new Blob([1,2,3]));
form.append('my_file', fileInput.files[0]);
axios.post('https://example.com', form)
// or:
axios.postForm('https://httpbin.org/post', {
  my_field: 'my value',
  my_buffer: new Blob([1,2,3]),
  my_file:  fileInput.files // FileList will be unwrapped as sepate fields
});


// Node.js
import axios from 'axios';
import {fileFromPath} from 'formdata-node/file-from-path'; // for creating "Blob" from "File"

const form = new FormData();
form.append('my_field', 'my value');
form.append('my_buffer', new Blob(['some content']));
form.append('my_file', await fileFromPath('/foo/bar.jpg'));

axios.post('https://example.com', form)
```

## Automatic serialization
* Axios supports automatic **`object serialization to a FormData object`** if the request **`Content-Type header`** is set to **`multipart/form-data`**

```js - this request will submit the data in a "FormData" format 
axios
  .post('https://httpbin.org/post', 
  {
    user: { name: 'Dmitriy' },
    file: fs.createReadStream('/foo/bar.jpg')
  }, 
  { headers: { 'Content-Type': 'multipart/form-data' } })
  .then(({data})=> console.log(data));
```
