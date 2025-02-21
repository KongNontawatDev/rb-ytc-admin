import React, { useMemo } from "react";
import { Image, Spin } from "antd";
import { useAccessoryForDropdown } from "../hooks/useAccessoryQuery";
import Select from "../../../components/common/Select";
import { useTranslation } from "react-i18next";
import { fallbackImage } from "../../../utils/file";
import { getImage } from "../../../hooks/getImage";

type AccessoryDropdownProps = {
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

export default function AccessoryDropdown({
	value,
	onChange,
	mode,
	placeholder,
	label,
  disabled
}: AccessoryDropdownProps) {
	const { data, isLoading } = useAccessoryForDropdown();
	const { t } = useTranslation(["accessory", "validation"]);

	// Map data for the Select component
	const options = useMemo(() => {
		if (!data?.data || data?.data.length === 0) return [];
		return data?.data.map(
			(dept: { id: number | string; name: string; image?: string }) => ({
				id: dept.id,
				name: dept.name,
				image: dept.image || null,
			})
		);
	}, [data?.data]);

	// Transform value to proper format based on mode
	const transformedValue = useMemo(() => {
		if (value === "" || value === 0 || value === undefined || value === null) {
			return undefined;
		}

		if (mode === "multiple" || mode === "tags") {
			// Handle array values
			if (Array.isArray(value)) {
				return value.map((v) => Number(v));
			}
			// Handle single value as array
			return [Number(value)];
		}

		// Handle single value
		return Number(value);
	}, [value, mode]);

	if (isLoading) {
		return (
			<div style={{ textAlign: "center", padding: "16px" }}>
				<Spin />
			</div>
		);
	}

	return (
		<Select
			name="accessory"
			options={options}
			fieldValue="id"
			fieldLabel="name"
			value={transformedValue}
			onChange={onChange}
			label={label ? label : t("accessory:title")}
			mode={mode}
      disabled={disabled}
			placeholder={
				placeholder
					? placeholder
					: t("validation:placeholderSelect", {
							field: t("accessory:title"),
					  })
			}
			optionRender={(option) => {
				return (
					<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
						{option.data.image && (
							<Image
								preview={false}
								fallback={fallbackImage}
								src={getImage(option.data.image, "accessory")}
								alt={option.label}
								className="w-7 h-7 max-h-7 object-cover rounded-full bg-white p-1"
							/>
						)}
						<span>{option.label}</span>
					</div>
				);
			}}
			labelRender={(props) => {
				const record = options.find((option: any) => option.id == props.value);

				return (
					<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
						{record.image && (
							<Image
								preview={false}
								fallback={fallbackImage}
								src={getImage(record.image, "accessory")}
								alt={record.name}
								className="w-5 h-5 max-h-5 object-cover rounded-full bg-white p-1"
							/>
						)}
						<span>{record.name}</span>
					</div>
				);
			}}
		/>
	);
}
