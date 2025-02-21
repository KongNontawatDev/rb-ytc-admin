import React, { useState } from "react";
import {
	Form,
	Input,
	Button,
	Card,
	Image,
	Alert,
	Typography,
	Segmented,
	Steps,
	theme,
} from "antd";
import {
	ArrowLeftOutlined,
	MailOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { useForgetPassword } from "./hooks/useAuth";
import useAuthStore from "./hooks/useAuthStore";
import { encryptStorage } from "../../libs/encryptStorage";
import { useTranslation } from "react-i18next";
import { useLocaleStore } from "../../hooks/localeStore";
import { Link } from "react-router-dom";

const { Title } = Typography;

const ForgotPassword: React.FC = () => {
	const {
		token: { colorBgLayout },
	} = theme.useToken();
	const { t } = useTranslation(["auth", "validation", "app"]);
	const [form] = Form.useForm();
	const [errorMsg, setErrorMsg] = useState(false);
	const [successState, setSuccessState] = useState(false);
	const [loading, setLoading] = useState(false);
	const { resetAuth } = useAuthStore();
	const forgotPassword = useForgetPassword(() => {});
	const languageStore = useLocaleStore();

	const handleSubmit = async ({ email }: { email: string }) => {
		setLoading(true);
		try {
			const response = await forgotPassword.mutateAsync(email);
			if (response) {
				setErrorMsg(false);
				setSuccessState(true);
			}
		} catch (error: any) {
			setErrorMsg(error.message !== "Network Error");
			encryptStorage.removeItem("token");
			encryptStorage.removeItem("refresh_token");
			resetAuth();
		} finally {
			setLoading(false);
		}
	};

	const openEmailProvider = () =>
		window.open("https://mail.google.com/mail", "_blank");

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				backgroundColor: colorBgLayout,
			}}
		>
			<div className="absolute top-5 right-5">
				<Segmented
					options={[
						{ label: "TH", value: "th" },
						{ label: "EN", value: "en" },
					]}
					value={languageStore.locale}
					onChange={languageStore.setLocale}
				/>
			</div>
			<Card className="w-[450px] shadow-lg" hoverable>
				<div className="flex flex-col items-center gap-2">
					<Image src="/assets/logo.png" width={60} alt="logo" preview={false} />
					<Title level={4}>{t("app:appNameFull")}</Title>
					<Title level={5} className="font-normal m-0">
						{t("auth:requestChnagePassword")}
					</Title>
				</div>

				<Steps
					className="my-5"
					size="small"
					current={0}
					items={[
						{ title: t("auth:confirmEmail") },
						{ title: t("auth:changePassword") },
					]}
				/>

				{errorMsg && (
					<Alert
						message={t("auth:changePasswordFail")}
						description={t("auth:changePasswordFailDetail")}
						type="error"
						closable
						showIcon
						onClose={() => setErrorMsg(false)}
						className="mb-4"
					/>
				)}

				{!successState ? (
					<>
						<Form
							form={form}
							onFinish={handleSubmit}
							layout="vertical"
							disabled={loading}
							autoComplete="on"
						>
							<Form.Item
								name="email"
								label={`${t("auth:schema.email.label")} :`}
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
								extra={<small>{t("auth:schema.email.detail")}</small>}
							>
								<Input
									type="email"
									prefix={<UserOutlined className="text-gray-500" />}
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
									loading={loading}
								>
									{t("auth:requestChnagePassword")}
								</Button>
								<Link to="/auth/login">
									<Button
										type="text"
										block
										className="mt-3"
										icon={<ArrowLeftOutlined />}
									>
										{t("auth:backToLogin")}
									</Button>
								</Link>
							</Form.Item>
						</Form>
					</>
				) : (
					<div className="mt-4">
						<p className="text-green-600 font-medium">
							{t("auth:emailSend")} {form.getFieldValue("email")}!
						</p>
						<p className="text-gray-500 text-sm mt-1">
							{t("auth:emailSendDetail", { data: "password change request" })}
						</p>
						<Button
							type="dashed"
							icon={<MailOutlined />}
							className="mt-4 w-full text-blue-600 border-blue-500"
							onClick={openEmailProvider}
						>
							{t("auth:openEmailInbox")}
						</Button>
					</div>
				)}
			</Card>
		</div>
	);
};

export default ForgotPassword;
