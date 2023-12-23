# Fixed
* Kích thước cứng, **`cố định, không co giãn`** trên các loại màn hình có kích thước khác nhau

# Adaptive
* Adaptive sử dụng **layout, thiết kế riêng biệt cho từng kích thước màn hình** 
* -> tùy vào kích thước màn hình mà Adaptive sẽ lấy layout tương ứng ra thể hiện
* -> s/d _CSS3, Javascript, jQuery_ thay đổi layout cho phù hợp với từng thiết bị

* _sẽ cần nhiều tài nguyên hơn_

# Responsive
* **sử dụng Layout dạng động**
* nhờ sự giúp đỡ chủ yếu là **`CSS3 - media query`**

* có 4 thành phần cơ bản để một thiết kế responsive web: 

## Viewport
* kích thước màn hình người dùng nhìn thấy trên thiết bị của họ khi vào một trang web bất kỳ
* -> _Nếu trang web cố định kích thước thì trình duyệt sẽ tự động thu nhỏ nội dung khi chuyển từ màn hình máy tính qua điện thoại thông minh_
* -> _sẽ tạo nên trải nghiệm không tốt cho người dùng_
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- width=device-width: thiết lập chiều rộng của trang web theo chiều rộng của thiết bị -->
<!-- initial-scale=1.0: thiết lập mức độ zoom ban đầu khi trang web được load bởi trình duyệt -->
```

## Fluid
* Fluid grid là một hệ thống Layout được thiết kế dựa trên độ phân giải màn hình của người dùng, **`trái ngược với những layout có chiều ngang cố định`**
* **theo tỉ lệ %** (_không phải những đơn vị cố định như pixel hay inch_)

* -> giúp layout của website thay đổi tỉ lệ để thích nghi
* -> chỉ cần **`chia chiều rộng của mỗi phần tử con cho tổng chiều rộng của phần tử cha`**

## CSS3 media queries
* **`khi fluid grid là chưa đủ`** (_khi các trình ngày càng hẹp hơn_) thì sẽ cần tới media queries (_hỗ trợ bởi hầu hết browser_)
*  CSS3 Media Queries cho phép các website thu thập dữ liệu từ trình duyệt khách hàng truy cập và áp dụng CSS một cách có điều kiện

```css - Mobile-first standard
/Smart phone nhỏ/
@media screen and (min-width: 240px){
}
/Iphone(480 x 640)/
@media screen and (min-width: 320px){
}
/Tablet nhỏ(480 x 640)/
@media screen and (min-width: 480px){
}
/Ipad dọc(768 x 1024)/
@media screen and (min-width: 768px){
}
/Ipad ngang(1024 x 768)/
@media screen and (min-width: 1024px){
}
```

## Flexible image
* **`thay đổi kích thước hình ảnh`** là 1 thách thức trong thiết kế website responsive
* -> good option là **`set CSS max-width là 100% cùng với height: auto`** (_đảm bảo rằng trừ khi chế độ xem hẹp hơn chiều rộng của ảnh thì ảnh sẽ vẫn load tỉ lệ kích thước ban đầu_)
* -> Phần tử HTML5 và JavaScript
* -> Dịch vụ Cloud