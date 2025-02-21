import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Space, Typography, Dropdown, Flex, Image, Tag } from "antd";
import type { MenuProps } from "antd";
import Highlighter from "react-highlight-words";
import { useActiveList } from "../../../hooks/useActiveList";
import BadgeActive from "../../../components/common/BadgeActive";
import { CustomColumnType } from "../../../types/TableType";
import ButtonViewDetail from "../../../components/common/ButtonVeiwDetail";
import ButtonEdit from "../../../components/common/ButtonEdit";
import ButtonDelete from "../../../components/common/ButtonDelete";
import { fallbackImage } from "../../../utils/file";
import { Room } from "../types";
import { getImage } from "../../../hooks/getImage";

interface UseRoomColumnsProps {
	textSearch?: string;
	onStatusUpdate: (id: number, status: number) => Promise<void>;
	onView: (id: number) => void;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
	statusLoading: number | null;
}

export const useColumns = ({
	textSearch = "",
	onStatusUpdate,
	onView,
	onEdit,
	onDelete,
	statusLoading,
}: UseRoomColumnsProps) => {
	const { t } = useTranslation(["room", "common", "department"]);
	const { Text } = Typography;
	const activeStatusList = useActiveList(null);
	return useMemo(() => {
		const createStatusMenuItems = (recordId: number): MenuProps["items"] =>
			activeStatusList.map((item) => ({
				key: item.value,
				label: <BadgeActive value={item.value} />,
				onClick: () => onStatusUpdate(recordId, item.value),
			}));

		const columns: CustomColumnType<Room>[] = [
			{
				title: t("room:schema.id.label"),
				key: "id",
				lock: true,
				render: (_, record) => (
					<Typography.Link onClick={() => onView(record.id!)}>
						{record.id}
					</Typography.Link>
				),
			},
			{
				title: t("room:schema.name.label"),
				key: "name",
				lock: true,
				sorter: true,
				render: (_, record) => (
					<Flex gap={5} align="center">
						{record.room_image && (
							<Image
								src={getImage(record.room_image[0]?.image, "room")}
								className="rounded-sm max-h-20 max-w-20"
								fallback={fallbackImage}
							/>
						)}
						<span>
							<Flex gap={5}>
								<Highlighter
									searchWords={[textSearch]}
									textToHighlight={record.name || ""}
								/>
								<Text copyable={{ text: record.name }} />
							</Flex>
							<small className="me-1">ขนาด:</small><Tag color="blue" className="text-sm"><small>{record.size}</small></Tag><br/>
							<small className="me-1">จุได้:</small>
							<Tag color="green" className="text-sm"><small>{record.capacity}</small></Tag><small>คน</small>
						</span>
					</Flex>
				),
			},
			{
				title: t("room:schema.location.label"),
				key: "location",
				render: (_, record) => (
					<Typography.Paragraph>
						{record.location} <Text copyable={{ text: record.location }} />
					</Typography.Paragraph>
				),
			},
			{
				title: t("room:schema.detail.label"),
				width:400,
				key: "detail",
				render: (_, record) => (
					<Typography.Paragraph>
						{record.detail} <Text copyable={{ text: record.detail }} />
					</Typography.Paragraph>
				),
			},
			{
				title: t("room:schema.roomStatus.label"),
				key: "roomStatus",
				render: () => (
					<Tag color="green">
						ว่าง
					</Tag>
				),
			},

			{
				title: t("room:schema.status.label"),
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
						menu={{ items: createStatusMenuItems(record.id!) }}
						trigger={["click"]}
					>
						<a onClick={(e) => e.preventDefault()}>
							<BadgeActive
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
					<Space>
						<ButtonViewDetail
							tooltip={t("common:viewDetail")}
							onClick={() => onView(record.id)}
						/>
						<ButtonEdit
							tooltip={t("common:edit")}
							onClick={() => onEdit(record.id)}
						/>
						<ButtonDelete
							tooltip={t("common:delete")}
							onDelete={async () => onDelete(record.id)}
						/>
					</Space>
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
