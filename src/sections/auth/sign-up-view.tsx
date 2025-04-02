import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { useDispatch } from 'react-redux';

export function SignUpView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const handleSignIn = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleSignUp = useCallback(() => {
    router.push('/sign-up');
  }, [router]);

  const handleNavigateToSignIn = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  const renderForm = (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box display="flex" gap={2}>
        <TextField
          fullWidth
          name="firstName"
          label="First Name"
          placeholder="John"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="ic:round-person" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          name="lastName"
          label="Last Name"
          placeholder="Doe"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="ic:round-person" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TextField
        fullWidth
        name="email"
        label="Email Address"
        placeholder="john.doe@creative.com"
        InputLabelProps={{ shrink: true }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="ic:round-email" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        name="password"
        label="Create Password"
        type={showPassword ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="mdi:password-outline" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="mdi:password-check" />
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={handleSignUp}
        sx={{ mt: 2 }}
      >
        Create Account
      </LoadingButton>

      <Typography variant="body2" color="text.secondary" align="center">
        By signing up, you agree to our{' '}
        <Link href="#" variant="subtitle2">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="#" variant="subtitle2">
          Privacy Policy
        </Link>
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows.z16,
        bgcolor: 'background.paper'
      }}
    >
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Logo sx={{ mb: 5 }} variant="full" />
        
        <Typography variant="h3" sx={{ mb: 1 }}>
          Join Our Creative Community
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Start your creative journey with exclusive features
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Already have an account?
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
            Sign In
          </Link>
        </Typography>
      </Box>

      {renderForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR CONTINUE WITH
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <LoadingButton 
          fullWidth
          size="large"
          variant="outlined"
          color="primary"
          onClick={() => handleSignIn()}
          disabled={loading}
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
          Sign up with Google
        </LoadingButton>
      </Box>
    </Box>
  );
}