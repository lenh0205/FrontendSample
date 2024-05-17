
# Get "query parameter" by javascript
```js
const urlParams = new URLSearchParams(window.location.search);
const urlParams = (new URL(window.location)).searchParams;
const urlParams = new URLSearchParams((new URL('https://example.com?foo=1&bar=2')).search);

const myParam = urlParams.get('myParam'); // get specific query param
const params = Object.fromEntries(urlSearchParams.entries()); // get all query params
```

# Generate Guid / uuid
https://www.geeksforgeeks.org/how-to-create-a-guid-uuid-in-javascript/ 
```js
```