import { PrinterOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Tooltip } from "antd";
import { ButtonSize, ButtonType } from "antd/es/button";

type Props = {
	title?: string;
	tooltip?: string;
	type?: ButtonType;
	size?: ButtonSize;
	path?: string;
	items?: {
		title: string;
		onClick: React.MouseEventHandler<HTMLElement>;
	}[];
	onClick?: React.MouseEventHandler<HTMLElement>;
};

export default function ButtonPrint({
	title,
	tooltip = "สั่งพิมพ์",
	type = "text",
	size = "large",
	items,
	onClick,
	path,
}: Props) {

	const menu: React.ReactNode = (
		<Menu>
			{items &&
				items.map((item) => (
					<Menu.Item key={item.title} onClick={() => item.onClick}>
						{item.title}
					</Menu.Item>
				))}
		</Menu>
	);

	return (
		<>
			{!items ? (
				<Tooltip title={tooltip}>
					<Button
						type={type}
						size={size}
						icon={<PrinterOutlined />}
						onClick={path ? undefined : onClick}
					>
						{title}
					</Button>
				</Tooltip>
			) : (
				<Dropdown dropdownRender={() => menu} trigger={["hover"]}>
					<Button
						type={type}
						size={size}
						icon={<PrinterOutlined />}
						className="flex justify-center items-center"
					>
						{title}
					</Button>
				</Dropdown>
			)}
		</>
	);
}
