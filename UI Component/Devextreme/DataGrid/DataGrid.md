# DataGrid
* `displays data` from a `local or remote store` and allows users to **sort, group, filter, and perform other operations on columns and records**
* `Data source`: **Array**; **Read-Only Data in JSON Format**; **Web API, PHP, MongoDB, OData**; **Custom Data Sources**


```js
// Create dataGrid and Bind datagrid to data using "local Array" data source
import { DataGrid } from 'devextreme-react/data-grid';

<DataGrid
    dataSource={employees}
    keyExpr="EmployeeID">
</DataGrid>
// -> create "a column for each data field"
// -> Each the column have equal widths and the same order as their data fields
```

