
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, ExternalLink } from 'lucide-react';

import {
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  Avatar,
  Button,
  useTheme,
  Container,
  Typography,
  CircularProgress,
} from '@mui/material';

import { varAlpha } from 'src/theme/styles/utils';
import { DashboardContent } from 'src/layouts/dashboard';
import { isFreeplan } from 'src/services/invoicePdfService';
import { useGetCurrentUserQuery } from 'src/services/apis/userApi';
import {
  useGetSubscriptionPlansQuery,
  useGetSubscriptionDetailsQuery
} from 'src/services/apis/subscriptionApi';

import { Iconify } from 'src/components/iconify';
import { ProfileForm } from 'src/components/profile/ProfileForm';

export function ProfileView() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user data from API
  const { data: userData, isLoading: isLoadingUser } = useGetCurrentUserQuery();

  // Fetch subscription details
  const { data: subscriptionData, isLoading: isLoadingSubscription, refetch: refetchSubscription } = useGetSubscriptionDetailsQuery();

  // Fetch plans using RTK Query (will use cache if available)
  const { data: availablePlans = [] } = useGetSubscriptionPlansQuery();

  // Auto-refresh data when returning from Stripe checkout
  useEffect(() => {
    // Check if we're on the profile page and if there are any URL parameters that might indicate a return from payment
    const urlParams = new URLSearchParams(location.search);
    const hasPaymentParams = urlParams.has('session_id') || urlParams.has('payment_intent') || urlParams.has('success');

    // Also check if we just navigated to profile (could be from Stripe redirect)
    const isProfilePage = location.pathname === '/profile';

    if (isProfilePage && hasPaymentParams) {
      // Refresh subscription data after successful payment
      console.log('Detected return from payment, refreshing subscription data...');
      refetchSubscription();

      // Clean up URL parameters after refresh
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [location, refetchSubscription]);

  let currentPlan = null;

  if (subscriptionData?.plan_id && availablePlans.length > 0) {
    // First try: Match by plan_id
    currentPlan = availablePlans.find(plan => plan.id === subscriptionData.plan_id || plan.id === String(subscriptionData.plan_id));

    // Second try: If no match by ID, try matching by name
    if (!currentPlan && subscriptionData.subscription_name) {
      currentPlan = availablePlans.find(plan =>
        plan.name.toLowerCase() === subscriptionData.subscription_name.toLowerCase()
      );
    
    }
  }

  const isCurrentPlanFree : boolean = currentPlan ? isFreeplan(currentPlan) : false;

  // Handle upgrade license navigation
  const handleUpgradeLicense = () => {
    navigate('/upgrade-license');
  };

  // Handle manage subscription - open in new tab
  const handleManageSubscription = () => {
    if (subscriptionData?.subscription_url) {
      window.open(subscriptionData.subscription_url, '_blank');
    }
  };

  // Loading state
  if (isLoadingUser || isLoadingSubscription) {
    return (
      <DashboardContent>
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Container>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Container maxWidth="xl">
        {/* Modern Header with Gradient Background */}
        <Box
          sx={{
            position: 'relative',
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden',
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.secondary.light} 100%)`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: theme.palette.mode === 'dark'
                ? 'rgba(0,0,0,0.2)'
                : 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
            }
          }}
        >
          <Box sx={{ position: 'relative', p: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Stack spacing={1}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  >
                    {t('profile.title', 'My Profile')}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 400
                    }}
                  >
                    {t('profile.subtitle', 'Manage your account settings and preferences')}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                  <Avatar
                    src={userData?.avatar}
                    alt={userData?.name || 'User'}
                    sx={{
                      width: 100,
                      height: 100,
                      border: `4px solid rgba(255,255,255,0.2)`,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Profile Form Section */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                borderRadius: 3,
                background: theme.palette.mode === 'dark'
                  ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${varAlpha('79 70 229', 0.05)} 100%)`
                  : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${varAlpha('79 70 229', 0.02)} 100%)`,
                border: `1px solid ${varAlpha('79 70 229', 0.1)}`,
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(0,0,0,0.3)'
                  : '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <ProfileForm userData={userData} />
            </Card>
          </Grid>

          {/* Stats and Subscription Card */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Account Stats Card */}
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${varAlpha('16 185 129', 0.1)} 0%, ${varAlpha('0 184 217', 0.1)} 100%)`
                    : `linear-gradient(135deg, ${varAlpha('16 185 129', 0.05)} 0%, ${varAlpha('0 184 217', 0.05)} 100%)`,
                  border: `1px solid ${varAlpha('16 185 129', 0.2)}`,
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0,0,0,0.3)'
                    : '0 4px 20px rgba(0,0,0,0.08)',
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Iconify icon="solar:award-bold" width={20} />
                  {t('profile.stats.title', 'Account Stats')}
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('profile.stats.articlesCreated', 'Articles Created')}
                    </Typography>
                    <Chip
                      label={subscriptionData?.articles_created || 0}
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('profile.stats.currentPlan', 'Current Plan')}
                    </Typography>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.8,
                        px: 2,
                        py: 1,
                        borderRadius: 3,
                        bgcolor: (currentPlan?.name || subscriptionData?.subscription_name || 'Free').toLowerCase().includes('free')
                          ? 'rgba(156, 163, 175, 0.1)'
                          : 'rgba(79, 70, 229, 0.1)',
                        border: `1px solid ${(currentPlan?.name || subscriptionData?.subscription_name || 'Free').toLowerCase().includes('free')
                          ? 'rgba(156, 163, 175, 0.2)'
                          : 'rgba(79, 70, 229, 0.2)'}`,
                        boxShadow: (currentPlan?.name || subscriptionData?.subscription_name || 'Free').toLowerCase().includes('free')
                          ? 'none'
                          : '0 2px 8px rgba(79, 70, 229, 0.15)',
                      }}
                    >
                      <Iconify
                        icon={(currentPlan?.name || subscriptionData?.subscription_name || 'Free').toLowerCase().includes('free')
                          ? 'mdi:gift-outline'
                          : (currentPlan?.name || subscriptionData?.subscription_name || 'Free').toLowerCase().includes('enterprise')
                            ? 'mdi:crown'
                            : (currentPlan?.name || subscriptionData?.subscription_name || 'Free').toLowerCase().includes('pro')
                              ? 'mdi:diamond'
                              : 'mdi:rocket-launch'
                        }
                        width={18}
                        height={18}
                        sx={{
                          color: (currentPlan?.name || subscriptionData?.subscription_name || 'Free').toLowerCase().includes('free')
                            ? 'text.secondary'
                            : 'primary.main'
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: (currentPlan?.name || subscriptionData?.subscription_name || 'Free').toLowerCase().includes('free')
                            ? 'text.secondary'
                            : 'primary.main',
                          fontWeight: 700,
                          fontSize: '0.875rem'
                        }}
                      >
                        {currentPlan?.name || subscriptionData?.subscription_name || 'Free'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('profile.stats.memberSince', 'Member Since')}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {userData?.created_at
                        ? new Date(userData.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                          })
                        : t('profile.stats.notAvailable', 'N/A')
                      }
                    </Typography>
                  </Box>
                </Stack>
              </Card>

              {/* Subscription Management Card */}
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${varAlpha('79 70 229', 0.1)} 0%, ${varAlpha('200 220 253', 0.1)} 100%)`
                    : `linear-gradient(135deg, ${varAlpha('79 70 229', 0.05)} 0%, ${varAlpha('200 220 253', 0.05)} 100%)`,
                  border: `1px solid ${varAlpha('79 70 229', 0.2)}`,
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0,0,0,0.3)'
                    : '0 4px 20px rgba(0,0,0,0.08)',
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <CreditCard size={20} />
                  {t('profile.subscription.title', 'Subscription')}
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleUpgradeLicense}
                    startIcon={<Iconify icon="solar:rocket-bold" />}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      background: `linear-gradient(135deg, ${varAlpha('79 70 229', 0.7)} 0%, ${varAlpha('41 37 131', 0.7)} 100%)`,
                      color: theme.palette.primary.contrastText,
                      opacity: 0.85,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${varAlpha('41 37 131', 0.8)} 0%, ${varAlpha('79 70 229', 0.8)} 100%)`,
                        opacity: 0.95,
                      }
                    }}
                  >
                    {t('profile.subscription.upgrade', 'Upgrade License')}
                  </Button>
                  {/* Only show manage subscription if user has a paid plan */}
                  {!isCurrentPlanFree && subscriptionData?.subscription_url && (
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleManageSubscription}
                      startIcon={<ExternalLink size={16} />}
                      sx={{ borderRadius: 2, py: 1.5 }}
                    >
                      {t('profile.subscription.manage', 'Manage Subscription')}
                    </Button>
                  )}
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>

      </Container>
    </DashboardContent>
  );
}
