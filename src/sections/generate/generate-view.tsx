import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

// Layout components

// Custom hooks

// Layout components
import { DashboardContent } from 'src/layouts/dashboard';

import { GenerateViewForm } from './generate-view-form';
// Custom components
import { StepNavigation } from './components/StepNavigation';
// Types
import { generateArticleSchema, type GenerateArticleFormData } from './schemas';
// Step components


export function GeneratingView() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const methods = useForm<GenerateArticleFormData>({
    resolver: zodResolver(generateArticleSchema) as any,
    defaultValues: {
      step1: {
        contentDescription: '',
        primaryKeyword: '',
        secondaryKeywords: [],
        language: 'en-us', // Default to English (US)
        targetCountry: 'us', // Default to United States
        title: '',
        metaTitle: '',
        metaDescription: '',
        urlSlug: '',
      },
      step2: {
        articleType: 'how-to',
        articleSize: 'small',
        toneOfVoice: 'friendly',
        pointOfView: 'first-person',
        aiContentCleaning: 'no-removal',
        imageSettingsQuality: 'high',
        imageSettingsPlacement: 'each-section',
        imageSettingsStyle: 'normal',
        imageSettingsCount: 2,
        internalLinking: 'none',
        externalLinking: 'none',
        includeVideos: false,
        numberOfVideos: 1,
      },
      step3: {
        sections: [],
      },
    },
  });

  const onSubmit = useCallback(async (data: GenerateArticleFormData) => {
    console.log("Form submitted:", data)
    // Return a resolved promise to ensure proper async handling
    navigate('/blog')
    return Promise.resolve();
  }, [navigate])

  const steps = [
    { id: 1, label: "Content Setup" },
    { id: 2, label: "Article Settings" },
    { id: 3, label: "Content Structuring" },
    { id: 4, label: "Publish" }
  ];

  const handleNextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, 4))
  }

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <DashboardContent>
      {/* Use the GenerateViewForm component */}
      <FormProvider {...methods}>
        <GenerateViewForm
          activeStep={activeStep}
          steps={steps}
          setActiveStep={setActiveStep}
        />
        {/* Navigation buttons with internal validation logic */}
        <StepNavigation
          activeStep={activeStep}
          totalSteps={steps.length}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
        />
      </FormProvider>
    </DashboardContent>
  );
}
