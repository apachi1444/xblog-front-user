import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function MockPaymentView() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const returnUrl = searchParams.get('return_url');
  const planName = searchParams.get('plan_name') || 'Premium Plan';
  const planPrice = searchParams.get('plan_price') || '$29.99';

  // Simulate payment processing
  const handlePayment = async (success: boolean) => {
    setIsProcessing(true);
    setProgress(0);

    // Simulate payment processing with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Wait for progress to complete
    setTimeout(() => {
      setIsProcessing(false);
      
      if (success) {
        toast.success(t('mockPayment.success', 'Mock payment successful!'));
        
        // Redirect to return URL or success page
        if (returnUrl) {
          window.location.href = decodeURIComponent(returnUrl);
        } else {
          navigate('/onboarding/success');
        }
      } else {
        toast.error(t('mockPayment.failed', 'Mock payment failed. Please try again.'));
        setProgress(0);
      }
    }, 2500);
  };

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
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          boxShadow: theme.customShadows?.z24,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                mx: 'auto',
                mb: 2,
              }}
            >
              <Iconify
                icon="mdi:credit-card"
                sx={{ color: 'primary.main', fontSize: 30 }}
              />
            </Box>
            
            <Typography variant="h5" gutterBottom>
              {t('mockPayment.title', 'Mock Payment Gateway')}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {t('mockPayment.subtitle', 'This is a mock payment for testing purposes')}
            </Typography>
          </Box>

          {/* Plan Details */}
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              mb: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {planName}
            </Typography>
            <Typography variant="h4" color="primary.main">
              {planPrice}
              <Typography component="span" variant="body2" color="text.secondary">
                /month
              </Typography>
            </Typography>
          </Box>

          {/* Processing State */}
          {isProcessing && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('mockPayment.processing', 'Processing payment...')}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {progress}% {t('mockPayment.complete', 'complete')}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Stack spacing={2}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => handlePayment(true)}
              disabled={isProcessing}
              startIcon={<Iconify icon="mdi:check-circle" />}
              sx={{ py: 1.5 }}
            >
              {t('mockPayment.simulateSuccess', 'Simulate Successful Payment')}
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => handlePayment(false)}
              disabled={isProcessing}
              startIcon={<Iconify icon="mdi:close-circle" />}
              sx={{ py: 1.5 }}
            >
              {t('mockPayment.simulateFailure', 'Simulate Payment Failure')}
            </Button>
            
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/onboarding')}
              disabled={isProcessing}
              sx={{ py: 1 }}
            >
              {t('mockPayment.cancel', 'Cancel & Return to Onboarding')}
            </Button>
          </Stack>

          {/* Mock Notice */}
          <Box
            sx={{
              mt: 4,
              p: 2,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Iconify
                icon="mdi:information"
                sx={{ color: 'warning.main', mr: 1, fontSize: 20 }}
              />
              <Typography variant="subtitle2" color="warning.main">
                {t('mockPayment.notice', 'Development Mode')}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {t('mockPayment.noticeText', 'This is a mock payment gateway for testing. No real payment will be processed.')}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
