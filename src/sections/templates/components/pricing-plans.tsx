import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$9.99',
    period: '/month',
    description: 'Perfect for individuals just getting started',
    features: [
      '10 premium templates',
      '100 articles per month',
      'Basic SEO tools',
      'Email support',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19.99',
    period: '/month',
    description: 'For professionals and small teams',
    features: [
      'All premium templates',
      'Unlimited articles',
      'Advanced SEO tools',
      'Priority support',
      'Content analytics',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$49.99',
    period: '/month',
    description: 'For large teams and businesses',
    features: [
      'All Pro features',
      'Custom templates',
      'API access',
      'Dedicated account manager',
      'Team collaboration tools',
    ],
    popular: false,
  },
];

// ----------------------------------------------------------------------

interface PricingPlansProps {
  onSelectPlan: (planId: string) => void;
}

export function PricingPlans({ onSelectPlan }: PricingPlansProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  return (
    <Stack spacing={2}>
      {PLANS.map((plan) => {
        const isSelected = selectedPlan === plan.id;
        
        return (
          <Card 
            key={plan.id}
            sx={{ 
              cursor: 'pointer',
              transition: 'all 0.2s',
              borderColor: isSelected ? 'primary.main' : 'divider',
              borderWidth: isSelected ? 2 : 1,
              borderStyle: 'solid',
              ...(plan.popular && {
                position: 'relative',
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
            
            <CardContent>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {plan.description}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                <Typography variant="h4" component="span">
                  {plan.price}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" component="span">
                  {plan.period}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Stack spacing={1} sx={{ mb: 3 }}>
                {plan.features.map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify 
                      icon="mdi:check-circle" 
                      sx={{ 
                        color: 'success.main', 
                        mr: 1,
                        fontSize: 20,
                      }} 
                    />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                ))}
              </Stack>
              
              <Button
                fullWidth
                variant={isSelected ? "contained" : "outlined"}
                color="primary"
                onClick={() => onSelectPlan(plan.id)}
              >
                {isSelected 
                  ? t('templates.plans.selected', 'Selected') 
                  : t('templates.plans.select', 'Select')}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}