import { Box, Button, useTheme } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useTranslation } from 'react-i18next';

interface StepNavigationProps {
  activeStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
}

export const StepNavigation = ({ activeStep, totalSteps, onNext, onBack }: StepNavigationProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        py: 3, // Increased vertical padding
        px: 4, // Increased horizontal padding
        bgcolor: 'background.paper',
        borderTop: `1px solid ${theme.palette.divider}`,
        boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.05)', // Add subtle shadow for better separation
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        width: 'calc(100% - 240px)',
        ml: '240px',
      }}
    >
      <Box>
        {activeStep > 0 ? (
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:arrow-back-fill" />}
            sx={{
              borderRadius: '24px',
              minWidth: '120px',
            }}
            onClick={onBack}
          >
            Previous
          </Button>
        ) : null}
      </Box>

      <Box>
        {activeStep === totalSteps - 1 ? (
          <Button
            variant="contained"
            endIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
            sx={{
              borderRadius: '24px',
              bgcolor: 'success.main',
              minWidth: '180px',
              px: 3,
              '&:hover': {
                bgcolor: 'success.dark',
              }
            }}
            onClick={onNext}
          >
            Finish & Publish
          </Button>
        ) : (
          <Button
            variant="contained"
            endIcon={<Iconify icon="eva:arrow-forward-fill" />}
            sx={{
              borderRadius: '24px',
              minWidth: '120px',
            }}
            onClick={onNext}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};
