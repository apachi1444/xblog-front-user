
import { useSnackbar } from "notistack";
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { setCredentials } from "src/services/slices/auth/authSlice";
// Import auth selectors and actions
import { selectIsAuthenticated } from 'src/services/slices/auth/selectors';
// Import auth API
import { useLoginMutation, useGoogleAuthMutation } from 'src/services/apis/authApi';

import { Logo } from 'src/components/logo/logo';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();  
  
  // Local state
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Get auth state from Redux
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Google auth mutation
  const [googleAuth, { isLoading: isGoogleAuthLoading, error: googleAuthError }] = useGoogleAuthMutation();
  
  // Email/password login mutation
  const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
  
  // Effect to handle successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      // User is authenticated, redirect to home
      enqueueSnackbar("Successfully signed in!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      
      // Use setTimeout to ensure the state update has completed
      setTimeout(() => {
        router.push('/');
      }, 100);
    }
  }, [isAuthenticated, router, enqueueSnackbar]);

  // Handle email/password sign in
  const handleSignIn = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      enqueueSnackbar("Please enter both email and password", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      return;
    }
    
    try {
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create fake user data
      const fakeUser = {
        id: '123456',
        name: email.split('@')[0], // Use part of email as name
        email,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}`,
      };
      
      // Create fake tokens
      const fakeTokens = {
        accessToken: `fake-jwt-token-${Math.random().toString(36).substring(2)}`,
        refreshToken: `fake-refresh-token-${Math.random().toString(36).substring(2)}`,
      };
      
      // Set credentials in Redux store
      dispatch(setCredentials({
        user: fakeUser,
        accessToken: fakeTokens.accessToken,
        refreshToken: fakeTokens.refreshToken,
      }));
      
      // Log the authentication state for debugging
      console.log('Authentication credentials set:', {
        user: fakeUser,
        accessToken: fakeTokens.accessToken,
      });
      
      // Manual redirect in case the useEffect doesn't trigger
      if (!isAuthenticated) {
        enqueueSnackbar("Successfully signed in!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
        
        // Force navigation after a short delay
        setTimeout(() => {
          router.push('/');
        }, 300);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      enqueueSnackbar("Login failed. Please check your credentials and try again.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    }
  }, [email, password, dispatch, enqueueSnackbar, router, isAuthenticated]);

  // Handle Google login
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Call the Google auth API with the access token
        const result = await googleAuth(response.access_token).unwrap();
        
        if (!result || !result.user || !result.tokens || !result.tokens.accessToken) {
          throw new Error('Invalid authentication response');
        }
        
        dispatch(setCredentials({
          user: result.user,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        }));
        
      } catch (err) {
        console.error('Google auth error:', err);
        enqueueSnackbar("Failed to authenticate with Google. Please try again.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      enqueueSnackbar("Google login failed. Please try again.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    }
  });

  const handleGoogleLogin = () => {
    try {
      googleLogin();
    } catch (err) {
      enqueueSnackbar("Failed to initialize Google login. Please try again.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    }
  };

  const handleNavigateToSignUp = useCallback(() => {
    router.push('/sign-up');
  }, [router]);

  const handleNavigateToForgotPassword = useCallback(() => {
    router.push('/forgot-password');
  }, [router]);

  // Determine if there's any error to display
  const errorMessage = googleAuthError 
    ? 'Failed to authenticate with Google. Please try again.' 
    : loginError 
      ? 'Login failed. Please check your credentials and try again.'
      : null;

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows.z16,
        bgcolor: 'background.paper'
      }}
    >
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Logo />
      </Box>

      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Sign in to XBlog
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSignIn}>
        <TextField
          fullWidth
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Box
          sx={{
            my: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            component="button"
            variant="subtitle2"
            onClick={handleNavigateToForgotPassword}
            sx={{ textDecoration: 'none' }}
          >
            Forgot password?
          </Link>
        </Box>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="primary"
          loading={isLoginLoading}
          sx={{ mb: 2 }}
        >
          Sign In
        </LoadingButton>
      </form>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <LoadingButton 
          fullWidth
          size="large"
          variant="outlined"
          color="primary"
          onClick={handleGoogleLogin}
          loading={isGoogleAuthLoading}
          startIcon={<Iconify icon="logos:google-icon" />}
          sx={{
            borderRadius: '8px',
            py: 1.5,
            justifyContent: 'center',
            borderColor: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
              opacity: 'revert'
            }
          }}
        >
          Sign in with Google
        </LoadingButton>
      </Box>

      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Don&apos;t have an account?{' '}
        <Link
          variant="subtitle2"
          component="button"
          onClick={handleNavigateToSignUp}
          sx={{ textDecoration: 'none' }}
        >
          Sign up
        </Link>
      </Typography>
    </Box>
  );
}
