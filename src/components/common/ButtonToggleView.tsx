import { TableOutlined, UnorderedListOutlined } from "@ant-design/icons"
import { Button,  Tooltip } from "antd"
import { useTranslation } from "react-i18next"


type Props = {
  view:"table"|"card"
  setToggleView:()=>void
}

export default function ButtonToggleView({
  view,
  setToggleView
}: Props) {
  const {t} = useTranslation("common")
  return (
    <Tooltip title={view=="card"?t("toggleDisplayToTable"):t("toggleDisplayToCard")}>
      <Button
        type={"text"}
        icon={view=="card"?<UnorderedListOutlined />:<TableOutlined />}
        size={"middle"}
        onClick={()=>setToggleView()}
        className="flex-shrink-0"
      />
    </Tooltip>
  )
}