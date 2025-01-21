import {
	Button,
	Grid,
	Image,
	Layout,
	Segmented,
	Space,
	theme,
	Tooltip,
} from "antd";
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	HistoryOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useLayoutStore from "./hooks/useLayoutStore";
import useUISettingStore from "../UISetting/hooks/useUISettingStore";
import Title from "antd/es/typography/Title";
import { useLocaleStore } from "../../../hooks/localeStore";

const { Header } = Layout;
const { useBreakpoint } = Grid;

export default function Navbar() {
	const uiSettingStore = useUISettingStore();
	const languageStore = useLocaleStore();
	const navigate = useNavigate();
	// const [openModalAdmin, setOpenModalAdmin] = useState(false)
	const screens = useBreakpoint();
	const isMobile = screens.sm;
	const {
		token: { colorBgContainer },
	} = theme.useToken();
	const { setSidebarCollapse, setSidebarCollapseWidth, sidebarCollapse } =
		useLayoutStore();

	return (
		<>
			<Header
				style={{
					padding: 0,
					background: colorBgContainer,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					paddingRight: "1rem",
					height:55
				}}
			>
				<Space>
					{uiSettingStore.layout == "horizontal" ? (
						<Space style={{paddingLeft:"1rem"}}>
							<Image
								src="/assets/logo.png"
								alt="logo"
								width={50}
								preview={false}
								style={{ marginRight: "16px" }}
							/>
							<Title level={4} style={{margin:0}} >ทดสอบระบบ</Title>
						</Space>
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
					<Tooltip
						title="กิจกรรมแอดมิน"
						style={{ display: isMobile ? "flex" : "none" }}
					>
						<Button
							type="text"
							onClick={() => navigate("/log")}
							icon={<HistoryOutlined />}
							style={{ display: isMobile ? "flex" : "none" }}
						/>
					</Tooltip>
					{/* <Tooltip title={themeMode == "dark" ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}>
            <Button type={"text"} size="large" icon={themeMode == "dark" ? <SunOutlined /> : <MoonOutlined />} onClick={switchThemeMode}  style={{display: isMobile ? "flex" : "none"}}/>
          </Tooltip> */}
				</Space>
			</Header>
			{/* <AdminModalForm rowId={admin?.id!} onCancel={() => setOpenModalProfile(false)} open={openModalProfile} failDoesNotExists={() => {}} /> */}
		</>
	);
}
