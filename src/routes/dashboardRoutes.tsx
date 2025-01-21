import { lazy, Suspense } from "react";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import { Outlet } from "react-router-dom";
import { ErrorBoundaryWrapper } from "../components/error";
import settingsRoutes from "./settingsRoutes";
import DashboardLayoutLoading from "../components/layouts/DashboardLayout/loading";
import DashboardLayout from "../components/layouts/DashboardLayout/Layout";

// Lazy load all pages
const Dashboard = lazy(() => import("../pages/dashboard"));
const Department = lazy(() => import("../pages/department"));
const Accessory = lazy(() => import("../pages/accessory"));
const User = lazy(() => import("../pages/user"));
const Admin = lazy(() => import("../pages/admin"));
const Room = lazy(() => import("../pages/room"));
const BookingList = lazy(() => import("../pages/booking_list"));
const DepartmentForm = lazy(() => import("../pages/department/form"));
const DepartmentView = lazy(() => import("../pages/department/view"));

// Modified DashboardLayoutWithSuspense to include Suspense
const DashboardLayoutWithSuspenseWrapper = () => {
	return (
		<DashboardLayout>
			<ErrorBoundaryWrapper>
				<Suspense fallback={<DashboardLayoutLoading />}>
					<Outlet />
				</Suspense>
			</ErrorBoundaryWrapper>
		</DashboardLayout>
	);
};

const dashboardRoutes = {
	path: "/",
	element: <ProtectedRoute />,
	errorElement: (
		<ErrorBoundaryWrapper>
			<Outlet />
		</ErrorBoundaryWrapper>
	),
	children: [
		{
			element: <DashboardLayoutWithSuspenseWrapper />,
			children: [
				{ index: true, element: <Dashboard />, },
				{ path: "/dashboard", element: <Dashboard />, },
				{ path: "/department", element: <Department />, },
				{ path: "/accessory", element: <Accessory />, },
				{ path: "/user", element: <User />, },
				{ path: "/admin", element: <Admin />, },
				{ path: "/room", element: <Room />, },
				{ path: "/booking_list", element: <BookingList />, },
				{ path: "/department/create", element: <DepartmentForm />, },
				{ path: "/department/:id/edit", element: <DepartmentForm />, },
				{ path: "/department/:id/view", element: <DepartmentView />, },
				settingsRoutes,
			],
		},
	],
};




export default dashboardRoutes;
