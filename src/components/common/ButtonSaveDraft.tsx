import {SaveOutlined} from "@ant-design/icons"
import {Button, Tooltip} from "antd"
import {ButtonSize, ButtonType} from "antd/es/button"

type Props = {
  title?: string
  type?: ButtonType
  tooltip?:string
  size?: ButtonSize
  onClick?: React.MouseEventHandler<HTMLElement>
  path?: string
}

export default function ButtonSaveDraft({title = "บันทึกดราฟ", tooltip = "บันทึกดราฟ", type = "default", size = "middle", onClick, path}: Props) {

  return (
    <>
      {path ? (
        <a href={path}>
          <Button type={type} icon={<SaveOutlined />} size={size}>
            {title}
          </Button>
        </a>
      ) : (
        <Tooltip title={title ? undefined : tooltip}>
          <Button type={type} icon={<SaveOutlined />} size={size} onClick={onClick}>
            {title}
          </Button>
        </Tooltip>
      )}
    </>
  )
}