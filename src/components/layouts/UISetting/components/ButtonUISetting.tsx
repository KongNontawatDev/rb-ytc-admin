import { FloatButton } from "antd";
import { useState } from "react";
import DrawerUISetting from "./DrawerUISetting";
import { SettingOutlined } from "@ant-design/icons";

export default function ButtonUISetting() {
  const [open, setOpen] = useState(false);
  return (
    <>
    <DrawerUISetting open={open} onClose={()=>setOpen(false)}/>
    <FloatButton onClick={() => setOpen(true)} icon={<SettingOutlined/>}/>
    </>
  )
}