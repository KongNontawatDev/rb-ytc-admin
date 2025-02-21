import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { PageWrapper } from './PageWrapper';
import SettingLayoutLoading from '../components/layouts/SettingsLayout/loading';

// Lazy load components
const SettingsLayout = lazy(() => import('../components/layouts/SettingsLayout'));
const Profile = lazy(() => import('../pages/setting/profile'));
const Test = lazy(() => import('../pages/setting/test'));

// You can import page-specific loading components here
// const ProfileLoading = lazy(() => import('../pages/setting/profile/loading'));
// const TestLoading = lazy(() => import('../pages/setting/test/loading'));

const SettingsLayoutWrapper = () => {
  return (
    <PageWrapper
      component={() => (
        <SettingsLayout>
          <Outlet />
        </SettingsLayout>
      )}
      LoadingComponent={SettingLayoutLoading}
    />
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
      element: <PageWrapper 
        component={Profile}
        // Use custom loading component if available
        // LoadingComponent={ProfileLoading}
      />,
    },
    {
      path: 'test',
      element: <PageWrapper 
        component={Test}
        // LoadingComponent={TestLoading}
      />,
    },
  ],
};

export default settingsRoutes;