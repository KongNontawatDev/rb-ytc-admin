import {ArrowLeftOutlined} from "@ant-design/icons"
import Icon from "@ant-design/icons/lib/components/Icon"
import {Button, Space, Tooltip} from "antd"
import Title from "antd/es/typography/Title"
import {ComponentType,} from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

type Props = {
  title: string
  icon?: ComponentType | undefined
  path?: string
  back?:boolean
}

export default function TitleHeader({title = "", icon, path="#",back=true}: Props) {
  const {t} = useTranslation("common")
  const navigate = useNavigate()
  return (
    <Space>
      {back?<Tooltip title={t("back")}><Button type="text" icon={<ArrowLeftOutlined/>} onClick={()=>navigate(path)}></Button></Tooltip>:null}
      <Title level={4} style={{margin: "10px 0 0"}} className="line-clamp-1"><Icon component={icon}/> {title}</Title>
    </Space>
  )
}
