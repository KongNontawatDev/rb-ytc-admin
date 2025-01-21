import RoomForm from "./RoomForm";
import { Modal, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { FormMode } from "../../../types/formType";
import ButtonEdit from "../../../components/common/ButtonEdit";
import { getModalIcon, getModalTitle } from "../../../utils/utilsComponent";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface RoomModalProps {
	id?: number | null;
	initialMode: FormMode;
	open: boolean;
	onClose: () => void;
}

export default function RoomModal({
	id,
	initialMode,
	open,
	onClose,
}: RoomModalProps) {
	const [mode, setMode] = useState<FormMode>(initialMode);
	const {t} = useTranslation("room")
	// Reset mode when modal opens/closes or initialMode changes
	useEffect(() => {
		setMode(initialMode);
	}, [initialMode, open]);

	

	// Add extra buttons to modal header when in view mode
	const getExtraButtons = () => {
		if (mode === "view") {
			return [
				<ButtonEdit onClick={() => setMode("edit")} key="edit-button" size="small"/>,
			];
		}
		return null;
	};

	return (
		<Modal
			open={open}
			title={
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					{getModalIcon(mode)}
					<span>{getModalTitle(mode,t("title"))}</span>
					<Tooltip title={"เครื่องหมาย * คือ จำเป็นต้องกรอกข้อมูลช่องนี้"}>
						<ExclamationCircleOutlined className="text-gray-600"/>
					</Tooltip>
					{getExtraButtons()}
				</div>
			}
			onCancel={onClose}
			destroyOnClose
			footer={false}
			width={"40rem"}
		>
			<RoomForm
				id={id}
				mode={mode}
				onCancel={onClose}
				onSuccess={onClose}
			/>
		</Modal>
	);
}
