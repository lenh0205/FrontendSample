=======================================================================
# webpack "watch" mode option
* -> thiết lập giúp webpack **`tự động build lại nếu có thay đổi trong source`**
* _ta sẽ không cần phải `npm run dev` mỗi thay đổi code trong file `index.js`_

## Cách 1: "watch" mode trong 'webpack.config.js'
* -> **`sau khi ta chạy webpack`**, thì nó sẽ **tự động watch luôn** - thay đổi trong code sẽ được tự động build

```js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  watch: true // Thêm mới dòng này
}
```

## Cách 2: "watch" mode trong 'package.json'
* -> kết quả tương tự như cách 1

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack --watch"
  }
}
```

=======================================================================
# Webpack dev server
* -> tạo 1 **`web server đơn giản tại địa chỉ localhost:8080`** và **`tự động reload`**; giúp quá trình devepment dễ dàng hơn

```bash - install
npm install webpack-dev-server --save-dev
```

```js - webpack.config.js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: { 
    static: {
        // cho Dev Server biết thư mục gốc của website, từ đó tìm đến các resource cần thiết
        directory: path.join(__dirname, 'dist')

        // 1 số option khác:
        compress: true, // enable zip compression
        port: 9000 // đổi port mặc định
    }
  }
}
```

* -> thêm npm script **npm run serve** để chạy máy chủ dev trong với **`webpack-dev-server`**
```json - package.json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack",
    "serve": "webpack serve --open"
  }
}
```
