import {
	ManOutlined,
	WomanOutlined,
	QuestionOutlined,
	CheckOutlined,
	WarningOutlined,
	StopOutlined,
	ExclamationCircleOutlined,
} from "@ant-design/icons";
import i18next from "i18next";

export const publishList: {
	color: "success" | "processing" | "error" | "default" | "warning" | undefined;
	label: string;
	value: number;
}[] = [
	{
		value: 1,
		color: "success",
		label: i18next.t(""),
	},
	{
		value: 2,
		color: "error",
		label: "ปิดเผยแพร่",
	},
	{
		value: 3,
		color: "default",
		label: "ดราฟ",
	},
];
export const publish = (
	value: number | string
): {
	color: "success" | "processing" | "error" | "default" | "warning" | undefined;
	label: string;
	value: number | string;
} => {
	return (
		publishList.find((item) => item.value == value) || {
			value,
			color: "default",
			label: "ดราฟ",
		}
	);
};
export const activeList: {
	color: "success" | "processing" | "error" | "default" | "warning" | undefined;
	label: string;
	value: number;
	text: string;
}[] = [
	{
		value: 1,
		color: "success",
		label: i18next.t("status:active.enabled"), // แปลจากไฟล์ JSON ที่ตั้งไว้
		text: i18next.t("status:active.enabled"), // แปลจากไฟล์ JSON ที่ตั้งไว้
	},
	{
		value: 2,
		color: "error",
		label: i18next.t("status:active.disabled"), // แปลจากไฟล์ JSON ที่ตั้งไว้
		text: i18next.t("status:active.disabled"), // แปลจากไฟล์ JSON ที่ตั้งไว้
	},
];

export const active = (
	value: number | string
): {
	color: "success" | "processing" | "error" | "default" | "warning" | undefined;
	label: string;
	value: number | string;
} => {
	return (
		activeList.find((item) => item.value == value) || {
			value,
			color: "default",
			label: "ดราฟ",
		}
	);
};
export const genderList = [
	{
		color: "blue",
		label: "ชาย",
		icon: ManOutlined,
	},
	{
		color: "magenta",
		label: "หญิง",
		icon: WomanOutlined,
	},
	{
		color: "#F5F5F5",
		label: "ไม่ระบุ",
		icon: QuestionOutlined,
	},
];
export const genderStatus = (
	value: string
): { color: string; label: string; icon: any } => {
	return (
		genderList.find((item) => item.label == value) || {
			color: "#969696",
			label: "ไม่รู้จัก",
			icon: ExclamationCircleOutlined,
		}
	);
};

export const userStatusList = [
	{
		value: 1,
		color: "#28C76F",
		label: "ใช้งานอยู่",
		icon: CheckOutlined,
	},
	{
		value: 2,
		color: "#FF9F43",
		label: "ไม่ได้ใช้งานแล้ว",
		icon: WarningOutlined,
	},
	{
		value: 3,
		color: "#EC1B2E",
		label: "บล็อค",
		icon: StopOutlined,
	},
];
export const userStatus = (
	value: number
): { color: string; label: string; icon: any } => {
	return (
		userStatusList.find((item) => item.value == value) || {
			color: "#969696",
			label: "ไม่รู้จัก",
			icon: ExclamationCircleOutlined,
		}
	);
};
