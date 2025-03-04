import React from "react";
import { useTranslation } from "react-i18next";
import { FilterQuery } from "../types";
import InputTextFilter from "../../../components/common/InputTextFilter";
import MultiSelectDropdown from "../../../components/common/MultiSelectDropdown";
import { activeList } from "../../../configs/status";

interface AccessoryFilterSectionProps {
	textSearch?: string;
	status?: string;
	onFilterChange: (filter: Partial<FilterQuery>) => void;
}

export const AccessoryFilterSection: React.FC<AccessoryFilterSectionProps> = ({
	textSearch = "",
	status = "",
	onFilterChange,
}) => {
	const { t } = useTranslation(["accessory", "common"]);

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
				placeholder={t("accessory:table.filter.searchPlaceholder")}
				className="search-input"
			/>
			<MultiSelectDropdown
				title={t("accessory:schema.status.label")}
				selectedValues={status}
				setSelectedValues={handleStatusChange}
				loading={false}
				options={activeList}
			/>
		</div>
	);
};
