> learned about dynamically adding bundles to our HTML

# Output Management
* -> so far we've **`manually` included all our assets in our index.html file**
* -> but as our application grows and once we start **`using hashes in filenames`** and **`outputting multiple bundles`**, it will be **difficult to keep managing your index.html file `manually`**
* -> However, a few plugins exist that will make this process much easier to manage.

## Preparation step
* -> 

## Problem
* -> if we **`changed the name of one of our entry points`**, or even **`added a new one`**; the **`generated bundles would be renamed on a build`**, but **our index.html file would still reference the old names**
* -> we can use **HtmlWebpackPlugin** to fix that

===============================================================================
# Setting up HtmlWebpackPlugin
* -> the _HtmlWebpackPlugin_ **by default will generate its own `index.html` file** (_even though we already have `one in the dist/ folder`_)
* -> this means that it will **replace our `index.html` file with a newly generated one**

* _if we open `index.html` in code editor, we'll see that the **`HtmlWebpackPlugin has created an entirely new file`** for us and that **all the bundles are automatically added**_

* install: (_`npm install --save-dev html-webpack-plugin`_)
```js - webpack.config.js
module.exports = {
    // ....
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Output Management',
        }),
    ],
};
```

===============================================================================
# Cleaning up the `/dist` folder
* -> our /dist folder now is becoming quite cluttered; webpack will **`generate the files and put them in the /dist folder`** for us, but it **doesn't keep track of which files are actually in use by our project**
* _tức là nếu ta để những resource ta cần dùng vào thư mực `/dist` rồi link tụi nó vào `index.html` thì sau khi webpack build ra 1 file html mới thì link tới những resource này sẽ không còn_

* => in general it's **good practice to clean the /dist folder before each build**, so that **`only used files will be generated`**
* => take care of that with **output.clean** option 
* => now we **only see the files generated from the `build`** and **no more old files**

```js - webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // .....
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true, // this one
    },
};
```

===============================================================================
# the Manifest
* -> we might be wondering how _webpack and its plugins_ seem to **`"know" what files are being generated`**
* -> the answer is in the **manifest** that webpack keeps to track **`how all the modules map to the output bundles`**

* => to **managing webpack's `output` in other ways**, the _manifest would be a good place to start_
* -> **`the manifest data`** can be **`extracted into a json file`** for consumption using the WebpackManifestPlugin.

