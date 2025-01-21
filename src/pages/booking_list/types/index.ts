import { Department } from "../../department/types"
import { Room } from "../../room/types"
import { User } from "../../user/types"

export type BookingList = {
  id:number
  department_id:number
  room_id:number
  user_id:number
  booking_number:string
  tel:string
  user_name:string
  title:string
  detail:string
  book_start:Date
  book_end:Date
  status:number
  created_at:Date
  updated_at:Date

  room:Room
  department:Department
  user:User
}

export interface FilterQuery {
  textSearch?: string;
  searchField?: string;
  page?: number;
  pageSize?: number;
  sortOrder?: 'asc' | 'desc';
  sortField?: string;
  status?: string;
}

export const initialBookingListData: Partial<BookingList> = {
  
};