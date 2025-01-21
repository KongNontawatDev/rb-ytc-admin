import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { FormMode } from "../types/formType";
import { useTranslation } from "react-i18next";

export const getModalIcon = (mode:FormMode) => {
  switch (mode) {
    case "create":
      return <PlusOutlined key="form-create"/>;
    case "edit":
      return <EditOutlined key="form-edit"/>;
    case "view":
      return <EyeOutlined key="form-view"/>;
  }
};

export const getModalTitle = (mode:FormMode,title:string) => {
  const {t} = useTranslation("common")
  switch (mode) {
    case "create":
      return t("titleFormCreate",{data:title});
    case "edit":
      return t("titleFormEdit",{data:title});
    case "view":
      return t("titleFormView",{data:title});
  }
};
