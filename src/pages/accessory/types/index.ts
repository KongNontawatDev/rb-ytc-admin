
export type Accessory = {
  id:number
  name:string
  detail:string
  image:string
  status:number
  created_at:Date
  updated_at:Date
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

export const initialAccessoryData: Partial<Accessory> = {
  name:"test"
};