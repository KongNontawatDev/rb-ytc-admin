import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { BookingList } from "../types";
import { useNotification } from "../../../hooks/useNotification";
import api from "../../../libs/api";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../../types/axiosType";
import { delay } from "../../../utils/promise";
import { handleApiError } from "../../../utils/errorHandler";
import { useNavigate } from "react-router-dom";


// Hook สำหรับเพิ่มข้อมูลสินค้า
export const useCreateBookingList = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { t } = useTranslation(["common", "booking_list"]);
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: async (newBookingList: Omit<BookingList,'id'>) => {

			// Insert the BookingList into the database
			const { data } = await api.post(`/admin/booking_list`, newBookingList);

			if (!data) {
				throw new Error(`BookingList creation failed`);
			}

			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:createData.success", { data: t("booking_list:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["booking_lists"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			handleApiError(error, showErrorNotification,navigate);
		},
	});
};

// Hook สำหรับลบข้อมูลสินค้า
export const useDeleteBookingList = () => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "booking_list"]);

	return useMutation({
		mutationFn: async (booking_listId: number) => {
			const { data } = await api.delete(`/admin/booking_list/${booking_listId}`);
			if (!data) throw new Error("BookingList updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:deleteData.success", { data: t("booking_list:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["booking_lists"] });
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:deleteData.error", { data: t("booking_list:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

export const useDeleteSelectedBookingList = () => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "booking_list"]);

	return useMutation({
		mutationFn: async (id: React.Key[]) => {
			const { data } = await api.post(`/admin/booking_list/delete-many`, { id });
			if (!data) throw new Error("BookingList updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:deleteData.success", { data: t("booking_list:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["booking_lists"] });
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:deleteData.error", { data: t("booking_list:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateBookingList = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "booking_list"]);

	return useMutation({
		mutationFn: async (updateBookingListData: BookingList) => {
			const { data } = await api.patch(
				`/admin/booking_list/${updateBookingListData.id}`,
				updateBookingListData
			);
			if (!data) throw new Error("BookingList updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("booking_list:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["booking_lists"] });
			queryClient.invalidateQueries({ queryKey: ["booking_list"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:editData.error", { data: t("booking_list:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateSelectedStatusBookingList = (
	handleSuccess: () => void
) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "booking_list"]);

	const navigate = useNavigate();
	return useMutation({
		mutationFn: async (updateBookingListData: {
			id: number[];
			status: number;
		}) => {
			await delay(2000);
			const { data } = await api.post(
				`/admin/booking_list/update-status-many`,
				updateBookingListData
			);
			if (!data) throw new Error("BookingList updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("booking_list:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["booking_lists"] });
			queryClient.invalidateQueries({ queryKey: ["booking_list"] });
			handleSuccess();
		},
		onError: (error: any) => {
			handleApiError(error, showErrorNotification, navigate);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateStatusBookingList = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "booking_list"]);

	return useMutation({
		mutationFn: async (
			updateBookingListData: Pick<BookingList, "status" | "id">
		) => {
			if (updateBookingListData.id) {
				const { data } = await api.patch(
					`/admin/booking_list/update/status/${updateBookingListData.id}`,
					{ status: updateBookingListData.status }
				);
				if (!data) throw new Error("BookingList updated fail");
				return data;
			} else {
				throw new Error("BookingList updated fail : Not id");
			}
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("booking_list:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["booking_lists"] });
			queryClient.invalidateQueries({ queryKey: ["booking_list"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:editData.error", { data: t("booking_list:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};
