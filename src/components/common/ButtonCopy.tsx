import {CopyOutlined, CheckOutlined} from "@ant-design/icons"
import {App, Button, Tooltip} from "antd"
import {ButtonSize, ButtonType} from "antd/es/button"
import { useState } from "react"
import { useTranslation } from "react-i18next"

type Props = {
  title?: string
  type?: ButtonType
  size?: ButtonSize
  textToCopy: string
  disabled?:boolean
}

export default function ButtonCopy({title, type = "text", size = "small",  textToCopy,disabled=false}: Props) {
  const [isCopied, setIsCopied] = useState(false)
  const {t} = useTranslation("common")
  const {message} = App.useApp()
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        message.success(t("copyData.success",{data:title}))
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 3000)
      })
      .catch(() => {
        message.error(t("copyData.error",{data:title}))
      });
  }

  const icon = isCopied ? <CheckOutlined /> : <CopyOutlined />

  return (
    <Tooltip title={t("copyData.title",{data:title})}>
      <Button disabled={disabled} type={type} icon={icon} size={size} onClick={handleCopy}  />
    </Tooltip>
  )
}