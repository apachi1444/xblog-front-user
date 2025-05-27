import type { RootState } from 'src/services/store';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Edit, User, Bell, Award, Shield, CreditCard, ChevronRight } from 'lucide-react';

import {
  Box,
  Tab,
  Tabs,
  Card,
  Chip,
  Grid,
  Table,
  Stack,
  alpha,
  Avatar,
  Button,
  useTheme,
  TableRow,
  Container,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetUserInvoicesQuery,
} from 'src/services/apis/subscriptionApi';

import { Iconify } from 'src/components/iconify';
import { ResponsivePricingPlans } from 'src/components/pricing';
import { ProfileForm } from 'src/components/profile/ProfileForm';
import { SecurityForm } from 'src/components/profile/SecurityForm';

export function ProfileView() {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Get the authenticated user from Redux
  const authUser = useSelector((state: RootState) => state.auth.user);

  // Parse the user's name into first and last name
  const getUserNames = () => {
    if (!authUser?.name) return { firstName: 'User', lastName: 'Name' };

    const nameParts = authUser.name.split(' ');
    return {
      firstName: nameParts[0] || 'User',
      lastName: nameParts.slice(1).join(' ') || 'Name'
    };
  };

  const [activeTab, setActiveTab] = useState(0);
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(getUserNames().firstName);
  const [lastName, setLastName] = useState(getUserNames().lastName);
  const subscriptionTabRef = React.useRef<HTMLDivElement>(null);

  const { data: invoicesData, isLoading: isLoadingInvoices } = useGetUserInvoicesQuery();


  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleManageSubscription = () => {
    navigate('/subscription/manage');
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

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
                    src={authUser?.avatar || '/assets/images/avatar/avatar-default.jpg'}
                    alt={authUser?.name || 'User'}
                    sx={{
                      width: 100,
                      height: 100,
                      border: `4px solid rgba(255,255,255,0.2)`,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Profile Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                p: 3,
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
              {isEditing ? (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <User size={20} />
                    Edit Profile Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      onClick={handleSaveProfile}
                      startIcon={<Iconify icon="eva:checkmark-fill" />}
                      sx={{ borderRadius: 2 }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                      startIcon={<Iconify icon="eva:close-fill" />}
                      sx={{ borderRadius: 2 }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <User size={20} />
                      Profile Information
                    </Typography>
                    <IconButton
                      onClick={() => setIsEditing(true)}
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.2),
                        }
                      }}
                    >
                      <Edit size={18} />
                    </IconButton>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Full Name
                        </Typography>
                        <Typography variant="h6">
                          {authUser?.name || `${firstName} ${lastName}`}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Email Address
                        </Typography>
                        <Typography variant="h6">
                          {authUser?.email || 'user@example.com'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            {/* Quick Stats Card */}
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
                <Award size={20} />
                Account Stats
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Articles Created
                  </Typography>
                  <Chip
                    label="12"
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Current Plan
                  </Typography>
                  <Chip
                    label="Pro"
                    size="small"
                    color="success"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    Jan 2024
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Modern Tabs */}
        <Card
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.3)'
              : '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Box
            sx={{
              bgcolor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.8)
                : alpha(theme.palette.grey[50], 0.8),
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                px: 2,
                '& .MuiTab-root': {
                  minHeight: 64,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  }
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            >
              <Tab
                icon={<User size={18} />}
                iconPosition="start"
                label={t('profile.tabs.account', 'Account Details')}
              />
              <Tab
                icon={<CreditCard size={18} />}
                iconPosition="start"
                label={t('profile.tabs.subscription', 'Subscription')}
              />
              <Tab
                icon={<Shield size={18} />}
                iconPosition="start"
                label={t('profile.tabs.security', 'Security')}
              />
              <Tab
                icon={<Bell size={18} />}
                iconPosition="start"
                label={t('profile.tabs.notifications', 'Notifications')}
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: 4 }}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                  {t('profile.tabs.account', 'Account Details')}
                </Typography>
                <ProfileForm />
              </Box>
            )}

            {activeTab === 1 && (
              <Box ref={subscriptionTabRef}>
                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                  {t('profile.subscription.plans', 'Subscription Plans')}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                  {t('profile.subscription.choosePlan', 'Choose the plan that best fits your needs')}
                </Typography>

                <ResponsivePricingPlans
                  onSelectPlan={(planId) => navigate(`/subscription/upgrade?plan=${planId}`)}
                  gridColumns={{ xs: 1, sm: 1, md: 3 }}
                  title=""
                  subtitle=""
                />

                {/* Billing History */}
                <Box sx={{ mt: 6 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    {t('profile.billing.history', 'Billing History')}
                  </Typography>
                  {invoicesData?.invoices?.length ? (
                    <Card sx={{ borderRadius: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>{t('profile.billing.date', 'Date')}</TableCell>
                            <TableCell>{t('profile.billing.amount', 'Amount')}</TableCell>
                            <TableCell>{t('profile.billing.status', 'Status')}</TableCell>
                            <TableCell align="right">{t('profile.billing.actions', 'Actions')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {invoicesData?.invoices?.map((invoice :any) => (
                            <TableRow key={invoice.id}>
                              <TableCell>{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>${invoice.amount}</TableCell>
                              <TableCell>
                                <Chip
                                  label={invoice.status}
                                  color={invoice.status === 'paid' ? 'success' : 'warning'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Button
                                  size="small"
                                  endIcon={<ChevronRight size={16} />}
                                  onClick={() => window.open(invoice.invoice_url, '_blank')}
                                >
                                  {t('profile.billing.view', 'View')}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  ) : (
                    <Card sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                      <Typography variant="body1" color="text.secondary">
                        {t('profile.billing.noHistory', 'No billing history available')}
                      </Typography>
                    </Card>
                  )}
                </Box>
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                  {t('profile.tabs.security', 'Security Settings')}
                </Typography>
                <SecurityForm />
              </Box>
            )}

            {activeTab === 3 && (
              <Box>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                  {t('profile.tabs.notifications', 'Notification Preferences')}
                </Typography>
                <Card sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    {t('profile.notifications.comingSoon', 'Notification settings will be available soon.')}
                  </Typography>
                </Card>
              </Box>
            )}
          </Box>
        </Card>
      </Container>
    </DashboardContent>
  );
}
