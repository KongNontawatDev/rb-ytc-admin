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
			const { data } = error.response;

			switch (error.response.status) {
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
				default:
					break;
			}
		} else if (error.request) {
			errorMessage = "Request error: Unable to connect to the server.";
		} else {
			errorMessage = error.message || "An unknown Axios error occurred.";
		}
	}

	// แสดงข้อความ error ผ่าน showErrorNotification
	// if (error?.status != 400) {
	showErrorNotification(errorMessage, errorDescription);
	// }
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
