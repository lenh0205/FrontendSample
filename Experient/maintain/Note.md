# Khi viết thư viện cho dự án
* -> cần có 1 cấu hình khi khởi tạo instance của thư viện; và cho phép truyền vào những cấu hình riêng để ghi đè cấu hình chung (nếu cần) khi sử dụng Method từ instance đó 

# 'document.createElement' không append element to DOM
* -> "document.createElement" sẽ **`create element in memory`** 
* -> exists as a JavaScript object that is **`able to manipulate`** (VD: gán sự kiện onClick)
* -> but it is **`not yet part of the actual DOM tree`**

```js
const pdfPath = '/assets/Scan_App_SetUp.msi';
const link = document.createElement('a');
link.id = "scan-anchor-download-id";
link.href = pdfPath;
link.download = 'Scan_App_SetUp.msi';

// để append nó vào DOM tree
document.body.appendChild(link);
```