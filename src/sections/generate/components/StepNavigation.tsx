import { useState } from 'react';
import toast from 'react-hot-toast';
import { useFormContext } from 'react-hook-form';

import { Box, Button, useTheme, Stack, CircularProgress } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// Import modals for final step actions
import { CopyModal } from '../generate-steps/modals/CopyModal';
import { ExportModal } from '../generate-steps/modals/ExportModal';
import { PublishModal } from '../generate-steps/modals/PublishModal';

interface StepNavigationProps {
  activeStep: number;
  totalSteps: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  // Save functionality props
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
  onSaveDraft?: (formData: any) => void;
}

export const StepNavigation = ({
  activeStep,
  totalSteps,
  onNextStep,
  onPrevStep,
  hasUnsavedChanges = false,
  isSaving = false,
  onSaveDraft
}: StepNavigationProps) => {
  const theme = useTheme();
  const methods = useFormContext();

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      const formData = methods.getValues();
      onSaveDraft(formData);
    }
  };

  // State for modals (only for final step)
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

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
          'step2.internalLinking',
          'step2.externalLinking',
          'step2.includeImages',
          'step2.includeVideos',
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
        onNextStep();
      }
    } else {
      toast.error("Please fill out all required fields before proceeding.");
    }
  };

  // Handle back button click
  const handleBack = () => {
    onPrevStep();
  };

  // Get form data for final step actions
  const getArticleData = () => {
    const values = methods.getValues();
    return {
      articleInfo: {
        title: values.step1?.title || '',
        urlSlug: values.step1?.urlSlug || '',
        metaTitle: values.step1?.metaTitle || '',
        metaDescription: values.step1?.metaDescription || '',
        primaryKeyword: values.step1?.primaryKeyword || '',
        secondaryKeywords: values.step1?.secondaryKeywords || [],
        language: values.step1?.language || 'en-us',
        targetCountry: values.step1?.targetCountry || 'us',
        contentDescription: values.step1?.contentDescription || '',
        createdAt: new Date().toISOString(),
      },
      sections: values.step3?.sections || []
    };
  };

  // Handle final step actions
  const handleCopyAction = () => setCopyModalOpen(true);
  const handleExportAction = () => setExportModalOpen(true);
  const handlePublishAction = () => setPublishModalOpen(true);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          py: 3,
          px: 4,
          bgcolor: 'background.paper',
          borderTop: `1px solid ${theme.palette.divider}`,
          boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.05)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'calc(100% - 240px)',
          ml: '240px',
        }}
      >
        {/* Left side - Previous button */}
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

        {/* Center - Save Draft button */}
        <Box>
          {hasUnsavedChanges && onSaveDraft && (
            <Button
              variant="outlined"
              color="warning"
              onClick={handleSaveDraft}
              disabled={isSaving}
              startIcon={
                isSaving ? (
                  <CircularProgress size={16} />
                ) : (
                  <Iconify icon="eva:save-fill" />
                )
              }
              sx={{
                borderRadius: '24px',
                minWidth: '140px',
                textTransform: 'none',
                borderColor: 'warning.main',
                color: 'warning.main',
                '&:hover': {
                  borderColor: 'warning.dark',
                  bgcolor: 'warning.lighter',
                }
              }}
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
          )}
        </Box>

        {/* Right side - Next/Action buttons */}
        <Box>
          {activeStep === totalSteps - 1 ? (
            // Final step - show action buttons
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:copy-fill" />}
                onClick={handleCopyAction}
                sx={{
                  borderRadius: '24px',
                  px: 3,
                }}
              >
                Copy
              </Button>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:download-fill" />}
                onClick={handleExportAction}
                sx={{
                  borderRadius: '24px',
                  px: 3,
                }}
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                onClick={handlePublishAction}
                sx={{
                  borderRadius: '24px',
                  bgcolor: 'success.main',
                  px: 3,
                  '&:hover': {
                    bgcolor: 'success.dark',
                  }
                }}
              >
                Publish
              </Button>
            </Stack>
          ) : (
            // Other steps - show next button
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

      {/* Modals for final step actions */}
      {activeStep === totalSteps - 1 && (
        <>
          <CopyModal
            open={copyModalOpen}
            onClose={() => setCopyModalOpen(false)}
            articleInfo={getArticleData().articleInfo}
            sections={getArticleData().sections}
          />
          <ExportModal
            open={exportModalOpen}
            onClose={() => setExportModalOpen(false)}
            articleInfo={getArticleData().articleInfo}
            sections={getArticleData().sections}
          />
          <PublishModal
            open={publishModalOpen}
            onClose={() => setPublishModalOpen(false)}
            articleInfo={getArticleData().articleInfo}
            sections={getArticleData().sections}
          />
        </>
      )}
    </>
  );
};
