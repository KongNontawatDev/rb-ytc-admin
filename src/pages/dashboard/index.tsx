import {
	Card,
	Col,
	Flex,
	Row,
	Statistic,
	theme,
	Tooltip,
	Typography,
} from "antd";
import { useTranslation } from "react-i18next";
import Breadcrumb, {
	BreadcrumbItemType,
} from "../../components/common/Breadcrumb";
import TitleHeader from "../../components/common/TitleHeader";
import {
	BarChartOutlined,
	TeamOutlined,
	AppstoreOutlined,
	InboxOutlined,
	ScheduleOutlined,
} from "@ant-design/icons";
import { useDashboard } from "./hooks/useDashboardQuery";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";
import FullCalendar from "@fullcalendar/react";
import { BookingList } from "../booking_list/types";
import dayGridPlugin from "@fullcalendar/daygrid";
import thLocale from "@fullcalendar/core/locales/th";
import enLocale from "@fullcalendar/core/locales/en-au";
import { useLocaleStore } from "../../hooks/localeStore";
import { useEffect } from "react";
export default function Dashboard() {
	const { t } = useTranslation(["dashboard", "app"]);
	const localeStore = useLocaleStore();
	const { data, isPending } = useDashboard();
	const title = t("dashboard:title");
	const breadcrumbLink: BreadcrumbItemType = [{ title }];
	const { token } = theme.useToken();

	const dashboardItems = [
		{
			key: "booking_list_count",
			title: t("dashboard:schema.booking_list_count.label"),
			icon: ScheduleOutlined,
			suffix: t("dashboard:schema.booking_list_count.display", {
				data: "",
			}).replace("{{data}}", ""),
		},
		{
			key: "room_count",
			title: t("dashboard:schema.room_count.label"),
			icon: AppstoreOutlined,
			suffix: t("dashboard:schema.room_count.display", { data: "" }).replace(
				"{{data}}",
				""
			),
		},
		{
			key: "user_count",
			title: t("dashboard:schema.user_count.label"),
			icon: TeamOutlined,
			suffix: t("dashboard:schema.user_count.display", { data: "" }).replace(
				"{{data}}",
				""
			),
		},
		{
			key: "accessory_count",
			title: t("dashboard:schema.accessory_count.label"),
			icon: InboxOutlined,
			suffix: t("dashboard:schema.accessory_count.display", {
				data: "",
			}).replace("{{data}}", ""),
		},
	];
	const handleEventClick = (clickInfo: any) => {
		alert(
			`Event: ${clickInfo.event.title}\nRoom: ${clickInfo.event.extendedProps.roomName}`
		);
	};

	useEffect(() => {
		document.title = t("dashboard:header") + t("app:appTitle");
	}, []);
	return (
		<>
			<Flex vertical align="start" className="mt-3 lg:mt-5 mb-1">
				<Breadcrumb listItems={breadcrumbLink} />
				<TitleHeader title={title} icon={BarChartOutlined} back={false} />
			</Flex>
			<Row gutter={[15, 15]} className="mt-5">
				{dashboardItems.map((item) => (
					<Col key={item.key} span={24} md={12} lg={6}>
						<Card loading={isPending}>
							<Statistic
								title={item.title}
								value={data?.data?.[item.key] ?? 0}
								prefix={<item.icon />}
								suffix={item.suffix}
							/>
						</Card>
					</Col>
				))}
			</Row>
			<Row gutter={[15, 15]} className="mt-5">
				<Col span={24}>
					<Card loading={isPending}>
						<Typography.Title level={4} className="text-center">
							จำนวนรายการจองแต่ละเดือน
						</Typography.Title>
						<center>
							<LineChart
								width={1000}
								height={300}
								data={data?.data?.bookings_by_month}
								margin={{
									top: 5,
									right: 30,
									left: 20,
									bottom: 5,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month_name" label="เดือน" />
								<YAxis dataKey="count" />
								<Tooltip />
								<Legend
									formatter={(_) => (
										<span style={{ color: "#333", fontSize: "14px" }}>
											{t("dashboard:chart1")}
										</span>
									)}
								/>

								<Line
									type="monotone"
									dataKey="count"
									label="รายการ"
									stroke={token.colorPrimary}
								/>
							</LineChart>
						</center>
					</Card>
				</Col>
			</Row>
			<Row gutter={[15, 15]} className="mt-5">
				<Col span={24}>
					<Card loading={isPending}>
						<FullCalendar
							locale={localeStore.locale == "th" ? thLocale : enLocale}
							plugins={[dayGridPlugin]}
							initialView="dayGridMonth"
							events={data?.data?.booking_list.map((event: BookingList) => ({
								title: `${event.title} (${event.room.name})`,
								start: event.book_start,
								end: event.book_end,
								roomName: event.room.name, // Custom field สำหรับข้อมูลเพิ่มเติม
							}))}
							eventClick={handleEventClick}
							editable={true} // เปิดให้ลากเปลี่ยนเวลาหรือแก้ไข event
							selectable={true}
							selectMirror={true}
							dayMaxEvents={true} // จำกัดจำนวน event ต่อวัน
							eventTimeFormat={{
								hour: "2-digit",
								minute: "2-digit",
								hour12: false, // ปิดรูปแบบ 12 ชั่วโมง
							}}
							slotLabelFormat={{
								hour: "2-digit",
								minute: "2-digit",
								hour12: false, // ปิดรูปแบบ 12 ชั่วโมง
							}}
						/>
					</Card>
				</Col>
			</Row>
		</>
	);
}
