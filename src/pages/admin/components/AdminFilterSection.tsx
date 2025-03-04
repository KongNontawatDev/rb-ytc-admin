import React from "react";
import { Flex } from "antd";
import { useTranslation } from "react-i18next";
import { FilterQuery } from "../types";
import InputTextFilter from "../../../components/common/InputTextFilter";
import MultiSelectDropdown from "../../../components/common/MultiSelectDropdown";
import { activeList } from "../../../configs/status";

interface AdminFilterSectionProps {
	textSearch?: string;
	status?: string;
	role_id?: string;
	onFilterChange: (filter: Partial<FilterQuery>) => void;
}

export const AdminFilterSection: React.FC<AdminFilterSectionProps> = ({
	textSearch = "",
	status = "",
	role_id = "",
	onFilterChange,
}) => {
	const { t } = useTranslation(["admin", "common", "role"]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onFilterChange({ textSearch: e.target.value });
	};

	const handleStatusChange = (values: string) => {
		onFilterChange({ status: values });
	};

	const handleRoleChange = (values: string) => {
		onFilterChange({ role_id: values });
	};

	return (
		<div className="flex justify-start lg:justify-between flex-wrap lg:flex-nowrap items-center gap-5 w-full mb-5">
			<InputTextFilter
				value={textSearch}
				onChange={handleSearchChange}
				placeholder={t("admin:table.filter.searchPlaceholder")}
				className="search-input"
			/>
			<Flex
				gap={10}
				className="justify-start lg:justify-end flex-wrap lg:flex-nowrap"
			>
				<MultiSelectDropdown
					title={t("role:title")}
					selectedValues={role_id}
					setSelectedValues={handleRoleChange}
					loading={false}
					options={[{ label: "Admin", value: 1 }]}
				/>
				<MultiSelectDropdown
					title={t("admin:schema.status.label")}
					selectedValues={status}
					setSelectedValues={handleStatusChange}
					loading={false}
					options={activeList}
				/>
			</Flex>
		</div>
	);
};
