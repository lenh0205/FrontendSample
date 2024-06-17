# webpack
* -> **a static module bundler** for modern JavaScript applications
* -> when webpack processes our application, it **internally builds a dependency graph** from **`one or more entry points`**
* -> then **combines every module our project needs** into **`one or more bundles`**, which are **`static assets to serve our content from`**

* _there're 6 core concept in webpack:_

==================================================================
# Entry 
* -> _an entry point_ indicates **which module webpack should use to begin** building out its **`internal dependency graph`** (default value là **./src/index.js**)
* -> **webpack will figure out** which **`other modules and libraries`** that **`entry point depends on`** (directly and indirectly)

* _hiểu đơn giản thì entry point là `1 module mà nó depend on các modules khác` (dependencies khác), và `các module khác đó lại phụ thuộc vào các module khác nữa`, tạo nên 1 **dependency graph**_
* _và **tất cả sự phụ thuộc (tính từ entry point) webpack đều có thể nắm hết**_

```js - webpack.config.js
module.exports = {
  entry: './path/to/my/entry/file.js',
  // tương đương: entry: { main: './path/to/my/entry/file.js' }
};
// nếu không specific thì default value là "./src/index.js"
```

# Output
* -> the _`output` property_ tells webpack **where to emit the bundles it creates** and **how to name these files**
* -> defaults to **./dist/main.js** for the **`main output file`** and to the **./dist** folder for **`any other generated file`**

```js - webpack.config.js
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js',
  },
};
```

# Loader
* -> out of the box, **webpack only understands JavaScript and JSON files**
* -> **`Loaders`** allow webpack to **process other types of files (modules)** and **convert them into valid modules** that **`can be consumed by our application`** and **`added to the dependency graph`**
* _hiểu đơn giản là có thể `dependency graph` ban đầu bao gồm invalid modules (modules webpack không hiểu), `Loader` sẽ giúp chuyển những thằng đó thành valid modules và tạo lại `dependency graph` phù hợp_

* _At a high level, `loaders` have **two properties** in `webpack configuration`:_
* -> the **test** property identifies **`which file or files should be transformed`**
* -> the **use** property indicates **`which loader should be used to do the transforming`**

* -> in webpack config, we'll **`defining rules`** (_under **module.rules**, not **rules**_) for a single module

* -> _the code below tell **webpack compiler**, when it come across `a path that resolves to a '.txt' file` **inside of a require()/import statement**_
* -> _`use the 'raw-loader'` to **transform it before add it to the bundle**_
```js - webpack.config.js
const path = require('path');

module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js',
  },
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
};
```

# Plugins
* -> _plugins_ can be leveraged to **`perform a wider range of tasks`** like **bundle optimization**, **asset management** and **injection of environment variables**
* -> a plugin is able to **hook** into **`key events that are fired throughout each compilation`**
* => every step of the way, the plugin will have **full access to the "compiler"** and **the current compilation**

* -> to use a plugin, we need to **`require()`** it and add it to the **plugins** array options
* -> most plugins will provide options to customize it

* _Ex: the **html-webpack-plugin** **`generates an HTML file`** for our application and automatically **`injects all our generated bundles`** into this file_
```js - webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  // we need to create an new instance each time we use it in config 
};
```

# Mode
* -> by setting the **`"mode" parameter`** to either **development**, **production** or **none**, we can **`enable webpack's built-in optimizations`** that **`correspond to each environment`**
* -> the default value is **production**

```js - webpack.config.js
module.exports = {
  mode: 'production',
};
```

# Browser Compatibility
* -> webpack supports all browsers that are **ES5-compliant** (IE8 and below are not supported)
* -> webpack needs **`Promise`** for **import()** and **require.ensure()**; if you want to support older browsers, we will need to load **`a polyfill before using these expressions`**