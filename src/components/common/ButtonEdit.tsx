import {EditOutlined} from "@ant-design/icons"
import {Button, Tooltip} from "antd"
import {ButtonSize, ButtonType} from "antd/es/button"
import { ReactNode } from "react"
import { useNavigate } from "react-router-dom"

type Props = {
  title?: string | null
  type?: ButtonType
  size?: ButtonSize
  tooltip?: string
  block?: boolean
  disabled?: boolean
  icon?: ReactNode
  onClick?: React.MouseEventHandler<HTMLElement>
  path?: string
}

export default function ButtonEdit({title = null, type = "text", size = "middle", tooltip="แก้ไข", block = false, disabled = false, onClick, icon, path}: Props) {
  const navigate = useNavigate()

  const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
    if (path) {
      navigate(path)
    } else if (onClick) {
      onClick(e)
    }
  }

  if (title) {
    return (
      <Button block={block} type={type} icon={icon ? icon : <EditOutlined />} size={size} onClick={handleClick} disabled={disabled}>
        {title}
      </Button>
    )
  }

  return (
    <Tooltip title={tooltip}>
      <Button block={block} type={type} icon={icon ? icon : <EditOutlined />} size={size} onClick={handleClick} disabled={disabled} />
    </Tooltip>
  )
}
