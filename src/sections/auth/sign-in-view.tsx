import type { RootState } from 'src/services/store';
import type { CredentialResponse} from '@react-oauth/google';
import type { SignInFormData} from 'src/validation/auth-schemas';

import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useEffect, useCallback } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { FormContainer, PasswordElement, TextFieldElement } from 'react-hook-form-mui';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
  import LoadingButton from '@mui/lab/LoadingButton';
import { Switch, Tooltip, CircularProgress, FormControlLabel } from "@mui/material";

import { useRouter } from 'src/routes/hooks';

import { useFormErrorHandler } from 'src/hooks/useFormErrorHandler';

import { signInSchema } from 'src/validation/auth-schemas';
import { useGetPlansQuery } from 'src/services/apis/plansApi';
import { useLazyGetCurrentUserQuery } from 'src/services/apis/userApi';
import { selectIsAuthenticated } from 'src/services/slices/auth/selectors';
import { setTestMode, selectIsTestMode } from 'src/services/slices/globalSlice';
import { useLoginMutation, useGoogleAuthMutation } from 'src/services/apis/authApi';
import { setAvailablePlans } from 'src/services/slices/subscription/subscriptionSlice';
import { setCredentials, setOnboardingCompleted } from 'src/services/slices/auth/authSlice';

import { Logo } from 'src/components/logo/logo';
// Import the centralized language switcher
import { LanguageSwitcher } from 'src/components/language/language-switcher';

// Mock data for test mode
const MOCK_USER_DATA = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  is_completed_onboarding: true,
};

const MOCK_ACCESS_TOKEN = 'test-mode-access-token';

export function SignInView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const testMode = useSelector(selectIsTestMode);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const onboardingCompleted = useSelector((state: RootState) => state.auth.onboardingCompleted);
  
  const [googleAuth, { isLoading: isGoogleAuthLoading }] = useGoogleAuthMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [getCurrentUser] = useLazyGetCurrentUserQuery();
  
  // Setup form with react-hook-form and zod validation
  const formMethods = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });
  
  useFormErrorHandler(formMethods.formState.errors);
  
  // Update form values when test mode changes
  useEffect(() => {
    if (testMode) {
      formMethods.setValue('email', 'test@example.com');
      formMethods.setValue('password', 'Test123!');
    } else {
      formMethods.setValue('email', '');
      formMethods.setValue('password', '');
    }
  }, [testMode, formMethods]);
  
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTimeout = setTimeout(() => {
        router.replace(onboardingCompleted ? '/' : '/onboarding');
      }, 1000);
      
      return () => clearTimeout(redirectTimeout);
    }
    
    // Explicit return for when the condition isn't met
    return undefined;
  }, [isAuthenticated, onboardingCompleted, router]);
  
  // Simulate login with mock data in test mode
  const handleTestModeLogin = useCallback(() => {
    dispatch(setCredentials({
      accessToken: MOCK_ACCESS_TOKEN,
      user: MOCK_USER_DATA
    }));
    dispatch(setOnboardingCompleted(false));
    toast.success(t('auth.testMode.redirecting'));
  }, [dispatch, t]);
  
  
  // Inside the SignInView component, add this hook
  const  { data : plansData } = useGetPlansQuery();
  
  // Update the handleAuthSuccess function to fetch plans
  const handleAuthSuccess = useCallback(async (accessToken: string) => {
    if (testMode) {
      handleTestModeLogin();
      router.replace('/onboarding'); // Move navigation here
      return;
    }
    
    try {
      const userData = await getCurrentUser().unwrap();
      const isOnboardingCompleted = userData?.is_completed_onboarding ?? false;
      
      dispatch(setCredentials({accessToken, user: userData}));
      dispatch(setOnboardingCompleted(isOnboardingCompleted));
      
      try {
        if (plansData && plansData.plans) {
          dispatch(setAvailablePlans(plansData.plans));
        }
      } catch (error) {
        toast.error('Failed to fetch plans. Using fallback plans.');
      }
      
      router.replace(isOnboardingCompleted ? '/' : '/onboarding');
    } catch (error) {
      if (testMode) {
        handleTestModeLogin();
      } else {
        dispatch(setCredentials({accessToken, user: null}));
        console.error('Failed to fetch user data:', error);
      }
    }
  }, [testMode, handleTestModeLogin, router, getCurrentUser, dispatch, plansData]);
  
  // Handle email/password sign in
  const handleSignIn = useCallback(async (data: SignInFormData) => {
    if (testMode) {
      handleTestModeLogin();
      return;
    }
    
    try {
      const result = await login({ 
        email: data.email.trim(), 
        password: data.password.trim() 
      }).unwrap();
      
      if (!result?.token_access) {
        throw new Error('Invalid login response');
      }
      
      toast.success('Successfully signed in!');
      await handleAuthSuccess(result.token_access);
    } catch (error) {
      toast.error('Login failed. Please check your credentials and try again.');
    }
  }, [login, handleAuthSuccess, testMode, handleTestModeLogin]);
  
  // Handle Google authentication
  const handleGoogleSuccess = useCallback(async (response: CredentialResponse) => {
    if (testMode) {
      handleTestModeLogin();
      return;
    }
    
    try {
      const jwtToken = response.credential || "";
      const result = await googleAuth(jwtToken).unwrap();
      
      if (!result?.token_access) {
        throw new Error('Invalid authentication response');
      }
      
      toast.success('Successfully signed in with Google!');
      await handleAuthSuccess(result.token_access);
    } catch (error) {
      toast.error('Failed to authenticate with Google. Please try again.');
    }
  }, [googleAuth, handleAuthSuccess, testMode, handleTestModeLogin]);
  
  const handleToggleTestMode = useCallback(() => {
    dispatch(setTestMode(!testMode));
    toast.success(
      !testMode 
        ? t('auth.testMode.enabled') 
        : t('auth.testMode.disabled')
    );
  }, [dispatch, t, testMode]);
  
  const handleNavigateToSignUp = useCallback(() => {
    router.push('/sign-up');
  }, [router]);
  
  const handleNavigateToForgotPassword = useCallback(() => {
    router.push('/forgot-password');
  }, [router]);


  return (
    <Box
      sx={{
        p: 3,
        mx : 'auto',
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows.z16,
        bgcolor: 'background.paper',
        position: 'relative',
      }}
    >
      {/* Top row with test mode toggle and language switcher */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        zIndex: 9
      }}>
        {/* Test Mode Toggle */}
        <Tooltip title={testMode ? "Authentication will be bypassed" : "Use real authentication"}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={testMode}
                onChange={handleToggleTestMode}
                color="warning"
              />
            }
            label={
              <Typography variant="caption" color={testMode ? 'warning.main' : 'text.secondary'}>
                Test Mode
              </Typography>
            }
          />
        </Tooltip>
        
        <LanguageSwitcher sx={{ position: 'relative', top: 0, right: 0 }} />
      </Box>

      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
        <Logo />
      </Box>

      {/* Rest of the component remains the same but with translations */}
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        {t('auth.signin.title', 'Sign in to XBlog')}
      </Typography>

      {testMode && (
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 2, 
            textAlign: 'center', 
            color: 'warning.main',
            bgcolor: 'warning.lighter',
            py: 1,
            px: 2,
            borderRadius: 1
          }}
        >
          🔔 Test mode is active. Sign in will bypass authentication.
        </Typography>
      )}

      {/* Update form labels with translations */}
      <FormContainer formContext={formMethods} onSuccess={handleSignIn}>
        <TextFieldElement
          name="email"
          label={t('auth.signin.email', 'Email address')}
          fullWidth
          margin="normal"
          autoComplete="email"
          disabled={testMode}
        />

        <PasswordElement
          name="password"
          label={t('auth.signin.password', 'Password')}
          fullWidth
          margin="normal"
          disabled={testMode}
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
            disabled={testMode}
          >
            {t('auth.signin.forgotPassword', 'Forgot password?')}
          </Link>
        </Box>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color={testMode ? "warning" : "primary"}
          loading={isLoginLoading && !testMode}
          sx={{ mb: 2 }}
        >
          {testMode 
            ? t('auth.signin.enterTestMode', 'Enter Test Dashboard') 
            : t('auth.signin.signIn', 'Sign In')}
        </LoadingButton>
      </FormContainer>

      {!testMode && (
        <>
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('auth.signin.or', 'OR')}
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
        </>
      )}

      {!testMode && (
        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          {t('auth.signin.noAccount', 'Don\'t have an account?')}{' '}
          <Link
            variant="subtitle2"
            component="button"
            onClick={handleNavigateToSignUp}
            sx={{ textDecoration: 'none' }}
            type="button"
          >
            {t('auth.signin.signUp', 'Sign up')}
          </Link>
        </Typography>
      )}
    </Box>
  );
}
