> Tại sao phát triển 1 trang web chạy trên **Browser (client)** lại phải cần bundle ?

> những vấn đề chính ta gặp phải khi phát triển `web Client` với javascript bao gồm: **Package version**, **project package sharing**, **global script access**, **File System Access**, **Module using with Client**
> nói chung là ta **`cần sức mạnh của Server`** để tối ưu quá trình phát triển web (_giải quyết những vần đề trên_) rồi tạo ra sản phẩm chạy trên Client; việc này bao gồm sử dụng **npm**, **NodeJS modules** , **Module Bundler**

> thằng **npm** quản lý mọi thứ nó giúp ta require , cũng như chạy các file .exe của package như 1 script mà không cần chỉ rõ đường dẫn trong node_modules
> **NodeJS modules** - là dành cho việc **`Development`**, giúp developer viết code dễ dàng, rõ ràng hơn cũng như hosting chạy thử khi Dev (_vì **`require()`** chỉ được hiểu bởi **Server, not Browser**_)
> **Module Bundler** chính là thằng nằm giữa quá trình **`Development`** và **`Production`** chạy trên Client; tức _chuyển đổi `1 sản phẩm của developer` sang `1 sản phẩm chạy trên Browser`_
> Vậy nên quá trình **`Development`** ta có thể làm gì cũng được, miễn là có những công cụ chuyển đổi phù hợp (Babel, Transpiler,...)

=========================================================================
# Basic classic web:

```html - index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JavaScript Example</title>
  <script src="index.js"></script>
</head>
<body>
  <h1>Hello from HTML!</h1>
</body>
</html>
```
```js - index.js
console.log("Hello from JavaScript!");
```

## Using third-party library

```html - index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Example</title>
  <link rel="stylesheet" href="index.css">
  <script src="moment.min.js"></script> <!-- cần download "moment.js" từ trang chủ trước -->
  <script src="index.js"></script> <!-- đặt sau script momentjs để có thể truy cập biến global của nó -->
</head>
<body>
  <h1>Hello from HTML!</h1>
</body>
</html>
```
```js - index.js
console.log("Hello from JavaScript!");
console.log(moment().startOf('day').fromNow());
```

=========================================================================
# Manage javascript package - npm 

## Problem:
* -> việc sử dụng **`script tag to third-party library`** trở nên phiền phức khi ta cần **tìm và download các phiên bản mới** của thư viện JS mỗi khi chúng được update

## Solution:
* -> **npm** - giúp lập trình viên thuận tiện hơn trong việc tải và nâng cấp các thư viện từ một repository tập trung (_tức **`npm đảm bảo cung cấp tất cả phiên bản của tất cả thư viện js ta cần`**_)
* -> thông qua **package.json** - thay vì **`chia sẻ thư mục node_modules`** (rất nặng), bạn chỉ cần **`chia sẻ file package.json`** và dùng _npm install_ để tự động cài đặt các packages

* _Note: `npm` là một chương trình **quản lý các package được tạo ra chuyên cho 'Node.js'**, một bộ biên dịch và chạy **`JavaScript dùng cho phía server`**, chứ **`không phải là bên phía client`**_

## Install
* -> cài đặt `Nodejs` (bao gồm **npm**)

* -> command tại thư mục chứa entry point `index.html`: **npm init**
* => tạo ra 1 file **package.json**:
```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

* -> cài đặt package từ npm: Ex: **npm install moment --save** 
* => **`download code của package vào thư mục node_modules`**; và **`cập nhật package.json`** để thêm thư viện với vai trò `dependency` của dự án 
```json - package.json
{
  "name": "modern-javascript-example",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "moment": "^2.19.1"
  }
}
```

## Usage:
-> thêm **`script tag với đường dẫn đến package trong thư mục node_modules`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JavaScript Example</title>
  <script src="node_modules/moment/min/moment.min.js"></script> <!-- use momentjs -->
  <script src="index.js"></script>
</head>
<body>
  <h1>Hello from HTML!</h1>
</body>
</html>
```

=========================================================================
# Bundle javascript module - Webpack
* -> giải quyết vấn đến phụ thuộc giữa các library

## Problem
* ->  Javascript được tạo ra với mục đích **`chỉ chạy trên trình duyệt`**, mà **không có quyền truy cập đến các file hệ thống** nằm trên máy tính của người dùng (vì lý do **`bảo mật`**)
* => ban đầu việc tổ chức code javascript thường được thực hiện bằng cách **`load từng source một vào các biến global`** 
* _VD: toàn bộ file `moment.min.js` được load vào file HTML được định nghĩa qua 1 biến global là **`moment`**_
* -> và vì biến này là **global** nên có thể **truy cập ở bất kỳ script nào load sau nó** mà **`không quan tâm đến quyền truy cập`** (_cũng như việc s/d biến global có 1 số bất cập khi web dev_)

* -> Ngoài ra, khi ta **`sử dụng 'npm'`** khá bất tiện khi ta **cần vào node_modules để tìm đường dẫn** của từng package và thêm thủ công vào _thẻ script_ trong index.html để **`sử dụng globally`**

## CommonJS (2009) - NodeJS - server modules manage
* -> định nghĩa ra một hệ sinh thái cho Javascript mà **`không phụ thuộc vào trình duyệt web`**
* -> đưa ra đặc tả về **modules** (_l **`import`** và **`export`** code giữa các file giống như các ngôn ngữ lập trình khác_), mà không cần phải sử dụng biến toàn cục
* -> **NodeJS** là **`implementation nổi tiếng nhất của phần modules`** trong CommonJS

* -> **`Nodejs`** là một trình biên dịch và thực thi Javascript được thiết kế **chạy ở trên server**, với **khả năng truy cập đến các File System**
* -> _Node.js_ **`biết vị trí của từng module npm trong thư mục node_modules`**

```js - load trực tiếp library
// index.js
var moment = require('moment');
console.log("Hello from JavaScript!");
console.log(moment().startOf('day').fromNow());
```

## using 'modules' with Client - Module Bundler

### Problem
* -> **Browser không thể hiểu cú pháp `required()`** vì nó dành cho NodeJS chạy ở phía Server; Browser **`không có khả năng truy cập đến File System`**
* -> nếu muốn load module kiểu này trên Browser sẽ khá rác rối - các file phải được load động, bằng cách đồng bộ (sẽ làm chậm quá trình thực thi) hoặc bất đồng bộ (có thể có vấn đề về thời điểm load)

### Solution:
* -> **Module Bundler** - và **Webpack** là công cụ module bundler phổ biến nhất hiện nay (_trong đó ảnh hưởng phần lớn đến từ sự phổ biến của `React`_)
* -> nó sẽ **`tìm kiếm tất cả các dòng require`**, **`thay thế chúng bởi nội dung của từng file`**, kết quả tạo ra **1 file js duy nhất đóng gói code của tất cả modules**
* -> sử dụng **lệnh "build" của Module Bundler** (phía server nên **`có khả năng truy cập FileSystem`**) tạo ra 1 file js và **`add nó globally`** 

* => không cần load external script **`thông qua các global variables`**, cũng như 1 bundled javascript file sẽ có **`performance tốt hơn`**

### Install:
* -> bản thân _webpack_ là 1 **npm package** chỉ dùng cho **`development enviroment**
```bash
npm install webpack --save-dev
```

### Usage
* -> sau khi install, ta sẽ có webpack dưới dạng **`một package trong thư mục node_modules`**
* -> và để sử dụng nó ta chạy:

```bash
$ ./node_modules/.bin/webpack index.js bundle.js
# -> lấy index.js làm "entry point"
# -> tìm bất cứ dòng lệnh require nào và thay thế chúng với các đoạn code tương ứng
# -> tạo ra một file output có tên là bundle.js
# -> s/d file bundle.js thay cho index.js và link nó vào index.html
```

```html - index.html 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JavaScript Example</title>
  <script src="bundle.js"></script>
</head>
<body>
  <h1>Hello from HTML!</h1>
</body>
</html>
```

### Webpack config file
* -> thay vì phải **`truyền tham số cho webpack CLI`** và **`chạy lại webpack CLI mỗi lần thay đổi code trong module`**, ta sẽ đưa những tham số này vào 1 file tập trung tất cả config - **webpack.config.js** 
* -> và sử dụng file **webpack.config.js** giúp ta tránh phiền phức khi sử dụng 1 số chức năng nâng cao của webpack (_VD: `tạo ra file source map` để giúp debug các đoạn code nguyên bản từ các đoạn code đã được biến đổi_)

```js
// webpack.config.js
module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js'
  }
};
```

* _mỗi lần thay đổi code trong module, ta chỉ cần chạy:_
```bash
$ ./node_modules/.bin/webpack
```

=========================================================================
# Tối ưu Web development với Webpack:
* -> webpack **`cho ta thêm 1 bước "build"`** để tạo ra sản phẩm chạy trên Client; tại đây ta có thể **`dùng các tính năng của Server`** để sử dụng thêm các tính năng mạnh mẽ trong quá trình phát triển

## Transpiling 

* -> **Transpiling** hiểu đơn giản là quá trình **`chuyển code từ một ngôn ngữ sang một ngôn ngữ khác tương tự`**

* -> vì tính ổn định, nên Browser thường **`rất chậm chạp trong việc thêm tính năng mới`**; và **nhiều ngôn ngữ mới được tạo ra với các chức năng thử nghiệm** mà có thể **`biến đổi về các ngôn ngữ tương thích với trình duyệt`**
* -> với **CSS** thì ta có tiêu biểu như **`Sass`**, **`Less`**, và **`Stylus`**
* -> với **Javascript** thì ta có **`CoffeeScript (2010)`**, **`Babel`**, **`Typescript`**

* -> **CoffeeScript** là một ngôn ngữ tập trung vào việc cải thiện Javascript bằng cách thay đổi ngôn ngữ một cách đáng kể - các dấu ngoặc trở thành ko bắt buộc, các khoảng trắng có ý nghĩa,... 
* -> **Typescript** có thêm phần tuỳ chọn kiểu dữ liệu tĩnh

* -> **Babel** đúng hơn là 1 **`Transpiler`** không phải là một ngôn ngữ mới 
* -> ta có thể xem nó là 1 ngôn ngữ với **`Javascript ở version mới nhất`** - các chức năng chưa khả thi ở tất cả các trình duyệt (ES2015 và các phiên bản mới hơn) 
* -> nó sẽ **biến đổi thành các đoạn code Javascript cũ hơn và tương thích với trình duyệt (ES5)** 

### Babel:
* -> Install: **`$ npm install babel-core babel-preset-env babel-loader --save-dev`**

* -> **babel-core** là **`thành phần chính của babel`**
* -> **babel-preset-env** là các preset dùng để định nghĩa **`chức năng mới nào của Javascript cần được biến đổi`**
* -> **babel-loader** là package được dùng để **`cho phép babel hoạt động với webpack`**

* -> cấu hình _webpack_ để sử dụng **`babel-loader`**:
```js
// webpack.config.js
module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
    // tìm kiếm bất cứ file nào có đuôi là ".js", ngoại trừ file nằm trong thư mục "node_modules"
    // s/d Babel để biến đổi code thông qua "babel-loader" với bộ preset "babel-preset-env"
  }
};
```

### Testing
* -> ta sẽ sử dụng cú pháp của **ES2015**: **`Template string`**, **`import`**
* -> **import** cũng giống **`require`**, nhưng có sự linh hoạt cao hơn trong rất **`nhiều trường hợp nâng cao`**

```js
// index.js
import moment from 'moment';

console.log("Hello from JavaScript!");
console.log(moment().startOf('day').fromNow());

var name = "Bob", time = "today";
console.log(`Hello ${name}, how are you ${time}?`);
```

* -> **`chạy lại webpack`** sau khi thay đổi index.js:
```bash
$ ./node_modules/.bin/webpack
```

## Task Runner - npm script - Automate components during the build process
* -> ta cần 1 bộ chạy Task tự động thực hiện 1 số công việc **khi ta build**: **`tối ưu performance`** (_làm gọn code, tối ưu hình ảnh, chạy test, ..._), **`tự động chạy lại webpack mỗi khi thay đổi javascript`**, ...

* -> **Grunt(2013)** đã từng là Task Runner phổ biến nhất, theo sau ngay đó là **Gulp** - chúng sử dụng các **`plugins bao ngoài các công cụ Command Line`**
* -> nhưng ngày nay **npm script** là lựa chọn phổ biến nhất - tức **`sử dụng khả năng tương thích với script được xây dựng sẵn trong chính npm`** - **`hoạt động với các công cụ command line khác một cách trực tiếp`**

### add "build" and "watch" script
* -> khi sử dụng **`script trong package.json`** để chạy webpack ta **không cần chỉ rõ đường dẫn**, vì npm biết rõ vị trí từng file (_`./node_modules/.bin/webpack`_) của package trong "node_modules"

* **webpack --progress -p** 
* -> để **`chạy webpack`** (sử dụng cấu hình từ file **`webpack.config.js`**); 
* -> **--process** option để hiển thị phần trăm quá trình 
* -> **-p** option để tối thiểu hoá code cho môi trường sản phẩm

* **webpack --progress --watch**
* -> **`tự động chạy lại webpack`** mỗi khi có bất kì thay đổi nào ở file Javascript

* -> để chạy script, ta gõ lệnh **npm run build** (hoặc **npm run watch** nếu muốn tự động hoá)

```json - ta thêm 1 số "script" vào file "package.json"
{
  "name": "modern-javascript-example",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --progress -p",
    "watch": "webpack --progress --watch"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "moment": "^2.19.1"
  },
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-preset-env": "^1.6.1",
    "webpack": "^3.7.1"
  }
}
```

### "webpack-dev-server" package
* -> 1 tool dùng trong **`Developement`** cung cấp **web server đơn giản hỗ trợ live-reloading**
* -> khi chạy, nó sẽ **`start 1 website`** sử dụng file **`index.html`** với đường dẫn **`localhost:8080`** (mặc định)
* -> **tự build lại file Javscript đã bundle** và **refresh lại trình duyệt một cách tự động** mỗi khi **`thay đổi code trong file index.js`**

```bash - install
$ npm install webpack-dev-server --save-dev
```

```json - create "script" to use it
{
  "name": "modern-javascript-example",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --progress -p",
    "watch": "webpack --progress --watch",
    "server": "webpack-dev-server --open"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "moment": "^2.19.1"
  },
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-preset-env": "^1.6.1",
    "webpack": "^3.7.1"
  }
}
```

```bash - start a develop server
npm run server
```

=========================================================================
# Develop Tool for modern Framework:
* -> các _Framework_ hiện đại đều có **`các công cụ (xây dựng trên module bundle, npm script, ...)`** để làm cho quá trình **`Dev trở nên dễ dàng, tối ưu hơn`**: **ember-cli**, **angular-cli**, **create-react-app**, **vue-cli**,...

* => giúp **`khởi tạo một project với tất cả mọi thứ ta cần`**, nhưng ta cần hiểu nó chỉ đơn giản lại quá trình cài đặt dưới một **`tiêu chuẩn chung ổn định`**, đôi lúc ta sẽ cần thêm 1 số tuỳ chỉnh 