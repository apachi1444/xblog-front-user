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
import { useSessionVerification } from 'src/hooks/useSessionVerification';

import { logout } from 'src/services/slices/auth/authSlice';
import { CustomThemeProvider } from 'src/theme/theme-provider';
import { AnalyticsProvider } from 'src/contexts/analytics-context';
import { LanguageContextProvider } from 'src/contexts/LanguageContext';
import { WelcomePopupContextProvider } from 'src/contexts/WelcomePopupContext';
import { resetBannerDismissals } from 'src/services/slices/banners/bannerSlice';
import { useSessionExpired, SessionExpiredProvider } from 'src/contexts/SessionExpiredContext';

import i18n from './locales/i18n';
import { ToastProvider } from './contexts/ToastContext';
import { ErrorFallback } from './components/error-boundary';
import { SupportChatProvider } from './contexts/SupportChatContext';
import { AuthPersistence } from './components/auth/auth-persistence';
import { SubscriptionSuccessAnimation } from './components/subscription';
import { PageViewTracker } from './components/analytics/page-view-tracker';
import { SessionExpiredModal } from './components/auth/session-expired-modal';
import { SessionVerificationAnimation } from './components/session/SessionVerificationAnimation';

export default function App() {
  const dispatch = useDispatch();

  // Handle subscription success detection
  const { successData, showSuccessAnimation, hideSuccessAnimation } = useSubscriptionSuccess();

  useEffect(() => {
    dispatch(resetBannerDismissals());
  }, [dispatch]);

  // Handle session expiration
  const handleSessionExpired = () => {
    // Clear all authentication data
    try {
      localStorage.removeItem('xblog_auth_session_v2');
      sessionStorage.removeItem('xblog_secure_session_token_v2_8a7b6c5d4e3f2g1h');
      sessionStorage.removeItem('access_token'); // Legacy token key
    } catch (storageError) {
      console.error('Error clearing storage:', storageError);
    }

    // Dispatch logout action
    dispatch(logout());

    // Redirect to login page
    setTimeout(() => {
      window.location.href = '/sign-in';
    }, 100);
  };

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
              <AnalyticsProvider>
                <SessionExpiredProvider onSessionExpired={handleSessionExpired}>
                  <SessionExpiredContent
                    successData={successData}
                    showSuccessAnimation={showSuccessAnimation}
                    hideSuccessAnimation={hideSuccessAnimation}
                  />
                </SessionExpiredProvider>
              </AnalyticsProvider>
            </CustomThemeProvider>
          </LanguageContextProvider>
        </I18nextProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

// Separate component to access SessionExpired context
function SessionExpiredContent({
  successData,
  showSuccessAnimation,
  hideSuccessAnimation
}: {
  successData: any;
  showSuccessAnimation: boolean;
  hideSuccessAnimation: () => void;
}) {
  useAxiosAuth(); // This hook now uses the SessionExpired context

    // Handle session verification
  const {
    isVerifying: sessionIsVerifying,
    isValid: sessionIsValid,
    error: sessionError,
    sessionId,
    showSuccessAnimation: sessionShowSuccess,
    showErrorAnimation: sessionShowError,
    hideSuccessAnimation: sessionHideSuccess,
    hideErrorAnimation: sessionHideError,
  } = useSessionVerification();

  const { isModalOpen, countdown } = useSessionExpired();

  return (
    <>
      <ToasterWithTheme />
      <AuthPersistence />
      <PageViewTracker />
      <ToastProvider>
        <SupportChatProvider>
          <WelcomePopupContextProvider>
            <Router />
            {/* Session Expired Modal */}
            <SessionExpiredModal open={isModalOpen} countdown={countdown} />
            {/* Subscription Success Animation */}
            <SubscriptionSuccessAnimation
              open={showSuccessAnimation}
              onClose={hideSuccessAnimation}
              plan={successData?.plan}
              subscriptionId={successData?.subscriptionId || ''}
            />

            {/* Session Verification Animation */}
            <SessionVerificationAnimation
              open={sessionShowSuccess || sessionShowError || sessionIsVerifying}
              onClose={() => {
                if (sessionShowSuccess) {
                  sessionHideSuccess();
                } else if (sessionShowError) {
                  sessionHideError();
                }
              }}
              isVerifying={sessionIsVerifying}
              isValid={sessionIsValid}
              error={sessionError}
              sessionId={sessionId}
            />
          </WelcomePopupContextProvider>
        </SupportChatProvider>
      </ToastProvider>
    </>
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
