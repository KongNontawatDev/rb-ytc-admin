import AccessoryForm from "./components/AccessoryForm";
import { useNavigate, useParams } from "react-router-dom";

export default function MyAccessoryForm() {
	const { id } = useParams<"id">();
  const navigate = useNavigate()

	return <AccessoryForm id={id?Number(id):null} mode={id?"edit":"create"}  onSuccess={()=>navigate('/accessory')}  onCancel={()=>navigate('/accessory')}/>;
}
