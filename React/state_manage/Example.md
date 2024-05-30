===================================================================
# Update object in React
* -> phải lưu ý rằng khi khai báo state bằng useState(), ta cần khai báo bằng **const** để đảm bảo rằng state với **`primitive value`** là **immutable / read-only**
* -> state với giá trị dạng **`object value`** là **mutable** (_VD: obj.prop1 = "new value"_); nhưng ta cần xem nó như immmutable và **replace it** when we need to update
* -> because **React has no idea that object has changed** if object are mutate directly

```js
// avoid
person.artwork.city = 'New Delhi';

// use "spead" operator for shallow copy - one level nested
setPerson({
  ...person, // Copy other fields
  artwork: { // but replace the artwork
    ...person.artwork, // with the same one
    city: 'New Delhi' // but in New Delhi!
  }
});


// for multiple level nested, we can use "immer.js" 
// look like "mutating syntax" (look like breaking React rule) but actually "a shortcut to nested spread"
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

===================================================================
# s/d useCallback() tham chiếu đến 1 state của React
* -> ta sẽ gặp trường hợp là **`cùng 1 biến nhưng giá trị`** cho state của Component và giá trị mà funtion trong useCallback() tham chiếu tới **`là khác nhau`**
* -> đây là do **Closesure**, cũng như **state của React là dạng tham chiếu** (_dù giá trị nó giữ là primitive type_)

```js 
const Test = () => {
  let raw = 3;
  let [value, setValue] = useState(3);
  let [refer, setRefer] = useState([3]);
  let [refer2, setRefer2] = useState([3]);

  const log = () => {
    console.log("log", { raw, value, refer, refer2 });
  }
  const logCallback = useCallback(() => {
    console.log("logCallback", { raw, value, refer, refer2 });
  }, [])

  return (
    <>
      <button onClick={() => {
        raw += 1;
        setValue(prev => prev + 1);
        setRefer(prev => [...prev, 1]);
        refer2.push(1); setRefer2(refer2);
      }}>
        Change
      </button>
      <button onClick={() => {
        raw += 1;
        value += 1;
        refer = [...refer, 1]
        refer2.push(1);
      }}>
        Mutate
      </button>

      <button onClick={() => logCallback()}>Log callback</button>
      <button onClick={() => log()}>Log normal</button>

      <div>raw: {raw}</div>
      <div>value: {value}</div>
      <div>refer: {refer.toString()}</div>
      <div>refer2: {refer2.toString()}</div>
    </>
  )
}
// initial UI:   raw: 3   value: 3   refer: 3   refer2: 3

// ------> case 1:
// click "Change" -> UI display:   raw: 3   value: 4   refer: 3,1   refer2: 3,1
// click "Log callback" -> console: logCallback {raw: 4, value: 3, refer: [3], refer2: [3,1]
// click "Log normal" -> console: log {raw: 3, value: 4, refer: [3,1], refer2: [3,1]

// ------> case 2:
// click "Mutate" -> UI display:   raw: 3   value: 3   refer: 3   refer2: 3
// click "Log callback" -> console: logCallback {raw: 4, value: 4, refer: [3,1], refer2: [3,1]}
// click "Log normal" -> console: log {raw: 4, value: 4, refer: [3, 1], refer2: [3, 1]}
```