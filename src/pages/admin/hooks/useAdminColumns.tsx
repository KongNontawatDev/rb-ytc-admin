import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Space, Typography, Dropdown, Flex, Image } from "antd";
import type { MenuProps } from "antd";
import Highlighter from "react-highlight-words";
import { useActiveList } from "../../../hooks/useActiveList";
import BadgeActive from "../../../components/common/BadgeActive";
import { CustomColumnType } from "../../../types/TableType";
import ButtonViewDetail from "../../../components/common/ButtonVeiwDetail";
import ButtonEdit from "../../../components/common/ButtonEdit";
import ButtonDelete from "../../../components/common/ButtonDelete";
import { fallbackImage } from "../../../utils/file";
import { Admin } from "../types";
import useAuthStore from "../../auth/hooks/useAuthStore";
import { getImage } from "../../../hooks/getImage";

interface UseAdminColumnsProps {
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
}: UseAdminColumnsProps) => {
	const { t } = useTranslation(["admin", "common", "department"]);
	const { admin } = useAuthStore();
	const { Text } = Typography;
	const activeStatusList = useActiveList(null);

	return useMemo(() => {
		const createStatusMenuItems = (recordId: number): MenuProps["items"] =>
			activeStatusList.map((item) => ({
				key: item.value,
				label: <BadgeActive value={item.value} />,
				onClick: () => onStatusUpdate(recordId, item.value),
			}));

		const columns: CustomColumnType<Admin>[] = [
			{
				title: t("admin:schema.id.label"),
				key: "id",
				lock: true,
				render: (_, record) => (
					<Typography.Link onClick={() => onView(record.id!)}>
						{record.id}
					</Typography.Link>
				),
			},
			{
				title: t("admin:schema.name.label"),
				key: "name",
				lock: true,
				sorter: true,
				render: (_, record) => (
					<Flex gap={5} align="center">
						<Image
							src={getImage(record.image, "admin")}
							className="rounded-full max-h-9 max-w-9"
							fallback={fallbackImage}
						/>
						<Highlighter
							searchWords={[textSearch]}
							textToHighlight={record.name || ""}
						/>
						<Text copyable={{ text: record.name }} />
					</Flex>
				),
			},
			{
				title: t("admin:schema.email.label"),
				key: "email",
				render: (_, record) => (
					<Typography.Paragraph>
						{record.email} <Text copyable={{ text: record.email }} />
					</Typography.Paragraph>
				),
			},
			{
				title: t("admin:schema.status.label"),
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
							disabled={admin.id == record.id||admin.role_id != 2}
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
