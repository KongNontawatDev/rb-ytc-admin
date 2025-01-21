import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Room } from "../types";
import { useNotification } from "../../../hooks/useNotification";
import api from "../../../libs/api";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../../types/axiosType";
import { delay } from "../../../utils/promise";
import { handleApiError } from "../../../utils/errorHandler";
import { useNavigate } from "react-router-dom";

// Hook สำหรับเพิ่มข้อมูลสินค้า
export const useCreateRoom = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { t } = useTranslation(["common", "room"]);
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const navigate = useNavigate();
	return useMutation({
	mutationFn: async (newRoom: any) => {
			delete newRoom.id;

			// Insert the Room into the database
			const { data } = await api.post(`/admin/room`, newRoom,{
				headers:{
					"Content-Type":"multipart/form-data"
				}
			});

			if (!data) {
				throw new Error(`Room creation failed`);
			}

			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:createData.success", { data: t("room:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["rooms"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			handleApiError(error, showErrorNotification,navigate);
		},
	});
};

// Hook สำหรับลบข้อมูลสินค้า
export const useDeleteRoom = () => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "room"]);

	return useMutation({
		mutationFn: async (roomId: number) => {
			const { data } = await api.delete(`/admin/room/${roomId}`);
			if (!data) throw new Error("Room updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:deleteData.success", { data: t("room:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["rooms"] });
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:deleteData.error", { data: t("room:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

export const useDeleteSelectedRoom = () => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "room"]);

	return useMutation({
		mutationFn: async (id: React.Key[]) => {
			const { data } = await api.post(`/admin/room/delete-many`, { id });
			if (!data) throw new Error("Room updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:deleteData.success", { data: t("room:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["rooms"] });
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:deleteData.error", { data: t("room:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateRoom = (handleSuccess: () => void) => {
  const queryClient = useQueryClient();
  const { showSuccessNotification, showErrorNotification } = useNotification();
  const { t } = useTranslation(["common", "room"]);
  
  return useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const { data } = await api.patch(
        `/admin/room/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      if (!data) throw new Error("Room update failed");
      return data;
    },
    onSuccess: () => {
      showSuccessNotification(
        t("common:editData.success", { data: t("room:title") })
      );
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room"] });
      handleSuccess();
    },
    onError: (error: any) => {
      showErrorNotification(
        t("common:editData.error", { data: t("room:title") }),
        error.response?.data.message || error.message
      );
    },
  });
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateSelectedStatusRoom = (
	handleSuccess: () => void
) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "room"]);

	const navigate = useNavigate();
	return useMutation({
		mutationFn: async (updateRoomData: {
			id: number[];
			status: number;
		}) => {
			await delay(2000);
			const { data } = await api.post(
				`/admin/room/update-status-many`,
				updateRoomData
			);
			if (!data) throw new Error("Room updated fail");
			return data;
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("room:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["rooms"] });
			queryClient.invalidateQueries({ queryKey: ["room"] });
			handleSuccess();
		},
		onError: (error: any) => {
			handleApiError(error, showErrorNotification, navigate);
		},
	});
};

// Hook สำหรับแก้ไขข้อมูลสินค้า
export const useUpdateStatusRoom = (handleSuccess: () => void) => {
	const queryClient = useQueryClient();
	const { showSuccessNotification, showErrorNotification } = useNotification();
	const { t } = useTranslation(["common", "room"]);

	return useMutation({
		mutationFn: async (
			updateRoomData: Pick<Room, "status" | "id">
		) => {
			if (updateRoomData.id) {
				const { data } = await api.patch(
					`/admin/room/update/status/${updateRoomData.id}`,
					{ status: updateRoomData.status }
				);
				if (!data) throw new Error("Room updated fail");
				return data;
			} else {
				throw new Error("Room updated fail : Not id");
			}
		},
		onSuccess: () => {
			showSuccessNotification(
				t("common:editData.success", { data: t("room:title") })
			);
			queryClient.invalidateQueries({ queryKey: ["rooms"] });
			queryClient.invalidateQueries({ queryKey: ["room"] });
			handleSuccess();
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			showErrorNotification(
				t("common:editData.error", { data: t("room:title") }),
				error.response?.data.message || error.message
			);
		},
	});
};
