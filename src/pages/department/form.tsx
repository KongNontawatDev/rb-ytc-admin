import DepartmentForm from "./components/DepartmentForm";
import { useNavigate, useParams } from "react-router-dom";

export default function MyDepartmentForm() {
	const { id } = useParams<"id">();
  const navigate = useNavigate()

	return <DepartmentForm id={id?Number(id):null} mode={id?"edit":"create"}  onSuccess={()=>navigate('/department')}  onCancel={()=>navigate('/department')}/>;
}
