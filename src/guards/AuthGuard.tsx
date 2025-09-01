

import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, type ReactNode } from 'react';

import { getOnboardingStatus, syncOnboardingStatusWithAPI } from 'src/utils/onboarding';

import { useGetCurrentUserQuery } from 'src/services/apis/userApi';
import { setCredentials } from 'src/services/slices/auth/authSlice';
import { useLazyVerifyCheckoutSessionQuery } from 'src/services/apis/subscriptionApi';
import { selectAccessToken, selectIsAuthenticated } from 'src/services/slices/auth/selectors';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isVerifying, setIsVerifying] = useState(true);
  const dispatch = useDispatch();

  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  const { data: userData, refetch } = useGetCurrentUserQuery();
  const [verifySession] = useLazyVerifyCheckoutSessionQuery();

  // Skip verification if no token exists
  const skipVerification = !accessToken;

  useEffect(() => {
    // Handle API verification logic
    if (skipVerification) {
      // No token to verify, finish verification process immediately
      setIsVerifying(false);
    } else {
      // Verification completed (success or error)
      setIsVerifying(false);
    }
  }, [skipVerification]);

  // Sync localStorage with API when API data becomes available
  useEffect(() => {
    syncOnboardingStatusWithAPI(userData);
  }, [userData]);

  // Check for Stripe success and update auth state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const hasStripeSuccess = urlParams.has('subscriptionId') &&
                             urlParams.has('subscriptionCustomer') &&
                             urlParams.get('redirect_status') === 'succeeded';

    const sessionId = urlParams.get('session_id');

    // Handle session_id verification
    if (sessionId) {
      verifySession({ session_id: sessionId })
        .then((result) => {
          if (result.data && result.data.status === 'paid') {
            refetch().then((userResult) => {
              if (userResult.data && userResult.data.is_completed_onboarding) {
                // Get current access token
                const authData = localStorage.getItem('xblog_auth_session_v2');
                if (authData) {
                  try {
                    const parsedAuth = JSON.parse(authData);

                    // Update Redux state with fresh user data
                    dispatch(setCredentials({
                      user: userResult.data,
                      accessToken: parsedAuth.accessToken
                    }));
                  } catch (error) {
                    console.error('Error updating auth state:', error);
                  }
                }
              }
            });
          } else {
            // Handle invalid session - could show error message
          }
        })
        .catch((error) => {
          console.error('❌ Session verification error in AuthGuard:', error);
        });
    }

    // Handle old Stripe success format (subscriptionId, subscriptionCustomer)
    else if (hasStripeSuccess) {
      console.log('🎉 Stripe payment success detected, updating auth state...');

      // Force refetch user data
      refetch().then((result) => {
        if (result.data && result.data.is_completed_onboarding) {
          // Get current access token
          const authData = localStorage.getItem('xblog_auth_session_v2');
          if (authData) {
            try {
              const parsedAuth = JSON.parse(authData);

              // Update Redux state with fresh user data
              dispatch(setCredentials({
                user: result.data,
                accessToken: parsedAuth.accessToken
              }));
            } catch (error) {
              console.error('Error updating auth state:', error);
            }
          }
        }
      });
    }
  }, [location.search, refetch, dispatch, verifySession]);

  // Show a loading indicator while verifying
  if (isVerifying) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Verifying authentication...</div>
      </div>
    );
  }

  // If not authenticated, redirect to sign-in
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  // Check onboarding status with fallback strategy
  const hasCompletedOnboarding = getOnboardingStatus(userData);
  const shouldRedirectToOnboarding = !hasCompletedOnboarding &&
                                     location.pathname !== '/onboarding' &&
                                     location.pathname !== '/';

  if (shouldRedirectToOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // If user data is not loaded yet, don't redirect (wait for data)
  if (!userData && isAuthenticated) {
    console.log('⏳ Waiting for user data to load...');
    // Don't redirect yet, wait for user data to load
  }

  return <>{children}</>;
}