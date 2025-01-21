import { UploadOutlined } from "@ant-design/icons"
import { Button, Tooltip } from "antd"
import { ButtonSize, ButtonType } from "antd/es/button"
import { useNavigate } from "react-router-dom"

type Props = {
  title?: string | null
  type?: ButtonType
  size?: ButtonSize
  tooltip?: string
  path?: string
  onClick?: React.MouseEventHandler<HTMLElement>
}

export default function ButtonExport({
  title = null,
  type = "text",
  size = "middle",
  tooltip="ส่งออก",
  path,
  onClick
}: Props) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (path) {
      navigate(path)
    }
  }

  if (title) {
    return (
      <Button
        type={type}
        icon={<UploadOutlined />}
        size={size}
        onClick={onClick || handleClick}
        className="flex-shrink-0"
      >
        {title}
      </Button>
    )
  }

  return (
    <Tooltip title={tooltip }>
      <Button
        type={type}
        icon={<UploadOutlined />}
        size={size}
        onClick={onClick || handleClick}
        className="flex-shrink-0"
      />
    </Tooltip>
  )
}