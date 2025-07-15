import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';

import { setOnboardingCompleted } from 'src/services/slices/auth/authSlice';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function OnboardingSuccessView() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Mark onboarding as completed
    dispatch(setOnboardingCompleted(true));
    
    // Show success message
    toast.success(t('onboarding.paymentSuccess', 'Payment successful! Welcome to your premium plan.'));
    
    // Redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch, navigate, t]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: 400,
        }}
      >
        {/* Success Icon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'success.main',
            mx: 'auto',
            mb: 3,
          }}
        >
          <Iconify
            icon="mdi:check"
            sx={{ color: 'common.white', fontSize: 40 }}
          />
        </Box>

        {/* Success Message */}
        <Typography variant="h4" gutterBottom>
          {t('onboarding.successTitle', 'Welcome to XBlog!')}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {t('onboarding.successMessage', 'Your payment was successful and your account is now active. You\'ll be redirected to your dashboard shortly.')}
        </Typography>

        {/* Loading Indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            {t('onboarding.redirectingToDashboard', 'Redirecting to dashboard...')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
