import type { RootState } from 'src/services/store';

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { getToken } from 'src/utils/auth';
import { login } from 'src/services/slices/userSlice';

export const useAuthRedirect = (isProtectedRoute: boolean = true) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.user);

  const token = getToken();
  const currentPath = location.pathname;
  
  // Auth-related paths that should redirect to dashboard if user is logged in
  const authPaths = ['/sign-in', '/sign-up', '/forgot-password'];
  const isAuthPath = authPaths.includes(currentPath);

  useEffect(() => {
    // If there's a token but no user in state, restore the session
    if (token && !user) {
      // Restore user session from token
      dispatch(login({
        user: {
          name: 'Restored Session',
          email: 'restored@example.com',
        },
        userToken: token
      }));
    }

    // Handle redirections based on token existence and current path
    if (!loading) {
      if (token && isAuthPath) {
        // If user has token and is on auth page, redirect to dashboard
        navigate('/', { replace: true });
      } else if (!token && isProtectedRoute && !isAuthPath) {
        // If no token and trying to access protected route, redirect to sign in
        navigate('/sign-in', { replace: true });
      }
    }
  }, [loading, isProtectedRoute, navigate, user, token, dispatch, currentPath, isAuthPath]);

  return { isAuthenticated: !!token, loading };
};