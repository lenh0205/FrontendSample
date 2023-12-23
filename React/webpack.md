> tốt nhất ta nên xem trình duyệt bắn ra lỗi gì rồi hẳn cài thư viện cũng như cấu hình cho phù hợp (_thường thì chỉ cần viết lại "fallback", cùng lắm là Provider_)

===============================================

# Không hỗ trợ polyfill cho "Node core Module"
* -> Trước đây, **`webpack < 5 used to include polyfills for node.js core modules by default`**
* -> _Ví dụ như các Node package: `stream, Buffer, crypto, ...`_

* **Solution**: ghi đè cấu hình webpack bằng file **webpack.config.js**
* -> cài thêm những library giống build-in package của NodeJS nhưng dành cho Browser: **`stream-browserify`**, **`crypto-browserify`**, **`assert`**, **`stream-http`**,  **`https-browserify`**, **`os-browserify`**, **`url`** **`buffer`**, **`process`** ...
* -> 

```js - VD:
    {
    resolve: {
    modules: [...],
    fallback: {
        "fs": false,
        "tls": false,
        "net": false,
        "path": false,
        "zlib": false,
        "http": false,
        "https": false,
        "stream": false,
        "crypto": false,
        "crypto-browserify": require.resolve('crypto-browserify'),
    } 
    },
    entry: [...],
    output: {...},
    module: {
    rules: [...]
    },
    plugins: [...],
    optimization: {
    minimizer: [...],
    },
    // ....
}
```

# Ghi đè cấu hình webback mà không phải "npm eject"
* Sử dụng **`react-app-rewired`**

```r - Install
npm install --save-dev react-app-rewired
```

```json - package.json
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
}
```

```js - Tạo file root/config-overrides.js 
onst webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url")
    })
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ])
    return config;
}
```

* Khi ta thay `NodeJS crypto` bằng `crypto-browserify`, các package run trên browser sẽ không tìm thấy đối tượng `crypto` và báo lỗi **`Buffer is not defined`**
```js
// ta cần gán lại đối tượng global cho buffer
import { Buffer } from 'buffer';
window.Buffer = Buffer;
```