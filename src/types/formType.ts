// types/form.types.ts
import { UploadFile } from "antd/es/upload/interface";
import { FormInstance } from 'antd';
export type FormMode = 'create' | 'edit' | 'view';
export interface FormValues {
  name?: string;
  document?: UploadFile[];
  [key: string]: any;
}

export interface BaseFormProps {
  form: FormInstance;
  onSubmit: (values: FormValues) => void;
  loading?: boolean;
  initialValues?: FormValues;
}