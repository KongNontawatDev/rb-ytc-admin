import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Accessory } from "../types";
import { useNotification } from "../../../hooks/useNotification";
import api from "../../../libs/api";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../../types/axiosType";
import { delay } from "../../../utils/promise";
import { handleApiError } from "../../../utils/errorHandler";
import { useNavigate } from "react-router-dom";

// interface AccessoryWithFiles extends Omit<Accessory, "image"> {
// 	image?: string | string[];
// 	imageFiles?: RcFile[];
// }

// Hook สำหรับเพิ่มข้อมูลสินค้า
export const useCreateAccessory = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { t } = useTranslation(["common", "accessory"]);
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: async (newAccessory: Partial<Accessory>) => {
			delete newAccessory.id;

			// Insert the Accessory into the database
			const { data } = await api.post(`/admin/accessory`, newAccessory,{
				headers:{
					"Content-Type":"multipart/form-data"
				}
			});

			if (!data) {
				throw new Error(`Accessory creation failed`);
			}

			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:createData.success", { data: t("accessory:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["accessorys"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			handleApiError(error, showErrorNotification,navigate);
		},
	});
};

// Hook สำหรับลบข้อมูลสินค้า
export const useDeleteAccessory = () => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "accessory"]);

	return useMutation({
		mutationFn: async (accessoryId: number) => {
			const { data } = await api.delete(`/admin/accessory/${accessoryId}`);
			if (!data) throw new Error("Accessory updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:deleteData.success", { data: t("accessory:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["accessorys"] });
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:deleteData.error", { data: t("accessory:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

export const useDeleteSelectedAccessory = () => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "accessory"]);

	return useMutation({
		mutationFn: async (id: React.Key[]) => {
			const { data } = await api.post(`/admin/accessory/delete-many`, { id });
			if (!data) throw new Error("Accessory updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:deleteData.success", { data: t("accessory:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["accessorys"] });
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:deleteData.error", { data: t("accessory:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateAccessory = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "accessory"]);

	return useMutation({
		mutationFn: async (updateAccessoryData: Accessory) => {
			const { data } = await api.patch(
				`/admin/accessory/${updateAccessoryData.id}`,
				updateAccessoryData,{
				headers:{
					"Content-Type":"multipart/form-data"
				}
			}
			);
			if (!data) throw new Error("Accessory updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("accessory:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["accessorys"] });
			queryClient.invalidateQueries({ queryKey: ["accessory"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:editData.error", { data: t("accessory:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateSelectedStatusAccessory = (
	handleSuccess: () => void
) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "accessory"]);

	const navigate = useNavigate();
	return useMutation({
		mutationFn: async (updateAccessoryData: {
			id: number[];
			status: number;
		}) => {
			await delay(2000);
			const { data } = await api.post(
				`/admin/accessory/update-status-many`,
				updateAccessoryData
			);
			if (!data) throw new Error("Accessory updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("accessory:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["accessorys"] });
			queryClient.invalidateQueries({ queryKey: ["accessory"] });
			handleSuccess();
		},
		onError: (error: any) => {
			handleApiError(error, showErrorNotification, navigate);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateStatusAccessory = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "accessory"]);

	return useMutation({
		mutationFn: async (
			updateAccessoryData: Pick<Accessory, "status" | "id">
		) => {
			if (updateAccessoryData.id) {
				const { data } = await api.patch(
					`/admin/accessory/update/status/${updateAccessoryData.id}`,
					{ status: updateAccessoryData.status }
				);
				if (!data) throw new Error("Accessory updated fail");
				return data;
			} else {
				throw new Error("Accessory updated fail : Not id");
			}
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("accessory:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["accessorys"] });
			queryClient.invalidateQueries({ queryKey: ["accessory"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:editData.error", { data: t("accessory:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};
