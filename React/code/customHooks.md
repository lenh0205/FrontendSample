
==================================================
# Custom Hooks:
* Giúp đưa những logic xử lý ra khỏi component -> **`encapsulating`** and **`reusing`** **logic** across components
* Về cơ bản, nó là những **`functions`** nhưng với khả năng **`sử dụng những hook`** khác
* where we can pass initial value; expose state, setState


## useEffect 
* ta thật sự nên hạn chế việc viết useEffect ở nhiều nơi; thay vào đó nên đóng gói chúng vào những custom hook
* -> we're not exposing useEffect out of custom hook, we're not writing useEffect




