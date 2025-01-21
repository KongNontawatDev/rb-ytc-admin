import BookingListForm from "./components/BookingListForm";
import { useNavigate, useParams } from "react-router-dom";
export default function BookingListView() {
  const { id } = useParams<"id">();
  const navigate = useNavigate()

  return (
    <BookingListForm id={Number(id)} mode="view" onSuccess={()=>navigate('/booking_list')} onCancel={()=>navigate('/booking_list')}/>
  );
}