
# Typescript - Lỗi nếu ta đã cài package nhưng trang vẫn báo lỗi "Could not find a declaration file for module 'module-name'."
* có 3 cách xử lý:
* -> cài thư viện declare type for package from **@types**:
```sh
npm install -D @types/module-name
```
* -> changing **import** statements to **require**
```js
// thay "import * as yourModuleName from 'module-name';"
const yourModuleName = require('module-name');
```

* -> ta tự định nghĩa type declartion cho nó luôn:
* => TypeScript looks for **`.d.ts files`** in the same places that it will look for normal .ts files
* => as specified under "files", "include", and "exclude" in the tsconfig.json
```js
// VD: ta đang import a third-party module 'foo' that doesn't provide any "typings" (either in the library itself, or in the @types/foo package)

// foo.d.ts
declare module 'foo'; // -> when we import "foo" it'll just be typed as "any"

// ta có thể custom riêng (chỉ cần định nghĩa type cho những API ta dùng là đủ):
// foo.d.ts
declare module 'foo' {
    export function getRandomNumber(): number
} 
// other file:
import { getRandomNumber } from 'foo';
const x = getRandomNumber(); // x is inferred as number

// Nếu ta muốn all libraries "without typings" to be imported as "any"
declare module '*';
```