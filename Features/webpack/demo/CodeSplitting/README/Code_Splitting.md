# Code Splitting
* -> _Code splitting_ is **`one of the most compelling features of webpack`**
* -> this feature allows us to **split our code into various bundles** which can then be **loaded `on demand` or `in parallel`**
* -> it can be used to **achieve smaller bundles** and **control resource load prioritization** which, if used correctly, can have a major impact on load time

## Implement
* _there're **`3 general approaches`** to code splitting available:_
* -> **Entry Points** - manually split code **using `entry` configuration**
* -> **Prevent Duplication**: **use `Entry dependencies` or `SplitChunksPlugin`** to dedupe and split chunks.
* -> **Dynamic Imports**: split code via **inline function calls within modules**

================================================================
# Entry Points
* -> _this is by far the `easiest and most intuitive` way to split code; however, it is more **manual and has some pitfalls** we will go over_
* -> we will split **`another module from the main bundle`**

```js - webpack.config.js
const path = require('path');

module.exports = {
    mode: 'development', // this one
    entry: { // this one 
        index: './src/index.js',
        another: './src/another-module.js',
    },
    output: {
        filename: '[name].bundle.js', // this one
        path: path.resolve(__dirname, 'dist'),
    },
};
```

## Step:
* -> thêm file `src/another-module.js` và import `lodash`

* => an issue for our example, as **`lodash is also imported within ./src/index.js`** and will thus be **duplicated in both bundles**

## Pitfalls
* -> if there are **any duplicated modules between entry chunks** they will be **`included in both bundles`**
* -> it isn't as flexible and **`can't be used to dynamically split code with the core application logic`**

================================================================
# Prevent Duplication

## Entry dependencies
* -> the **dependOn** option allows to **`share the modules between the chunks`**

* -> if we **`use multiple entry points on a single HTML page`**, **optimization.runtimeChunk: 'single'** is needed too, otherwise we could get into trouble
* -> although using multiple entry points per page is allowed in webpack
* -> it should be avoided when possible in favor of **an entry point with multiple imports**: **`entry: { page: ['./analytics', './app'] }`**
* ->. This results in a better optimization and consistent execution order when using async script tags.

```js - webpack.config.js
const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        index: {
            import: './src/index.js',
            dependOn: 'shared',
        },
        another: {
            import: './src/another-module.js',
            dependOn: 'shared',
        },
        shared: 'lodash',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        runtimeChunk: 'single',
    },
};
```

* -> when we run `npm run build`, it will generate `runtime.bundle.js`, `shared.bundle.js`, `index.bundle.js`, `another.bundle.js`