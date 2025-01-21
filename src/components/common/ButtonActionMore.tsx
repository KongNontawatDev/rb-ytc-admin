import React from "react";
import { Dropdown, Button, Tooltip } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { ButtonType } from "antd/es/button";
import { ButtonSize } from "antd/es/button";
import PopconfirmDelete from "./ConfirmDelete";

// Define the type for an action
type Action = {
	key: string;
	label?: string;
	icon?: React.ReactNode;
	component?: React.ReactNode;
  onClick?: (() => void) | (() => Promise<void>);
	disabled?: boolean;
};

type Props = {
	title?: string;
	actions: Action[];
	type?: ButtonType;
	size?: ButtonSize;
	tooltip?: string;
};

export default function ButtonActionMore({
	title,
	actions,
	type = "text",
	size = "middle",
	tooltip,
}: Props) {
	// Create menu items from actions
	const menuItems = actions.map((action) => {
		if (action.key == "delete") {
			return {
        ...action,
				key: action.key,
				label: <PopconfirmDelete title="" onConfirm={action.onClick}>{action.label}</PopconfirmDelete>,
				icon: action.icon,
				disabled: action.disabled,
			};
		} else {
			return {
        ...action,
				key: action.key,
				label: action.label,
				icon: action.icon,
				disabled: action.disabled,
			};
		}
	});

	return (
		<Dropdown menu={{ items: menuItems }} trigger={["hover", "click"]}>
			<Tooltip title={tooltip}>
				<Button type={type} size={size} icon={<EllipsisOutlined />}>
					{title}
				</Button>
			</Tooltip>
		</Dropdown>
	);
}
