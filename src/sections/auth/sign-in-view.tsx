
import type { CredentialResponse} from '@react-oauth/google';

import { useSnackbar } from "notistack";
import { GoogleLogin } from '@react-oauth/google';
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
import { Fade, Snackbar, CircularProgress } from "@mui/material";

import { useRouter } from 'src/routes/hooks';

import { setCredentials } from "src/services/slices/auth/authSlice";
// Import auth selectors and actions
import { selectIsAuthenticated } from 'src/services/slices/auth/selectors';
// Import auth API
import { useLoginMutation, useGoogleAuthMutation } from 'src/services/apis/authApi';

import { Logo } from 'src/components/logo/logo';
import { Iconify } from 'src/components/iconify';
import { RootState } from 'src/services/store';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();  
  
  // Local state
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Add these to your state declarations
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const handleCloseSnackbar = () => {
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };
  
  // Get auth state from Redux
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Google auth mutation
  const [googleAuth, { isLoading: isGoogleAuthLoading, error: googleAuthError }] = useGoogleAuthMutation();
  
  // Email/password login mutation
  const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();

  const onboardingCompleted = useSelector((state: RootState) => state.auth.onboardingCompleted);

  const loading = isGoogleAuthLoading || isLoginLoading
  
  // Effect to handle successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {        
        if (onboardingCompleted) {
          router.replace('/');
        } else {
          router.push('/onboarding');
        }
      }, 1000);
    }
  }, [isAuthenticated, onboardingCompleted, router]);

  // Handle email/password sign in
  const handleSignIn = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      setAlertMessage('Please enter both email and password');
      setShowErrorAlert(true);
      return;
    }
    
    try {
      // Call the real login API with email and password
      const result = await login({ 
        email: email.trim(), 
        password: password.trim() 
      }).unwrap();
      
      // Check if we have a valid user response
      if (!result?.token_access) {
        throw new Error('Invalid login response');
      }
      
      // Set credentials in Redux store
      dispatch(setCredentials({
        accessToken: result.token_access || 'default-token',
      }));
      
      // Show success message
      setAlertMessage('Successfully signed in!');
      setShowSuccessAlert(true);
          
    } catch (error) {
      dispatch(setCredentials({
        accessToken: 'default-token',
      }));
      setAlertMessage('Login failed. Please check your credentials and try again.');
      setShowErrorAlert(true);
    }
  }, [email, password, dispatch, login]);

  const handleNavigateToSignUp = useCallback(() => {
    router.push('/sign-up');
  }, [router]);

  const handleNavigateToForgotPassword = useCallback(() => {
    router.push('/forgot-password');
  }, [router]);
  
  const handleGoogleSuccess = async (response: CredentialResponse) => {
    try {
      const jwtToken = response.credential || "";
      const result = await googleAuth(jwtToken).unwrap();
      
      if (!result?.token_access) {
        throw new Error('Invalid authentication response');
      }
      
      // Set tokens first
      const credentials = { accessToken: result.token_access };
      dispatch(setCredentials(credentials));
      
      setAlertMessage('Successfully signed in with Google!');
      setShowSuccessAlert(true);
      
      setTimeout(() => router.replace('/'), 1000);
      
    } catch (error) {
      console.error('Google auth error:', error);
      setAlertMessage('Failed to authenticate with Google. Please try again.');
      setShowErrorAlert(true);
    }
  };
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
        mx : 'auto',
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows.z16,
        bgcolor: 'background.paper'
      }}
    >
      <Snackbar
          open={showSuccessAlert}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={Fade}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="success" 
            variant="filled"
            sx={{ 
              width: '100%',
              boxShadow: (theme) => theme.customShadows.z8,
              fontWeight: 'medium',
              '& .MuiAlert-icon': {
                color: '#fff'
              }
            }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
        
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
          loading={loading}
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

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: 48,
          width: '100%'
        }}>
          <CircularProgress size={24} color="primary" />
        </Box>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          text="signin_with"
          type="standard"
          theme="outline"
          size="large"
          logo_alignment="center"
          width="100%"
          shape="rectangular"
          onError={() => console.error("Google Login Failed")}
          useOneTap={false}
          context="signin"
        />
      )}

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
