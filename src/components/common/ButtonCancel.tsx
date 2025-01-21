import {CloseOutlined} from "@ant-design/icons"
import {Button, Tooltip} from "antd"
import { ButtonSize, ButtonType } from "antd/es/button"
import { useNavigate } from "react-router-dom"

type Props = {
  title?:string|null
  path?:string
  type?:ButtonType
  size?:ButtonSize
  tooltip?:string
  onClick:(React.MouseEventHandler<HTMLElement>)
  disabled?:boolean
}

export default function ButtonCancel({title=null,path,type="default",size="middle",tooltip="ยกเลิก",onClick,disabled=false}:Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) {
      navigate(path);
    }
  };

  if (title) {
    return (
      <Button
        type={type}
        icon={<CloseOutlined />}
        size={size}
        onClick={onClick || handleClick}
        disabled={disabled}
      >
        {title}
      </Button>
    )
  }

  return (
    <Tooltip title={tooltip }>
      <Button
        type={type}
        icon={<CloseOutlined />}
        size={size}
        onClick={onClick || handleClick}
        disabled={disabled}
      >
      </Button>
    </Tooltip>
  )
}