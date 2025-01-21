import BookingListForm from "./components/BookingListForm";
import { useNavigate, useParams } from "react-router-dom";

export default function MyBookingListForm() {
	const { id } = useParams<"id">();
  const navigate = useNavigate()

	return <BookingListForm id={id?Number(id):null} mode={id?"edit":"create"}  onSuccess={()=>navigate('/booking_list')}  onCancel={()=>navigate('/booking_list')}/>;
}
