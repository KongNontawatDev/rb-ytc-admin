// utils/uploadHandler.ts
import { RcFile, UploadFile } from "antd/es/upload/interface";
import type { UploadRequestError, UploadRequestOption } from "rc-upload/lib/interface";
import supabase from "../libs/supabase";
import { message } from 'antd';

export const handleUpload = async (
  options: UploadRequestOption,
  bucket: string,
  onSuccess?: () => void
) => {
  const { file } = options;
  const formData = new FormData();
  formData.append('file', file as RcFile, (file as RcFile).name);

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload((file as RcFile).name, formData);

    if (error) throw error;

    if (options.onSuccess) {
      options.onSuccess({ url: data.fullPath, name: (file as RcFile).name });
      onSuccess?.();
    }
  } catch (error: unknown) {
    if (options.onError) {
      options.onError(error as UploadRequestError);
    }
    message.error('Upload failed');
  }
};

export const handleDelete = async (file: UploadFile, bucket: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([file.name]);
    
    if (error) throw error;
    return true;
  } catch (error) {
    message.error('Delete failed');
    console.error(error);
    return false;
  }
};