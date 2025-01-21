import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DropboxOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { useColumnOrderStore } from "../../hooks/useTableStore";
import { FilterQuery } from "./types";
import { useAccessoryPage } from "./hooks/useAccessoryPage";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";
import { getColumnKey } from "../../types/TableType";
import { AccessoryTableView } from "./components/AccessoryTableView";
import { AccessoryCardView } from "./components/AccessoryCardView";
import { Pagination } from "../../components/common/Pagination";
import AccessoryModal from "./components/AccessoryModal";
import { AccessoryFilterSection } from "./components/AccessoryFilterSection";
import { AccessoryPageHeader } from "./components/AccessoryPageHeader";
import { useColumns } from "./hooks/useAccessoryColumns";
import { delay } from "../../utils/promise";

export default function AccessoryPage() {
	const { t } = useTranslation(["accessory", "common","app"]);
	const { visibleColumns: storedVisibleColumns, updateVisibleColumns } =
		useColumnOrderStore();
	const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
	const defaultFilter: FilterQuery = {
		textSearch: "",
		searchField: "id,name",
		page: 1,
		pageSize: 10,
		sortOrder: "desc",
		sortField: "id",
		status: "",
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
		deleteSelectedAccessory,
		statusUpdateLoading,
	} = useAccessoryPage(defaultFilter);

	const confirmDelete = useDeleteConfirmation(
		t("accessory:title"),
		async (ids: React.Key[]) => {
			try {
				await delay(2000);
				await deleteSelectedAccessory.mutateAsync(ids);
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
			setFormMode("view");
		},
		onEdit: (id) => {
			setOpen(true);
			setSelectedId(id);
			setFormMode("edit");
		},
		onDelete: handleDelete,
		statusLoading: statusUpdateLoading,
	});

	useEffect(() => {
		const tableId = "accessory-table";
		const defaultVisibleColumnKeys = columns.map(getColumnKey);

		if (!storedVisibleColumns[tableId]) {
			updateVisibleColumns(tableId, defaultVisibleColumnKeys);
		}
	}, [columns, storedVisibleColumns, updateVisibleColumns]);

	useEffect(() => {
		document.title = t("accessory:header") + t("app:appTitle");
	}, []);

	return (
		<>
			<AccessoryModal
				open={open}
				onClose={() => {
					setOpen(false);
					setSelectedId(null);
				}}
				id={selectedId}
				initialMode={formMode}
			/>
			<AccessoryPageHeader
				title={
					t("accessory:header") +
					(data?.meta?.total ? ` (${data?.meta?.total})` : "")
				}
				icon={DropboxOutlined}
				onClearFilter={() => handleFilterChange(defaultFilter)}
				onToggleSearch={() => setSearchState(!searchState)}
				searchState={searchState}
				view={view}
				onToggleView={() =>
					setView((prev) => (prev === "card" ? "table" : "card"))
				}
				columns={columns}
				visibleColumns={storedVisibleColumns["accessory-table"]}
				onColumnVisibilityChange={(
					columnKey: any,
					checked: any,
					isLocked: any
				) => {
					if (isLocked) return;
					const newColumns = checked
						? [...storedVisibleColumns["accessory-table"], columnKey]
						: storedVisibleColumns["accessory-table"].filter(
								(key) => key !== columnKey
						  );
					updateVisibleColumns("accessory-table", newColumns);
				}}
				onCreateClick={() => {
					setOpen(true);
					setSelectedId(null);
					setFormMode("create");
				}}
			/>

			<Card className="mt-3" bordered={false}>
				{searchState && (
					<AccessoryFilterSection
						textSearch={localFilter.textSearch}
						status={localFilter.status}
						onFilterChange={handleFilterChange}
					/>
				)}

				{view === "table" ? (
					<AccessoryTableView
						data={data?.data}
						columns={columns}
						loading={isPending}
						onChange={({}, filters, sorter) => {
							const currentSorter = Array.isArray(sorter) ? sorter[0] : sorter;
							handleFilterChange({
								status: filters.status ? filters.status.join(",") : undefined,
								page: 1,
								sortField: currentSorter.field?.toString(),
								sortOrder: currentSorter.order === "descend" ? "desc" : "asc",
							});
						}}
						selectedRows={selectedRows}
						onSelectedRowsChange={setSelectedRows}
						visibleColumns={storedVisibleColumns["accessory-table"]}
						onDelete={handleBulkDelete}
					/>
				) : (
					<AccessoryCardView
						data={data?.data}
						onView={(id) => {
							setOpen(true);
							setSelectedId(id);
							setFormMode("view");
						}}
						onEdit={(id) => {
							setOpen(true);
							setSelectedId(id);
							setFormMode("edit");
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
