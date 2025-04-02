import type { ReactNode } from 'react';

import { Navigate } from 'react-router-dom';

import { useAuthRedirect } from 'src/hooks/useAuthRedirect';


interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { loading, isAuthenticated } = useAuthRedirect(true);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}