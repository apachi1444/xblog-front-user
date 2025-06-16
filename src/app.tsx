import 'src/global.css';

import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { ErrorBoundary } from 'react-error-boundary';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { useTheme } from '@mui/material/styles';

import { Router } from 'src/routes/sections';

import { useAxiosAuth } from 'src/hooks/useAxiosAuth';
import { useSubscriptionSuccess } from 'src/hooks/useSubscriptionSuccess';

import { CustomThemeProvider } from 'src/theme/theme-provider';
import { LanguageContextProvider } from 'src/contexts/LanguageContext';
import { WelcomePopupContextProvider } from 'src/contexts/WelcomePopupContext';
import { resetBannerDismissals } from 'src/services/slices/banners/bannerSlice';

import i18n from './locales/i18n';
import { ToastProvider } from './contexts/ToastContext';
import { SupportChat } from './components/support-chat';
import { ErrorFallback } from './components/error-boundary';
import { SupportChatProvider } from './contexts/SupportChatContext';
import { AuthPersistence } from './components/auth/auth-persistence';
import { SubscriptionSuccessAnimation } from './components/subscription';

// Get Google OAuth client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log(GOOGLE_CLIENT_ID);

export default function App() {
  useAxiosAuth();
  const dispatch = useDispatch();

  // Handle subscription success detection
  const { successData, showSuccessAnimation, hideSuccessAnimation } = useSubscriptionSuccess();

  useEffect(() => {
    dispatch(resetBannerDismissals());
  }, [dispatch]);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.href = '/';
      }}
    >
      <GoogleOAuthProvider clientId="116914976486-bkkcrqu1202aau2g8s1pcfbdq59066uj.apps.googleusercontent.com">
        <I18nextProvider i18n={i18n}>
          <LanguageContextProvider>
            <CustomThemeProvider>
              <ToasterWithTheme />
              <AuthPersistence />
              <ToastProvider>
                <SupportChatProvider>
                  <WelcomePopupContextProvider>
                    <Router />
                    <SupportChat />
                    {/* Subscription Success Animation */}
                    <SubscriptionSuccessAnimation
                      open={showSuccessAnimation}
                      onClose={hideSuccessAnimation}
                      plan={successData?.plan}
                      subscriptionId={successData?.subscriptionId || ''}
                    />
                  </WelcomePopupContextProvider>
                </SupportChatProvider>
              </ToastProvider>
            </CustomThemeProvider>
          </LanguageContextProvider>
        </I18nextProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

// Separate component to access theme context
function ToasterWithTheme() {
  const theme = useTheme();

  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={12}
      toastOptions={{
        duration: 500,
        removeDelay: 500,
        style: {
          background: theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : theme.palette.background.default,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[3],
          padding: '12px 16px',
          fontSize: '14px',
        },

        // Default options for specific types
        success: {
          duration: 1500,
          style: {
            background: theme.palette.mode === 'dark'
              ? theme.palette.success.dark
              : theme.palette.success.light,
            color: theme.palette.mode === 'dark'
              ? theme.palette.common.white
              : theme.palette.success.dark,
          },
          iconTheme: {
            primary: theme.palette.success.main,
            secondary: theme.palette.mode === 'dark'
              ? theme.palette.common.black
              : theme.palette.common.white,
          },
        },
        error: {
          duration: 1500,
          style: {
            background: theme.palette.mode === 'dark'
              ? theme.palette.error.dark
              : theme.palette.error.light,
            color: theme.palette.mode === 'dark'
              ? theme.palette.common.white
              : theme.palette.error.dark,
          },
          iconTheme: {
            primary: theme.palette.error.main,
            secondary: theme.palette.mode === 'dark'
              ? theme.palette.common.black
              : theme.palette.common.white,
          },
        },
      }}
    />
  );
}
