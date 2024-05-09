
# Encode

```C# 
UnicodeEncoding encoding = new UnicodeEncoding(); //  UnicodeEncoding is by default of UTF-16 
byte[] bytes = encoding.GetBytes(AnyString);
```

```js - convert byte array to string
function string2Bin(str) {
  var result = [];
  for (var i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i));
  }
  return result;
}
function bin2String(array) {
  return String.fromCharCode.apply(String, array);
}

string2Bin('foo'); // [102, 111, 111]
bin2String(string2Bin('foo')) === 'foo'; // true
```