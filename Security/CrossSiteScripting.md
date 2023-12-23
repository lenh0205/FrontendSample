
# Cross Site Scripting - number one vulnerability on the web today
*  **`malicious scripts are injected`** into vulnerable pages, with the purpose of **`stealing sensitive data`** like _session cookies, or passwords_
* -> The basic rule to lower the risk of an XSS attack is simple **`Never trust user’s input`**

* Mã độc trong đoạn script sẽ được thực thi ở **phía client**; thường dùng để **vượt qua các kiểm soát truy cập** và **mạo danh người dùng**

* có 3 loại: **`Reflected XSS`**, **`Stored XSS`** và **`DOM-based XSS`**

```r VD:
khi đang comment trên 1 bài viết của 1 trang web, malicious user try to insert a script into the comment like this: 
// -> <script>alert('hello')</script>
// -> sau đó enter thì web hiện ra 1 Alert
// => nếu chạy được javascript, malicios user can do many thing else: đánh cắp thông tin, điều hướng đến trang khác, chuyển tiền vào 1 tài khoản chỉ định,...
```

## Solution
* _developer_ 
* -> should always **`sanitize all the input`** coming from the outside, which mean **find and encode** the characters that may be dangerous (_VD: <, >_) 
* -> these input includes **`data coming from forms, GET query urls, and even from POST bodies`**
```r
// đảm bảo nội dung được lưu trữ và hiện thị ra phía người dùng là text thường 
// loại bỏ ký tự đặc biệt trước khi lưu trữ
// tạo list để select thay vì bắt người dùng nhập vào 
// thực hiện bảo mật nội dung: '<meta http-equiv="Content-Security-Policy" content="script-src 'self' https://apis.google.com">'
// lọc nội dung html và hiện thị nội dung dưới dạng text thô
```

```php
// khi người dùng nhập "<script>alert("Xin chào!");</script>"

<?php
  echo $_POST["comment"]; // sẽ render ra UI: <script>alert("Xin chào!");</script>
?>

<?php
  echo strip_tags($_POST["comment"]); // sẽ render ra UI: Xin chào!
?>
```

* _Modern browsers_ 
* -> also help mitigating the risk by adopting better software strategies (_often these are configurable via **`HTTP headers`**_)
* -> the **`X-XSS-Protection HTTP header`** is a basic protection
* _browser detects a potential injected script using a heuristic filter_
* -> If the header is enabled, the browser **`changes the script code, neutralizing it`**
* -> use **`helmet.xssFilter()`** to sanitize input sent to our server
```js
app.use(helmet.xssFilter());
```