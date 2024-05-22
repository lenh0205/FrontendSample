> _`Về cơ bản`, trong CustomStore "properties" sẽ **định nghĩa logic** và gọi "method" để **thực thi logic** đó_

# DataSource
* is an **`object`** that **provides an API for processing data** (**`filter, sort, group, and otherwise shape the data`**) from an underlying **store**

```js - DataSource allows you to specify CustomStore properties in its configuration object
var myStore = new DevExpress.data.CustomStore({
    load: function(loadOptions) {}
})
const dataSource = new DataSource({ 
    store: myStore
})
```

* _supports a more `brief syntax` without introducing an explicit CustomStore instance_
```js - vẫn là VD trên
var dataSource = new DataSource({
    load: function(loadOptions) {
        // . . .
    },
})
```

* _If the entire dataset is on the client_ -> store in a **Local Array** or loaded using the **CustomStore in raw mode**

## Lưu ý
* -> nếu tạo `DataSource instance` ngoài UI component thì phải **dispose** khi không cần nữa
```js - VD s/d "dispose" Method của "DataSource" object
const ds = new DataSource({ /* ... */ });
 
class App extends React.Component {
    componentWillUnmount() {
        ds.dispose(); // dispose "DataSource instance"
    }
    // ...
}
```

* -> DataSource is not designed to be **used in multiple components simultaneously**

=============================================
# "store" property of DataSource
* -> accept **Store instances**: **`ArrayStore`**, **`LocalStore`**, **`ODataStore`**, **`CustomStore`**
```js - store instances
store: new ArrayStore({ /*  */ })
```

* -> **Store configuration object**: ArrayStore, LocalStore, or ODataStore **`configuration object`** (_set the **`type`** property_)
```js - store configuration object
store: { 
    type: 'array',
    // other properties of ArrayStore (this situation only)
}
```

* -> **`Array`**: _assigning an array to the **store** property_ automatically **`creates an ArrayStore`** in the DataSource

==============================================
# CustomStore
* enables us to implement **`custom data access logic`** for consuming data from any source
* -> _hoặc đơn giản hơn nó là dùng để custom Data Source, nằm ngoài những cái mà "store" property của DataSource hỗ trợ_
* -> _cho ta khả năng tương tác với any service dù có khác URL convention, method, param,..._

=====================================================
# "load" property
* -> specifies **`a custom implementation`** of the **load(options)** method
* -> a function receive **LoadOpions** (**`data processing settings`** - _sorting, filtering, paging, etc_) as parameter; 
* -> send them to a remote storage (server) where generating the resulting dataset based on these properties and send back to client
* -> function return **`data Array`** or **`Promise that is resolved after data is loaded`**

* these setting present only if the data operation is **enabled** or **declared as remote**
* -> configure **remoteOperations** in the **`DataGrid, TreeList, PivotGridDataSource`** UI components to declare _remote operations_
* -> **remoteFiltering** in the Scheduler UI component 
* -> **`for other UI components`**, use **DataSource** properties to enable operations

```js - "load" properties define logic; call "load(options)" method to consume that logic
const store = new CustomStore({
    key: 'id',
    load: (loadOptions) => { // "load" property
        return fetch(SERVICE_URL);
    }
})
```
===================================================
# "LoadOptions" object
* -> is used to **`specify settings`** according to which the server should process data
* -> usually, these settings are passed as **`a parameter to the load function`**,
* -> and **`depend on the operations`** (paging, filtering, sorting, etc.) that we have enabled in the **`DataSource`** or **`UI component`**

* _nói chung ta sẽ gửi những properties của "LoadOptions" cho remote storage để process và trà về dataset ta cần_

===================================================
# CustomStore's Implementation
* depends on whether `data is processed on` the **`client`** or **`server`**

## Client-side data processing
* -> implement the **load** function to `load data from the data source` and **Load Data in the Raw Mode**
* -> Raw Mode để perform all data shaping operations on the client (not required **`byKey`** and **`toltalCount`**)
* -> Once loaded, **data is stored in the cache** (clear cache with **`clearRawDataCache()`** method)
* -> since the CustomStore `loads all data in raw mode at once`, we _do not recommend using it with large amounts of data_
* -> _except DataGrid, TreeList, PivotGrid, and Scheduler, in which this mode is already enabled_

```js - "List" devextreme component with "dataSource" property using raw load mode
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const customDataSource = new CustomStore({
    key: 'ID',
    loadMode: 'raw', // omit in the DataGrid, TreeList, PivotGrid, and Scheduler
    load: () => {
        return fetch('https://mydomain.com/MyDataService')
            .then(handleErrors)
            .then(response => response.json());
            .catch(() => { throw 'Network error' });
    }
});

customDataSource.clearRawDataCache(); // nếu muốn clear cache tại thời điểm nào đó
 
class App extends React.Component {
    render() {
        return (
            <List
                dataSource={customDataSource}
            />
        );
    }
}
```

## server-side data processing 
* -> implement the **load** function to **`send data processing parameters to the server`** (_server process setting than send back processed data_)
* -> _load and CustomStore_ have **`specifics that depend on the UI component`** that uses the CustomStore

```js
const customDataSource = new CustomStore({
    key: 'ID',
    load: (loadOptions) => {
        let params = '?';
        const allOptions = ['filter', 'group', 'groupSummary', 'parentIds', 'requireGroupCount', 'requireTotalCount','searchExpr','searchOperation','searchValue','select','sort', 'skip', 'take','totalSummary', 'userData']

        // filter out empty settings if an operation is disabled or local
        // take the rest and pass them all to query parameter of URL
        allOptions.forEach(function(i) {
            if(i in loadOptions && isNotEmpty(loadOptions[i])) {
                params += `${i}=${JSON.stringify(loadOptions[i])}&`;
            }
        });
        params = params.slice(0, -1);
 
        return fetch(`https://mydomain.com/MyDataService${params}`)
            .then(handleErrors)
            .then(response => response.json())
            .then(response => {
                return {
                    data: response.data,
                    totalCount: response.totalCount,
                    summary: response.summary,
                    groupCount: response.groupCount
                };
            })
            .catch(() => { throw 'Network error' });
    },
    // Needed to process selected value(s) in the SelectBox, Lookup, Autocomplete, and DropDownBox
    // byKey: (key) => {
    //     return fetch(`https://mydomain.com/MyDataService?id=${key}`)
    //         .then(handleErrors);
    // }
});
 
class App extends React.Component {
    render() {
        return (
            <DataGrid
                dataSource={customDataSource}>
                <RemoteOperations groupPaging={true}>
            </DataGrid>
        );
    }
}

```

```js - nếu s/d UI component bình thường
class App extends React.Component {
    constructor(props) {
        super(props);
 
        let options = { /* ... */ }; // LoadOptions
        store
            .load(options) // "load(options)" method
            .then(
                (data) => { /* Process "data" here */ },
                (error) => { /* Handle the "error" here */ }
            );
    }
    // ...
}
```

```js - The right response object structure for server to send back:
{
    data: [{
        key: "Group 1",
        items: [ ... ], 
        // subgroups or data objects if there're no further subgroups 
        // check group.isExpanded = true; is null if group.isExpanded = false 
        count: 3, // count of items in this group; required only when items = null
        summary: [30, 20, 40] // group summary results
    },
    ...
    ], 
    totalCount: 200, // if requireTotalCount = true
    summary: [170, 20, 20, 1020], // total summary results
    groupCount: 35 // if requireGroupCount = true
}

// If the server did not receive the "group" setting, the structure should be:
{
    data: [ ... ],               // data objects
    totalCount: 200,             // if requireTotalCount = true
    summary: [170, 20, 20, 1020] // total summary results
}
```

=================================================
# Local Array
* _to bind a UI component to a local array_, `pass this array` to the UI component's **`dataSource`** property
* -> recommend also set the **`keyExpr`** property or the **`valueExpr`** and **`displayExpr`** properties (_depending on UI component_)

* if need to **`update the data`** or **`handle data-related events`**, **wrap the array in an ArrayStore**
* -> use the store's **`key`** property instead of the UI component's _keyExpr_ or _valueExpr_

* if need to **`filter, sort, group, and otherwise shape the data`**, **wrap the ArrayStore in a DataSource**

```js
<DataGrid
    dataSource={this.employees}
    keyExpr="ID"
/>
<SelectBox
    dataSource={this.employees}
    valueExpr="ID"
    displayExpr={this.getDisplayExpr}
/>
```

====================================================
# "key" property - "byKey" property - "byKey(key, extraLoadOptions)" Method 
* **byKey** method 
* -> gets a data item with a specific key. 
* -> return **`a Promise`** that is resolved **`after the data item is loaded`**

* **key** property - pecifies the key property (or properties) used to **`access data items`**
* **byKey** property dùng để **`custom implementation of the byKey(key) method`** ta dùng 

* _về cơ bản, khi ta gọi "bykey()" method và truyền cho nó argument thì "bykey" property sẽ execute và trả về 1 Promise và Promise này cũng chính là return của "byKey()" method_

```js - "key" property and "byKey" method in "CustomStore" component
const singleKeyStore = new CustomStore({
    key: "field1", // "key" property - this key consists of a single data field
    // ...
});
singleKeyStore
    .byKey(1) // use "byKey" method - to Gets the data item with "field1" (specific by "key" property) = 1
    .then(
        (dataItem) => { /* Process the "dataItem" here */ },
        (error) => { /* Handle the "error" here */ }
    );

const compositeKeyStore = new CustomStore({
    key: [ "field1", "field2" ], // this key consists of several data fields
    byKey: (key) => { // use "bykey" property - to custom implement of "byKey" method
        return fetch("http://mydomain.com/MyDataService?id=" + key);
    }
    // ...
});
compositeKeyStore
    .byKey({ // Gets the data item with both "field1" and "field2" being equal to 1
        field1: 1,
        field2: 1
    })
    .then(
        (dataItem) => { /* Process the "dataItem" here */ },
        (error) => { /* Handle the "error" here */ }
    );
```

```js - "byKey" property of "CustomStore" component
const store = new CustomStore({
    // ...
    
});
```

