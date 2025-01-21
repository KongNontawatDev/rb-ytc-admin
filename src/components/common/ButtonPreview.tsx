import { ExportOutlined } from "@ant-design/icons"
import { Button, Tooltip } from "antd"
import { ButtonSize, ButtonType } from "antd/es/button"

type Props = {
  title?: string | null
  type?: ButtonType
  size?: ButtonSize
  tooltip?: string
  onClick?: React.MouseEventHandler<HTMLElement>
  href?: string
  target?: string
}

export default function ButtonPreview({ title, type = "text", size = "middle", tooltip = "เปิดดูเนื้อหาในหน้าต่างใหม่", onClick, href, target }: Props) {

  if (href) {
    return <Button type={type} icon={<ExportOutlined />} size={size} href={href} target={target}>{title}</Button>
  } else if (onClick) {
    return <Button type={type} icon={<ExportOutlined />} size={size} onClick={onClick}>{title}</Button>
  } else {
    return <Tooltip title={tooltip}><Button type={type} icon={<ExportOutlined />} size={size}>{title}</Button></Tooltip>
  }
}
