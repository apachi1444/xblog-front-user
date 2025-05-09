import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import { usePlanIcons } from 'src/hooks/usePlanIcons';

import { Iconify } from 'src/components/iconify';

import type { PricingPlan } from './PricingPlans';

// ----------------------------------------------------------------------

export interface MobilePricingPlansProps {
  plans: PricingPlan[];
  title?: string;
  subtitle?: string;
  onSelectPlan?: (planId: string) => void;
  selectedPlan?: string | null;
  sx?: any;
}

export function MobilePricingPlans({
  plans,
  title = 'Flexible plans for your community\'s size and needs',
  subtitle = 'Choose your plan and start creating content today',
  onSelectPlan,
  selectedPlan: externalSelectedPlan,
  sx = {},
}: MobilePricingPlansProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { getPlanIcon, getLocalizedPlanName } = usePlanIcons();

  // State for the carousel
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = plans.length;

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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Current plan being displayed
  const currentPlan = plans[activeStep];
  const isSelected = selectedPlanValue === currentPlan.id;
  const buttonVariant = currentPlan.buttonVariant || (isSelected ? 'contained' : 'outlined');
  const buttonText = currentPlan.buttonText || (currentPlan.current ? t('pricing.currentPlan', 'Current Plan') : t('pricing.choosePlan', 'Choose Plan'));

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {/* Header */}
      {(title || subtitle) && (
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          {title && (
            <Typography variant="h5" gutterBottom>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      {/* Plan Card */}
      <Card
        sx={{
          mb: 2,
          borderColor: currentPlan.current || isSelected ? 'primary.main' : 'divider',
          borderWidth: currentPlan.current || isSelected ? 2 : 1,
          borderStyle: 'solid',
          boxShadow: (currentPlan.current || isSelected) ? theme.customShadows?.z8 : 'none',
          bgcolor: currentPlan.highlight ? alpha(theme.palette.primary.main, 0.04) : 'background.paper',
          position: 'relative',
          ...(currentPlan.popular && {
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '0 30px 30px 0',
              borderColor: `transparent ${theme.palette.primary.main} transparent transparent`,
              zIndex: 1,
            },
          }),
        }}
      >
        {currentPlan.popular && (
          <Box
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              zIndex: 2,
              transform: 'rotate(45deg)',
            }}
          >
            <Iconify icon="mdi:star" sx={{ color: 'common.white', fontSize: 14 }} />
          </Box>
        )}

        {currentPlan.current && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: '10px',
              px: 1,
              py: 0.25,
              fontSize: '0.7rem',
              fontWeight: 'bold',
            }}
          >
            {t('pricing.currentPlan', 'Current Plan')}
          </Box>
        )}

        <CardContent sx={{ p: 2.5 }}>
          {/* Plan Icon */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <Iconify
                icon={currentPlan.icon || getPlanIcon(currentPlan.name)}
                sx={{ color: 'primary.main', fontSize: 20 }}
              />
            </Box>
          </Box>

          {/* Plan Name */}
          <Typography variant="h6" align="center" gutterBottom>
            {currentPlan.name}
          </Typography>

          {/* Plan Price */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2 }}>
            <Typography variant="h4" component="span">
              {typeof currentPlan.price === 'number' ? `$${currentPlan.price}` : currentPlan.price}
            </Typography>
            {currentPlan.period && (
              <Typography variant="subtitle2" color="text.secondary" component="span" sx={{ ml: 0.5 }}>
                {currentPlan.period}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Plan Features */}
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            {currentPlan.features.map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                <Iconify
                  icon="mdi:check-circle"
                  sx={{
                    color: 'success.main',
                    mr: 1.5,
                    fontSize: 18,
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
            disabled={currentPlan.disabled}
            onClick={() => handleSelectPlan(currentPlan.id)}
            sx={{ mt: 1 }}
          >
            {buttonText}
          </Button>
        </CardContent>
      </Card>

      {/* Stepper */}
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{
          bgcolor: 'transparent',
          '& .MuiMobileStepper-dot': {
            width: 8,
            height: 8,
            mx: 0.5,
          },
          '& .MuiMobileStepper-dotActive': {
            bgcolor: 'primary.main',
          }
        }}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <KeyboardArrowLeft />
          </Button>
        }
      />
    </Box>
  );
}
