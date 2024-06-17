# Document: https://webpack.js.org/guides/getting-started/

## First step: Basic Setup 
* -> npm init -y
* -> install package **webpack** và **webpack-cli**
* -> thêm file **`index.js`** sử dụng `Lodash` library (dependency)
* -> thêm file **`index.html`** với `script tag link đến lodash`
* -> chỉnh sửa file **package.json** để `prevent an accidental publish of your code`

* => cách này dẫn dến những vấn đề bất cập trong việc sử dụng **global variables** trong javascript project (đọc `FrontentSample\Features\Document\webpack\Overview\Client_Bundle.md` để hiểu)

## Second step: Creating Bundle
* -> separating the **"source" code (./src)** from our **"distribution" code (./dist)**
* _`the "source" code` is the **code that we'll write and edit**_
* _`the "distribution" code` is **the minimized and optimized output of our build process** that will eventually be **loaded in the browser**_
* -> install `lodash` library locally: _npm install --save lodash_