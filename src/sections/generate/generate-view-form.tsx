import { Box } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { Button, Typography } from '@mui/material';

import { useRegenerationCheck } from 'src/hooks/useRegenerationCheck';

import { ConfirmDialog } from 'src/components/confirm-dialog';
import { LoadingAnimation } from 'src/components/generate-article/PublishingLoadingAnimation';

// Custom components
import { ContentLayout } from './components/ContentLayout';
import {useCriteriaEvaluation} from './hooks/useCriteriaEvaluation';
import { Step4Publish } from './generate-steps/steps/step-four-publish';
import { StepperComponent } from '../../components/generate-article/FormStepper';
import { Step1ContentSetup } from './generate-steps/steps/step-one-content-setup';
import { Step2ArticleSettings } from './generate-steps/steps/step-two-article-settings';
import { Step3ContentStructuring } from './generate-steps/steps/step-three-content-structuring';

import type { ArticleSection, GenerateArticleFormData } from './schemas';


interface GenerateViewFormProps {
  activeStep: number;
  steps: { id: number; label: string }[];
  setActiveStep: (step: number) => void;
}

export function GenerateViewForm({
  activeStep,
  steps,
  setActiveStep
}: GenerateViewFormProps) {
  const { t } = useTranslation();
  const methods = useFormContext<GenerateArticleFormData>();

  const [generationState, setGenerationState] = useState({
    isGeneratingTitle: false,
    isGeneratingKeywords: false,
    isOptimizingDescription: false,
    isGeneratingMeta: false,
    isGeneratingSections: false,
    isPublishing: false,
    isGenerated: false,
    showRegenerateDialog: false,
  });

  const { evaluateCriteria} = useCriteriaEvaluation()

  const simulateDelay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleGenerateTitle = async () => {
    setGenerationState((s) => ({ ...s, isGeneratingTitle: true }));
    await simulateDelay(1000);
    console.log('Fake title generated');
    setGenerationState((s) => ({ ...s, isGeneratingTitle: false }));
    return "title"
  };

  const handleGenerateSecondaryKeywords = async () => {
    setGenerationState((s) => ({ ...s, isGeneratingKeywords: true }));
    await simulateDelay(1000);
    console.log('Fake keywords generated');
    setGenerationState((s) => ({ ...s, isGeneratingKeywords: false }));
  };

  const handleOptimizeContentDescription = async () => {
    setGenerationState((s) => ({ ...s, isOptimizingDescription: true }));
    await simulateDelay(1000);
    console.log('Fake description optimized');
    setGenerationState((s) => ({ ...s, isOptimizingDescription: false }));
  };

  const handleGenerateMeta = async () => {
    setGenerationState((s) => ({ ...s, isGeneratingMeta: true }));
    await simulateDelay(1000);
    setGenerationState((s) => ({ ...s, isGeneratingMeta: false }));
    return {
      metaTitle: "meta title",
      metaDescription: "meta description",
      urlSlug: "url slug"
    }
  };

  const onGenerateTableOfContents = useCallback(async () => {
    setGenerationState((s) => ({ ...s, isGeneratingSections: true }));

    // Generate mock sections
    const sections = [
      {
        id: 'section-1',
        title: 'Introduction',
        status: 'completed'
      },
      {
        id: 'section-2',
        title: 'What is SEO?',
        status: 'completed'
      },
      {
        id: 'section-3',
        title: 'Why is SEO Important?',
        status: 'completed'
      }
    ] as ArticleSection[];

    // Save the sections to the form state
    methods.setValue('step3.sections', sections);

    // Wait for 6 seconds to ensure the animation completes
    // The animation takes 5.5 seconds to complete
    await simulateDelay(6000);

    console.log('Fake table of contents generated');

    // Only set isGeneratingSections to false after the animation has had time to complete
    setGenerationState((s) => ({ ...s, isGeneratingSections: false, isGenerated: true }));

    return sections;
  }, [methods]);

  const handleRegenerateRequest = () => {
    setGenerationState((s) => ({ ...s, showRegenerateDialog: true }));
  };


  // Use the regeneration check hook to check for available regenerations
  const {
    checkRegenerationCredits,
    regenerationsAvailable
  } = useRegenerationCheck();


  // Handle regenerate confirmation
  const handleRegenerateConfirm = useCallback(async () => {
    // Check if user has regeneration credits
    if (checkRegenerationCredits()) {
      // Close dialog and generate
      setGenerationState((s) => ({ ...s, showRegenerateDialog: false }));

      // Call the generate table of contents function
      if (activeStep === 1) {
        try {
          await onGenerateTableOfContents();
        }
        catch (error) {
          console.error('Failed to generate table of contents:', error);
        }
      }
    } else {
      // If no credits, the checkRegenerationCredits function will show the no credits dialog
      setGenerationState((s) => ({ ...s, showRegenerateDialog: false }));
    }
  }, [activeStep, checkRegenerationCredits, onGenerateTableOfContents]);


    const renderStepContent = () => {
        // Regular steps
        switch (activeStep) {
        case 0:
          return <Step1ContentSetup
                    evaluateCriteria={evaluateCriteria}
                    onGenerateTitle={handleGenerateTitle}
                    onGenerateSecondaryKeywords={handleGenerateSecondaryKeywords}
                    onOptimizeContentDescription={handleOptimizeContentDescription}
                    onGenerateMeta={handleGenerateMeta}
                    isGeneratingMeta={generationState.isGeneratingMeta}
                    isGeneratingTitle={generationState.isGeneratingTitle}
                    isGeneratingKeywords={generationState.isGeneratingKeywords}
                    isOptimizingDescription={generationState.isOptimizingDescription}
                />;
        case 1:
          return <Step2ArticleSettings
                    isGenerated={generationState.isGenerated}
                    isGenerating={generationState.isGeneratingSections}
                    onGenerate={onGenerateTableOfContents}
                    onRegenerateRequest={handleRegenerateRequest}
                    setActiveStep={setActiveStep}
                    />;
        case 2:
          return <Step3ContentStructuring />;
        case 3:
          return <Step4Publish />;
        default:
          return null;
        }
    };

  return (
    <>
      {/* Publishing animation overlay */}
      {generationState.isPublishing && (
        <LoadingAnimation message={t('publishing.message', 'Publishing your content...')} />
      )}

      {/* Stepper */}
      <StepperComponent steps={steps} activeStep={activeStep} />

      {/* Content layout with children */}
      <ContentLayout
        activeStep={activeStep}
        isGeneratingMeta={generationState.isGeneratingMeta}
        onGenerateMeta={handleGenerateMeta}
      >
        {renderStepContent()}
      </ContentLayout>
      <ConfirmDialog
          open={generationState.showRegenerateDialog}
          onClose={() => {
            setGenerationState((s) => ({ ...s, showRegenerateDialog: false }));
          }}
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
    </>
  );
}

export default GenerateViewForm;
