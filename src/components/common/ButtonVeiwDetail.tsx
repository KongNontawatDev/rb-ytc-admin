import { FileSearchOutlined} from "@ant-design/icons"
import {Button, Tooltip} from "antd"
import {ButtonSize, ButtonType} from "antd/es/button"

type Props = {
  title?: string | null
  type?: ButtonType
  size?: ButtonSize
  tooltip?: string
  onClick?: React.MouseEventHandler<HTMLElement>
  path?: string
  block?:boolean
}

export default function ButtonViewDetail({title = null, type = "text", size = "middle", tooltip = "ดูข้อมูล", onClick, path,block=false}: Props) {
  return (
    <>
      {path ? (
        <a href={path}>
          <Button type={type} icon={<FileSearchOutlined />} size={size} block={block}>
            {title }
          </Button>
        </a>
      ) : (
        <Tooltip title={title ? title : tooltip}>
          <Button type={type} icon={<FileSearchOutlined />} size={size} onClick={onClick} block={block}>
            {title }
          </Button>
        </Tooltip>
      )}
    </>
  )
}
