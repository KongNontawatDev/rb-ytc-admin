import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApartmentOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { useColumnOrderStore } from "../../hooks/useTableStore";
import { FilterQuery } from "./types";
import { useDepartmentPage } from "./hooks/useDepartmentPage";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";
import { getColumnKey } from "../../types/TableType";
import { DepartmentTableView } from "./components/DepartmentTableView";
import { DepartmentCardView } from "./components/DepartmentCardView";
import { Pagination } from "../../components/common/Pagination";
import DepartmentModal from "./components/DepartmentModal";
import { DepartmentFilterSection } from "./components/DepartmentFilterSection";
import { DepartmentPageHeader } from "./components/DepartmentPageHeader";
import { useDepartmentColumns } from "./hooks/useDepartmentColumns";
import { delay } from "../../utils/promise";

export default function DepartmentPage() {
  const { t } = useTranslation(['department', 'common','app']);
  const { visibleColumns: storedVisibleColumns, updateVisibleColumns } = useColumnOrderStore();
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const defaultFilter: FilterQuery = {
    textSearch: '',
    searchField: 'id,name',
    page: 1,
    pageSize: 10,
    sortOrder: 'desc',
    sortField: 'id',
    status: '',
  };

  const {
    open,
    setOpen,
    formMode,
    setFormMode,
    searchState,
    setSearchState,
    view,
    setView,
    selectedId,
    setSelectedId,
    localFilter,
    handleFilterChange,
    handleUpdateStatus,
    handleDelete,
    data,
    isPending,
    deleteSelectedDepartment,
    statusUpdateLoading
  } = useDepartmentPage(defaultFilter);

  const confirmDelete = useDeleteConfirmation(
    t("department:title"),
    async (ids: React.Key[]) => {
      try {
      await delay(2000)
        await deleteSelectedDepartment.mutateAsync(ids);
        setSelectedRows([]); // Clear selected rows after successful deletion
      } catch (error) {
        console.error("Bulk delete failed:", error);
      }
    }
  );

  const handleBulkDelete = async (keys: React.Key[]) => {
    try {
      await confirmDelete(keys);
    } catch (error) {
      console.error("Delete confirmation failed:", error);
    }
  };
  

  const columns = useDepartmentColumns({
    textSearch: localFilter.textSearch,
    onStatusUpdate: handleUpdateStatus,
    onView: (id) => {
      setOpen(true);
      setSelectedId(id);
      setFormMode('view');
    },
    onEdit: (id) => {
      setOpen(true);
      setSelectedId(id);
      setFormMode('edit');
    },
    onDelete: handleDelete,
    statusLoading:statusUpdateLoading
  });

  useEffect(() => {
    const tableId = 'department-table';
    const defaultVisibleColumnKeys = columns.map(getColumnKey);

    if (!storedVisibleColumns[tableId]) {
      updateVisibleColumns(tableId, defaultVisibleColumnKeys);
    }
  }, [columns, storedVisibleColumns, updateVisibleColumns]);

  	useEffect(() => {
		document.title = t("department:header") + t("app:appTitle");
	}, []);

  return (
    <>
      <DepartmentModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedId(null);
        }}
        id={selectedId}
        initialMode={formMode}
      />
      <DepartmentPageHeader
        title={t('department:header') + (data?.meta?.total?` (${data?.meta?.total})`:"")}
        icon={ApartmentOutlined}
        onClearFilter={() => handleFilterChange(defaultFilter)}
        onToggleSearch={() => setSearchState(!searchState)}
        searchState={searchState}
        view={view}
        onToggleView={() => setView(prev => prev === 'card' ? 'table' : 'card')}
        columns={columns}
        visibleColumns={storedVisibleColumns['department-table']}
        onColumnVisibilityChange={(columnKey:any, checked:any, isLocked:any) => {
          if (isLocked) return;
          const newColumns = checked
            ? [...storedVisibleColumns['department-table'], columnKey]
            : storedVisibleColumns['department-table'].filter(key => key !== columnKey);
          updateVisibleColumns('department-table', newColumns);
        }}
        onCreateClick={() => {
          setOpen(true);
          setSelectedId(null);
          setFormMode('create');
        }}
      />

      <Card className="mt-3" bordered={false}>
        {searchState && (
          <DepartmentFilterSection
            textSearch={localFilter.textSearch}
            status={localFilter.status}
            onFilterChange={handleFilterChange}
          />
        )}

        {view === 'table' ? (
          <DepartmentTableView
            data={data?.data}
            columns={columns}
            loading={isPending}
            onChange={({}, filters, sorter) => {
              const currentSorter = Array.isArray(sorter) ? sorter[0] : sorter;
              handleFilterChange({
                status: filters.status ? filters.status.join(',') : undefined,
                page: 1,
                sortField: currentSorter.field?.toString(),
                sortOrder: currentSorter.order === 'descend' ? 'desc' : 'asc',
              });
            }}
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
            visibleColumns={storedVisibleColumns['department-table']}
            onDelete={handleBulkDelete}
          />
        ) : (
          <DepartmentCardView
            data={data?.data}
            onView={(id) => {
              setOpen(true);
              setSelectedId(id);
              setFormMode('view');
            }}
            onEdit={(id) => {
              setOpen(true);
              setSelectedId(id);
              setFormMode('edit');
            }}
            onDelete={handleDelete}
          />
        )}

        <Pagination
          current={localFilter.page || 1}
          limit={localFilter.pageSize || 0}
          totalRecord={data?.meta?.total || 0}
          totalItem={data?.meta?.pageCount || 0}
          onChange={(page, pageSize) => {
						handleFilterChange({ page, pageSize });
					}}
          showSizeChanger
        />
      </Card>
    </>
  );
}