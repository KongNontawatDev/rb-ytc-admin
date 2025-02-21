import {
	Carousel,
	Descriptions,
	DescriptionsProps,
	Flex,
	Image,
	Modal,
	Timeline,
	Typography,
} from "antd";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useRoomById } from "../hooks/useRoomQuery";
import EmptyData from "../../../components/common/EmptyData";
import { Room } from "../types";
import { UnorderedListOutlined } from "@ant-design/icons";
import { fallbackImage } from "../../../utils/file";
import ButtonCancel from "../../../components/common/ButtonCancel";
import { toDateTime } from "../../../utils/dateFunction";
import BadgeActive from "../../../components/common/BadgeActive";
import { getImage } from "../../../hooks/getImage";

interface RoomViewModalProps {
	id?: number | null;
	open: boolean;
	onClose: () => void;
}

export default function RoomViewModal({
	id,
	open,
	onClose,
}: RoomViewModalProps) {
	const { t } = useTranslation(["room", "common"]);
	const { data, isPending } = useRoomById(id);
	const [room, setRoom] = useState<Room>();

	useEffect(() => {
		if (data && !isPending) {
			setRoom(data?.data);
		}
	}, [id, data, isPending]);

	const items: DescriptionsProps["items"] = [
		{
			key: t("room:schema.name.label"),
			label: t("room:schema.name.label"),
			children: (
				<>
					[{room?.id}] {room?.name}
				</>
			),
			span: 3,
		},
		{
			key: t("room:schema.detail.label"),
			label: t("room:schema.detail.label"),
			children: room?.detail,
			span: 3,
		},

		{
			key: t("room:schema.location.label"),
			label: t("room:schema.location.label"),
			children: room?.location,
			span: 3,
		},
		{
			key: t("room:schema.size.label"),
			label: t("room:schema.size.label"),
			children: room?.size,
			span: 3,
		},
		{
			key: t("room:schema.capacity.label"),
			label: t("room:schema.capacity.label"),
			children: room?.capacity,
			span: 3,
		},
		{
			key: t("room:schema.status.label"),
			label: t("room:schema.status.label"),
			children: <BadgeActive value={String(room?.status)} />,
			span: 3,
		},
		{
			key: t("common:created_at"),
			label: t("common:created_at"),
			children: toDateTime(room?.created_at),
			span: 3,
		},
		{
			key: t("common:updated_at"),
			label: t("common:updated_at"),
			children: toDateTime(room?.updated_at),
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
						{t("room:title")} {room && ` : ${room?.name}`}
					</span>
				</div>
			}
			onCancel={onClose}
			destroyOnClose
			footer={false}
			width={"50rem"}
		>
			{!data?.data && !isPending ? (
				<EmptyData value={t("room:title")} />
			) : (
				<>
					<center>
						<Carousel
							arrows
							infinite={true}
							className="max-h-80 max-w-80 rounded-md"
						>
							{room?.room_image.map((room_image) => (
								<div className=" rounded-md">
									<Image
										src={getImage(room_image.image, "room")}
										className="w-full rounded-md"
										preview={false}
										fallback={fallbackImage}
									/>
								</div>
							))}
						</Carousel>
					</center>
					<Descriptions size="small" bordered items={items} className="my-5" />
					<Typography.Title level={5}>รายการจองใน 1 เดือนนี้</Typography.Title>
					{room?.booking_list.length!=0?<Timeline
						className="mb-5 mt-4"
						items={
							room?.booking_list.map(list=>(
								{
								children: (
									<div className="leading-4">
										<p>{toDateTime(list?.book_start)} - {toDateTime(list?.book_end)}</p>
										<small>{list?.title}</small><br/>
										<small>ผู้จอง : {list?.user_name}</small>
									</div>
								),
							}
							))
						}
					/>:
					<EmptyData/>
					}
				</>
			)}

			<Flex justify="space-between">
				<span> </span>
				<ButtonCancel onClick={onClose} title={t("common:close")} />
			</Flex>
		</Modal>
	);
}
