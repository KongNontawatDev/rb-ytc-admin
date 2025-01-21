import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import SettingLayoutLoading from '../components/layouts/SettingsLayout/loading';

// Lazy load components
const SettingsLayout = lazy(() => import('../components/layouts/SettingsLayout'));
const Profile = lazy(() => import('../pages/setting/profile'));
const Test = lazy(() => import('../pages/setting/test'));

// Create a wrapper for Settings Layout that includes Suspense
const SettingsLayoutWrapper = () => {
  return (
    <Suspense fallback={<SettingLayoutLoading />}>
      <SettingsLayout>
        <Outlet />
      </SettingsLayout>
    </Suspense>
  );
};

const settingsRoutes = {
  path: 'setting',
  element: <SettingsLayoutWrapper />,
  children: [
    {
      index: true,
      element: <Navigate to="profile" replace />,
    },
    {
      path: 'profile',
      element: <Profile />,
    },
    {
      path: 'test',
      element: <Test />,
    },
  ],
};

export default settingsRoutes;