
import type { RootState } from 'src/services/store';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import CardActionArea from '@mui/material/CardActionArea';
import LinearProgress from '@mui/material/LinearProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { setOnboardingCompleted } from 'src/services/slices/auth/authSlice';
import { useUpdateUserMutation } from 'src/services/apis/userApi';

import { Iconify } from 'src/components/iconify';

// Define interest options
const INTERESTS = [
  { id: 'blogging', label: 'Blogging', icon: 'mdi:pencil' },
  { id: 'marketing', label: 'Content Marketing', icon: 'mdi:bullhorn' },
  { id: 'seo', label: 'SEO Optimization', icon: 'mdi:magnify' },
  { id: 'social', label: 'Social Media', icon: 'mdi:instagram' },
  { id: 'analytics', label: 'Analytics', icon: 'mdi:chart-line' },
  { id: 'ecommerce', label: 'E-commerce', icon: 'mdi:cart' },
];

// Define referral sources
const REFERRAL_SOURCES = [
  { id: 'search', label: 'Search Engine', icon: 'mdi:google' },
  { id: 'social', label: 'Social Media', icon: 'mdi:facebook' },
  { id: 'friend', label: 'Friend/Colleague', icon: 'mdi:account-group' },
  { id: 'ad', label: 'Advertisement', icon: 'mdi:advertisement' },
  { id: 'blog', label: 'Blog/Article', icon: 'mdi:file-document' },
  { id: 'other', label: 'Other', icon: 'mdi:dots-horizontal' },
];

// Define subscription plans
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    billing: 'forever',
    features: [
      'Basic article generation',
      'Limited to 5 articles/month',
      'Standard support',
      'Basic analytics',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '19',
    billing: 'monthly',
    features: [
      'Unlimited article generation',
      'Advanced SEO tools',
      'Priority support',
      'Comprehensive analytics',
      'Custom publishing schedule',
    ],
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '49',
    billing: 'monthly',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'API access',
      'White-label options',
      'Dedicated account manager',
    ],
    popular: false,
  },
];

export function OnBoardingView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  
  // Initialize the updateUser mutation
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  
  // Check if onboarding is already completed
  const onboardingCompleted = useSelector((state: RootState) => state.auth.onboardingCompleted);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for current step
  const [step, setStep] = useState(1);
  
  // State for selected interests and referral source
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [referralSource, setReferralSource] = useState<string | null>(null);
  
  // State for selected plan
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  // Check if user has already completed onboarding
  useEffect(() => {
    // Simulate checking if onboarding is completed
    const checkOnboardingStatus = () => {
      setIsLoading(false);
      
      // If onboarding is already completed, redirect to dashboard
      if (onboardingCompleted) {
        navigate('/');
      }
    };
    
    // Add a small delay to simulate API call
    const timer = setTimeout(checkOnboardingStatus, 500);
    
    return () => clearTimeout(timer);
  }, [navigate, onboardingCompleted]);
  
  // Handle interest selection
  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests((prev) => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };
  
  // Handle referral source selection
  const handleReferralSelect = (sourceId: string) => {
    setReferralSource(sourceId);
  };
  
  // Handle plan selection
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  // Handle next step
  const handleNextStep = () => {
    setStep(2);
  };
  
  // Handle complete onboarding
  const handleComplete = async () => {
    // Save user preferences and mark onboarding as completed
    const userPreferences = {
      interests: selectedInterests,
      heard_about_us: referralSource,
      is_completed_onboarding: true,
    };
    
    try {
      // Send the user preferences to the API
      await updateUser({
        interests: selectedInterests,
        heard_about_us: referralSource,
        is_completed_onboarding: true,
      }).unwrap();
      
      console.log('Saved user preferences:', userPreferences);
      
      // Mark onboarding as completed in Redux store
      dispatch(setOnboardingCompleted(true));
      
      // Navigate to dashboard
      navigate('/');
    } catch (error) {
      console.error('Failed to save user preferences:', error);
      // Still mark as completed in the local store and navigate
      // to avoid blocking the user
      dispatch(setOnboardingCompleted(true));
      navigate('/');
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          bgcolor: theme.palette.background.default,
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          Preparing your experience...
        </Typography>
        <LinearProgress sx={{ width: '50%', maxWidth: 300 }} />
      </Box>
    );
  }
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        bgcolor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          maxWidth: 1000,
          width: '100%',
          mx: 'auto',
          pt: { xs: 4, md: 8 },
          pb: { xs: 8, md: 10 },
          px: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
        }}
      >  
        {/* Header */}
        <Stack spacing={2} sx={{ mb: 5, textAlign: 'center' }}>
          <Typography variant="h3">
            {step === 1 ? 'Welcome to XBlog!' : 'Choose Your Plan'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            {step === 1 
              ? 'Let\'s get to know you better so we can personalize your experience.'
              : 'Select a plan that works best for your content creation needs.'}
          </Typography>
        </Stack>
        
        {/* Progress indicator */}
        <Box sx={{ width: '100%', mb: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color={step === 1 ? 'primary.main' : 'text.secondary'}>
              Your Preferences
            </Typography>
            <Typography variant="body2" color={step === 2 ? 'primary.main' : 'text.secondary'}>
              Subscription Plan
            </Typography>
          </Box>
          <Box sx={{ width: '100%', height: 8, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 4 }}>
            <Box 
              sx={{ 
                width: step === 1 ? '50%' : '100%', 
                height: '100%', 
                bgcolor: 'primary.main',
                borderRadius: 4,
                transition: 'width 0.5s ease-in-out',
              }} 
            />
          </Box>
        </Box>
        
        {/* Step 1: Interests and Referral */}
        {step === 1 && (
          <Stack spacing={5}>
            {/* Interests section */}
            <Box>
              <Typography variant="h5" sx={{ mb: 3 }}>
                What are you interested in?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select all that apply. This helps us personalize your dashboard.
              </Typography>
              <Grid container spacing={2}>
                {INTERESTS.map((interest) => (
                  <Grid xs={12} sm={6} md={4} key={interest.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        borderColor: selectedInterests.includes(interest.id) 
                          ? 'primary.main' 
                          : 'divider',
                        borderWidth: 2,
                        borderStyle: 'solid',
                        boxShadow: selectedInterests.includes(interest.id) 
                          ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.3)}` 
                          : 'none',
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <CardActionArea 
                        onClick={() => handleInterestToggle(interest.id)}
                        sx={{ height: '100%', p: 2 }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box 
                            sx={{ 
                              p: 1.5, 
                              borderRadius: 2, 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                            }}
                          >
                            <Iconify icon={interest.icon} width={24} height={24} />
                          </Box>
                          <Typography variant="subtitle1">{interest.label}</Typography>
                          {selectedInterests.includes(interest.id) && (
                            <CheckCircleOutlineIcon 
                              sx={{ 
                                ml: 'auto', 
                                color: 'primary.main',
                              }} 
                            />
                          )}
                        </Stack>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
            
            {/* Referral section */}
            <Box>
              <Typography variant="h5" sx={{ mb: 3 }}>
                How did you hear about us?
              </Typography>
              <Grid container spacing={2}>
                {REFERRAL_SOURCES.map((source) => (
                  <Grid xs={12} sm={6} md={4} key={source.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        borderColor: referralSource === source.id 
                          ? 'primary.main' 
                          : 'divider',
                        borderWidth: 2,
                        borderStyle: 'solid',
                        boxShadow: referralSource === source.id 
                          ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.3)}` 
                          : 'none',
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <CardActionArea 
                        onClick={() => handleReferralSelect(source.id)}
                        sx={{ height: '100%', p: 2 }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box 
                            sx={{ 
                              p: 1.5, 
                              borderRadius: 2, 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                            }}
                          >
                            <Iconify icon={source.icon} width={24} height={24} />
                          </Box>
                          <Typography variant="subtitle1">{source.label}</Typography>
                          {referralSource === source.id && (
                            <CheckCircleOutlineIcon 
                              sx={{ 
                                ml: 'auto', 
                                color: 'primary.main',
                              }} 
                            />
                          )}
                        </Stack>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
            
            {/* Next button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={handleNextStep}
                disabled={selectedInterests.length === 0 || !referralSource}
                sx={{ px: 5, py: 1 }}
              >
                Continue
              </Button>
            </Box>
          </Stack>
        )}
        
        {/* Step 2: Subscription Plans */}
        {step === 2 && (
          <Stack spacing={5}>
            <Grid container spacing={3}>
              {PLANS.map((plan) => (
                <Grid xs={12} md={4} key={plan.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      position: 'relative',
                      borderColor: selectedPlan === plan.id 
                        ? 'primary.main' 
                        : plan.popular ? 'primary.light' : 'divider',
                      borderWidth: 2,
                      borderStyle: 'solid',
                      boxShadow: selectedPlan === plan.id 
                        ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.3)}` 
                        : 'none',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {plan.popular && (
                      <Chip 
                        label="Popular" 
                        color="primary"
                        size="small"
                        sx={{ 
                          position: 'absolute', 
                          top: 12, 
                          right: 12,
                          fontWeight: 'bold',
                        }} 
                      />
                    )}
                    <CardActionArea 
                      onClick={() => handlePlanSelect(plan.id)}
                      sx={{ height: '100%' }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h5" component="div" gutterBottom>
                          {plan.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                          <Typography variant="h3" component="span">
                            ${plan.price}
                          </Typography>
                          <Typography variant="subtitle1" component="span" color="text.secondary" sx={{ ml: 1 }}>
                            /{plan.billing}
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Stack spacing={2}>
                          {plan.features.map((feature, index) => (
                            <Stack direction="row" spacing={1.5} alignItems="center" key={index}>
                              <Iconify 
                                icon="mdi:check-circle" 
                                sx={{ color: 'success.main', width: 20, height: 20 }} 
                              />
                              <Typography variant="body2">{feature}</Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* Action buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => setStep(1)}
                sx={{ px: 3 }}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                size="large"
                onClick={handleComplete}
                sx={{ px: 5 }}
              >
                {selectedPlan ? 'Get Started' : 'Continue with Free Plan'}
              </Button>
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
}