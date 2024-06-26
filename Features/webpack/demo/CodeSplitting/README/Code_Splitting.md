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
* -> although using **`multiple entry points per page is allowed in webpack`**; it should be avoided when possible 
* -> in favor of **an entry point with multiple imports**: **`entry: { page: ['./analytics', './app'] }`**
* -> this results in a _better optimization_ and _consistent execution_ order when using **async** script tags

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
* -> when we run `npm run build`, it will generate `runtime.bundle.js` (do "optimization.runtimeChunk" option), `shared.bundle.js`, `index.bundle.js`, `another.bundle.js`

## SplitChunksPlugin
* -> the **SplitChunksPlugin** allows us to **`extract common dependencies into an existing entry chunk or an entirely new chunk`**
* -> however, it's important to note that **`common dependencies are only extracted into a separate chunk`** if they **meet the size `thresholds` specified by webpack**

* -> with the _`optimization.splitChunks`_ configuration option in place, we should now see **the duplicate dependency removed from** our `index.bundle.js` and `another.bundle.js`
* -> the plugin should notice that we've separated `lodash` out to **a separate chunk** and **remove the dead weight from our main bundle**

* _some other useful plugins and loaders provided by the community for splitting code like: **mini-css-extract-plugin** - for **`splitting CSS`** out from the main application_ 

```js - webpack.config.js
const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        another: './src/another-module.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: { // this one
        splitChunks: {
            chunks: 'all',
        },
    },
};
```
* -> sau khi run `npm run build` nó sẽ tạo ra file `index.bundle.js`, `another.bundle.js`, `vendors-node_modules_lodash_lodash_js.bundle.js`

===================================================================
# Dynamic Imports
* -> **`2 similar techniques are supported by webpack`** when it comes to **dynamic code splitting**
* -> the first and recommended approach is to use the **import()** syntax that conforms to the **`ECMAScript proposal for dynamic imports`**
* -> the legacy, webpack-specific approach is to use **require.ensure**

```js - webpack.config.js
 const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
```

## Note
* -> we need **default** (_`import('lodash').then(({ default: _ }) => {...}`_) 
* -> because since **webpack 4**, when **`importing a CommonJS module`**, the import will **no longer resolve to the value of `module.exports`**
* -> it will instead **create an artificial namespace object** for the **`CommonJS module`**

* -> as **`import()`** returns a **promise**, it can be used with **`async/await`** hoặc **`.then()`**
* -> it is possible to provide **a dynamic expression** to **`import()`** when we might need to **``import specific module based on a computed variable later`**
```js - Ex:
// imagine we had a method to get "language" from cookies or other storage
// we can only get it at "runtime"
const language = detectVisitorLanguage();

import(`./locale/${language}.json`).then((module) => {
  // do something with the translations
});
// => this will cause every .json file in the ./locale directory to be bundled into the new chunk
```

## Step
* -> xoá file `another-module.js`;
* -> sửa file `index.js` thay vì **statically importing** 'lodash', sửa thành **dynamic importing to separate a chunk**
* -> sau khi chạy `npm run dev`, ta nên thấy `lodash` separated out to a separate bundle

===================================================================
# Prefetching/Preloading modules
* -> webpack 4.6.0+ adds support for **prefetching** and **preloading**
* -> using these **inline directives** while **`declaring our imports`** allows webpack to **output "Resource Hint"** which tells the browser that for:
* -> **prefetch**: **`resource`** is probably needed for some **`navigation in the future`**
* -> **preload**: **`resource`** will also be needed during the **`current navigation`**


## Prefetching
* _Ex: a `HomePage` component, which renders a `LoginButton` component which then on demand loads a `LoginModal` component after being clicked_

```js - LoginButton.js
import(/* webpackPrefetch: true */ './path/to/LoginModal.js');
```
* -> this will result in **<link rel="prefetch" href="login-modal-chunk.js">** being **appended in the `head` of the page**
* -> phần **comment "/* webpackPrefetch: true */"** được gọi là **`Prefetch directive`** thuộc **`webpack magic comments`** (https://webpack.js.org/api/module-methods/)
* -> _khi webpack gặp dòng này nó sẽ generate 1 seperate chunk cho "LoginModal.js" và add 1 prefetch link vào html của ta_ 

* -> which will **instruct the browser to `prefetch` in `idle` time** the _login-modal-chunk.js_ file
* -> _webpack_ will **add the `prefetch hint` once the `parent chunk` has been loaded**

* _tức là chưa cần xài, nhưng đang rãnh thì cứ load trước đi; sau này xài_

## Preloading
* -> an example of this can be having a Component which always depends on **a big library that should be in a separate chunk**
* -> **`Note`**: using **`webpackPreload`** incorrectly can actually **hurt performance**, so be careful when using it

### "Preload" vs "Prefetch"
* _**Preload directive** has a bunch of differences compared to **prefetch**:_
* -> _`a preloaded chunk`_ **starts loading in `parallel` to the parent chunk**; _`a prefetched chunk`_ **starts `after` the parent chunk finishes loading**
* -> _`a preloaded chunk`_ has medium priority and is **instantly downloaded**; _`a prefetched chunk`_ is downloaded while the browser is idle
* -> _`a preloaded chunk`_ **should be instantly requested by the parent chunk**; _`a prefetched chunk`_ **can be used `anytime` in the future**

### Example:
* _a component `ChartComponent` which needs **a huge** `ChartingLibrary`_
* _it displays a `LoadingIndicator` when rendered and instantly does an **on demand import** of `ChartingLibrary`_

```js - ChartComponent.js
import(/* webpackPreload: true */ 'ChartingLibrary');
```
* -> When a `page` which uses the `ChartComponent` is requested, the `charting-library-chunk` is also requested via **<link rel="preload">**

* -> assuming the `page-chunk` is smaller and finishes faster, the page will be displayed with a `LoadingIndicator`, until the already requested `charting-library-chunk` finishes
* => this will give **a little load time** boost since it **`only needs one round-trip instead of two`**; especially in **high-latency environments**

* _tức là 1 cái page mới vô cứ hiện 1 UI nhẹ nhẹ gì đó trước đã (VD: Loading), còn UI chính nặng thì cứ load khi nào load xong sẽ thế vô cái Loading_

### control "preload"
* -> sometimes we need to have our own **`control over preload`**
* -> For example, **preload of any dynamic import can be done via async script**; this can be useful in case of **streaming server side rendering**

```js
const lazyComp = () =>
  import('DynamicComponent').catch((error) => {
    // Do something with the error.
    // For example, we can retry the request in case of any net error
  });
```

* -> if the **script loading will fail before webpack starts loading of that script by itself** (_i **`webpack creates a script tag`** to **`load its code`**, if that **`script is not on a page`**_), 
* -> that **catch handler won't start till `chunkLoadTimeout` is not passed**
* -> this behavior can be unexpected; but it's explainable — webpack can not throw any error, **cause webpack doesn't know**, that script failed.
* -> webpack will **add `onerror` handler to the script** right after the error has happen

* -> to prevent such problem we can **`add our own onerror handler`**, which **removes the script in case of any error**
* -> in that case, **Webpack will create its own script** and **any error will be processed without any timeouts**
```js
<script
  src="https://example.com/dist/dynamicComponent.js"
  async
  onerror="this.remove()"
></script>
```

===================================================================
# Bundle Analysis
* -> once we start splitting our code, it can be useful to **analyze the output to check where modules have ended up**
* -> https://github.com/webpack/analyse