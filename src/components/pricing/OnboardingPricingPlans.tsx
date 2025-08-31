import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  Button,
  Typography,
  CardContent,
} from '@mui/material';

import { useGetSubscriptionPlansQuery } from 'src/services/apis/subscriptionApi';

// ----------------------------------------------------------------------

interface OnboardingPricingPlansProps {
  onSelectPlan?: (planId: string) => void;
  onContinue?: () => void;
  selectedPlan?: string | null;
  isLoading?: boolean;
  showFreePlan?: boolean;
  maxPlans?: number;
  sx?: object;
}

export function OnboardingPricingPlans({
  onSelectPlan,
  onContinue,
  selectedPlan = null,
  isLoading = false,
  showFreePlan = true,
  maxPlans = 2,
  sx = {},
}: OnboardingPricingPlansProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { data: plans, isLoading: isLoadingPlans } = useGetSubscriptionPlansQuery();

  // State for billing period
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Handle billing period change and clear selected plan if it doesn't match
  const handleBillingPeriodChange = useCallback((newPeriod: 'monthly' | 'yearly') => {
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
          if (onSelectPlan) {
            onSelectPlan('');
          }
        }
      }
    }
  }, [selectedPlan, plans, onSelectPlan]);

  // Handle plan selection
  const handlePlanSelect = useCallback((planId: string) => {
    if (onSelectPlan) {
      onSelectPlan(planId);
    }
  }, [onSelectPlan]);

  // Filter and sort plans
  const filteredPlans = plans
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
    .slice(0, maxPlans) || [];

  if (isLoadingPlans) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, ...sx }}>
        <Typography variant="body2" color="text.secondary">
          {t('pricing.loading', 'Loading plans...')}
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={5} sx={sx}>
      {/* Modern Header with Step Indicator */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        {/* Continue for Free Plan Option */}
        {showFreePlan && (
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
        )}

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
        <Grid container spacing={3} justifyContent="center">
          {filteredPlans.map((plan, index) => {
            const isSelected = selectedPlan === plan.id;
            const isPopular = false; // Make second plan popular

            return (
              <Grid item xs={12} sm={6} md={5} key={plan.id}>
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
                        ${plan.price}
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
                        {(plan.features && plan.features.length > 0) && (
                          <Box sx={{ textAlign: 'center', mt: 1 }}>
                            <Button
                              size="small"
                              variant="text"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open('https://xblog.ai/#pricing', '_blank');
                              }}
                              sx={{
                                fontSize: '0.75rem',
                                textTransform: 'none',
                                color: 'primary.main'
                              }}
                            >
                              {t('pricing.discoverMore', 'Discover more')}
                            </Button>
                          </Box>
                        )}
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
      {onContinue && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 6 }}>
          <LoadingButton
            variant="contained"
            size="large"
            onClick={onContinue}
            loading={isLoading}
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
            {selectedPlan === 'free'
              ? t('onboarding.continueWithFree', 'Continue with Free Plan')
              : selectedPlan
              ? t('onboarding.continueWithPremium', 'Continue with Premium Plan')
              : t('onboarding.selectPlan', 'Select a Plan')
            }
          </LoadingButton>
        </Box>
      )}
    </Stack>
  );
}
