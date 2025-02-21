import { Card, Col, Row, Typography } from "antd";
import { BookingList } from "../types";
import ButtonEdit from "../../../components/common/ButtonEdit";
import ButtonDelete from "../../../components/common/ButtonDelete";
import useUISettingStore from "../../../components/layouts/UISetting/hooks/useUISettingStore";
import ButtonViewDetail from "../../../components/common/ButtonVeiwDetail";
import BadgeStatus from "./BadgeStatus";
import { useTranslation } from "react-i18next";

export const BookingListCardView: React.FC<{
  data: BookingList[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => Promise<void>;
}> = ({ data, onView, onEdit, onDelete }) => {
  	const { t } = useTranslation(["booking_list", "common","room"]);
  const uiSettingStore = useUISettingStore();
  const isDarkMode = uiSettingStore.theme === "dark"; // ตรวจสอบว่าเป็น Dark Mode หรือไม่

  return (
    <Row gutter={[16, 16]} className="p-4">
      {data?.map((record, index) => (
        <Col key={index} xs={24} sm={12} md={8} lg={6}>
          <Card
            bordered={true}
            hoverable
            className={`transition-shadow duration-300 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
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
            <div className="space-y-2">
              <Typography.Title
                level={5}
                className={`font-semibold ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {record.title}
              </Typography.Title>
              <Typography.Paragraph
                className={isDarkMode ? "text-gray-300" : "text-gray-600"}
              >
                <strong>{t("room:title")}:</strong> {record.room?.name || "N/A"}
              </Typography.Paragraph>
              <Typography.Paragraph
                className={isDarkMode ? "text-gray-300" : "text-gray-600"}
              >
                <strong>{t("booking_list:schema.book_start.label")}:</strong>{" "}
                {`${new Date(record.book_start).toLocaleDateString()} - ${new Date(
                  record.book_end
                ).toLocaleDateString()}`}
              </Typography.Paragraph>
              <Typography.Paragraph
                className={isDarkMode ? "text-gray-300" : "text-gray-600"}
              >
                <strong>{t("booking_list:schema.status.label")}:</strong>{" "}
                <BadgeStatus value={String(record?.status)} />
              </Typography.Paragraph>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};