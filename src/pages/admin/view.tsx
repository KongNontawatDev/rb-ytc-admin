import AdminForm from "./components/AdminForm";
import { useNavigate, useParams } from "react-router-dom";
export default function MyAdminView() {
  const { id } = useParams<"id">();
  const navigate = useNavigate()

  return (
    <AdminForm id={Number(id)} mode="view" onSuccess={()=>navigate('/admin')} onCancel={()=>navigate('/admin')}/>
  );
}