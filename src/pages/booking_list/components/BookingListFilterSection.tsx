import React from "react";
import { Flex } from "antd";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { FilterQuery } from "../types";
import InputTextFilter from "../../../components/common/InputTextFilter";
import { InputDateRange } from "../../../components/common/inputDateRange";
import Select from "../../../components/common/Select";
import { useRoomForDropdown } from "../../room/hooks/useRoomQuery";
import { useDepartmentForDropdown } from "../../department/hooks/useDepartmentQuery";

interface BookingListFilterSectionProps {
	textSearch?: string;
	book_start?: string;
	book_end?: string;
	onFilterChange: (filter: Partial<FilterQuery>) => void;
}

export const BookingListFilterSection: React.FC<
	BookingListFilterSectionProps
> = ({ textSearch = "", book_start, book_end, onFilterChange }) => {
	const { t } = useTranslation(["booking_list", "common"]);
	const roomOption = useRoomForDropdown();
	const departmentOption = useDepartmentForDropdown();

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onFilterChange({ textSearch: e.target.value });
	};

	const handleDateRangeChange = (
		dates: [Dayjs | null, Dayjs | null] | null
	) => {
		if (!dates) {
			onFilterChange({ book_start: undefined, book_end: undefined });
			return;
		}
		const [start, end] = dates;
		onFilterChange({
			book_start: start ? start.format() : undefined,
			book_end: end ? end.format() : undefined,
		});
	};

	const handlePredefinedRangeChange = (
		value: string | number | (string | number)[] | undefined
	) => {
		const today = dayjs();
		let start: Dayjs | null = null;
		let end: Dayjs | null = today;

		switch (value) {
			case "1day":
				start = today.subtract(1, "day");
				break;
			case "7days":
				start = today.subtract(7, "days");
				break;
			case "1month":
				start = today.subtract(1, "month");
				break;
			case "3months":
				start = today.subtract(3, "months");
				break;
			case "1year":
				start = today.subtract(1, "year");
				break;
			default:
				start = null;
				end = null;
		}

		onFilterChange({
			book_start: start ? start.format() : undefined,
			book_end: end ? end.format() : undefined,
		});
	};

	const handleRoomChange = (
		values: string | number | (string | number)[] | undefined
	) => {
		onFilterChange({
			room_id: values
				? Array.isArray(values)
					? values.join(",")
					: values.toString()
				: undefined,
		});
	};

	const handleDepartmentChange = (
		values: string | number | (string | number)[] | undefined
	) => {
		onFilterChange({
			department_id: values
				? Array.isArray(values)
					? values.join(",")
					: values.toString()
				: undefined,
		});
	};

	return (
			<div className="flex justify-start lg:justify-between flex-wrap lg:flex-nowrap items-center gap-5 w-full mb-5">
				{/* Text Search */}
				<InputTextFilter
					value={textSearch}
					onChange={handleSearchChange}
					placeholder={t("booking_list:table.filter.searchPlaceholder")}
				/>
				{/* Filters */}
				<Flex
        gap={10}
					className="justify-start lg:justify-end flex-wrap lg:flex-nowrap"
				>
					{/* Department */}
					<Select
						placeholder={t("booking_list:table.filter.department.label")}
						options={departmentOption?.data?.data || []}
						loading={departmentOption.isPending}
						fieldLabel="name"
						fieldValue="id"
						mode="multiple"
						className="w-full lg:min-w-[200px]"
						maxTagCount={2}
						onChange={handleDepartmentChange}
					/>

					{/* Room */}
					<Select
						placeholder={t("booking_list:table.filter.room.label")}
						options={roomOption?.data?.data || []}
						loading={roomOption.isPending}
						fieldLabel="name"
						fieldValue="id"
						mode="multiple"
						className="w-full lg:min-w-[200px]"
						maxTagCount={2}
						onChange={handleRoomChange}
					/>

					{/* Predefined Date Range */}
					<Select
						placeholder={t("common:dateRange.select")}
						onChange={handlePredefinedRangeChange}
						className="w-full lg:min-w-[120px] lg:max-w-[120px]"
						options={[
							{ value: "all", label: t("common:dateRange.all") },
							{ value: "1day", label: t("common:dateRange.1day") },
							{ value: "7days", label: t("common:dateRange.7days") },
							{ value: "1month", label: t("common:dateRange.1month") },
							{ value: "3months", label: t("common:dateRange.3months") },
							{ value: "1year", label: t("common:dateRange.1year") },
						]}
					/>

					{/* Date Range Picker */}
					<InputDateRange
						className="w-full lg:max-w-[280px]"
						value={[
							book_start ? dayjs(book_start) : null,
							book_end ? dayjs(book_end) : null,
						]}
						onChange={handleDateRangeChange}
						placeholder={[
							t("booking_list:table.filter.startDate"),
							t("booking_list:table.filter.endDate"),
						]}
					/>
				</Flex>
			</div>
	);
};
