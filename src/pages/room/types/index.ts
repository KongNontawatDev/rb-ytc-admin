import { Accessory } from "../../accessory/types"
import { BookingList } from "../../booking_list/types"

export type Room = {
  id:number
  name:string
  detail:string
  status:number
  size:string
  location:string
  capacity:string
  created_at:Date
  updated_at:Date

  image:string

  room_image:{
    id:number
    room_id:number
    image:string
  }[]
  room_accessory:{
    id:number
    room_id:number
    accessory_id:number
    accessory:Accessory
  }[]

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
}

export const initialUserData: Partial<Room> = {
  name:"test"
};