import {
	Dropdown,
	Checkbox,
	Button,
	MenuProps,
	DropdownProps,
	Tooltip,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { ColumnSelectorProps, CustomColumnType } from "../../types/TableType";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const getColumnKey = <T extends object>(
	column: CustomColumnType<T>
): string => {
	return (column.key || column.dataIndex)?.toString() || "";
};

export const ColumnSelector = <T extends object>({
	columns,
	visibleColumns=[],
	onColumnVisibilityChange,
}: ColumnSelectorProps<T>) => {
	const { t } = useTranslation("common");
	const [open, setOpen] = useState(false);

	const items = columns.map((column) => {
		const columnKey = getColumnKey(column);
		const isLocked = column.lock;
		return {
			key: columnKey,
			label: (
				<div className="flex items-center">
					<Checkbox
						checked={
							isLocked ||
							(Array.isArray(visibleColumns) &&
								visibleColumns.includes(columnKey))
						}
						onChange={(e) =>
							onColumnVisibilityChange(columnKey, e.target.checked, isLocked!)
						}
						disabled={isLocked}
					>
						<span className="ml-2">
							{column.title as string}
							{isLocked && (
								<span className="text-gray-400 ml-1">({t("lock")})</span>
							)}
						</span>
					</Checkbox>
				</div>
			),
		};
	});

	const handleMenuClick: MenuProps["onClick"] = (e) => {
		if (e.key === "3") {
			setOpen(false);
		}
	};
	const handleOpenChange: DropdownProps["onOpenChange"] = (nextOpen, info) => {
		if (info.source === "trigger" || nextOpen) {
			setOpen(nextOpen);
		}
	};

	return (
		<Dropdown
			menu={{
				items: [
					{
						key: "1",
						type: "group",
						label: t("selectColumn"),
						children: items,
					},
				],
				onClick: handleMenuClick,
			}}
			trigger={["click"]}
			placement="bottomRight"
			onOpenChange={handleOpenChange}
			open={open}
		>
			<Tooltip title={t("selectColumn")}>
				<Button icon={<SettingOutlined />} type="text"></Button>
			</Tooltip>
		</Dropdown>
	);
};

export default ColumnSelector;
