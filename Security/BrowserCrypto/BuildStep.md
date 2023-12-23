
# KDF - "Key Derivation Function" use "passwords" to generate "keys"
* Basically, **`a password`** passes through some **hash algorithms** or some **symmetric encryption** **`repeatedly`**

## MAC - "Message Authentication Code" 
* -> used to _prove the **`integrity`** and **`authenticity`** of the content_
* -> basically, it's **a code appended to a content**

* **HMAC** is **Hash-based** **`Message Authentication Code`**
* -> uses a _primary hashing function internally_, normally **`SHA1`**
* -> and in the process it’ll **`hash the password and a key`** in a very specific way **`separately and together`**
* -> by knowing the key we can calculate the HMAC of a message and just **`compare with a given MAC`**
* => that is enough as a **`proof of the content's authenticity`**

## PBKDF2 - the most commonly used and secure "KDF" algorithms today
* -> normally it uses **`HMAC to hash`**, using the **`password as a content`** and the **`salt as a key`**
* -> it can **`increase significantly their strength`** just by increasing the **iterations** **`of hashing`**
* => this way, PBKDF2 can generate **any amount of data apparently random but reproducible** **`once you know the password and the salt`**

* _These information are safe to share_ (tức là share cũng không sao): **`salt`** , **`interactions`**, **`key length`**, **`hashing algorithm`**

### the "iterations"
* -> are **`the times that each block will pass through the hash`** (HMAC) before outputting and beginning to hash the next block in the chain 
* -> and _hash several iterations_ again **`until we derive sufficient blocks`**

* **`Lưu ý`** tránh **freeze your browser**
* => increasing the interations will increase **`how many basic hashes`** the algorithm has to do, 
* => _considering HMAC_, each interation will hashing at least 2 SHA1 (or whatever you have set up). 
* => That can **`make the process slow`**, it has to be slow enough to be ok to run one or two times, but very hard to brute-force

```js
// Node.js crypto:
var crypto = require('crypto');
derivedKey = crypto.pbkdf2Sync('my password', 'a salt', 1000, 256/8, 'sha1');
console.log(derivedKey.toString('hex'));
// 8925b9320d0fd85e75b6aa2b2f4e8ecab3c6301e0e2b7bd850a700523749fbe4


// CryptoJS:
var CryptoJS = require('crypto-js');
CryptoJS.PBKDF2('my password', 'a salt', { keySize: 256/32, iterations: 1000 }).toString();
// 8925b9320d0fd85e75b6aa2b2f4e8ecab3c6301e0e2b7bd850a700523749fbe4


// WebCrypto on the browser:
// firstly we need to importKey
window.crypto.subtle.importKey(
    //the format that we are input
    "raw",
    //the input in the properly format
    new TextEncoder().encode("my password"),
    //the kind of key (in that case it's a password to derive a key!)
    {name: "PBKDF2"},
    //if I permit that this material could be exported
    false,
    //what I permit to be processed against that (password to derive a) key
    ["deriveBits", "deriveKey"]
  // the derive key process
  ).then(keyMaterial => window.crypto.subtle.deriveKey(
    {
      "name": "PBKDF2",
      salt: new TextEncoder().encode("a salt"),
      "iterations": 1000,
      "hash": "SHA-1"
    },
    // it should be an object of CryptoKey type
    keyMaterial,
    // which kind of algorithm I permit to be used with that key
    { "name": "AES-CBC", "length": 256},
    // is that exportable?
    true,
    // what is allowed to do with that key
    [ "encrypt", "decrypt" ]
  )
// exporting...
).then(key => crypto.subtle.exportKey("raw", key)
).then(key => console.log(
// finally we have a ArrayBuffer representing that key!
  [...(new Uint8Array(key))]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
));
//8925b9320d0fd85e75b6aa2b2f4e8ecab3c6301e0e2b7bd850a700523749fbe4
```

## Choosing "salt"
* **`A good salt must be chosen randomly`**

```js
// Node.js:
const crypto = require('crypto');
crypto.randomBytes(8);

// CryptoJS:
const CryptoJS = require('crypto-js');
CryptoJS.lib.WordArray.random(8);

// WebCrypto (browser):
window.crypto.getRandomValues(new Uint8Array(8));
```

==================================================
# AES (Advanced Encryption Standard) - most used "Symmetric Cryptography Algorithm" today
* -> **`a cipher block system`** able to use **`128, 192 and 256 key length`** where that key operates over **`blocks of 128 bits of plain text`** to **`generate 128 bits of encrypted text`**

## Padding
* -> the most usual padding is the **PKSC#5**, **PKSC#7**
* -> _when using a cipher block system as AES_, we should **`pad the plain text`** in a way that the **`padding could be removed`** from the plain text when decrypted

```cmd - give a string as hexadecimal of 11 bytes with a padding of 16 bytes
 h  e  l  l  o     w  o  r  l  d  —  11 bytes
68 65 6c 6c 6f 20 77 6f 72 6c 64
68 65 6c 6c 6f 20 77 6f 72 6c 64 05 05 05 05 05  —  16 bytes
                                |___padding____| 
```
_We just pad it by printing the number of bytes that we should concatenate repeatedly_

## Operation Mode
* -> when using _block based cipher_ we need to split the plain text into **`blocks of the same size (128 bits for AES)`** and choose an _operation mode_ to **`handle those blocks and encrypt it against a key`**
* =>  Because of that, sometimes the **`last block`** won’t have the right size to go through

### "CBC" Operation Mode
* -> starts **`doing an XOR`** (Special OR) between the **`first block of plain text`** and a special block called **IV (initialization vector)**,
* -> then it’s **`encrypted against the key`** to generate the first encrypted block
* -> that **`first encrypted block`** is used to _make an XOR_ with the **`second plain text block`**, 
* -> then it’s encrypted against the key to generate the second encrypted block
* -> and so on…

* _changing one block will cause an avalanche over the next blocks_ => so when **`ensuring a random and unpredictable IV`**, it'll have a totally **different result even with the same key and plain text**

*  **Decrypt** - do the inverse process
* -> First **`decrypt the first block`**, then make an **`XOR with the IV`** to get the **`first plain text block`**
* -> The second plain text block is made from a **`decryption of the second encrypted block XORed`** with the **`first encrypted block`**
* -> and so on…

### IV - Initialization Vector
* -> IV must be **unpredictable**, the **size of the IV** is **`ALWAYS the same length of the block`**
* -> it could be random and **`doesn’t need to be secret`**
* -> Normally, it’s pre concatenated with the encrypted data or stored close

