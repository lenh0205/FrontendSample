# MIME sniffing
* -> **MIME Sniffing** là technique được sử dụng bởi 1 số trình duyệt web (_`chủ yếu là Internet Explorer`_) giúp **`xác định định dạng tệp của một Content phản hồi`** to process that content
* -> Browsers can use _content sniffing / MIME sniffing_ to **`override the "Content-Type" header`** of a response to **`guess and process the data`** **`using an implicit content type`**

## Advantage
* Kỹ thuật này hữu ích trong trường hợp không có đủ thông tin như Content-Type cho một nội dung cụ thể, do đó có khả năng trình duyệt diễn giải nội dung không chính xác.

## Process:
* -> Browser request for a specific response content that **`don't have Content Type`** 
* -> Browser try to "sniffing" the body of request and parse the body 
* -> than process it

=================================================
# Security hole
* MIME sniffing có thể gây ra lỗ hổng bảo mật. 
* -> this security hole can be **`dangerous for both owner and user`**
* -> Attacher can take advantage of MIME to do an **`Cross Site Scripting`** Attach

```r
// we only allow user to upload file that have Content-Type "JPG" for image to Server
// -> Attacker try to upload an "HTML" file that contain "malicious Javascript" code 
// -> by changing file extension from ".html" that co to ".jpg" than upload it
// -> the Server accept the image
// -> now, when Browser request for that image in reponse, and if the response does not have "Content-Type"
// -> At that time, Browser will "sniffing" MIME and it will know that file is an "HTML" file 
// => Browser will execute that "HTML" then we got hacked
```

## Solution:
* set **`X-Content-Type-Options: nosniff`** in HTTP response headers of Server 
* -> so that Browser won't do `MIME sniffing`; if not having `Content-Type`, just Fail

```js
app.use(helmet.noSniff());
```

==================================================
## MIME type
* là 1 **`specification`** cho biết **`bản chất và định dạng`** của **`documents, files, byte distribution`**

* Nếu không có **`Content-Type`** hoặc `một số trình duyệt không “thích” kiểm tra Content-Type`
* -> Browser sẽ tiến hành 1 cuộc "dò tìm" xem dữ liệu trả về ở dạng nào
* => điều này vô tình tạo ra cuộc tấn công **MIME Sniffing**

```js - VD:
// một API Endpoint trong response headers có chứa thuộc tính Content-Type: application/json
// => client sẽ biết dữ liệu trả về là ở định dạng JSON, từ đó có phương án xử lý phù hợp
// => thay vì phải cố "đoán" xem dữ liệu trả về là text, image hay video…
```

