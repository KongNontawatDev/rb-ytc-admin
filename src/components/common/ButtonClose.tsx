import {CloseOutlined} from "@ant-design/icons"
import {Button, Tooltip} from "antd"
import {ButtonSize, ButtonType} from "antd/es/button"
import { useNavigate } from "react-router-dom"

type Props = {
  title?: string
  type?: ButtonType
  size?: ButtonSize
  tooltip?: string
  onClick?: React.MouseEventHandler<HTMLElement>
  path?: string
}

export default function ButtonClose({title, type = "text", size = "middle", tooltip="ปิด", onClick, path}: Props) {
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
      <Button type={type} icon={<CloseOutlined className="text-black"/>} size={size} onClick={handleClick} className="absolute top-0 right-0 bg-white rounded-full">
        {title}
      </Button>
    )
  }

  return (
    <Tooltip title={tooltip}>
      <Button type={type} icon={<CloseOutlined className="text-black"/>} size={size} onClick={handleClick} className="absolute top-0 right-0 bg-white rounded-full" />
    </Tooltip>
  )
}
