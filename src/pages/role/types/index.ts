
export type Role = {
  id:number
  name:string
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

export const initialRoleData: Partial<Role> = {
  name:"test"
};