import {FilterOutlined} from "@ant-design/icons"
import {Button, Tooltip} from "antd"
import { ButtonSize, ButtonType } from "antd/es/button"

type Props = {
  title?:string|null
  type?:ButtonType
  size?:ButtonSize
  tooltip?:string
  onClick?:React.MouseEventHandler<HTMLElement>
  path?:string
}

export default function ButtonFilter({
  title,
  type="text",
  size="middle",
  tooltip="กรองข้อมูล",
  onClick,
  path
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
          type={type}
          icon={<FilterOutlined />}
          size={size}
          className="flex-shrink-0"
          {...buttonProps}
        >
          {title}
        </Button>
      ) : (
        <Tooltip title={tooltip}>
          <Button
            type={type}
            icon={<FilterOutlined />}
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