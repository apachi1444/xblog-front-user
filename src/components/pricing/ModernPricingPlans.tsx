import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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

interface ModernPricingPlansProps {
  onSelectPlan?: (planId: string) => void;
  selectedPlan?: string | null;
  showFreePlan?: boolean;
  maxPlans?: number;
  title?: string;
  subtitle?: string;
  sx?: object;
}

export function ModernPricingPlans({
  onSelectPlan,
  selectedPlan = null,
  showFreePlan = false,
  maxPlans = 3,
  title,
  subtitle,
  sx = {},
}: ModernPricingPlansProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { data: plans, isLoading } = useGetSubscriptionPlansQuery();

  // State for billing period
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Handle billing period change
  const handleBillingPeriodChange = useCallback((newPeriod: 'monthly' | 'yearly') => {
    setBillingPeriod(newPeriod);
  }, []);

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

      // Handle free plan visibility
      if (planName.includes('free')) {
        return showFreePlan;
      }

      // Filter based on billing period
      if (billingPeriod === 'yearly') {
        return planName.includes('yearly') || planName.includes('annual');
      }
      return planName.includes('monthly') || (!planName.includes('yearly') && !planName.includes('annual'));
    })
    .sort((a, b) => {
      // Sort by price from smallest to greatest
      const priceA = parseFloat(a.price) || 0;
      const priceB = parseFloat(b.price) || 0;
      return priceA - priceB;
    })
    .slice(0, maxPlans) || [];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, ...sx }}>
        <Typography variant="body2" color="text.secondary">
          {t('pricing.loading', 'Loading plans...')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {/* Header */}
      {(title || subtitle) && (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          {title && (
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      {/* Free Plan Button */}
      {showFreePlan && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
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
            {t('pricing.continueForFree', 'Continue for Free')}
          </Button>
        </Box>
      )}

      {/* Billing Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
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
            {t('pricing.monthly', 'Monthly')}
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
            {t('pricing.yearly', 'Yearly')}
            <Chip
              label="-25%"
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

      {/* Plans Grid */}
      <Grid container spacing={3} justifyContent="center">
        {filteredPlans.map((plan, index) => {
          const isSelected = selectedPlan === plan.id;
      
          return (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              <Card
                onClick={() => handlePlanSelect(plan.id)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 4,
                  border: isSelected
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  bgcolor: isSelected
                    ? alpha(theme.palette.primary.main, 0.05)
                    : 'background.paper',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'visible',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.customShadows?.z20,
                  },
                  ...(isSelected && {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
                    border: `3px solid ${theme.palette.primary.main}`,
                  })
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  {/* Plan Badge */}
                  <Box sx={{ mb: 3 }}>
                    <Chip
                      label={plan.name}
                      sx={{
                        bgcolor: isSelected
                          ? 'primary.main'
                          : alpha(theme.palette.grey[500], 0.1),
                        color: isSelected
                          ? 'white'
                          : 'text.primary',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        px: 2,
                        py: 1,
                        height: 32,
                        border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
                      }}
                    />
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
                    {t('pricing.securePayment', 'Secure payment powered by Stripe')}
                  </Typography>

                  {/* Features */}
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      {t('pricing.features', 'Features')}
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
  );
}
