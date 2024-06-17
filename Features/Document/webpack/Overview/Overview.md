=======================================================================
# webpack
* -> hiểu đơn giản là 1 công cụ hỗ trợ **`đóng gói các tài nguyên`** (_js, css, images, fonts, ..._) thành những file duy nhất
* -> từ đó ta nó cho phép ta **có thêm những tính năng trong và trước quá trình bundle**, Ví dụ:
* -> **`tổ chức, đóng gói nhiều file JS, CSS thành 1 file duy nhất`**
* -> **`minify`** các file code
* -> **`tối ưu`** (nén, chuyển đổi file thành URL (Base64), ...) các file Images, SVG,... với dung lượng nhỏ nhất
* -> **`tự động hoá các thao tác`** (_build, reloading, ..._) ở local, development
* -> **`cài đặt và sử dụng các package (Reactjs, SCSS,...)`** trở nên đơn giản
* -> **`Transpiler`**

## Install
* -> install **NodeJS**
* -> **`npm init -y`** để tạo file **package.json**
* -> **`npm install webpack webpack-cli --save-dev`** để cài đặt **webpack** và **webpack-cli** như là devDependencies của project

=======================================================================
# Basic project's "Folder Structure" when using 'webpack'
* -> **src** - thư mục **`source`** chứa toàn bộ code development
* -> **dist** - thư mục **`distribute`** chứa những code đầu ra sau quá trình bundle
* -> file **webpack.config.js** tại thư mục root của dự án

```r
webpack-demo
  |- dist/
  |- node_modules/
  |- src/
  |- package-lock.json
  |- package.json
  |- webpack.config.js
```

=======================================================================
# Basic configuration
* -> thường thì **`từ webpack 4 trở đi`** sẽ không yêu cầu ta nhất thiết phải có file config _webpack.config.js_; nhưng dự án lớn sẽ cần những thiết lập phức tạp

## IO configuration for Webpack
* -> webpack **entry** option - file sẽ làm **`entry point`** cho việc bundle js, thường là file **`index.js` nằm trong thư mục `src`**
* -> webpack **output** option - 1 object gồm 2 phần: **filename** - **`tên file output`**; **path** đường dẫn đến đến **`folder chứa file output`** (_thường là thư mục **`dist`**_)

* -> NodeJS cung cấp cho ta **`built-in module`** **path** để  thao tác xử lí với đường dẫn file, tên file, folder...

```js - webpack.config.js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

## Setup "entry point" file for a website
* -> tạo file **`index.html`** trong thư mục **dist**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <h1 id="title">Hello Webpack!</h1>
  <script src="main.js"></script> <!-- link sẵn đến main.js - do webpack output dựa trên config  -->
</body>
</html>
``` 

## setup "entry point" for webpack bundle 
* -> tạo file **`index.js`** trong thư mục **src**

```js - VD với nôi dung:
const titleElement = document.querySelector('#title')
titleElement.style.color = 'red'
```

## Run webpack
* -> chạy **npx webpack** - nó sẽ lấy file **`webpack.config.js`**

* _sau khi chạy xong ta sẽ thấy thư mục `dist` có file `main.js` với nội dung:_
```js
document.querySelector("#title").style.color="red";
```
* _mở file `index.html` trên trình duyệt thì chữ "Hello Webpack!" đã biến thành màu đỏ_

## Add npm script để chạy webpack
* -> tránh trường hợp nhiều package cần những câu lệnh khác nhau để chạy như webpack gây khó nhớ

* _sau khi có npm script, thì ta chỉ cần chạy `npm run dev` là được_
```json - package.json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack"
  }
}
```
