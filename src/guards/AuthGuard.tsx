import { useSnackbar } from 'notistack';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, type ReactNode } from 'react';

import { useVerifyTokenQuery } from 'src/services/apis/authApi';
import { clearCredentials } from 'src/services/slices/auth/authSlice';
import { selectAccessToken, selectIsAuthenticated } from 'src/services/slices/auth/selectors';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [isVerifying, setIsVerifying] = useState(true);
  
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Skip verification if no token exists
  const skipVerification = !accessToken;
  
  const {
    data: verifyData,
    isLoading: isVerifyLoading,
    isError,
    error
  } = useVerifyTokenQuery(accessToken || '', {
    skip: skipVerification,
    // Add retry options to handle temporary API issues
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    // Handle API verification logic
    if (skipVerification) {
      // No token to verify, finish verification process immediately
      setIsVerifying(false);
    } else if (isVerifyLoading) {
      // Still verifying
      setIsVerifying(true);
    } else {
      // Verification completed (success or error)
      setIsVerifying(false);
      
      // Clear credentials on explicit invalid token
      if (verifyData && !verifyData.valid) {
        dispatch(clearCredentials());
        enqueueSnackbar('Your session has expired. Please sign in again.', {
          variant: 'warning',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
      }
      
      // For API errors, we'll still rely on local authentication state
      // but can optionally show a warning
      if (isError) {
        console.warn('Token verification API is unreachable', error);
        // Optionally notify user about connectivity issues
        // enqueueSnackbar('Authentication service unavailable, using local session data', { variant: 'info' });
      }
    }
  }, [verifyData, isVerifyLoading, isError, skipVerification, dispatch, enqueueSnackbar, error]);

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

  // If not authenticated, don't render anything as we're already redirecting
  if (!isAuthenticated || (verifyData && !verifyData.valid)) {
    return (
      <Navigate to="sign-in" replace/>
    )
  }

  return <>{children}</>;
}