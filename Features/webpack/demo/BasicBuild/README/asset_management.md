> https://webpack.js.org/guides/

# Asset Management (images, fonts, ...)
* -> webpack will **dynamically bundle all dependencies** (creating what's known as `a dependency graph`)
* -> every module now `explicitly states its dependencies`, this help us **avoid bundling modules that aren't in use`**

* -> one of the coolest webpack features is that we can also **include any other type of file**, besides JavaScript, for which there is **`a loader`** or **`built-in Asset Modules`** support
* -> this means that the **same benefits listed above for JavaScript** (_Ex: **`explicit dependencies`**_) can be applied to **`everything used in building a website or web app`**

## Loading CSS
* -> in order to **`import a CSS file from within a JavaScript module`**, we need to **install and add the `style-loader` and `css-loader` to our `module` configuration**
* _npm install --save-dev style-loader css-loader_