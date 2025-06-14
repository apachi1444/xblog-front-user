
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { filterNonFreePlans } from 'src/services/invoicePdfService';
import { useGetSubscriptionPlansQuery } from 'src/services/apis/subscriptionApi';

import { PricingPlans } from './PricingPlans';
import { MobilePricingPlans } from './MobilePricingPlans';


// ----------------------------------------------------------------------

export interface ResponsivePricingPlansProps {
  title?: string;
  subtitle?: string;
  onSelectPlan?: (planId: string) => void;
  selectedPlan?: string | null;
  gridColumns?: { xs?: number; sm?: number; md?: number; lg?: number };
  dynamicLayout?: boolean; // New prop to control dynamic layout
  hideFreePlans?: boolean; // New prop to hide free plans
  sx?: any;
}

export function ResponsivePricingPlans({
  title,
  subtitle,
  onSelectPlan,
  selectedPlan,
  gridColumns,
  dynamicLayout = true, // Default to true for dynamic layout
  hideFreePlans = false, // Default to false to show all plans
  sx = {},
}: ResponsivePricingPlansProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  // State to track whether monthly or yearly plans are selected
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Use media query to determine if we should show mobile or desktop view
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data:  plans} = useGetSubscriptionPlansQuery()

  // Filter plans based on the billing cycle and free plan visibility
  const filteredPlans = useMemo(() => {
    if (!plans) return [];

    const filtered = plans.filter(plan => {
      const planName = plan.name.toLowerCase();
      return billingCycle === 'monthly'
        ? planName.includes('monthly') || (!planName.includes('yearly') && !planName.includes('monthly'))
        : planName.includes('yearly');
    });

    // Filter out free plans if hideFreePlans is true
    if (hideFreePlans) {
      // filtered = filterNonFreePlans(filtered);
    }

    return filtered;
  }, [plans, billingCycle, hideFreePlans]);

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {/* Billing Cycle Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body1" color={billingCycle === 'monthly' ? 'primary' : 'text.secondary'}>
            {t('pricing.monthly', 'Monthly')}
          </Typography>
          <Switch
            checked={billingCycle === 'yearly'}
            onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            color="primary"
          />
          <Typography variant="body1" color={billingCycle === 'yearly' ? 'primary' : 'text.secondary'}>
            {t('pricing.yearly', 'Yearly')}
            <Box component="span" sx={{ ml: 1, px: 1, py: 0.5, bgcolor: 'success.light', color: 'success.contrastText', borderRadius: 1, fontSize: '0.75rem' }}>
              {t('pricing.savePercent', 'Save 20%')}
            </Box>
          </Typography>
        </Stack>
      </Box>

      {isMobile ? (
        <MobilePricingPlans
          title={title}
          subtitle={subtitle}
          onSelectPlan={onSelectPlan}
          selectedPlan={selectedPlan}
          plans={filteredPlans} // Pass filtered plans
          sx={sx}
        />
      ) : (
        <PricingPlans
          title={title}
          subtitle={subtitle}
          onSelectPlan={onSelectPlan}
          selectedPlan={selectedPlan}
          plans={filteredPlans} // Pass filtered plans
          gridColumns={!dynamicLayout ? gridColumns : undefined} // Only pass gridColumns if dynamicLayout is false
          sx={sx}
        />
      )}
    </Box>
  );
}
