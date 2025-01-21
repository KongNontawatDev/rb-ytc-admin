import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "../../../libs/api";
import { buildURLSearchParams } from "../../../utils";
import { FilterQuery } from "../types";
import { handleApiError } from "../../../utils/errorHandler";
import { useNotification } from "../../../hooks/useNotification";
import { useNavigate } from "react-router-dom";

export const useBookingLists = (filterQuery: FilterQuery) => {
	const [filters, setFilters] = useState<FilterQuery>(filterQuery);
	const { showErrorNotification } = useNotification();
	const navigate = useNavigate();
	const query = useQuery({
		queryKey: ["booking_lists", filters],
		queryFn: async () => {
			try {
				const params = buildURLSearchParams(filterQuery);
				const { data } = await api.get(`/admin/booking_list/search`, {
					params,
				});

				return data;
			} catch (error: any) {
				handleApiError(error, showErrorNotification, navigate);
			}
		},
	});
	return {
		...query,
		setFilters,
	};
};

// Hook สำหรับดึงข้อมูลสินค้าตาม ID หรือไม่ส่ง ID สำหรับทำ form เพิ่มและแก้ไข
export const useBookingListById = (id: number | null | undefined) => {
	return useQuery({
		queryKey: id ? ["booking_list", id] : ["booking_list"],
		queryFn: async () => {
			if (id) {
				const { data } = await api.get(`/admin/booking_list/${id}`);
				return data;
			} else {
				throw new Response("ไม่พบข้อมูลนี้", { status: 404 });
			}
		},
	});
};

export const useBookingListCount = () => {
	return useQuery({
		queryKey: ["booking_lists", "booking_list"],
		queryFn: async () => {
			const { data } = await api.get(`/admin/booking_list/list/count`);
			return data;
		},
	});
};

export const useBookingListForDropdown = () => {
	return useQuery({
		queryKey: ["booking_lists-dropdown"],
		queryFn: async () => {
			const { data } = await api.get(`/admin/booking_list/list/dropdown`);
			return data;
		},
	});
};
