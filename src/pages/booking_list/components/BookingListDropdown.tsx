import React, { useMemo } from "react";
import { Spin } from "antd";
import { useBookingListForDropdown } from "../hooks/useBookingListQuery";
import Select from "../../../components/common/Select";
import { useTranslation } from "react-i18next";

type BookingListDropdownProps = {
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

export default function BookingListDropdown({value,onChange,label,disabled}:BookingListDropdownProps) {
  // Fetching booking_lists using the custom hook
  const { data, isLoading } = useBookingListForDropdown();
  const {t} = useTranslation(["booking_list","validation"])

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
      <div style={{ textAlign: "center", }}>
        <Spin />
      </div>
    );
  }
  console.log('value',value);
  

  return (
    <Select
      name={"booking_list"}
      options={options}
      fieldValue="id"
      fieldLabel="name"
      value={(value==''||value==0||value==undefined)?undefined:Number(value)}
      onChange={onChange}
      label={label}
      disabled={disabled}
      placeholder={t("validation:placeholderSelect",{field:t("booking_list:title")})}
    />
  );
}
