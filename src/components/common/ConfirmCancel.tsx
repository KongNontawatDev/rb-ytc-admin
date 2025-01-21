import { CloseOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
import { MouseEvent, ReactNode } from "react";
import { useTranslation } from "react-i18next";

type Props = {
	children: ReactNode;
	title: string;
	onConfirm: (e?: MouseEvent<HTMLElement> | undefined) => void;
	disabled?: boolean;
	placement?: TooltipPlacement;
};

export default function PopconfirmCancel({
	children,
	title,
	onConfirm,
	disabled = false,
	placement = "top",
}: Props) {
	const { t } = useTranslation("common");
	return (
		<Popconfirm
			title={t("cancelData.title",{data:title})}
			description={t("cancelData.confirm", { data: title ? title : "" })}
			okText={t("confirm")}
			cancelText={t("cancel")}
			icon={<CloseOutlined style={{ color: "red" }} />}
			onConfirm={onConfirm}
			disabled={disabled}
			placement={placement}
		>
			{children}
		</Popconfirm>
	);
}
