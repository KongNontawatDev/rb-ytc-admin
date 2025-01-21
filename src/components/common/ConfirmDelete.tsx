import { DeleteOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
import  { ReactNode } from "react";
import { useTranslation } from "react-i18next";

type Props = {
	children: ReactNode;
	title: string;
	onConfirm?: (() => void) | (() => Promise<void>);
	disabled?:boolean
	placement?:TooltipPlacement
};

export default function PopconfirmDelete({ children, title,onConfirm,disabled=false,placement="top" }: Props) {
	const {t} = useTranslation("common")
	return (
		<Popconfirm
			title={t("deleteData.title",{data:title})}
			description={t("deleteData.confirm",{data:title?title:""})}
			okText={t("confirm")}
			cancelText={t("cancel")}
			icon={<DeleteOutlined style={{ color: "red" }} />}
      onConfirm={onConfirm}
			placement={placement}
			disabled={disabled}
		>
			{children}
		</Popconfirm>
	);
}
