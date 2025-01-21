import UserForm from "./components/UserForm";
import { useNavigate, useParams } from "react-router-dom";

export default function MyUserForm() {
	const { id } = useParams<"id">();
  const navigate = useNavigate()

	return <UserForm id={id?Number(id):null} mode={id?"edit":"create"}  onSuccess={()=>navigate('/user')}  onCancel={()=>navigate('/user')}/>;
}
