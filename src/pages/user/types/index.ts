import { BookingList } from "../../booking_list/types"
import { Department } from "../../department/types"

export type User = {
  id:number
  department_id:number
  full_name:string
  tel:string
  image:string
  status:number
  line_name:string
  line_id:string
  created_at:Date
  updated_at:Date

  department:Department
  booking_list:BookingList[]
}


export interface FilterQuery {
  textSearch?: string;
  searchField?: string;
  page?: number;
  pageSize?: number;
  sortOrder?: 'asc' | 'desc';
  sortField?: string;
  status?: string;
  department_id?: string;
}

export const initialUserData: Partial<User> = {
  full_name:"test"
};