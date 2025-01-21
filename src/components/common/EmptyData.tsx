import { PlusOutlined } from "@ant-design/icons";
import { Button, Empty, Typography } from "antd";
import { MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";

const { Text } = Typography;
type Props = {
	value?: string;
	showButton?: boolean;
	onClick?: MouseEventHandler<HTMLElement>;
};

export default function EmptyData({
	value,
	showButton = false,
	onClick,
}: Props) {
	const { t } = useTranslation("common");
	return (
		<Empty
			image={Empty.PRESENTED_IMAGE_SIMPLE}
			description={<Text type="secondary">{t("noData", { data: value })}</Text>}
		>
			{showButton && (
				<Button type="primary" icon={<PlusOutlined />} onClick={onClick}>
					{t("create", { data: value })}
				</Button>
			)}
		</Empty>
	);
}
