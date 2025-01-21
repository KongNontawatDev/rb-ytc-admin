// types.ts
import { ColumnType } from 'antd/es/table';

export interface CustomColumnType<T> extends ColumnType<T> {
  lock?: boolean;
}

export interface ColumnVisibility {
  [key: string]: boolean;
}

export interface ColumnSelectorProps<T> {
  columns: CustomColumnType<T>[];
  visibleColumns: string[];
  onColumnVisibilityChange: (columnKey: string, checked: boolean, isLocked: boolean) => void;
}

export const getColumnKey = <T extends object>(column: CustomColumnType<T>): string => {
  return (column.key || column.dataIndex)?.toString() || '';
};
