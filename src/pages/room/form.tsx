import RoomForm from "./components/RoomForm";
import { useNavigate, useParams } from "react-router-dom";

export default function MyRoomForm() {
	const { id } = useParams<"id">();
  const navigate = useNavigate()

	return <RoomForm id={id?Number(id):null} mode={id?"edit":"create"}  onSuccess={()=>navigate('/room')}  onCancel={()=>navigate('/room')}/>;
}
