import React, { useMemo } from "react";
import { Spin } from "antd";
import { useUserForDropdown } from "../hooks/useUserQuery";
import Select from "../../../components/common/Select";
import { useTranslation } from "react-i18next";

type UserDropdownProps = {
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

export default function UserDropdown({value,onChange,label}:UserDropdownProps) {
  // Fetching users using the custom hook
  const { data, isLoading } = useUserForDropdown();
  const {t} = useTranslation(["user","validation"])

  // Map data for the Select component
  const options = useMemo(() => {
    if (!data?.data || data?.data.length === 0) return [];
    return data?.data.map((user: { id: number | string; full_name: string,department_id:number }) => ({
      id: user.id,
      name: user.full_name,
      department_id:user.department_id
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
      name={"user"}
      options={options}
      fieldValue="id"
      fieldLabel="name"
      value={value}
      onChange={onChange}
      label={label}
      placeholder={t("validation:placeholderSelect",{field:t("user:title")})}
    />
  );
}
