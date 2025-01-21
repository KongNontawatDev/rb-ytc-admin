import { Modal } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type DeleteFn<T> = (id: T) => Promise<void>;

export const useDeleteConfirmation = <T,>(
  title:string,
  deleteFn: DeleteFn<T>,
) => {
  const {t} = useTranslation("common")

  const showDeleteConfirmation = useCallback(
    async (id: T) => {
      try {
        await new Promise((resolve, reject) => {
          Modal.confirm({
            title:t("deleteSelected"),
            content:t("deleteData.confirm",{data:title}),
            okText:t("confirm"),
            okType: 'danger',
            closable:true,
            onOk: async () => {
              try {
                await deleteFn(id);
                resolve(true);
              } catch (error) {
                reject(error);
              }
            },
            onCancel: () => {
              resolve(false);
            },
            onClose:()=> {
              resolve(false)
            }
          });
        });
      } catch (error) {
        console.error("Delete failed:", error);
      }
    },
    [deleteFn]
  );

  return showDeleteConfirmation;
};