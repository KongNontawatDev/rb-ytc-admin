import React from 'react';
import { Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { FilterQuery } from '../types';
import InputTextFilter from '../../../components/common/InputTextFilter';

interface BookingListFilterSectionProps {
  textSearch?: string;
  onFilterChange: (filter: Partial<FilterQuery>) => void;
}

export const BookingListFilterSection: React.FC<BookingListFilterSectionProps> = ({
  textSearch = '',
  onFilterChange,
}) => {
  const { t } = useTranslation(['booking_list', 'common']);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ textSearch: e.target.value });
  };


  return (
    <Row gutter={[10, 10]}>
      <Col span={24} md={12} lg={8}>
        <InputTextFilter
          value={textSearch}
          onChange={handleSearchChange}
          placeholder={t('booking_list:table.filter.searchPlaceholder')}
          className="search-input"
        />
      </Col>
    </Row>
  );
};