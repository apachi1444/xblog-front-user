
import { useDispatch } from 'react-redux';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useAuthRedirect } from 'src/hooks/useAuthRedirect';

import { useToast } from 'src/contexts/ToastContext';
import { login } from 'src/services/slices/userSlice';
import { useAuthService } from 'src/services/auth/auth-service';

import { Logo } from 'src/components/logo/logo';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {
  const { loginWithProvider, logoutFromProvider } = useAuthService();
  const router = useRouter();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useAuthRedirect(false);

  const handleSignIn = useCallback(() => {
    dispatch(
      login({
        user: {
          name: "result.user.name",
          email: "result.user.email",
        },
        userToken: "result.token",
      })
    );
    router.push('/');
  }, [dispatch, router]);

  const handleNavigateToSignUp = useCallback(() => {
    router.push('/sign-up');
  }, [router]);

  const handleLogin = () => {
    loginWithProvider('google');
    
    // Note: Since the login process is handled through callbacks in the Google provider,
    // you would typically update the login state elsewhere, such as in a global state 
    // manager or through a useEffect that checks authentication status
  };

  const handleLogout = () => {
    const response = logoutFromProvider('google');
    if (response.success) {
      console.log(response.success);
      } else {
      console.error('Logout failed:', response.error);
    }
  };


  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <TextField
        fullWidth
        name="email"
        label="Email address"
        defaultValue="hello@gmail.com"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Password"
        defaultValue="@demo1234"
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        onClick={handleSignIn}
        sx={{
          borderRadius: '8px',
          py: 1.5,
          opacity: 'revert-layer'
        }}
      >
        Sign in
      </LoadingButton>
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
        <Logo />
        <Typography variant="h5" sx={{pt: 2}}>Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Dont have an account?
          <Link 
            variant="subtitle2" 
            sx={{ 
              ml: 0.5,
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
                opacity: 'revert'
              } 
            }} 
            onClick={handleNavigateToSignUp}
          >
            Get started
          </Link>
        </Typography>
      </Box>

      {renderForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <LoadingButton 
          fullWidth
          size="large"
          variant="outlined"
          color="primary"
          onClick={handleLogin}
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
          Sign in with Google
        </LoadingButton>
      </Box>
    </Box>
  );
}
