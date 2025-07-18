
import type { RootState } from 'src/services/store';

import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import CardActionArea from '@mui/material/CardActionArea';
import LinearProgress from '@mui/material/LinearProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { useUpdateUserMutation } from 'src/services/apis/userApi';
import { setOnboardingCompleted } from 'src/services/slices/auth/authSlice';
import {
  useGetSubscriptionPlansQuery,
  useCreateSubscriptionMutation
} from 'src/services/apis/subscriptionApi';

import { Iconify } from 'src/components/iconify';
import { ResponsivePricingPlans } from 'src/components/pricing';

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
  const [createSubscription, { isLoading: isCreatingSubscription }] = useCreateSubscriptionMutation();
  const { data: subscriptionPlans = [] } = useGetSubscriptionPlansQuery();

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

  // Handle paid plan selection and immediate redirect
  const handlePaidPlanSelection = async (planId: string) => {
    try {
      // Save user preferences first
      await updateUser({
        interests: selectedInterests.join(","),
        heard_about_us: referralSource,
        is_completed_onboarding: true,
      }).unwrap();

      // Find the plan data
      const selectedPlanData = subscriptionPlans.find(p => p.id === planId);

      // Show loading message
      toast.success(t('onboarding.redirectingToPlan', 'Redirecting to payment...'));

      // Check if we're in development mode or if plan URL is missing
      const isDevelopment = process.env.NODE_ENV === 'development';
      const useMockPayment = isDevelopment || !selectedPlanData?.url;

      if (useMockPayment) {
        // Use mock payment for development/testing
        const returnUrl = encodeURIComponent(`${window.location.origin}/onboarding/success`);
        const mockPaymentUrl = `${window.location.origin}/mock-payment?return_url=${returnUrl}&plan_name=${encodeURIComponent(selectedPlanData?.name || 'Premium Plan')}&plan_price=${encodeURIComponent(selectedPlanData?.price || '$29.99')}`;

        // Redirect to mock payment page
        window.location.href = mockPaymentUrl;
      } else {
        // Use real payment URL for production
        const returnUrl = encodeURIComponent(`${window.location.origin}/onboarding/success`);
        const paymentUrl = `${selectedPlanData.url + (selectedPlanData.url.includes('?') ? '&' : '?')}return_url=${returnUrl}`;

        // Redirect to real payment page
        window.location.href = paymentUrl;
      }
    } catch (error) {
      console.error('Failed to save user preferences before payment:', error);
      toast.error(t('onboarding.errorBeforePayment', 'Failed to save preferences. Please try again.'));
    }
  };

  // Handle next step
  const handleNextStep = () => {
    setStep(2);
  };

  // Helper function to check if a plan is free
  const isFreeplan = (planId: string | null): boolean => {
    if (!planId) return true;

    // Handle our custom 'free' plan ID
    if (planId === 'free') return true;

    const plan = subscriptionPlans.find(p => p.id === planId);
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
    if (!selectedPlan) return;

    // If it's a paid plan, redirect to payment
    if (selectedPlan !== 'free' && !isFreeplan(selectedPlan)) {
      await handlePaidPlanSelection(selectedPlan);
      return;
    }

    // For free plan, complete onboarding normally
    try {
      // Save user preferences to the API
      await updateUser({
        is_active: true,
        interests: selectedInterests.join(","),
        heard_about_us: referralSource,
        is_completed_onboarding: true,
      }).unwrap();

      // Create free subscription with plan_id "FreePlan-001"
      await createSubscription({
        plan_id: "FreePlan-001"
      }).unwrap();

      toast.success(t('onboarding.freeSelected', 'Welcome! You\'re all set with the free plan.'));

      // Mark onboarding as completed in Redux store
      dispatch(setOnboardingCompleted(true));

      // Navigate to dashboard
      navigate('/');
    } catch (error) {
      console.error('Failed to save user preferences or create subscription:', error);
      toast.error(t('onboarding.error', 'Failed to save preferences, but we\'ll continue anyway.'));

      // Still mark as completed in the local store and navigate
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
            {step === 1
              ? t('onboarding.welcome', 'Welcome to XBlog!')
              : t('onboarding.choosePlan', 'Choose Your Plan')
            }
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            {step === 1
              ? t('onboarding.welcomeSubtitle', 'Let\'s get to know you better so we can personalize your experience.')
              : t('onboarding.choosePlanSubtitle', 'Select a plan that works best for your content creation needs.')
            }
          </Typography>
        </Stack>

        {/* Progress indicator */}
        <Box sx={{ width: '100%', mb: 5 }}>
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
            {/* Plan Selection Header */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                {t('onboarding.choosePlan', 'Choose Your Plan')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('onboarding.planDescription', 'Select a plan that fits your needs. You can always upgrade later.')}
              </Typography>

              {/* Development Mode Notice */}
              {process.env.NODE_ENV === 'development' && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                    maxWidth: 400,
                    mx: 'auto',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Iconify
                      icon="mdi:information"
                      sx={{ color: 'info.main', mr: 1, fontSize: 16 }}
                    />
                    <Typography variant="caption" color="info.main" fontWeight="medium">
                      {t('onboarding.devMode', 'Development Mode - Mock Payment Enabled')}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Paid Plans Carousel */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                {t('onboarding.paidPlans', 'Premium Plans')}
              </Typography>
              <ResponsivePricingPlans
                onSelectPlan={handlePlanSelect}
                selectedPlan={selectedPlan}
                title=""
                subtitle=""
                hideFreePlans={false}
              />
            </Box>

            {/* Free Plan Option - Smaller and Less Prominent */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                {t('onboarding.freePlanOption', 'Or start for free')}
              </Typography>
              <Card
                sx={{
                  maxWidth: 280,
                  mx: 'auto',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderColor: selectedPlan === 'free' ? 'primary.main' : alpha(theme.palette.divider, 0.5),
                  borderWidth: selectedPlan === 'free' ? 2 : 1,
                  borderStyle: 'solid',
                  boxShadow: selectedPlan === 'free' ? theme.customShadows?.z4 : 'none',
                  bgcolor: alpha(theme.palette.grey[50], 0.5),
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: theme.customShadows?.card,
                  }
                }}
                onClick={() => handlePlanSelect('free')}
              >
                <CardActionArea sx={{ p: 2 }}>
                  <Stack spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                      }}
                    >
                      <Iconify
                        icon="mdi:gift-outline"
                        sx={{ color: 'success.main', fontSize: 20 }}
                      />
                    </Box>
                    <Typography variant="subtitle2">
                      {t('onboarding.freePlan', 'Free Plan')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center">
                      {t('onboarding.freePlanDescription', '5 articles/month with basic features')}
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {t('onboarding.freePrice', '$0')}
                      <Typography component="span" variant="caption" color="text.secondary">
                        {t('onboarding.perMonth', '/month')}
                      </Typography>
                    </Typography>
                    {selectedPlan === 'free' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                        <CheckCircleOutlineIcon sx={{ mr: 0.5, fontSize: 16 }} />
                        <Typography variant="caption" fontWeight="medium">
                          {t('onboarding.selected', 'Selected')}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardActionArea>
              </Card>
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => setStep(1)}
                sx={{ px: 3 }}
                disabled={isUpdatingUser || isCreatingSubscription}
              >
                {t('onboarding.back', 'Back')}
              </Button>

              {/* Continue button - shows for all plan selections */}
              <LoadingButton
                variant="contained"
                size="large"
                onClick={handleComplete}
                loading={isUpdatingUser || isCreatingSubscription}
                disabled={!selectedPlan}
                sx={{
                  px: 5,
                  ...(selectedPlan === 'free' && {
                    bgcolor: 'success.main',
                    '&:hover': {
                      bgcolor: 'success.dark',
                    }
                  })
                }}
              >
                {selectedPlan === 'free'
                  ? t('onboarding.startWithFree', 'Start with Free Plan')
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