import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { useVerifyEmailMutation } from 'src/services/apis/authApi';

import { Logo } from 'src/components/logo';

export function VerifyEmailView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get token from URL query parameters
  const token = searchParams.get('token');

  // State for verification status
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Get the verify email mutation
  const [verifyEmail] = useVerifyEmailMutation();

  // Verify email on component mount
  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!token) {
        setVerificationStatus('error');
        setErrorMessage('Verification token is missing');
        return;
      }

      try {
        await verifyEmail({ token }).unwrap();
        setVerificationStatus('success');

        // Redirect to sign-in page after a delay
        setTimeout(() => {
          navigate('/sign-in');
        }, 3000);
      } catch (error: any) {
        setVerificationStatus('error');

        // Extract error message from API response
        if (error.data && error.data.detail) {
          setErrorMessage(error.data.detail);
          toast.error(error.data.detail);
        } else {
          setErrorMessage('Failed to verify email. Please try again.');
          toast.error('Failed to verify email. Please try again.');
        }

        // Redirect to sign-in page after a longer delay
        setTimeout(() => {
          navigate('/sign-in');
        }, 5000);
      }
    };

    verifyUserEmail();
  }, [token, verifyEmail, navigate]);

  // Handle manual navigation to sign-in
  const handleNavigateToSignIn = () => {
    navigate('/sign-in');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        bgcolor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 480,
          minWidth: 350,
          width: '100%',
          textAlign: 'center',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Logo />
        </Box>

        {/* Title */}
        <Typography variant="h4" gutterBottom>
          {verificationStatus === 'loading' && 'Verifying Your Email'}
          {verificationStatus === 'success' && 'Email Verified!'}
          {verificationStatus === 'error' && 'Verification Failed'}
        </Typography>

        {/* Status message */}
        <Typography variant="body1" color="text.secondary" paragraph>
          {verificationStatus === 'loading' && 'Please wait while we verify your email address...'}
          {verificationStatus === 'success' && 'Your email has been successfully verified. You can now sign in to your account.'}
          {verificationStatus === 'error' && (errorMessage || 'We couldn\'t verify your email. The link may have expired or is invalid.')}
        </Typography>

        {/* Animation/Icon */}
        <Box sx={{ my: 4, height: 180, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {verificationStatus === 'loading' && (
            <CircularProgress size={80} thickness={4} />
          )}

          {verificationStatus === 'success' && (
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.success.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(0, 200, 83, 0.4)' },
                  '70%': { transform: 'scale(1)', boxShadow: '0 0 0 15px rgba(0, 200, 83, 0)' },
                  '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(0, 200, 83, 0)' },
                },
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main' }} />
            </Box>
          )}

          {verificationStatus === 'error' && (
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.error.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
              <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />
            </Box>
          )}
        </Box>

        {/* Action button */}
        <Button
          variant="contained"
          size="large"
          onClick={handleNavigateToSignIn}
          sx={{
            mt: 2,
            px: 4,
            bgcolor: verificationStatus === 'success' ? 'success.main' : 'primary.main',
            '&:hover': {
              bgcolor: verificationStatus === 'success' ? 'success.dark' : 'primary.dark',
            }
          }}
          startIcon={
            verificationStatus === 'success' ? <CheckCircleOutlineIcon /> :
            verificationStatus === 'error' ? <ErrorOutlineIcon /> : null
          }
        >
          Go to Sign In
        </Button>

        {/* Background decoration */}
        {verificationStatus === 'success' && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 100,
              height: 100,
              bgcolor: alpha(theme.palette.success.main, 0.1),
              borderBottomLeftRadius: '100%',
              zIndex: 0,
            }}
          />
        )}

        {verificationStatus === 'error' && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 100,
              height: 100,
              bgcolor: alpha(theme.palette.error.main, 0.1),
              borderBottomLeftRadius: '100%',
              zIndex: 0,
            }}
          />
        )}
      </Paper>
    </Box>
  );
}
