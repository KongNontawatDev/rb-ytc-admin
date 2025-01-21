import { lazy, Suspense } from "react";
import PublicRoute from "../components/routes/PublicRoute";
import AuthLayoutLoading from "../components/layouts/AuthLayout/loading";
import { ErrorBoundaryWrapper } from "../components/error";
import AuthLayout from "../components/layouts/AuthLayout";
import { Outlet } from "react-router-dom";

const Login = lazy(() => import("../pages/auth/index"));

const authRoutes = {
	path:'auth',
	element: <PublicRoute />,
	errorElement: (
		<ErrorBoundaryWrapper>
			<Outlet />
		</ErrorBoundaryWrapper>
	),
	children: [
		{
			element: (
				<AuthLayout>
					<ErrorBoundaryWrapper>
						<Suspense fallback={<AuthLayoutLoading />}>
							<Outlet />
						</Suspense>
					</ErrorBoundaryWrapper>
				</AuthLayout>
			),
			children: [
				{
					path: "login",
					element: <Login />,
				},
			],
		},
	],
};

export default authRoutes;
