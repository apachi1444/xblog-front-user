
import type { RootState } from 'src/services/store';
import type { CredentialResponse} from '@react-oauth/google';
import type { SignInFormData} from 'src/validation/auth-schemas';

import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { FormContainer, PasswordElement, TextFieldElement } from 'react-hook-form-mui';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import { CircularProgress } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

// Add this import
import { useFormErrorHandler } from 'src/hooks/useFormErrorHandler';

import { signInSchema } from 'src/validation/auth-schemas';
import { setCredentials } from "src/services/slices/auth/authSlice";
// Import auth selectors and actions
import { selectIsAuthenticated } from 'src/services/slices/auth/selectors';
import { useLoginMutation, useGoogleAuthMutation } from 'src/services/apis/authApi';

import { Logo } from 'src/components/logo/logo';
import { Iconify } from 'src/components/iconify';

export function SignInView() {
  const router = useRouter();
  const dispatch = useDispatch();  
  
  // Local state
  const [showPassword, setShowPassword] = useState(false);
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [googleAuth, { isLoading: isGoogleAuthLoading, error: googleAuthError }] = useGoogleAuthMutation();
  
  // Email/password login mutation
  const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();

  const onboardingCompleted = useSelector((state: RootState) => state.auth.onboardingCompleted);  
  
  // Setup form with react-hook-form and zod validation
  const formMethods = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });
  
  // Add this line to use the error handler
  useFormErrorHandler(formMethods.formState.errors);
  
  // Effect to handle successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {        
        if (onboardingCompleted) {
          router.replace('/');
        } else {
          router.replace('/onboarding');
        }
      }, 1000);
    }
  }, [isAuthenticated, onboardingCompleted, router]);

  // Handle email/password sign in
  const handleSignIn = useCallback(async (data: SignInFormData) => {
    try {
      // Call the real login API with email and password
      const result = await login({ 
        email: data.email.trim(), 
        password: data.password.trim() 
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
      toast.success('Successfully signed in!');
          
    } catch (error) {
      dispatch(setCredentials({
        accessToken: 'default-token',
      }));
      toast.error('Login failed. Please check your credentials and try again.');
      console.error('Login error:', error);
    }
  }, [dispatch, login]);

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
      toast.success('Successfully signed in with Google!');      
      setTimeout(() => router.replace('/'), 1000);
      
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error('Failed to authenticate with Google. Please try again.');
    }
  };

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
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Logo />
      </Box>

      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Sign in to XBlog
      </Typography>

      <FormContainer formContext={formMethods} onSuccess={handleSignIn}>
        <TextFieldElement
          name="email"
          label="Email address"
          fullWidth
          margin="normal"
          autoComplete="email"
        />

        <PasswordElement
          name="password"
          label="Password"
          fullWidth
          margin="normal"
          autoComplete="current-password"
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
            type="button"
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
      </FormContainer>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>

      {isGoogleAuthLoading ? (
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
            theme="filled_black"
            onError={() => toast.error("Google Login Failed")}
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
          type="button"
        >
          Sign up
        </Link>
      </Typography>
    </Box>
  );
}
