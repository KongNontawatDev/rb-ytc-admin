import {SaveOutlined} from "@ant-design/icons"
import {Button} from "antd"
import {ButtonSize, ButtonType} from "antd/es/button"

type Props = {
  title?: string
  type?: ButtonType
  size?: ButtonSize
  loading?:boolean
  onClick?: React.MouseEventHandler<HTMLElement>
  path?: string
  icon?: React.ReactNode
  block?:boolean
  className?: string
  disabled?:boolean
}

export default function ButtonSave({title = "บันทึกข้อมูล", type = "primary", size = "middle", loading=false,block=false,className, onClick, path, icon,disabled}: Props) {

  return (
    <>
      {path ? (
        <a href={path} className={className}>
          <Button type={type} icon={icon?icon:<SaveOutlined />} loading={loading} block={block} size={size} disabled={disabled}>
            {title}
          </Button>
        </a>
      ) : (
        // <Tooltip title={title ? title : "บันทึกข้อมูล"} placement="top">
          <Button type={type} icon={icon?icon:<SaveOutlined />} loading={loading} block={block} size={size} disabled={disabled} className={className} onClick={onClick} htmlType="submit">
            {title}
          </Button>
        // </Tooltip>
      )}
    </>
  )
}
