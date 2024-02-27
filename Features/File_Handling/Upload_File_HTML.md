
# Access Files System - HTML Form
* -> **`browsers can’t access our file systems`** (_but there's an experimental `File System Access API`_), because it can cause a major security concern
* -> **`accessing a file requires user interaction`** and Browser provide **<input type="file">** element to **`select a file from user device`**
* -> to **`actually send the file to a server`**, we need to make an **HTTP request, which means we need a <form>**
* -> put the **`file input`** inside along with a **`<button> to submit`** the **`form`**

# Include a "Request Body"
```js
<form>
  <label for="file">File</label>
  <input id="file" type="file" />
  <button>Upload</button>
</form>
```

* **Problem**:
* -> as we _submit the form_,  it generates a **`GET request`**, and the payload is sent as a **`query string`** (_?name=filename.txt_)
* -> a **`key-value pair`**, with the _key_ being the _input name_ and the _value_ being the _name of the file_
* -> **this is sent as a string**, we **`can not put a file in the query string parameters`**

* **Solution**:
* -> we need to **`put the file in the body of the request`** by sending POST request using form’s **method** attribute equal to **`post`** 
* -> the request has **`a payload`** containing the **form’s data**

```js
<form method="post">
  <label for="file">File</label>
  <input id="file" name="file" type="file" />
  <button>Upload</button>
</form>
```

# Set the "Content-Type"
* **Problem**:
* -> the data is still just a **`key-value pair`** with the **`input "name"`** and the **`filename`**
* -> we’re still **`not actually sending the file`**, and the reason has to do with the requested **Content-Type**

* **By Default**:
* -> when **`a form is submitted`**, the request is sent with a **`Content-Type`** of **application/x-www-form-urlencoded**
* -> and unfortunately, we **`can not send the binary file information`** as **URL encoded data**

* **Solution**: to send the file contents as **binary data**
* -> change the **`Content-Type`** of the request to **multipart/form-data**
* -> to achieve that, we can set the form’s **enctype** attribute

```js
<form method="post" enctype="multipart/form-data">
  <label for="file">File</label>
  <input id="file" name="file" type="file" />
  <button>Upload</button>
</form>

// POST method
// Content-Type: multipart/form-data
// -> in Chromium browsers, no longer see the request payload
// -> in the Firefox devtools we can see it under the request Params tab.
```
