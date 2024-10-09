=================================================================
# Get "query parameter" by javascript
```js
const urlParams = new URLSearchParams(window.location.search);
const urlParams = (new URL(window.location)).searchParams;
const urlParams = new URLSearchParams((new URL('https://example.com?foo=1&bar=2')).search);

const myParam = urlParams.get('myParam'); // get specific query param
const params = Object.fromEntries(urlSearchParams.entries()); // get all query params
```

=================================================================
# API - URLSearchParams
* -> the "URLSearchParams" interface defines **`utility methods`** to **work with the `query string` of a URL**

=================================================================
# iretate through all key-value pair of an 'literal object' or 'Map' object for later processing
* -> khác với Array sinh ra để lướt qua các phần tử; đối với **literal object** hoặc **Map** ta sẽ cần dùng **`entries`** để đưa chúng về dạng **`Iterator`** mới lặp được 

```js
// literal object
const obj = {apples: 500, bananas: 300, oranges: 200};
const entryObj = Object.entries(obj); // Output: [ ["apples", 500], ["bananas", 300], ["oranges", 200] ];
const toObj = Object.fromEntries(entryObj); // Output: {apples: 500, bananas: 300, oranges: 200}

// Map
const fruits = new Map(entryObj);
const fruitsArr = Array.from(fruits); // Output: [ ["apples", 500], ["bananas", 300], ["oranges", 200] ]
const fruitsEntry = fruits.entries(); // Output: MapIterator
const fruitsObj = Object.fromEntries(fruitsEntry); // Output: {apples: 500, bananas: 300, oranges: 200}
```

=================================================================
# check an object is literal object
```js - for simple case only
// Note: this won't work if "obj" was instantiated in a different window or frame
Object.getPrototypeOf(obj) === Object.prototype
// -> checks the object is a plain object created with either new Object() or {...}
// -> and not some subclass of Object
```

```html - for fullfill solution
<!-- http://code.eligrey.com/testcases/all/isObjectLiteral.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>isObjectLiteral</title>
    <style type="text/css">
    li { background: green; } li.FAIL { background: red; }
    iframe { display: none; }
    </style>
</head>
<body>
    <ul id="results"></ul>

    <script type="text/javascript">

        function isObjectLiteral(obj) {
            if (typeof obj !== "object" || obj === null)
                return false;

            var hasOwnProp = Object.prototype.hasOwnProperty,
            ObjProto = obj;

            // get obj's Object constructor's prototype
            while (Object.getPrototypeOf(ObjProto = Object.getPrototypeOf(ObjProto)) !== null);

            if (!Object.getPrototypeOf.isNative) // workaround if non-native Object.getPrototypeOf
                for (var prop in obj)
                    if (!hasOwnProp.call(obj, prop) && !hasOwnProp.call(ObjProto, prop)) // inherited elsewhere
                        return false;

            return Object.getPrototypeOf(obj) === ObjProto;
        };


        if (!Object.getPrototypeOf) {
            if (typeof ({}).__proto__ === "object") {
                Object.getPrototypeOf = function (obj) {
                    return obj.__proto__;
                };
                Object.getPrototypeOf.isNative = true;
            } else {
                Object.getPrototypeOf = function (obj) {
                    var constructor = obj.constructor,
                    oldConstructor;
                    if (Object.prototype.hasOwnProperty.call(obj, "constructor")) {
                        oldConstructor = constructor;
                        if (!(delete obj.constructor)) // reset constructor
                            return null; // can't delete obj.constructor, return null
                        constructor = obj.constructor; // get real constructor
                        obj.constructor = oldConstructor; // restore constructor
                    }
                    return constructor ? constructor.prototype : null; // needed for IE
                };
                Object.getPrototypeOf.isNative = false;
            }
        } else Object.getPrototypeOf.isNative = true;

        // Function serialization is not permitted
        // Does not work across all browsers
        Function.prototype.toString = function(){};

        // The use case that we want to match
        log("{}", {}, true);

        // Instantiated objects shouldn't be matched
        log("new Date", new Date, false);

        var fn = function(){};

        // Makes the function a little more realistic
        // (and harder to detect, incidentally)
        fn.prototype = {someMethod: function(){}};

        // Functions shouldn't be matched
        log("fn", fn, false);

        // Again, instantiated objects shouldn't be matched
        log("new fn", new fn, false);

        var fn2 = function(){};

        log("new fn2", new fn2, false);

        var fn3 = function(){};

        fn3.prototype = {}; // impossible to detect (?) without native Object.getPrototypeOf

        log("new fn3 (only passes with native Object.getPrototypeOf)", new fn3, false);

        log("null", null, false);

        log("undefined", undefined, false);


        /* Note:
        * The restriction against instantiated functions is
        * due to the fact that this method will be used for
        * deep-cloning an object. Instantiated objects will
        * just have their reference copied over, whereas
        * plain objects will need to be completely cloned.
        */

        var iframe = document.createElement("iframe");
        document.body.appendChild(iframe);

        var doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write("<body onload='window.top.iframeDone(Object);'>");
        doc.close();

        function iframeDone(otherObject){
            // Objects from other windows should be matched
            log("new otherObject", new otherObject, true);
        }

        function log(msg, a, b) {
        var pass = isObjectLiteral(a) === b ? "PASS" : "FAIL";

        document.getElementById("results").innerHTML +=
            "<li class='" + pass + "'>" + msg + "</li>";
        }
    </script>
</body>
</html>
```

=================================================================
# add javascript library file directly to index.html and use it in React 

```js
// index.html
<div id="root"></div>
<script>var MvcViewName = "TiepNhanVanBanDen";</script>

<script src="/DesktopModules/MVC/QuanLyVanBan/GUI/Scripts/External/vgcaplugin.js"></script>

// View.ts
 const ViewName = (window as any)?.MvcViewName || 'index';

// VGCAService.ts
const validateFunc = (func: any) => {
    if (typeof func !== "function") return () => null;
    return func;
}
export const vgca_comment = validateFunc((window as any)?.vgca_comment);
export const vgca_sign_appendix = validateFunc((window as any)?.vgca_sign_appendix);
export const vgca_sign_approved = validateFunc((window as any)?.vgca_sign_approved);
export const vgca_sign_copy = validateFunc((window as any)?.vgca_sign_copy);
export const vgca_sign_issued = validateFunc((window as any)?.vgca_sign_issued);
```

=================================================================
# Take route variable from .env file into "index.html" before bundling

```js
// .env.locol
PUBLIC_URL = /qlvbdnn/DesktopModules/MVC/QuanLyVanBan/GUI/Scripts/build/

// index.html
<script type="text/javascript" src="%PUBLIC_URL%/base64.js"></script>
```

=================================================================
# cut string
* _these method `doesn't change origin string`_
* _nếu không có `đối số thứ 2` thì cắt tới cuối_
* _nếu `argument` lớn hơn string length, thì `string length` sẽ được sử dụng_
* _về cơ bản thì `slice` và `substring` sẽ hơi hơi giống nhau_

```js - cut "a number of character" from "position" 
string.substr(start, length);
// "start" is negative - select character starting from the end of string

var str = "abcd";
str.substr(-3, 2); // "bc"
```

```js - cut from "position" to "position"
string.slice(start, end);
// if "start" > "stop" - return "emptry string"
// "start" is "negative" - slice() return "empty string"
// "end" is "negative" - selects characters starting from the end of the string

str.slice(-2, 0); // ""
str.slice(1, -1); // "bc"
```

```js - cut from "position" to "position"
string.substring(start, end)
// if "start" > "stop" - swap these 2 arguments
// "start" is negative - select character starting from the end of string
// "end" is negative - sets "end" to: string.length – Math.abs(stop) (original value), except bounded at 0 (thus, Math.max(0, string.length + end)) 

str.substring(-2, 1); // "a"
str.substring(-5, 1); // "a"
```

=================================================================
> in conclusion, while there are multiple ways to embed a PDF in our HTML document, it's essential to consider the user experience, especially in scenarios where the PDF might not be accessible
> using fallback options ensures your users can still access the content one way or another.

# Embed resource in html

## using the embed Tag
* -> the **`embed tag`** is a part of the HTML5 specification, making it compatible with most modern browsers
* -> if the browser does not support PDF embedding (common with some mobile devices), our users might see nothing

```js
// we can embed a PDF using the embed tag as follows:
<embed src="home.pdf" type="application/pdf" width="100%" height="100%">
```

## using the iframe Tag
* -> a safer option to ensure that our **`users can access the PDF`** is by using an iframe; if a browser fails to render the PDF, it usually **`triggers a download`**
* -> the message "Download the PDF" will only be displayed if the browser does not support the iframe tag; still, it's not the best experience if the PDF isn't available

```js
<iframe src="home.pdf" width="100%" height="100%">
  <a href="home.pdf">Download the PDF</a>
</iframe>
```

## using the object Tag
* -> the object tag offers even more flexibility; If the PDF isn't found, we can provide a fallback, such as an image or a message:
* -> this way, you can provide a more appropriate error message or an alternative for your users when the PDF isn't available.

```js
<object data="home.pdf" type="application/pdf" width="100%" height="100%">
  <img src="broken.png" alt="PDF not found">  {/** fallback **/}
  <p>Download the PDF <a href="home.pdf">here</a></p>
</object>
```

