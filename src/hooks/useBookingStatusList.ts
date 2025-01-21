import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export interface BookingStatusListItem {
	value: number;
	color: "success" | "error" | "processing" | "default" | "warning" | undefined;
	label: string;
	text: string;
}

export const useBookingStatusList = (value?: number | null) => {
	const { t } = useTranslation("status");

	const allList = useMemo<BookingStatusListItem[]>(
		() => [
			{
				value: 1,
				color: "processing",
				label: t("bookingListStatus.active"),
				text: t("bookingListStatus.active"),
			},
			{
				value: 2,
				color: "success",
				label: t("bookingListStatus.success"),
				text: t("bookingListStatus.success"),
			},
			{
				value: 3,
				color: "error",
				label: t("bookingListStatus.cancel"),
				text: t("bookingListStatus.cancel"),
			},
		],
		[t]
	);

	const filteredList = useMemo(() => {
		if (value === undefined || value === null) {
			return allList;
		}
		const found = allList.find((item) => item.value === Number(value));
		return found ? [found] : [];
	}, [value, allList]);

	return filteredList;
};
