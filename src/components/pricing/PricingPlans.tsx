import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';

import { usePlanIcons } from 'src/hooks/usePlanIcons';

import { useGetSubscriptionPlansQuery, type SubscriptionPlan as ApiSubscriptionPlan } from 'src/services/apis/subscriptionApi';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Extended interface for UI display purposes
export interface PricingPlan extends Omit<ApiSubscriptionPlan, 'features'> {
  period?: string;
  description?: string;
  features: string[] | null; // Make features nullable to match backend response
  popular?: boolean;
  current?: boolean;
  highlight?: boolean;
  icon?: string;
  buttonText?: string;
  buttonVariant?: 'contained' | 'outlined' | 'text';
  disabled?: boolean;
}

export interface PricingPlansProps {
  title?: string;
  subtitle?: string;
  onSelectPlan?: (planId: string) => void;
  selectedPlan?: string | null;
  layout?: 'grid' | 'list';
  gridColumns?: { xs?: number; sm?: number; md?: number; lg?: number };
  plans?: PricingPlan[]; // Allow passing plans directly to the component
  sx?: any;
}

export function PricingPlans({
  title = 'Flexible plans for your community\'s size and needs',
  subtitle = 'Choose your plan and start creating content today',
  onSelectPlan,
  selectedPlan: externalSelectedPlan,
  layout = 'grid',
  gridColumns,
  plans: externalPlans,
  sx = {},
}: PricingPlansProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { getPlanIcon } = usePlanIcons();

  const {
    data,
    isLoading,
    error
  } = useGetSubscriptionPlansQuery();

  // Use external plans if provided, otherwise fetch from API
  const plans: PricingPlan[] = externalPlans || (data || []);

  // Calculate dynamic grid columns based on number of plans
  const dynamicGridColumns = useMemo(() => {
    if (gridColumns) return gridColumns;

    const planCount = plans.length;
    if (planCount === 0) return { xs: 12, sm: 12, md: 12, lg: 12 };

    // Ensure we don't divide by zero and handle edge cases
    const getColumnSize = (count: number): number => {
      if (count <= 0) return 12;
      // Ensure we get whole numbers that divide 12 evenly
      if (12 % count === 0) return 12 / count;
      // For odd numbers or numbers that don't divide 12 evenly, find the closest divisor
      if (count <= 2) return 6;  // 2 columns
      if (count <= 4) return 3;  // 4 columns
      if (count <= 6) return 2;  // 6 columns
      return 1;  // Default to 12 columns for many plans
    };

    return {
      xs: 12,                      // One plan per row on extra small screens
      sm: planCount > 2 ? 6 : getColumnSize(planCount), // One or two plans per row on small screens
      md: getColumnSize(planCount), // All plans in one row on medium screens
      lg: getColumnSize(planCount)  // All plans in one row on large screens
    };
  }, [plans.length, gridColumns]);

  // Use external selectedPlan if provided, otherwise manage internally
  const [internalSelectedPlan, setInternalSelectedPlan] = useState<string | null>(
    externalSelectedPlan || (plans.find(plan => plan.current)?.id || null)
  );

  // Use the appropriate selectedPlan value
  const selectedPlanValue = externalSelectedPlan !== undefined ? externalSelectedPlan : internalSelectedPlan;

  const handleSelectPlan = useCallback((planId: string) => {
    if (externalSelectedPlan === undefined) {
      setInternalSelectedPlan(planId);
    }

    if (onSelectPlan) {
      onSelectPlan(planId);
    }
  }, [externalSelectedPlan, onSelectPlan]);

  // Render a single plan card
  const renderPlanCard = (plan: PricingPlan) => {
    const isSelected = selectedPlanValue === plan.id;
    const buttonVariant = plan.buttonVariant || (isSelected ? 'contained' : 'outlined');
    const buttonText = plan.buttonText || (plan.current ? t('pricing.currentPlan', 'Current Plan') : t('pricing.choosePlan', 'Choose Plan'));

    // Get icon based on plan type if not provided
    const iconToUse = plan.icon || getPlanIcon(plan.name);

    return (
      <Card
        key={plan.id}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.2s',
          borderColor: plan.current || isSelected ? 'primary.main' : 'divider',
          borderWidth: plan.current || isSelected ? 2 : 1,
          borderStyle: 'solid',
          boxShadow: (plan.current || isSelected) ? theme.customShadows?.z8 : 'none',
          bgcolor: plan.highlight ? alpha(theme.palette.primary.main, 0.04) : 'background.paper',
          position: 'relative',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: theme.customShadows?.z4,
            transform: 'translateY(-2px)',
          },
          ...(plan.popular && {
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '0 40px 40px 0',
              borderColor: `transparent ${theme.palette.primary.main} transparent transparent`,
              zIndex: 1,
            },
          }),
          ...sx,
        }}
        onClick={() => handleSelectPlan(plan.id)}
      >
        {plan.popular && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              transform: 'rotate(45deg)',
            }}
          >
            <Iconify icon="mdi:star" sx={{ color: 'common.white', fontSize: 16 }} />
          </Box>
        )}

        {plan.current && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: '12px',
              px: 1,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}
          >
            {t('pricing.currentPlan', 'Current Plan')}
          </Box>
        )}

        <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Plan Icon - Always show an icon */}
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <Iconify icon={iconToUse} sx={{ color: 'primary.main', fontSize: 24 }} />
          </Box>

          {/* Plan Name */}
          <Typography variant="h6" gutterBottom>
            {plan.name}
          </Typography>

          {/* Plan Description */}
          {plan.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {plan.description}
            </Typography>
          )}

          {/* Plan Price */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
            <Typography variant="h4" component="span">
              {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
            </Typography>
            {plan.period && (
              <Typography variant="subtitle2" color="text.secondary" component="span" sx={{ ml: 0.5 }}>
                {plan.period}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Plan Features */}
          <Stack spacing={1.5} sx={{ mb: 3, flexGrow: 1 }}>
            {/* Show default features if none are provided from the backend */}
            {(!plan.features || plan.features.length === 0) ? (
              // Default features based on plan type
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify
                    icon="mdi:check-circle"
                    sx={{
                      color: 'success.main',
                      mr: 1.5,
                      fontSize: 20,
                    }}
                  />
                  <Typography variant="body2">{plan.name === 'Free' ? 'Basic content generation' : 'Advanced content generation'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify
                    icon="mdi:check-circle"
                    sx={{
                      color: 'success.main',
                      mr: 1.5,
                      fontSize: 20,
                    }}
                  />
                  <Typography variant="body2">{plan.name === 'Free' ? 'Limited articles per month' : 'Unlimited articles'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify
                    icon="mdi:check-circle"
                    sx={{
                      color: 'success.main',
                      mr: 1.5,
                      fontSize: 20,
                    }}
                  />
                  <Typography variant="body2">{plan.name === 'Free' ? 'Basic support' : 'Priority support'}</Typography>
                </Box>
              </>
            ) : (
              // Show actual features from the backend if available (only first 5)
              <>
                {plan.features.slice(0, 5).map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify
                      icon="mdi:check-circle"
                      sx={{
                        color: 'success.main',
                        mr: 1.5,
                        fontSize: 20,
                      }}
                    />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                ))}
                {plan.features.length > 0 && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open('https://xblog.ai/#pricing', '_blank');
                      }}
                      sx={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 3,
                        py: 0.8,
                        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                        border: '1px solid',
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                          transition: 'left 0.5s',
                        },
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)',
                          borderColor: 'primary.dark',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                          '&:before': {
                            left: '100%',
                          },
                        },
                        '&:active': {
                          transform: 'translateY(0px)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      endIcon={
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-flex',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'translateX(2px)',
                            },
                          }}
                        >
                          ✨
                        </Box>
                      }
                    >
                      {t('pricing.discoverMore', 'Discover more')}
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Stack>

          {/* Action Button */}
          <Button
            fullWidth
            variant={buttonVariant}
            color="primary"
            disabled={plan.disabled}
            onClick={(e) => {
              e.stopPropagation(); // Prevent double-click when clicking button
              handleSelectPlan(plan.id);
            }}
            sx={{ mt: 'auto' }}
          >
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    );
  };

  // Handle loading state
  if (isLoading) {
    return (
      <Box sx={{ py: 4, textAlign: 'center', ...sx }}>
        <Typography variant="h6" color="text.secondary">
          Loading subscription plans...
        </Typography>
      </Box>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Box sx={{ py: 4, textAlign: 'center', ...sx }}>
        <Typography variant="h6" color="error.main">
          Failed to load subscription plans. Please try again later.
        </Typography>
      </Box>
    );
  }

  // Handle empty plans
  if (!plans || plans.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center', ...sx }}>
        <Typography variant="h6" color="text.secondary">
          No subscription plans available at the moment.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, ...sx }}>
      {/* Header */}
      {(title || subtitle) && (
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          {title && (
            <Typography variant="h4" gutterBottom>
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

      {/* Plans */}
      {layout === 'grid' ? (
        <Grid container spacing={3}>
          {plans.map((plan) => (
            <Grid
              item
              xs={dynamicGridColumns.xs}
              sm={dynamicGridColumns.sm}
              md={dynamicGridColumns.md}
              lg={dynamicGridColumns.lg}
              key={plan.id}
            >
              {renderPlanCard(plan)}
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack spacing={2}>
          {plans.map((plan) => renderPlanCard(plan))}
        </Stack>
      )}
    </Box>
  );
}
