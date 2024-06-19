> https://webpack.js.org/guides/

# Asset Management (images, fonts, ...)
* -> webpack will **dynamically bundle all dependencies** (creating what's known as `a dependency graph`)
* -> every module now `explicitly states its dependencies`, this help us **avoid bundling modules that aren't in use`**

* -> one of the coolest webpack features is that we can also **include any other type of file**, besides JavaScript, for which there is **`a loader`** or **`built-in Asset Modules`** support
* -> this means that the **same benefits listed above for JavaScript** (_Ex: **`explicit dependencies`**_) can be applied to **`everything used in building a website or web app`**

======================================================================
# Loading CSS

## How to import a CSS file from within a Javascript module
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

## How CSS get bundle
* -> to see what webpack did, inspect the page (_F12_)  and look at **the page's 'head' tags**; it should **`contain the 'style' block that we imported in index.js`**
* -> don't view the page source, as it won't show us the result, because **the 'style' tag is dynamically created by JavaScript**

## Note
* -> in most cases we should **minimize css** for **`better load times in production`**
* -> on top of that, **loaders exist for pretty much any flavor of CSS** we can think of – **`postcss`**, **`sass`**, and **`less`** to name a few

## To Do Step
- ta tạo file `src/style.css`; import nó vào `src/index.js` rồi `npm run build`
- open `dist/index.html` in browser ta thấy chữ `Hello webpack` màu đỏ là ok

======================================================================
# Loading Images
* -> _for `images` like backgrounds and icons_, as of webpack 5, we can **`easily incorporate those in our system`** by using the built-in **Asset Modules**

* -> now, when we _`import MyImage from './my-image.png'`_, that **image will be processed and added to our 'output' directory**
* -> and the `MyImage` variable will **contain the final url of that image after processing**

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
                type: 'asset/resource', // to use built-in "Asset Module"
            },
        ],
    },
 };
```

## Other Loaders with image resource:
* -> **`within our CSS`**, the **css-loader** will perform similar process for _`url('./my-image.png')`_
* -> the loader will **recognize this is a local file**, and **`replace the './my-image.png' path`** with **the final path to the image in your output directory**

* -> the **html-loader** handles <img src="./my-image.png" /> in the same manner

## Step
* -> create an image file `src/icon.png`; import nó qua 1 biến trong `index.js`; dùng javascript để add image element đó vô DOM
* -> trong file `src/style.css` thêm vào selector `.hello` background là `url('./icon.png')`
* -> chạy `npm run build` và ta nên thấy có 1 file image được tạo ra trong `dist`; trên UI , background có những image lặp lại, đồng thời có 1 image bên cạnh chữ `Hello webpack`

======================================================================
# Loading Fonts
* -> the **`Asset Modules`** will **take any file we load through them** and **output it to our build directory**
* => this means we **can use them for any kind of file, including `fonts`**

* -> after the `loader configured` and `fonts in place`, we can incorporate them via **an '@font-face' declaration**
* -> **the local `url(...) directive`** will be picked up by webpack (_as it was with the `image`_)

```js - webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
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
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
};
```

# Step
* -> h ta sẽ add thêm 2 file font `src/my-font.woff`, `src/my-font.woff2`
* -> chỉnh sửa lại `src/style.css`:
```css
@font-face {
    font-family: 'MyFont';
    src: url('./my-font.woff2') format('woff2'),
        url('./my-font.woff') format('woff');
    font-weight: 600;
    font-style: normal;
}

.hello {
    color: red;
    font-family: 'MyFont';
    background: url('./icon.png');
}
```
* -> chạy `npm run build`; ta nên thấy font của `Hello webpack` bị thay đổi

======================================================================
# Loading Data
* -> another useful asset that can be loaded is **data** like: **`JSON files`**, **`CSVs`**, **`TSVs`**, and **`XML`**
* -> **support for `JSON` is actually built-in** (_similar to `NodeJS`_), meaning _`import Data from './data.json'`_ will **work by default**
* -> to _import `CSVs`, `TSVs`, and `XML`_ we could use the **csv-loader** and **xml-loader** 
* (_`npm install --save-dev csv-loader xml-loader`_)

* -> after config, can _import any one of those 4 types of data (JSON, CSV, TSV, XML)_ and the **`Data`** variable we import, will **contain parsed JSON for consumption**

```js - webpack.config.js
const path = require('path');

 module.exports = {
    // .....
    module: {
        rules: [
            // .....
            {
                test: /\.(csv|tsv)$/i,
                use: ['csv-loader'],
            },
            {
                test: /\.xml$/i,
                use: ['xml-loader'],
            },
        ],
    },
};
```

## Step
* -> ta sẽ add 2 file data `src/data.xml` và `src/data.csv`
* -> re-run the `npm run build` command and open `dist/index.html`; we should see our imported data being logged to the console




