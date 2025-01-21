import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Typography, Dropdown, Flex, Tag } from "antd";
import type { MenuProps } from "antd";
import Highlighter from "react-highlight-words";
import { useActiveList } from "../../../hooks/useActiveList";
import { CustomColumnType } from "../../../types/TableType";
import { toDateTime } from "../../../utils/dateFunction";
import BadgeStatus from "../components/BadgeStatus";
import { useBookingStatusList } from "../../../hooks/useBookingStatusList";
import ButtonActionMore from "../../../components/common/ButtonActionMore";
import { DeleteOutlined, EditOutlined,  FileSearchOutlined } from "@ant-design/icons";

interface UseBookingListColumnsProps {
	textSearch?: string;
	onStatusUpdate: (id: number, status: number) => Promise<void>;
	onView: (id: number) => void;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
	statusLoading: number | null;
}

export const useBookingListColumns = ({
	textSearch = "",
	onStatusUpdate,
	onView,
	onEdit,
	onDelete,
	statusLoading,
}: UseBookingListColumnsProps) => {
	const { t } = useTranslation([
		"booking_list",
		"common",
		"room",
		"department",
		"user",
	]);
	const { Text } = Typography;
	const activeStatusList = useActiveList(null);
	  const activeStatus = useBookingStatusList(null);

	return useMemo(() => {
		const createStatusMenuItems = (recordId: number): MenuProps["items"] =>
		activeStatus.map((item) => ({
				key: item.value,
				label: <BadgeStatus value={item.value} />,
				onClick: () => onStatusUpdate(recordId, item.value),
			}));

		const columns: CustomColumnType<any>[] = [
			{
				title: t("booking_list:schema.id.label"),
				key: "id",
				lock: true,
				render: (_, record) => (
					<Typography.Link onClick={() => onView(record.id)}>
						{record.id}
					</Typography.Link>
				),
			},
			{
				title: t("room:title"),
				key: "room",
				sorter: true,
				render: (_, record) => (
					<Flex vertical>
						<Typography>{record.room.name}</Typography>
						<Typography.Paragraph type="secondary">
							<small>{record.room.location}</small>
						</Typography.Paragraph>
					</Flex>
				),
			},
			{
				title: t("booking_list:schema.user_name.label"),
				key: "user_name",
				lock: true,
				sorter: true,
				render: (_, record) => (
					<Flex vertical>
						<span>
							<Highlighter
								searchWords={[textSearch]}
								textToHighlight={record.user_name || ""}
							/>
							<Text copyable={{ text: record.user_name }} />
						</span>
						<Typography.Paragraph type="secondary">
							<small>{record.tel}</small>
						</Typography.Paragraph>
					</Flex>
				),
			},
			{
				title: t("booking_list:schema.title.label"),
				key: "title",
				sorter: true,
				render: (_, record) => (
					<>
						<Typography onClick={() => onView(record.title)}>
							{record.title}
						</Typography>
					</>
				),
			},
			
			{
				title: t("booking_list:schema.department.label"),
				key: "department",
				sorter: true,
				render: (_, record) => (
					<>
						<Typography>{record.department.name}</Typography>
					</>
				),
			},
			{
				title: t("booking_list:schema.book_start.label")+" - "+t("booking_list:schema.book_end.label"),
				key: "book_start",
				sorter: true,
				render: (_, record) => (
					<Flex vertical>
						<div>ตั้งแต่ : <Tag color="success">{toDateTime(record.book_start)}</Tag></div>
						<div>จนถึง :  <Tag color="warning">{toDateTime(record.book_end)}</Tag></div>
					</Flex>
				),
			},
			{
				title: t("booking_list:schema.status.label"),
				dataIndex: "status",
				key: "status",
				width: 150,
				sorter: true,
				filters: activeStatusList.map((item) => ({
					text: item.text,
					value: item.value,
				})),
				render: (_, record) => (
					<Dropdown
						menu={{ items: createStatusMenuItems(record.id) }}
						trigger={["click"]}
					>
						<a onClick={(e) => e.preventDefault()}>
							<BadgeStatus
								value={record.status}
								loading={statusLoading == record.id}
							/>
						</a>
					</Dropdown>
				),
			},
			{
				title: " ",
				key: "action",
				align: "right",
				width: 120,
				lock: true,
				render: (_, record) => (
					// <Space>
					// 	<ButtonViewDetail
					// 		tooltip={}
					// 		onClick={}
					// 	/>
					// 	<ButtonEdit
					// 		tooltip={}
					// 		onClick={() => onEdit(record.id)}
					// 	/>
					// 	<ButtonDelete
					// 		tooltip={}
					// 		onDelete={async () => onDelete(record.id)}
					// 	/>
					// </Space>
					<ButtonActionMore
					actions={[
						{
							key:"view",
							label:t("common:viewDetail"),
							icon:<FileSearchOutlined/>,
							onClick:() => onView(record.id)
						},
						{
							key:"edit",
							label:t("common:edit"),
							icon:<EditOutlined/>,
							onClick:() => onEdit(record.id)
						},
						{
							key:"delete",
							label:t("common:delete"),
							icon:<DeleteOutlined/>,
							onClick:async () => onDelete(record.id)
						},
					]}
					/>
				),
			},
		];

		return columns;
	}, [
		t,
		textSearch,
		activeStatusList,
		onStatusUpdate,
		onView,
		onEdit,
		onDelete,
	]);
};
