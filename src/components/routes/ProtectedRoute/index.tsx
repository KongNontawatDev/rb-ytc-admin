import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { encryptStorage } from "../../../libs/encryptStorage";
import api from "../../../libs/api";

const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds

export default function ProtectedRoute() {
	const navigate = useNavigate();
	const location = useLocation(); // Use location to detect route changes

	useEffect(() => {
		const checkAuth = async () => {
			try {
				// Get tokens from storage
				const accessToken = encryptStorage.getItem("token");
				const refreshToken = encryptStorage.getItem("refresh_token");

				if (!accessToken) {
					// No token found, redirect to login
					navigate("/auth/login");
					return;
				}

				// Decode JWT to check expiration
				const tokenData = JSON.parse(atob(accessToken.split(".")[1]));
				const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
				const currentTime = Date.now();

				if (currentTime >= expirationTime) {
					// Token has expired
					if (refreshToken) {
						try {
							// Try to refresh the token
							const response = await api.post("/admin/auth/refresh-token", {
								refreshToken,
							});

							// Update tokens in storage
							encryptStorage.setItem("token", response.data.accessToken);
							encryptStorage.setItem(
								"refresh_token",
								response.data.refreshToken
							);
						} catch (error) {
							// Refresh token failed
							encryptStorage.removeItem("token");
							encryptStorage.removeItem("refresh_token");
							navigate("/auth/login");
							return;
						}
					} else {
						// No refresh token available
						encryptStorage.removeItem("token");
						navigate("/auth/login");
						return;
					}
				} else if (expirationTime - currentTime <= ONE_HOUR) {
					// Token will expire within 1 hour, refresh it
					try {
						const { data: response } = await api.post(
							"/admin/auth/refresh-token",
							{
								refreshToken,
							}
						);

						// Update tokens in storage
						encryptStorage.setItem("token", response.data.accessToken);
						encryptStorage.setItem("refresh_token", response.data.refreshToken);
					} catch (error) {
						// Refresh failed but current token is still valid, continue
						console.error("Token refresh failed:", error);
					}
				}
			} catch (error) {
				// Error parsing token or other issues
				console.error("Auth check failed:", error);
				encryptStorage.removeItem("token");
				encryptStorage.removeItem("refresh_token");
				navigate("/auth/login");
				return;
			}
		};

		checkAuth();
	}, [navigate, location]); // Add location to the dependency array to trigger on route change

	return (
		<div>
			<Outlet />
		</div>
	);
}
