import React, { useState } from "react";
import {
	Form,
	Input,
	Card,
	Image,
	theme,
	Alert,
	Typography,
	Segmented,
	Steps,
} from "antd";
import { useResetPassword } from "./hooks/useAuth";
import { useTranslation } from "react-i18next";
import { useLocaleStore } from "../../hooks/localeStore";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonSave from "../../components/common/ButtonSave";
import ButtonBack from "../../components/common/ButtonBack";

const { Title } = Typography;

type FormType = {
	newPassword: string;
	confirmNewPassword: string;
};

const passwordRules = (t: any) => [
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
		pattern: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#_$%^&.*])(?=.{8,})/,
		message: t("validation:password.pattern"),
	},
];

const validateConfirmPassword = (t: any) => ({
	validator(_: any, value: string, { getFieldValue }: any) {
		if (!value || getFieldValue("newPassword") === value) {
			return Promise.resolve();
		}
		return Promise.reject(new Error(t("validation:password.mismatch")));
	},
});

const ResetPassword: React.FC = () => {
	const { t } = useTranslation(["auth", "validation", "app", "common", "admin"]);
	const navigate = useNavigate();
	const location = useLocation();
	const languageStore = useLocaleStore();
	const resetPassword = useResetPassword(() => navigate("/"));
	const [form] = Form.useForm();
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const { token: { colorBgLayout } } = theme.useToken();

	const onSubmitResetPassword = async (values: FormType) => {
		const token = new URLSearchParams(location.search).get("token");
		if (!token) return setErrorMsg(t("auth:noTokenProvided"));

		try {
			await resetPassword.mutateAsync({ newPassword: values.newPassword, token });
		} catch (error: any) {
			setErrorMsg(error.response?.data?.message || t("auth:changePasswordFail"));
		}
	};

	return (
		<div className="flex items-center justify-center h-screen" style={{ backgroundColor: colorBgLayout }}>
			<div className="absolute top-5 right-5">
				<Segmented<string>
					options={[
						{ label: "TH", value: "th" },
						{ label: "EN", value: "en" },
					]}
					value={languageStore.locale}
					onChange={languageStore.setLocale}
				/>
			</div>
			<Card style={{ width: 450 }} hoverable>
				<div className="flex flex-col items-center gap-2">
					<Image src="/assets/logo.png" width={60} alt="logo" preview={false} />
					<Title level={4} className="m-0">{t("app:appNameFull")}</Title>
					<Title level={5} className="font-normal m-0">{t("auth:changePassword")}</Title>
				</div>

				<Steps size="small" current={1} className="my-5" items={[
					{ title: t("auth:confirmEmail") },
					{ title: t("auth:changePassword") },
				]} />

				{errorMsg && (
					<Alert
						message={t("auth:changePasswordFail")}
						description={errorMsg}
						type="error"
						closable
						showIcon
						className="mb-4"
						onClose={() => setErrorMsg(null)}
					/>
				)}

				<Form form={form} layout="vertical" onFinish={onSubmitResetPassword} className="mt-4">
					<Form.Item
						label={t("auth:newPassword")}
						name="newPassword"
						rules={passwordRules(t)}
						tooltip={t("validation:password.requirements")}
					>
						<Input.Password
							allowClear
							placeholder={t("validation:placeholder", { field: t("auth:newPassword") })}
						/>
					</Form.Item>

					<Form.Item
						label={t("auth:confirmNewPassword")}
						name="confirmNewPassword"
						dependencies={["newPassword"]}
						rules={[...passwordRules(t), validateConfirmPassword(t)]}
						tooltip={t("validation:password.requirements")}
					>
						<Input.Password
							allowClear
							placeholder={t("validation:placeholder", { field: t("auth:confirmNewPassword") })}
						/>
					</Form.Item>

					<Form.Item>
						<ButtonSave type="primary" title={t("common:save", { data: t("common:data") })} block />
						<ButtonBack
							block
							onClick={() => navigate('/auth/forgot-password')}
							title={t("common:back")}
							className="mt-4"
						/>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default ResetPassword;
