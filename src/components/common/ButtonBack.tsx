import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { ButtonSize, ButtonType } from "antd/es/button";
import { useNavigate } from "react-router-dom";

type Props = {
	title?: string;
	tooltip?: string;
	path?: string;
	type?: ButtonType;
	size?: ButtonSize;
	onClick?: React.MouseEventHandler<HTMLElement>;
};

export default function ButtonBack({
	title,
	tooltip="ย้อนกลับ",
	path,
	type = "text",
	size = "middle",
	onClick,
}: Props) {
	const navigate = useNavigate();

	const handleClick = () => {
		if (path) {
			navigate(path);
		}
	};

	if (title) {
		return (
			<Button
				type={type}
				icon={<ArrowLeftOutlined />}
				size={size}
				onClick={onClick || handleClick}
			>
				{title}
			</Button>
		);
	}

	return (
		<Tooltip title={tooltip}>
			<Button
				type={type}
				icon={<ArrowLeftOutlined />}
				size={size}
				onClick={onClick || handleClick}
			>
			</Button>
		</Tooltip>
	);
}
