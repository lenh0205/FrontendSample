# Check element CSS display with JavaScript

* **Getting inline styles**: styles that are present in the `HTML in the style attribute`
```html
<div class="element" style="font-size: 2em; color: red;">
  Red hot chili pepper!
</div>

<script>
    const element = document.querySelector('.element')
    const fontSize = element.style.fontSize
</script>
```

* **Getting computed styles**: khi our styles are `written in the CSS file`
```js
const element = document.querySelector("#myfield")
window.getComputedStyle(element, null).display;
// First parameter: "Element" - the element we selected
// Second parameter: "pseudoElement" - if we're selecting a pseudo element . VD:
getComputedStyle(element, '::before')
```

# Debug đối với 1 component import từ thư viện bên ngoài
* chỉ để lại những props tối thiểu để chạy component đó, còn lại comment hết
```js - Ví dụ
import { SelectBox } from "devextreme-react";
<SelectBox
    dataSource={props?.dataSource}
    valueExpr={props?.valueName ? props?.valueName : "ID"}
    displayExpr={props?.displayName ? props?.displayName : "Name"}
    // dropDownOptions={{ container: document.getElementById(props?.id) as Element }}
    // stylingMode={props?.stylingMode ? props?.stylingMode : "outlined"}
    // width={props?.width ? props?.width : "100%"}
    // ...
/>
```

# Khi cần tìm 1 code đang chạy sai mà không có bất kỳ lỗi nào bắn ra trong Console, Network,...
* -> ta cần vô component đó comment hết phần render UI lại; để xem phần logic component chạy đúng chưa
* -> khi check tầng render UI nếu có quá nhiều component con ta nên dùng binary search
* -> comment từng khúc để biết lỗi xảy ra chỗ nào
* -> tìm xem thật sự lỗi do component con nào

# Try/Catch: catch "Exception" nhưng không phải do lỗi gọi API
* **`do s/d try/catch không đúng cách`**
* -> đôi lúc "catch" diễn ra nhưng lỗi không hiện ra trên Console hay Network
* -> vì căn bản lỗi này xảy ra không phải do gọi API bị lỗi
* -> mà là do ta gọi 1 hàm is not a function hoặc access property of undefined

# 1 Dropdown nhấp vào có drop xuống những không thấy dữ liệu
* thì khả năng cao tên trường được chọn để hiện thị ra UI hiện không có trong dataSource **`DataSource`** 
* cần log ra `dataSource` và `tên field` để so sánh

# Code bị lỗi trên máy khác mà máy mình không bị
* check xem có push code thiếu gì không
* Rất có thể mình thay đổi 1 cái gì đó lên Component của 1 trang; Nhưng những trang khác cũng đang dùng nó và chưa áp sự thay đổi đó lên
* _VD: Ta tạo 1 provider context cho 1 page để inject 1 value cho 1 component; nếu các page khác chưa add provider đó mà chưa component đó thì có thể bị lỗi_

# Chức năng Download file:
* nếu gọi api có trả về 1 stream binary mà file download về lại rỗng
* thì rất có thể request Header đã thiếu **`responseType: blob`**

# Event Listener
* Dù là Component custom của Material UI thì về cơ bản nó vẫn là những tag có hỗ trợ những sự kiện như `onClick, ...`

# 1 page trên production chết: Error: Minified React error #130; at Bu (bundle.js?v=01.00.00.06:2:7463008) at e (bundle.js?v=01.00.00.06:2:7407124)
* Có thể là view của GUI đang để sai tên