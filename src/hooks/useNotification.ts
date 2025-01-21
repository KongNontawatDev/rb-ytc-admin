import { App } from 'antd';

export const useNotification = () => {
  const { notification } = App.useApp();

  const showSuccessNotification = (message: string, description?: string) => {
    notification.success({
      message,
      description,
      placement:'bottomLeft'
    });
  };

  const showErrorNotification = (message: string, description?: string) => {
    notification.error({
      message,
      description,
      placement:'bottomLeft'
    });
  };

  const showInfoNotification = (message: string, description?: string) => {
    notification.info({
      message,
      description,
      placement:'bottomLeft'
    });
  };

  const showWarningNotification = (message: string, description?: string) => {
    notification.warning({
      message,
      description,
      placement:'bottomLeft'
    });
  };

  return {
    showSuccessNotification,
    showErrorNotification,
    showInfoNotification,
    showWarningNotification,
  };
};

