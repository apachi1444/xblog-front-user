import type { CredentialResponse } from '@react-oauth/google';
import type { SignUpFormData } from 'src/validation/auth-schemas';

import toast from 'react-hot-toast';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormContainer, PasswordElement, TextFieldElement } from 'react-hook-form-mui';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { useFormErrorHandler } from 'src/hooks/useFormErrorHandler';

import { signUpSchema } from 'src/validation/auth-schemas';
import { setCredentials } from 'src/services/slices/auth/authSlice';
import { useSignUpMutation, useGoogleAuthMutation } from 'src/services/apis/authApi';

import { Logo } from 'src/components/logo';

export function SignUpView() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();



  // RTK Query hooks
  const [signUp, { isLoading }] = useSignUpMutation();
  const [googleAuth, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();

  // Setup form with react-hook-form and zod validation
  const formMethods = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onChange', // Validate on blur for better UX
  });

  // Use the form error handler hook
  useFormErrorHandler(formMethods.formState.errors);

  const handleSignUp = useCallback(async (data: SignUpFormData) => {
    try {
      // Add default avatar to form data
      const formData = {
        ...data,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
      };

      // Call the sign up API
      await signUp(formData).unwrap();

      // Show success message
      toast.success('Account created successfully! Redirecting to login...');

      // Redirect to sign in page after a delay
      setTimeout(() => {
        router.push('/sign-in');
      }, 500);
    } catch (error: any) {
      console.error('Sign up error:', error);

      // Check if the error has a detail field (common in API validation errors)
      if (error.data && error.data.detail) {
        // Display the specific error message from the API
        toast.error(error.data.detail);
      } else {
        // Fallback to generic error message
        toast.error('Failed to create account. Please try again.');
      }
    }
  }, [signUp, router]);

  const handleNavigateToSignIn = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    try {
      const jwtToken = response.credential || "";
      const result = await googleAuth(jwtToken).unwrap();

      if (!result?.token_access) {
        throw new Error('Invalid authentication response');
      }

      // Set tokens
      const credentials = { accessToken: result.token_access };
      dispatch(setCredentials(credentials));
      toast.success('Successfully signed up with Google!');

      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      console.error('Google sign up error:', error);

      // Check if the error has a detail field (common in API validation errors)
      if (error.data && error.data.detail) {
        // Display the specific error message from the API
        toast.error(error.data.detail);
      } else {
        // Fallback to generic error message
        toast.error('Failed to sign up with Google. Please try again.');
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: 2,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          p: 3,
          mx: 'auto',
          borderRadius: 2,
          boxShadow: (theme) => theme.customShadows.z16,
          bgcolor: 'background.paper',
          width: { xs: '100%', sm: '450px', md: '500px' }, // Reduced responsive width
          maxWidth: '95vw', // Ensure it doesn't overflow on small screens
          position: 'relative',
        }}
      >
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
          <Logo />
        </Box>

        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          {t('auth.signup.title', 'Join Our Creative Community')}
        </Typography>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          {t('auth.signup.subtitle', 'Start your creative journey with exclusive features')}
        </Typography>

        {/* Updated form with react-hook-form */}
        <FormContainer formContext={formMethods} onSuccess={handleSignUp}>
          <TextFieldElement
            {...formMethods.register('name')}
            name="name"
            label={t('auth.signup.fullName', "Full Name")}
            fullWidth
            margin="normal"
            autoComplete="name"
          />

          <TextFieldElement
            {...formMethods.register('email')}
            name="email"
            label={t('auth.signup.email', "Email address")}
            fullWidth
            margin="normal"
            autoComplete="email"
          />

          <PasswordElement
            name="password"
            label={t('auth.signup.password', "Password")}
            fullWidth
            margin="normal"
            required
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="primary"
            loading={isLoading}
            sx={{ mt: 2, mb: 2 }}
          >
            {t('auth.signup.createAccount', "Create Account")}
          </LoadingButton>
        </FormContainer>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('auth.signup.or', "OR")}
          </Typography>
        </Divider>

        {/* Google Sign Up Button */}
        <Box sx={{
          width: '100%',
          '& > div': {
            width: '100% !important',
          },
          '& iframe': {
            width: '100% !important',
            minHeight: '48px !important',
          },
          '& [data-testid="google-login-button"]': {
            width: '100% !important',
          },
          // Override Google's cached user styling
          '& .google-login-container': {
            width: '100% !important',
          },
          '& .google-login-button': {
            width: '100% !important',
            minWidth: '100% !important',
          }
        }}>
          {isGoogleLoading ? (
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
            <Box
              sx={{
                width: '100%',
                '& > div': {
                  width: '100% !important',
                },
                '& iframe': {
                  width: '100% !important',
                  minHeight: '48px !important',
                },
              }}
              id="google-signup-container"
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                text="signup_with"
                theme="filled_black"
                width="100%"
                size="large"
                onError={() => {
                  toast.error('Google sign up failed. Please try again.');
                }}
                useOneTap={false}
                context="signup"
                auto_select={false}
                prompt_parent_id="google-signup-container"
              />
            </Box>
          )}
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          {t('auth.signup.haveAccount', "Already have an account?")}{' '}
          <Link
            variant="subtitle2"
            component="button"
            onClick={handleNavigateToSignIn}
            sx={{ textDecoration: 'none' }}
            type="button"
          >
            {t('auth.signin.title', "Sign in")}
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}