
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ExternalLink } from 'lucide-react';

import {
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  alpha,
  Avatar,
  Button,
  useTheme,
  Container,
  Typography,
  CircularProgress,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetCurrentUserQuery } from 'src/services/apis/userApi';
import {
  useGetSubscriptionDetailsQuery,
} from 'src/services/apis/subscriptionApi';

import { Iconify } from 'src/components/iconify';
import { ProfileForm } from 'src/components/profile/ProfileForm';

export function ProfileView() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Fetch user data from API
  const { data: userData, isLoading: isLoadingUser } = useGetCurrentUserQuery();

  // Fetch subscription details
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useGetSubscriptionDetailsQuery();

  console.log(subscriptionData);
  

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
                  ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                  : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
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
                    ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`
                    : `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
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
                    <Chip
                      label={subscriptionData?.subscription_name || 'Free'}
                      size="small"
                      color="success"
                      sx={{ fontWeight: 600 }}
                    />
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
                    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
                    : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
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
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      }
                    }}
                  >
                    {t('profile.subscription.upgrade', 'Upgrade License')}
                  </Button>
                  {subscriptionData?.subscription_url && (
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
