import React from "react";
import { Row, Col, Flex } from "antd";
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
		<Row gutter={[10, 10]}>
			<Col span={24} md={12} lg={8}>
				<InputTextFilter
					value={textSearch}
					onChange={handleSearchChange}
					placeholder={t("admin:table.filter.searchPlaceholder")}
					className="search-input"
				/>
			</Col>
			<Col span={24} md={12}>
				<Flex wrap gap={10}>
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
			</Col>
		</Row>
	);
};
