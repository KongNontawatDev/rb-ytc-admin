import {UndoOutlined} from "@ant-design/icons"
import {Button, Tooltip} from "antd"
import { ButtonSize, ButtonType } from "antd/es/button"

type Props = {
  title?:string|null
  type?:ButtonType
  size?:ButtonSize
  tooltip?:string
  onClick:(React.MouseEventHandler<HTMLElement>)
  disabled?:boolean
}

export default function ButtonClearForm({title,type="text",size="middle",tooltip="ล้าง",onClick,disabled=false}:Props) {
  
  const button = (
    <Button
      type={type}
      icon={<UndoOutlined />}
      size={size}
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </Button>
  )

  if (title) {
    return button
  } else {
    return (
      <Tooltip title={tooltip}>
        {button}
      </Tooltip>
    )
  }
}