
# Get "query parameter" by javascript

```js
const urlParams = new URLSearchParams(window.location.search);
const urlParams = (new URL(window.location)).searchParams;
const urlParams = new URLSearchParams((new URL('https://example.com?foo=1&bar=2')).search);

const myParam = urlParams.get('myParam'); // get specific query param
const params = Object.fromEntries(urlSearchParams.entries()); // get all query params
```

# add javascript library file directly to index.html and use it in React 
```js
// index.html
<div id="root"></div>
<script>var MvcViewName = "TiepNhanVanBanDen";</script>

<script src="/DesktopModules/MVC/QuanLyVanBan/GUI/Scripts/External/vgcaplugin.js"></script>

// View.ts
 const ViewName = (window as any)?.MvcViewName || 'index';

// VGCAService.ts
const validateFunc = (func: any) => {
    if (typeof func !== "function") return () => null;
    return func;
}
export const vgca_comment = validateFunc((window as any)?.vgca_comment);
export const vgca_sign_appendix = validateFunc((window as any)?.vgca_sign_appendix);
export const vgca_sign_approved = validateFunc((window as any)?.vgca_sign_approved);
export const vgca_sign_copy = validateFunc((window as any)?.vgca_sign_copy);
export const vgca_sign_issued = validateFunc((window as any)?.vgca_sign_issued);
```

# Take route variable from .env file into "index.html" before bundling
```js
// .env.locol
PUBLIC_URL = /qlvbdnn/DesktopModules/MVC/QuanLyVanBan/GUI/Scripts/build/

// index.html
<script type="text/javascript" src="%PUBLIC_URL%/base64.js"></script>
```