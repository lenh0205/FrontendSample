```js
import DataGrid, { HeaderFilter, Pager, Paging, StateStoring } from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { appCommon } from '../../app-Common';
import { axiosServices } from '../../services/axiosServices';
import { generateColumnCapNhatHoSoLDP, onCellPrepared } from './RenderTable';

const DataGridCapNhatDanhMucHoSo = ({ ...props }) => {
    const { t } = useTranslation('common');

    useEffect(() => {
    }, [props.isRefresh])

    const customStoreConfig = {
        load: async (loadOptions: any) => {
            let arrayFilter = loadOptions.filter;
            let newFilter = [];
            if (arrayFilter !== undefined) {
                if (arrayFilter[0] === "deMucNho") {
                    newFilter.push(arrayFilter[2]);
                }
                else {
                    for (let i = 0; i < arrayFilter.length; i += 2) {
                        newFilter.push(arrayFilter[i][2]);
                    }
                }
            }
            var dataRequest = {
                url: "HoSoCongViec/GetSearchBySearchGroupObject",
                ObjectData: {
                    ...loadOptions,
                    ...props.dataObjectSearch,
                    filter: newFilter
                }
            }

            try {
                const response: any = await axiosServices.post(dataRequest)

                if (response.result) {
                    return {
                        data: response.dataResult.data,
                        totalCount: response.dataResult.totalRow,
                        groupCount: response.dataResult.data.length,
                    }
                }
                else {
                    return {
                        data: [],
                        totalCount: 0,
                        groupCount: 0
                    }
                }
            }
            catch (ex: any) {
                var errorMessage = ex.response?.data?.Message ? ex.response?.data?.Message : ex.message;
                appCommon.toast(errorMessage, 'error');
            }
        },
        remove: async (key: any) => {
            try {
                var rp: any = await axiosServices.get("HoSoCongViec/SoftDelete?id=" + key.id);
                if (rp?.result)
                    appCommon.toast(t("message.deleteSuccess"), 'success');
                else
                    appCommon.toast(t("message.deleteFail"), 'error');
            }
            catch (ex) {
                appCommon.toast(t("message.getDataError"), 'error');
            }
        }
    };
    const CapNhatHoSoCustomStore = new CustomStore(customStoreConfig);

    return <>
        <DataGrid
            loadPanel={{
                enabled: true
            }}
            selection={{
                mode: "multiple",
                showCheckBoxesMode: "always"
            }}
            dataSource={CapNhatHoSoCustomStore}
            remoteOperations={{
                paging: true,
                grouping: true,
                groupPaging: true
            }}
            rowAlternationEnabled={true}
            height={"auto"}
            showColumnLines={true}
            showBorders={true}
            columnResizingMode="widget"
            noDataText={t("message.noData")}
            grouping={{
                autoExpandAll: true,
                allowCollapsing: true,
                expandMode: "rowClick"
            }}
            groupPanel={{
                visible: false
            }}
            wordWrapEnabled={true}
            onCellPrepared={onCellPrepared}
        >
            <StateStoring savingTimeout={50} enabled={true} type="sessionStorage" storageKey="LTHS.DataGrid.CapNhatHS" />
            <Pager
                showInfo={true}
                infoText={t("datagrid.pager.pagerInfo")}
                visible={true}
                showNavigationButtons={true}
                allowedPageSizes={[5, 10, 20, 50, 100]}
                showPageSizeSelector={true} />
            <Paging
                defaultPageSize={10}
                defaultPageIndex={0} />
            <HeaderFilter visible={false}>
            </HeaderFilter>
            {generateColumnCapNhatHoSoLDP({
                OpenDialogXemChiTiet: props.OpenDialogXemChiTiet,
                OpenDialogChinhSua: props.OpenDialogChinhSua,
                DeleteDataRow: props.DeleteDataRow
            })}
        </DataGrid>
    </>
}

export default React.memo(DataGridCapNhatDanhMucHoSo)

// ==========> <DataGrid/>:
// noDataText: hiện 1 cái text hoặc component khi không có data
// key: dùng phân biệt các DataGrid component
// dataSource: bỏ cục dữ liệu của toàn bộ cái bảng vô đây
// allowColumnReordering: có cho user sắp xếp trật tự column không
// rowAlternationEnabled: các hàng có nên bóng mờ khác nhau không
// onRowRemoved: A function that is executed after a row has been removed from the data source?
// selection: enable multiple row selection

// onSelectionChanged: execute when selection changes ; thằng này giúp mình lấy được những data đã được chọn 
```
