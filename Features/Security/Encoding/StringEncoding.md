* _At low level, there `aren't any strings`, it's just `a sequence of bytes`, just like all other data_
* _we decide that `this sequence of bytes should be interpreted as text` for reading_
* _we decide on a mapping for `what bytes mean what characters`_

====================================================
# Charset - Character Sets

**Problem**
* computers store data **`in bytes`**, which hold the numbers **`0 and 1`**
* we can't represent a string as a specific number and store it because there's an infinite number of strings 
* but the number of **`characters`** that make up strings is _much smaller, and limited in size_
* -> we can **`assign a number (a code) to every character`**
* => _for every string_, we store the codes for the characters in the string, and then to read the string
* => we then read the codes and **`look up the character it corresponds to`**

* **Solution**: we have to define **a character set**, a **`mapping that assigns a numeric code to every recognized character`**
* _it's like a dictionary to determine how to convert characters to numbers, and vice versa_

## ASCII - the most popular "character set"
* -> _American Standard Code for Information Interchange_
* -> **`maps 128 different "characters" to a "number" from 0 to 127`**
* -> full list: https://ascii.cl/

```r - conver character "A" to binary
// "A" in the ASCII code is 65; to convert 65, a "decimal" to "binary":
// -> we "divide it by 2" as many times as possible without getting a remainder
// -> 
```

* **Problem**: in ASCII **`only 128 possible characters`** can be represented; _mostly covers the English language_ (what about other languages character, mathematical symbols, emoji)
* **Reason**: ASCII was based on the `existing telegraphing system not computer`; at the time, they figured they only needed 7 bits, which can only hold 128 (2⁷) numbers
* => Xuất hiện thêm các `character sets` khác: **ISO-8859-1** and **Unicode**

* **ISO-8859-1** - is an **`extended ASCII`** charset; it adds a few non-English characters like ß to the basic ASCII set, bringing it up to about 200 characters (and 8 bits)

* **Unicode**: is the "modern" character set, supporting over **`1 million possible codepoints`**
* => the reason why your computer or phone can render emoji and characters from other languages correctly

## Unicode Encoding
* **Problem**:
* -> 1 byte = 8 bits, which means a byte can **`only hold 256 (2⁸) characters`**
* -> For an encoding like **`Unicode to support more than 256`**,  it has to go **`beyond one-byte characters`**
* -> _A single `Unicode` codepoint can be up to 4 bytes_
* -> so 5-character string like "hello" would take 20 bytes ?
* => there has to be some way we can **`use only the minimum number of bytes`** each character needs

* **Solution**: **`variable-width Encoding`**

========================================================
## Encoding
* -> **`a way to represent a string`**
* -> it's **`separate from the character set`** (_which is just the mapping from character to number_)
* -> an encoding allows us to **`write a codepoint in a number of different ways`**, giving us some _flexibility to fit our needs_

### 3 main Unicode encodings: UTF-32, UTF-16, UTF-8
* -> "UTF" means "Unicode Transformation Format", and the number paired with it represents **`how many bits are needed at minimum`**

* **UTF-32** 
* -> **a fixed-width encoding** uses **`32 bits (4 bytes) to represent every codepoint`**
* -> whether or not the character needs 32 bits, it's going to **`occupy 32 bits`**, **`unused bits would be zeros`**
* => normally, using UTF-32 is often _a waste of space_, since most languages characters fit into the first _2 Unicode bytes_

* **UTF-16 and UTF-8**
* -> are **variable-width encoding** use a **`minimum`** of **`16 bits (2 bytes)`** and **`8 bits (1 byte)`** respectively to represent a codepoint
* -> _to represent codepoints larger than their range_, they use `special combination tactics`
```js
UTF-8:  68           (1 byte)
UTF-16: 00 68        (2 bytes)
UTF-32: 00 00 00 68  (4 bytes)

UTF-8:  F0 9F 98 8A  (4 bytes)
UTF-16: D8 3D DE 0A  (4 bytes)
UTF-32: 00 01 F6 0A  (4 bytes)
```




