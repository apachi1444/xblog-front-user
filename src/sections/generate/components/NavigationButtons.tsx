import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

interface NavigationButtonsProps {
  activeStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onFinish: () => void;
}

export function NavigationButtons({
  activeStep,
  totalSteps,
  onNext,
  onBack,
  onFinish,
}: NavigationButtonsProps) {
  const theme = useTheme();
  const isLastStep = activeStep === totalSteps - 1;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        py: 2,
        px: 3,
        bgcolor: 'background.paper',
        borderTop: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.appBar,
        display: 'flex',
        justifyContent: 'space-between',
        width: 'calc(100% - 280px)',
        ml: '280px',
      }}
    >
      <Button
        variant="outlined"
        startIcon={<Iconify icon="eva:arrow-back-fill" />}
        sx={{ 
          borderRadius: '24px',
          minWidth: '120px',
          visibility: activeStep === 0 ? 'hidden' : 'visible',
        }}
        onClick={onBack}
      >
        Previous
      </Button>

      <Button
        variant="contained"
        endIcon={
          <Iconify 
            icon={isLastStep ? 'eva:checkmark-circle-2-fill' : 'eva:arrow-forward-fill'} 
          />
        }
        sx={{ 
          borderRadius: '24px',
          minWidth: '120px',
          bgcolor: isLastStep ? 'success.main' : 'primary.main',
          '&:hover': {
            bgcolor: isLastStep ? 'success.dark' : 'primary.dark',
          }
        }}
        onClick={isLastStep ? onFinish : onNext}
      >
        {isLastStep ? 'Finish & Publish' : 'Next'}
      </Button>
    </Box>
  );
}