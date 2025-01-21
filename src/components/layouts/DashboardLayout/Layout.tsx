import { useState, useEffect, ReactNode } from "react";
import { Layout, Button, Menu } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MenuItems, rootSubmenuKeys } from "./menu";
import useLayoutStore from "./hooks/useLayoutStore";
import Navbar from "./Navbar";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import ButtonUISetting from "../UISetting/components/ButtonUISetting";
import useUISettingStore from "../UISetting/hooks/useUISettingStore";
import ContainerLayout from "./components/Container";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";

const { Header, Content, Sider } = Layout;

export default function DashboardLayout({ children }: { children: ReactNode }) {
	const { t } = useTranslation("app");
	const location = useLocation();
	const navigate = useNavigate();
	const uiSettingStore = useUISettingStore();
	const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
	const [openKeys, setOpenKeys] = useState<string[]>([]);
	const [isMobile, setIsMobile] = useState(false);

	const { sidebarCollapse, setSidebarCollapse, setSidebarCollapseWidth } =
		useLayoutStore();

	useEffect(() => {
		const currentPath = location.pathname.slice(1);
		setSelectedKeys([currentPath]);

		// Find parent key if current path is a submenu item
		const parentKey = rootSubmenuKeys.find((key) =>
			currentPath.startsWith(key)
		);
		if (parentKey) {
			setOpenKeys([parentKey]);
		}
	}, [location.pathname]);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 1024);
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const handleMenuClick = (e: { key: string }) => {
		if (isMobile) {
			setSidebarCollapse(true);
		}
		setSelectedKeys([e.key]);
		navigate(`/${e.key}`);
	};

	// เพิ่มฟังก์ชันเพื่อกำหนดสีของตัวหนังสือใน submenu
	// Adjust padding for Content and Navbar dynamically
	const getPaddingLeft = () => {
		if (uiSettingStore.layout == "horizontal" || isMobile) return 0;
		return sidebarCollapse ? 60 : 220;
	};

	useEffect(() => {
		document.body.className = uiSettingStore.theme || "light";
	}, [uiSettingStore.theme]);
	return (
		<Layout style={{ minHeight: "100vh" }}>
			{uiSettingStore.layout == "horizontal" && <Navbar />}
			{uiSettingStore.layout == "horizontal" && (
				<Header style={{ padding: 0 }}>
					{uiSettingStore.layout !== "horizontal" && (
						<img
							src="/assets/logo.png"
							alt="logo"
							width={50}
							style={{ marginRight: "16px" }}
						/>
					)}
					<Menu
						mode="horizontal"
						theme={uiSettingStore.sidebarColor}
						items={MenuItems()}
						selectedKeys={selectedKeys}
						openKeys={openKeys}
						onOpenChange={setOpenKeys}
						onClick={handleMenuClick}
					/>
				</Header>
			)}
			{uiSettingStore.layout == "vertical" && (
				<Sider
					theme={uiSettingStore.sidebarColor}
					collapsible
					collapsed={sidebarCollapse}
					onCollapse={(collapsed) => setSidebarCollapse(collapsed)}
					width={isMobile ? "100%" : 220}
					collapsedWidth={isMobile ? 0 : 60}
					breakpoint="lg"
					style={{
						position: "fixed",
						height: "100vh",
						zIndex: 1000,
						left: 0,
					}}
				>
					<div className="flex justify-between lg:justify-center items-center">
						<Link to={"/"} className="flex items-center lg:flex-col">
							<img
								className="p-1 mt-0 lg:mt-2"
								src="/assets/logo.png"
								alt="logo"
								width={sidebarCollapse ? 30 : 50}
							/>
							{!sidebarCollapse && (
								<Title level={5} style={{ margin: 5 }}>
									{t("appName")}
								</Title>
							)}
						</Link>
						{isMobile && (
							<Button
								type="text"
								icon={
									sidebarCollapse ? (
										<MenuUnfoldOutlined />
									) : (
										<MenuFoldOutlined />
									)
								}
								onClick={() => {
									setSidebarCollapse(!sidebarCollapse);
									setSidebarCollapseWidth(1);
								}}
								style={{
									fontSize: "16px",
									width: 64,
									height: 64,
								}}
							/>
						)}
					</div>
					<Menu
						mode="inline"
						theme={uiSettingStore.sidebarColor}
						items={MenuItems()}
						selectedKeys={selectedKeys}
						openKeys={openKeys}
						onOpenChange={setOpenKeys}
						onClick={handleMenuClick}
					/>
				</Sider>
			)}
			<Layout
				style={{
					paddingLeft: getPaddingLeft(),
					transition: "padding-left 0.2s",
				}}
			>
				{uiSettingStore.layout == "vertical" && <Navbar />}
				<Content className="light:bg-[#f8f8f8] pb-5 lg:pb-10">
					<ContainerLayout>{children}</ContainerLayout>
					<ButtonUISetting />
					<p className="text-center mt-5 lg:mt-10 text-gray-500">
						Created By{" "}
						<a
							href="http://nakdev-studio.com/"
							target="_blank"
							className="text-blue-700 underline"
						>
							Nakdev Studio
						</a>
					</p>
				</Content>
			</Layout>
		</Layout>
	);
}
