===================================================================
# AJAX
```js
$.ajax({
    type: "GET",
    url: "...",
    dataType: "json",
    headers: {
        Authorization: "Basic " + btoa(usesname + ":" + password);
    }
    data: '{"comment"}',
    success: function () {
        alert("thank for your common");
    }
})
```

===================================================================
# request with "Authorization" header using "Basic Auth"
* -> **`Basic auth`** is a type of **HTTP authentication scheme** that uses **a username and password pair** to authenticate a user or a client to a server
* -> the username and password are **`joined by a single colon ":"`**, then **`encoded using Base64`** and sent in the **`Authorization header`** of the HTTP request

```js
const encoded = btoa(username + ':' + password);
// hoặc const encoded = Buffer.from(username + ':' + password).toString('base64');
await axios.get('https://example.com/api', {
    headers: { 'Authorization': 'Basic ' + encoded }
})

// hoặc
axios.get('https://example.com/api', { 
    auth: { username, password} 
})
```

# request with "Authorization" header using "Bearer Token"
* -> the **`token`** (_in Token-based authentication_) - a **cryptic string that represents the user’s identity and permissions**
* -> is usually **`generated by the server in response to a login request`**, and can be verified by the server **`without requiring the user to provide their credentials again`**

```js
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

axios.get('https://example.com/api', { 
    headers: { 'Authorization': 'Bearer ' + token } 
})
```