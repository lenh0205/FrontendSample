
# Provide "watch" mode in 'create-react-app'
* -> Create React App **`does not provide watching build mode oficially`**
* -> these script provides watching build mode for an external tool such as Chrome Extensions or Firebase app
* -> but this won't work for Typescript

```js
process.env.NODE_ENV = 'development';

const fs = require('fs-extra');
const paths = require('react-scripts/config/paths');
const webpack = require('webpack');
const config = require('react-scripts/config/webpack.config.dev.js');

// removes react-dev-utils/webpackHotDevClient.js at first in the array
config.entry.shift();

webpack(config).watch({}, (err, stats) => {
  if (err) {
    console.error(err);
  } else {
    copyPublicFolder();
  }
  console.error(stats.toString({
    chunks: false,
    colors: true
  }));
});

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml
  });
}
```