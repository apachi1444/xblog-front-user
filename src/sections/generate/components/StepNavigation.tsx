import toast from 'react-hot-toast';
import { useFormContext } from 'react-hook-form';

import { Box, Button, useTheme } from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface StepNavigationProps {
  activeStep: number;
  totalSteps: number;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const StepNavigation = ({ activeStep, totalSteps, onNextStep, onPrevStep }: StepNavigationProps) => {
  const theme = useTheme();
  const methods = useFormContext();
  

  // Helper function to get the field names for a specific step
  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 0:
        return [
          'step1.contentDescription',
          'step1.primaryKeyword',
          'step1.secondaryKeywords',
          'step1.language',
          'step1.targetCountry'
        ];
      case 1:
        return [
          'step2.articleType',
          'step2.articleSize',
          'step2.toneOfVoice',
          'step2.pointOfView',
          'step2.aiContentCleaning',
          'step2.imageSettingsQuality',
          'step2.imageSettingsPlacement',
          'step2.imageSettingsStyle',
          'step2.imageSettingsCount',
          'step2.internalLinking',
          'step2.externalLinking',
          'step2.includeVideos',
          'step2.numberOfVideos',
          'step3.sections'
        ];
      case 2:
        return [];
      case 3:
        return [];
      default:
        return [];
    }
  };

  // Handle next button click with validation
  const handleNext = async () => {
    // Get the fields for the current step
    const currentStepFields = getFieldsForStep(activeStep);

    // Trigger validation for the current step's fields
    const isStepValid = await methods.trigger(currentStepFields as any);

    if (isStepValid) {
      const values = methods.getValues();

      // Additional validation for specific steps
      let shouldProceed = true;

      if (activeStep === 0) {
        // Check for title and meta information in step 1
        if (!values.step1?.title) {
          toast.error("Please generate a title before proceeding");
          shouldProceed = false;
        } else if (!values.step1?.metaTitle || !values.step1?.metaDescription) {
          toast.error("Please generate meta information before proceeding");
          shouldProceed = false;
        }
      } else if (activeStep === 1) {
        // Check if table of contents has been generated in step 2
        if (!values.step3?.sections?.length) {
          toast.error("Please generate a table of contents before proceeding");
          shouldProceed = false;
        }
      } else if (activeStep === 2) {
        // Check if sections have been generated before proceeding to step 3
        if (!values.step3?.sections?.length) {
          toast.error("Please generate sections before proceeding");
          shouldProceed = false;
        }
      }

      if (shouldProceed) {
        // Move to the next step
        onNextStep()
      }
    } else {
      toast.error("Please fill out all required fields before proceeding.");
    }
  };

  // Handle back button click
  const handleBack = () => {
    onPrevStep()
  };

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
            onClick={handleBack}
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
            onClick={handleNext}
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
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};
