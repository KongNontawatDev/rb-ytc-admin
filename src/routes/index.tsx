import { createBrowserRouter } from 'react-router-dom';
import authRoutes from './authRoutes';
import dashboardRoutes from './dashboardRoutes';

export const router = createBrowserRouter([
  dashboardRoutes,
  authRoutes,
]);
