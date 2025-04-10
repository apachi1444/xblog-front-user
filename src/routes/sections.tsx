import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { AuthGuard } from 'src/guards/AuthGuard';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const GenerateFlow = lazy(() => import('src/pages/generate'));
export const CreatePage = lazy(() => import('src/pages/create'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const StoresPage = lazy(() => import('src/pages/stores'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const ForgotPasswordPage = lazy(() => import('src/pages/forgot-password'));
export const SettingsPage = lazy(() => import('src/pages/settings'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const UpgradeLicense = lazy(() => import('src/pages/upgrade-license'));
export const BookDemo = lazy(() => import('src/pages/book-demo'));
export const CalendarPage = lazy(() => import('src/pages/calendar'));
export const StoresView = lazy(() => import('../sections/stores/view/stores-view').then(module => ({ default: module.StoresView })));
export const AddStoreFlow = lazy(() => import('../sections/add-store/view'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  const routes = useRoutes([
    {
      element: (
        <AuthGuard>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </AuthGuard>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'generate', element: <GenerateFlow />},
        { path: 'create', element: <CreatePage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'settings', element: <SettingsPage /> },
        { path: 'upgrade-license', element: <UpgradeLicense /> },
        { path: 'book-demo', element: <BookDemo /> },
        { path: 'stores', element: <StoresPage /> },
        { path: 'stores/add', element: <AddStoreFlow /> },
        { path: 'calendar', element: <CalendarPage /> },
      ],
    },
    {
      path: 'sign-in',
      element: (
          <AuthLayout>
            <SignInPage />
          </AuthLayout>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <AuthLayout>
          <SignUpPage />
        </AuthLayout>
      ),
    },
    {
      path: 'forgot-password',
      element: (
        <AuthLayout>
          <ForgotPasswordPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
