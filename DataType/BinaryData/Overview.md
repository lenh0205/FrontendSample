# Binary representation 
* **is only matter in the context of the programming that utilizes it**
* -> tức là computer can't **`differentiate between letters and numbers`** base on the binary that they store
* -> ta phải nó cho computer biết bằng _programming_ thông qua:

1. **`Data Types and Variable Declarations`**
2. **`Context and Instructions`**: guess through operations and instructions in program
3. **`Memory Allocation and Representation`**: **Character** are often stored in single bytes using ASCII or Unicode encoding schemes; **Numbers** depending on their type (int, float, etc.) can occupy multiple bytes
4. **`Interpreters and Compilers`**: **Interpreters** keeping track of data types during execution; **Compiler** assigning memory and handling data types beforehand

```C#
// character 'A' and number 65 have the same binary "01000001"
char myChar = 'A'; // 'A' codepoint in "ASCII" is 65
int asciiValue = (int)myChar; // Output: 65
char test = (char) asciiValue; // Output: 'A'
```

```r - from "binary" to "decimal"
// 10110101
// -> bắt đầu từ phải qua trái:
// -> 2^0 * 1 + 2^1 * 0 + 2^2 * 1 + 2^3 * 0 + 2^4 * 1 + 2^5 * 1 + 2^6 * 0 + 2^7 * 1 
// => Output: 181
```

```r - from "decimal" to "binary"
// "Step 1": Divide the given decimal number by 2 and note down the remainder and quotient; Repeat until get 0 as the quotient
181 : 2 = 90 dư 1
90 : 2 = 45 dư 0
45 : 2 = 22 dư 1
22 : 2 = 11 dư 0
11 : 2 = 5 dư 1
5 : 2 = 2 dư 1
2 : 2 = 1 dư 0
1 : 2 = 0 dư 1

// "Step 2": write the remainders in the reverse order (from the last to the first)
10110101 (8 bit)

// The "Least Significant Bit (LSB)" of the binary number is at the top and the "Most Significant Bit (MSB) is at the bottom"
```

# Handle groups of bits is more convenient

## Byte
* the most common grouping is **`8 bits`**, which forms **a byte**
* -> single byte **`can represent 256 (2^8) numbers`**
* -> **`Memory`** capacity is usually referred to in bytes

## Word
* **`2 bytes`** is usually called **a word** / **`short word`**
* -> _word-length_ depends on the application
* -> _a two-byte word_ is also the size that is **`usually used to represent integers`** in programming languages
* -> **`a long word`** is usually twice as long as a word

## Nibble
* **a nibble** - a less common unit which is **`4 bits`**, or half of a byte

## "human-friendly" handling bits 
* it's hard for humans to deal with _writing, reading and remembering_ the _large number bits_
* => **`a number of different ways`** have been developed to make the _handling of binary data easier_
* -> **`hexadecimal`** , **`octal`**

# HEX / hexadecimal / base-16
* -> **use a single digit to present 4 bits (a nibble)**
* -> use **`10 unique decimal`** (_0 to 9_) and the **`first 6 letters`** (_A..F or a..f_) of the alphabet as **numbers**

* because _`4 bits`_ gives _`16 possible combinations`_, but there are _`only 10 unique decimal digits`_, 0 to 9

```r
Decimal Hexadecimal    Binary
0           0           0000
1           1           0001
2           2           0010
3           3           0011
4           4           0100
5           5           0101
6           6           0110
7           7           0111
8           8           1000
9           9           1001
10          A           1010
11          B           1011
12          C           1100
13          D           1101
14          E           1110
15          F           1111

// 16 bit HEX number 0CA316 <=> 0000 1100 1010 0011 in binary
```

```r - from "hexadecimal" to "decimal"
// 0CA3
// -> bắt đầu từ phải qua trái:
// 16^0 * 3  +  16^1 * A  +  16^2 * C  +  16^3 * 0
// 1 * 3     +  16 * 10   +  256 * 12  +  4096 * 0
// 3235
```

```r - from "decimal" to "hexadecimal"
// from "590" in decimal
// 590 : 16 = 36 dư E (14 decimal)
// 36 : 16 = 2 dư 4
// 2 : 16 = 0 dư 2
// => "24E" in hexadecimal
```

```js
const num = 65;
const hexStr = num.toString(16);
parseInt(hexStr, 16) // Output: 65

const num = 0x21; // Output: 33
parseInt('21', 16) // Output: 33
```

## 