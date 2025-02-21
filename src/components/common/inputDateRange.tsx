// ThaiDateRangePicker.tsx
import React from "react";
import { DatePicker } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import buddhistEra from "dayjs/plugin/buddhistEra";
import locale from "antd/es/date-picker/locale/th_TH";
import "dayjs/locale/th";
import { SizeType } from "antd/es/config-provider/SizeContext";

// Extend dayjs with required plugins
dayjs.extend(customParseFormat);
dayjs.extend(buddhistEra);
dayjs.locale("th");

// Thai locale configuration
export const datePickerTh = {
  ...locale,
  lang: {
    ...locale.lang,
    yearFormat: "BBBB",
    dateFormat: "M/D/BBBB",
    dateTimeFormat: "M/D/BBBB HH:mm:ss",
    cellYearFormat:"BBBB"//รองรับปีภาษาไทย
  },
  dateFormat: "BBBB-MM-DD",
  dateTimeFormat: "BBBB-MM-DD HH:mm:ss",
  weekFormat: "BBBB-wo",
  monthFormat: "BBBB-MM",
  yearFormat: "BBBB",
}
interface ThaiDateRangePickerProps {
	value?: [dayjs.Dayjs | null, dayjs.Dayjs | null];
  onChange?: RangePickerProps['onChange'];
	format?: string | string[];
	placement?: RangePickerProps["placement"];
	size?: SizeType;
	allowClear?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	className?: string;
	placeholder?: [string, string];
}

export const InputDateRange: React.FC<ThaiDateRangePickerProps> = ({
	value,
	onChange,
	format = "DD/MM/BBBB",
	placement = "bottomLeft",
	size = "middle",
	allowClear = true,
	disabled = false,
	style = { width: "100%" },
	className,
	placeholder = ["วันที่เริ่มต้น", "วันที่สิ้นสุด"],
}) => {
	const { RangePicker } = DatePicker;

	return (
		<RangePicker
			value={value}
			onChange={onChange}
			format={format}
			locale={datePickerTh}
			placement={placement}
			size={size}
			allowClear={allowClear}
			disabled={disabled}
			style={style}
			className={className}
			placeholder={placeholder}
		/>
	);
};
