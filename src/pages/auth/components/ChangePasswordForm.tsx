import { useState } from "react";
import { Flex, Form, Input } from "antd";
import { useTranslation } from "react-i18next";

import ButtonSave from "../../../components/common/ButtonSave";
import AlertSubmitFail from "../../../components/common/AlertSubmitFail";
import { useChangePassword } from "../hooks/useAuth";
import { FormConfirmPasswordType } from "../types";
import ButtonCancel from "../../../components/common/ButtonCancel";

interface ChangePasswordFormProps {
	id?: number | null;
	onCancel: () => void;
	onSuccess: () => void;
}
type FormType = {
	newPassword: string;
	currentPassword: string;
	confirmNewPassword: string;
};
type FieldType = Partial<FormType>;

export default function ChangePasswordForm({
	id,
	onCancel,
	onSuccess,
}: ChangePasswordFormProps) {
	const { t } = useTranslation(["common", "validation", "admin", "role","auth"]);
	const [form] = Form.useForm<FormType>();
	const [isSaving, setIsSaving] = useState(false);
	const [errorSubmit, setErrorSubmit] = useState<string>();
	const changePassword = useChangePassword(onSuccess);

	const handleSubmit = async (values: FormType) => {
		try {
			setIsSaving(true);

			const formData: FormConfirmPasswordType = {
				id: Number(id),
				newPassword: values.newPassword,
				currentPassword: values.currentPassword,
			};
			// mutetate
			await changePassword.mutateAsync(formData);
		} catch (error: any) {
			if (error.status === 400) {
				setErrorSubmit(error.response?.data?.message);
			}
			console.error("Failed to save admin:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const passwordRules = [
		{
			required: true,
			message: t("validation:required", {
				field: t("admin:schema.password.label"),
			}),
		},
		{
			min: 8,
			message: t("validation:minLength", {
				field: t("admin:schema.password.label"),
				min: 8,
			}),
		},
		{
			max: 20,
			message: t("validation:maxLength", {
				field: t("admin:schema.password.label"),
				max: 20,
			}),
		},
		{
			pattern: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#_$%^&*])(?=.{8,})/,
			message: t("validation:password.pattern"),
		},
	];

	return (
		<>
			{errorSubmit && (
				<AlertSubmitFail
					message={t("common:createData.error")}
					description={errorSubmit}
				/>
			)}
			<Form
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
				className="mt-4"
			>
				<Form.Item<FieldType>
					label={t("auth:currentPassword")}
					name="currentPassword"
					rules={passwordRules}
					tooltip={t("validation:password.requirements")}
				>
					<Input.Password
						allowClear
						placeholder={t("validation:placeholder", {
							field: t("auth:currentPassword"),
						})}
					/>
				</Form.Item>
				<Form.Item<FieldType>
					label={t("auth:newPassword")}
					name="newPassword"
					rules={passwordRules}
					tooltip={t("validation:password.requirements")}
				>
					<Input.Password
						allowClear
						placeholder={t("validation:placeholder", {
							field: t("auth:newPassword"),
						})}
					/>
				</Form.Item>

				<Form.Item<FieldType>
					label={t("auth:confirmNewPassword")}
					name="confirmNewPassword"
					dependencies={["newPassword"]}
					rules={[
						...passwordRules, // รวมกฎเดิม
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue("newPassword") === value) {
									return Promise.resolve();
								}
								return Promise.reject(
									new Error(t("validation:password.mismatch"))
								);
							},
						}),
					]}
					tooltip={t("validation:password.requirements")}
				>
					<Input.Password
						allowClear
						placeholder={t("validation:placeholder", {
							field: t("auth:confirmNewPassword"),
						})}
					/>
				</Form.Item>

				<Flex justify="space-between" align="center" gap={5} className="mt-4">
					<ButtonCancel onClick={onCancel} title={t("common:cancel")}/>
					<ButtonSave
						type="primary"
						loading={isSaving}
						title={t("common:save", { data: t("common:data") })}
					/>
				</Flex>
			</Form>
		</>
	);
}
