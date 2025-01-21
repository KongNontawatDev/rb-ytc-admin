import {DownOutlined, PlusOutlined} from "@ant-design/icons"
import {Button, Dropdown, Menu, Tooltip} from "antd"
import {ButtonSize, ButtonType} from "antd/es/button"
import { MouseEvent, MouseEventHandler } from "react"
import {useNavigate} from "react-router-dom"

type Props = {
  title?: string|null
  type?: ButtonType
  size?: ButtonSize
  path?: string
  tooltip?: string
  disabled?:boolean
  hideArrow?:boolean
  items?: {
    title: string
    href?: string
    onClick?:MouseEventHandler<HTMLElement>
  }[]
  setOpen?: (value: React.SetStateAction<boolean>) => void
  setRowId?: (value: React.SetStateAction<number>) => void
  onClick?: React.MouseEventHandler<HTMLElement>
}

export default function ButtonCreate({title="เพิ่ม", type = "primary", size = "middle", path = "", items,tooltip="เพิ่ม",hideArrow=false, setOpen, setRowId, onClick,disabled=false}: Props) {
  const navigate = useNavigate()
  const onHandleClick = () => {
    if (path == "" && setOpen && setRowId) {
      setOpen(true)
      setRowId(0)
    } else {
      navigate(path)
    }
  }

  const menu: JSX.Element = (
    <Menu>
      {items &&
        items.map((item) => (
          <Menu.Item key={item.title} onClick={(info) => item.href ? navigate(item.href) : item.onClick ? item.onClick(info as unknown as MouseEvent<HTMLElement>) : undefined}>
            {item.title}
          </Menu.Item>
        ))}
    </Menu>
  )

  if (!items) {
    if (title) {
      return (
        <Button type={type} size={size} icon={<PlusOutlined />} onClick={onClick || onHandleClick} disabled={disabled}>
          {title}
        </Button>
      )
    }
    return (
      <Tooltip title={tooltip}>
        <Button type={type} size={size} icon={<PlusOutlined />} onClick={onClick || onHandleClick} disabled={disabled}>
          {title}
        </Button>
      </Tooltip>
    )
  }

  if (title) {
    return (
      <Dropdown dropdownRender={() => menu} trigger={["hover"]}>
        <Button type={type} size={size} icon={<PlusOutlined />} className="flex justify-center items-center">
          {title}
          {!hideArrow && <DownOutlined />}
        </Button>
      </Dropdown>
    )
  }

  return (
    <Tooltip title={tooltip}>
      <Dropdown dropdownRender={() => menu} trigger={["hover"]}>
        <Button type={type} size={size} icon={<PlusOutlined />} className="flex justify-center items-center">
          {title}
          {!hideArrow && <DownOutlined />}
        </Button>
      </Dropdown>
    </Tooltip>
  )
}
