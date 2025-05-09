import { useState, useCallback } from 'react';
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

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export interface PricingPlan {
  id: string;
  name: string;
  price: string | number;
  period?: string;
  description?: string;
  features: string[];
  popular?: boolean;
  current?: boolean;
  highlight?: boolean;
  icon?: string;
  buttonText?: string;
  buttonVariant?: 'contained' | 'outlined' | 'text';
  disabled?: boolean;
}

export interface PricingPlansProps {
  plans: PricingPlan[];
  title?: string;
  subtitle?: string;
  onSelectPlan?: (planId: string) => void;
  selectedPlan?: string | null;
  layout?: 'grid' | 'list';
  gridColumns?: { xs?: number; sm?: number; md?: number; lg?: number };
  sx?: any;
}

export function PricingPlans({
  plans,
  title = 'Flexible plans for your community\'s size and needs',
  subtitle = 'Choose your plan and start creating content today',
  onSelectPlan,
  selectedPlan: externalSelectedPlan,
  layout = 'grid',
  gridColumns = { xs: 1, sm: 1, md: 3 },
  sx = {},
}: PricingPlansProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { getPlanIcon } = usePlanIcons();
  
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
            {plan.features.map((feature, index) => (
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
          </Stack>
          
          {/* Action Button */}
          <Button
            fullWidth
            variant={buttonVariant}
            color="primary"
            disabled={plan.disabled}
            onClick={() => handleSelectPlan(plan.id)}
            sx={{ mt: 'auto' }}
          >
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    );
  };
  
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
            <Grid item xs={gridColumns.xs || 12} sm={gridColumns.sm || 6} md={gridColumns.md || 4} lg={gridColumns.lg || 4} key={plan.id}>
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
