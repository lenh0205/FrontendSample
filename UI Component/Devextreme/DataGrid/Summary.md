> _Về cơ bản, Summary trong DataGrid là việc tống hợp 1 số dữ liệu từ bảng để đưa ra 1 con số. VD: Tính "tổng lương" của toàn bộ nhân viên dựa trên cột "Lương" của bảng "Nhân viên"_

# summaryType - properties of "Summary" Component
* Specifies how to **`aggregate data`** for the `total` _summary item_

* summary types are supported:
* -> **sum** , **min** , **max** , **avg** , **count** 
* -> **custom**: for **` Client-Side Data Aggregation`**; applies a _custom client-side aggregate function_ - **calculateCustomSummary**
* -> **_Any other type_** - for **` Server-Side Data Aggregation`**

# "Summary" component  
* **`child component`** of "DataGrid" component

* _có 4 loại Data Summaries_: **`Total Summaries`**, **`Group Summeries`** , **`Custom Summeries`** , **`Recalculate While Editing`** 
* -> Client-side custom summaries are suitable for small datasets. 
* -> If your tests show that client-side calculations result in `noticeable lags`, use Server-Side Data Aggregation.

====================================================
## "Custom Summaries" implemented client-side logic - "calculateCustomSummary" property
* -> _calculateCustomSummary_ specifies **`a custom aggregate function`**
* -> is called for `summary items` whose **summaryType is "custom"**

* **`Required:`**: 
* -> remoteOperations.summary, remoteOperations.groupPaging, or remoteOperations property is **not set or set to false**
* -> Add a summary configuration object to the **`summary.groupItems or summary.totalItems array`** (_nói chung là pass prop cho các <TotalItem/> và <GroupItem>_ component_)

```js - tính summary dựa trên selected row 
class App extends React.Component {
  constructor(props) {
    super(props);
    this.orders = service.getOrders(); // lấy data cho DataSource của DataGrid
  }
  calculateSelectedRow(options) {
    if (options.name === 'SelectedRowsSummary') { // trong trường hợp có nhiều Summery Item
      if (options.summaryProcess === 'start') {
        options.totalValue = 0; // load lần đầu, chưa row nào được select
      } else if (options.summaryProcess === 'calculate') {
        // check Summary Item trong lần lặp này có phải là selected row không
        if (options.component.isRowSelected(options.value.ID)) { 
          options.totalValue += options.value.SaleAmount;
        }
      }
    }
  }
  onSelectionChanged(e) {
    // For "recalculate" the resulting value of summery when selection is changed
    e.component.refresh(true);
  }

  render() {
    return (
      <React.Fragment>
        <DataGrid
          id="gridContainer"
          defaultSelectedRowKeys={startupSelectedKeys}
          onSelectionChanged={this.onSelectionChanged}
          dataSource={this.orders}
          keyExpr="ID"
          showBorders={true}
        >
          <Paging enabled={false} /> 
          <Selection mode="multiple" /> {/* hiện cột checkbox và cho phép chọn nhiều row */}
          <Column dataField="OrderNumber" width={130} caption="Invoice Number" />
          <Column dataField="OrderDate" width={160} dataType="date" />
          <Column dataField="Employee" />
          <Column dataField="CustomerStoreCity" caption="City" />
          <Column dataField="CustomerStoreState" caption="State" />
          <Column dataField="SaleAmount" alignment="right" format="currency" />

          <Summary 
            calculateCustomSummary={this.calculateSelectedRow}
            // hàm này sẽ được gọi mỗi lần nó lặp qua 1 Summary Item
            // ứng với mỗi lần lặp, đối số "options" sẽ mang giá trị của Summary Item đó
          >
            <TotalItem
              name="SelectedRowsSummary" 
              // => for identify the summary item within the calculateCustomSummary function

              summaryType="custom" 
              // -> for client-side custom summery

              valueFormat="currency"
              // format the summary value theo dạng "Tiền tệ" (VD: $431,000)

              displayFormat="Sum: {0}"
              // để hiện thị ra UI dưới dạng "Sum: $431,000"

              showInColumn="SaleAmount" 
              // giá trị sau khi caculate summery sẽ được đặt ở bottom của cột "sale amounts" 
            />
          </Summary>
        </DataGrid>
      </React.Fragment>
    );
  }
}
```

## Server-Side Data Aggregation
* -> applies to **`ASP.NET servers only`**; Implement and register a _custom server-side data aggregator_ using **DevExtreme.AspNet.Data**
* -> set the _remoteOperations.summary, remoteOperations.groupPaging, or remoteOperations_ property to **true**
* -> pass the **`string identifier`** (giống "count", "max", "custom",... nhưng do ta define) you used to register the aggregator to a **`summary item's`** **summaryType** property

====================================================
## Total Summaries
* to display total summaries, populate the **summary.totalItems array** with configuration objects (_nói chung là pass props cho các <TotalItem/> component_)
* -> each <TotalItem> should **`specify a column that supplies data for summary calculation`**
* -> each <TotalItem> should **`specify summaryType`** (_count, sum, max, ..._)

```js - tính summary cho toàn bộ row
customizeDate(data) {
    return `First: ${formatDate(data.value, 'MMM dd, yyyy')}`;
}

<DataGrid /* ..... */ >
    <Selection mode="single" /> {/* không hiện cột checkbox, chỉ cho chọn 1 row */}
    <Column dataField="OrderNumber" width={130} caption="Invoice Number" />
    {/* other columns.... */}
    <Summary>
         <TotalItem
            column="OrderNumber" // chọn cột sẽ được tổng hợp, cũng như vị trí đặt summary value
            summaryType="count" // s/d "count" aggregate để đếm số lượng 
        />
        <TotalItem
            column="OrderDate" // chọn cột "ngày đặt hàng" để tổng hợp
            summaryType="min" // tìm "ngày đặt hàng" sớm nhất 
            customizeText={this.customizeDate} // custom lại UI display for summary value
        />
        <TotalItem
            column="SaleAmount"
            summaryType="sum"
            valueFormat="currency" // format the summary value as currency (VD: $431,000)
        />
    </Summary>
</DataGrid>
```

=========================================================
## Group Summaries
* to configure group summaries, populate the **summary.groupItems array** with summary configuration objects (_nói chung là pass props cho các <TotalItem/> component_)
* -> Each object should specify a **`column that supplies data`** for summary calculation and a **`summaryType`**
```js
<DataGrid
    id="gridContainer"
    dataSource={this.orders}
    keyExpr="ID"
    showBorders={true}>
    <Selection mode="single" /> {/* không hiện cột checkbox, chỉ cho chọn 1 row */}
    <Column dataField="Employee" groupIndex={0} /> {/* create a grouping bar */}
    <Column dataField="OrderNumber" width={130} caption="Invoice Number" />
    <Column dataField="OrderDate" width={160} dataType="date" />
    {/* other columns.... */}

    <Summary>
        <GroupItem
            column="OrderNumber"
            summaryType="count"
            displayFormat="{0} orders" />
        <GroupItem
            column="SaleAmount"
            summaryType="max"
            valueFormat="currency"
            showInGroupFooter={false}
            alignByColumn={true} />
        <GroupItem
            column="TotalAmount"
            summaryType="max"
            valueFormat="currency"
            showInGroupFooter={false}
            alignByColumn={true} />
        <GroupItem
            column="TotalAmount"
            summaryType="sum"
            valueFormat="currency"
            displayFormat="Total: {0}"
            showInGroupFooter={true} 
        />
    </Summary>
    <SortByGroupSummaryInfo summaryItem="count" />
</DataGrid>
```