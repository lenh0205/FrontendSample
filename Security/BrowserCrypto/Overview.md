> https://dev.to/halan/4-ways-of-symmetric-cryptography-and-javascript-how-to-aes-with-javascript-3o1b

==================================================
# Problem
*  **`HTTPS`** protocol (HTTP over SSL/TLS) protect user again connection interception 
* ->  all data sent from the browser to the server, including paths will be encrypted up to the server side, where it will be decrypted
* -> all data coming from the server side will be encrypted and then decrypted on the browser

* But in the case that we **`can’t store plain text on the database`**; 
* -> VD: we have to encrypt from the browser before sending because we don’t want to touch or be responsible for the plain text
* -> VD: just to decrypt a file during uploading before sending
* -> VD:  to encrypt or decrypt an email on the browser

* => 4 important platform for building **Cryptographic system** in Javascript: **`CryptoJS, Web Crytography API, NodeJS crypto`**

======================================================
# Encryption
* ->  is the process of converting data from a readable format to a scrambled piece of information
* -> to ensure preserve the **integrity of our data**
* -> can be applied to **documents, files, messages, or any other form of communication over a network**

* Almost everything we see on the internet has passed **`through some layer of encryption`**, be it websites or applications
* -> protect **`data at rest`** (_stored on computers and storage devices_), as well as **`data in transit`** (_over networks_)

* an **`encryption system`** contain **3 major components**:  **`the data`**, **`the encryption engine`** and the **`key management`**
* -> In application architectures, the three components usually run or are stored in **separate places**
* -> to reduce the chance that compromise of any single component could result in compromise of the entire system

## plaintext
* is **`unencrypted data`**

## Ciphertext
* -> the **encrypted data** is converted from the **`plaintext`** using an **`encryption key`** and a suitable **`encryption algorithm`**
* -> can use a **secret decryption key** to convert the ciphertext back to its original readable format (_may not similar to the `ecryption key`_)

## Cipher / Encryption Algorithm
* **the formulas** used to **`encode`** and **`decode`** messages
* -> includes a variable called a **key** as part of the algorithm, what makes a cipher's output unique
* -> when an encrypted message is intercepted by an unauthorized entity, the intruder has to guess which **`cipher`** used to encrypt the message, as well as what **`keys`** were used as variables

======================================================
# Encryption purpose:
* **Confidentiality** encodes the message's content.
* **Authentication** verifies the origin of a message.
* **Integrity** proves the contents of a message have not been changed since it was sent.
* **Nonrepudiation** prevents senders from denying they sent the encrypted message.

======================================================

# Key vs Password
* any cryptographic systems have **`at least one key`**
* -> **Symmetric encryption** uses **`the same key to encrypt and decrypt`** 
* -> **Asymmetric encryption** uses two keys, **`one to encrypt`** and **`another to decrypt`**
* also have **authentication systems based on key**, where using a key we can ensure the **`authenticity of a chunk of data`**

* -> All **cryptographic keys** have **`a series of bits`** that _do not necessarily correspond with characters_
* -> meanwhile, **password** length is **`about characters`** and normally passwords are made from characters

## A length of a key
* is not about **`character count`** but about **`bits`** always
* Cryptographic systems use **`very strict lengths of keys`**, because the **length of keys interacts directly** with the 
* -> **`implementation of the algorithm`**
* -> **`increasing or decreasing rounds, steps`**
* -> or even **`changing the length of blocks`**

## Password
* -> are normally used to **feed a hash algorithm** and _act completely different than a cryptographic key_
* -> normally have **`minimum and maximum sizes`** and that is just related with **`storage fields`** or **`brute-force concerns`**

## Hash algorithms
* -> are very important pieces in cryptographic systems and they don’t use keys,
* -> despite them being used to **`compose systems that use keys`**

=================================================
# Hashing Algorithm
* _Hash functions are used in almost all crypto systems_
* -> is functions that **transform** **`a chunk of data`** into **`a pre-sized chunk of non predictable data`**
* -> once hashed, the content can **never be reverted to the original**
* -> must have **a collision resistance**, in a way that must be **`impracticable to find two matching contents`**

* _there are some uses which are not related with encryption_ (**`encryption`** just a part in **`cryptographic`**)
* -> **`Git`** uses SHA1 over the parameters and body of one commit to act as a kind of commit reference
* -> **`Bitcoin`** uses SHA2 in 256 mode to hash the entire block of transactions twice appending a nonce (an arbitrary data) in order to ensure a proof of work
* -> **`storing passwords within a database`**, it is **a must** to store the password hashed and not as plain text`
* _When we `create signatures` and `hashes to ensure integrity of a content`, this is not an encryption, but it is cryptographic_

## Type of Hashing Algorithms
* **MD - Message Digest** - first widely used hashing algorithms
* -> replaced by **`MD2, MD3, MD4 and finally MD5`** (_was first broken at the beginning of this century_)
* -> vunerable:  https://www.mscs.dal.ca/~selinger/md5collision/ 

* **SHA1 - Secure Hash Algorithm** was created **`based on MD4`**, and was broken too
* -> vunerable: https://shattered.io/ 

* **SHA2** - 1 nhóm family of algorithms able to produce **`hashes of 224, 256, 384 or 512 bits`**
* => all **`the most important cryptographic systems today`** work using the _security of SHA2_

# Rainbow Tables - the most common attack against hashes
* are **`pre-computed tables of values`** and **`corresponding hashed results`**

```js
// type this hash "8BB0CF6EB9B17D0F7D22B456F121257DC1254E1F01665370476383EA776DF414"
// within this "hash table": https://md5decrypt.net/Sha256
// -> we get the answer in 0.1 seconds
```

* **Solution**: the defense consists in **`appending a chunk of random data`** **`at the end of the content`** and **`hashing it together`**

# "Salt" and "Pepper" - 2 main techniques to protect against "Rainbow Tables"
## Salt
* -> a **`non secret`** **random data** appended to _original content_
* -> must be **`unique for each hash`**
* -> is normally stored together with the content because it isn't a secret

## Pepper
* -> a **`secret`** **random data** appended to _original content_
* -> could be **`reused in the same application`**
* -> but it needs to be **`stored outside of the database`** where we put the salts and hash results
* -> By adding a pepper, **`brute force will be impracticable`** since the pepper data isn't known

