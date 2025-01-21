import { UndoOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Radio, Tooltip } from "antd";
import useUISettingStore from "../hooks/useUISettingStore";
import useLayoutStore from "../../DashboardLayout/hooks/useLayoutStore";

type Props = {
	open: boolean;
	onClose: () => void;
};

export default function DrawerUISetting({ open, onClose }: Props) {
	const uiSettingStore = useUISettingStore();
	const layoutStore = useLayoutStore();
	return (
		<Drawer
			title="Setting UI"
			onClose={onClose}
			open={open}
			extra={
				<Tooltip title="คืนค่าเริ่มต้น">
					<Button type="text" icon={<UndoOutlined />} onClick={uiSettingStore.reset}/>
				</Tooltip>
			}
		>
			<Form.Item label="Theme">
				<Radio.Group
					options={[
						{ label: "Dark", value: "dark" },
						{ label: "Light", value: "light" },
					]}
					onChange={(e) => uiSettingStore.setTheme(e.target.value)}
					value={uiSettingStore.theme}
					optionType="button"
				/>
			</Form.Item>
			<Form.Item label="Layout">
				<Radio.Group
					options={[
						{ label: "Vertical", value: "vertical" },
						{ label: "Horizontal", value: "horizontal" },
					]}
					onChange={(e) => uiSettingStore.setLayout(e.target.value)}
					value={uiSettingStore.layout}
					optionType="button"
				/>
			</Form.Item>
      <Form.Item label="Sidebar Color">
				<Radio.Group
					options={[
						{ label: "Integrate", value: "light" },
						{ label: "Apparent", value: "dark" },
					]}
					onChange={(e) => uiSettingStore.setSidebarColor(e.target.value)}
					value={uiSettingStore.sidebarColor}
					optionType="button"
				/>
			</Form.Item>
      <Form.Item label="Content">
				<Radio.Group
					options={[
						{ label: "Full", value: "full" },
						{ label: "Centered", value: "centered" },
					]}
					onChange={(e) => uiSettingStore.setContent(e.target.value)}
					value={uiSettingStore.content}
					optionType="button"
				/>
			</Form.Item>
      <Form.Item label="Primary Color">
        <Radio.Group
					options={[
            { label: "สีน้ำเงิน", value: "#007bff" },
            { label: "สีแดง", value: "#FF0000" },
            { label: "สีเขียว", value: "#008000" },
            { label: "สีเหลือง", value: "#FFFF00" },
            { label: "สีม่วง", value: "#800080" }
          ]}
					onChange={(e) => uiSettingStore.setPrimaryColor(e.target.value)}
					value={uiSettingStore.primaryColor}
					optionType="button"
				/>
				
			</Form.Item>
			 <Form.Item label="Sidebar Collapse">
				<Radio.Group
					options={[
						{ label: "Full", value: false },
						{ label: "Compact", value: true },
					]}
					onChange={(e) => {
						layoutStore.setSidebarCollapse(e.target.value ? true : false);
						layoutStore.setSidebarCollapseWidth(e.target.value ? 80 : 220);
					}}
					value={layoutStore.sidebarCollapse}
					optionType="button"
				/>
			</Form.Item>
		</Drawer>
	);
}
