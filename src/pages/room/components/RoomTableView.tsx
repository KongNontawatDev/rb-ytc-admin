import { Modal, Spin, TablePaginationConfig } from "antd";
import {
	FilterValue,
	SorterResult,
	TableCurrentDataSource,
} from "antd/es/table/interface";
import { useTranslation } from "react-i18next";
import { DeleteOutlined } from "@ant-design/icons";
import { CustomColumnType } from "../../../types/TableType";
import { Room } from "../types";
import { CustomTable } from "../../../components/common/Table";
import { useUpdateSelectedStatusRoom } from "../hooks/useRoomMutate";
import { useState } from "react";
import ActiveStatusDropdown from "../../../components/common/ActiveStatusDropdown";
import AlertSubmitFail from "../../../components/common/AlertSubmitFail";
import { ErrorResponse } from "../../../types/axiosType";

export const RoomTableView: React.FC<{
  data: Room[];
  columns: CustomColumnType<any>[];
  loading: boolean;
  onChange: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Room> | SorterResult<Room>[],
    extra: TableCurrentDataSource<Room>
  ) => void;
  visibleColumns: string[];
  selectedRows: React.Key[];
  onSelectedRowsChange: (selectedRowKeys: React.Key[]) => void;
  onDelete: (keys: React.Key[]) => void;
}> = ({
  data,
  columns,
  loading,
  onChange,
  visibleColumns,
  onDelete,
  selectedRows,
  onSelectedRowsChange,
}) => {
  const { t } = useTranslation(["common","room","validation"]);
  const updateStatusMutation = useUpdateSelectedStatusRoom(()=>{});
  const [newStatus, setNewStatus] = useState<number | undefined>();
  const [isModalVisible, setModalVisible] = useState(false);
	const [errorSubmit, setErrorSubmit] = useState<ErrorResponse | null>();
  
  const handleUpdateStatus = async() => {
    if (newStatus !== undefined) {
      await updateStatusMutation.mutateAsync({ id: selectedRows.map(Number), status: newStatus });
      setModalVisible(false);
      onSelectedRowsChange([])
    }else {
      setErrorSubmit({message:t("validation:placeholderSelect",{field:t("room:schema.status.label")})} as any)
    }
  };

  return (
    <>

      <CustomTable
        tableId="room-table"
        columns={columns}
        dataSource={data}
        loading={loading}
        visibleColumns={visibleColumns}
        enableColumnDrag
        onChange={onChange}
        enableRowPin={false}
        selectedRowKeys={selectedRows}
        onSelectedRowKeysChange={onSelectedRowsChange}
        operations={[
          {
            label: t("common:deleteSelected"),
            onClick: onDelete,
            type: "dashed",
            size: "small",
            icon: <DeleteOutlined />,
            danger: true,
          },
          {
            label: t("common:updateSelectedStatus"),
            onClick: () => setModalVisible(true),
            type: "primary",
            size: "small",
          },
        ]}
      />

      {/* Modal for updating status */}
      <Modal
        title={t("common:updateSelectedStatus")}
        open={isModalVisible}
        onOk={handleUpdateStatus}
        onCancel={() => setModalVisible(false)}
        okText={t("common:save")}
        cancelText={t("common:cancel")}
        okButtonProps={{ loading: updateStatusMutation.isPending }}
      >
        {errorSubmit&&<AlertSubmitFail message={errorSubmit?.message!}/>}
        <Spin spinning={updateStatusMutation.isPending}>
          <ActiveStatusDropdown
            value={newStatus}
            onChange={(value) => setNewStatus(value as number)}
            placeholder={t("common:select",{data:t("room:schema.status.label")})}
          />
        </Spin>
      </Modal>
    </>
  );
};