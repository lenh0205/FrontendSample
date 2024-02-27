
==================================================
# HTML form
* _an HTML form_ on a web page is nothing more than a convenient user-friendly way to **`configure an HTTP request`** to **`send data to a server`**

* _A POST request is often sent using an HTML form or AJAX_

## The <form> element defines how the data will be sent
* -> all of its attributes are designed to let you **`configure the request`** to be **`sent when a user hits a submit button`**
* -> the 2 most important attributes are **action** and **method**

## "action" attribute
* -> defines **`where the data gets sent`** - a valid relative or absolute **`URL`** (_If attribute isn't provided, data will be sent to the `current page URL`_)

```js
<form action="https://example.com">…</form> // absolute URL
<form action="/somewhere_else">…</form> // relative URL
```

## "method" attribute
* -> defines **`how data is sent`** (serveral way, most common is **`GET`** method and **`POST`** method)

### GET method
* -> GET method ask Server for a resource; this case, the browser **`sends an empty body`**
* => _if a `form` is sent using this method_ the **`data sent to the server is appended to the URL`** as a series of **`name/value`** pairs

```js
<form action="http://www.foo.com" method="GET">
  <div>
    <label for="say">What greeting do you want to say?</label>
    <input name="say" id="say" value="Hi" />
  </div>
  <div>
    <label for="to">Who do you want to say it to?</label>
    <input name="to" id="to" value="Mom" />
  </div>
  <div>
    <button>Send my greetings</button>
  </div>
</form>

// when submitting the form, the URL "www.foo.com/?say=Hi&to=Mom" appear in the browser address bar
Request URL: "http://www.foo.com/?say=Hi&to=Mom" 
Query String Parameters: say=Hi&to=Mom
```

### POST method
* If a form is sent using this method, the data is **`appended to the body of the HTTP request`**

* this is important because
* -> never use the GET method to send a sensitive piece of data (_VD: password_)
* -> browsers limit the sizes of URLs; preferred POST method to send a large amount of data

```js
<form action="http://www.foo.com" method="POST">
  <div>
    <label for="say">What greeting do you want to say?</label>
    <input name="say" id="say" value="Hi" />
  </div>
  <div>
    <label for="to">Who do you want to say it to?</label>
    <input name="to" id="to" value="Mom" />
  </div>
  <div>
    <button>Send my greetings</button>
  </div>
</form>

// when the form is submitted; no data appended to the URL, with the data included in the request body instead:
POST / HTTP/2.0
Host: foo.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 13

Form Data: say=Hi&to=Mom
```

==================================================
# AJAX "FormData"
* -> allow us to build form object automatically
* -> can contain files from the user's file system
* -> then send this form through AJAX (**`avoid the page refresh`**, ...)

## Process
*  **`prevent default form submit event`** with **event.preventDefault();**

* **`lấy data từ Form`**:
* -> s/d **event.target.elements** nếu muốn lấy tất cả phần tử
* -> s/d DOM interface **FormData** - constructor nhận **`form object`** làm đối số

* catch **formdata** Event
* -> this event get triggered whenever we call **`new FormData()`**
* -> help us seperate the first EventListener from any other callback for processing practical form data (_Ex: call API, ..._) 

* **Note**: FormData base on ***`name`** attribute 

```html
<body>
    <form>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required>

        <label for="description">Description</label>
        <input type="text" id="description" name="description" required>

        <label for="task">Task</label>
        <textarea id="task" name="task" required></textarea>

        <button type="submit">Submit</button>
    </form>
</body>
<script>
    var form = document.forms[0];

    // when user click "submit" button
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // prevent "submit form" event
        new FormData(form); // create a "FormData" from "form"
    });

    form.addEventListener("formdata", event => {
        const data = event.formData; // get real data from "FormData"

        // Extract a value array:
        const values = [...data.values()] //  Output: ["Khoa", "Trip to London", "Trip to New York"]

        // Extract an array of entries (key/value - "name" field/"value" field)
        const entries = [...data.entries()]; //  [['name', 'lee'], ['description', 'nice'], ['task', 'small']]

        fetch('/api', { method: 'POST', body: data })
        // -> Enter:    Name: Lee   Description: nice    Task: ten
        // -> Output:
        // ------WebKitFormBoundaryRJibfvqKEIMKphGm
        // Content-Disposition: form-data; name="name"

        // Lee
        // ------WebKitFormBoundaryRJibfvqKEIMKphGm
        // Content-Disposition: form-data; name="description"

        // nice
        // ------WebKitFormBoundaryRJibfvqKEIMKphGm
        // Content-Disposition: form-data; name="task"

        // ten
        // ------WebKitFormBoundaryRJibfvqKEIMKphGm--
    });
</script>
```

==================================================
# Receive data on Server-side
* -> the server **`receives a string`** that will be **`parsed`** in order to get the data as **`a list of key/value pairs`**

====================================================
# Special Case: using HTML Form to send "files"
* -> **Files are binary data**, while all other data is **`text data`**
* -> because **HTTP is a text protocol**, there are special requirements for handling binary data

## 3 step to send files:
* -> include <input type="file"> controls to **`access a file`** on the user’s device
* -> set the **`method`** attribute to **`POST`**
* -> set the value of **`enctype`** attribute to **multipart/form-data**

* _because the data will be `split into multiple parts`_; each part correspond to **each file** or the **text data** included in the **`form body`**

```js
<form method="post" action="https://www.foo.com" enctype="multipart/form-data">
  <div>
    <label for="file">Choose a file</label>
    <input type="file" id="file" name="myFile" />
  </div>
  <div>
    <button>Send the file</button>
  </div>
</form>
```

## The "enctype" attribute of <form>
* -> allows us specify the value of the **`"Content-Type" HTTP header`** included in the request **`generated when the form is submitted`**
* -> this header tells the server what _kind of data is being sent_

* -> **`by default`**, its value is **application/x-www-form-urlencoded** - it means **`form data that has been encoded into URL parameters`** (_same format as query strings format_)
* -> text/plain: This is used for debugging

* The value of _"enctype"_ can be overridden by the **formenctype** attribute on the <button>, <input type="submit">, or <input type="image"> elements

## "multipart/form-data" as value
* -> Each form data value is sent as a block of data - **`body part`**, 
* -> with a user agent-defined delimiter - **`boundary`** separating each part. The keys are given in the Content-Disposition header of each part 

```r
POST / HTTP/2.0
Host: example.com
Content-Type: multipart/form-data; boundary=aBoundaryString

--boundary
Content-Disposition: form-data; name="name"

(value for name)
--boundary
Content-Disposition: form-data; name="profile-pic"; filename="bob.jpg"
Content-Type: image/jpeg

(value for profile-pic)
--boundary
```

=====================================================
# Security 
* -> _HTML forms_ are by far **`the most common server attack vectors`**
* -> the problems **`never come from the HTML forms themselves`** but rather come from **how the server handles data**

* All data that comes to your server must be _checked and sanitized_
* -> **`Escape potentially dangerous characters`** - watch out for are character sequences that look like executable code (_Javascript or SQL_)
* -> **`Limit the incoming amount of data to allow only what's necessary`**
* -> **`Sandbox uploaded files`** - store them on a different server and allow access to the file only through a different subdomain or even better through a completely different domain.