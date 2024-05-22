
# Get "query parameter" by javascript
```js
const urlParams = new URLSearchParams(window.location.search);
const urlParams = (new URL(window.location)).searchParams;
const urlParams = new URLSearchParams((new URL('https://example.com?foo=1&bar=2')).search);

const myParam = urlParams.get('myParam'); // get specific query param
const params = Object.fromEntries(urlSearchParams.entries()); // get all query params
```


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

# Take route variable from .env file into "index.html" before bundling

```js
// .env.locol
PUBLIC_URL = /qlvbdnn/DesktopModules/MVC/QuanLyVanBan/GUI/Scripts/build/

// index.html
<script type="text/javascript" src="%PUBLIC_URL%/base64.js"></script>
```