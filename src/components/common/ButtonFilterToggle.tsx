import {FilterFilled, FilterOutlined} from "@ant-design/icons"
import {Button, Tooltip} from "antd"
import { ButtonSize } from "antd/es/button"

type Props = {
  title?:string|null
  size?:ButtonSize
  tooltip?:string
  onClick?:React.MouseEventHandler<HTMLElement>
  path?:string
  state:boolean
}

export default function ButtonFilterToggle({
  title,
  size="middle",
  tooltip="ตัวกรองข้อมูล",
  onClick,
  path,
  state=true
}:Props) {

  const buttonProps = path ? {
    href: path
  } : {
    onClick
  }

  return (
    <>
      {title ? (
        <Button
          type={state?'default':'text'}
          icon={state?<FilterFilled/>:<FilterOutlined />}
          size={size}
          className="flex-shrink-0"
          {...buttonProps}
        >
          {title}
        </Button>
      ) : (
        <Tooltip title={tooltip}>
          <Button
            type={state?'default':'text'}
            icon={state?<FilterFilled/>:<FilterOutlined />}
            size={size}
            className="flex-shrink-0"
            {...buttonProps}
          >
            {title}
          </Button>
        </Tooltip>
      )}
    </>
  )
}