
# Custom "path" to static files in build folder of CRA project
* -> CRA app will build project with **`path for assets`** (css, images) begins with **/static**  
```js
<script src="./static/js/5.a4bfdba9.chunk.js"></script>
```

* -> _VD: when we deploy our app to `https://something.com/myapp`, then our app may try to access those asset paths at `https://something.com/static/asset.css`_
* -> _but in our case that's not where the asset lives; the asset lives at `https://something.com/myapp/static/asset.css`_
* -> _this is maybe because we have an **nginx reverse proxy** serving `/myapp` to a different endpoint, so the static assets had to be served from `/search/static`_

* -> Create React App allows us to **`change the prefix for a the built assets`** with the **homepage attribute** in **package.json** file
```json
{
    "homepage": "/myapp"
}
```

==================================================================
# Acess assets outside of the Module System - add other assets to the 'public' folder

* -> if we put a file into the **'public' folder**, it will **`not be processed by webpack`**; instead it will be **copied into the 'build' folder untouched**
* -> to **`reference assets in the 'public' folder`**, we need to use an environment variable called **PUBLIC_URL**

* -> when we run **`npm run build`**, Create React App will **`substitute %PUBLIC_URL%`** with a **correct absolute path** 
* -> so our project works even if we use **`client-side routing`** or **`host it at a non-root URL`**

* -> **only files inside the "public" folder** will be **`accessible by %PUBLIC_URL% prefix`**
* -> if we need to use a file from src or node_modules, we’ll **`have to copy it there`** to explicitly specify our intention to make this file a part of the build

```html - index.html
<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
```

```js - use "process.env.PUBLIC_URL" for javascript code
render() {
  // Note: this is an escape hatch and should be used sparingly!
  // Normally we recommend using `import` for getting asset URLs
  // as described in “Adding Images and Fonts” above this section.
  return <img src={process.env.PUBLIC_URL + '/img/logo.png'} />;
}
```

## Downside
* -> none of the files in public folder get **`post-processed`** or **`minified`**
* -> missing files will not be called at compilation time, and will cause 404 errors for your users
* -> result filenames won’t include content hashes so you’ll need to add query arguments or rename them every time they change.