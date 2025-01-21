import React, { useMemo } from "react";
import Select from "./Select";
import { useActiveList } from "../../hooks/useActiveList";

type ActiveStatusDropdownProps = {
  value?: number | string;
  onChange: (value: number | string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  allowClear?: boolean;
};

export default function ActiveStatusDropdown({
  value,
  onChange,
  placeholder = "Select status",
  disabled = false,
  style,
  className,
  allowClear = true,
}: ActiveStatusDropdownProps) {
  const activeList = useActiveList(null);

  // Map activeList to dropdown options
  const options = useMemo(() => {
    return activeList.map((item) => ({
      label: item.label,
      value: item.value,
    }));
  }, [activeList]);

  // Get selected option
  const selectedValue = useMemo(() => {
    if (!value) return undefined;
    const selected = activeList.find(item => item.value === Number(value));
    return selected?.value;
  }, [value, activeList]);

  const handleChange = (
    value: string | number | (string | number)[] | undefined
  ) => {
    if (Array.isArray(value)) {
      onChange(value[0]);
    } else {
      onChange(value);
    }
  };

  return (
    <Select
      value={selectedValue}
      options={options}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      style={style}
      className={className}
      allowClear={allowClear}
    />
  );
}