import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

// Layout components
import { Box, Button, Typography } from '@mui/material';

// Custom hooks
import { useRegenerationCheck } from 'src/hooks/useRegenerationCheck';

import { DashboardContent } from 'src/layouts/dashboard';

import { ConfirmDialog } from 'src/components/confirm-dialog';
import { LoadingAnimation } from 'src/components/generate-article/PublishingLoadingAnimation';

// Custom components
import { ContentLayout } from './components/ContentLayout';
import { StepNavigation } from './components/StepNavigation';
import { useContentGeneration } from './hooks/useContentGeneration';
// Custom hooks
import { useCriteriaEvaluation } from './hooks/useCriteriaEvaluation';
// Custom hook for form synchronization
import { useGenerateArticleForm } from './hooks/useGenerateArticleForm';
import { Step4Publish } from './generate-steps/steps/step-four-publish';
import { StepperComponent } from '../../components/generate-article/FormStepper';
// Step components
import { Step1ContentSetup } from './generate-steps/steps/step-one-content-setup';
import { Step2ArticleSettings } from './generate-steps/steps/step-two-article-settings';
import { Step3ContentStructuring } from './generate-steps/steps/step-three-content-structuring';

import type { GenerateArticleFormData } from './schemas';


export function GeneratingView() {
  const [activeStep, setActiveStep] = useState(0);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Initialize the main form
  const { methods } = useGenerateArticleForm();

  // Use the content generation hook with the form methods
  const contentGeneration = useContentGeneration(methods);

  const onSubmit = useCallback(async (data: GenerateArticleFormData) => {
    console.log("Form submitted:", data)
    // Return a resolved promise to ensure proper async handling
    return Promise.resolve();
  }, []);


  // Additional states
  const [isPublishing, setIsPublishing] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);

  // Get the isGeneratingSections state from the contentGeneration hook
  const { isGeneratingSections } = contentGeneration;

  // Use the regeneration check hook to check for available regenerations
  const {
    checkRegenerationCredits,
    regenerationsAvailable
  } = useRegenerationCheck();

  const steps = [
    { id: 1, label: "Content Setup" },
    { id: 2, label: "Article Settings" },
    { id: 3, label: "Content Structuring" },
    { id: 4, label: "Publish" }
  ];

  const handleNextStep = async () => {
    // Get the fields for the current step
    const currentStepFields = getFieldsForStep(activeStep)

    // Trigger validation for the current step's fields
    const isStepValid = await methods.trigger(currentStepFields as any)

    console.log(isStepValid , " is step valid ! " , activeStep);

    if (isStepValid) {
      const values = methods.getValues();

      if (activeStep === 0) {
        // Check for title and meta information in step 1
        if (!values.step1?.title) {
          toast.error("Please generate a title before proceeding");
        } else if (!values.step1?.metaTitle || !values.step1?.metaDescription) {
          toast.error("Please generate meta information before proceeding");
        }
      } else if (activeStep === 1) {
        // Check if table of contents has been generated in step 2
        if (!values.step3?.sections?.length) {
          toast.error("Please generate a table of contents before proceeding");
        }
      } else if (activeStep === 2) {
        // Check if sections have been generated before proceeding to step 3
        if (!values.step3?.sections?.length) {
          toast.error("Please generate sections before proceeding");
        }
      }
        if (activeStep === steps.length - 1) {
          // Final step - handle submission
          try {
            setIsPublishing(true);

            // Submit the form
            await methods.handleSubmit(async (data) => {
              try {
                // Execute the submission logic
                await onSubmit(data);
                // Wait for the publishing animation
                await new Promise(resolve => setTimeout(resolve, 2000));

                navigate('/blog');
              } catch (error) {
                toast.error('Failed to publish article');
              }
            })();
          } catch (error) {
            toast.error('Failed to process the form');
          } finally {
            setIsPublishing(false);
          }
        } else {
          // Not the final step, just move to the next step
          setActiveStep((prev) => prev + 1);
        }
    } 
  }

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
  }

  // Update the handleBack function to set the navigating back flag
  const handleBackWithFlag = useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);

  // Use the loading states and handler functions from the contentGeneration hook
  const {
    isGeneratingTitle,
    isGeneratingMeta,
    isGeneratingKeywords,
    isOptimizingDescription,
    handleGenerateTitle,
    handleGenerateMeta,
    handleGenerateSecondaryKeywords,
    handleOptimizeContentDescription
  } = contentGeneration;

  const onGenerateTableOfContents = useCallback(async () => {
    try {
      await contentGeneration.handleGenerateSections();
      setActiveStep(2);
    }
    catch (error) {
      toast.error('Failed to generate table of contents');
    }
    finally {
      setIsGenerated(true);
    }
  }, [contentGeneration, setIsGenerated]);


  const renderStepContent = () => {
    // Regular steps
    switch (activeStep) {
      case 0:
        return <Step1ContentSetup
                onGenerateTitle={handleGenerateTitle}
                onGenerateSecondaryKeywords={handleGenerateSecondaryKeywords}
                onOptimizeContentDescription={handleOptimizeContentDescription}
                onGenerateMeta={handleGenerateMeta}
                isGeneratingMeta={isGeneratingMeta}
                isGeneratingTitle={isGeneratingTitle}
                isGeneratingKeywords={isGeneratingKeywords}
                isOptimizingDescription={isOptimizingDescription}
              />;
      case 1:
        return <Step2ArticleSettings
                  isGenerated={isGenerated}
                  isGenerating={isGeneratingSections}
                  onGenerate={onGenerateTableOfContents}
                  onRegenerateRequest={handleRegenerateRequest}
                />;
      case 2:
        return <Step3ContentStructuring />;
      case 3:
        return <Step4Publish />;
      default:
        return null;
    }
  };

  const { evaluateAllCriteria } = useCriteriaEvaluation(methods)

    // Evaluate all criteria on initial load
  useEffect(() => {
    evaluateAllCriteria()
  }, [evaluateAllCriteria])


  // Handle regenerate request from Step2ArticleSettings
  const handleRegenerateRequest = useCallback(() => {
    // Show the regeneration confirmation dialog
    setShowRegenerateDialog(true);
  }, []);

  // Handle regenerate confirmation
  const handleRegenerateConfirm = useCallback(async () => {
    // Check if user has regeneration credits
    if (checkRegenerationCredits()) {
      // Close dialog and generate
      setShowRegenerateDialog(false);

      // Call the generate table of contents function
      if (activeStep === 1) {
        try {
          const success = await contentGeneration.handleGenerateSections();
          // Only set isGenerated to true if the generation was successful
          if (success) {
            setIsGenerated(true);
          }
        }
        catch (error) {
          console.error('Error generating table of contents:', error);
          toast.error('Failed to generate table of contents');
        }
      }
    } else {
      // If no credits, the checkRegenerationCredits function will show the no credits dialog
      setShowRegenerateDialog(false);
    }
  }, [activeStep, checkRegenerationCredits, contentGeneration, setIsGenerated]);

  return (
    <DashboardContent>
      {/* Pass the methods and our custom form sync context to FormProvider */}
      <FormProvider {...methods}>
        {/* Publishing animation overlay */}
        {isPublishing && (
          <LoadingAnimation message="Publishing your content..." />
        )}

        {/* Stepper */}
        <StepperComponent steps={steps} activeStep={activeStep} />

        <ContentLayout activeStep={activeStep} isGeneratingMeta={isGeneratingMeta} onGenerateMeta={handleGenerateMeta}>
          {renderStepContent()}
        </ContentLayout>

        {/* Navigation buttons */}
        <StepNavigation
          activeStep={activeStep}
          totalSteps={steps.length}
          onNext={handleNextStep}
          onBack={handleBackWithFlag}
        />

        {/* Regeneration Confirmation Dialog */}
        <ConfirmDialog
          open={showRegenerateDialog}
          onClose={() => setShowRegenerateDialog(false)}
          title={t('regenerate.confirmTitle', 'Confirm Regeneration')}
          content={
            <Box>
              <Typography variant="body1" paragraph>
                {t('regenerate.confirmMessage', 'Regenerating the table of contents will override your current sections and consume one regeneration credit from your balance.')}
              </Typography>
              <Typography variant="body2" color="warning.main">
                {t('regenerate.availableCredits', 'You have {{count}} regeneration credits available.', { count: regenerationsAvailable })}
              </Typography>
            </Box>
          }
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegenerateConfirm}
            >
              {t('regenerate.confirm', 'Regenerate')}
            </Button>
          }
        />
      </FormProvider>
    </DashboardContent>
  );
}
