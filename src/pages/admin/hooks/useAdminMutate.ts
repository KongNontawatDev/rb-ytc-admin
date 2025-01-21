import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Admin } from "../types";
import { useNotification } from "../../../hooks/useNotification";
import api from "../../../libs/api";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../../types/axiosType";
import { delay } from "../../../utils/promise";
import { handleApiError } from "../../../utils/errorHandler";
import { useNavigate } from "react-router-dom";

// interface AdminWithFiles extends Omit<Admin, "image"> {
// 	image?: string | string[];
// 	imageFiles?: RcFile[];
// }

// Hook สำหรับเพิ่มข้อมูลสินค้า
export const useCreateAdmin = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { t } = useTranslation(["common", "admin"]);
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const navigate = useNavigate();
	return useMutation({
	mutationFn: async (newAdmin: Partial<Admin>) => {
			delete newAdmin.id;

			// Insert the Admin into the database
			const { data } = await api.post(`/admin/admin`, newAdmin,{
				headers:{
					"Content-Type":"multipart/form-data"
				}
			});

			if (!data) {
				throw new Error(`Admin creation failed`);
			}

			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:createData.success", { data: t("admin:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["admins"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			handleApiError(error, showErrorNotification,navigate);
		},
	});
};

// Hook สำหรับลบข้อมูลสินค้า
export const useDeleteAdmin = () => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "admin"]);

	return useMutation({
		mutationFn: async (adminId: number) => {
			const { data } = await api.delete(`/admin/admin/${adminId}`);
			if (!data) throw new Error("Admin updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:deleteData.success", { data: t("admin:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["admins"] });
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:deleteData.error", { data: t("admin:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

export const useDeleteSelectedAdmin = () => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "admin"]);

	return useMutation({
		mutationFn: async (id: React.Key[]) => {
			const { data } = await api.post(`/admin/admin/delete-many`, { id });
			if (!data) throw new Error("Admin updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:deleteData.success", { data: t("admin:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["admins"] });
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:deleteData.error", { data: t("admin:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateAdmin = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "admin"]);

	return useMutation({
		mutationFn: async (updateAdminData: Admin) => {
			const { data } = await api.patch(
				`/admin/admin/${updateAdminData.id}`,
				updateAdminData,{
				headers:{
					"Content-Type":"multipart/form-data"
				}
			}
			);
			if (!data) throw new Error("Admin updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("admin:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["admins"] });
			queryClient.invalidateQueries({ queryKey: ["admin"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:editData.error", { data: t("admin:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateSelectedStatusAdmin = (
	handleSuccess: () => void
) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "admin"]);

	const navigate = useNavigate();
	return useMutation({
		mutationFn: async (updateAdminData: {
			id: number[];
			status: number;
		}) => {
			await delay(2000);
			const { data } = await api.post(
				`/admin/admin/update-status-many`,
				updateAdminData
			);
			if (!data) throw new Error("Admin updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("admin:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["admins"] });
			queryClient.invalidateQueries({ queryKey: ["admin"] });
			handleSuccess();
		},
		onError: (error: any) => {
			handleApiError(error, showErrorNotification, navigate);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateStatusAdmin = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "admin"]);

	return useMutation({
		mutationFn: async (
			updateAdminData: Pick<Admin, "status" | "id">
		) => {
			if (updateAdminData.id) {
				const { data } = await api.patch(
					`/admin/admin/update/status/${updateAdminData.id}`,
					{ status: updateAdminData.status }
				);
				if (!data) throw new Error("Admin updated fail");
				return data;
			} else {
				throw new Error("Admin updated fail : Not id");
			}
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("admin:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["admins"] });
			queryClient.invalidateQueries({ queryKey: ["admin"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:editData.error", { data: t("admin:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};
