import { 
  Box,
  Typography,
  useTheme
} from '@mui/material';

import { Iconify } from '../iconify';

interface FormStepperProps {
  steps: string[];
  activeStep: number;
  title?: string;
}

export function FormStepper({ steps, activeStep, title }: FormStepperProps) {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 5 }}>
      {title && (
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
      )}
      
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        gap={1}
      >
        {steps.map((step, index) => (
          <Box key={step} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  color: index <= activeStep ? 'primary.main' : 'text.disabled',
                  bgcolor: index <= activeStep ? 'primary.lighter' : 'background.neutral',
                  border: `1px solid ${index <= activeStep ? theme.palette.primary.main : theme.palette.divider}`,
                }}
              >
                {index + 1}
              </Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: index <= activeStep ? 'text.primary' : 'text.disabled',
                }}
              >
                {step}
              </Typography>
            </Box>
            
            {index < steps.length - 1 && (
              <Box sx={{ mx: 2 }}>
                <Iconify 
                  icon="eva:arrow-forward-fill"
                  sx={{
                    width: 20,
                    height: 20,
                    color: index < activeStep ? 'primary.main' : 'text.disabled',
                  }}
                />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}