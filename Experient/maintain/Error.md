=======================================================================
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

# Typescript - Lỗi: Variable 'arr' implicitly has an 'any[]' type
* ta chỉ cần khai báo nó 1 cách explicit là được
```js
const arr: any[] = [];
```

# Typescript - This comparison appears to be unintentional because the types '...' and '...' have no overlap.ts(2367)
* -> lỗi này thường xảy ra khi ta sử dụng toán tử **&&** để nối 2 **`condition`** với nhau; rất có thể ta đã bỏ condition **!==** trước condition **===**
* -> chỉ cần đảo lại là được
```js - VD:
const display = mode == enumUploaderMode.DigitalSignVBDen && mode !== enumUploaderMode.DownloadOnly;
// đổi lại thành:
const display = mode == mode !== enumUploaderMode.DownloadOnly && enumUploaderMode.DigitalSignVBDen;
```

=======================================================================
# CSS - Lỗi: UI của 1 cái popup giật lia lịa khi mở dropdown,...
* -> rất có thể đây là lỗi liên quan đến **`thanh scroll của Browser`** (do **`thuộc tính overflow của 1 element`**); thanh scroll đột nhiên xuất hiện tại 1 thời điểm/ hành động nào đó
* -> solution: ta cho element đó **`mặc định hiển thị thanh scroll luôn`**
```css
body {
   overflow: scroll;
}
```

========================================================================
# React - Lỗi "Minified React error #310; use the non-minified dev environment" trên production và "Rendered more hooks than during the previous render" trên development
* -> ta cần đảm bảo **Only Call Hooks at the Top Level** -không call nó trong `loops, conditions, or nested functions`
* -> đảm bảo **Only Call Hooks from React Functions** - không call Hooks from regular JavaScript functions

* -> nếu ta kiểm tra hết mà vẫn bị lỗi thì có thể là do xung đột các thư viện mà ta import; VD: `useTranslate` ta thử bỏ nó ra xem còn bị lỗi không
* -> hoặc 1 số cấu hình lạ của thằng devextreme, thử bỏ đi xem; hoặc `cellRender` của `Column` chỉ dùng để render UI, nếu ta muốn dùng **`useState()`** thì ta hãy tách phần UI return ra 1 component riêng rồi s/d React hook trong nó

# React - Lỗi khi app cố gắng request đến các resouce static file của React nhưng tìm không thấy
* -> Ví dụ trong trường hợp **`custom 1 app`** MVC sử dụng React làm js; 
* -> ta có thể hard code đường dẫn đến file entry point của React là **bundle.js**
* -> nhưng vấn đề là file **bundle.js** sẽ cần load/request những chunk cũng như 1 số resource khác của nó
* -> nên ta cần cung cấp **`PUBLIC_URL`** với đường đẫn đến thư mục **build** của React nếu không "bundle.js" chắc chắn sẽ request đến sai URL
* -> hoặc ta tạo 1 thẻ anchor trong React có href tham chiếu đến 1 file static trong thư mục **`/public`** thì ta cần thêm **PUBLIC_URL** nếu không muốn khi deploy bị lỗi
```js
const pdfPath = process.env.PUBLIC_URL + '/assets/Scan_App_SetUp.msi';
const link = document.createElement('a');
link.href = pdfPath;
link.download = 'Scan_App_SetUp.msi';
```

========================================================================
# Devextreme lib - lỗi khi select 1 nhưng lại thành select all trong DataGrid
* -> đây có thể là do ta đang **`truyền sai key`** để nó có thể chọn
* -> đầu tiên ta select rồi vào **DevTool/Application/Session Storage/** xem xem SelectedRowKey có giá trị như nào, nếu mà là mảng undefined thì giả thiết của ta có vẻ đúng
* -> ta sẽ cần kiểm tra lại (_thử bỏ đi_) các property như **`key`**, **`keyExpr`** của DataGrid và đặc biệt là property **`key`** của **CustomStore**