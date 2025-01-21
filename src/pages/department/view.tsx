import DepartmentForm from "./components/DepartmentForm";
import { useNavigate, useParams } from "react-router-dom";
export default function DepartmentView() {
  const { id } = useParams<"id">();
  const navigate = useNavigate()

  return (
    <DepartmentForm id={Number(id)} mode="view" onSuccess={()=>navigate('/department')} onCancel={()=>navigate('/department')}/>
  );
}