import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useState, useEffect, type ReactNode } from 'react';

import { selectAccessToken, selectIsAuthenticated } from 'src/services/slices/auth/selectors';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isVerifying, setIsVerifying] = useState(true);
  
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Skip verification if no token exists
  const skipVerification = !accessToken;
  console.log(isAuthenticated, accessToken);

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

  // If not authenticated, don't render anything as we're already redirecting
  if (!isAuthenticated) {
    return (
      <Navigate to="sign-in" replace/>
    )
  }

  return <>{children}</>;
}