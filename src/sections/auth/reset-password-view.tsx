import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';
import { FormContainer, PasswordElement } from 'react-hook-form-mui';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { useRouter } from 'src/routes/hooks';

import { useResetPasswordMutation } from 'src/services/apis/authApi';
import { resetPasswordSchema, type ResetPasswordFormData } from 'src/validation/auth-schemas';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

export function ResetPasswordView() {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for reset status
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Use the reset password mutation
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Setup form with react-hook-form and zod validation
  const formMethods = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  // Validate token on component mount
  useEffect(() => {
    if (!token) {
      setResetStatus('error');
      setErrorMessage('Invalid or expired reset token. Please request a new password reset link.');
    }
  }, [token]);

  const handleResetPassword = useCallback(async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid or expired reset token');
      return;
    }

    setResetStatus('loading');

    try {
      await resetPassword({ token, new_password: data.password }).unwrap();
      setResetStatus('success');
      toast.success('Password reset successfully! Please sign in with your new password.');

      // Redirect to sign in page after a delay
      setTimeout(() => {
        router.push('/sign-in');
      }, 3000);
    } catch (error: any) {
      setResetStatus('error');

      // Extract error message from API response
      if (error.data && error.data.detail) {
        setErrorMessage(error.data.detail);
        toast.error(error.data.detail);
      } else {
        setErrorMessage('Failed to reset password. Please try again.');
        toast.error('Failed to reset password. Please try again.');
      }
    }
  }, [token, resetPassword, router]);

  const handleNavigateToSignIn = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  // Show success state
  if (resetStatus === 'success') {
    return (
      <Box
        sx={{
          p: 3,
          mx: 'auto',
          width: '100%',
          maxWidth: 480,
          minWidth: 350,
          borderRadius: 2,
          boxShadow: 'customShadows.z16',
          bgcolor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Logo />
        </Box>

        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'success.lighter',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            animation: 'pulse 1.5s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(0, 200, 83, 0.4)' },
              '70%': { transform: 'scale(1)', boxShadow: '0 0 0 15px rgba(0, 200, 83, 0)' },
              '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(0, 200, 83, 0)' },
            },
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: 50, color: 'success.main' }} />
        </Box>

        <Typography variant="h5" gutterBottom>
          Password Reset Successful!
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          Your password has been reset successfully. You can now sign in with your new password.
        </Typography>

        <LoadingButton
          fullWidth
          size="large"
          variant="contained"
          onClick={handleNavigateToSignIn}
          color="success"
          sx={{ mt: 2 }}
        >
          Go to Sign In
        </LoadingButton>
      </Box>
    );
  }

  // Show error state for invalid token
  if (resetStatus === 'error' || !token) {
    return (
      <Box
        sx={{
          p: 3,
          mx: 'auto',
          width: '100%',
          maxWidth: 480,
          minWidth: 350,
          borderRadius: 2,
          boxShadow: 'customShadows.z16',
          bgcolor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Logo />
        </Box>

        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'error.lighter',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            animation: 'shake 0.5s',
            '@keyframes shake': {
              '0%': { transform: 'translateX(0)' },
              '25%': { transform: 'translateX(5px)' },
              '50%': { transform: 'translateX(-5px)' },
              '75%': { transform: 'translateX(5px)' },
              '100%': { transform: 'translateX(0)' },
            },
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 50, color: 'error.main' }} />
        </Box>

        <Typography variant="h5" gutterBottom>
          Password Reset Failed
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          {errorMessage || 'Invalid or expired reset token. Please request a new password reset link.'}
        </Typography>

        <LoadingButton
          fullWidth
          size="large"
          variant="contained"
          onClick={handleNavigateToSignIn}
          sx={{ mt: 2 }}
        >
          Back to Sign In
        </LoadingButton>
      </Box>
    );
  }

  // Show form for resetting password
  return (
    <Box
      sx={{
        p: 3,
        mx: 'auto',
        width: '100%',
        maxWidth: 480,
        minWidth: 350,
        borderRadius: 2,
        boxShadow: 'customShadows.z16',
        bgcolor: 'background.paper',
        position: 'relative',
      }}
    >
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Logo />
        <Typography variant="h5" sx={{ pt: 2 }}>
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Enter your new password below
        </Typography>
      </Box>

      {resetStatus === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      )}

      {resetStatus !== 'loading' && (
        <FormContainer formContext={formMethods} onSuccess={handleResetPassword}>
          <Box display="flex" flexDirection="column" gap={3}>
            <PasswordElement
              {...formMethods.register('password')}
              name="password"
              label="New Password"
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
              {...formMethods.register('confirmPassword')}
              name="confirmPassword"
              label="Confirm New Password"
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
              Reset Password
            </LoadingButton>

            <Typography variant="body2" color="text.secondary" align="center">
              Remember your password?{' '}
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
                Sign In
              </Link>
            </Typography>
          </Box>
        </FormContainer>
      )}
    </Box>
  );
}