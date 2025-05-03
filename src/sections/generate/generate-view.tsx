// Types

import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

// Layout components
import { DashboardContent } from 'src/layouts/dashboard';

import { LoadingAnimation } from 'src/components/generate-article/PublishingLoadingAnimation';

// Custom components
import { ContentLayout } from './components/ContentLayout';
import { StepNavigation } from './components/StepNavigation';
// Custom hooks
import { useContentSetupForm } from './hooks/useContentSetupForm';
import { useArticleSettingsForm } from './hooks/useArticleSettingsForm';
import { useGenerateArticleForm } from './hooks/useGenerateArticleForm';
import { Step4Publish } from './generate-steps/steps/step-four-publish';
import { SectionEditorScreen } from './edit-section/SectionEditorScreen';
import { useContentStructuringForm } from './hooks/useContentStructuringForm';
import { StepperComponent } from '../../components/generate-article/FormStepper';
// Step components
import { Step1ContentSetup } from './generate-steps/steps/step-one-content-setup';
import { Step2ArticleSettings } from './generate-steps/steps/step-two-article-settings';
import { Step3ContentStructuring } from './generate-steps/steps/step-three-content-structuring';

import type { Step1State } from './generate-steps/steps/step-one-content-setup';
import type { Step2State } from './generate-steps/steps/step-two-article-settings';
import type { Step3State } from './generate-steps/steps/step-three-content-structuring';

export function GeneratingView() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  // Additional states
  const [isPublishing, setIsPublishing] = useState(false);

  // Initialize the main form
  const { methods } = useGenerateArticleForm();

  const {
    step1Form,
    generationState,
    handleGenerateTitle,
    handleGenerateMeta,
    handleGenerateSecondaryKeywords,
    handleAddKeyword,
    handleDeleteKeyword,
  } = useContentSetupForm();

  const { step2Form } = useArticleSettingsForm();

  const {
    sections: generatedSections,
    isGenerating: isGeneratingSections,
    isGenerated,
    editDialogOpen,
    handleGenerateTableOfContents,
    handleSaveSection,
    handleEditSection,
    handleCancelSectionChanges
  } = useContentStructuringForm();

  const steps = [
    { id: 1, label: "Content Setup" },
    { id: 2, label: "Article Settings" },
    { id: 3, label: "Content Structuring" },
    { id: 4, label: "Publish" }
  ];

  // Navigation handlers
  const handleNext = useCallback(async () => {
    let isStepValid = false;

    switch (activeStep) {
      case 0:
        // Step 1: Content Setup validation
        isStepValid = await step1Form.trigger([
          'contentDescription',
          'primaryKeyword',
          'secondaryKeywords',
          'language',
          'targetCountry'
        ]);

        if (isStepValid) {
          if (!generationState.title.isGenerated) {
            toast.error('Please generate a title before proceeding');
            isStepValid = false;
          } else if (!generationState.meta.isGenerated) {
            toast.error('Please generate meta information before proceeding');
            isStepValid = false;
          }
        }
        break;

      case 1:
        isStepValid = await step2Form.trigger();

        // Check if table of contents has been generated
        if (isStepValid && !isGenerated) {
          toast.error('Please generate a table of contents before proceeding');
          isStepValid = false;
        }
        break;

      case 2:
        isStepValid = true;
        break;

      case 3:
        isStepValid = true;
        break;

      default:
        isStepValid = false;
    }

    if (isStepValid) {
      if (activeStep === steps.length - 1) {
        try {
          setIsPublishing(true);
          await new Promise(resolve => setTimeout(resolve, 3000));
          navigate('/blog');
        } catch (error) {
          toast.error('Failed to generate article');
        } finally {
          setIsPublishing(false);
        }
      } else {
        setActiveStep((prev) => prev + 1);
      }
    } else if (!(activeStep === 0 && (!generationState.title.isGenerated || !generationState.meta.isGenerated))) {
      toast.error('Please fill in all required fields for this step');
    }
  }, [activeStep, generationState.meta.isGenerated, generationState.title.isGenerated, isGenerated, navigate, setActiveStep, setIsPublishing, step1Form, step2Form, steps.length]);

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  useEffect(() => {
    if (isGenerated && !isGeneratingSections && generatedSections.length > 0) {
      if (activeStep === 1) {
        setTimeout(() => {
          handleNext();        
        }, 4000);

      }
    }
  }, [isGenerated, isGeneratingSections, generatedSections, activeStep, handleNext]);

  const step1State: Step1State = {
    form: step1Form,
    generation: {
      title: {
        isGenerating: generationState.title.isGenerating,
        isGenerated: generationState.title.isGenerated,
        onGenerate: handleGenerateTitle,
      },
      meta: {
        isGenerating: generationState.meta.isGenerating,
        isGenerated: generationState.meta.isGenerated,
        onGenerate: handleGenerateMeta,
      },
      secondaryKeywords: {
        isGenerating: generationState.secondaryKeywords.isGenerating,
        onGenerate: handleGenerateSecondaryKeywords,
        handleAddKeyword,
        handleDeleteKeyword,
      },
    },
  };

  const step2State: Step2State = {
    form: step2Form,
    generation: {
      tableOfContents: {
        isGenerating: isGeneratingSections,
        isGenerated,
        onGenerate: async () => {
          await handleGenerateTableOfContents(step1Form.getValues().title || 'Topic');
        },
      }
    },
  };

  const step3State: Step3State = {
    tableOfContents: {
      generatedSections,
      onSaveSection: handleSaveSection,
      onEditSection: handleEditSection,
    }
  };


  const renderStepContent = () => {
    if (activeStep === 2 && editDialogOpen) {
      return (
        <SectionEditorScreen
          section={generatedSections.at(0)}
          onSave={(updatedSection) => {
            handleSaveSection(updatedSection);
          }}
          onCancel={() => {
            handleCancelSectionChanges();
          }}
        />
      );
    }

    // Regular steps
    switch (activeStep) {
      case 0:
        return <Step1ContentSetup state={step1State} />;
      case 1:
        return <Step2ArticleSettings state={step2State} />;
      case 2:
        return <Step3ContentStructuring state={step3State} />;
      case 3:
        return <Step4Publish />;
      default:
        return null;
    }
  };

  const submitSteppedForm = async (data: any) => {
    try {
      console.log('Submitting form data:', data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <DashboardContent>
      <FormProvider {...methods}>
        {/* Publishing animation overlay */}
        {isPublishing && (
          <LoadingAnimation message="Publishing your content..." />
        )}

        {/* Stepper */}
        <StepperComponent steps={steps} activeStep={activeStep} />

        {/* Navigation buttons */}
        <StepNavigation
          activeStep={activeStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onBack={handleBack}
        />

        <form onSubmit={methods.handleSubmit(submitSteppedForm)}>
          <ContentLayout activeStep={activeStep} state={step1State}>
            {renderStepContent()}
          </ContentLayout>
        </form>
      </FormProvider>
    </DashboardContent>
  );
}
