import React from "react";
import {  Flex } from "antd";
import { useTranslation } from "react-i18next";
import { FilterQuery } from "../types";
import InputTextFilter from "../../../components/common/InputTextFilter";
import MultiSelectDropdown from "../../../components/common/MultiSelectDropdown";
import { activeList } from "../../../configs/status";
import DepartmentDropdown from "../../department/components/DepartmentDropdown";

interface UserFilterSectionProps {
	textSearch?: string;
	status?: string;
	department_id?: string;
	onFilterChange: (filter: Partial<FilterQuery>) => void;
}

export const UserFilterSection: React.FC<UserFilterSectionProps> = ({
	textSearch = "",
	status = "",
	department_id = "",
	onFilterChange,
}) => {
	const { t } = useTranslation(["user", "common"]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onFilterChange({ textSearch: e.target.value });
	};

	const handleDepartmentChange = (
		value: string | number | (string | number)[] | undefined
	) => {
		if (value) {
			onFilterChange({ department_id: String(value) });
		} else {
			onFilterChange({ department_id: "" });
		}
	};

	const handleStatusChange = (values: string) => {
		onFilterChange({ status: values });
	};

	return (
		<div className="flex justify-start lg:justify-between flex-wrap lg:flex-nowrap items-center gap-5 w-full mb-5">
			<InputTextFilter
				value={textSearch}
				onChange={handleSearchChange}
				placeholder={t("user:table.filter.searchPlaceholder")}
				className="search-input"
			/>
			<Flex
				gap={10}
				className="justify-start lg:justify-end flex-wrap lg:flex-nowrap"
			>
				<DepartmentDropdown
					onChange={handleDepartmentChange}
					value={department_id!}
					placeholder="test"
				/>
				<MultiSelectDropdown
					title={t("user:schema.status.label")}
					selectedValues={status}
					setSelectedValues={handleStatusChange}
					loading={false}
					options={activeList}
				/>
			</Flex>
		</div>
	);
};
