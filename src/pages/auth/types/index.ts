import { Admin } from "../../admin/types";

export const initialLoginForm = {
  email: '',
  password: '',
  remember:true
};

export type FormLoginType = {
  email:string
  password:string
};

export type FormResetPasswordType = {
  email:string
}

export type FormConfirmPasswordType = {
  id:number
  newPassword: string; 
  currentPassword: string, 
}

export type FormLoginResponse = Admin&{
  accessToken:string
}

export default {
  initialLoginForm,
}

