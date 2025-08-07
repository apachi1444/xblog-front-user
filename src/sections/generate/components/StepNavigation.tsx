import type { UpdateArticleRequest } from 'src/services/apis/articlesApi';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useWatch, useFormContext } from 'react-hook-form';

import { Box, Stack, Button, Dialog, useTheme, Typography, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { useArticleDraft } from 'src/hooks/useArticleDraft';

import { Iconify } from 'src/components/iconify';

// Import modals for final step actions
import { CopyModal } from '../generate-steps/modals/CopyModal';
import { ExportModal } from '../generate-steps/modals/ExportModal';
import { PublishModal } from '../generate-steps/modals/PublishModal';

import type { GenerateArticleFormData } from '../schemas';

interface StepNavigationProps {
  activeStep: number;
  totalSteps: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  articleId?: string | null;
  onTriggerGeneration?: () => void; // Function to trigger generation process
}

export const StepNavigation = ({
  activeStep,
  totalSteps,
  onNextStep,
  onPrevStep,
  articleId,
  onTriggerGeneration
}: StepNavigationProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const methods = useFormContext();
  const articleDraft = useArticleDraft();

  const { control } = methods;

  // State for modals (only for final step)
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  // State for generation confirmation modal (Step 2 → Step 3)
  const [showGenerationModal, setShowGenerationModal] = useState(false);

  // State for loading (prevent multiple clicks)
  const [isNextLoading, setIsNextLoading] = useState(false);

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
          'step2.plagiaRemoval',
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

  const generatedHtml = useWatch({
    control,
    name: 'generatedHtml',
  });



  // Handle next button click with validation
  const handleNext = async () => {
    // Prevent multiple clicks
    if (isNextLoading) return;

    setIsNextLoading(true);

    try {
      // Get the fields for the current step
      const currentStepFields = getFieldsForStep(activeStep);

      // Trigger validation for the current step's fields
      const isStepValid = await methods.trigger(currentStepFields as any);

    if (isStepValid) {
      const values = methods.getValues()

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
        // Step 2 → Step 3: Check if generatedHtml exists
        if (!generatedHtml || generatedHtml.trim() === '') {
          // Show modal asking if user wants to generate full article
          setShowGenerationModal(true);
          shouldProceed = false;
        }
      }

      if (shouldProceed) {
        if (articleId && (activeStep === 0)) {
          try {
            // 🎯 Prepare request body with ALL form data
            const requestBody: UpdateArticleRequest = {
              // Step 1 fields (updated values)
              article_title: values.step1?.title || null,
              content__description: values.step1?.contentDescription || null,
              meta_title: values.step1?.metaTitle || null,
              meta_description: values.step1?.metaDescription || null,
              url_slug: values.step1?.urlSlug || null,
              primary_keyword: values.step1?.primaryKeyword || null,
              secondary_keywords: values.step1?.secondaryKeywords?.length ? JSON.stringify(values.step1.secondaryKeywords) : undefined,
              target_country: values.step1?.targetCountry || 'global',
              language: values.step1?.language || 'english',
              featured_media: values.step1?.featuredMedia || null,

              // Step 2 fields (updated values)
              article_type: values.step2?.articleType || null,
              article_size: values.step2?.articleSize || null,
              tone_of_voice: values.step2?.toneOfVoice || null,
              point_of_view: values.step2?.pointOfView || null,
              plagiat_removal: values.step2?.plagiaRemoval || false,
              include_cta: values.step2?.includeCta || undefined, // Optional field as backend hasn't implemented yet
              include_images: values.step2?.includeImages || false,
              include_videos: values.step2?.includeVideos || false,
              internal_links: values.step2?.internalLinks?.length ? JSON.stringify(values.step2.internalLinks) : null,
              external_links: values.step2?.externalLinks?.length ? JSON.stringify(values.step2.externalLinks) : null,

              // Content fields (preserve existing values)
              content: values.generatedHtml || '',
              toc: values.toc?.length ? JSON.stringify(values.toc) : null,
              images: values.images?.length ? JSON.stringify(values.images) : null,
              faq: values.faq?.length ? JSON.stringify(values.faq) : null,

              status: 'draft' as const,
            };

            await articleDraft.updateArticle(articleId, requestBody);
            onNextStep();
          } catch (error) {
            toast.error('Failed to save article. Please try again before proceeding.');
          }
        } else {
          // For new articles or other steps, just proceed without saving
          onNextStep();
        }
      }
    } else {
      toast.error("Please fill out all required fields before proceeding.");
    }
    } finally {
      // Always reset loading state
      setIsNextLoading(false);
    }
  };

  // Handle generation modal confirmation
  const handleGenerateConfirm = () => {
    setShowGenerationModal(false);
    // Trigger generation process
    if (onTriggerGeneration) {
      onTriggerGeneration();
    } else {
      // Fallback: just proceed to next step
      onNextStep();
    }
  };

  const handleGenerateCancel = () => {
    setShowGenerationModal(false);
    // Stay on current step
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
      sections: values.step3?.sections || [],
      generatedHtml: values.generatedHtml || ''
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

        {/* Center - Empty space for cleaner layout */}
        <Box />

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
              endIcon={<Iconify icon={isNextLoading ? "eos-icons:loading" : "eva:arrow-forward-fill"} />}
              sx={{
                borderRadius: '24px',
                minWidth: '120px',
              }}
              onClick={handleNext}
              disabled={isNextLoading} // ✅ Disable during loading
            >
              {isNextLoading ? 'Processing...' : 'Next'}
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
            formData={methods.getValues() as GenerateArticleFormData}
          />
          <PublishModal
            open={publishModalOpen}
            onClose={() => setPublishModalOpen(false)}
            articleId={articleId} // Pass the article ID to PublishModal
            articleInfo={getArticleData().articleInfo}
            sections={getArticleData().sections}
          />
        </>
      )}

      {/* Generation Confirmation Modal */}
      <Dialog
        open={showGenerationModal}
        onClose={handleGenerateCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('generate.modal.title', 'Generate Full Article?')}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center', px: 3, py: 2 }}>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, mb: 2 }}>
            {t('generate.modal.message', 'No content has been generated yet. Would you like to generate the full article now before proceeding to the next step?')}
          </Typography>

          {/* Credit consumption warning */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'warning.dark' : 'warning.light',
              border: `1px solid ${theme.palette.warning.main}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Iconify icon="mdi:alert-circle" sx={{ color: 'warning.main', flexShrink: 0 }} />
            <Typography variant="body2" color="warning.dark" sx={{ fontWeight: 500 }}>
              {t('generate.modal.creditWarning', 'This action will consume 5 regeneration credits from your account.')}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <Button
              onClick={handleGenerateCancel}
              variant="outlined"
              sx={{ flex: 1 }}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleGenerateConfirm}
              variant="contained"
              sx={{ flex: 1 }}
              startIcon={<Iconify icon="mdi:lightning-bolt" />}
            >
              {t('generate.modal.confirm', 'Generate Article')}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};
