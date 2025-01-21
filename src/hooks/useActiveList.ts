import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface ActiveListItem {
  value: number;
  color: string;
  label: string;
  text: string;
}

export const useActiveList = (value?: number | null) => {
  const { t } = useTranslation("status");

  const allList = useMemo<ActiveListItem[]>(() => [
    {
      value: 1,
      color: "success",
      label: t("active.enabled"),
      text: t("active.enabled"),
    },
    {
      value: 2,
      color: "error",
      label: t("active.disabled"),
      text: t("active.disabled"),
    },
  ], [t]);

  const filteredList = useMemo(() => {
    if (value === undefined || value === null) {
      return allList;
    }
    const found = allList.find(item => item.value === Number(value));
    return found ? [found] : [];
  }, [value, allList]);

  return filteredList;
};