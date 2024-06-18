> https://webpack.js.org/guides/

# Basic:

## Basic Setup 
* -> npm init -y
* -> install package **webpack** và **webpack-cli**
* -> thêm file **`index.js`** sử dụng `Lodash` library (dependency)
* -> thêm file **`index.html`** với `script tag link đến lodash`
* -> chỉnh sửa file **package.json** để `prevent an accidental publish of your code`

* => cách này dẫn dến những vấn đề bất cập trong việc sử dụng **global variables** trong javascript project (đọc `FrontentSample\Features\Document\webpack\Overview\Client_Bundle.md` để hiểu)

## Creating Bundle
* -> separating the **"source" code (./src)** from our **"distribution" code (./dist)**
* _`the "source" code` is the **code that we'll write and edit**_
* _`the "distribution" code` is **the minimized and optimized output of our build process** that will eventually be **loaded in the browser**_

* -> install `lodash` library locally: _`npm install --save lodash`_
* -> chỉnh sửa file `index.js`, giờ ta sẽ **import library in our script**
* -> chỉnh sửa file `index.html`, bỏ `lodash script tag` và modify the other `script tag` to load the bundle
* _chỗ này tạm thời ta sẽ phải tự tạo `index.html` trong `dist` và edit nó manually; sau này ta sẽ để thư mục `dist` rỗng và để webpack tự generate tất cả các files ta cần_

* -> giờ ta chạy **npx webpack** 
* _take our script at **`src/index.js`** as the **entry point**; and generate **`dist/main.js`** as the **output**_
* _the **`npx`** command runs the webpack binary (**./node_modules/.bin/webpack**) of the webpack package_

* -> check xem nó có gen file `dist/main.js` không

* => by **`stating what dependencies a module needs`**, webpack can use this information to **build a dependency graph**
* => then **uses the graph to generate an optimized bundle** where scripts will be executed in the correct order

## Modules
* -> the **import** and **export** statements have been **`standardized in ES2015`** - supported in most of the browsers at this moment
* -> however there are some browsers that don't recognize the new syntax; but **webpack does support these module API out of the box**
* -> behind the scenes, webpack actually **`"transpiles" these module API`** so that older browsers can also run it 
* => if we are _using other ES2015 features_, make sure to use a transpiler such as **Babel** **`via webpack's loader system`**

## Using a Configuration
* -> as of **`webpack version 4`**, it **doesn't require any configuration**
* -> but most projects will need a more complex setup, so **webpack supports a configuration file** called **webpack.config.js**
* => make it more efficient than having to **`manually type in a lot of commands`** in the terminal

* -> ta sẽ build lại với **npx webpack** hoặc **npx webpack --config webpack.config.js**
* -> if a **`webpack.config.js`** is present, the **webpack command picks it up by default**; but the **--config** option allow us to pass a configuration of any name 

```js - webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

## NPM Scripts
* -> within **`scripts`** we can **reference locally installed npm packages by name** (_the same way we did with `npx`_)
* -> this `convention` is **the standard in most npm-based projects** because it **allows all contributors to use the same set of common scripts**
* _tức là ta có thể dễ dàng tham chiếu đến package chỉ bằng tên thông qua `npm script`, `npm script` giúp giao diện để chạy những script đến từ những package khác nhau có interface trông như nhau_

* _adjust **package.json** by adding an **npm script**:_
* _sau đó ta có thể chạy `npm run build`_; 
* _and to **`pass custom parameters to webpack`**, we can **adding two dashes** between the _npm run build command_ and _our parameters_ (_e.g. `npm run build -- --color`_)

```json - package.json
{
   "name": "webpack-demo",
   "version": "1.0.0",
   "description": "",
   "private": true,
   "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack" // new
   },
   "keywords": [],
   "author": "",
   "license": "ISC",
   "devDependencies": {
     "webpack": "^5.4.0",
     "webpack-cli": "^4.2.0"
   },
   "dependencies": {
     "lodash": "^4.17.20"
   }
 }
```