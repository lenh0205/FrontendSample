===================================================
# Clickjacking
* a technique of **`tricking a user into interacting with a page different from what the user thinks it is`**
* -> tricking website users into **`clicking on a harmful link by disguish the link`** as something else
* -> _tức là ta tưởng ta đang nhấp chuột lên màn hình nhưng thực ra ta đã click lên một đối tượng bị ẩn trên màn hình_

```r - VD:
VD: ta có the most clickable video do ta host trên site của ta
-> điều này làm ta trở thành good target for hackers wanting to steal clicks
-> the hacker build their own site with a "very similar URL" and include our site in an <iframe/>
-> the hacker adds a transparent <div/> on top of the <iframe> and use that <div/> to wrap an <a/>

// Now the user want to view our video can be tricked to performing any action the attacker intends
-> the harmful action like: "downloading malware"; taken to "online scams"
```

```html - describe how to do it
<html>
  <head>
    <style>
      body {
        position: relative;
        margin: 0;
      }
      iframe {
        border: none;
        position: absolute;
        width: 100%;
        height: 100%;
      }
      div {
        z-index: 100;
      }
      a {
        display: block;
      }
    </style>
  </head>
  <body>
    <iframe src="www.bach.com/video-ngoc-trinh"></iframe>
    <div>
        <a 
            href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fwww.buttholebalm.com&p[title]=Itchy"
        ></a>
    </div>
  </body>
</html>
```

## Solution:
* Đảm bảo iframe chỉ được sử dụng cho những trang an toàn
* -> dùng **`HTTP Headers`** để đưa cho trình duyệt những direct instruction 
* -> s/d **`frame-killing`** bằng client-side JavaScript cho những trình duyệt cũ

### "X-Frame-Options" Header
*  **`restricts who can put your site in a frame`**; _được đặc biệt thiết kế để chống clickjacking_
* it has 3 mode: **DENY**, **SAMEORIGIN**, **ALLOW-FROM**

* -> ta có thể dùng **`helmet.frameguard()`** Middleware with configuration object to sets the X-Frame-Options header
```js
app.use(helmet.frameguard({ action: "deny" }));
```

### "Content Security Policy" Header
* liệt kê các tên miền có thể sử dụng resources (_stylesheets, fonts, script_) được phép nhúng
* _cung cấp phạm bi bảo vệ rộng hơn X-Frame-Options header_

```js
// không cho phép hiển thị trong frame
Content-Security-Policy: frame-ancestors 'none'

// chỉ được hiển thị trên chính website gốc
Content-Security-Policy: frame-ancestors 'self'

// được phép hiển thị trên các website được chỉ định
Content-Security-Policy: frame-ancestors *uri*
```

## Frame-Killing:
* dùng code javascript
```html
<style>
  html { display : none; } /* Hide page by default */
</style>
<script>
  if (self == top) { // check domain của trang gốc có khớp với domain của cửa sổ trình duyệt
    document.documentElement.style.display = 'block';
  } else {
    top.location = self.location;
  }
</script>
```

## Risk:
* dùng fake Form giống trang thật để đánh cắp thông tin đăng nhập
* phát tán `Malware` bằng cách chuyển hướng đến link download phần mềm độc hại
* phát tán `worms` trên mạng xã hội

=======================================================
# "iframe" Tag
* is used to embed content (webpages, document) from another source into our HTML document 

## Purpose
* -> usually used for Advertisements, Youtube video, Google map, social media posts, RSS feed; 
* -> used in many hacking techniques
* -> also for most of non developer WordPress user is to display third-party content on the site

## Advantages:
* our iframe **`will load the lasted version`**, we don't need to worry about updating third-party content we want to display 
* -> our Advertising partners can change their promotions
* -> Facebook feed can refresh
* -> Google Map can adjust for new housing developments

* maintaining seperation between our content and other sites can **`provide added Security`**
* -> don't have to import vulnerabilities or errors by adding third-party code directly to our site'files

## Disvantages - Security risks
* any malicious elements in the document we're loading in our window will be available on our site as well
* -> third-parties could take this opportunity to get user data
* -> it's should not be a problem for reputable third-party sources like Google, Youtube ...  

* the **`src`** can be an external website URL or a relative file path
* -> but many website won't work (_VD: https://www.google.com_) 
* -> because a lot of major websites have disabled the use of "iframes"   
* => không cho phép website của ta trông giống của họ

* The common hacking technique:
* -> the embedded web page take up entire frame of our HTML document
* -> our website will look like another website. that's dangerous

```js - VD: we embed a "banking website" 
// if someone visits our website it's actually a facade
// someone will type in their baking information, login credentials 
// => and we could capture it  
```

```js
// Ta sẽ thấy 1 khung cửa sổ của "bing" trên website của ta, và ta hoàn toàn có thể search bằng "bing" như bình thường


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <iframe src="https://www.bing.com" width="750" height="250"></iframe>
    <iframe style="border:0" src="/advertisement.html" width="750" height="100"></iframe>
    {/* embeded pages have a border as default */}
</body>
</html>
```

## WordPress
* Video Module:
* -> add URL for external video to Video Module, it'll automatically generates an iframe to display video

* Code Module:
* -> typing "iframe" tag and attributes out by hand or using "iframe" included in third-party embed codes 
```js - VD: use Facebook post
// First clicking on the "..." of the post -> select "Embed" -> copy the code for "iframe"
// than add it to "Code Module"
```
