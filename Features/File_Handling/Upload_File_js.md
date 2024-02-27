
# Upload File with Javascript
* -> still need the  **`<input> with the "file" type`** to access the **`file system`** on user device
* -> but using **`Fetch API`** of Browser to make HTTP request instead of using a <form> element
* -> for JavaScript to submit this form, we set up a **"submit" event handler**

* **principle of progressive enhancement**: ta vẫn sẽ include a HTML form bên dưới
* -> **`if JavaScript fails`** for whatever reason, the HTML form will still work; so **`file upload works the same`** when JavaScript is working properly or when it fails
* -> and we can relies on the **`underlying HTML`** as **`the declarative source of configuration`** for our javascript (`action` and `method` attribute) to make **`reusable event handler`**

```html
<form action="/api" method="post" enctype="multipart/form-data">
  <label for="file">File</label>
  <input id="file" name="file" type="file" />
  <button>Upload</button>
</form>
```

## Submit Event Handler
* -> call the event’s **preventDefault** method to **`stop the browser from reloading the page to submit the form`**
* -> get the **URL** from the form’s **`action`** property (_if not define, default to the browser’s current URL_)
* -> use **Fetch API** with **`POST method`** as value of form’s **`method`** attribute in the HTML

## Add the "Request body"
* **Problem**:
* -> we may have included the **`body`** as a **`JSON string`** or a **`URLSearchParams`** object
* -> but _neither of those will work to send a file_, as they **`don’t have access to the binary file contents`**
* => for the browser to **send the file as binary data**, it needs to make **a multiplart/form-data request**

* **Solution**
* => use **FormData** browser API to construct the **`request body`** from the **`form DOM node`**
* -> this even sets the request’s **Content-Type** header to **multipart/form-data** (_a necessary step to transmit the binary data_)

```js
const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);

/** @param {Event} event */
function handleSubmit(event) {
  const form = event.currentTarget;
  const url = new URL(form.action);
  const method = form.method;
  
  const formData = new FormData(form);

  const fetchOptions = {
    method: method,
    body: formData
  };

  fetch(url, fetchOptions);
  
  event.preventDefault();
  // -> exception thrown - preventDefault will not be called, do the default behavior
}
```

## For Reusable
* -> handle both **`GET`** and **`POST`** requests, and send the appropriate **`Content-Type`** header

* if **`GET`** -> modify the **`URL to include the data as query string parameters`**

* if **`POST`**, 
* -> set body to **URLSearchParams** object - browser will **`automatically`** set the **`Content-Type`** header to **application/x-www-form-urlencoded**
* -> set body to **FormData** object - browser will **`automatically`** set the **`Content-Type`** header to **multipart/form-data**

```js - use for any form 
/** @param {Event} event */
function handleSubmit(event) {
  /** @type {HTMLFormElement} */
  const form = event.currentTarget;
  const url = new URL(form.action);
  const formData = new FormData(form);
  const searchParams = new URLSearchParams(formData);

  /** @type {Parameters<fetch>[1]} */
  const fetchOptions = {
    method: form.method,
  };

  if (form.method.toLowerCase() === 'post') {
    if (form.enctype === 'multipart/form-data') {
      fetchOptions.body = formData;
    } else {
      fetchOptions.body = searchParams;
    }
  } else {
    url.search = searchParams;
  }

  fetch(url, fetchOptions);

  event.preventDefault();
}
```
