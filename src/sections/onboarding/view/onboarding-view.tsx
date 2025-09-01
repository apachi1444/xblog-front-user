
import type { RootState } from 'src/services/store';

import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import CardActionArea from '@mui/material/CardActionArea';
import LinearProgress from '@mui/material/LinearProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { useUpdateUserMutation } from 'src/services/apis/userApi';
import { logout, setCredentials } from 'src/services/slices/auth/authSlice';
import {
  useGetSubscriptionPlansQuery,
  useCreateCheckoutSessionMutation
} from 'src/services/apis/subscriptionApi';

import { Iconify } from 'src/components/iconify';

// Define interest options with i18n keys
const getInterests = (t: any) => [
  { id: 'blogging', label: t('onboarding.interests.blogging', 'Blogging'), icon: 'mdi:pencil' },
  { id: 'marketing', label: t('onboarding.interests.marketing', 'Content Marketing'), icon: 'mdi:bullhorn' },
  { id: 'seo', label: t('onboarding.interests.seo', 'SEO Optimization'), icon: 'mdi:magnify' },
  { id: 'social', label: t('onboarding.interests.social', 'Social Media'), icon: 'mdi:instagram' },
  { id: 'analytics', label: t('onboarding.interests.analytics', 'Analytics'), icon: 'mdi:chart-line' },
  { id: 'ecommerce', label: t('onboarding.interests.ecommerce', 'E-commerce'), icon: 'mdi:cart' },
];

// Define referral sources with i18n keys
const getReferralSources = (t: any) => [
  { id: 'search', label: t('onboarding.referralSources.search', 'Search Engine'), icon: 'mdi:google' },
  { id: 'social', label: t('onboarding.referralSources.social', 'Social Media'), icon: 'mdi:facebook' },
  { id: 'friend', label: t('onboarding.referralSources.friend', 'Friend/Colleague'), icon: 'mdi:account-group' },
  { id: 'ad', label: t('onboarding.referralSources.ad', 'Advertisement'), icon: 'mdi:advertisement' },
  { id: 'blog', label: t('onboarding.referralSources.blog', 'Blog/Article'), icon: 'mdi:file-document' },
  { id: 'other', label: t('onboarding.referralSources.other', 'Other'), icon: 'mdi:dots-horizontal' },
];

export function OnBoardingView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Initialize the mutations and queries
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const { data: plans } = useGetSubscriptionPlansQuery();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  // Get translated arrays
  const INTERESTS = getInterests(t);
  const REFERRAL_SOURCES = getReferralSources(t);

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

  // State for billing period
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // State for payment processing
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Handle billing period change and clear selected plan if it doesn't match
  const handleBillingPeriodChange = (newPeriod: 'monthly' | 'yearly') => {
    setBillingPeriod(newPeriod);

    // Clear selected plan if it doesn't match the new billing period
    if (selectedPlan && selectedPlan !== 'free') {
      const selectedPlanData = plans?.find(p => p.id === selectedPlan);
      if (selectedPlanData) {
        const planName = selectedPlanData.name.toLowerCase();
        const isYearlyPlan = planName.includes('yearly') || planName.includes('annual');
        const isMonthlyPlan = planName.includes('monthly') || (!planName.includes('yearly') && !planName.includes('annual'));

        // Clear selection if plan doesn't match new period
        if ((newPeriod === 'yearly' && !isYearlyPlan) || (newPeriod === 'monthly' && !isMonthlyPlan)) {
          setSelectedPlan(null);
        }
      }
    }
  };

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

  // Handle plan selection (just select, don't redirect)
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    // No immediate redirect - wait for continue button click
  };

  // Handle paid plan selection and immediate redirect using Stripe
  const handlePaidPlanSelection = async (planId: string) => {
    try {
      setIsProcessingPayment(true);

      // Show processing message
      toast.loading('Processing your payment...', { id: 'payment-processing' });

      // Save user preferences first
      const updatedUserData = await updateUser({
        interests: selectedInterests.join(","),
        heard_about_us: referralSource,
        is_completed_onboarding: true,
      }).unwrap();

      // Update Redux state with the updated user data
      const currentAuth = localStorage.getItem('xblog_auth_session_v2');
      if (currentAuth) {
        try {
          const parsedAuth = JSON.parse(currentAuth);
          dispatch(setCredentials({
            user: updatedUserData,
            accessToken: parsedAuth.accessToken
          }));
        } catch (error) {
          console.error('Error updating auth state:', error);
        }
      }

      // Create Stripe checkout session
      toast.loading('Creating checkout session...', { id: 'payment-processing' });

      const response = await createCheckoutSession({ plan_id: planId }).unwrap();

      if (response.url) {
        // Update toast message
        toast.loading('Redirecting to payment...', { id: 'payment-processing' });

        // Small delay to show the message
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirect to the Stripe checkout URL
        window.location.href = response.url;
      } else {
        toast.dismiss('payment-processing');
        toast.error('Failed to create checkout session. Please try again.');
        setIsProcessingPayment(false);
      }
    } catch (error) {
      toast.dismiss('payment-processing');
      toast.error('Failed to create checkout session. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  // Handle next step
  const handleNextStep = () => {
    setStep(2);
  };

  // Handle logout - exit onboarding flow
  const handleLogout = () => {
    dispatch(logout());

    // Navigate to sign-in page
    navigate('/sign-in');
  };

  // Helper function to check if a plan is free
  const isFreeplan = (planId: string | null): boolean => {
    if (!planId) return true;

    // Handle our custom 'free' plan ID
    if (planId === 'free') return true;

    const plan = plans?.find(p => p.id === planId);
    if (!plan) return true;

    const planName = plan.name?.toLowerCase() || '';
    const planPrice = plan.price || '0';

    return (
      planName.includes('free') ||
      planName.includes('trial') ||
      planPrice === '0'
    );
  };

  // Handle complete onboarding
  const handleComplete = async () => {
    if (!selectedPlan) {
      toast.error(t('onboarding.selectPlan', 'Please select a plan to continue.'));
      return;
    }

    // If it's a paid plan, redirect to payment
    if (selectedPlan !== 'free' && !isFreeplan(selectedPlan)) {
      await handlePaidPlanSelection(selectedPlan);
      return;
    }

    // For free plan, complete onboarding normally
    try {
      // Save user preferences to the API
      const updatedUserData = await updateUser({
        is_active: true,
        interests: selectedInterests.join(","),
        heard_about_us: referralSource,
        is_completed_onboarding: true,
      }).unwrap();

      // Update Redux state with the updated user data
      const currentAuth = localStorage.getItem('xblog_auth_session_v2');
      if (currentAuth) {
        try {
          const parsedAuth = JSON.parse(currentAuth);
          dispatch(setCredentials({
            user: updatedUserData,
            accessToken: parsedAuth.accessToken
          }));
        } catch (error) {
          console.error('Error updating auth state:', error);
        }
      }

      toast.success(t('onboarding.freeSelected', 'Welcome! You\'re all set with the free plan.'));

      navigate('/');
    } catch (error) {
      toast.error(t('onboarding.error', 'Failed to save preferences, but we\'ll continue anyway.'));
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
          {t('onboarding.loading', 'Preparing your experience...')}
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
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
          pt: { xs: 4, md: 8 },
          pb: { xs: 8, md: 10 },
          px: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
        }}
      >
        {/* Logout Button - Top Right */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 16, md: 24 },
            right: { xs: 16, md: 24 },
            zIndex: 10
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            startIcon={
              <Box
                component="span"
                sx={{
                  width: 16,
                  height: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                🚪
              </Box>
            }
            sx={{
              borderRadius: 2,
              px: 2,
              py: 1,
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'none',
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
              bgcolor: alpha(theme.palette.error.main, 0.05),
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.1),
                borderColor: alpha(theme.palette.error.main, 0.5),
              }
            }}
          >
            {t('onboarding.logout', 'Sign Out')}
          </Button>
        </Box>

        {/* Header */}
        <Stack spacing={2} sx={{ mb: 5, textAlign: 'center' }}>
          <Typography variant="h3">
            {step === 1
              ? t('onboarding.welcome', 'Welcome to XBlog!')
              : t('onboarding.choosePlan', 'Choose Your Plan')
            }
          </Typography>
        </Stack>

        {/* Progress indicator */}
        <Box sx={{ width: '100%', mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color={step === 1 ? 'primary.main' : 'text.secondary'}>
              {t('onboarding.progress.preferences', 'Your Preferences')}
            </Typography>
            <Typography variant="body2" color={step === 2 ? 'primary.main' : 'text.secondary'}>
              {t('onboarding.progress.plan', 'Subscription Plan')}
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
                {t('onboarding.interests.title', 'What are you interested in?')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('onboarding.interests.subtitle', 'Select all that apply. This helps us personalize your dashboard.')}
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
                {t('onboarding.referralSources.title', 'How did you hear about us?')}
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
                {t('onboarding.continue', 'Continue')}
              </Button>
            </Box>
          </Stack>
        )}

        {step === 2 && (
          <Stack spacing={5}>
            {/* Modern Header with Step Indicator */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              {/* Continue for Free Plan Option */}
              <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handlePlanSelect('free')}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    borderColor: alpha(theme.palette.grey[500], 0.3),
                    color: 'text.secondary',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
                    ...(selectedPlan === 'free' && {
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    })
                  }}
                >
                  {t('onboarding.continueForFree', 'Continue for Free')}
                </Button>
              </Box>

              {/* Billing Toggle */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    bgcolor: alpha(theme.palette.grey[500], 0.1),
                    borderRadius: 3,
                    p: 0.5,
                  }}
                >
                  
                  <Button
                    variant={billingPeriod === 'monthly' ? 'contained' : 'text'}
                    size="small"
                    onClick={() => handleBillingPeriodChange('monthly')}
                    sx={{
                      borderRadius: 2.5,
                      px: 3,
                      py: 1,
                      bgcolor: billingPeriod === 'monthly' ? 'primary.main' : 'transparent',
                      color: billingPeriod === 'monthly' ? 'white' : 'text.secondary',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: billingPeriod === 'monthly' ? 'primary.dark' : alpha(theme.palette.primary.main, 0.08)
                      }
                    }}
                  >
                    {t('onboarding.monthly', 'Monthly')}
                  </Button>
                  <Button
                    variant={billingPeriod === 'yearly' ? 'contained' : 'text'}
                    size="small"
                    onClick={() => handleBillingPeriodChange('yearly')}
                    sx={{
                      borderRadius: 2.5,
                      px: 3,
                      py: 1,
                      bgcolor: billingPeriod === 'yearly' ? 'primary.main' : 'transparent',
                      color: billingPeriod === 'yearly' ? 'white' : 'text.secondary',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: billingPeriod === 'yearly' ? 'primary.dark' : alpha(theme.palette.primary.main, 0.08)
                      }
                    }}
                  >
                    {t('onboarding.yearly', 'Yearly')}
                    <Chip
                      label="-20%"
                      size="small"
                      sx={{
                        ml: 1,
                        bgcolor: 'success.main',
                        color: 'white',
                        fontSize: '0.7rem',
                        height: 20
                      }}
                    />
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Premium Plans Grid */}
            <Box sx={{ position: 'relative' }}>
              <Grid container spacing={4} justifyContent="center">
                {plans
                  ?.filter(plan => {
                    const planName = plan.name.toLowerCase();

                    // Exclude free plans
                    if (planName.includes('free')) {
                      return false;
                    }

                    // Filter based on billing period
                    if (billingPeriod === 'yearly') {
                      const isYearly = planName.includes('yearly') || planName.includes('annual');
                      return isYearly;
                    }
                      const isMonthly = planName.includes('monthly') || (!planName.includes('yearly') && !planName.includes('annual'));
                      return isMonthly;

                  })
                  .sort((a, b) => {
                    // Sort by price from smallest to greatest
                    const priceA = parseFloat(a.price) || 0;
                    const priceB = parseFloat(b.price) || 0;
                    return priceA - priceB;
                  })
                  // Show all plans (removed .slice(0, 2) to include Enterprise plans)
                  .map((plan, index) => {
                    const isSelected = selectedPlan === plan.id;
                    const isPopular = false; // Make second plan popular

                    return (
                      <Grid xs={12} sm={6} md={4} key={plan.id}>
                        <Card
                          onClick={() => handlePlanSelect(plan.id)}
                          sx={{
                            cursor: 'pointer',
                            borderRadius: 4,
                            border: isSelected
                              ? `2px solid ${theme.palette.primary.main}`
                              : isPopular
                                ? `2px solid ${theme.palette.primary.main}`
                                : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            bgcolor: isPopular ? alpha(theme.palette.primary.main, 0.02) : 'background.paper',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'visible',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: theme.customShadows?.z20,
                            },
                            ...(isSelected && {
                              transform: 'translateY(-4px)',
                              boxShadow: theme.customShadows?.primary,
                            })
                          }}
                        >
                          <CardContent sx={{ p: 4, textAlign: 'center' }}>
                            {/* Plan Badge */}
                            <Box sx={{ mb: 3 }}>
                              <Chip
                                label={plan.name}
                                sx={{
                                  bgcolor: isPopular ? 'primary.main' : alpha(theme.palette.grey[500], 0.1),
                                  color: isPopular ? 'white' : 'text.primary',
                                  fontWeight: 600,
                                  fontSize: '0.875rem',
                                  px: 2,
                                  py: 1,
                                  height: 32,
                                }}
                              />
                              {isPopular && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: 'block',
                                    mt: 1,
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  Save 20%
                                </Typography>
                              )}
                            </Box>

                            {/* Price */}
                            <Box sx={{ mb: 4 }}>
                              <Typography
                                variant="h3"
                                sx={{
                                  fontWeight: 700,
                                  color: 'text.primary',
                                  mb: 0.5,
                                }}
                              >
                                {plan.price}
                                <Typography
                                  component="span"
                                  variant="body1"
                                  sx={{ color: 'text.secondary', fontWeight: 400 }}
                                >
                                  /mo
                                </Typography>
                              </Typography>
                            </Box>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block', mb: 3 }}
                            >
                              {t('onboarding.securePayment', 'Secure payment powered by Stripe')}
                            </Typography>

                            {/* Features */}
                            <Box sx={{ textAlign: 'left' }}>
                              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                {t('onboarding.features', 'Features')}
                              </Typography>
                              <Stack spacing={1.5}>
                                {(plan.features || [
                                  'Unlimited articles',
                                  'AI content generation',
                                  'SEO optimization',
                                  'Analytics dashboard',
                                  'Priority support'
                                ]).slice(0, 5).map((feature, idx) => (
                                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CheckCircleOutlineIcon
                                      sx={{
                                        color: 'primary.main',
                                        fontSize: 18,
                                        mr: 1.5
                                      }}
                                    />
                                    <Typography variant="body2" color="text.primary">
                                      {feature}
                                    </Typography>
                                  </Box>
                                ))}
                              </Stack>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
              </Grid>
            </Box>
            {/* Action buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 6 }}>
              <Button
                variant="text"
                size="large"
                onClick={() => setStep(1)}
                sx={{
                  px: 4,
                  color: 'text.secondary',
                  '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) }
                }}
                disabled={isUpdatingUser}
              >
                {t('onboarding.back', 'Back')}
              </Button>

              <LoadingButton
                variant="contained"
                size="large"
                onClick={handleComplete}
                loading={isUpdatingUser || isProcessingPayment}
                disabled={!selectedPlan}
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: '1rem',
                  background: selectedPlan === 'free'
                    ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: selectedPlan === 'free' ? theme.customShadows?.success : theme.customShadows?.primary,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: selectedPlan === 'free' ? theme.customShadows?.success : theme.customShadows?.primary,
                  }
                }}
              >
                {isProcessingPayment
                  ? 'Processing Payment...'
                  : selectedPlan === 'free'
                  ? t('onboarding.continueWithFree', 'Continue with Free Plan')
                  : selectedPlan && !isFreeplan(selectedPlan)
                  ? t('onboarding.continueWithPremium', 'Continue with Premium Plan')
                  : t('onboarding.selectPlan', 'Select a Plan')
                }
              </LoadingButton>
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
}