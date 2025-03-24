import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthRedirect } from 'src/hooks/useAuthRedirect';

interface AuthRedirectProps {
  children: ReactNode;
}

export function AuthRedirect({ children }: AuthRedirectProps) {
  const { loading, isAuthenticated } = useAuthRedirect(false);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}