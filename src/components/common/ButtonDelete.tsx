import { DeleteOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { ButtonSize, ButtonType } from "antd/es/button";
import PopconfirmDelete from "./ConfirmDelete";
import { TooltipPlacement } from "antd/es/tooltip";

type Props = {
	title?: string;
	type?: ButtonType;
	size?: ButtonSize;
	danger?: boolean;
	tooltip?: string;
	data?: string;
	icon?: React.ReactNode;
	block?: boolean;
	onDelete: () => Promise<void>;
	placement?: TooltipPlacement;
	disabled?: boolean;
};

export default function ButtonDelete({
	title,
	type = "text",
	size = "middle",
	danger = false,
	tooltip = "ลบ",
	placement = "bottom",
	data,
	block = false,
	onDelete,
	icon,
	disabled=false
}: Props) {
	if (title) {
		return (
			<PopconfirmDelete
				onConfirm={onDelete}
				title={data!}
				placement={placement}
disabled={disabled}
			>
				<Button
					type={type}
					block={block}
					icon={icon ? icon : <DeleteOutlined />}
					size={size}
					danger={danger}
disabled={disabled}
				>
					{title}
				</Button>
			</PopconfirmDelete>
		);
	} else {
		return (
			<PopconfirmDelete
				onConfirm={onDelete}
				title={data!}
				placement={placement}
				disabled={disabled}
			>
				<Tooltip title={tooltip}>
					<Button
						type={type}
						block={block}
						icon={icon ? icon : <DeleteOutlined />}
						size={size}
						danger={danger}
						disabled={disabled}
					></Button>
				</Tooltip>
			</PopconfirmDelete>
		);
	}
}
