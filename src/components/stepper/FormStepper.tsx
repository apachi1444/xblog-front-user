import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Iconify } from '../iconify';

interface FormStepperProps {
  steps: string[];
  activeStep: number;
  title?: string;
}

export function FormStepper({ steps, activeStep, title }: FormStepperProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      mb: 5, 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {title && (
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            textAlign: 'center',
            fontWeight: 600,
            mb: 3
          }}
        >
          {title}
        </Typography>
      )}
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 800,
          position: 'relative',
          px: 2
        }}
      >
        {/* Progress line (only visible on desktop) */}
        {!isMobile && (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: 40,
                right: 40,
                height: 2,
                transform: 'translateY(-50%)',
                bgcolor: theme.palette.divider,
                zIndex: 0
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: 40,
                width: `calc(${(activeStep / (steps.length - 1)) * 100}% - ${40 * (1 - activeStep / (steps.length - 1))}px)`,
                height: 2,
                transform: 'translateY(-50%)',
                bgcolor: theme.palette.primary.main,
                zIndex: 1,
                transition: 'width 0.3s ease-in-out'
              }}
            />
          </>
        )}
        
        {steps.map((step, index) => (
          <Box 
            key={step} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mb: isMobile ? 2 : 0,
              zIndex: 2,
              flex: isMobile ? 'none' : 1,
              justifyContent: 'center'
            }}
          >
            {/* Step indicator with number and label */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {/* Step number circle */}
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  color: index <= activeStep ? '#fff' : 'text.disabled',
                  bgcolor: index <= activeStep ? 'primary.main' : 'background.paper',
                  border: `2px solid ${index <= activeStep ? theme.palette.primary.main : theme.palette.divider}`,
                  fontWeight: 'bold',
                  boxShadow: index === activeStep ? '0 4px 8px rgba(90, 105, 207, 0.25)' : 'none',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {index < activeStep ? (
                  <Iconify 
                    icon="eva:checkmark-fill" 
                    sx={{ width: 18, height: 18 }} 
                  />
                ) : (
                  index + 1
                )}
              </Box>
              
              {/* Step label */}
              <Typography
                variant="subtitle2"
                sx={{
                  color: index <= activeStep ? 'text.primary' : 'text.disabled',
                  fontWeight: index === activeStep ? 600 : 400,
                  transition: 'all 0.2s ease-in-out',
                  textAlign: 'center',
                  maxWidth: 100
                }}
              >
                {step}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      
      {/* Progress indicator text */}
      <Typography 
        variant="body2" 
        sx={{ 
          textAlign: 'center', 
          mt: 2, 
          color: 'text.secondary',
          fontStyle: 'italic'
        }}
      >
        Step {activeStep + 1} of {steps.length}
      </Typography>
    </Box>
  );
}