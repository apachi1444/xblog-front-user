import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { Button } from '@mui/material';

import { useRegenerationCheck } from 'src/hooks/useRegenerationCheck';

import { useTitleGeneration } from 'src/utils/generation/titleGeneration';
import { useKeywordGeneration } from 'src/utils/generation/keywordsGeneration';
import { useMetaTagsGeneration } from 'src/utils/generation/metaTagsGeneration';

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

  // Generation hooks
  const { generateSecondaryKeywords } = useKeywordGeneration();
  const { generateArticleTitle } = useTitleGeneration();
  const { generateMetaTags } = useMetaTagsGeneration();

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
      } else {
        console.warn('⚠️ No keywords generated, using fallback');
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
      console.error('❌ Error generating secondary keywords:', error);
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
    await simulateDelay(1000);
    console.log('Fake description optimized');
    setGenerationState((s) => ({ ...s, isOptimizingDescription: false }));
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

      console.log('🏷️ Generating meta tags with language:', { primaryKeyword, language, title, contentDescription });

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
        return {
          metaTitle: generatedMeta.metaTitle,
          metaDescription: generatedMeta.metaDescription,
          urlSlug: generatedMeta.urlSlug
        };
      } 
        console.warn('⚠️ No meta tags generated, using fallback');
        return {
          metaTitle: `${title} | Complete Guide`,
          metaDescription: `Learn everything about ${primaryKeyword}. ${contentDescription || 'Comprehensive guide with expert tips and strategies.'}`,
          urlSlug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        };
      
    } catch (error) {
      console.error('❌ Error generating meta tags:', error);
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
          count={regenerationsAvailable}
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
