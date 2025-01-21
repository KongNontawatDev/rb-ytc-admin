import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import buddhistEra from "dayjs/plugin/buddhistEra"
import locale from "antd/es/date-picker/locale/th_TH"
import "dayjs/locale/th"
import DatePicker from "../../libs/DatePicker"
import {DatePickerProps} from "antd"
import {SizeType} from "antd/es/config-provider/SizeContext"
dayjs.extend(customParseFormat)
dayjs.extend(buddhistEra)
dayjs.locale("th")

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

type Props = {
  placeholder?: string
  onChange?: (date: dayjs.Dayjs, dateString: string | string[]) => void
  value?: dayjs.Dayjs | null
  placement?: DatePickerProps["placement"]
  picker?: "date" | "week" | "month" | "year"
  size?: SizeType
  format?: string | string[]
}

export default function InputDate({format = "DD/MM/BBBB", placeholder = "เลือกวันที่", onChange, value, placement = "bottomLeft", picker = "date", size = "middle"}: Props) {
  return <DatePicker format={format} style={{width: "100%"}} locale={datePickerTh} size={size} allowClear value={value} onChange={onChange} placeholder={placeholder} placement={placement} picker={picker} />
}
