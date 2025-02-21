import React, { useEffect, useState, useCallback } from "react";
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
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useLogin, useValidateTokenWithEmail } from "./hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "./hooks/useAuthStore";
import { encryptStorage } from "../../libs/encryptStorage";
import { useTranslation } from "react-i18next";
import { useLocaleStore } from "../../hooks/localeStore";

const { Title } = Typography;

const LanguageSwitcher: React.FC = () => {
	const languageStore = useLocaleStore();

	return (
		<div className="absolute top-5 right-5">
			<Segmented<string>
				options={[
					{ label: "TH", value: "th" },
					{ label: "EN", value: "en" },
				]}
				value={languageStore.locale}
				onChange={(value) => languageStore.setLocale(value)}
			/>
		</div>
	);
};

const useLoginHandler = () => {
	const navigate = useNavigate();
	const { setAdmin, resetAuth } = useAuthStore();
	const login = useLogin(() => {});
	const validateTokenWithEmail = useValidateTokenWithEmail(() => {});

	const onLoginWithEmail = useCallback(async (token: string) => {
		try {
			const res = await validateTokenWithEmail.mutateAsync(token);
			if (res) {
				encryptStorage.setItem("token", res.data.accessToken);
				encryptStorage.setItem("refresh_token", res.data.refreshToken);
				delete res.data.accessToken;
				delete res.data.refreshToken;
				setAdmin(res.data);
				window.location.href = "/"
				return
			}
		} catch (error) {
			console.error("Email login failed:", error);
		}
	}, [navigate, setAdmin, validateTokenWithEmail]);

	const onSubmit = async (values: { email: string; password: string }) => {
		try {
			const res = await login.mutateAsync(values);
			if (res) {
				encryptStorage.setItem("token", res.data.accessToken);
				encryptStorage.setItem("refresh_token", res.data.refreshToken);
				delete res.data.accessToken;
				delete res.data.refreshToken;
				setAdmin(res.data);
				navigate("/");
			}
		} catch (error: any) {
			console.error("Login failed:", error);
			encryptStorage.removeItem("token");
			encryptStorage.removeItem("refresh_token");
			resetAuth();
			throw error;
		}
	};

	return { onLoginWithEmail, onSubmit };
};

const LoginForm: React.FC<{ onSubmit: (values: any) => void; loading: boolean }> = ({ onSubmit, loading }) => {
	const { t } = useTranslation(["auth", "validation"]);

	const [form] = Form.useForm();

	return (
		<Form form={form} onFinish={onSubmit} layout="vertical" disabled={loading} autoComplete="on">
			<Form.Item
				name="email"
				label={`${t("auth:schema.email.label")} :`}
				rules={[
					{ required: true, message: t("validation:required", { field: t("auth:schema.email.label") }) },
					{ max: 60, message: t("validation:maxLength", { field: t("auth:schema.email.label"), max: 60 }) },
				]}
			>
				<Input type="email" prefix={<UserOutlined style={{ color: "gray" }} />} placeholder={t("validation:placeholder", { field: t("auth:schema.email.label") })} />
			</Form.Item>
			<Form.Item
				name="password"
				label={`${t("auth:schema.password.label")} :`}
				rules={[{ required: true, message: t("validation:required", { field: t("auth:schema.password.label") }) }]}
			>
				<Input.Password prefix={<LockOutlined style={{ color: "gray" }} />} placeholder={t("validation:placeholder", { field: t("auth:schema.password.label") })} />
			</Form.Item>
			<Form.Item>
				<Form.Item name="remember" valuePropName="checked" noStyle>
					<Checkbox>{t("auth:rememberMe")}</Checkbox>
				</Form.Item>
				<Link style={{ float: "right", marginTop: "7px" }} to="/auth/forgot-password">
					{t("auth:forgetPassword")}
				</Link>
			</Form.Item>
			<Form.Item>
				<Button type="primary" htmlType="submit" block loading={loading}>
					{t("auth:title")}
				</Button>
				<Link to={"/auth/login-with-email"}>
				<Button type="text" block className="mt-3" icon={<MailOutlined />}>
					{t("auth:loginWithEmail")}
				</Button>
				</Link>
			</Form.Item>
		</Form>
	);
};

const Login: React.FC = () => {
	const { t } = useTranslation(["auth", "app"]);
	const { onLoginWithEmail, onSubmit } = useLoginHandler();
	const [errorMsg, setErrorMsg] = useState(false);
	const [mustLogin, setMustLogin] = useState(false);
	const [loadingSave, setLoadingSave] = useState(false);
	const location = useLocation();
	const { token: { colorBgLayout } } = theme.useToken();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const message = params.get("message");

		if (message === "must_be_logged_in") {
			setMustLogin(true);
		}

		document.title = `เข้าสู่ระบบ ${t("app:appTitle")}`;

		const token = params.get("token");
		if (token) {
			onLoginWithEmail(token);
		}
	}, [location, onLoginWithEmail, t]);

	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: colorBgLayout }}>
			<LanguageSwitcher />
			<Card style={{ width: 450 }} hoverable>
				<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "10px" }}>
					<Image src="/assets/logo.png" width={60} alt="logo" preview={false} />
					<Title level={4}>{t("app:appNameFull")}</Title>
				</div>
				{mustLogin && <Alert message={t("auth:mustLogin")} type="warning" showIcon closable className="mb-4" />}
				{errorMsg && (
					<Alert message={t("auth:loginError")} description={t("auth:loginWarning")} type="error" closable showIcon onClose={() => setErrorMsg(false)} className="mb-4" />
				)}
				<LoginForm onSubmit={async (values) => {
					setLoadingSave(true);
					try {
						await onSubmit(values);
					} catch {
						setErrorMsg(true);
					} finally {
						setLoadingSave(false);
					}
				}} loading={loadingSave} />
			</Card>
		</div>
	);
};

export default Login;
