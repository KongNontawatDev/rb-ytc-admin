import React, { useMemo } from "react";
import { Spin } from "antd";
import { useAdminForDropdown } from "../hooks/useAdminQuery";
import Select from "../../../components/common/Select";
import { useTranslation } from "react-i18next";

type AdminDropdownProps = {
  placeholder?: string;
  value?: string | number | (string | number)[];
  onChange: (value: string | number | (string | number)[] | undefined) => void;
  mode?: "multiple" | "tags";
  maxTagCount?: number | "responsive";
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  allowClear?: boolean;
  showSearch?: boolean;
  label?: string;
  name?: string;
};

export default function AdminDropdown({value,onChange}:AdminDropdownProps) {
  // Fetching admins using the custom hook
  const { data, isLoading } = useAdminForDropdown();
  const {t} = useTranslation(["admin","validation"])

  // Map data for the Select component
  const options = useMemo(() => {
    if (!data?.data || data?.data.length === 0) return [];
    return data?.data.map((dept: { id: number | string; name: string }) => ({
      id: dept.id,
      name: dept.name,
    }));
  }, [data?.data]);

  // Show a loading spinner if data is loading
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "16px" }}>
        <Spin />
      </div>
    );
  }

  return (
    <Select
      name={"admin"}
      options={options}
      fieldValue="id"
      fieldLabel="name"
      value={value}
      onChange={onChange}
      label={t("admin:title")}
      placeholder={t("validation:placeholderSelect",{field:t("admin:title")})}
    />
  );
}
