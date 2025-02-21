import { lazy } from "react";
import PublicRoute from "../components/routes/PublicRoute";
import AuthLayoutLoading from "../components/layouts/AuthLayout/loading";
import { ErrorBoundaryWrapper } from "../components/error";
import AuthLayout from "../components/layouts/AuthLayout";
import { Outlet } from "react-router-dom";
import { PageWrapper } from "./PageWrapper";

// Lazy load components
const Login = lazy(() => import("../pages/auth/index"));
const LoginWithEmail = lazy(() => import("../pages/auth/login-with-email"));
const ForgotPassword = lazy(() => import("../pages/auth/forgot-password"));
const ResetPassword = lazy(() => import("../pages/auth/reset-password"));

// You can import page-specific loading components here
// const LoginLoading = lazy(() => import("../pages/auth/loading"));
// const LoginWithEmailLoading = lazy(() => import("../pages/auth/login-with-email/loading"));
// const ForgotPasswordLoading = lazy(() => import("../pages/auth/forgot-password/loading"));
// const ResetPasswordLoading = lazy(() => import("../pages/auth/reset-password/loading"));

const AuthLayoutWrapper = () => {
	return (
		<AuthLayout>
			<ErrorBoundaryWrapper>
				<Outlet />
			</ErrorBoundaryWrapper>
		</AuthLayout>
	);
};

const authRoutes = {
	path: "auth",
	element: <PublicRoute />,
	errorElement: (
		<ErrorBoundaryWrapper>
			<Outlet />
		</ErrorBoundaryWrapper>
	),
	children: [
		{
			element: <AuthLayoutWrapper />,
			children: [
				{
					path: "login",
					element: (
						<PageWrapper
							component={Login}
							LoadingComponent={AuthLayoutLoading}
							// Use custom loading component if available
							// LoadingComponent={LoginLoading}
						/>
					),
				},
				{
					path: "login-with-email",
					element: (
						<PageWrapper
							component={LoginWithEmail}
							LoadingComponent={AuthLayoutLoading}
							// LoadingComponent={LoginWithEmailLoading}
						/>
					),
				},
				{
					path: "forgot-password",
					element: (
						<PageWrapper
							component={ForgotPassword}
							LoadingComponent={AuthLayoutLoading}
							// LoadingComponent={ForgotPasswordLoading}
						/>
					),
				},
				{
					path: "reset-password",
					element: (
						<PageWrapper
							component={ResetPassword}
							LoadingComponent={AuthLayoutLoading}
							// LoadingComponent={ResetPasswordLoading}
						/>
					),
				},
			],
		},
	],
};

export default authRoutes;
