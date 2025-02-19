import type { Provider} from 'src/services/auth/auth-service';

import { useDispatch } from 'react-redux';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
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

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginWithProvider } = useAuthService();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
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

  const handleProviderSignIn = useCallback(async (provider: Provider) => {
    try {
      setLoading(true);
      const result = await loginWithProvider(provider);
      
      if (result.success) {
        navigate('/');
      } else {
        showToast(result.error ?? "Error in login with google !", 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [loginWithProvider, navigate, showToast]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
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
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={handleNavigateToSignUp}>
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
        <IconButton 
          color="inherit" 
          onClick={() => handleProviderSignIn('google')}
          disabled={loading}
        >
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton 
          color="inherit"
          onClick={() => handleProviderSignIn('github')}
          disabled={loading}
        >
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton 
          color="inherit"
          onClick={() => handleProviderSignIn('facebook')}
          disabled={loading}
        >
          <Iconify icon="ri:facebook-fill" />
        </IconButton>
      </Box>
    </>
  );
}
