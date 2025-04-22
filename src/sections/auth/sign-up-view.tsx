import type { CredentialResponse } from '@react-oauth/google';
import type { SignUpFormData } from 'src/validation/auth-schemas';

import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormContainer, PasswordElement, TextFieldElement } from 'react-hook-form-mui';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import { CircularProgress } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useFormErrorHandler } from 'src/hooks/useFormErrorHandler';

import { signUpSchema } from 'src/validation/auth-schemas';
import { setCredentials } from 'src/services/slices/auth/authSlice';
import { useSignUpMutation, useGoogleAuthMutation } from 'src/services/apis/authApi';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

export function SignUpView() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertMessage, setAlertMessage] = useState('');
  
  // RTK Query hooks
  const [signUp, { isLoading }] = useSignUpMutation();
  const [googleAuth, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();
  
  // Update loading state to include Google loading
  const loading = isLoading || isGoogleLoading;
  
  // Setup form with react-hook-form and zod validation
  const formMethods = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onBlur', // Validate on blur for better UX
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
      }, 2000);
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to create account. Please try again.');
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
    } catch (error) {
      console.error('Google sign up error:', error);
      toast.error('Failed to sign up with Google. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 2,
        overflow: 'auto',
        position: 'relative',
      }}
    > 
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          boxShadow: (theme) => theme.customShadows.z16,
          bgcolor: 'background.paper',
          width: { xs: '100%', sm: '600px', md: '800px', lg: '1000px' }, // Responsive width
          maxWidth: '95vw', // Ensure it doesn't overflow on small screens
          maxHeight: '90vh',
          mx: 'auto',
        }}
      >
        <Box gap={1} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 3 }}>
          <Logo />
          
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            {t('auth.signup.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('auth.signup.subtitle')}
          </Typography>
        
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            {t('auth.signup.haveAccount')}
            <Link variant="subtitle2" 
              sx={{ 
                ml: 0.5,
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                  opacity: 'revert'
                } 
              }} 
              onClick={handleNavigateToSignIn}>
              {t('auth.signin.title')}
            </Link>
          </Typography>
        </Box>

        {/* Alert for success/error messages */}
        {showAlert && (
          <Alert 
            severity={alertType} 
            sx={{ mb: 3 }}
            onClose={() => setShowAlert(false)}
          >
            {alertMessage}
          </Alert>
        )}

        {/* Updated form with react-hook-form */}
        <FormContainer formContext={formMethods} onSuccess={handleSignUp}>
          <Box display="flex" flexDirection="column" gap={3} sx={{ width: '100%' }}>
            <TextFieldElement
              name="name"
              label={t('auth.signup.fullName')}
              placeholder={t('auth.signup.fullNamePlaceholder')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="ic:round-person" />
                  </InputAdornment>
                ),
              }}
            />

            <TextFieldElement
              name="email"
              label={t('auth.signup.email')}
              placeholder={t('auth.signup.emailPlaceholder')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="ic:round-email" />
                  </InputAdornment>
                ),
              }}
            />

            <PasswordElement
              name="password"
              label={t('auth.signup.password')}
              placeholder="*******"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="ic:round-lock" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'ic:round-visibility' : 'ic:round-visibility-off'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              loading={isLoading}
              sx={{ mt: 2 }}
            >
              {t('auth.signup.createAccount')}
            </LoadingButton>
          </Box>
        </FormContainer>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('auth.signup.or')}
          </Typography>
        </Divider>

        {/* Google Sign Up Button */}
        <Box sx={{ width: '100%' }}>
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
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              text="signup_with"
              type="standard"
              theme="outline"
              size="large"
              logo_alignment="center"
              width="100%"
              shape="rectangular"
              onError={() => {
                toast.error('Google sign up failed. Please try again.');
              }}
              useOneTap={false}
              context="signup"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}