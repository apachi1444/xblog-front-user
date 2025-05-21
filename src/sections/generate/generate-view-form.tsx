import { Box } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Typography } from '@mui/material';

import { useRegenerationCheck } from 'src/hooks/useRegenerationCheck';

import { ConfirmDialog } from 'src/components/confirm-dialog';
import { LoadingAnimation } from 'src/components/generate-article/PublishingLoadingAnimation';

// Custom components
import { ContentLayout } from './components/ContentLayout';
import { Step4Publish } from './generate-steps/steps/step-four-publish';
import { StepperComponent } from '../../components/generate-article/FormStepper';
import { Step1ContentSetup } from './generate-steps/steps/step-one-content-setup';
import { Step2ArticleSettings } from './generate-steps/steps/step-two-article-settings';
import { Step3ContentStructuring } from './generate-steps/steps/step-three-content-structuring';

import type { CriteriaState } from './hooks/useCriteriaEvaluation';

interface GenerateViewFormProps {
  activeStep: number;
  steps: { id: number; label: string }[];
  criteriaState: CriteriaState;
  totalScore: number;
  evaluateCriteria: (inputKey: string, value :any) => void;
  evaluateAllCriteria: () => void;
}

export function GenerateViewForm({
  activeStep,
  steps,
  criteriaState,
  totalScore,
  evaluateCriteria,
  evaluateAllCriteria,
}: GenerateViewFormProps) {
  const { t } = useTranslation();

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

  const simulateDelay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleGenerateTitle = async () => {
    setGenerationState((s) => ({ ...s, isGeneratingTitle: true }));
    await simulateDelay(1000);
    console.log('Fake title generated');
    setGenerationState((s) => ({ ...s, isGeneratingTitle: false }));
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
    console.log('Fake meta generated');
    setGenerationState((s) => ({ ...s, isGeneratingMeta: false }));
  };

  const onGenerateTableOfContents = useCallback(async () => {
  }, []);

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
          onGenerateTableOfContents()
        }
        catch (error) {
          toast.error('Failed to generate table of contents');
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
