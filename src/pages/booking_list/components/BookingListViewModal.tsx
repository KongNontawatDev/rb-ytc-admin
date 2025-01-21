import {
	Descriptions,
	DescriptionsProps,
	Flex,
	Modal,
} from "antd";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useBookingListById } from "../hooks/useBookingListQuery";
import EmptyData from "../../../components/common/EmptyData";
import { BookingList } from "../types";
import { UnorderedListOutlined } from "@ant-design/icons";
import ButtonCancel from "../../../components/common/ButtonCancel";
import { toDateTime } from "../../../utils/dateFunction";
import BadgeStatus from "./BadgeStatus";

interface BookingListViewModalProps {
	id?: number | null;
	open: boolean;
	onClose: () => void;
}

export default function BookingListViewModal({
	id,
	open,
	onClose,
}: BookingListViewModalProps) {
	const { t } = useTranslation(["booking_list", "common","room"]);
	const { data, isPending } = useBookingListById(id);
	const [booking_list, setBookingList] = useState<BookingList>();

	useEffect(() => {
		if (data && !isPending) {
			setBookingList(data?.data);
		}
	}, [id, data, isPending]);

	const items: DescriptionsProps["items"] = [
		{
			key: t("booking_list:schema.booking_number.label"),
			label: t("booking_list:schema.booking_number.label"),
			children: booking_list?.booking_number,
			span: 3,
		},
		{
			key: t("room:title"),
			label: t("room:title"),
			children: booking_list?.room.name,
			span: 3,
		},
		{
			key: t("booking_list:schema.title.label"),
			label: t("booking_list:schema.title.label"),
			children: booking_list?.title,
			span: 3,
		},
		{
			key: t("booking_list:schema.detail.label"),
			label: t("booking_list:schema.detail.label"),
			children: booking_list?.detail ? booking_list?.detail : "-",
			span: 3,
		},

		{
			key: t("booking_list:schema.user_name.label"),
			label: t("booking_list:schema.user_name.label"),
			children: booking_list?.user_name,
			span: 3,
		},
		{
			key: t("booking_list:schema.tel.label"),
			label: t("booking_list:schema.tel.label"),
			children: booking_list?.tel,
			span: 3,
		},

		{
			key: t("booking_list:schema.department.label"),
			label: t("booking_list:schema.department.label"),
			children: booking_list?.department.name,
			span: 3,
		},
		{
			key: t("booking_list:schema.status.label"),
			label: t("booking_list:schema.status.label"),
			children: <BadgeStatus value={String(booking_list?.status)} />,
			span: 3,
		},
		{
			key: t("booking_list:schema.book_start.label"),
			label: t("booking_list:schema.book_start.label"),
			children: toDateTime(booking_list?.book_start)+" - "+toDateTime(booking_list?.book_end),
			span: 3,
		},
		{
			key: t("common:created_at"),
			label: t("common:created_at"),
			children: toDateTime(booking_list?.created_at),
			span: 3,
		},
		{
			key: t("common:updated_at"),
			label: t("common:updated_at"),
			children: toDateTime(booking_list?.updated_at),
			span: 3,
		},
	];

	return (
		<Modal
			open={open}
			title={
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<UnorderedListOutlined />
					<span>
						{t("booking_list:title")}{" "}
						{booking_list && ` : ${booking_list?.title}`}
					</span>
				</div>
			}
			onCancel={onClose}
			destroyOnClose
			footer={false}
			width={"50rem"}
		>
			{!data?.data && !isPending ? (
				<EmptyData value={t("booking_list:title")} />
			) : (
				<>
					<Descriptions size="small" bordered items={items} className="my-5" />
				</>
			)}

			<Flex justify="space-between">
				<span> </span>
				<ButtonCancel onClick={onClose} title={t("common:close")} />
			</Flex>
		</Modal>
	);
}
