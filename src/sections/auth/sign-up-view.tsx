import { useDispatch } from 'react-redux';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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
import { LanguageSwitcher } from 'src/components/language-switcher/LanguageSwitcher';

export function SignUpView() {
  const { t } = useTranslation();
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

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        padding: 2,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      {/* Add language switcher in the top-right corner */}
      <Box
        sx={{
          position: 'absolute', 
          top: 16, 
          right: 16
        }}
      >
        <LanguageSwitcher />
      </Box>
      
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

      {/* Updated form with simplified fields */}
      <Box display="flex" flexDirection="column" gap={3} sx={{ width: '100%' }}>
        <TextField
          fullWidth
          name="fullName"
          label={t('auth.signup.fullName')}
          placeholder={t('auth.signup.fullNamePlaceholder')}
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
          name="email"
          label={t('auth.signup.email')}
          placeholder={t('auth.signup.emailPlaceholder')}
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
          label={t('auth.signup.password')}
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
          label={t('auth.signup.confirmPassword')}
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
          {t('auth.signup.createAccount')}
        </LoadingButton>

        <Typography variant="body2" color="text.secondary" align="center">
          {t('auth.signup.termsPrefix')}{' '}
          <Link href="#" variant="subtitle2">
            {t('auth.signup.termsOfService')}
          </Link>{' '}
          {t('auth.signup.and')}{' '}
          <Link href="#" variant="subtitle2">
            {t('auth.signup.privacyPolicy')}
          </Link>
        </Typography>
      </Box>

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          {t('auth.signup.orContinueWith')}
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
          {t('auth.signup.signupWithGoogle')}
        </LoadingButton>
      </Box>
    </Box>
    </Box>
  );
}