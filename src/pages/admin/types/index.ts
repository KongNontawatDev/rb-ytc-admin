
export type Admin = {
  id:number
  role_id:number
  name:string
  password:string
  email:string
  reset_token:string
  reset_token_expiry:string
  refresh_token:string
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
  role_id?: string;
}

export const initialAdminData: Partial<Admin> = {
  name:"test"
};