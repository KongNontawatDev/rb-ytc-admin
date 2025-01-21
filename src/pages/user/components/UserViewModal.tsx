import {
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
import { getImage, useUserById } from "../hooks/useUserQuery";
import EmptyData from "../../../components/common/EmptyData";
import { User } from "../types";
import { UnorderedListOutlined } from "@ant-design/icons";
import { fallbackImage } from "../../../utils/file";
import ButtonCancel from "../../../components/common/ButtonCancel";
import { toDateTime } from "../../../utils/dateFunction";
import BadgeActive from "../../../components/common/BadgeActive";

interface UserViewModalProps {
	id?: number | null;
	open: boolean;
	onClose: () => void;
}

export default function UserViewModal({
	id,
	open,
	onClose,
}: UserViewModalProps) {
	const { t } = useTranslation(["user", "common"]);
	const { data, isPending } = useUserById(id);
	const [user, setUser] = useState<User>();

	useEffect(() => {
		if (data && !isPending) {
			setUser(data?.data);
		}
	}, [id, data, isPending]);

	const items: DescriptionsProps["items"] = [
		{
			key: t("user:schema.full_name.label"),
			label: t("user:schema.full_name.label"),
			children: (
				<>
					[{user?.id}] {user?.full_name}
				</>
			),
			span: 3,
		},
		{
			key: t("user:schema.tel.label"),
			label: t("user:schema.tel.label"),
			children: user?.tel,
			span: 3,
		},

		{
			key: t("user:schema.status.label"),
			label: t("user:schema.status.label"),
			children: <BadgeActive value={String(user?.status)} />,
			span: 3,
		},
		{
			key: t("common:created_at"),
			label: t("common:created_at"),
			children: toDateTime(user?.created_at),
			span: 3,
		},
		{
			key: t("common:updated_at"),
			label: t("common:updated_at"),
			children: toDateTime(user?.updated_at),
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
						{t("user:title")} {user && ` : ${user?.full_name}`}
					</span>
				</div>
			}
			onCancel={onClose}
			destroyOnClose
			footer={false}
			width={"50rem"}
		>
			{!data?.data && !isPending ? (
				<EmptyData value={t("user:title")} />
			) : (
				<>
				<center>
					<Image
					src={getImage(user?.image!,"user")}
					className="rounded-full max-w-32 max-h-32"
					fallback={fallbackImage}
					/>
				</center>
					<Descriptions size="small" bordered items={items} className="my-5" />
					<Typography.Title level={5}>รายการจองใน 1 เดือนนี้</Typography.Title>
					<Timeline
						className="mb-5 mt-4"
						items={
							user?.booking_list.map(list=>(
								{
								children: (
									<div className="leading-4">
										<p>{toDateTime(list?.book_start)} - {toDateTime(list?.book_end)}</p>
										<small>{list?.title}</small><br/>
										<small>ห้อง : {list?.room?.name}</small>
									</div>
								),
							}
							))
						}
					/>
				</>
			)}

			<Flex justify="space-between">
				<span> </span>
				<ButtonCancel onClick={onClose} title={t("common:close")} />
			</Flex>
		</Modal>
	);
}
