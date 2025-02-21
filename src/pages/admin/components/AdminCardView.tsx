import { Card, Col, Row, Typography, Image } from "antd";
import { Admin } from "../types";
import ButtonViewDetail from "../../../components/common/ButtonVeiwDetail";
import ButtonEdit from "../../../components/common/ButtonEdit";
import ButtonDelete from "../../../components/common/ButtonDelete";
import BadgeActive from "../../../components/common/BadgeActive";
import { getImage } from "../../../hooks/getImage";

export const AdminCardView: React.FC<{
	data: Admin[];
	onView: (id: number) => void;
	onEdit: (id: number) => void;
	onDelete: (id: number) => Promise<void>;
}> = ({ data, onView, onEdit, onDelete }) => {
	return (
		<Row gutter={[16, 16]} className="p-4">
			{data?.map((record, index) => (
				<Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
					<Card
						bordered
						hoverable
						className="shadow-md hover:shadow-lg transition-shadow duration-300"
						cover={
							<Image
								alt={record.name}
								src={getImage(record.image,"admin")}
								preview={false}
								className="h-32 object-cover"
							/>
						}
						actions={[
							<ButtonViewDetail block onClick={() => onView(record.id!)} />,
							<ButtonEdit block onClick={() => onEdit(record.id!)} />,
							<ButtonDelete block onDelete={() => onDelete(record.id!)} />,
						]}
					>
						<Typography.Title level={5} className="mb-1">
							{record.name}
						</Typography.Title>
						<Typography.Paragraph
							ellipsis={{ rows: 2, expandable: true }}
							className="text-gray-600 text-sm"
						>
							{record.email}
						</Typography.Paragraph>
						<BadgeActive value={String(record?.status)} />
					</Card>
				</Col>
			))}
		</Row>
	);
};
