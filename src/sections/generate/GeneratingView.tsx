import type { SectionItem } from 'src/components/generate-article/DraggableSectionList';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import { Box, Button, useTheme } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
// api
import { 
  useGenerateMetaMutation, 
  useGenerateTitleMutation,
  useGenerateKeywordsMutation,
  useGenerateSectionsMutation,
} from 'src/services/apis/generateContentApi';

import { Iconify } from 'src/components/iconify';
import { SEODashboard } from 'src/components/generate-article/SEODashboard';
import { LoadingAnimation } from 'src/components/generate-article/PublishingLoadingAnimation';

import SectionEditor from './edit-section/section-editor';
import { step1Schema, generateArticleSchema } from './schemas';
import { Step4Publish } from './generate-steps/steps/Step4Publish';
import { Step1ContentSetup } from './generate-steps/steps/Step1ContentSetup';
import { StepperComponent } from '../../components/generate-article/FormStepper';
import { Step2ArticleSettings } from './generate-steps/steps/Step2ArticleSettings';
import { Step3ContentStructuring } from './generate-steps/steps/Step3ContentStructuring';

import type { Step1FormData, GenerateArticleFormData } from './schemas';
import type { Step1State } from './generate-steps/steps/Step1ContentSetup';

export function GeneratingView() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  
  // API mutations
  const [generateTitle] = useGenerateTitleMutation();
  const [generateMeta] = useGenerateMetaMutation();
  const [generateKeywords] = useGenerateKeywordsMutation();
  const [generateSections] = useGenerateSectionsMutation();

  // Form setup
  const methods = useForm<GenerateArticleFormData>({
    resolver: zodResolver(generateArticleSchema),
  });

  const step1Form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      contentDescription: '',
      primaryKeyword: '',
      secondaryKeywords: [],
      language: '',
      targetCountry: '',
      title: '',
      metaTitle: '',
      metaDescription: '',
      urlSlug: '',
    },
  });

  const { setValue, watch } = step1Form;

  // Watch the value properly
  const primaryKeyword = watch('primaryKeyword');
  const language = watch('language');
  const targetCountry = watch('targetCountry');

  // Generation states
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);
  const [isTitleGenerated, setIsTitleGenerated] = useState(false);
  const [isMetaGenerated, setIsMetaGenerated] = useState(false);
  const [isGeneratingSecondaryKeywords, setIsGeneratingSecondaryKeywords] = useState(false);
  const [isGeneratingSections, setIsGeneratingSections] = useState(false);

  // Additional states needed
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSEODashboardCollapsed, setIsSEODashboardCollapsed] = useState(false);
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [currentEditSection, setCurrentEditSection] = useState<string | null>(null);
  const [generatedSections, setGeneratedSections] = useState<SectionItem[]>([]);

  // Handlers for generation
  const handleGenerateTitle = async () => {
    setIsGeneratingTitle(true);
    try {
      const { data } = await generateTitle({
        primaryKeyword,
        language,
        targetCountry,
      });
      console.log(data , "title");
      const title = data?.title || `Best ${primaryKeyword} Guide for ${targetCountry}`;
      setValue('title', title);
      setIsTitleGenerated(true);
    } catch (error) {
      toast.error('Generated title with fallback data');
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handleGenerateMeta = async () => {
    setIsGeneratingMeta(true);
    try {
      const { data } = await generateMeta({
        title: step1Form.getValues('title') || "",
        primaryKeyword,
        language,
      });
      
      // Fallback data if API fails
      const metaData = data || {
        metaTitle: `${primaryKeyword} - Complete Guide ${new Date().getFullYear()}`,
        metaDescription: `Learn everything about ${primaryKeyword}. Comprehensive guide with tips, examples, and best practices for ${targetCountry}.`,
        urlSlug: primaryKeyword.toLowerCase().replace(/\s+/g, '-'),
      };
      
      setValue('metaTitle', metaData.metaTitle);
      setValue('metaDescription', metaData.metaDescription);
      setValue('urlSlug', metaData.urlSlug);
      setIsMetaGenerated(true);
    } catch (error) {
      // Use fallback data on error
      const fallbackMeta = {
        metaTitle: `${primaryKeyword} - Complete Guide ${new Date().getFullYear()}`,
        metaDescription: `Learn everything about ${primaryKeyword}. Comprehensive guide with tips, examples, and best practices for ${targetCountry}.`,
        urlSlug: primaryKeyword.toLowerCase().replace(/\s+/g, '-'),
      };
      setValue('metaTitle', fallbackMeta.metaTitle);
      setValue('metaDescription', fallbackMeta.metaDescription);
      setValue('urlSlug', fallbackMeta.urlSlug);
      setIsMetaGenerated(true);
      toast.success('Generated meta with fallback data');
    } finally {
      setIsGeneratingMeta(false);
    }
  };

  const handleGenerateSecondaryKeywords = async () => {
    setIsGeneratingSecondaryKeywords(true);
    try {
      const { data } = await generateKeywords({
        primaryKeyword,
        language,
        targetCountry,
      });

      const keywords = data?.keywords || [
        `${primaryKeyword} guide`, 
        `best ${primaryKeyword}`, 
        `${primaryKeyword} tips`,
        `${primaryKeyword} tutorial`,
        `${primaryKeyword} examples`,
        `${primaryKeyword} for beginners`,
        `professional ${primaryKeyword}`,
        `${primaryKeyword} ${new Date().getFullYear()}`
      ];
      
      setValue('secondaryKeywords', keywords);
    } catch (error) {
      // Fallback keywords
      const fallbackKeywords = [
        `${primaryKeyword} guide`, 
        `best ${primaryKeyword}`, 
        `${primaryKeyword} tips`,
        `${primaryKeyword} tutorial`,
        `${primaryKeyword} examples`,
        `${primaryKeyword} for beginners`,
        `professional ${primaryKeyword}`,
        `${primaryKeyword} ${new Date().getFullYear()}`
      ];
      setValue('secondaryKeywords', fallbackKeywords);
      toast.success('Generated keywords with fallback data');
    } finally {
      setIsGeneratingSecondaryKeywords(false);
    }
  };

  const handleGenerateTableOfContents = async () => {
    try {
      setIsGeneratingSections(true);      
      const title = step1Form.watch("title") ?? "";
      const response = await generateSections({
        title,
        keyword: primaryKeyword
      }).unwrap();

      if (response.sections) {
        // Convert the sections to match SectionItem interface
        const formattedSections = response.sections.map(section => ({
          id: section.id,
          title: section.title,
          content: section.content || '',
          status: 'Not Started' as const,
          description: section.content || ''
        }));

        setGeneratedSections(formattedSections);
        toast.success('Table of contents generated successfully');
        handleNext(); // Move to next step
      }
    } catch (error) {
      toast.error('Failed to generate table of contents');
      console.error('Section generation error:', error);
    } finally {
      setIsGeneratingSections(false);
    }
  };


  const steps = [
    { id: 1, label: "Content Setup" },
    { id: 2, label: "Article Settings" },
    { id: 3, label: "Content Structuring" },
    { id: 4, label: "Publish" }
  ];

  // Navigation handlers
  const handleNext = async () => {
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
        break;

      case 1:
        // Step 2: Article Settings validation
        // For now, let's assume it's valid since we haven't implemented its form yet
        isStepValid = true;
        break;

      case 2:
        // Step 3: Content Structuring validation
        // For now, let's assume it's valid since we haven't implemented its form yet
        isStepValid = true;
        break;

      case 3:
        // Step 4: Publishing - no validation needed
        isStepValid = true;
        break;

      default:
        isStepValid = false;
    }

    if (isStepValid) {
      if (activeStep === steps.length - 1) {
        try {
          setIsPublishing(true);
          // Add timeout to simulate processing
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
    } else {
      toast.error('Please fill in all required fields for this step');
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Create a function to handle adding keywords
  const handleAddKeyword = () => {
    // Implementation for adding keywords
    console.log('Add keyword');
  };

  // Create a function to handle deleting keywords
  const handleDeleteKeyword = (keyword: string) => {
    const currentKeywords = step1Form.getValues('secondaryKeywords');
    const updatedKeywords = currentKeywords.filter(k => k !== keyword);
    setValue('secondaryKeywords', updatedKeywords);
  };

  const step1State: Step1State = {
    form: step1Form,
    generation: {
      title: {
        isGenerating: isGeneratingTitle,
        isGenerated: isTitleGenerated,
        onGenerate: handleGenerateTitle,
      },
      meta: {
        isGenerating: isGeneratingMeta,
        isGenerated: isMetaGenerated,
        onGenerate: handleGenerateMeta,
      },
      secondaryKeywords: {
        isGenerating: isGeneratingSecondaryKeywords,
        onGenerate: handleGenerateSecondaryKeywords,
        handleAddKeyword,
        handleDeleteKeyword,
      },
    },
  };

  const renderStepContent = () => {
    // Regular steps
    switch (activeStep) {
      case 0:
        return (
          <Step1ContentSetup state={step1State} />
        );
      case 1:
        return (
          <Step2ArticleSettings 
            onNextStep={handleNext}
            onGenerateTableOfContents={handleGenerateTableOfContents}
          />
        );
      case 2:
        if (isEditingSection && currentEditSection) {
          return (
            <Box>
              <Button
                startIcon={<Iconify icon="eva:arrow-back-fill" />}
                onClick={handleReturnFromEditing}
                sx={{ mb: 2 }}
              >
                Back to Sections
              </Button>
              
              <SectionEditor />
            </Box>
          );
        } 
        return (
          <Step3ContentStructuring 
            generatedSections={generatedSections}
            onEditSection={handleEditSection}
          />
        );
      case 3:
        return <Step4Publish />;
      default:
        return null;
    }
  };

  const isSEODashboardVisible = activeStep !== 1 && activeStep !== 3; // Hide in Article Settings and Publish steps

  // Additional handlers
  const handleSEODashboardCollapseChange = (collapsed: boolean) => {
    setIsSEODashboardCollapsed(collapsed);
  };

  const handleEditSection = (section: SectionItem) => {
    setIsEditingSection(true);
  };

  const handleReturnFromEditing = () => {
    setIsEditingSection(false);
    setCurrentEditSection(null);
  };

  async function submitSteppedForm(data: GenerateArticleFormData) {
    try {
      // Perform your form submission logic here
      console.log('data', data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }

  return (
    <DashboardContent>
      {/* IMPORTANT: Wrap everything with the step1Form FormProvider instead of methods */}
      <FormProvider {...step1Form}>
        {/* Publishing animation overlay */}
        {isPublishing && (
          <LoadingAnimation message="Publishing your content..." />
        )}
        
        {/* Stepper */}
        <StepperComponent steps={steps} activeStep={activeStep} />

        {/* Fixed Next Button at the bottom */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            py: 2,
            px: 3,
            bgcolor: 'background.paper',
            borderTop: `1px solid ${theme.palette.divider}`,
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'space-between',
            width: 'calc(100% - 245px)',
            ml: '245px',
          }}
        >
          <Box>
            {activeStep > 0 ? (
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:arrow-back-fill" />}
                sx={{ 
                  borderRadius: '24px',
                  minWidth: '120px', // Increased width
                }}
                onClick={handleBack}
              >
                Previous
              </Button>
            ) : (
              null
            )}
          </Box>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                endIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                sx={{ 
                  borderRadius: '24px',
                  bgcolor: 'success.main',
                  minWidth: '180px', // Increased width
                  px: 3, // Add more horizontal padding
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
                  minWidth: '120px', // Increased width
                }}
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
        
        <form onSubmit={methods.handleSubmit(submitSteppedForm)}>
          <Box sx={{ display: 'flex', width: '100%' }}>
            {/* Forms on the left - adjust width based on SEO dashboard visibility and collapse state */}
            <Box 
              sx={{ 
                flexGrow: 1,
                width: isSEODashboardVisible ? 
                  (isSEODashboardCollapsed ? 'calc(100% - 40px)' : '70%') : 
                  '100%',
                transition: () => theme.transitions.create(['width'], {
                  duration: theme.transitions.duration.standard,
                }),
                pr: isSEODashboardVisible ? 2 : 0
              }}
            >          
              <Box sx={{ width: '100%' }}>
                {renderStepContent()}
              </Box>
            </Box>
            
            {/* SEO Dashboard on the right - only visible on certain steps */}
            {isSEODashboardVisible && (
              <Box 
                sx={{ 
                  width: isSEODashboardCollapsed ? '40px' : '30%',
                  transition: () => theme.transitions.create(['width'], {
                    duration: theme.transitions.duration.standard,
                  }),
                }}
              >
                <SEODashboard 
                  state={step1State}
                />
              </Box>
            )}
          </Box>
        </form>
      </FormProvider>
    </DashboardContent>
  );
}
