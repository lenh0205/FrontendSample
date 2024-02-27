
# Binary Data
* -> **`computer`** **`store and represent data`** in **`binary format`** - a collection of 0 and 1
* -> each 0 or 1 is call a **binary digit** or a **bit**

```js - VD: to store number "4"
// -> computer will convert "4" to "100" 
// -> to perform the convertion, computer using a mathematic rely on "base-2" numeric system
// -> 100 <=> 2^2 * 1 + 2^1 * 0 + 2^0 * 0 = 4
```

## Character in binary format
* _store a string is a common requirement_
* -> to represent a character on binary, computer will first **`convert character to a number`** called **Character Code**
* -> then **`convert that number to its binary representation`**
* -> for computer to know which number to present character, it use **Character Set**

```js - VD: store "V" character in binary
"V".charCodeAt() // return "86" - the numeric representation of the character "V"
```

=======================================================
# Character Set
* -> **`predefined lists of characters represented by numbers`**
* -> there're some "character sets", but the 2 most popular is **ASCII** and **Unicode** (_extend ASCII_)
* -> for computer to work with these number in binary, it will need **Character Encoding**
* -> the **`Browser`** using **`Unicode character set`**

========================================================
# Character Encoding
* -> dictates how to **represent a number in a character set** as **`binary data`** before it can be stored in a computer
* -> _more specifically, it dictates how many bits to use to represent the number_
* -> one example of a **`Character Encoding System`** is **UTF-8**

## UTF-8 
* -> states that **`characters should be encoded in bytes`** (8 bits)
* -> means 8 number of 1s or 0s should be used to represent the code of any character in binary

```r
// number "4" in binary will be "100" <=> "000001000" (a byte) for UTF-8 
// character "V" is presented as number "86" <=> "01010110" for UTF-8
```

=========================================================
# Relationship between "Binary data, character sets and encoding" to "Buffer"

```js - NodeJS
// Node.js provides the "buffer" feature as a global feature (no need to import)

// index.js
const buffer = new Buffer.from("Vishwas"); // default is "utf-8" character encoding

console.log(buffer.toString()); // "Vishwas" - string presentation of binary data in the buffer

console.log(buffer.toJSON()); // { type: 'Buffer', data: [86, 105, 115, 104, 119, 97, 115]}
// -> "type" set to Buffer; a data array contains 7 numbers
// -> each number is "Unicode Charater Code" for each characters in string "Vishwas"

console.log(buffer); // <Buffer 56 69 73 68 77 61 73>
// -> a buffer contain "raw binary data" (0s and 1s)
// -> what Nodejs does is print the "hexadecimal (base-16)" notation of the number (as printing "8 bits binary"  for every character can food our terminal)

// the hexadecimal "56" convert to binary as "01010110", which is binary presentation of the character "V", which is binary presentation of the Character Code "86"

buffer.write("Code");
console.log(buffer.toString()); // "Codewas"
// -> this is because "buffer" have "limited memory"
// -> the 4 characters in "Code" override the 4 character in "Vishwas"

buffer.write("Codevolution");
console.log(buffer.toString()); // "Codevol"
```