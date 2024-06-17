=======================================================================
# Webpack Output hash digest
* -> **thêm chuỗi hash vào output file name** còn nội dung vẫn giữ nguyên, để **`tránh trình duyệt cache lại file js`**
* -> thêm vào **filename** trong **output** option **[hash]** - mặc định là 20 ký tự
* -> _**Note**: nhưng vì mỗi lần build sẽ tạo ra 1 tên file khác nhau nên ta sẽ cần cập nhật lại file `index.html`_

```js - webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.[hash:6].js', // giới hạn hash ở 6 ký tự
    path: path.resolve(__dirname, 'dist')
  }
}
```

=======================================================================
# Webpack multiple entry points

## Single Entry point
* -> **main** entry là **`default entry`** trong webpack

```js - trong "webpack.config.js"
module.exports = {
  entry: './src/index.js',
  // ...
}
// -> thực ra nó là cú pháp shorthand của:

module.exports = {
  entry: {
    main: './src/index.js'
  }
  ...
}
```

## Thêm Entry point
* -> ta sẽ thêm **`cặp key-value`** vào **entry** option với **`tên key bất kì`**; 
* -> **`tên key`** cũng là **tên của entry**; cũng là **giá trị của [name]** với entry tương ứng
```js
module.exports = {
    entry: {
        main: './src/index.js', // entry là "main"
        myTest: './src/my-test.js' // entry là "myTest"
    }
}
```

## Cấu hình Output
* -> vì có **`nhiều entry`** nên ta cũng sẽ có **`nhiều output`**, nên trong **ouput** option ta sẽ cần có 1 pattern tên chung cho các file output
* -> ta có thể sử dụng **[name]** - nó giúp ta **`lấy được tên dựa trên entry`**

```js - webpack.config.js
module.exports = {
  // ...
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

## Result
* -> _với VD trên thì khi chạy webpack sẽ tạo ra 2 file output với tên tương ứng là `main.js` và `myTest.js` trong thư mục **dist**_
* -> ta sẽ **cần có 2 script mới** link đến 2 file output mới trong **`dist/index.html`**

=======================================================================
