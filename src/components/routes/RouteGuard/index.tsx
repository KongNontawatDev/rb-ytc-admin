import { Navigate } from "react-router-dom";

export default function RouteGuard({ element }: { element: React.ReactElement }) {
  const isAuthenticated = true // Custom hook ตรวจสอบสถานะ
  return isAuthenticated ? element : <Navigate to="/auth/login" />;
};