import { useQuery } from "@tanstack/react-query";
import api from "../../../libs/api";

// Hook สำหรับดึงข้อมูลสินค้าตาม ID หรือไม่ส่ง ID สำหรับทำ form เพิ่มและแก้ไข
export const useDashboard = () => {
	return useQuery({
		queryKey: ["dashboard"],
		queryFn: async () => {
			const { data } = await api.get(`/admin/dashboard`);
			return data;
		},
	});
};
