import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "../../../libs/api";
import { buildURLSearchParams } from "../../../utils";
import { FilterQuery } from "../types";
import { handleApiError } from "../../../utils/errorHandler";
import { useNotification } from "../../../hooks/useNotification";
import { useNavigate } from "react-router-dom";

export const useDepartments = (filterQuery: FilterQuery) => {
	const [filters, setFilters] = useState<FilterQuery>(filterQuery);
	const { showErrorNotification } = useNotification();
	const navigate = useNavigate()
	const query = useQuery({
		queryKey: ["departments", filters],
		queryFn: async () => {
			try {
				const params = buildURLSearchParams(filterQuery);
				const { data } = await api.get(`/admin/department/search`, { params });

				return data;
			} catch (error: any) {
				handleApiError(error,showErrorNotification,navigate);
			}
		},
	});
	return {
		...query,
		setFilters,
	};
};

// Hook สำหรับดึงข้อมูลสินค้าตาม ID หรือไม่ส่ง ID สำหรับทำ form เพิ่มและแก้ไข
export const useDepartmentById = (id: number | null | undefined) => {
	return useQuery({
		queryKey: id ? ["department", id] : ["department"],
		queryFn: async () => {
			if (id) {
				const { data } = await api.get(`/admin/department/${id}`);
				return data;
			} else {
				throw new Response("ไม่พบข้อมูลนี้", { status: 404 });
			}
		},
	});
};

export const useDepartmentForDropdown = () => {
	return useQuery({
		queryKey: ["departments-dropdown"],
		queryFn: async () => {
			const { data } = await api.get(`/admin/department/list/dropdown`);
			return data;
		},
	});
};
