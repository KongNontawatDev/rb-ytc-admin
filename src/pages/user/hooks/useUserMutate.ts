import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { User } from "../types";
import { useNotification } from "../../../hooks/useNotification";
import api from "../../../libs/api";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../../types/axiosType";
import { delay } from "../../../utils/promise";
import { handleApiError } from "../../../utils/errorHandler";
import { useNavigate } from "react-router-dom";

// interface UserWithFiles extends Omit<User, "image"> {
// 	image?: string | string[];
// 	imageFiles?: RcFile[];
// }

// Hook สำหรับเพิ่มข้อมูลสินค้า
export const useCreateUser = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { t } = useTranslation(["common", "user"]);
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const navigate = useNavigate();
	return useMutation({
	mutationFn: async (newUser: Partial<User>) => {
			delete newUser.id;

			// Insert the User into the database
			const { data } = await api.post(`/admin/user`, newUser,{
				headers:{
					"Content-Type":"multipart/form-data"
				}
			});

			if (!data) {
				throw new Error(`User creation failed`);
			}

			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:createData.success", { data: t("user:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["users"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			handleApiError(error, showErrorNotification,navigate);
		},
	});
};

// Hook สำหรับลบข้อมูลสินค้า
export const useDeleteUser = () => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "user"]);

	return useMutation({
		mutationFn: async (userId: number) => {
			const { data } = await api.delete(`/admin/user/${userId}`);
			if (!data) throw new Error("User updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:deleteData.success", { data: t("user:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:deleteData.error", { data: t("user:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

export const useDeleteSelectedUser = () => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "user"]);

	return useMutation({
		mutationFn: async (id: React.Key[]) => {
			const { data } = await api.post(`/admin/user/delete-many`, { id });
			if (!data) throw new Error("User updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:deleteData.success", { data: t("user:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:deleteData.error", { data: t("user:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateUser = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "user"]);

	return useMutation({
		mutationFn: async (updateUserData: User) => {
			const { data } = await api.patch(
				`/admin/user/${updateUserData.id}`,
				updateUserData,{
				headers:{
					"Content-Type":"multipart/form-data"
				}
			}
			);
			if (!data) throw new Error("User updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("user:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["user"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:editData.error", { data: t("user:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateSelectedStatusUser = (
	handleSuccess: () => void
) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "user"]);

	const navigate = useNavigate();
	return useMutation({
		mutationFn: async (updateUserData: {
			id: number[];
			status: number;
		}) => {
			await delay(2000);
			const { data } = await api.post(
				`/admin/user/update-status-many`,
				updateUserData
			);
			if (!data) throw new Error("User updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("user:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["user"] });
			handleSuccess();
		},
		onError: (error: any) => {
			handleApiError(error, showErrorNotification, navigate);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateStatusUser = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "user"]);

	return useMutation({
		mutationFn: async (
			updateUserData: Pick<User, "status" | "id">
		) => {
			if (updateUserData.id) {
				const { data } = await api.patch(
					`/admin/user/update/status/${updateUserData.id}`,
					{ status: updateUserData.status }
				);
				if (!data) throw new Error("User updated fail");
				return data;
			} else {
				throw new Error("User updated fail : Not id");
			}
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("user:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["user"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:editData.error", { data: t("user:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};
