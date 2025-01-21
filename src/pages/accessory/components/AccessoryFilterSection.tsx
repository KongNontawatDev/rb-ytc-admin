import React from 'react';
import { Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { FilterQuery } from '../types';
import InputTextFilter from '../../../components/common/InputTextFilter';
import MultiSelectDropdown from '../../../components/common/MultiSelectDropdown';
import { activeList } from '../../../configs/status';

interface AccessoryFilterSectionProps {
  textSearch?: string;
  status?: string;
  onFilterChange: (filter: Partial<FilterQuery>) => void;
}

export const AccessoryFilterSection: React.FC<AccessoryFilterSectionProps> = ({
  textSearch = '',
  status = '',
  onFilterChange,
}) => {
  const { t } = useTranslation(['accessory', 'common']);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ textSearch: e.target.value });
  };

  const handleStatusChange = (values: string) => {
    onFilterChange({ status: values});
  };

  return (
    <Row gutter={[10, 10]}>
      <Col span={24} md={12} lg={8}>
        <InputTextFilter
          value={textSearch}
          onChange={handleSearchChange}
          placeholder={t('accessory:table.filter.searchPlaceholder')}
          className="search-input"
        />
      </Col>
      <Col span={24} md={12} lg={8}>
        <MultiSelectDropdown
          title={t('accessory:schema.status.label')}
          selectedValues={status}
          setSelectedValues={handleStatusChange}
          loading={false}
          options={activeList}
        />
      </Col>
    </Row>
  );
};