import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ColumnOrderState {
	columnOrders: Record<string, string[]>;
	pinnedRowKeys: Record<string, React.Key[]>;
	visibleColumns: Record<string, string[]>;

	updateColumnOrder: (tableId: string, columns: string[]) => void;
	togglePinRow: (tableId: string, rowKey: React.Key) => void;
	updateVisibleColumns: (tableId: string, columns: string[]) => void;
}

export const useColumnOrderStore = create<ColumnOrderState>()(
	persist(
		(set) => ({
			columnOrders: {},
			pinnedRowKeys: {},
			visibleColumns: {},

			updateColumnOrder: (tableId, columns) =>
				set((state) => ({
					columnOrders: {
						...state.columnOrders,
						[tableId]: columns || [], // ใช้ค่าเริ่มต้นเป็น [] หาก `columns` ไม่มี
					},
				})),

			togglePinRow: (tableId: string, rowKey: React.Key) =>
				set((state) => {
					const currentPinnedRows = state.pinnedRowKeys[tableId] || []; // Ensure it's always an array
					const isPinned = currentPinnedRows.includes(rowKey);

					return {
						pinnedRowKeys: {
							...state.pinnedRowKeys,
							[tableId]: isPinned
								? currentPinnedRows.filter((key) => key !== rowKey) // Remove the rowKey
								: [...currentPinnedRows, rowKey], // Add the rowKey
						},
					};
				}),

			updateVisibleColumns: (tableId, columns) =>
				set((state) => ({
					visibleColumns: {
						...state.visibleColumns,
						[tableId]: columns || [], // ใช้ค่าเริ่มต้นเป็น [] หาก `columns` ไม่มี
					},
				})),
		}),
		{
			name: "column-order-storage",
			partialize: (state) => ({
				columnOrders: state.columnOrders,
				pinnedRowKeys: state.pinnedRowKeys,
				visibleColumns: state.visibleColumns,
			}),
			merge: (persistedState, currentState) => {
				const typedPersistedState =
					(persistedState as Partial<ColumnOrderState>) || {};

				return {
					...currentState,
					...typedPersistedState,
					columnOrders: typedPersistedState.columnOrders || {},
					pinnedRowKeys: typedPersistedState.pinnedRowKeys || {},
					visibleColumns: typedPersistedState.visibleColumns || {},
				};
			},
		}
	)
);
