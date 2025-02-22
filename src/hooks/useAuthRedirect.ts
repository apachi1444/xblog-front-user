import type { RootState } from 'src/services/store';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getToken } from 'src/utils/auth';

export const useAuthRedirect = (isProtectedRoute: boolean = true) => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.user);
  console.log(user, loading);

  const token = getToken();

  console.log(token, isProtectedRoute); 

  useEffect(() => {
    if (loading) {
      if (isProtectedRoute && token === null) {
        // Redirect to login if accessing protected route without auth
        navigate('/sign-in', { replace: true });
      } else if (!isProtectedRoute && token !== null) {
        // Redirect to dashboard if accessing auth pages while logged in
        navigate('/', { replace: true });
      }
    }
  }, [loading, isProtectedRoute, navigate, user, token]);

  return { isAuthenticated: !!user, loading } 
};