

import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, type ReactNode } from 'react';

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

  // Check for Stripe success and update auth state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const hasStripeSuccess = urlParams.has('subscriptionId') &&
                             urlParams.has('subscriptionCustomer') &&
                             urlParams.get('redirect_status') === 'succeeded';

    const sessionId = urlParams.get('session_id');

    // Handle session_id verification
    if (sessionId) {
      console.log('🔍 Session ID detected, verifying...', sessionId);

      verifySession({ session_id: sessionId })
        .then((result) => {
          if (result.data && result.data.status === 'paid') {
            console.log('✅ Session verified successfully', result.data);

            // Force refetch user data after successful payment
            refetch().then((userResult) => {
              if (userResult.data && userResult.data.is_completed_onboarding) {
                console.log('✅ User onboarding completed, updating Redux state');

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
          console.log('✅ User onboarding completed, updating Redux state');

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

  // Check if user has completed onboarding
  const hasCompletedOnboarding = userData?.is_completed_onboarding;

  // Check for Stripe success parameters
  const urlParams = new URLSearchParams(location.search);
  const hasStripeSuccess = urlParams.has('subscriptionId') &&
                           urlParams.has('subscriptionCustomer') &&
                           urlParams.get('redirect_status') === 'succeeded';

  // Check for session_id (Stripe checkout success)
  const hasSessionId = urlParams.has('session_id');

  // Only redirect to onboarding if:
  // 1. User data is loaded AND
  // 2. User hasn't completed onboarding AND
  // 3. Not currently on onboarding page AND
  // 4. Not returning from Stripe payment AND
  // 5. Trying to access dashboard/home (not specific pages like profile)
  const shouldRedirectToOnboarding = userData && // Wait for user data to load
                                     !hasCompletedOnboarding &&
                                     location.pathname !== '/onboarding' &&
                                     !hasStripeSuccess &&
                                     !hasSessionId &&
                                     (location.pathname === '/');

  if (shouldRedirectToOnboarding) {
    console.log('🔄 Redirecting to onboarding - user has not completed onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  // If user data is not loaded yet, don't redirect (wait for data)
  if (!userData && isAuthenticated) {
    console.log('⏳ Waiting for user data to load...');
    // Don't redirect yet, wait for user data to load
  }

  return <>{children}</>;
}