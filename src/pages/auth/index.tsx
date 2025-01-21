import React, { useEffect, useState } from "react";
import {
	Form,
	Input,
	Button,
	Checkbox,
	Card,
	Image,
	theme,
	Alert,
	Typography,
	Segmented,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {  useLogin } from "./hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "./hooks/useAuthStore";
import { encryptStorage } from "../../libs/encryptStorage";
import { useTranslation } from "react-i18next";
import { useLocaleStore } from "../../hooks/localeStore";
const { Title } = Typography;

const Login: React.FC = () => {
	const { t } = useTranslation(["auth", "validation", "app"]);
	const [errorMsg, setErrorMsg] = useState(false);
	const [mustLogin, setMustLogin] = useState(false);
	const [loadingSave, setLoadingSave] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const { setAdmin, resetAuth } = useAuthStore();
	const params = new URLSearchParams(location.search);
	const login = useLogin(
		()=>{}
	);
	const {
		token: { colorBgLayout },
	} = theme.useToken();
	const languageStore = useLocaleStore();
	const [form] = Form.useForm();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const message = params.get("message");
		if (message == "must_be_logged_in") {
			console.log("Query string message:", message);
			setMustLogin(true);
		}
		document.title = "เข้าสู่ระบบ" + t("app:appTitle");
	}, []);

	const onSubmit = async (values: any) => {
		setLoadingSave(true);
		try {
			const res = await login.mutateAsync({
				email: values.email,
				password: values.password,
			});

			if (res) {
				encryptStorage.setItem("token", res.data.accessToken);
				encryptStorage.setItem("refresh_token", res.data.refreshToken);
				delete res.data.accessToken;
				delete res.data.refreshToken;
				setAdmin(res.data);
				setLoadingSave(false);
				navigate(params.get("redirect") ? String(params.get("redirect")) : "/")
			}
		} catch (error) {
			setLoadingSave(false);
			encryptStorage.removeItem("token");
			encryptStorage.removeItem("refresh_token");
			resetAuth();
			setErrorMsg(true);
		}
	};

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
				<Segmented<string>
					options={[
						{ label: "TH", value: "th" },
						{ label: "EN", value: "en" },
					]}
					value={languageStore.locale}
					onChange={(value) => {
						languageStore.setLocale(value);
					}}
				/>
			</div>
			<Card style={{ width: 450 }} hoverable>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						gap: "10px",
					}}
				>
					<Image src="/assets/logo.png" width={60} alt="logo" preview={false} />
					<Title level={4} className="">
						{t("app:appNameFull")}
					</Title>
				</div>
				{mustLogin && (
					<Alert
						message={t("auth:mustLogin")}
						type="warning"
						showIcon
						closable
						className="mb-4"
					/>
				)}
				{errorMsg && (
					<Alert
						message={t("auth:loginError")}
						description={t("auth:loginWarning")}
						type="error"
						closable
						showIcon
						onClose={() => setErrorMsg(false)}
						className="mb-4"
					/>
				)}

				<Form
					form={form}
					onFinish={onSubmit}
					layout="vertical"
					disabled={loadingSave}
					autoComplete="on"
				>
					<Form.Item
						name="email"
						label={t("auth:schema.email.label") + " : "}
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
					<Form.Item
						name={"password"}
						label={t("auth:schema.password.label") + " : "}
						rules={[
							{
								required: true,
								message: t("validation:required", {
									field: t("auth:schema.password.label"),
								}),
							},
						]}
					>
						<Input.Password
							prefix={<LockOutlined style={{ color: "gray" }} />}
							type="password"
							placeholder={t("validation:placeholder", {
								field: t("auth:schema.password.label"),
							})}
						/>
					</Form.Item>
					<Form.Item>
						<Form.Item name="remember" valuePropName="checked" noStyle>
							<Checkbox>{t("auth:rememberMe")}</Checkbox>
						</Form.Item>
						<Link
							style={{ float: "right", marginTop: "7px" }}
							className="login-form-forgot"
							to={"/resetpassword"}
						>
							{t("auth:forgetPassword")}
						</Link>
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							block
							loading={loadingSave}
						>
							{t("auth:title")}
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default Login;
