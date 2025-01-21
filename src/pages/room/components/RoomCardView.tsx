import { Card, Col, Row, Typography } from "antd";
import { Room } from "../types";
import ButtonViewDetail from "../../../components/common/ButtonVeiwDetail";
import ButtonEdit from "../../../components/common/ButtonEdit";
import ButtonDelete from "../../../components/common/ButtonDelete";

export const RoomCardView: React.FC<{
  data: Room[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => Promise<void>;
}> = ({ data, onView, onEdit, onDelete }) => {
  return (
    <Row gutter={[15, 15]}>
      {data?.map((record, index) => (
        <Col span={8} key={index}>
          <Card
            bordered
            hoverable
            actions={[
              <ButtonViewDetail
                block
                onClick={() => onView(record.id!)}
              />,
              <ButtonEdit
                block
                onClick={() => onEdit(record.id!)}
              />,
              <ButtonDelete
                block
                onDelete={() => onDelete(record.id!)}
              />,
            ]}
          >
            <Typography.Paragraph copyable>
              {`${record.id}. ${record.name}`}
            </Typography.Paragraph>
          </Card>
        </Col>
      ))}
    </Row>
  );
};