import { Modal, Tooltip } from "antd";
import { ExclamationCircleOutlined, KeyOutlined } from "@ant-design/icons";
import ChangePasswordForm from "../../auth/components/ChangePasswordForm";
import { useTranslation } from "react-i18next";

interface AdminModalChangePasswordProps {
	id?: number | null;
	open: boolean;
	onClose: () => void;
}

export default function AdminModalChangePassword({
	id,
	open,
	onClose,
}: AdminModalChangePasswordProps) {
	const {t} = useTranslation("auth")

	return (
		<Modal
			open={open}
			title={
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<KeyOutlined/>
					<span>{t("changePassword")}</span>
					<Tooltip title={t("changePasswordRole")}>
						<ExclamationCircleOutlined className="text-gray-600"/>
					</Tooltip>
				</div>
			}
			onCancel={onClose}
			destroyOnClose
			footer={false}
		>
			<ChangePasswordForm
				id={id}
				onCancel={onClose}
				onSuccess={onClose}
			/>
		</Modal>
	);
}
