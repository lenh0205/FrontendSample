> https://supportcenter.devexpress.com/ticket/details/t932725/tagbox-how-to-display-preselected-value-if-value-is-not-present-in-datasource

# important Note:
* -> phải có trường **key** và phải để nó trong **CustomStore**, không để trong **DataSource** (_nếu không có thể gây không thể chọn hoặc không thể xoá_)
* -> TagBox chỉ **`bắt đầu lazy load khi ta click vào`**
* -> để hiển thị giá trị mặc định cho tagbox, ta sẽ cần truyền 1 array của **object gồm đẩy đủ 2 trường** định nghĩa trong **displayExpr** và **valueExpr** cho **`"value" property của TagBox`**
* -> nhưng mà khi ta chọn item thì **onValueChanged** chỉ trả về 1 array gồm giá trị của **valueExpr** (_không phải object gồm 2 trường_) đối với item mới chọn và object đối với item ta đặt làm mặc định
* -> để **`load remote item`**, từ version **`18.1`** ta sẽ s/d property **filter** của **`loadOptions`** thay vì
**byKey** của CustomStore

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
}
```