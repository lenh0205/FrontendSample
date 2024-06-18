> https://webpack.js.org/guides/

# Asset Management (images, fonts, ...)
* -> webpack will **dynamically bundle all dependencies** (creating what's known as `a dependency graph`)
* -> every module now `explicitly states its dependencies`, this help us **avoid bundling modules that aren't in use`**

* -> one of the coolest webpack features is that we can also **include any other type of file**, besides JavaScript, for which there is **`a loader`** or **`built-in Asset Modules`** support
* -> this means that the **same benefits listed above for JavaScript** (_Ex: **`explicit dependencies`**_) can be applied to **`everything used in building a website or web app`**

## Loading CSS

### How to import a CSS file from within a Javascript module
* -> in order to do that, we need to **install and add the `style-loader` and `css-loader` to our `module` configuration** (_`npm install --save-dev style-loader css-loader`_)
* -> **`the order of loaders convention`** that  **'style-loader' comes first and followed by 'css-loader'**; if not followed, webpack is likely to throw errors 

* => _tức là sau khi có những `module loaders` này thì ta có thể `VD: import './style.css'` into **the file that depends on that styling**_
* => _and when **`that module is run`**, **a "style" tag with the stringified css will be inserted into the "head" of your html file**_

```js - webpack.config.js
const path = require('path');

module.exports = {
    // ....,
    module: {
        rules: [
            { // any file ends with ".css" will be served to 'style-loader' and 'css-loader'
                test: /\.css$/i, 
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};
```

### How CSS get bundle
* -> to see what webpack did, inspect the page (_F12_)  and look at **the page's 'head' tags**; it should **`contain the 'style' block that we imported in index.js`**
* -> don't view the page source, as it won't show us the result, because **the 'style' tag is dynamically created by JavaScript**

### Note
* -> in most cases we should **minimize css** for **`better load times in production`**
* -> on top of that, **loaders exist for pretty much any flavor of CSS** we can think of – **`postcss`**, **`sass`**, and **`less`** to name a few

### To Do Step
- ta tạo file `src/style.css`; import nó vào `src/index.js` rồi `npm run build`
- open `dist/index.html` in browser ta thấy chữ `Hello webpack` màu đỏ là ok


## Loading Images
* -> _for `images` like backgrounds and icons_, as of webpack 5, we can **`easily incorporate those in our system`** by using the built-in **Asset Modules**

```js - webpack.config.js
module.exports = {
   // .....,
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
 };
```