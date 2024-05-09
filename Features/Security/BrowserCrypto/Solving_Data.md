# Cryptographic is about dealing with data, not text
* nhưng sau cùng thì that data must be transmitted through text-only fields, so it needs to be represented as text too

## A UTF-8 character 
* -> is made of **`1 to 4 bytes`**
* -> so there is also a huge bunch of bytes **`without representation on UTF-8`** (like _control characters_)
* => so UTF-8 is not efficient to represent data

## Hexadecimal 
* -> is the **`most readable way`** to handle data 
* -> but it’s convenient for sharing, because it uses 2 characters per byte! 

## Base64 
* is **`the best way`** to share data as characters 

# Navigate through data representation

* in **`NodeJS`** -  using **Buffer** interface
```js -
Buffer.from('hello world')
// UTF8 - <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>

Buffer.from('hello world').toString('hex')
// '68656c6c6f20776f726c64'

Buffer.from('hello world').toString('base64')
// 'aGVsbG8gd29ybGQ='

Buffer.from('aGVsbG8gd29ybGQ=', 'base64').toString()
// 'hello world'

Buffer.from('68656c6c6f20776f726c64', 'hex').toString()
// 'hello world'

[...Buffer.from('hello world')]
// [ 104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100 ]
```

* on **`Browser`** - using **TextEncoder**
```js
new TextEncoder().encode('hello world')
// UTF8 - Uint8Array(11) [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]

new TextDecoder().decode(new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]))
// "hello world"

[...(new TextEncoder().encode('hello world'))]
  .map(b => b.toString(16).padStart(2, "0")).join('')
// to HEX string - "68656c6c6f20776f726c64"

"68656c6c6f20776f726c64".match(/.{1,2}/g)
  .map(e => String.fromCharCode(parseInt(e, 16))).join('')
// from HEX string - 'hello world'

btoa('hello world')
// to Base64 - "aGVsbG8gd29ybGQ="

atob('aGVsbG8gd29ybGQ=')
// from Base64 - "hello world"
```

* with **`CryptoJS`**
* -> uses an internal representation for dealing with an **Array of Words (32 bits)**
* -> pretty easy to transit between all representations
```js
var CryptoJS = require('crypto-js')

CryptoJS.enc.Utf8.parse('hello world')
// { words: [ 1751477356, 1864398703, 1919706112 ], sigBytes: 11 }

CryptoJS.enc.Utf8.parse('hello world').toString()
// HEX string - '68656c6c6f20776f726c64'

CryptoJS.enc.Utf8.parse('hello world').toString(CryptoJS.enc.Base64)
// 'aGVsbG8gd29ybGQ='

CryptoJS.enc.Base64.parse('aGVsbG8gd29ybGQ=').toString(CryptoJS.enc.Utf8)
// 'hello world'

CryptoJS.enc.Hex.parse('68656c6c6f20776f726c64').toString(CryptoJS.enc.Utf8)
// 'hello world'
```












