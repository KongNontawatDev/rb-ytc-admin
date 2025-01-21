import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Department } from "../types";
import { useNotification } from "../../../hooks/useNotification";
import api from "../../../libs/api";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../../types/axiosType";
import { delay } from "../../../utils/promise";
import { handleApiError } from "../../../utils/errorHandler";
import { useNavigate } from "react-router-dom";


// Hook สำหรับเพิ่มข้อมูลสินค้า
export const useCreateDepartment = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { t } = useTranslation(["common", "department"]);
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: async (newDepartment: Department) => {

			// Insert the Department into the database
			const { data } = await api.post(`/admin/department`, newDepartment);

			if (!data) {
				throw new Error(`Department creation failed`);
			}

			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:createData.success", { data: t("department:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["departments"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			handleApiError(error, showErrorNotification,navigate);
		},
	});
};

// Hook สำหรับลบข้อมูลสินค้า
export const useDeleteDepartment = () => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "department"]);

	return useMutation({
		mutationFn: async (departmentId: number) => {
			const { data } = await api.delete(`/admin/department/${departmentId}`);
			if (!data) throw new Error("Department updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:deleteData.success", { data: t("department:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["departments"] });
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:deleteData.error", { data: t("department:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

export const useDeleteSelectedDepartment = () => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "department"]);

	return useMutation({
		mutationFn: async (id: React.Key[]) => {
			const { data } = await api.post(`/admin/department/delete-many`, { id });
			if (!data) throw new Error("Department updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:deleteData.success", { data: t("department:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["departments"] });
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:deleteData.error", { data: t("department:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateDepartment = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "department"]);

	return useMutation({
		mutationFn: async (updateDepartmentData: Department) => {
			const { data } = await api.patch(
				`/admin/department/${updateDepartmentData.id}`,
				updateDepartmentData
			);
			if (!data) throw new Error("Department updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("department:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["departments"] });
			queryClient.invalidateQueries({ queryKey: ["department"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:editData.error", { data: t("department:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateSelectedStatusDepartment = (
	handleSuccess: () => void
) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "department"]);

	const navigate = useNavigate();
	return useMutation({
		mutationFn: async (updateDepartmentData: {
			id: number[];
			status: number;
		}) => {
			await delay(2000);
			const { data } = await api.post(
				`/admin/department/update-status-many`,
				updateDepartmentData
			);
			if (!data) throw new Error("Department updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("department:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["departments"] });
			queryClient.invalidateQueries({ queryKey: ["department"] });
			handleSuccess();
		},
		onError: (error: any) => {
			handleApiError(error, showErrorNotification, navigate);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateStatusDepartment = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "department"]);

	return useMutation({
		mutationFn: async (
			updateDepartmentData: Pick<Department, "status" | "id">
		) => {
			if (updateDepartmentData.id) {
				const { data } = await api.patch(
					`/admin/department/update/status/${updateDepartmentData.id}`,
					{ status: updateDepartmentData.status }
				);
				if (!data) throw new Error("Department updated fail");
				return data;
			} else {
				throw new Error("Department updated fail : Not id");
			}
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("department:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["departments"] });
			queryClient.invalidateQueries({ queryKey: ["department"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:editData.error", { data: t("department:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};
