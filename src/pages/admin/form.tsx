import AdminForm from "./components/AdminForm";
import { useNavigate, useParams } from "react-router-dom";

export default function MyAdminForm() {
	const { id } = useParams<"id">();
  const navigate = useNavigate()

	return <AdminForm id={id?Number(id):null} mode={id?"edit":"create"}  onSuccess={()=>navigate('/admin')}  onCancel={()=>navigate('/admin')}/>;
}
