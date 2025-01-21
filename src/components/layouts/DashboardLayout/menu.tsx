import {
	BoxPlotOutlined,
	DashboardOutlined,
	DropboxOutlined,
	InboxOutlined,
	UnorderedListOutlined,
	UsergroupAddOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Badge, MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import { useBookingListCount } from "../../../pages/booking_list/hooks/useBookingListQuery";

export const rootSubmenuKeys = ["setting"];

// export const ROOT_SUBMENU_KEYS = ["dashboard", "users", "settings"];

export const MenuItems = () => {
	const { t } = useTranslation("menu");
	const {data} = useBookingListCount()

	const menuItems: MenuProps["items"] = [
		{
			key: "dashboard",
			icon: <DashboardOutlined />,
			label: t("dashboard"),
		},
		{
			key: "booking_list",
			icon: <UnorderedListOutlined />,
			label: (
				<Badge count={data?.data||0} offset={[15, 6]}>
					{t("booking_list")}
				</Badge>
			),
		},
		{
			key: "room",
			icon: <InboxOutlined />,
			label: t("room"),
		},
		{
			key: "accessory",
			icon: <DropboxOutlined />,
			label: t("accessory"),
		},
		{
			key: "department",
			icon: <BoxPlotOutlined />,
			label: t("department"),
		},
		{
			key: "user",
			icon: <UserOutlined />,
			label: t("user"),
		},
		{
			key: "admin",
			icon: <UsergroupAddOutlined />,
			label: t("admin"),
		},

		// {
		// 	key: "setting",
		// 	icon: <SettingOutlined />,
		// 	label: t("setting._"),
		// 	children: [
		// 		{
		// 			key: "setting/profile",
		// 			label: t("setting.profile"),
		// 		},
		// 		{
		// 			key: "setting/test",
		// 			label: t("setting.test"),
		// 		},
		// 	],
		// },
	];

	return menuItems;
};
