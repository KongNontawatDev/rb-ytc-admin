import React, { useState } from "react";
import {
	Form,
	Input,
	Button,
	Card,
	Image,
	theme,
	Alert,
	Typography,
	Segmented,
} from "antd";
import { KeyOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useLoginWithEmail } from "./hooks/useAuth";
import useAuthStore from "./hooks/useAuthStore";
import { encryptStorage } from "../../libs/encryptStorage";
import { useTranslation } from "react-i18next";
import { useLocaleStore } from "../../hooks/localeStore";
import { Link } from "react-router-dom";

const { Title } = Typography;

const LoginWithEmail: React.FC = () => {
	const { t } = useTranslation(["auth", "validation", "app"]);
	const [state, setState] = useState({
		errorMsg: false,
		success: false,
		loading: false,
	});
	const { resetAuth } = useAuthStore();
	const loginWithEmail = useLoginWithEmail(() => {});
	const {
		token: { colorBgLayout },
	} = theme.useToken();
	const languageStore = useLocaleStore();
	const [form] = Form.useForm();

	const onSubmit = async ({ email }: { email: string }) => {
		setState((prev) => ({ ...prev, loading: true }));
		try {
			const res = await loginWithEmail.mutateAsync(email);
			if (res) {
				setState({ errorMsg: false, success: true, loading: false });
			}
		} catch (error: any) {
			setState({
				errorMsg: error.message !== "Network Error",
				success: false,
				loading: false,
			});
			encryptStorage.removeItem("token");
			encryptStorage.removeItem("refresh_token");
			resetAuth();
		}
	};

	return (
		<div
			className="flex justify-center items-center h-screen"
			style={{ backgroundColor: colorBgLayout }}
		>
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
					<Title level={4}>{t("app:appNameFull")}</Title>
				</div>
				{state.errorMsg && (
					<Alert
						message={t("auth:loginError")}
						description={t("auth:loginWarning")}
						type="error"
						closable
						showIcon
						onClose={() => setState((prev) => ({ ...prev, errorMsg: false }))}
						className="mb-4"
					/>
				)}
				{!state.success ? (
					<Form
						form={form}
						onFinish={onSubmit}
						layout="vertical"
						disabled={state.loading}
						autoComplete="on"
					>
						<Form.Item
							name="email"
							label={`${t("auth:schema.email.label")} : `}
							rules={[
								{
									required: true,
									message: t("validation:required", {
										field: t("auth:schema.email.label"),
									}),
								},
								{
									max: 60,
									message: t("validation:maxLength", {
										field: t("auth:schema.email.label"),
										max: 60,
									}),
								},
							]}
						>
							<Input
								type="email"
								prefix={<UserOutlined style={{ color: "gray" }} />}
								placeholder={t("validation:placeholder", {
									field: t("auth:schema.email.label"),
								})}
							/>
						</Form.Item>
						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								block
								loading={state.loading}
							>
								{t("auth:title")}
							</Button>
							<Link to={"/auth/login"}>
								<Button
									type="text"
									block
									className="mt-3"
									icon={<KeyOutlined />}
								>
									{t("auth:backToLoginPassword")}
								</Button>
							</Link>
						</Form.Item>
					</Form>
				) : (
					<div className="mt-4 text-center">
						<p className="text-green-600 font-medium">
							{t("auth:emailSend")} {form.getFieldValue("email")}!
						</p>
						<p className="text-gray-500 text-sm mt-1">
							{t("auth:emailSendDetail", { data: "login" })}
						</p>
						<Button
							type="dashed"
							icon={<MailOutlined />}
							className="mt-4 w-full text-blue-600 border-blue-500"
							onClick={() =>
								window.open("https://mail.google.com/mail", "_blank")
							}
						>
							{t("auth:openEmailInbox")}
						</Button>
					</div>
				)}
			</Card>
		</div>
	);
};

export default LoginWithEmail;
