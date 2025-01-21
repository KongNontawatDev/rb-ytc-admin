import AccessoryForm from "./components/AccessoryForm";
import { useNavigate, useParams } from "react-router-dom";
export default function MyAccessoryView() {
  const { id } = useParams<"id">();
  const navigate = useNavigate()

  return (
    <AccessoryForm id={Number(id)} mode="view" onSuccess={()=>navigate('/accessory')} onCancel={()=>navigate('/accessory')}/>
  );
}