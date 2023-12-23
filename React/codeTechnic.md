================================================
## Case: Vấn đề khi viết 1 Class làm quá nhiều nhiệm vụ
* Việc ta viết 2 class rồi để chúng import để sử dụng properties, method của nhau
* -> có thể dẫn đến vòng lặp
* -> dẫn đến 1 class bị lỗi `React can't access before initialize`

* **Solution**: tách thành class nhỏ hơn với chức năng riêng biệt; hoặc nuốt chửng service kia luôn

===============================================
# React Life Cycle

## Case: đôi khi ta cần sử dụng nhiều useEffect để call API và ta cần thực hiện những useEffect này theo thứ tự
* Để xử lý ta có thể thêm 1 flag để biết call API thứ 1 đã chạy xong hay chưa
* useEffect() để call API thứ 2 thì ta sẽ add flag làm [dependencies] đồng thời bên trong wrapp phần code gọi API trong condition `flag=true` 

===============================================
# Write Library
* Nếu có 1 biến làm flag, cần lưu ý case biến đó là dynamic (tức là biến đó có thể phụ thuộc vào những biến và điều kiện khác mà có giá trị khác nhau)
* nên dùng `as const` để expose giá trị 1 cách immutable cho user dùng