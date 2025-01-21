import { BookingList } from "../../booking_list/types"

export type Dashboard = {
  booking_list_count:number
  room_count:number
  user_count:number
  accessory_count:number
  bookings_by_month:{
    month:number
    month_name:string
    count:number
  }[]
  booking_list:BookingList[]
}

