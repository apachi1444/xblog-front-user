import type { RootState } from 'src/services/store';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = (isProtectedRoute: boolean = true) => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.user);
  console.log(user, loading);
  


  useEffect(() => {
    if (loading) {
      if (isProtectedRoute && !user) {
        // Redirect to login if accessing protected route without auth
        navigate('/sign-in', { replace: true });
      } else if (isProtectedRoute && user) {
        // Redirect to dashboard if accessing auth pages while logged in
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, isProtectedRoute, navigate]);

  return { isAuthenticated: !!user, loading };
}; 