import {
	Button,
	Dropdown,
	Flex,
	Grid,
	Image,
	Layout,
	Segmented,
	Space,
	theme,
} from "antd";
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	LogoutOutlined,
	KeyOutlined,
	ProfileOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useLayoutStore from "./hooks/useLayoutStore";
import useUISettingStore from "../UISetting/hooks/useUISettingStore";
import { useLocaleStore } from "../../../hooks/localeStore";
import { MenuProps } from "antd/lib";
import useAuthStore from "../../../pages/auth/hooks/useAuthStore";
import { encryptStorage } from "../../../libs/encryptStorage";
import { fallbackImage } from "../../../utils/file";
import { Typography } from 'antd';
import { getImage } from "../../../hooks/getImage";
import AdminModalChangePassword from "../../../pages/admin/components/AdminModalChangePassword";
import { useState } from "react";
import AdminModal from "../../../pages/admin/components/AdminModal";
import { useTranslation } from "react-i18next";

const { Header } = Layout;
const { useBreakpoint } = Grid;

export default function Navbar() {
	const {t} = useTranslation(["app","menu"])
	const uiSettingStore = useUISettingStore();
	const authStore = useAuthStore();
	const languageStore = useLocaleStore();
	const navigate = useNavigate();
	const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
	const [isOpenProfile, setIsOpenProfile] = useState(false);
	const screens = useBreakpoint();
	const isMobile = screens.sm;
	const {
		token: { colorBgContainer },
	} = theme.useToken();
	const { setSidebarCollapse, setSidebarCollapseWidth, sidebarCollapse } =
		useLayoutStore();

	const logout = () => {
		authStore.resetAuth();
		encryptStorage.removeItem("token");
		encryptStorage.removeItem("refresh_token");
		navigate("/");
	};

	const profile_menu: MenuProps["items"] = [
				{
			key: "2",
			icon: <ProfileOutlined />,
			label: t("menu:profile"),
			onClick:()=>setIsOpenProfile(true)
		},
		{
			key: "3",
			icon: <KeyOutlined />,
			label: t("menu:changePassword"),
			onClick:()=>setIsOpenChangePassword(true)
		},
		{
			key: "4",
			danger: true,
			icon: <LogoutOutlined />,
			label: t("menu:logout"),
			onClick:()=>logout()
		},
	];

	return (
		<>
		<AdminModalChangePassword
				id={authStore?.admin?.id}
				onClose={()=>setIsOpenChangePassword(false)}
				open={isOpenChangePassword}
			/>
			 <AdminModal
        open={isOpenProfile}
        onClose={() => {
          setIsOpenProfile(false);
        }}
        id={authStore?.admin?.id}
        initialMode={"view"}
      />
			<Header
				style={{
					padding: 0,
					background: colorBgContainer,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					paddingRight: "1rem",
					height: 55,
				}}
			>
				<Space>
					{uiSettingStore.layout == "horizontal" ? (
						<Flex justify="center" align="center" gap={5} style={{ paddingLeft: "1rem" }} >
							<Image
								src="/assets/logo.png"
								alt="logo"
								width={30}
								preview={false}
								style={{ marginRight: "16px" }}
							/>
							<h3 style={{ margin: 0 }} className="text-base lg:text-lg font-medium">
							{t("app:appName")}
							</h3>
						</Flex>
					) : (
						<Button
							type="text"
							icon={
								sidebarCollapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
							}
							onClick={() => {
								setSidebarCollapse(!sidebarCollapse);
								setSidebarCollapseWidth(1);
							}}
							style={{
								fontSize: "16px",
								width: 55,
								height: 55,
							}}
						/>
					)}
				</Space>

				<Space align="center" wrap>
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
					<Button
						size="small"
						type="text"
						onClick={() => navigate("/changelog")}
						style={{ display: isMobile ? "flex" : "none" }}
					>
						v. 1
					</Button>
					<Dropdown menu={{ items: profile_menu }}>
						<Flex align="center" gap={5}>
							<Image
								preview={false}
								src={getImage(authStore.admin?.image!,"admin")}
								style={{
									width: "40px",
									height: "40px",
									objectFit: "cover",
									borderRadius: "50px",
									border: "1px solid #BFBFBF",
								}}
								fallback={fallbackImage}
							/>
							<Typography.Text style={{ display: isMobile ? "flex" : "none" }}>
								{authStore.admin?.name}
							</Typography.Text>
						</Flex>
					</Dropdown>
					{/* <Tooltip title={themeMode == "dark" ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}>
            <Button type={"text"} size="large" icon={themeMode == "dark" ? <SunOutlined /> : <MoonOutlined />} onClick={switchThemeMode}  style={{display: isMobile ? "flex" : "none"}}/>
          </Tooltip> */}
				</Space>
			</Header>
			{/* <AdminModalForm rowId={admin?.id!} onCancel={() => setOpenModalProfile(false)} open={openModalProfile} failDoesNotExists={() => {}} /> */}
		</>
	);
}
