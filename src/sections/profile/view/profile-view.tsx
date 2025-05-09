import type { RootState } from 'src/services/store';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Edit, Award, CreditCard, ChevronRight } from 'lucide-react';

import {
  Box,
  Tab,
  Tabs,
  Card,
  Chip,
  Grid,
  Table,
  Avatar,
  Button,
  Divider,
  useTheme,
  TableRow,
  Container,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  Typography,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetUserInvoicesQuery,
  useGetSubscriptionPlansQuery
} from 'src/services/apis/subscriptionApi';

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

  // Fetch subscription plans
  const { data: plansData, isLoading: isLoadingPlans } = useGetSubscriptionPlansQuery();



  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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
      <Container maxWidth="lg">
        {/* Profile Overview */}
        <Box mb={5}>
          <Typography variant="h4" gutterBottom>
            {t('profile.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('profile.subtitle')}
          </Typography>
        </Box>

        {/* Profile Summary Card */}
        <Card sx={{ mb: 5, p: 3, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar
                  src={authUser?.avatar || '/assets/images/avatar/avatar-default.jpg'}
                  alt={authUser?.name || 'User'}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    border: `4px solid ${theme.palette.background.paper}`,
                    boxShadow: theme.customShadows.z8
                  }}
                />

                {isEditing ? (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>{t('profile.form.firstName')}</Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>{t('profile.form.lastName')}</Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleSaveProfile}
                      >
                        {t('common.save')}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setIsEditing(false)}
                      >
                        {t('common.cancel')}
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h6" gutterBottom>
                      {authUser?.name || `${firstName} ${lastName}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {authUser?.email || 'user@example.com'}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      sx={{ mt: 1 }}
                      onClick={() => setIsEditing(true)}
                    >
                      {t('profile.editProfile')}
                    </Button>
                  </>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    {t('profile.subscription.current')}
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    endIcon={<ChevronRight />}
                    onClick={() => setShowSubscriptionDetails(!showSubscriptionDetails)}
                  >
                    {showSubscriptionDetails ? t('profile.subscription.hideDetails') : t('profile.subscription.viewDetails')}
                  </Button>
                </Box>

                <Box mt={3} display="flex" gap={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CreditCard />}
                    onClick={handleManageSubscription}
                  >
                    {t('profile.subscription.manage')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Award />}
                    onClick={handleManageSubscription}
                  >
                    {t('profile.subscription.upgrade', 'Upgrade Plan')}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Subscription Details (Expandable) */}
        {showSubscriptionDetails && plansData?.plans && (
          <Card sx={{ mb: 5, p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('profile.subscription.planFeatures', { plan: 'Professional' })}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              {plansData.plans.find(plan => plan.name === 'Professional')?.features.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        mr: 1.5,
                      }}
                    />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        )}

        {/* Tabs for different sections */}
        <Box sx={{ width: '100%', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
              },
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Tab label={t('profile.tabs.account')} />
            <Tab label={t('profile.tabs.subscription')} />
            <Tab label={t('profile.tabs.security')} />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && <ProfileForm />}

          {activeTab === 1 && (
            <Box ref={subscriptionTabRef}>
              <Typography variant="h5" gutterBottom>
                {t('profile.subscription.plans')}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {t('profile.subscription.choosePlan')}
              </Typography>

              <Box sx={{ mt: 2 }}>
                {/* Use the ResponsivePricingPlans component */}
                <ResponsivePricingPlans
                  plans={plansData?.plans.map(plan => ({
                    id: plan.id || plan.name,
                    name: plan.name,
                    price: plan.price,
                    period: '/month',
                    description: '',
                    features: plan.features,
                    popular: plan.highlight || false,
                    current: plan.current || false,
                    highlight: plan.highlight || false,
                    icon: 'mdi:check-circle',
                    buttonText: plan.current ? t('profile.subscription.currentPlan', 'Current Plan') : t('profile.subscription.upgrade', 'Upgrade'),
                    buttonVariant: plan.current ? 'outlined' : 'contained',
                    disabled: plan.current || false,
                  })) || []}
                  onSelectPlan={(planId) => navigate(`/subscription/upgrade?plan=${planId}`)}
                  gridColumns={{ xs: 1, sm: 1, md: 3 }}
                  title=""
                  subtitle=""
                />
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {t('profile.billing.history')}
                </Typography>
                <Card variant="outlined">
                  {isLoadingInvoices ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography variant="body2">
                        {t('profile.billing.loading', 'Loading invoices...')}
                      </Typography>
                    </Box>
                  ) : invoicesData?.invoices && invoicesData.invoices.length > 0 ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('profile.billing.date', 'Date')}</TableCell>
                          <TableCell>{t('profile.billing.invoiceNumber', 'Invoice Number')}</TableCell>
                          <TableCell>{t('profile.billing.plan', 'Plan')}</TableCell>
                          <TableCell align="right">{t('profile.billing.amount', 'Amount')}</TableCell>
                          <TableCell align="right">{t('profile.billing.status', 'Status')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {invoicesData.invoices.map((invoice) => (
                          <TableRow key={invoice.id} hover>
                            <TableCell>
                              {new Date(invoice.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{invoice.invoiceNumber}</TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {invoice.plan}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="subtitle2">
                                ${invoice.amount}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Chip
                                size="small"
                                label={invoice.status}
                                color={invoice.status === 'paid' ? 'success' : 'warning'}
                                sx={{
                                  textTransform: 'capitalize',
                                  fontWeight: 'medium'
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('profile.billing.noHistory')}
                      </Typography>
                    </Box>
                  )}
                </Card>
              </Box>
            </Box>
          )}

          {activeTab === 2 && <SecurityForm />}
        </Box>
      </Container>
    </DashboardContent>
  );
}
