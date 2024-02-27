
# Binary data in web-development - javascript
* **`data in the form of 0 and 1`** that a computer can only understand this kind of data

* -> thường dùng để **`dealing with files`** (_create, upload, download_), **`image processing`**, ...; vì **binary operations** are high-performant
* -> binary data in JavaScript is implemented **`in a non-standard way`** (_compared to other languages_)

====================================================
# ArrayBuffer - the basic binary object
* **`a reference to a fixed-length contiguous memory area`** stores a **`raw sequence of bytes`**
* -> is the **core object, the root of everything, the raw binary data**
* -> but for `almost any operation` (_write into it, iterate over it, ..._) we must use a **view**

```js - VD
// allocates a contiguous memory area of 16 bytes and pre-fills it with zeroes
let buffer = new ArrayBuffer(16); // create a buffer of length 16
alert(buffer.byteLength); // 16
```

## ArrayBuffer is different from Array
* -> has a **`fixed length`**, we can’t increase or decrease it.
* -> it takes exactly that much space in the memory.
* -> to access individual bytes, **view** object is needed (_not buffer[index]_)

## "View" object
* -> _Uint8Array, Uint16Array, Uint32Array, Float64Array, ..._ 
* -> **`does not store anything on its own`**
* ->  just **`give an interpretation of the bytes`** stored in the ArrayBuffer

* -> **`Uint8Array`** – treats each byte in ArrayBuffer as a separate number, with possible values from 0 to 255 (a byte is 8-bit, so it can hold only that much). Such value is called a “8-bit unsigned integer”.
* -> **`Uint16Array`** – treats every 2 bytes as an integer, with possible values from 0 to 65535. That’s called a “16-bit unsigned integer”.
* -> **`Uint32Array`** – treats every 4 bytes as an integer, with possible values from 0 to 4294967295. That’s called a “32-bit unsigned integer”.
* -> **`Float64Array`** – treats every 8 bytes as a floating point number with possible values from 5.0x10-324 to 1.8x10308

* => so the `binary data` in an ArrayBuffer of 16 bytes **`can be interpreted as`**:
* -> as 16 "tiny numbers" (1 byte each), 
* -> or 8 bigger numbers (2 bytes each), 
* -> or 4 even bigger (4 bytes each), 
* -> or 2 floating-point values with high precision (8 bytes each)

```js
alert(Uint32Array.BYTES_PER_ELEMENT); // 4 bytes per integer

let buffer = new ArrayBuffer(16); // create a "buffer" of length 16
let view = new Uint32Array(buffer); // create "view" from buffer

alert(view.length); // 4, it stores that many integers
alert(view.byteLength); // 16, the size in bytes

view[0] = 123456;
for(let num of view) {
  alert(num); // 123456, then 0, 0, 0 (4 values total)
}   
```

======================================================
# TypedArray
* -> chỉ là 1 thuật ngữ chung for all the views (Uint8Array, Uint32Array, ...)
* -> there’s **`no constructor called "TypedArray"`** (_`new TypedArray()` nghĩa là đang nói về `new Int8Array, new Uint8Array,...`_) 

* -> like regular arrays: have **`indexes`** and are **`iterable`**

## Access underlying "ArrayBuffer" 
* -> **buffer** property– references the ArrayBuffer.
* -> **byteLength** property– the length of the 

* we can create a **`TypedArray`** directly, without mentioning **`ArrayBuffer`**
* -> but practically, a view _cannot exist without an underlying ArrayBuffer_
* -> so **ArrayBuffer will gets created automatically** in all these cases (_unless we specify it_)

```js - move from one view to another view
let arr8 = new Uint8Array([0, 1, 2, 3]);
let arr16 = new Uint16Array(arr8.buffer); // another view on the same data
```

## Create a TypedArray:
* -> A typed array constructor behaves differently depending on **5 argument types**
```js
new TypedArray(buffer, [byteOffset], [length]);
new TypedArray(object);
new TypedArray(typedArray);
new TypedArray(length);
new TypedArray();
```

* supply an **ArrayBuffer** argument to create a TypedArray
* -> can also provide **`byteOffset`** to start from (0 by default) and the **`length`** (till the end of the buffer by default),
* -> to **`create a the view that cover only a part of the buffer`**

* supply an **Array** or any **array-like object**
* -> creates a typed array of the **`same length`** and **`copies the content`**
```js
let arr = new Uint8Array([0, 1, 2, 3]);
alert(arr.length); // 4, created binary array of the same length
alert(arr[1]); // 1, filled with 4 bytes (unsigned 8-bit integers) with given values
```

* supply another **TypedArray**
* -> creates a typed array of the **`same length`** and **`copies values`**
* -> values are converted to the new type in the process, if needed
```js
let arr16 = new Uint16Array([1, 1000]);
let arr8 = new Uint8Array(arr16);
alert( arr8[0] ); // 1
alert( arr8[1] ); // 232, tried to copy 1000, but can't fit 1000 into 8 bits
```

* supply a numeric argument **length**
* -> creates the typed array to contain that many elements
* -> **`byte length`** = **`length`** x **`TypedArray.BYTES_PER_ELEMENT`**(_the number of bytes in a single item_)
```js
let arr = new Uint16Array(4); // create typed array for 4 integers
alert( Uint16Array.BYTES_PER_ELEMENT ); // 2 bytes per integer
alert( arr.byteLength ); // 8 (size in bytes)
```

* supply **no arguments** -> creates an **`zero-length typed array`**

##  List of Typed Arrays
* **`Uint8Array`** (0 to 255), **`Uint16Array`** (0 to 65535), **`Uint32Array`** (0 to 4294967295)

* **`Uint8ClampedArray`** (0 to 255) –> for 8-bit integers, **clamps** them on assignment (see below)

* **`Int8Array`**(-128 to 127), **`Int16Array`** (-32768 to 32767), **`Int32Array`** (-2147483648 to 2147483647)

* **`Float32Array`** (-3.4E38 to 3.4E38), **`Float64Array`** (-1.8E308 to 1.8E308) 

* **`BigInt64Array`** (-2^63 to 2^63 - 1) , **`BigUint64Array`** (0 to 2^64 - 1)

```js
var array = new Uint8Array(100);    
array[10] = 256; // 2^8 bit > 255
array[10] === 0 // true
```

## TypedArray methods
*  iterate like array: **`map, slice, find, reduce,...`** but no **`splice, concat`** (_because typed arrays are views on a buffer, and buffer are fixed_)

* **`2 additional methods`**
* -> **arr.set(fromArr, [offset])** copies all elements from **`fromArr`** to the **`arr`**, starting at position **`offset`** (0 by default).
* -> **arr.subarray([begin, end])** **`creates a new view`** of the same type from begin to end (exclusive). That’s similar to slice method (that’s also supported), but doesn’t copy anything – just creates a new view, to operate on the given piece of data.

## "Out-of-bounds" behavior
* tức là chuyện gì sẽ xảy ra nếu ta write 1 giá trị lớn hơn giới hạn cho phép chứa của 1 Typed Array ?
* -> **There will be no error. But extra bits are cut-off, only take the rightmost**
* -> thường thì ta sẽ dùng **`Uint8ClampedArray`** for image processing

* **Uint8ClampedArray** rất đặc biệt, its behavior is different: saves 255 for any number that is greater than 255, and 0 for any negative number

```js
let num1 = 256;
alert(num.toString(2)); // 100000000 (9 bits)

let num2 = 257;
alert(num.toString(2)); // 100000001 (9 bits)

// "Uint8Array" only provides 8 bits per value (0 to 255)
let uint8array = new Uint8Array(16);
uint8array[0] = 256;
uint8array[1] = 257;

alert(uint8array[0]); // 0 - the "Uint8Array" only take 8 bits "00000000" 
alert(uint8array[1]); // 1 - the "Uint8Array" only take 8 bits "00000001" 
```

## DataView 
* -> is a **special super-flexible "untyped" view** over **`ArrayBuffer`**
* -> is great when we **`store mixed-format data in the same buffer`** (VD: store a sequence of pairs `16-bit integer and 32-bit float`)
* -> we **`choose the format at method call time`** to access data instead of the construction time (VD: .getUint8(i) , .getUint16(i) , ...)

* **new DataView(buffer, [byteOffset], [byteLength])**
* **`buffer`** – the underlying ArrayBuffer. Unlike typed arrays, DataView doesn’t create a buffer on its own. We need to have it ready.
* **`byteOffset`** – the starting byte position of the view (by default 0).
* **`byteLength`** – the byte length of the view (by default till the end of buffer)

```js
// binary array of 4 bytes, all have the maximal value 255
let buffer = new Uint8Array([255, 255, 255, 255]).buffer;
let dataView = new DataView(buffer);

alert( dataView.getUint8(0) ); // 255 - get 8-bit number at offset 0

// now get 16-bit number at offset 0, it consists of 2 bytes, together interpreted as 65535
alert( dataView.getUint16(0) ); // 65535 (biggest 16-bit unsigned int)

// get 32-bit number at offset 0
alert( dataView.getUint32(0) ); // 4294967295 (biggest 32-bit unsigned int)

dataView.setUint32(0, 0); // set 4-byte number to zero, thus setting all bytes to 0
```

## Term
ArrayBufferView is an umbrella term for all these kinds of views.
BufferSource is an umbrella term for ArrayBuffer or ArrayBufferView.
We’ll see these terms in the next chapters. BufferSource is one of the most common terms, as it means “any kind of binary data” – an ArrayBuffer or a view over it.