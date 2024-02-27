
# Technology
* -> a technology for example like `Express/Node` may contain **`known vulnerabilities`** - _những lỗ hỗng đã biết_
* -> and if Hacker know that our site is `powered by Express`, họ có thể khai thác triệt để những lỗ hỗng này
* -> **`X-Powered-By: Express`** is sent in every request coming from Express **by default**
* -> use the **helmet.hidePoweredBy()** middleware to `remove the X-Powered-By header`

```js
const helmet = require("helmet");
const express = require("express");
const app = express();

app.use(helmet.hidePoweredBy());
```
