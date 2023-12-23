import { DataGrid } from 'devextreme-react';
import { Column, Pager, Paging } from 'devextreme-react/data-grid';
import React from 'react';


const MyTable = () => {
    return (
        <DataGrid>
            <Pager />
            <Paging />
            <Column />
        </DataGrid>
    )
}


// ==========> "<Selection/>"
// mode="multiple": enable multiple row selection 


// ==========> "<Pager/>" component is used to navigate through pages of the DataGrid
// showInfo: Specifies whether to show the page information.
// infoText: Specifies the page information text.
// visible: Specifies whether the pager is visible.
// showNavigationButtons: Specifies whether to show navigation buttons.
// allowedPageSizes: Specifies the available page sizes in the page size selector.
// showPageSizeSelector: Specifies whether to show the page size selector.


// ==========> "<Paging/>" component controls paging state of the DataGrid
// defaultPageSize: The initial page size.
// defaultPageIndex: The initial page index.


// ==========> "<Column/>" component represents a column in the DataGrid
// cssClass: Adds a CSS class to column cells.
// caption: Tên cột
// alignment: The alignment of column values.
// width: The width of the column.

// -----> type="selection"
// -> to create a "selection column" - contains checkboxes that allow users to select rows in the DataGrid
// -> "selection column" appears when the "selection" property of the DataGrid is set to "={{ mode: 'multiple' }}" and the "showCheckBoxesMode" property is not set to "none"

// groupIndex: group các record theo giá trị trong column có thuộc tính này 
// -> nếu có nhiều column có thuộc này, tức là ta nhóm record theo theo nhiều cột
// -> cột nào có giá trị gruopIndex nhỏ nhất thì ưu tiên nhóm theo cột đó trước
// -> groupIndex nhỏ nhất là 0

// -----> dataField: The name of a "data source field" that provides values for a column
// -> to create an bound data column
// -> chỉ định cái field sẽ được dùng để làm giá trị cho từng ô trong cột
// -> render UI luôn nếu không có các thuộc tính custom UI khác (cellRender, ....)
// -> calculated values can used for sorting, filtering, grouping, or calculating summaries.

// -----> calculateCellValue 
// -> to create an unbound data column (values of column are not obtained from the data source)
// -> nó sẽ ghi đè dataField
// -> a function that allows to customize the value of a cell
// -> có thể dùng để tạo index (STT) cho các dòng nếu không muốn tính group cell vô
// -> calculated values can used for sorting, filtering, grouping, or calculating summaries.
calculateCellValue={(rowData: any) => {
    return props.dataResult.dataDMHoSos.indexOf(rowData) + 1;
}}

// -----> cellRender
// -> customize the appearance (not value) of regular cells value in a column
// -> nhận 1 function trả về 1 custom cell (1 component do ta tự custom chẳng hạn)
// -> function nhận đối số là giá trị chỉ ra từ dataField (nếu có), còn không thì ta sẽ phải chỉ ra trong function
// -> calculated values can not used for sorting, filtering, grouping, or calculating summaries.
// -> dùng trong React
cellRender={(data) => {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    style={{ paddingTop: "0px", paddingBottom: "0px" }}
                    value={data?.data?.checked == null ? false : data?.data?.checked}
                    checked={data?.data?.checked == null ? false : data?.data?.checked}
                    onChange={(e) => onChangeRowCheckBox(e, data)} />
            }
            label={""}
        />
    )
}}

// -----> cellTemplate
// -> giống "cellRender" nhưng use in JQuery, Angular, Vue
// -> nhận đối số là "container" và "options"
// -> "options.rowType" cho biết the type of row being rendered: "data", "group", "groupFooter", "header", "filter", or "totalFooter"
// -> "options.rowType" giúp ta biết cái current row là 1 "group row" hay 1 "row thường"
cellTemplate={(container: any, options: any) => {
    const data = options.data;
    const div = document.createElement('div');
    if (!data) {
        div.innerText = "Chưa có dữ liệu";
    }
    else {
        const key : keyof typeof enumHoSoStatus = Object.keys(enumHoSoStatus)[data.status] as keyof typeof enumHoSoStatus;
        div.innerText = enumHoSoStatus[key] || "";
    }
    container.append(div);
}}

// -----> groupCellRender: A function that customizes group cells.
// -> tức là khi ta có "groupIndex" để nhóm hàng theo cột nó sẽ tạo ra 1 group cells
// -> customize the content of group cells in a column
// -> giống "cellRender" nhưng chỉ dùng trong cột có "groupIndex"

