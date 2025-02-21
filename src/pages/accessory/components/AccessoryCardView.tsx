import { Card, Col, Row, Typography, Image, Flex } from "antd";
import { Accessory } from "../types";
import ButtonViewDetail from "../../../components/common/ButtonVeiwDetail";
import ButtonEdit from "../../../components/common/ButtonEdit";
import ButtonDelete from "../../../components/common/ButtonDelete";
import { getImage } from "../../../hooks/getImage";
import BadgeActive from "../../../components/common/BadgeActive";

export const AccessoryCardView: React.FC<{
	data: Accessory[];
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
						actions={[
							<ButtonViewDetail block onClick={() => onView(record.id!)} />,
							<ButtonEdit block onClick={() => onEdit(record.id!)} />,
							<ButtonDelete block onDelete={() => onDelete(record.id!)} />,
						]}
					>
						<center>
							<Image
								alt={record.name}
								src={getImage(record.image, "accessory")}
								preview={false}
								className="h-20 object-cover"
							/>
						</center>
						<Flex wrap align="center" justify="space-between">
							<Typography.Title level={5} className="mb-1">
								{record.name}
							</Typography.Title>
							<BadgeActive value={record.status} />
						</Flex>
						<Typography.Paragraph
							ellipsis={{ rows: 2, expandable: true }}
							className="text-gray-600 text-sm"
						>
							{record.detail}
						</Typography.Paragraph>
					</Card>
				</Col>
			))}
		</Row>
	);
};
