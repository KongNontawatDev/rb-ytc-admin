import {Alert} from "antd"

type Props = {
  message: string
  description?: string
}

export default function AlertSubmitFail({message, description = ""}: Props) {
  return <Alert message={message} description={description} type="error" showIcon closable className="my-2" />
}
