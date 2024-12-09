
# Reason
* -> because **a URL** can consist of **standard ASCII characters only**, other special characters **`have to be encoded`**
* -> they will be replaced by a **`sequence of different characters`** that represent its **UTF-8 encoding**

* => **encodeURI** and **encodeURIComponent**

## Differences
* -> **encodeURI** is used to **`encode a full URL`**
* -> **encodeURIComponent** is used for **`encoding a URI component`** (_such as a **query string**_)

```js
const url = encodeURI('https://domain.com/path to a document.pdf');
// Output: 'https://domain.com/path%20to%20a%20document.pdf'

const url = `http://domain.com/?search=${encodeURIComponent('encode & decode param')}`;
// Output: 'http://domain.com/?search=encode%20%26%20decode%20param'
```

## 11 characters can not be encoded by "encodeURI" but possible with "encodeURIComponent"

```
Character	`encodeURI`	`encodeURIComponent`
`#`	`#`	`%23`
`$`	`$`	`%24`
`&`	`&`	`%26`
`+`	`+`	`%2B`
`,`	`,`	`%2C`
`/`	`/`	`%2F`
`:`	`:`	`%3A`
`;`	`;`	`%3B`
`=`	`=`	`%3D`
`?`	`?`	`%3F`
`@`	`@`	`%40`
```

```js - VD:
const arr = Array(256)
    .fill(0)
    .map((_, i) => String.fromCharCode(i))
    .filter((c) => encodeURI(c) != encodeURIComponent(c));

arr.forEach((c) => console.log(c, encodeURI(c), encodeURIComponent(c)));

```

## Note
* -> **encodeURIComponent** **`does not encode`** **-_.!~*'()**; if we want to these characters are encoded, we have to **replace them with corresponding UTF-8** sequence of characters

```js
const encode = (str) => encodeURIComponent(str)
                            .replace(/\-/g, '%2D')
                            .replace(/\_/g, '%5F')
                            .replace(/\./g, '%2E')
                            .replace(/\!/g, '%21')
                            .replace(/\~/g, '%7E')
                            .replace(/\*/g, '%2A')
                            .replace(/\'/g, '%27')
                            .replace(/\(/g, '%28')
                            .replace(/\)/g, '%29');
encode("What's result of (4 + 2)?"); // "What%27s%20result%20of%20%284%20%2B%202%29%3F"

const decode = (str) => decodeURIComponent(
        str
            .replace(/\\%2D/g, '-')
            .replace(/\\%5F/g, '_')
            .replace(/\\%2E/g, '.')
            .replace(/\\%21/g, '!')
            .replace(/\\%7E/g, '~')
            .replace(/\\%2A/g, '*')
            .replace(/\\%27/g, "'")
            .replace(/\\%28/g, '(')
            .replace(/\\%29/g, ')')
    );
decode('What%27s%20result%20of%20%284%20%2B%202%29%3F'); // "What's result of (4 + 2)?"

```