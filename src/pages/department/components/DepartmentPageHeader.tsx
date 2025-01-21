import React from 'react';
import { Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import { CustomColumnType } from '../../../types/TableType';
import Breadcrumb, { BreadcrumbItemType } from '../../../components/common/Breadcrumb';
import ButtonClearFilter from '../../../components/common/ButtonClearFilter';
import TitleHeader from '../../../components/common/TitleHeader';
import ButtonFilterToggle from '../../../components/common/ButtonFilterToggle';
import ButtonToggleView from '../../../components/common/ButtonToggleView';
import ColumnSelector from '../../../components/common/ColumnSelector';
import ButtonCreate from '../../../components/common/ButtonCreate';


interface DepartmentPageHeaderProps {
  title: string;
  icon: React.ComponentType;
  onClearFilter: () => void;
  onToggleSearch: () => void;
  searchState: boolean;
  view: 'table' | 'card';
  onToggleView: () => void;
  columns: CustomColumnType<any>[];
  visibleColumns: string[];
  onColumnVisibilityChange: (columnKey: string, checked: boolean, isLocked: boolean) => void;
  onCreateClick: () => void;
}

export const DepartmentPageHeader: React.FC<DepartmentPageHeaderProps> = ({
  title,
  icon: Icon,
  onClearFilter,
  onToggleSearch,
  searchState,
  view,
  onToggleView,
  columns,
  visibleColumns,
  onColumnVisibilityChange,
  onCreateClick,
}) => {
  const { t } = useTranslation(['department', 'common']);
  const breadcrumbLink: BreadcrumbItemType = [{ title }];

  return (
    <Flex justify="space-between" align="end" wrap gap={10}>
      <Flex vertical align="start" className="mt-3 lg:mt-5 mb-1">
        <Breadcrumb listItems={breadcrumbLink} />
        <TitleHeader title={title} icon={Icon} back={false} />
      </Flex>

      <div className="flex justify-start lg:justify-end items-center gap-2 flex-wrap">
        <ButtonClearFilter
          onClick={onClearFilter}
          tooltip={t('common:clearFilter')}
        />
        <ButtonFilterToggle
          tooltip={searchState ? t('common:filterClose') : t('common:filterOpen')}
          onClick={onToggleSearch}
          state={searchState}
        />
        <ButtonToggleView view={view} setToggleView={onToggleView} />
        <ColumnSelector
          columns={columns}
          visibleColumns={visibleColumns}
          onColumnVisibilityChange={onColumnVisibilityChange}
        />
        <ButtonCreate
          title={t('common:create', { data: t('department:title') })}
          onClick={onCreateClick}
        />
      </div>
    </Flex>
  );
};