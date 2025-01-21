import { PlusOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { ButtonSize, ButtonType } from "antd/es/button";
import { useNavigate } from "react-router-dom";

type Props = {
	title?: string;
	tooltip?: string;
	type?: ButtonType;
	size?: ButtonSize;
	path?: string;
	setOpen: (value: React.SetStateAction<boolean>) => void;
};

export default function ButtonCreateInLabel({
	title = "",
	tooltip="เพิ่ม",
	type = "text",
	size = "small",
	path = "",
	setOpen,
}: Props) {
	const navigate = useNavigate();
	const onClick = () => {
		if (path !== "") {
			setOpen(true);
		} else {
			navigate(path);
		}
	};

	if (title) {
		return (
			<Button type={type} icon={<PlusOutlined />} size={size} onClick={onClick}>
				{title}
			</Button>
		);
	}

	return (
		<Tooltip title={tooltip}>
			<Button type={type} icon={<PlusOutlined />} size={size} onClick={onClick}>
				{title}
			</Button>
		</Tooltip>
	);
}
