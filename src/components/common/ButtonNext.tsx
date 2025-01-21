import {ArrowRightOutlined} from "@ant-design/icons"
import {Button, Tooltip} from "antd"
import { ButtonSize, ButtonType } from "antd/es/button"

type Props = {
  title?:string
  tooltip?:string
  type?:ButtonType
  size?:ButtonSize
  onClick?:React.MouseEventHandler<HTMLElement>
  path?:string
}

export default function ButtonNext({title,tooltip="ถัดไป",type="primary",size="middle",onClick,path}:Props) {

  const handleClick = () => {
    if (path) {
      window.location.href = path
    }
  }

  return (
    <>
      {title ? (
        <Button
          type={type}
          icon={<ArrowRightOutlined />}
          size={size}
          onClick={onClick || handleClick}
        >
          {title}
        </Button>
      ) : (
        <Tooltip title={tooltip}>
          <Button
            type={type}
            icon={<ArrowRightOutlined />}
            size={size}
            onClick={onClick || handleClick}
          />
        </Tooltip>
      )}
    </>
  )
}