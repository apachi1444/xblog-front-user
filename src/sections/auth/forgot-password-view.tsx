import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

export function ForgotPasswordView() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNavigateToSignIn = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  const handleResetPassword = useCallback(() => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // In a real implementation, you would call your password reset API here
    }, 1500);
  }, [email]);

  return (
    <Box
      sx={{
        p: 3,
        mx: 'auto',
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows.z16,
        bgcolor: 'background.paper'
      }}
    >
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Logo />
        <Typography variant="h5" sx={{ pt: 2 }}>Forgot Password</Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Enter your email address and well send you a link to reset your password
        </Typography>
      </Box>

      {success ? (
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <Box 
            sx={{ 
              width: 60, 
              height: 60, 
              borderRadius: '50%', 
              bgcolor: 'success.lighter',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <Iconify icon="eva:checkmark-fill" width={30} height={30} color="success.main" />
          </Box>
          
          <Typography variant="h6">Check Your Email</Typography>
          
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Weve sent a password reset link to your email address.
            Please check your inbox and follow the instructions.
          </Typography>
          
          <LoadingButton
            fullWidth
            size="large"
            variant="contained"
            onClick={handleNavigateToSignIn}
            sx={{
              mt: 2,
              borderRadius: '8px',
              py: 1.5
            }}
          >
            Back to Sign In
          </LoadingButton>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={3}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          <TextField
            fullWidth
            name="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="ic:round-email" />
                </InputAdornment>
              ),
            }}
          />
          
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={loading}
            onClick={handleResetPassword}
            sx={{
              borderRadius: '8px',
              py: 1.5
            }}
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
      )}
    </Box>
  );
}