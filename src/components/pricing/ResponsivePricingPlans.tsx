import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { PricingPlans } from './PricingPlans';
import { MobilePricingPlans } from './MobilePricingPlans';

import type { PricingPlan } from './PricingPlans';

// ----------------------------------------------------------------------

export interface ResponsivePricingPlansProps {
  plans: PricingPlan[];
  title?: string;
  subtitle?: string;
  onSelectPlan?: (planId: string) => void;
  selectedPlan?: string | null;
  gridColumns?: { xs?: number; sm?: number; md?: number; lg?: number };
  sx?: any;
}

export function ResponsivePricingPlans({
  plans,
  title,
  subtitle,
  onSelectPlan,
  selectedPlan,
  gridColumns,
  sx = {},
}: ResponsivePricingPlansProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  
  // Use media query to determine if we should show mobile or desktop view
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{ width: '100%', ...sx }}>
      {isMobile ? (
        <MobilePricingPlans
          plans={plans}
          title={title}
          subtitle={subtitle}
          onSelectPlan={onSelectPlan}
          selectedPlan={selectedPlan}
          sx={sx}
        />
      ) : (
        <PricingPlans
          plans={plans}
          title={title}
          subtitle={subtitle}
          onSelectPlan={onSelectPlan}
          selectedPlan={selectedPlan}
          gridColumns={gridColumns}
          sx={sx}
        />
      )}
    </Box>
  );
}
