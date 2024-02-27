# File
* -> **an interface provides information about files** - allows JavaScript in a web page to access their content
* -> **`File objects`** are generally retrieved from a **FileList** object or from a drag and drop operation's **DataTransfer** object
* -> a File object is **`a specific kind of Blob`** - can be used in any context that a Blob can 
* => **FileReader**, **URL.createObjectURL()**, **createImageBitmap()**, the **body option to fetch()**, and **XMLHttpRequest.send()** accept both Blobs and Files

## Constructor
* -> **`File()`**
* -> File interface **`inherits properties, methods from the Blob interface`**
* -> own property: **lastModified** (readonly) , **lastModifiedDate** (readonly) , **name** (readonly) , **webkitRelativePath** (readonly)

=============================================
# Convert "Blob" to "File"
> sometimes, we would like to have a File but we get a Blob object instead 

```js - Ex: when we use blob() on a fetch response object
fetch('./image.jpeg')
    .then((res) => res.blob())
    .then((myBlob) => {
        console.log(myBlob);
        // logs: Blob { size: 1024, type: "image/jpeg" }
    });
```

## "File" vs "Blob"
* -> **`File inherits all properties from Blob`**
* -> _but compare to Blob_, File has a **name** and **lastModified** property

* **so To convert a "Blob" to a "File"**: we can take two way
* -> **`add the two properties to the Blob`** to make it seem like a File
* -> **`create an actual File instance`**

## Making a Blob quack like a File
* suitable for IE11 because it doesn’t support the File constructor

```js
// the Blob instance from fetch request
myBlob.name = 'image.jpeg';
myBlob.lastModified = new Date();

// Blob seems like a File but it’s not a real File:
console.log(myBlob instanceof File); // false
console.log(myBlob); // Blob { name: "image.jpeg", lastModified: ..., size: 1024, type: "image/jpeg" }
```

## Creating an actual File

```js
const myFile = new File([myBlob], 'image.jpeg', {
    type: myBlob.type,
});

console.log(myFile); //  File { name: "image.jpeg", lastModified: ..., size: 1024, type: "image/jpeg" }

console.log(myFile instanceof File); // true
console.log(myFile instanceof Blob); // true -  inherits from Blob 
```
