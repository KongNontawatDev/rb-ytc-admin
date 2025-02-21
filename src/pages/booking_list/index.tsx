import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UnorderedListOutlined } from "@ant-design/icons";
import { Card, Tabs } from "antd";
import { useColumnOrderStore } from "../../hooks/useTableStore";
import {  FilterQuery } from "./types";
import { useBookingListPage } from "./hooks/useBookingListPage";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";
import { getColumnKey } from "../../types/TableType";
import { BookingListTableView } from "./components/BookingListTableView";
import { BookingListCardView } from "./components/BookingListCardView";
import { Pagination } from "../../components/common/Pagination";
import BookingListModal from "./components/BookingListModal";
import { BookingListFilterSection } from "./components/BookingListFilterSection";
import { BookingListPageHeader } from "./components/BookingListPageHeader";
import { useBookingListColumns } from "./hooks/useBookingListColumns";
import { delay } from "../../utils/promise";
import { useBookingStatusList } from "../../hooks/useBookingStatusList";
import BookingListViewModal from "./components/BookingListViewModal";

export default function BookingListPage() {
	const { t } = useTranslation(["booking_list", "common", "app"]);
	const { visibleColumns: storedVisibleColumns, updateVisibleColumns } =
		useColumnOrderStore();
	const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
	const statusList = useBookingStatusList(null);
	const [openView, setViewOpen] = useState(false);
	const [userHasSetView, setUserHasSetView] = useState(false);
	
	const defaultFilter: FilterQuery = {
		textSearch: "",
		searchField: "id,user_name,title",
		page: 1,
		pageSize: 10,
		sortOrder: "desc",
		sortField: "id",
		status: "1",
		book_start:"",
		book_end:"",
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
		deleteSelectedBookingList,
		statusUpdateLoading,
	} = useBookingListPage(defaultFilter);

	// เซ็ตค่าเริ่มต้นตามขนาดหน้าจอเมื่อโหลดหน้าครั้งแรกเท่านั้น
	useEffect(() => {
		if (!userHasSetView) {
			const isLargeScreen = window.innerWidth >= 992; // lg breakpoint ของ Ant Design
			setView(isLargeScreen ? "table" : "card");
			
			// ติดตั้ง event listener เฉพาะเมื่อยังไม่ได้กำหนดมุมมองโดยผู้ใช้
			const handleResize = () => {
				if (!userHasSetView) {
					const isLargeScreen = window.innerWidth >= 992;
					setView(isLargeScreen ? "table" : "card");
				}
			};
			
			window.addEventListener("resize", handleResize);
			
			return () => {
				window.removeEventListener("resize", handleResize);
			};
		}
	}, [userHasSetView, setView]);

	// ฟังก์ชันที่จะถูกเรียกเมื่อผู้ใช้คลิกปุ่มสลับมุมมอง
	const handleToggleView = () => {
		setUserHasSetView(true);
		setView((prev) => (prev === "card" ? "table" : "card"));
		
		// ลบ event listener เมื่อผู้ใช้เลือกมุมมองเอง
		window.removeEventListener("resize", () => {});
	};

	const confirmDelete = useDeleteConfirmation(
		t("booking_list:title"),
		async (ids: React.Key[]) => {
			try {
				await delay(2000);
				await deleteSelectedBookingList.mutateAsync(ids);
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

	const columns = useBookingListColumns({
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
		const tableId = "booking_list-table";
		const defaultVisibleColumnKeys = columns.map(getColumnKey);

		if (!storedVisibleColumns[tableId]) {
			updateVisibleColumns(tableId, defaultVisibleColumnKeys);
		}
	}, [columns, storedVisibleColumns, updateVisibleColumns]);

	useEffect(() => {
		document.title = t("booking_list:header") + t("app:appTitle");
	}, [t]);


	return (
		<>
			<BookingListModal
				open={open}
				onClose={() => {
					setOpen(false);
					setSelectedId(null);
				}}
				id={selectedId}
				initialMode={formMode}
			/>
			<BookingListViewModal
				open={openView}
				onClose={() => {
					setViewOpen(false);
					setSelectedId(null);
				}}
				id={selectedId}
			/>
			<BookingListPageHeader
				title={
					t("booking_list:header") +
					(data?.meta?.total ? ` (${data?.meta?.total})` : "")
				}
				icon={UnorderedListOutlined}
				onClearFilter={() => handleFilterChange(defaultFilter)}
				onToggleSearch={() => setSearchState(!searchState)}
				searchState={searchState}
				view={view}
				onToggleView={handleToggleView}
				columns={columns}
				visibleColumns={storedVisibleColumns["booking_list-table"]}
				onColumnVisibilityChange={(
					columnKey: any,
					checked: any,
					isLocked: any
				) => {
					if (isLocked) return;
					const newColumns = checked
						? [...storedVisibleColumns["booking_list-table"], columnKey]
						: storedVisibleColumns["booking_list-table"].filter(
								(key) => key !== columnKey
						  );
					updateVisibleColumns("booking_list-table", newColumns);
				}}
				onCreateClick={() => {
					setOpen(true);
					setSelectedId(null);
					setFormMode("create");
				}}
			/>

			<Card className="mt-3" bordered={false}>
				<Tabs
					defaultActiveKey="1"
					items={statusList.map((status,index) => ({
						key: String(status.value),
						label: (
							<span>
								{status.label}{' '}({data?.meta?.statusCounts["status_"+(index+1)]})
								
							</span>
						),
					}))}
					onChange={(key:string)=>handleFilterChange({status:key})} 
				/>
				{searchState && (
					<BookingListFilterSection
						textSearch={localFilter.textSearch}
						onFilterChange={handleFilterChange}
					/>
				)}

				{view === "table" ? (
					<BookingListTableView
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
						visibleColumns={storedVisibleColumns["booking_list-table"]}
						onDelete={handleBulkDelete}
					/>
				) : (
					<BookingListCardView
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
						onDelete={handleDelete as any}
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
