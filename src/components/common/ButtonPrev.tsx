import {ArrowLeftOutlined} from "@ant-design/icons"
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

export default function ButtonPrev({title,tooltip="ย้อนกลับ",type="text",size="middle",onClick,path}:Props) {
  const tooltipTitle = title

  if (path) {
    return (
      <Button
        type={type}
        icon={<ArrowLeftOutlined />}
        size={size}
        href={path}
        title={tooltipTitle}
      >
        {title}
      </Button>
    );
  } else if (onClick) {
    return (
      <Tooltip title={tooltip}>
        <Button
          type={type}
          icon={<ArrowLeftOutlined />}
          size={size}
          onClick={onClick}
        >
          {title}
        </Button>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title={tooltip}>
        <Button
          type={type}
          icon={<ArrowLeftOutlined />}
          size={size}
        >
          {title}
        </Button>
      </Tooltip>
    );
  }
}