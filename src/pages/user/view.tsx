import UserForm from "./components/UserForm";
import { useNavigate, useParams } from "react-router-dom";
export default function MyUserView() {
  const { id } = useParams<"id">();
  const navigate = useNavigate()

  return (
    <UserForm id={Number(id)} mode="view" onSuccess={()=>navigate('/user')} onCancel={()=>navigate('/user')}/>
  );
}