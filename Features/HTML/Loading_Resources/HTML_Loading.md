
# How Browser parse HTML

* **when HTML downloaded by the browser**
* -> Browser starts to at the very top of HTML file and **`parse line by line`** until reach the bottom
* -> when doing this, if it across resources it needs to downloaded (VD: <img src="img.png">) 
* -> it'll **`send a request`** to download that (_in the background_) and **continue parsing even the resource isn't finished downloaded** 

* But when it comes to **Javascript**
* -> **normal script tag** will send a request to download and **`the Parser stop`**
* -> the parser **wait until the script tag is download and executed**, before it'll continue parsing the rest of HTML file
* -> when the parsing HTML done, the **`Document ready`**
* => lý do tại sao `normal script tag thường đặt at very bottom of HTML`, so that the Parser can find all the images, other contents,... before get Javascript

## Async
* **`Async`** make the page speeds faster because the browser can start to render elements sooner
* -> Async tells Parser that it can `download this Javascript in the background`
* -> Parser will **continue to parse while the Javascript is being download**
* -> _as soon as Javascript is being done downloaded_, it'll completely **stop parsing to execute javascript** (_before window's **load** event_)
* -> **`resume parsing`** after javascript is done being executed

* **Lưu ý**:  **`Document ready`** ngay khi parse xong HTML; dù cho thời điểm parse xong HTML diễn ra trước khi Javascript is downloaded 

* => if we have multiple async script, they'll **`loaded in random order`** depending on how fast the actual file downloads (**`browser can download and execute them in parallel`**)
* => tốt nhất nên dùng khi có những small javascript files don't depend on other (_can speed up the page load time_)

* **Disadvantages**: 
* -> can break the **`render-blocking CSS rule`** (_loads correctly and doesn’t appear blank while the JavaScript file is loading_)
* -> If async is used, the CSS file will be downloaded as soon as the JavaScript file starts loading
* -> can cause problems if the JavaScript file is large or takes a long time to load
* -> delay the loading of other resources on the page, such as images
* -> issues with certain types of user scripts and extensions rely on being able to modify the DOM after the page has loaded but DOM might not have already loaded by the time they run

## Defer
* similar to **`Async`** but
* -> it wait until the Parser **completely finish parsing all the HTML**
* -> _as soon as parsing HTML done_, it **execute all the defer script tags in order** that they're listed inside of HTML document
* -> **`before the Document ready`** (_javascript run executed before **onDOMContentLoaded** event is fired from the document_)

* => **`defer`** is the most useful (_which very important to load orderly the library depend on other libraries_)
* => instead of use normal script and put it in the bottom of <body> tag; just use defer script at <head> tag

* Deferred scripts can be **updated independently** of the rest of the page (_if we change a deferred script, you don’t have to re-parse and re-render the entire page_)


==================================================
# Lưu ý:
* **Browser sẽ cache lại file script** đã tải xuống lần đầu để tránh phải tải lại mỗi lần chuyển trang trong website
* Nhưng Browser sẽ cần parse và load lại file script mỗi lần chuyển trang thì mới có thể chạy được 
* Nếu mở DevTool Network, request file script lần đầu sẽ là **`from cache disk`**, những lần request sau sẽ là **`from cache memory`**

* Việc để async hoặc defer <script/> ở dòng cuối của <body/> không có nhiều ý nghĩa 

* <script/> chứa code tương tác với DOM (_trừ defer_)sẽ không đợi DOM load xong mới execute, vậy nên cần đặt ở vị trí phù hợp

==================================================
_https://javascript.info/onload-ondomcontentloaded_
# Life Cycle of HTML page:
* there're 3 important events:

* **DOMContentLoaded** – the browser fully loaded HTML, and the DOM tree is built, but external resources like pictures <img> and stylesheets may not yet have loaded
* -> Browser needs to execute script tag before continuing building the DOM, so **`DOMContentLoaded has to wait`** (_nhưng `async script` và `document.createElement('script')` thì không_)
* -> DOM is ready, so the handler can lookup DOM nodes, initialize the interface
```html
<script>
  document.addEventListener("DOMContentLoaded", () => {
    alert('" is ready');
    alert(`Image size: ${img.offsetWidth}x${img.offsetHeight}`);
    // -> found image, but doesn’t wait for the image to load. So alert shows zero sizes
  });
</script>
<script>
  alert("Library loaded"); // "Library loaded" before "DOM is ready"
</script>

<img id="img" src="https://en.js.cx/clipart/train.gif?speed=1&cache=0">
```

* **load** – not only HTML is loaded, but also all the external resources: images, styles etc.
* ->  styles are applied, image sizes are known etc

* **beforeunload/unload** – the user is leaving the page
* -> can use **`beforeunload`** event to check if the user saved the changes and ask them whether they really want to leave
* -> the **`unload`** event for the user almost left, but we still can initiate some operations, such as sending out statistics

## DOMContentLoaded and styles
* External style sheets don’t affect DOM, so **`DOMContentLoaded does not wait for them`**

* but there’s a pitfall. If we have a script after the style, then that **`script must wait until the stylesheet loads`**
* => As DOMContentLoaded waits for scripts, it now **waits for styles before them** as well
* -> this is because the script may want to get coordinates and other style-dependent properties of elements
```html
<link type="text/css" rel="stylesheet" href="style.css">
<script>
  // the script doesn't execute until the stylesheet is loaded
  alert(getComputedStyle(document.body).marginTop);
</script>
```

==================================================
# Code splitting
* là một tính năng hỗ trợ tạo ra **`nhiều file bundle nhỏ có thể load một cách tự động`** tại thời điểm **`runtime`**

* **Problem**: 
* -> hầu hết các file trong ứng dụng **`React sẽ được bundle`** (_`đóng gói`_) bằng các công cụ như _Webpack, Rollup hoặc Browserify_
* -> _đóng gói_ là quá trình **`xử lý những files đã được import`** và **`kết hợp thành một file duy nhất`**
* -> _nếu một ứng dụng có kích thước lớn_, file đóng gói sẽ phình to theo (_đặc biệt, khi chúng ta **`sử dụng thêm third party library`**_)

* **Solution**: tránh việc nhận một gói bundle lớn bằng cách chia nhỏ file bundle
* -> React có hai tính năng để ứng dụng ý tưởng lazy load này cho component là **React.lazy()** và **React.Suspense()**

## React.Lazy()
* React.lazy() là hàm cho phép **render một dynamic import như một component bình thường**
* -> nhận vào một function - trả về một promise bởi cú pháp import() để load component.
* -> React.lazy() trả về một promise, sau đó phân giải thành một React component được export default

* As we’ll see further down, this allows us to synchronize loading states across different components to allow for a better user experience. Suspense does this in a non-intrusive way that doesn’t require a complete rewrite of existing applications.

* Instead of having the loading state as a state variable with logic to render a spinner based on the value, it’s instead being managed by React using Suspense

* But how exactly does React know that a network call is pending
* -> This is where the data fetching libraries come in. Currently, Relay and SWR have integrations with Suspense to communicate loading states to React