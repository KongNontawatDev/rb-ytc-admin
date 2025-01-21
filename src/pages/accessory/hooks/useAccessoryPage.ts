import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { FilterQuery } from '../types';
import { FormMode } from '../../../types/formType';
import { useAccessorys } from './useAccessoryQuery';
import { useDeleteAccessory, useDeleteSelectedAccessory, useUpdateStatusAccessory } from './useAccessoryMutate';

export const useAccessoryPage = (defaultFilter: FilterQuery) => {
  const [open, setOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('view');
  const [searchState, setSearchState] = useState(true);
  const [view, setView] = useState<'table' | 'card'>('table');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [localFilter, setLocalFilter] = useState<FilterQuery>(defaultFilter);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<number | null>(null);
  
  const [debouncedSearchTerm] = useDebounce(localFilter.textSearch, 700);
  
  const accessoryFilter: FilterQuery = {
    ...localFilter,
    textSearch: debouncedSearchTerm,
  };

  const { data, isPending, setFilters } = useAccessorys(accessoryFilter);
  const deleteAccessory = useDeleteAccessory();
  const deleteSelectedAccessory = useDeleteSelectedAccessory();
  const updateStatusAccessory = useUpdateStatusAccessory(() => {
    setStatusUpdateLoading(null);
  });

  useEffect(() => {
    setFilters(localFilter);
  }, [
    localFilter.page,
    localFilter.pageSize,
    localFilter.sortField,
    localFilter.sortOrder,
    localFilter.status,
    debouncedSearchTerm,
  ]);

  const handleUpdateStatus = async (id: number, status: number) => {
    try {
      setStatusUpdateLoading(id);
      await updateStatusAccessory.mutateAsync({ id, status });
    } catch (error) {
      console.error('Status update failed:', error);
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAccessory.mutateAsync(id);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleFilterChange = (partialFilter: Partial<FilterQuery>) => {
    setLocalFilter(prev => {
      // Create new filter object
      const newFilter = { ...prev, ...partialFilter };

      // Reset page to 1 only when changing filters other than page/pageSize
      if (partialFilter.textSearch !== undefined ||
          partialFilter.status !== undefined ||
          partialFilter.sortField !== undefined ||
          partialFilter.sortOrder !== undefined) {
        newFilter.page = 1;
      }

      return newFilter;
    });
  };

  return {
    open,
    setOpen,
    formMode,
    setFormMode,
    searchState,
    setSearchState,
    view,
    setView,
    selectedId,
    setSelectedId,
    localFilter,
    handleFilterChange,
    handleUpdateStatus,
    handleDelete,
    data,
    isPending,
    deleteSelectedAccessory,
    statusUpdateLoading,  // Added loading state for status updates
  };
};