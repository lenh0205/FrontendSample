
# Development
* (_only meant for development, please avoid using them in production_) 

```js - webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
    mode: 'development', // this one
    entry: {
        index: './src/index.js',
        print: './src/print.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development', // this one to change html title
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
 };
```

================================================================================
# Using source maps
* -> when webpack bundles our source code, it can **become difficult to track down errors and warnings to their `original location`**
* -> this isn't always helpful as we probably want to **know exactly which source file the error came from**

* _for example, if we `bundle three source files` (a.js, b.js, and c.js) `into one bundle` (bundle.js) and `one of the source files contains an error`, the **`stack trace will point to bundle.js`**_

* => in order to make it easier to track down errors and warnings, **JavaScript offers `source maps`**, which **`map our compiled code back to our original source code`**
* -> now we'll use the **inline-source-map option** (_there're a lot of other different options_), which is **`good for illustrative purposes`** (_though not for production_)

```js - webpack.config.js
const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        print: './src/print.js',
    },
    devtool: 'inline-source-map', // this one
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
};
```

## Step:
* -> sửa file `src/print.js` để nó gây lỗi và chạy `npm run dev`;
* -> ta nên thấy the error **contains a reference to the file (print.js) and line number (2) where the error occurred**, trông giống thế nào
```r
Uncaught ReferenceError: cosnole is not defined
   at HTMLButtonElement.printMe (print.js:2)
```

================================================================================
# Choosing a Development Tool
* -> it quickly `becomes a hassle` to **manually run npm run build every time we want to compile our code**
* -> there're a couple options available in webpack that help us **automatically compile our code whenever it changes**: **`webpack's Watch Mode`**, **`webpack-dev-server`**webpack-dev-middleware
* _in mose cases, we probably would want to use webpack-dev-server_

## Using "Watch mode"
* -> we can **instruct webpack to "watch" all files within our dependency graph for changes**
* -> if **`one of these files is updated`**, the **code will be recompiled** so we don't have to run the **`full build manually`**

* -> the only downside is that we have to **refresh your browser in order to see the changes**
* -> to make that would happen automatically as well, we can use **webpack-dev-server** 

* -> add an **npm script** that will **`start webpack's Watch Mode`**; 
* _then we run `npm run watch`; we can see that it **doesn't exit the command line** because the script is currently watching our files_

```json - package.json
{
    // ....
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "watch": "webpack --watch",
        "build": "webpack"
    },
    // .... 
}
```

## Using webpack-dev-server
* -> the _webpack-dev-server_ provides us with **a rudimentary web server and the ability to use `live reloading`** 
* -> (_npm install --save-dev webpack-dev-server_)

* -> _webpack-dev-server_ **serves bundled files from the directory defined in `output.path`**
* _Ex: files will be available under **http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename]**_
* -> in this case by default, it will **serve the files from the `dist` directory on `localhost:8080`**

* -> webpack-dev-server **doesn't write any output files after compiling**
* -> instead, it **keeps bundle files in memory** and **`serves them as if they were real files mounted at the server's root path`**
* => if our page expects to find the bundle files on a different path, we can change this with the **devMiddleware.publicPath** option in the **`dev server's configuration`**

* -> the **optimization.runtimeChunk: 'single'** was added because we have **`more than one entrypoint on a single HTML page`** (_missing it can cause problem_)
* _`option` này sẽ tạo 1 file là `runtime.bundle.js` nếu "output" option là "[name].bundle.js_

```js - webpack.config.js
const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
    // .....
    devServer: {
        static: './dist',
    },
    optimization: {
        runtimeChunk: 'single',
    },
};
```

* -> add a script to **run the dev server of webpack**:
* _now when run `run npm start` our browser automatically loading up our page_
* _also, if we now `change any of the source files and save them`, the web server will **automatically reload after the code has been compiled**_

```json - package.json
{
    // ....
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "watch": "webpack --watch",
        "start": "webpack serve --open",
        "build": "webpack"
    },
}
```

## Using webpack-dev-middleware
* -> _`webpack-dev-middleware`_ is **used in webpack-dev-server internally**
* -> it is **`a wrapper`** that will **emit files processed by webpack to a server**
* -> it's available as **`a separate package`** to allow **more custom setups if desired**

* -> the **publicPath** (webpack option) will be **`used within our server script`** as well in order to make sure **files are served correctly on http://localhost:3000**

* -> our example is about combining **webpack-dev-middleware** with **an express server**
* (_npm install --save-dev express webpack-dev-middleware_)

```js - webpack.config.json
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // .....
    devServer: {
     static: './dist',
   },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/', // this one
    },
};
```

### Dựng Express server
* -> tạo file `server.js` tại root sử dụng `expressjs` để tạo server và import **webpack-dev-middleware** làm middleware; 
* -> thêm `npm script` để chạy server; rồi chạy `npm run server`
* -> nó sẽ chạy 1 `express server` (nhưng sẽ không tự động mở cửa sổ trên trình duyệt khi start cũng như live reloading như khi chạy `webpack-dev-server`)

```json - package.json
{
   "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "watch": "webpack --watch",
        "start": "webpack serve --open",
        "server": "node server.js", // this one
        "build": "webpack"
   },
}
```