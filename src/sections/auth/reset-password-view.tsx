import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormContainer, PasswordElement } from 'react-hook-form-mui';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useFormErrorHandler } from 'src/hooks/useFormErrorHandler';

import { useResetPasswordMutation } from 'src/services/apis/authApi';
import { resetPasswordSchema, type ResetPasswordFormData } from 'src/validation/auth-schemas';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { LanguageSwitcher } from 'src/components/language/language-switcher';

export function ResetPasswordView() {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Setup form with react-hook-form and zod validation
  const formMethods = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  // Use the form error handler hook
  useFormErrorHandler(formMethods.formState.errors);

  const handleResetPassword = useCallback(async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid or expired reset token');
      return;
    }

    try {
      await resetPassword({ token, password: data.password }).unwrap();
      toast.success('Password reset successfully! Please sign in with your new password.');
      
      // Redirect to sign in page after a delay
      setTimeout(() => {
        router.push('/sign-in');
      }, 2000);
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    }
  }, [token, resetPassword, router]);

  const handleNavigateToSignIn = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  if (!token) {
    return (
      <Box
        sx={{
          p: 3,
          mx: 'auto',
          borderRadius: 2,
          boxShadow: (theme) => theme.customShadows.z16,
          bgcolor: 'background.paper',
        }}
      >
        <Alert severity="error" sx={{ mb: 3 }}>
          Invalid or expired reset token. Please request a new password reset link.
        </Alert>
        <LoadingButton
          fullWidth
          size="large"
          variant="contained"
          onClick={handleNavigateToSignIn}
        >
          {t('auth.common.backToSignIn')}
        </LoadingButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        mx: 'auto',
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows.z16,
        bgcolor: 'background.paper',
        position: 'relative',
      }}
    >
      <LanguageSwitcher />
      
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Logo />
        <Typography variant="h5" sx={{ pt: 2 }}>
          {t('auth.resetPassword.title', 'Reset Password')}
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {t('auth.resetPassword.subtitle', 'Enter your new password below')}
        </Typography>
      </Box>

      <FormContainer formContext={formMethods} onSuccess={handleResetPassword}>
        <Box display="flex" flexDirection="column" gap={3}>
          <PasswordElement
            name="password"
            label={t('auth.resetPassword.newPassword', 'New Password')}
            fullWidth
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'ic:round-visibility' : 'ic:round-visibility-off'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <PasswordElement
            name="confirmPassword"
            label={t('auth.resetPassword.confirmPassword', 'Confirm New Password')}
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    <Iconify icon={showConfirmPassword ? 'ic:round-visibility' : 'ic:round-visibility-off'} />
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
            loading={isLoading}
          >
            {t('auth.resetPassword.submit', 'Reset Password')}
          </LoadingButton>

          <Typography variant="body2" color="text.secondary" align="center">
            {t('auth.resetPassword.rememberPassword', 'Remember your password?')}{' '}
            <Link
              variant="subtitle2"
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                  opacity: 'revert'
                }
              }}
              onClick={handleNavigateToSignIn}
            >
              {t('auth.signin.signIn', 'Sign In')}
            </Link>
          </Typography>
        </Box>
      </FormContainer>
    </Box>
  );
}