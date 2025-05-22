import type { RootState } from 'src/services/store';

import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, type ReactNode } from 'react';

import { selectAccessToken, selectIsAuthenticated } from 'src/services/slices/auth/selectors';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isVerifying, setIsVerifying] = useState(true);
  const location = useLocation();

  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const onboardingCompleted = useSelector((state: RootState) => state.auth.onboardingCompleted);

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

  // If authenticated but onboarding not completed, redirect to onboarding
  // Only redirect if we're not already on the onboarding page
  if (!onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If authenticated and onboarding completed, or already on onboarding page, render children
  return <>{children}</>;
}