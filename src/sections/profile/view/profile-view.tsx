import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Edit, Award, CreditCard, ChevronRight } from 'lucide-react';

import { Download } from '@mui/icons-material';
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
import { useGetUserInvoicesQuery, useLazyGetUserInvoicesQuery } from 'src/services/apis/subscriptionApi';

import { ProfileForm } from 'src/components/profile/ProfileForm';
import { SecurityForm } from 'src/components/profile/SecurityForm';

// Mock user data - in a real app, this would come from your API
const USER = {
  id: '1',
  name: 'Jaydon Frankie',
  email: 'demo@minimals.cc',
  photoURL: '/assets/images/avatar/avatar-25.webp',
  subscription: {
    plan: 'Professional',
    status: 'active',
    startDate: '2023-01-15',
    endDate: '2024-01-15',
    features: [
      'All Basic Features',
      'Unlimited Article Generation',
      'Advanced Analytics',
      'Priority Support',
      'Custom Publishing Schedule'
    ],
    usageStats: {
      articlesGenerated: 45,
      articlesLimit: 100,
      storageUsed: 2.5,
      storageLimit: 10
    }
  }
};

// For demo purposes - different subscription plans
const SUBSCRIPTION_PLANS = [
  {
    name: 'Free',
    price: '0',
    features: [
      'Basic Article Generation',
      'Limited Analytics',
      'Standard Support',
      '5 Articles per month',
      '1GB Storage'
    ],
    current: USER.subscription.plan === 'Free'
  },
  {
    name: 'Basic',
    price: '9.99',
    features: [
      'Advanced Article Generation',
      'Basic Analytics',
      'Standard Support',
      '20 Articles per month',
      '5GB Storage'
    ],
    current: USER.subscription.plan === 'Basic'
  },
  {
    name: 'Professional',
    price: '19.99',
    features: [
      'All Basic Features',
      'Unlimited Article Generation',
      'Advanced Analytics',
      'Priority Support',
      'Custom Publishing Schedule'
    ],
    current: USER.subscription.plan === 'Professional',
    highlight: true
  }
];


const MOCK_INVOICES = {
  invoices: [
    {
      id: '1',
      invoiceNumber: 'INV-2023-001',
      amount: 19.99,
      currency: 'USD',
      status: 'paid',
      createdAt: '2023-01-15T00:00:00.000Z',
      plan: 'Professional',
      downloadUrl: '#'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2023-002',
      amount: 19.99,
      currency: 'USD',
      status: 'paid',
      createdAt: '2023-02-15T00:00:00.000Z',
      plan: 'Professional',
      downloadUrl: '#'
    }
  ],
  count: 2
};

export function ProfileView() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jaydon');
  const [lastName, setLastName] = useState('Frankie');
  const subscriptionTabRef = React.useRef<HTMLDivElement>(null);
  const [shouldRefreshInvoices, setShouldRefreshInvoices] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const navigate = useNavigate();
  
  // Add this to fetch invoices
  const { data: invoicesData, isLoading: isLoadingInvoices } = useGetUserInvoicesQuery();
  const [fetchInvoices] = useLazyGetUserInvoicesQuery();

  // Add useEffect to handle page visibility changes
  React.useEffect(() => {
    fetchInvoices()
      .unwrap()
      .then(() => {
        toast.success(t('profile.billing.refreshSuccess', 'Invoices refreshed successfully'));
      })
      .catch((error) => {
        setInvoices(MOCK_INVOICES.invoices)
        toast.error(t('profile.errors.refreshInvoices', 'Failed to refresh invoices'));
      });
        // Reset the flag
  }, [shouldRefreshInvoices, fetchInvoices, t]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleManageSubscription = () => {
    // Set flag to refresh invoices when user returns
    setShouldRefreshInvoices(true);
    
    // Navigate using React Router (keeps it in the same tab)
    navigate('/subscription/manage');
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here you would typically save the updated profile to your backend
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
                  src={USER.photoURL}
                  alt={USER.name}
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
                      {USER.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {USER.email}
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

                {/* Rest of subscription info */}
                
                <Box mt={3} display="flex" gap={2}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<CreditCard />}
                    onClick={handleManageSubscription}
                  >
                    {t('profile.subscription.manage')}
                  </Button>
                  {USER.subscription.plan !== 'Professional' && (
                    <Button 
                      variant="outlined" 
                      color="primary"
                      startIcon={<Award />}
                      onClick={handleManageSubscription}
                    >
                      {t('profile.subscription.upgrade')}
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Subscription Details (Expandable) */}
        {showSubscriptionDetails && (
          <Card sx={{ mb: 5, p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('profile.subscription.planFeatures', { plan: USER.subscription.plan })}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {USER.subscription.features.map((feature, index) => (
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
                    <Typography variant="body2">{t(`profile.subscription.features.${index}`, { defaultValue: feature })}</Typography>
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
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {SUBSCRIPTION_PLANS.map((plan, planIndex) => (
                  <Grid item xs={12} md={4} key={plan.name}>
                    <Card 
                      variant="outlined"
                      sx={{
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderColor: plan.current ? 'primary.main' : 'divider',
                        bgcolor: plan.highlight ? 'primary.lighter' : 'background.paper',
                        position: 'relative',
                        ...(plan.current && {
                          boxShadow: theme.customShadows.z8,
                        }),
                      }}
                    >
                      {plan.current && (
                        <Chip 
                          label={t('profile.subscription.currentPlan')} 
                          color="primary" 
                          size="small"
                          sx={{ 
                            position: 'absolute',
                            top: 12,
                            right: 12,
                          }}
                        />
                      )}
                      
                      <Typography variant="h6" gutterBottom>
                        {t(`profile.subscription.planNames.${plan.name.toLowerCase()}`, { defaultValue: plan.name })}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                        <Typography variant="h4" component="span">
                          ${plan.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {t('profile.subscription.perMonth')}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ flexGrow: 1 }}>
                        {plan.features.map((feature, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                mr: 1.5,
                              }}
                            />
                            <Typography variant="body2">
                              {t(`profile.subscription.planFeatures.${planIndex}.${index}`, { defaultValue: feature })}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      
                      <Button 
                        variant={plan.current ? "outlined" : "contained"}
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                        disabled={plan.current}
                      >
                        {plan.current ? t('profile.subscription.currentPlan') : t('profile.subscription.upgrade')}
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
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
                  ) : invoices && invoices.length > 0 ? (
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
                        {invoices.map((invoice) => (
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
