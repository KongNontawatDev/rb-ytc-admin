import React from "react";
import { useTranslation } from "react-i18next";
import { FilterQuery } from "../types";
import InputTextFilter from "../../../components/common/InputTextFilter";
import MultiSelectDropdown from "../../../components/common/MultiSelectDropdown";
import { activeList } from "../../../configs/status";

interface RoomFilterSectionProps {
	textSearch?: string;
	status?: string;
	onFilterChange: (filter: Partial<FilterQuery>) => void;
}

export const RoomFilterSection: React.FC<RoomFilterSectionProps> = ({
	textSearch = "",
	status = "",
	onFilterChange,
}) => {
	const { t } = useTranslation(["room", "common"]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onFilterChange({ textSearch: e.target.value });
	};

	const handleStatusChange = (values: string) => {
		onFilterChange({ status: values });
	};

	return (
		<div className="flex justify-start lg:justify-between flex-wrap lg:flex-nowrap items-center gap-5 w-full mb-5">
			<InputTextFilter
				value={textSearch}
				onChange={handleSearchChange}
				placeholder={t("room:table.filter.searchPlaceholder")}
				className="search-input"
			/>
			<MultiSelectDropdown
				title={t("room:schema.status.label")}
				selectedValues={status}
				setSelectedValues={handleStatusChange}
				loading={false}
				options={activeList}
			/>
		</div>
	);
};
