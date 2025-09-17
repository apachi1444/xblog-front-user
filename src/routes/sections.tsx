import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { AuthGuard } from 'src/guards/AuthGuard';
import { DashboardLayout } from 'src/layouts/dashboard';

import { ErrorFallback } from 'src/components/error-boundary';

// ----------------------------------------------------------------------

export const OnBoardingPage = lazy(() => import('src/pages/onboarding'));
export const HomePage = lazy(() => import('src/pages/home'));
export const GenerateFlow = lazy(() => import('src/pages/generate'));
export const CreatePage = lazy(() => import('src/pages/create'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const StoresPage = lazy(() => import('src/pages/stores'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const VerifyEmailPage = lazy(() => import('src/pages/verify-email'));
export const ForgotPasswordPage = lazy(() => import('src/pages/forgot-password'));
export const ResetPasswordPage = lazy(() => import('src/pages/reset-password'));
export const SettingsPage = lazy(() => import('src/pages/settings'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const UpgradeLicense = lazy(() => import('src/pages/upgrade-license'));
export const BookDemo = lazy(() => import('src/pages/book-demo'));
export const CalendarPage = lazy(() => import('src/pages/calendar'));
export const TemplatePage = lazy(() => import('src/pages/templates'));
export const AddStorePage = lazy(() => import('src/pages/add-store'));
export const AIChatPage = lazy(() => import('src/pages/ai-chat'));
export const ArticlePreviewDemoPage = lazy(() => import('src/pages/article-preview-demo'));
export const TestDraftEditingPage = lazy(() => import('src/pages/test-draft-editing'));
export const TemplatePreviewPage = lazy(() => import('src/pages/template-preview'));
export const OAuthCallbackPage = lazy(() => import('src/pages/oauth-callback'));
export const ReferEarnPage = lazy(() => import('src/pages/rewards/ReferEarnPage'));
export const DailyRewardsPage = lazy(() => import('src/pages/rewards/DailyRewardsPage'));
export const OneTimeRewardsPage = lazy(() => import('src/pages/rewards/OneTimeRewardsPage'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);


export function Router() {
  const routes = useRoutes([
    {
      path: 'onboarding',
      element: (
        <AuthGuard>
          <Suspense fallback={renderFallback}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <OnBoardingPage />
            </ErrorBoundary>
          </Suspense>
        </AuthGuard>
      ),
    },
    {
      element: (
        <AuthGuard>
          <Suspense fallback={renderFallback}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Outlet />
            </ErrorBoundary>
          </Suspense>
        </AuthGuard>
      ),
      children: [
        {
          element: (
            <DashboardLayout>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Outlet />
              </ErrorBoundary>
            </DashboardLayout>
          ),
          children: [
            {
              index: true,
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <HomePage />
                </ErrorBoundary>
              )
            },
            {
              path: 'user',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <UserPage />
                </ErrorBoundary>
              )
            },
            {
              path: 'generate',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <GenerateFlow />
                </ErrorBoundary>
              )
            },
            {
              path: 'create',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <CreatePage />
                </ErrorBoundary>
              )
            },
            {
              path: 'products',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <ProductsPage />
                </ErrorBoundary>
              )
            },
            {
              path: 'blog',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <BlogPage />
                </ErrorBoundary>
              )
            },
            {
              path: 'profile',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <ProfilePage />
                </ErrorBoundary>
              )
            },
            {
              path: 'settings',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <SettingsPage />
                </ErrorBoundary>
              )
            },
            {
              path: 'upgrade-license',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <UpgradeLicense />
                </ErrorBoundary>
              )
            },
            {
              path: 'book-demo',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <BookDemo />
                </ErrorBoundary>
              )
            },
            {
              path: 'stores',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <StoresPage />
                </ErrorBoundary>
              )
            },
            {
              path: 'stores/add',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <AddStorePage />
                </ErrorBoundary>
              )
            },
            {
              path: 'calendar',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <CalendarPage />
                </ErrorBoundary>
              )
            },
            {
              path: 'templates',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <TemplatePage />
                </ErrorBoundary>
              )
            },
            {
              path: 'ai-chat',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <AIChatPage />
                </ErrorBoundary>
              )
            },
            {
              path: 'article-preview-demo',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <ArticlePreviewDemoPage />
                </ErrorBoundary>
              )
            },
            {
              path: 'test-draft-editing',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <TestDraftEditingPage />
                </ErrorBoundary>
              )
            },
            {
              path: 'rewards/refer-earn',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <ReferEarnPage />
                </ErrorBoundary>
              )
            },
            {
              path: 'rewards/daily',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <DailyRewardsPage />
                </ErrorBoundary>
              )
            },
            {
              path: 'rewards/one-time',
              element: (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <OneTimeRewardsPage />
                </ErrorBoundary>
              )
            },
          ],
        },
      ],
    },

    // Public Routes
    {
      path: 'sign-in',
      element: (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AuthLayout>
            <SignInPage />
          </AuthLayout>
        </ErrorBoundary>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AuthLayout>
            <SignUpPage />
          </AuthLayout>
        </ErrorBoundary>
      ),
    },
    {
      path: 'verify-email',
      element: (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AuthLayout>
            <VerifyEmailPage />
          </AuthLayout>
        </ErrorBoundary>
      ),
    },
    {
      path: 'forgot-password',
      element: (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AuthLayout>
            <ForgotPasswordPage />
          </AuthLayout>
        </ErrorBoundary>
      ),
    },
    {
      path: 'reset-password',
      element: (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AuthLayout>
            <ResetPasswordPage />
          </AuthLayout>
        </ErrorBoundary>
      ),
    },
    {
      path: 'templates/:encryptedId',
      element: (
        <Suspense fallback={renderFallback}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <TemplatePreviewPage />
          </ErrorBoundary>
        </Suspense>
      ),
    },
    {
      path: 'auth/callback',
      element: (
        <Suspense fallback={renderFallback}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <OAuthCallbackPage />
          </ErrorBoundary>
        </Suspense>
      ),
    },
    {
      path: '404',
      element: (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Page404 />
        </ErrorBoundary>
      ),
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
