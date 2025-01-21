import React, { ReactNode, useMemo } from "react";
import { Table, TableProps, Button, Space, Card, theme } from "antd";
import { DndContext } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ColumnType } from "antd/es/table";
import { ButtonSize, ButtonType } from "antd/es/button";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import { useColumnOrderStore } from "../../hooks/useTableStore";
import { useTranslation } from "react-i18next";

interface CustomColumnType<T> extends ColumnType<T> {
  lock?: boolean;
}

interface Operation {
  label: string;
  onClick: (selectedKeys: React.Key[]) => void;
  type?: ButtonType;
  size?: ButtonSize;
  icon?: ReactNode;
  id?: string;
  disabled?: boolean;
  danger?:boolean
}

interface CustomTableProps<T> extends Omit<TableProps<T>, "columns"> {
  columns: CustomColumnType<T>[];
  visibleColumns?: string[];
  enableColumnDrag?: boolean;
  loading?: boolean;
  operations?: Operation[];
  tableId?: string;
  enableRowPin?: boolean;
  selectedRowKeys?: React.Key[];
  onSelectedRowKeysChange?: (selectedKeys: React.Key[]) => void;
}

// Sortable Header Component remains the same
const SortableHeader = ({
  column,
  children,
}: {
  column: CustomColumnType<any>;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: column.key || column.dataIndex,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "move",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export const CustomTable = <T extends { key: React.Key }>({
  columns,
  visibleColumns,
  enableColumnDrag = true,
  loading = false,
  operations = [],
  tableId = "default-table",
  enableRowPin = false,
  selectedRowKeys,
  onSelectedRowKeysChange,
  ...restProps
}: CustomTableProps<T>) => {
  const { token } = theme.useToken();
  const { t } = useTranslation("common");
  const { columnOrders, pinnedRowKeys, updateColumnOrder, togglePinRow } =
    useColumnOrderStore();

  // Helper function to get column key
  const getColumnKey = (column: CustomColumnType<T>): string => {
    return column.key?.toString() || column.dataIndex?.toString() || "";
  };

  const handleRowPin = (record: { id: number }) => {
    if (!record.id) {
      console.error("Missing ID for record:", record);
      return;
    }
    togglePinRow(tableId, String(record.id));
  };

  const orderedColumns = useMemo(() => {
    const storedOrder = columnOrders[tableId];
    if (storedOrder && storedOrder.length > 0) {
      return storedOrder
        .map((key) => columns.find((col) => getColumnKey(col) === key))
        .filter(Boolean) as CustomColumnType<T>[];
    }
    return columns;
  }, [columns, columnOrders, tableId]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const oldIndex = orderedColumns.findIndex(
      (col) => getColumnKey(col) === active.id
    );
    const newIndex = orderedColumns.findIndex(
      (col) => getColumnKey(col) === over.id
    );

    const reorderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
    updateColumnOrder(tableId, reorderedColumns.map(getColumnKey));
  };

  const dataWithPinnedRows = useMemo(() => {
    const dataSource = restProps.dataSource || [];
    const pinnedRowStrings = (pinnedRowKeys[tableId] || []).map(String);

    const pinnedRows = dataSource.filter(
      (row: any) => pinnedRowStrings.includes(String(row.id))
    );

    const nonPinnedRows = dataSource.filter(
      (row: any) => !pinnedRowStrings.includes(String(row.id))
    );

    return [...pinnedRows, ...nonPinnedRows];
  }, [restProps.dataSource, pinnedRowKeys, tableId]);

  const filteredColumns = useMemo(() => {
    return orderedColumns
      .filter((col) => {
        if (col.lock) return true;
        if (visibleColumns) {
          return visibleColumns.includes(getColumnKey(col));
        }
        return true;
      })
      .map((column, index) => ({
        ...column,
        id: column.key || column.dataIndex,
        title: enableColumnDrag ? (
          <SortableHeader column={column}>{column.title as any}</SortableHeader>
        ) : (
          column.title
        ),
        render: (value: any, record: any, columnIndex: number) => {
          const originalRenderer = column.render;
          const isPinned = pinnedRowKeys[tableId]?.includes(String(record.id));

          const pinButton =
            enableRowPin && index === 0 ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleRowPin(record);
                }}
                style={{ marginRight: 8, cursor: "pointer" }}
              >
                {isPinned ? (
                  <StarFilled style={{ color: "#faad14", fontSize: 18 }} />
                ) : (
                  <StarOutlined
                    style={{ color: token.colorTextDisabled, fontSize: 18 }}
                  />
                )}
              </span>
            ) : null;

          const renderContent = originalRenderer
            ? originalRenderer(value, record, columnIndex)
            : value;

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  column.align === "right" ? "flex-end" : "flex-start",
              }}
            >
              {pinButton}
              {renderContent}
            </div>
          );
        },
      }));
  }, [
    orderedColumns,
    visibleColumns,
    pinnedRowKeys,
    tableId,
    token.colorTextDisabled,
    enableColumnDrag,
  ]);

  const rowSelection = operations.length > 0 && {
    selectedRowKeys: selectedRowKeys || [],
    onChange: (newSelectedRowKeys: React.Key[]) => {
      onSelectedRowKeysChange?.(newSelectedRowKeys);
    },
    getCheckboxProps: (record: { id: number }) => ({
      disabled: false,
      key: record.id,
    }),
  };

  const showOperations = selectedRowKeys && selectedRowKeys.length > 0 && operations.length > 0;

  const operationsCard = showOperations ? (
    <Card size="small" style={{ marginBottom: 10 }}>
      <Space>
        <span>{t("selected", { data: selectedRowKeys.length })}</span>
        {operations.map((operation, index) => (
          <Button
            key={operation.id || `operation-${index}`}
            type={operation.type || "default"}
            onClick={() => operation.onClick(selectedRowKeys)}
            icon={operation.icon}
            size={operation.size}
            danger={operation.danger}
            disabled={operation.disabled}
          >
            {operation.label}
          </Button>
        ))}
      </Space>
    </Card>
  ) : null;

  if (!enableColumnDrag) {
    return (
      <>
        {operationsCard}
        <Table<T>
          {...restProps}
          rowKey={(record: any) => record.id}
          columns={filteredColumns as any}
          dataSource={dataWithPinnedRows}
          pagination={false}
          loading={loading}
          rowSelection={rowSelection as any}
          style={{ overflowX: "auto" }}
        />
      </>
    );
  }

  return (
    <>
      {operationsCard}
      <DndContext
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedColumns.map(getColumnKey)}
          strategy={horizontalListSortingStrategy}
        >
          <Table<T>
            {...restProps}
            rowKey={(record: any) => record.id}
            columns={filteredColumns as any}
            dataSource={dataWithPinnedRows}
            pagination={false}
            loading={loading}
            rowSelection={rowSelection as any}
            style={{ overflowX: "auto" }}
            
          />
        </SortableContext>
      </DndContext>
    </>
  );
};;