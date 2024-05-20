> https://supportcenter.devexpress.com/ticket/details/t932725/tagbox-how-to-display-preselected-value-if-value-is-not-present-in-datasource

```js
export default function App() {
  const [selectedItem, setSelectedItem] = useState([
    { displayId: "1", displayName: "hello1" },
    { displayId: "2", displayName: "hello2" }
  ]);

  const generateColumn = useCallback(gcBaoCaoVanBanDen, []); // this line to ensure loading CSS in the right way

  const dataSource = useMemo(() => new DataSource({
    paginate: true,
    pageSize: 20,
    store: new CustomStore({
      key: "displayId",
      load: async (loadOptions) => {
        console.log({ loadOptions })
        try {
          const { skip, take } = loadOptions;
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

  console.log({ selectedItem })
  return <div>
    <span>Test Tagbox:</span>
    <TagBox
      dataSource={dataSource}
      displayExpr="displayName"
      valueExpr="displayId"
      value={selectedItem}
      onValueChanged={(e) => {
        setSelectedItem(e?.value);
      }}
      width="100%"
    />
    {/* <span>Test SelectBox:</span>
    <SelectBox
      // key="displayId"
      dataSource={dataSource}
      displayExpr="displayName"
      valueExpr="displayId"
      value={selectedItem}
      onValueChanged={(e) => {
        setSelectedItem(e?.value);
      }}
      width="100%"
    /> */}
  </div>;
}

```