import React from 'react';
import { Row, Col, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { FilterQuery } from '../types';
import InputTextFilter from '../../../components/common/InputTextFilter';
import { InputDateRange } from '../../../components/common/inputDateRange';

interface BookingListFilterSectionProps {
  textSearch?: string;
  book_start?: string;
  book_end?: string;
  onFilterChange: (filter: Partial<FilterQuery>) => void;
}

export const BookingListFilterSection: React.FC<BookingListFilterSectionProps> = ({
  textSearch = '',
  book_start,
  book_end,
  onFilterChange,
}) => {
  const { t } = useTranslation(['booking_list', 'common']);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ textSearch: e.target.value });
  };

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (!dates) {
      onFilterChange({ book_start: undefined, book_end: undefined });
      return;
    }

    const [start, end] = dates;
    onFilterChange({
      book_start: start ? start.format('YYYY-MM-DD') : undefined,
      book_end: end ? end.format('YYYY-MM-DD') : undefined,
    });
  };

  const handlePredefinedRangeChange = (value: string) => {
    const today = dayjs();
    let start: Dayjs | null = null;
    let end: Dayjs | null = today;
    
    switch (value) {
      case '1day':
        start = today.subtract(1, 'day');
        break;
      case '7days':
        start = today.subtract(7, 'days');
        break;
      case '1month':
        start = today.subtract(1, 'month');
        break;
      case '3months':
        start = today.subtract(3, 'months');
        break;
      case '1year':
        start = today.subtract(1, 'year');
        break;
      default:
        start = null;
        end = null;
    }

    onFilterChange({
      book_start: start ? start.format('YYYY-MM-DD') : undefined,
      book_end: end ? end.format('YYYY-MM-DD') : undefined,
    });
  };

  return (
    <Row gutter={[16, 16]} align="middle" justify="space-between" className='mb-5'>
      {/* Text Search ด้านซ้าย */}
      <Col xs={24} md={10}>
        <InputTextFilter
          value={textSearch}
          onChange={handleSearchChange}
          placeholder={t('booking_list:table.filter.searchPlaceholder')}
          className="search-input m-0"
        />
      </Col>
      
      {/* Date Controls ด้านขวา */}
      <Col xs={24} md={14}>
        <Space size={8} style={{ width: '100%', justifyContent: 'flex-end',alignItems:'center' }} wrap>
          <Select
            placeholder={t('common:dateRange.select')}
            onChange={handlePredefinedRangeChange}
            className='w-full min-w-[120px] lg:max-w-[120px]'
            options={[
              { value: 'all', label: t('common:dateRange.all') },
              { value: '1day', label: t('common:dateRange.1day') },
              { value: '7days', label: t('common:dateRange.7days') },
              { value: '1month', label: t('common:dateRange.1month') },
              { value: '3months', label: t('common:dateRange.3months') },
              { value: '1year', label: t('common:dateRange.1year') },
            ]}
          />
          
          <InputDateRange
          className='w-full lg:max-w-[280px]'
            value={[
              book_start ? dayjs(book_start) : null,
              book_end ? dayjs(book_end) : null,
            ]}
            onChange={handleDateRangeChange}
            placeholder={[
              t('booking_list:table.filter.startDate'),
              t('booking_list:table.filter.endDate'),
            ]}
          />
        </Space>
      </Col>
    </Row>
  );
};