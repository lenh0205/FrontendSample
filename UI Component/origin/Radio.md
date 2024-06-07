# Radio
* -> khác với **`checkbox`**, nếu ta đã sử dụng multiple radio thì nó chắc chắn phải đi theo **Radio group** (_các phần tử có tác động lẫn nhau theo group_)
* -> những **radio input** trong cùng 1 **`Radio group`** phải có **property "name" giống nhau** - đảm bảo thằng này **`selected`** thì những thằng khác phải **`unselected`**
* -> **onChange** handlers bound to **`radio select interact`**, ta nên pass cùng 1 handler cho tất cả **`radio item`** trong Radio group
* -> **value** property chứa giá trị của **`radio input`**; khi **`onChange`** trên item thì **e.target.value** sẽ trả về **`giá trị của "value" property`**
* -> propery **checked** của **`radio input`** nhận giá trị **boolean** để hiển thị nó là **`selected hay unselected`**; thường thì ta sẽ so sánh giữa **`e.target.value`** với **`"value" property của từng item`** để xem cái nào đang checked

* _ngoài ta, pass giá trị **id của input** cho **htmlFor của label** sẽ cho phép label direct đến input_

```js
function App() {
  const [topping, setTopping] = useState("Medium")

  const onOptionChange = e => {
    setTopping(e.target.value)
  }

  return (
    <div className="App">
      <h3>Select Pizza Size</h3>

      <input
        type="radio"
        name="topping"
        value="Regular"
        id="regular"
        checked={topping === "Regular"}
        onChange={onOptionChange}
      />
      <label htmlFor="regular">Regular</label>

      <input
        type="radio"
        name="topping"
        value="Medium"
        id="medium"
        checked={topping === "Medium"}
        onChange={onOptionChange}
      />
      <label htmlFor="medium">Medium</label>

      <input
        type="radio"
        name="topping"
        value="Large"
        id="large"
        checked={topping === "Large"}
        onChange={onOptionChange}
      />
      <label htmlFor="large">Large</label>

      <p>
        Select topping <strong>{topping}</strong>
      </p>
    </div>
  )
}
```