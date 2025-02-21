import axios from "axios";
import { ErrorResponse } from "../types/axiosType";
import { encryptStorage } from "../libs/encryptStorage";

export const handleApiError = (
	error: any,
	showErrorNotification: (message: string, details?: string) => void,
	navigate: any
): void => {
	let errorMessage = "An unexpected error occurred.";
	let errorDescription = "";
	console.log("error", error);

	if (axios.isAxiosError(error)) {
		if (error.code === "ERR_NETWORK") {
			errorMessage =
				"Network Server error: Please check your Server connection.";
		} else if (error.response) {
			const { data, status } = error.response;
			
			switch (status) {
				case 400:
					errorMessage = "มีบางอย่างผิดพลาด";
					errorDescription = formatErrorMessage(data.message);
					break;
				case 401:
					errorMessage = "ยังไม่ได้เข้าสู่ระบบ";
					errorDescription = formatErrorMessage(data.message);
					encryptStorage.removeItem("token");
					encryptStorage.removeItem("refresh_token");
					navigate(
						"/auth/login?message=must_be_logged_in&redirect=" +
							window.location.pathname
					);
					break;
				case 403:
					errorMessage = "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้";
					errorDescription = formatErrorMessage(data.message);
					break;
				case 404:
					errorMessage = "ไม่พบข้อมูลที่ร้องขอ จาก URL";
					errorDescription = formatErrorMessage(data.message);
					break;
				case 429:
					errorMessage =
						"มีการส่งคำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง";
					break;
				case 500:
					errorMessage = "ข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่ภายหลัง";
					break;
				case 503:
					errorMessage =
						"เซิร์ฟเวอร์ไม่พร้อมให้บริการในขณะนี้ กรุณาลองใหม่ภายหลัง";
					break;
				default:
					errorMessage = `เกิดข้อผิดพลาดที่ไม่คาดคิด (Error Code: ${status})`;
					errorDescription = formatErrorMessage(data.message);
					break;
			}
		} else if (error.request) {
			errorMessage = "Request error: Unable to connect to the server.";
		} else {
			errorMessage = error.message || "An unknown Axios error occurred.";
		}
	}

	showErrorNotification(errorMessage, errorDescription);
};

export const isErrorResponse = (data: any): data is ErrorResponse => {
	return (
		data &&
		typeof data.message !== "undefined" &&
		typeof data.error === "string" &&
		typeof data.statusCode === "number"
	);
};

export const formatErrorMessage = (message: string | string[]): string => {
	return Array.isArray(message) ? message.join(", ") : message;
};
