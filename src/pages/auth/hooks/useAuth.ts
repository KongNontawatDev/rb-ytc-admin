import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "../../../hooks/useNotification";
import api from "../../../libs/api";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../../types/axiosType";
import { useNavigate } from "react-router-dom";
import { FormLoginType, FormResetPasswordType, FormConfirmPasswordType, FormLoginResponse } from "../types";
import useAuthStore from "./useAuthStore";

// Login Mutation
export const useLogin = (onSuccessCallback: (data: FormLoginResponse) => void) => {
  const { showSuccessNotification, showErrorNotification } = useNotification();

  return useMutation({
    mutationFn: async (formData: FormLoginType) => {
      const { data } = await api.post("/admin/auth/signin", formData);
      return data;
    },
    onSuccess: (data) => {
      showSuccessNotification("Login successful!");
      onSuccessCallback(data);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showErrorNotification(
        "Login failed",
        error.response?.data.message || error.message
      );
    },
  });
};

// Refresh Token Mutation
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async (token: string): Promise<FormLoginResponse> => {
      const { data } = await api.post(
        "/refresh-token",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.results;
    },
  });
};

// Reset Password Mutation
export const useResetPassword = (onSuccessCallback: () => void) => {
  const { showSuccessNotification, showErrorNotification } = useNotification();

  return useMutation({
    mutationFn: async (formData: FormResetPasswordType): Promise<FormLoginResponse> => {
      const { data } = await api.post("/resetpassword", formData);
      return data.results;
    },
    onSuccess: () => {
      showSuccessNotification("Password reset successful!");
      onSuccessCallback();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showErrorNotification(
        "Password reset failed",
        error.response?.data.message || error.message
      );
    },
  });
};

// Confirm Password Mutation
export const useConfirmPassword = (onSuccessCallback: () => void) => {
  const { showSuccessNotification, showErrorNotification } = useNotification();

  return useMutation({
    mutationFn: async (formData: FormConfirmPasswordType): Promise<FormLoginResponse> => {
      const { data } = await api.post("/confirmpassword", formData);
      return data.results;
    },
    onSuccess: () => {
      showSuccessNotification("Password confirmation successful!");
      onSuccessCallback();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showErrorNotification(
        "Password confirmation failed",
        error.response?.data.message || error.message
      );
    },
  });
};

// Change Password Mutation
export const useChangePassword = (onSuccessCallback: () => void) => {
  const { showSuccessNotification, showErrorNotification } = useNotification();

  return useMutation({
    mutationFn: async (formData: FormConfirmPasswordType): Promise<FormLoginResponse> => {
      const { data } = await api.post("/admin/auth/change-password/other", formData);
      return data.results;
    },
    onSuccess: () => {
      showSuccessNotification("Password changed successfully!");
      onSuccessCallback();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showErrorNotification(
        "Password change failed",
        error.response?.data.message || error.message
      );
    },
  });
};

// Logout Mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { showSuccessNotification, showErrorNotification } = useNotification();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const state = useAuthStore.getState();
      const { admin, resetAuth } = state;

      if (admin?.id) {
        await api.post("/admin/auth/logout", { adminId: admin.id });
        resetAuth();
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
      } else {
        throw new Error("No admin ID found for logout.");
      }
    },
    onSuccess: () => {
      showSuccessNotification("Logged out successfully!");
      queryClient.clear(); // Clear all cached queries
      navigate("/auth/login");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showErrorNotification(
        "Logout failed",
        error.response?.data.message || error.message
      );
    },
  });
};
