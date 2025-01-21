import {ClearOutlined} from "@ant-design/icons"
import {Button, Tooltip} from "antd"
import { ButtonSize, ButtonType } from "antd/es/button"

type Props = {
  title?:string|null
  type?:ButtonType
  size?:ButtonSize
  tooltip?:string
  onClick:(React.MouseEventHandler<HTMLElement>)
}

export default function ButtonClearFilter({title,type="text",size="middle",tooltip="ล้างการค้นหา",onClick}:Props) {
  
  const button = (
    <Button
      type={type}
      icon={<ClearOutlined />}
      size={size}
      onClick={onClick}
      className="flex-shrink-0"
    >
      {title}
    </Button>
  )

  if (title) {
    return button
  }

  return (
    <Tooltip title={tooltip}>
      {button}
    </Tooltip>
  )
}