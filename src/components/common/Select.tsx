import React, { ReactNode, useEffect, useMemo } from 'react';
import { Form, Select as AntdSelect , SelectProps } from "antd";
import { BaseOptionType } from 'antd/es/select';

type OptionType = {
  [key: string]: string | number;
};

type Props = {
  options: OptionType[];
  placeholder?: string;
  onChange?: (value: string | number | (string | number)[] | undefined) => void;
  value?: string | number | (string | number)[];
  loading?: boolean;
  fieldValue?: string;
  fieldLabel?: string;
  label?: string;
  name?: string;
  mode?: 'multiple' | 'tags';
  maxTagCount?: number | 'responsive';
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  allowClear?: boolean;
  showSearch?: boolean;
  dropdownRender?: SelectProps['dropdownRender'];
  dropdownStyle?: React.CSSProperties;
  optionRender?: (option: BaseOptionType , info: { index: number }) => React.ReactNode
  labelRender?:(props: any) => ReactNode
};

export default function Select({
  name,
  value,
  options = [],
  placeholder,
  onChange,
  loading = false,
  fieldLabel = "name",
  fieldValue = "id",
  label,
  mode,
  maxTagCount,
  disabled = false,
  style,
  className,
  allowClear = true,
  showSearch = true,
  dropdownRender,
  dropdownStyle,
  optionRender,
  labelRender
}: Props) {
  const [form] = Form.useForm();
  // Memoized option mapping to improve performance
  const mappedOptions = useMemo(() => {
    return options.map((item: OptionType) => ({
      label: item[fieldLabel],
      value: mode === 'multiple' 
        ? (typeof item[fieldValue] === 'string' 
            ? item[fieldValue] 
            : Number(item[fieldValue]))
        : (typeof value === "string" 
            ? item[fieldValue] 
            : Number(item[fieldValue])),
      ...item // Include the entire item as data in the option
    }));
  }, [options, fieldLabel, fieldValue, mode, value]);

  // Effect to update form value
  useEffect(() => {
    if (value !== undefined && value !== null) {
      // Handle different value types for single and multiple modes
      if (mode === 'multiple') {
        form.setFieldValue(name, 
          Array.isArray(value) 
            ? value.map(v => typeof v === 'string' ? v : Number(v))
            : [value]
        );
      } else {
        form.setFieldValue(name, 
          typeof value === "string" 
            ? value 
            : Number(value)
        );
      }
    } else {
      form.setFieldValue(name, undefined);
    }
  }, [value, form, name, mode]);

  return (
    <Form layout="vertical" form={form}>
      <Form.Item label={label} name={name} className='mb-0 pb-0'>
        <AntdSelect
          value={value}
          showSearch={showSearch}
          placeholder={placeholder}
          onChange={onChange}
          allowClear={allowClear}
          style={{ width: "100%", ...style }}
          className={className}
          filterOption={(input, option) =>
            (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase())
          }
          options={mappedOptions}
          loading={loading}
          mode={mode}
          maxTagCount={maxTagCount}
          disabled={disabled}
          dropdownRender={dropdownRender}
          dropdownStyle={dropdownStyle}
          getPopupContainer={triggerNode => triggerNode.parentElement}
          optionRender={optionRender}
          labelRender={labelRender}
        />
      </Form.Item>
    </Form>
  );
}