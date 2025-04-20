import React, { useState } from 'react';
import { Edit, Award, CreditCard, ChevronRight } from 'lucide-react';

import { Download } from '@mui/icons-material';
import {
  Box,
  Tab,
  Tabs,
  Card,
  Chip,
  Grid,
  Stack,
  Avatar,
  Button,
  Divider,
  useTheme,
  Container,
  TextField,
  Typography,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

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

export function ProfileView() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jaydon');
  const [lastName, setLastName] = useState('Frankie');
  const subscriptionTabRef = React.useRef<HTMLDivElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Calculate days remaining in subscription
  const calculateDaysRemaining = () => {
    if (USER.subscription.plan === 'Free') return 'Unlimited';
    
    const endDate = new Date(USER.subscription.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate percentage of usage
  const calculateUsagePercentage = (used: number, limit: number) => (used / limit) * 100;

  const daysRemaining = calculateDaysRemaining();
  const isSubscriptionEnding = typeof daysRemaining === 'number' && daysRemaining <= 30;

  const handleManageSubscription = () => {
    setActiveTab(1);
    // Use setTimeout to ensure the tab change has happened before scrolling
    setTimeout(() => {
      if (subscriptionTabRef.current) {
        subscriptionTabRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
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
            My Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Manage your account settings and subscription
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
                        <Typography variant="body2" gutterBottom>First Name</Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>Last Name</Typography>
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
                        Save
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
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
                      Edit Profile
                    </Button>
                  </>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Current Subscription
                  </Typography>
                  <Button 
                    variant="text" 
                    color="primary"
                    endIcon={<ChevronRight />}
                    onClick={() => setShowSubscriptionDetails(!showSubscriptionDetails)}
                  >
                    {showSubscriptionDetails ? 'Hide Details' : 'View Details'}
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
                    Manage Subscription
                  </Button>
                  {USER.subscription.plan !== 'Professional' && (
                    <Button 
                      variant="outlined" 
                      color="primary"
                      startIcon={<Award />}
                      onClick={handleManageSubscription}
                    >
                      Upgrade Plan
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
              {USER.subscription.plan} Plan Features
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
            <Tab label="Account Settings" />
            <Tab label="Subscription" />
            <Tab label="Security" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && <ProfileForm />}
          
          {activeTab === 1 && (
            <Box ref={subscriptionTabRef}>
              <Typography variant="h5" gutterBottom>
                Subscription Plans
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Choose the plan that works best for your needs
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {SUBSCRIPTION_PLANS.map((plan) => (
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
                          label="Current Plan" 
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
                        {plan.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                        <Typography variant="h4" component="span">
                          ${plan.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          /month
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
                            <Typography variant="body2">{feature}</Typography>
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
                        {plan.current ? 'Current Plan' : 'Upgrade'}
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Billing History
                </Typography>
                <Card variant="outlined">
                  <Stack spacing={2} sx={{ p: 3 }}>
                    {USER.subscription.plan !== 'Free' ? (
                      <>
                        <Box display="flex" justifyContent="space-between">
                          <Box>
                            <Typography variant="subtitle2">
                              {USER.subscription.plan} Plan - Monthly
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(USER.subscription.startDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Typography variant="subtitle1">
                            ${SUBSCRIPTION_PLANS.find(p => p.name === USER.subscription.plan)?.price}
                          </Typography>
                        </Box>
                        <Divider />
                        <Box display="flex" justifyContent="flex-end">
                          <Button variant="text" startIcon={<Download />}>
                            Download Invoice
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                        No billing history available for Free plan
                      </Typography>
                    )}
                  </Stack>
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
