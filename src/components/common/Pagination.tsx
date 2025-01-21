import { Pagination as AntdPagination,Typography, PaginationProps } from "antd";
import { useTranslation } from "react-i18next";

interface PaginationPropsX extends PaginationProps {
  totalItem:number
  totalRecord:number
  limit:number
  showSizeChanger:boolean
}

const {Text} = Typography

export const Pagination = ({current,limit=0,onChange,totalItem=0,totalRecord=0,showSizeChanger}:PaginationPropsX) => {
  const {t} = useTranslation(["common"])
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'20px',flexWrap:'wrap'}}>
      { window.innerWidth >= 768 && <Text>{t("common:paginationDetail",{data:totalItem,total:totalRecord})}</Text>}
      <AntdPagination current={current} pageSize={limit} total={totalItem} onChange={onChange}  showSizeChanger={showSizeChanger}  />
    </div>
  )
}
