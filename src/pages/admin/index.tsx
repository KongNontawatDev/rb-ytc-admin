import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "antd";
import { useColumnOrderStore } from "../../hooks/useTableStore";
import { FilterQuery } from "./types";
import { useAdminPage } from "./hooks/useAdminPage";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";
import { getColumnKey } from "../../types/TableType";
import { AdminTableView } from "./components/AdminTableView";
import { AdminCardView } from "./components/AdminCardView";
import { Pagination } from "../../components/common/Pagination";
import AdminModal from "./components/AdminModal";
import { AdminFilterSection } from "./components/AdminFilterSection";
import { AdminPageHeader } from "./components/AdminPageHeader";
import { useColumns } from "./hooks/useAdminColumns";
import { delay } from "../../utils/promise";
import { UsergroupAddOutlined } from "@ant-design/icons";

export default function AdminPage() {
  const { t } = useTranslation(['admin', 'common','app']);
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
    role_id: '',
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
    deleteSelectedAdmin,
    statusUpdateLoading
  } = useAdminPage(defaultFilter);

  const confirmDelete = useDeleteConfirmation(
    t("admin:title"),
    async (ids: React.Key[]) => {
      try {
      await delay(2000)
        await deleteSelectedAdmin.mutateAsync(ids);
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
  

  const columns = useColumns({
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
    const tableId = 'admin-table';
    const defaultVisibleColumnKeys = columns.map(getColumnKey);

    if (!storedVisibleColumns[tableId]) {
      updateVisibleColumns(tableId, defaultVisibleColumnKeys);
    }
  }, [columns, storedVisibleColumns, updateVisibleColumns]);

  	useEffect(() => {
		document.title = t("admin:header") + t("app:appTitle");
	}, []);

  return (
    <>
      <AdminModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedId(null);
        }}
        id={selectedId}
        initialMode={formMode}
      />
      <AdminPageHeader
        title={t('admin:header') + (data?.meta?.total?` (${data?.meta?.total})`:"")}
        icon={UsergroupAddOutlined}
        onClearFilter={() => handleFilterChange(defaultFilter)}
        onToggleSearch={() => setSearchState(!searchState)}
        searchState={searchState}
        view={view}
        onToggleView={() => setView(prev => prev === 'card' ? 'table' : 'card')}
        columns={columns}
        visibleColumns={storedVisibleColumns['admin-table']}
        onColumnVisibilityChange={(columnKey:any, checked:any, isLocked:any) => {
          if (isLocked) return;
          const newColumns = checked
            ? [...storedVisibleColumns['admin-table'], columnKey]
            : storedVisibleColumns['admin-table'].filter(key => key !== columnKey);
          updateVisibleColumns('admin-table', newColumns);
        }}
        onCreateClick={() => {
          setOpen(true);
          setSelectedId(null);
          setFormMode('create');
        }}
      />

      <Card className="mt-3" bordered={false}>
        {searchState && (
          <AdminFilterSection
            textSearch={localFilter.textSearch}
            status={localFilter.status}
            role_id={localFilter.role_id}
            onFilterChange={handleFilterChange}
          />
        )}

        {view === 'table' ? (
          <AdminTableView
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
            visibleColumns={storedVisibleColumns['admin-table']}
            onDelete={handleBulkDelete}
          />
        ) : (
          <AdminCardView
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