import { Card, Col, Row, Typography, Tag, Image } from "antd";
import { Room } from "../types";
import { getImage } from "../../../hooks/getImage";
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
		<Row gutter={[20, 20]} className="p-4">
			{data?.map((record, index) => (
				<Col key={index} xs={24} sm={12} md={8} lg={6} xl={6}>
					<Card
						bordered
						hoverable
						className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
						cover={
							<Image
								alt={record.name}
								src={getImage(record.room_image[0]?.image, "room")}
								preview={false}
								className="h-48 object-cover max-h-72"
							/>
						}
						actions={[
							<ButtonViewDetail block onClick={() => onView(record.id!)} />,
							<ButtonEdit block onClick={() => onEdit(record.id!)} />,
							<ButtonDelete block onDelete={() => onDelete(record.id!)} />,
						]}
					>
						<Typography.Title level={4} className="mb-2">
							{record.name}
						</Typography.Title>
						<Typography.Paragraph
							ellipsis={{ rows: 2, expandable: true }}
							className="text-gray-600"
						>
							{record.detail}
						</Typography.Paragraph>
						<div className="flex flex-wrap gap-2 mt-4">
							<Tag color="blue">{record.location}</Tag>
							<Tag color="green">Capacity: {record.capacity}</Tag>
							<Tag color={record.status === 1 ? "green" : "red"}>
								{record.status === 1 ? "Available" : "Occupied"}
							</Tag>
						</div>
					</Card>
				</Col>
			))}
		</Row>
	);
};
