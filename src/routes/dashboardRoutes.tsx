import { lazy } from "react";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import { Outlet } from "react-router-dom";
import { ErrorBoundaryWrapper } from "../components/error";
import settingsRoutes from "./settingsRoutes";
import DashboardLayout from "../components/layouts/DashboardLayout/Layout";
import { PageWrapper } from "./PageWrapper";
// Lazy load all pages with their specific loading states
const Dashboard = lazy(() => import("../pages/dashboard"));
const Department = lazy(() => import("../pages/department"));
const Accessory = lazy(() => import("../pages/accessory"));
const User = lazy(() => import("../pages/user"));
const Admin = lazy(() => import("../pages/admin"));
const Room = lazy(() => import("../pages/room"));
const BookingList = lazy(() => import("../pages/booking_list"));
const DepartmentForm = lazy(() => import("../pages/department/form"));
const DepartmentView = lazy(() => import("../pages/department/view"));

// You can import page-specific loading components here
// const DashboardLoading = lazy(() => import("../pages/dashboard/loading"));
// const DepartmentLoading = lazy(() => import("../pages/department/loading"));
// etc...

const DashboardLayoutWithSuspenseWrapper = () => {
  return (
    <DashboardLayout>
      <ErrorBoundaryWrapper>
        <Outlet />
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
        {
          index: true,
          element: <PageWrapper component={Dashboard} />,
          // Use custom loading component if available
          // element: <PageWrapper component={Dashboard} LoadingComponent={DashboardLoading} />,
        },
        {
          path: "/dashboard",
          element: <PageWrapper component={Dashboard} />,
        },
        {
          path: "/department",
          element: <PageWrapper component={Department} />,
        },
        {
          path: "/accessory",
          element: <PageWrapper component={Accessory} />,
        },
        {
          path: "/user",
          element: <PageWrapper component={User} />,
        },
        {
          path: "/admin",
          element: <PageWrapper component={Admin} />,
        },
        {
          path: "/room",
          element: <PageWrapper component={Room} />,
        },
        {
          path: "/booking_list",
          element: <PageWrapper component={BookingList} />,
        },
        {
          path: "/department/create",
          element: <PageWrapper component={DepartmentForm} />,
        },
        {
          path: "/department/:id/edit",
          element: <PageWrapper component={DepartmentForm} />,
        },
        {
          path: "/department/:id/view",
          element: <PageWrapper component={DepartmentView} />,
        },
        settingsRoutes,
      ],
    },
  ],
};

export default dashboardRoutes;