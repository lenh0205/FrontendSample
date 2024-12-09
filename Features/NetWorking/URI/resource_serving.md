
# create URL for a File - createObjectURL
* -> method of the **URL interface** 
* -> creates an **`object URL`** representing the object given (**`File`**, **`Blob`**, **`MediaSource`**)
* -> **`return a string`** containing an object URL that can be used to **reference the source contents**

* -> the **`URL lifetime`** is tied to the **document** in the window on which it was created
* -> to release an object URL call **`revokeObjectURL()`**