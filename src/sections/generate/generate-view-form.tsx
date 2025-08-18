
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { useRef, useState, useEffect, useCallback } from 'react';

import { Button } from '@mui/material';

import { useRegenerationCheck } from 'src/hooks/useRegenerationCheck';

import { useTitleGeneration } from 'src/utils/generation/titleGeneration';
import { useKeywordGeneration } from 'src/utils/generation/keywordsGeneration';
import { useMetaTagsGeneration } from 'src/utils/generation/metaTagsGeneration';

import { useGenerateTopicMutation } from 'src/services/apis/generateContentApi';

import { ConfirmDialog } from 'src/components/confirm-dialog';
import { LoadingAnimation } from 'src/components/generate-article/PublishingLoadingAnimation';
import { SectionGenerationAnimation } from 'src/components/generate-article/SectionGenerationAnimation';

// Custom components
import { ContentLayout } from './components/ContentLayout';
import {useCriteriaEvaluation} from './hooks/useCriteriaEvaluation';
import { Step4Publish } from './generate-steps/steps/step-three-publish';
import { StepperComponent } from '../../components/generate-article/FormStepper';
import { Step1ContentSetup } from './generate-steps/steps/step-one-content-setup';
import { Step2ArticleSettings } from './generate-steps/steps/step-two-article-settings';

import type { GenerateArticleFormData } from './schemas';


interface GenerateViewFormProps {
  activeStep: number;
  steps: { id: number; label: string }[];
  setActiveStep: (step: number) => void;
  onGenerationTrigger?: (triggerFunction: () => void) => void; // Callback to expose generation function
  articleId?: string | null; // Article ID for updating after generation
}

export function GenerateViewForm({
  activeStep,
  steps,
  setActiveStep,
  onGenerationTrigger,
  articleId
}: GenerateViewFormProps) {
  const { t } = useTranslation();
  const methods = useFormContext<GenerateArticleFormData>();

  // Generation hooks
  const { generateSecondaryKeywords } = useKeywordGeneration();
  const { generateArticleTitle } = useTitleGeneration();
  const { generateMetaTags } = useMetaTagsGeneration();
  const [generateTopic] = useGenerateTopicMutation();

  const [generationState, setGenerationState] = useState({
    isGeneratingTitle: false,
    isGeneratingKeywords: false,
    isOptimizingDescription: false,
    isGeneratingMeta: false,
    isGeneratingSections: false,
    isPublishing: false,
    isGenerated: false,
    showRegenerateDialog: false,
    showFirstTimeGenerationDialog: false, // ✅ Add first-time generation dialog
  });

  const { evaluateCriteria} = useCriteriaEvaluation()

  // Feedback modal handlers


  // Store reference to generation function to avoid infinite loops
  const generationFunctionRef = useRef<(() => Promise<any[]>) | null>(null);



  const handleGenerateTitle = async () => {
    setGenerationState((s) => ({ ...s, isGeneratingTitle: true }));

    try {
      const formData = methods.getValues();
      const { primaryKeyword, secondaryKeywords, contentDescription, language } = formData.step1;

      if (!primaryKeyword) {
        console.error('No primary keyword provided for title generation');
        return '';
      }

      console.log('📝 Generating title with language:', { primaryKeyword, language, secondaryKeywords, contentDescription });

      // Call the real API with language support
      const generatedTitle = await generateArticleTitle(
        primaryKeyword,
        secondaryKeywords || [],
        contentDescription || '',
        language || 'english'
      );

      if (generatedTitle) {
        console.log('✅ Generated title:', generatedTitle);

        // Note: Subscription cache will be invalidated at the end of generation process

        return generatedTitle;
      }
        console.warn('⚠️ No title generated, using fallback');
        return `Complete Guide to ${primaryKeyword}`;
      
    } catch (error) {
      console.error('❌ Error generating title:', error);
      // Fallback title
      const formData = methods.getValues();
      const primaryKeyword = formData.step1?.primaryKeyword;
      return primaryKeyword ? `Complete Guide to ${primaryKeyword}` : 'Untitled Article';
    } finally {
      setGenerationState((s) => ({ ...s, isGeneratingTitle: false }));
    }
  };

  const handleGenerateSecondaryKeywords = async () => {
    setGenerationState((s) => ({ ...s, isGeneratingKeywords: true }));

    try {
      const formData = methods.getValues();
      const primaryKeyword = formData.step1?.primaryKeyword;
      const language = formData.step1?.language || 'english';

      if (!primaryKeyword) {
        console.error('No primary keyword provided for secondary keywords generation');
        return;
      }

      console.log('🔑 Generating secondary keywords for:', { primaryKeyword, language });

      // Call the real API with language parameter
      const generatedKeywords = await generateSecondaryKeywords(primaryKeyword, language);

      if (generatedKeywords && generatedKeywords.length > 0) {
        // Update the form with generated keywords
        methods.setValue('step1.secondaryKeywords', generatedKeywords, { shouldValidate: true });
        console.log('✅ Generated secondary keywords:', generatedKeywords);

        // Note: Subscription cache will be invalidated at the end of generation process
      } else {
        // Fallback keywords if API fails
        const fallbackKeywords = [
          `${primaryKeyword} guide`,
          `${primaryKeyword} tips`,
          `${primaryKeyword} tutorial`,
          `${primaryKeyword} basics`,
          `${primaryKeyword} strategies`
        ];
        methods.setValue('step1.secondaryKeywords', fallbackKeywords, { shouldValidate: true });
      }
    } catch (error) {
      // Fallback on error
      const formData = methods.getValues();
      const primaryKeyword = formData.step1?.primaryKeyword;
      if (primaryKeyword) {
        const fallbackKeywords = [
          `${primaryKeyword} guide`,
          `${primaryKeyword} tips`,
          `${primaryKeyword} tutorial`
        ];
        methods.setValue('step1.secondaryKeywords', fallbackKeywords, { shouldValidate: true });
      }
    } finally {
      setGenerationState((s) => ({ ...s, isGeneratingKeywords: false }));
    }
  };

  const handleOptimizeContentDescription = async () => {
    setGenerationState((s) => ({ ...s, isOptimizingDescription: true }));

    try {
      const formData = methods.getValues();
      const { primaryKeyword, language } = formData.step1;

      // If no primary keyword, show error and return
      if (!primaryKeyword) {
        toast.error('Please enter a primary keyword first before optimizing content description.');
        return;
      }

      // Call the actual generate-topic API for content optimization
      // If no content description exists, the API will generate one from scratch
      const result = await generateTopic({
        primary_keyword: primaryKeyword,
        secondary_keywords: formData.step1.secondaryKeywords || [],
        language: language || 'english'
      }).unwrap();

      const optimizedContent = result.content; // Extract content from response

      // Update the form field with optimized content
      methods.setValue('step1.contentDescription', optimizedContent, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Trigger criteria evaluation for the updated content description
      setTimeout(() => {
        evaluateCriteria('contentDescription', optimizedContent);
      }, 100);

      // Note: Subscription cache will be invalidated at the end of generation process

    } catch (error) {
      toast.error('Failed to optimize content description. Please try again.');
    } finally {
      setGenerationState((s) => ({ ...s, isOptimizingDescription: false }));
    }
  };

  const handleGenerateMeta = async () => {
    setGenerationState((s) => ({ ...s, isGeneratingMeta: true }));

    try {
      const formData = methods.getValues();
      const { primaryKeyword, secondaryKeywords, contentDescription, title, language } = formData.step1;

      if (!primaryKeyword || !title) {
        console.error('Missing required fields for meta generation:', { primaryKeyword, title });
        return {
          metaTitle: '',
          metaDescription: '',
          urlSlug: ''
        };
      }
      // Call the real API with language support
      const generatedMeta = await generateMetaTags(
        primaryKeyword,
        secondaryKeywords || [],
        contentDescription || '',
        title,
        language || 'english'
      );

      if (generatedMeta) {
        console.log('✅ Generated meta tags:', generatedMeta);

        // Note: Subscription cache will be invalidated at the end of generation process

        return {
          metaTitle: generatedMeta.metaTitle,
          metaDescription: generatedMeta.metaDescription,
          urlSlug: generatedMeta.urlSlug
        };
      }
        return {
          metaTitle: `${title} | Complete Guide`,
          metaDescription: `Learn everything about ${primaryKeyword}. ${contentDescription || 'Comprehensive guide with expert tips and strategies.'}`,
          urlSlug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        };
      
    } catch (error) {
      // Fallback meta tags
      const formData = methods.getValues();
      const { primaryKeyword, title } = formData.step1;
      return {
        metaTitle: title ? `${title} | Guide` : `${primaryKeyword} Guide`,
        metaDescription: `Complete guide about ${primaryKeyword}. Learn tips, strategies, and best practices.`,
        urlSlug: (title || primaryKeyword || 'article').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      };
    } finally {
      setGenerationState((s) => ({ ...s, isGeneratingMeta: false }));
    }
  };

  const onGenerateTableOfContents = useCallback(async (): Promise<any[]> => new Promise<any[]>((resolve, reject) => {
      setGenerationState((s) => ({
        ...s,
        isGeneratingSections: true,
        failedStep: '',
        showRetryUI: false,
        completedSteps: []
      }));

      // Store the resolve/reject functions to be called by the animation modal
      (window as any).__generationPromise = { resolve, reject };
    }), []);

  // Update the ref whenever the function changes
  useEffect(() => {
    generationFunctionRef.current = onGenerateTableOfContents;
  }, [onGenerateTableOfContents]);

  const handleRegenerateRequest = () => {
    setGenerationState((s) => ({ ...s, showRegenerateDialog: true }));
  };

  // Handle first-time generation request (show confirmation dialog)
  const handleFirstTimeGenerationRequest = () => {
    setGenerationState((s) => ({ ...s, showFirstTimeGenerationDialog: true }));
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

  // Handle first-time generation confirmation
  const handleFirstTimeGenerationConfirm = useCallback(async () => {
    // Check if user has regeneration credits (5 required for full generation)
    if (checkRegenerationCredits()) {
      // Close dialog and generate
      setGenerationState((s) => ({ ...s, showFirstTimeGenerationDialog: false }));

      // Call the generate table of contents function
      if (activeStep === 1) {
        try {
          await onGenerateTableOfContents();
        } catch (error) {
          console.error('Failed to generate table of contents:', error);
        }
      }
    } else {
      // If no credits, the checkRegenerationCredits function will show the no credits dialog
      setGenerationState((s) => ({ ...s, showFirstTimeGenerationDialog: false }));
    }
  }, [activeStep, checkRegenerationCredits, onGenerateTableOfContents]);

  // Expose generation function to parent component
  useEffect(() => {
    if (onGenerationTrigger && generationFunctionRef.current) {
      onGenerationTrigger(generationFunctionRef.current);
    }
  }, [onGenerationTrigger]);

  // Handle generation error from animation modal
  const handleGenerationError = useCallback((error: string, failedStep: string, completedSteps: string[]) => {
    setGenerationState((s) => ({
      ...s,
      isGeneratingSections: false,
      failedStep,
      completedSteps,
      showRetryUI: true
    }));

    // Reject the promise if it exists
    if ((window as any).__generationPromise?.reject) {
      (window as any).__generationPromise.reject(new Error(error));
      delete (window as any).__generationPromise;
    }
  }, []);

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
                    onGenerate={onGenerateTableOfContents} // ✅ Actual generation function for fallback
                    onRegenerateRequest={handleRegenerateRequest}
                    onFirstTimeGenerationRequest={handleFirstTimeGenerationRequest} // ✅ Show confirmation dialog for first-time generation
                    setActiveStep={setActiveStep}
                    />;
        case 2:
          return <Step4Publish
            articleId={articleId}
            setActiveStep={setActiveStep}
          />;
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

      {/* Section generation animation modal */}
      <SectionGenerationAnimation
        articleId={articleId}
        show={generationState.isGeneratingSections}
        onComplete={() => {
          setGenerationState((s) => ({
            ...s,
            isGeneratingSections: false,
            isGenerated: true
          }));
          setTimeout(() => {
            setActiveStep(2);
          }, 500);
        }}
        onError={handleGenerationError}
        onClose={() => setGenerationState(prev => ({ ...prev, isGeneratingSections: false }))}
      />

      {/* Stepper - Hide in step 4 for full immersion */}
      {activeStep !== 3 && (
        <StepperComponent steps={steps} activeStep={activeStep} />
      )}

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
          count={regenerationsAvailable}
          requiredCredits={5} // ✅ Show that 5 credits will be consumed
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegenerateConfirm}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4
                }
              }}
            >
              {t('regenerate.confirm', 'Regenerate')}
            </Button>
          }
        />

      {/* First-time generation confirmation dialog */}
      <ConfirmDialog
          open={generationState.showFirstTimeGenerationDialog}
          onClose={() => {
            setGenerationState((s) => ({ ...s, showFirstTimeGenerationDialog: false }));
          }}
          title={t('generate.confirmTitle', 'Generate Full Article?')}
          count={regenerationsAvailable}
          requiredCredits={5} // ✅ Show that 5 credits will be consumed
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={handleFirstTimeGenerationConfirm}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4
                }
              }}
            >
              {t('generate.confirm', 'Generate Article')}
            </Button>
          }
        />


    </>
  );
}

export default GenerateViewForm;
