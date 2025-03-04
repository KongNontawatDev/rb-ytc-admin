import React, { ReactNode, useMemo } from "react";
import { Form, Select as AntdSelect, SelectProps } from "antd";
import { BaseOptionType } from "antd/es/select";
import clsx from "clsx";

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
	mode?: "multiple" | "tags";
	maxTagCount?: number | "responsive";
	disabled?: boolean;
	className?: string;
	allowClear?: boolean;
	showSearch?: boolean;
	dropdownRender?: SelectProps["dropdownRender"];
	dropdownStyle?: React.CSSProperties;
	optionRender?: (
		option: BaseOptionType,
		info: { index: number }
	) => React.ReactNode;
	labelRender?: (props: any) => ReactNode;
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
	className,
	allowClear = true,
	showSearch = true,
	dropdownRender,
	dropdownStyle,
	optionRender,
	labelRender,
}: Props) {
	const [form] = Form.useForm();

	// Memoized option mapping to improve performance
	const mappedOptions = useMemo(() => {
		return options.map((item: OptionType) => ({
			label: item[fieldLabel],
			value: item[fieldValue],
			...item, // Include the entire item as data in the option
		}));
	}, [options, fieldLabel, fieldValue]);

	return (
		<>
			{label ? (
				<Form layout="vertical" form={form} className="w-full">
					<Form.Item label={label} name={name} className="mb-0 pb-0 w-full">
						<AntdSelect
							value={value}
							showSearch={showSearch}
							placeholder={placeholder}
							onChange={onChange}
							allowClear={allowClear}
							className={clsx(
								"w-full md:w-[250px]", // Responsive: Full width on mobile, fixed width on desktop
								className
							)}
							filterOption={(input, option) =>
								(option?.label ?? "")
									.toString()
									.toLowerCase()
									.includes(input.toLowerCase())
							}
							options={mappedOptions}
							loading={loading}
							mode={mode}
							maxTagCount={maxTagCount}
							disabled={disabled}
							dropdownRender={dropdownRender}
							dropdownStyle={dropdownStyle}
							getPopupContainer={(triggerNode) => triggerNode.parentElement}
							optionRender={optionRender}
							labelRender={labelRender}
						/>
					</Form.Item>
				</Form>
			) : (
				<>
					<AntdSelect
						value={value}
						showSearch={showSearch}
						placeholder={placeholder}
						onChange={onChange}
						allowClear={allowClear}
						className={clsx(
							"w-full md:w-[250px]", // Responsive: Full width on mobile, fixed width on desktop
							className
						)}
						filterOption={(input, option) =>
							(option?.label ?? "")
								.toString()
								.toLowerCase()
								.includes(input.toLowerCase())
						}
						options={mappedOptions}
						loading={loading}
						mode={mode}
						maxTagCount={maxTagCount}
						disabled={disabled}
						dropdownRender={dropdownRender}
						dropdownStyle={dropdownStyle}
						getPopupContainer={(triggerNode) => triggerNode.parentElement}
						optionRender={optionRender}
						labelRender={labelRender}
					/>
				</>
			)}
		</>
	);
}
