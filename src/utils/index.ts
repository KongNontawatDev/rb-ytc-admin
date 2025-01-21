/**
 * นำ object มาแปลงเป็น StringQuery
 * @param '{limit:5,page:1,textfilter:"test"}'
 * @returns ?limit=5&page=1&textfilter=test
 */
export const buildURLSearchParams = (filter: any): URLSearchParams => {
  const params = new URLSearchParams()

  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined) {
      const paramValue = key === "sortorder" ? convertOrderCondition(value as string) : String(value)
      params.append(key, paramValue)
    }
  })

  return params
}

/**
 * แปลงค่าการจัดเรียงใหม่ ถ้าเป็น ascend ให้แปลงเป็น asc แต่ถ้าเป็น descend ให้แปลงเป้น desc
 * @param order ascend | descend
 * @returns asc | desc
 */
export const convertOrderCondition = (order:string) => {
  const result = order == 'ascend' || order == 'asc' ? 'asc' : (order == 'descend' || order == 'desc' ? 'desc' : "")
  return result
}


  