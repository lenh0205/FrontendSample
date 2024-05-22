> https://supportcenter.devexpress.com/ticket/details/t932725/tagbox-how-to-display-preselected-value-if-value-is-not-present-in-datasource

# important Note:
* -> phải có trường **key** và phải để nó trong **CustomStore**, không để trong **DataSource** (_nếu không có thể gây không thể chọn hoặc không thể xoá_)
* -> TagBox chỉ **`bắt đầu lazy load khi ta click vào`**
* -> để hiển thị giá trị mặc định cho tagbox, ta sẽ cần truyền 1 array của **object gồm đẩy đủ 2 trường** định nghĩa trong **displayExpr** và **valueExpr** cho **`"value" property của TagBox`**
* -> nhưng mà khi ta chọn item thì **onValueChanged** chỉ trả về 1 array gồm giá trị của **valueExpr** (_không phải object gồm 2 trường_) của item mới chọn và những object mà ta đã đặt làm giá trị mặc định

```js
export default function App() {
  const [selectedItem, setSelectedItem] = useState<any>([]);

  useEffect(() => {
    setSelectedItem([
      { displayId: "1", displayName: "hello1" },
      { displayId: "2", displayName: "hello2" }
    ])
  }, [])

  const dataSource = useMemo(() => new DataSource({
    paginate: true,
    pageSize: 20,
    store: new CustomStore({
      key: "displayId",
      load: async (loadOptions) => {
        console.log({ loadOptions })
        try {
          const { skip, take, filter } = loadOptions;
          if (!skip && !take) throw new Error("");
          const res = await instance
            .get(`https://localhost:7060/api/Student/TestPagination?skip=${skip}&take=${take}`)
          return res
        }
        catch (err) {
          return { data: [] };
        }
      },
      byKey: async (...args) => {
        console.log("bykey", args)
        // const res = await instance.post("https://localhost:7060/api/Student/GetByIds", key);
        // const res = await instance.get(`https://localhost:7060/api/Student/GetByIdTestPagination?Id=${key}`);
        // return res;
      }
    })
  }), [])

  const addItems = () => {
    const items = [
      { displayId: "11111", displayName: "hello11111" },
      { displayId: "22222", displayName: "hello22222" }
    ]
    setSelectedItem((prev: any) => [...prev, ...items]);
  }

  console.log({ selectedItem })
  return <div>
    <span>Test Tagbox:</span>
    <TagBox
      dataSource={dataSource}
      displayExpr="displayName"
      valueExpr="displayId"
      value={selectedItem}
      onValueChanged={(e) => {
        console.log({ e })
        setSelectedItem(e?.value);
      }}
      onChange={() => { }}
      width="100%"
    />
    <button onClick={() => addItems()}>Add</button>
   
    <div style={{ padding: "50px" }} />
    <Test />
  </div>;
}

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