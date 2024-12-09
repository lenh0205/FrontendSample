> all the status code: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

=================================================
# Handle the error response
* using **catch()** function - that will be called for **`status codes outside the range of 2xx`**

#  Status Code of an Axios HTTP Error
* the **status** property on the **`error.response`** object through **`catch block`** returns the _status code_ that was issued by the server in a response to the client's request

* _need to check if the `error.response object is populated`_
* -> if the error occurred when setting up the request or because the server didn't respond at all, the error.response object will not be populated

## majority of the HTTP errors 
* **`4xx client error`** (the request contains bad syntax or cannot be fulfilled)
* **`5xx server error`** (the server failed to fulfill a valid request)

```js
import axios from 'axios';

async function makeRequest() {
  try {
    const res = await axios.get('https://example.com/does-not-exist');
    const data = res.data;
    console.log(data);
  } catch (err) {
    if (err.response) {
      console.log(err.response.status);
      console.log(err.message);
      console.log(err.response.headers); // {... response headers here}
      console.log(err.response.data); // {... response data here}
    }
    else if (error.request) {
      // Request was made, but no response was received
      console.log(error.request);
    } else {
      // An error was thrown when setting up the request
      console.log(error.message);
    }
  }
}
makeRequest();
```

* Using the **validateStatus** config option, to define **`which HTTP codes that should throw an error`**
```js
axios.get('/user/12345', {
  validateStatus: function (status) {
    return status < 500; // Resolve only if the status code is less than 500
  }
})
``` 

* Using **toJSON** to get an object with **`more information about the HTTP error`**
```js
axios
  .get('/user/12345')
  .catch(function (error) {
    console.log(error.toJSON());
  });
```