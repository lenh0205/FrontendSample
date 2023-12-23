
* 1 UI Component của Devextreme sẽ bao gồm: **Props** , **Method**, **Event**,...

===========================================
# Props
* là những prop truyền cho component
```js - "dataSource" prop của "DataGrid" component
<DataGrid dataSource={store} />
```

============================================
# Method
* to call UI component methods, we need the **`UI component instance`**
* -> ta có thể `lấy instance` của component bằng **ref**

```js - VD: lấy "TextBox" instance để gọi "focus()" method của nó
const textBox = useRef(null);

const focusTextBox = useCallback(() => {
    textBox.current.instance.focus(); // ".current.instance" sẽ target đến UI component instance
}, []);
 
<div>
    <TextBox ref={textBox} />
    <Button text="Focus TextBox" onClick={focusTextBox} />
</div>
```