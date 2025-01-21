import { FilterOutlined} from "@ant-design/icons"
import {Button, Tooltip} from "antd"
import {ButtonSize, ButtonType} from "antd/es/button"
import { useNavigate } from "react-router-dom"

type Props = {
  title?: string | null
  type?: ButtonType
  size?: ButtonSize
  block?: boolean
  tooltip?: string
  onClick?: React.MouseEventHandler<HTMLElement>
  path?: string
}

export default function ButtonMoreFilter({
  title = null,
  type = "text",
  size = "middle",
  block = false,
  tooltip="กรองข้อมูล",
  onClick,
  path
}: Props) {
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
      <Button
        block={block}
        type={type}
        icon={<FilterOutlined />}
        size={size}
        onClick={handleClick}
      >
        {title}
      </Button>
    )
  }

  return (
    <Tooltip title={tooltip}>
      <Button
        block={block}
        type={type}
        icon={<FilterOutlined />}
        size={size}
        onClick={handleClick}
      />
    </Tooltip>
  )
}
