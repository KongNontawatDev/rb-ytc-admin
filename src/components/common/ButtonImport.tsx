import {DownloadOutlined} from "@ant-design/icons"
import {Button, Tooltip} from "antd"
import {ButtonSize, ButtonType} from "antd/es/button"
import { useNavigate } from "react-router-dom"

type Props = {
  title?: string | null
  type?: ButtonType
  size?: ButtonSize
  tooltip?: string
  onClick?: React.MouseEventHandler<HTMLElement>
  path?: string
}

export default function ButtonImport({
  title,
  type = "text", 
  size = "middle",
  tooltip="นำเข้าข้อมูล",
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

  const tooltipTitle = tooltip || (title)

  return (
    <Tooltip title={tooltipTitle}>
      <Button 
        type={type} 
        icon={<DownloadOutlined />} 
        size={size} 
        onClick={handleClick}
        className="flex-shrink-0"
      >
        {title}
      </Button>
    </Tooltip>
  )
}