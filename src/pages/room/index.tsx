import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "antd";
import { useColumnOrderStore } from "../../hooks/useTableStore";
import { FilterQuery } from "./types";
import { useRoomPage } from "./hooks/useRoomPage";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";
import { getColumnKey } from "../../types/TableType";
import { RoomTableView } from "./components/RoomTableView";
import { RoomCardView } from "./components/RoomCardView";
import { Pagination } from "../../components/common/Pagination";
import RoomModal from "./components/RoomModal";
import { RoomFilterSection } from "./components/RoomFilterSection";
import { RoomPageHeader } from "./components/RoomPageHeader";
import { useColumns } from "./hooks/useRoomColumns";
import { delay } from "../../utils/promise";
import { InboxOutlined } from "@ant-design/icons";
import RoomViewModal from "./components/RoomViewModal";

export default function RoomPage() {
	const { t } = useTranslation(["room", "common",'app']);
	const { visibleColumns: storedVisibleColumns, updateVisibleColumns } =
		useColumnOrderStore();
	const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
	const [openView, setViewOpen] = useState(false);
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
		deleteSelectedRoom,
		statusUpdateLoading,
	} = useRoomPage(defaultFilter);

	const confirmDelete = useDeleteConfirmation(
		t("room:title"),
		async (ids: React.Key[]) => {
			try {
				await delay(2000);
				await deleteSelectedRoom.mutateAsync(ids);
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
		const tableId = "room-table";
		const defaultVisibleColumnKeys = columns.map(getColumnKey);

		if (!storedVisibleColumns[tableId]) {
			updateVisibleColumns(tableId, defaultVisibleColumnKeys);
		}
	}, [columns, storedVisibleColumns, updateVisibleColumns]);

		useEffect(() => {
		document.title = t("room:header") + t("app:appTitle");
	}, []);

	return (
		<>
			<RoomModal
				open={open}
				onClose={() => {
					setOpen(false);
					setSelectedId(null);
				}}
				id={selectedId}
				initialMode={formMode}
			/>
			<RoomViewModal
				open={openView}
				onClose={() => {
					setViewOpen(false);
					setSelectedId(null);
				}}
				id={selectedId}
			/>
			<RoomPageHeader
				title={
					t("room:header") +
					(data?.meta?.total ? ` (${data?.meta?.total})` : "")
				}
				icon={InboxOutlined}
				onClearFilter={() => handleFilterChange(defaultFilter)}
				onToggleSearch={() => setSearchState(!searchState)}
				searchState={searchState}
				view={view}
				onToggleView={() =>
					setView((prev) => (prev === "card" ? "table" : "card"))
				}
				columns={columns}
				visibleColumns={storedVisibleColumns["room-table"]}
				onColumnVisibilityChange={(
					columnKey: any,
					checked: any,
					isLocked: any
				) => {
					if (isLocked) return;
					const newColumns = checked
						? [...storedVisibleColumns["room-table"], columnKey]
						: storedVisibleColumns["room-table"].filter(
								(key) => key !== columnKey
						  );
					updateVisibleColumns("room-table", newColumns);
				}}
				onCreateClick={() => {
					setOpen(true);
					setSelectedId(null);
					setFormMode("create");
				}}
			/>

			<Card className="mt-3" bordered={false}>
				{searchState && (
					<RoomFilterSection
						textSearch={localFilter.textSearch}
						status={localFilter.status}
						onFilterChange={handleFilterChange}
					/>
				)}

				{view === "table" ? (
					<RoomTableView
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
						visibleColumns={storedVisibleColumns["room-table"]}
						onDelete={handleBulkDelete}
					/>
				) : (
					<RoomCardView
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
