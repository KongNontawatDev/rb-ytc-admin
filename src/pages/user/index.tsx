import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UserOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { useColumnOrderStore } from "../../hooks/useTableStore";
import { FilterQuery } from "./types";
import { useUserPage } from "./hooks/useUserPage";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";
import { getColumnKey } from "../../types/TableType";
import { UserTableView } from "./components/UserTableView";
import { UserCardView } from "./components/UserCardView";
import { Pagination } from "../../components/common/Pagination";
import UserModal from "./components/UserModal";
import { UserFilterSection } from "./components/UserFilterSection";
import { UserPageHeader } from "./components/UserPageHeader";
import { useColumns } from "./hooks/useUserColumns";
import { delay } from "../../utils/promise";
import UserViewModal from "./components/UserViewModal";

export default function UserPage() {
	const { t } = useTranslation(["user", "common","app"]);
	const { visibleColumns: storedVisibleColumns, updateVisibleColumns } =
		useColumnOrderStore();
	const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
	const [openView, setViewOpen] = useState(false);
	const defaultFilter: FilterQuery = {
		textSearch: "",
		searchField: "id,full_name",
		page: 1,
		pageSize: 10,
		sortOrder: "desc",
		sortField: "id",
		status: "",
		department_id: "",
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
		deleteSelectedUser,
		statusUpdateLoading,
	} = useUserPage(defaultFilter);

	const confirmDelete = useDeleteConfirmation(
		t("user:title"),
		async (ids: React.Key[]) => {
			try {
				await delay(2000);
				await deleteSelectedUser.mutateAsync(ids);
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
			setViewOpen(true);
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
		const tableId = "user-table";
		const defaultVisibleColumnKeys = columns.map(getColumnKey);

		if (!storedVisibleColumns[tableId]) {
			updateVisibleColumns(tableId, defaultVisibleColumnKeys);
		}
	}, [columns, storedVisibleColumns, updateVisibleColumns]);

		useEffect(() => {
		document.title = t("user:header") + t("app:appTitle");
	}, []);

	return (
		<>
			<UserModal
				open={open}
				onClose={() => {
					setOpen(false);
					setSelectedId(null);
				}}
				id={selectedId}
				initialMode={formMode}
			/>
			<UserViewModal
				open={openView}
				onClose={() => {
					setViewOpen(false);
					setSelectedId(null);
				}}
				id={selectedId}
			/>
			<UserPageHeader
				title={
					t("user:header") +
					(data?.meta?.total ? ` (${data?.meta?.total})` : "")
				}
				icon={UserOutlined}
				onClearFilter={() => handleFilterChange(defaultFilter)}
				onToggleSearch={() => setSearchState(!searchState)}
				searchState={searchState}
				view={view}
				onToggleView={() =>
					setView((prev) => (prev === "card" ? "table" : "card"))
				}
				columns={columns}
				visibleColumns={storedVisibleColumns["user-table"]}
				onColumnVisibilityChange={(
					columnKey: any,
					checked: any,
					isLocked: any
				) => {
					if (isLocked) return;
					const newColumns = checked
						? [...storedVisibleColumns["user-table"], columnKey]
						: storedVisibleColumns["user-table"].filter(
								(key) => key !== columnKey
						  );
					updateVisibleColumns("user-table", newColumns);
				}}
				onCreateClick={() => {
					setOpen(true);
					setSelectedId(null);
					setFormMode("create");
				}}
			/>

			<Card className="mt-3" bordered={false}>
				{searchState && (
					<UserFilterSection
						textSearch={localFilter.textSearch}
						status={localFilter.status}
						department_id={localFilter.department_id}
						onFilterChange={handleFilterChange}
					/>
				)}

				{view === "table" ? (
					<UserTableView
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
						visibleColumns={storedVisibleColumns["user-table"]}
						onDelete={handleBulkDelete}
					/>
				) : (
					<UserCardView
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
