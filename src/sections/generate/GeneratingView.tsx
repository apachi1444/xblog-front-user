import type { SectionItem } from 'src/components/generate-article/DraggableSectionList';

import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
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
import { SectionGenerationAnimation } from 'src/components/generate-article/SectionGenerationAnimation';

import { step1Schema, generateArticleSchema } from './schemas';
import { Step4Publish } from './generate-steps/steps/Step4Publish';
import { SectionEditorScreen } from './edit-section/SectionEditorScreen';
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

  const { setValue, watch, trigger } = step1Form;

  // Watch the value properly
  const primaryKeyword = watch('primaryKeyword') || "";
  const language = watch('language');
  const targetCountry = watch('targetCountry');
  const contentDescription = watch('contentDescription');
  const secondaryKeywords = watch('secondaryKeywords');

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
  const [sections, setSections] = useState<SectionItem[]>([]);

  // Handlers for generation
  const handleGenerateTitle = async () => {
    setIsGeneratingTitle(true);
    try {
      if(!primaryKeyword || !language || !targetCountry || !contentDescription || !secondaryKeywords){
        trigger(['primaryKeyword', 'language', 'targetCountry', 'contentDescription','secondaryKeywords']);
        toast.error('Please fill in all required fields before generating a title');
        setIsGeneratingTitle(false);
        return;
      }

      // Generate title
      const generatedTitle = `Best ${primaryKeyword} Guide for ${targetCountry}`;

      // Update form values
      setValue('title', generatedTitle);
      setIsTitleGenerated(true);

      // Log success
      console.log('Title generated successfully:', generatedTitle);
    } catch (error) {
      console.error('Error generating title:', error);
      toast.error('Failed to generate title');
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handleGenerateMeta = async () => {
    setIsGeneratingMeta(true);
    try {
      if(!primaryKeyword || !language || !targetCountry || !contentDescription || !secondaryKeywords){
        trigger(['primaryKeyword', 'language', 'targetCountry', 'contentDescription','secondaryKeywords']);
        toast.error('Please fill in all required fields before generating meta information');
        setIsGeneratingMeta(false);
        return;
      }

      // Call API to generate meta information
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

      // Update form values
      setValue('metaTitle', metaData.metaTitle);
      setValue('metaDescription', metaData.metaDescription);
      setValue('urlSlug', metaData.urlSlug);
      setIsMetaGenerated(true);

      // Log success
      console.log('Meta information generated successfully:', metaData);
    } catch (error) {
      console.error('Error generating meta information:', error);

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

      if(!primaryKeyword || !language || !targetCountry){
        trigger(['primaryKeyword', 'language', 'targetCountry', 'contentDescription','secondaryKeywords']);
        return;
      }

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

      await new Promise(resolve => setTimeout(resolve, 6000));

      try {
        const response = await generateSections({
          title,
          keyword: primaryKeyword
        }).unwrap();

        if (response.sections) {
          const formattedSections = response.sections.map(section => ({
            id: section.id,
            title: section.title,
            content: section.content || '',
            status: 'Not Started' as const,
            description: section.content || ''
          }));

          setGeneratedSections(formattedSections);
          toast.success('Table of contents generated successfully');

          handleNext();
        }
      } catch (apiError) {
        toast.error('Failed to generate table of contents');
      }
    } catch (error) {
      toast.error('Failed to generate table of contents');
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

  // Sync sections with generatedSections
  useEffect(() => {
    if (generatedSections.length > 0) {
      console.log('Syncing sections with generatedSections:', generatedSections);
      setSections(generatedSections);
    }
  }, [generatedSections]);

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

        // Check if title and meta information have been generated
        if (isStepValid) {
          if (!isTitleGenerated) {
            toast.error('Please generate a title before proceeding');
            isStepValid = false;
          } else if (!isMetaGenerated) {
            toast.error('Please generate meta information before proceeding');
            isStepValid = false;
          }
        }
        break;

      case 1:
        isStepValid = true;
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
    } else if (!(activeStep === 0 && (!isTitleGenerated || !isMetaGenerated))) {
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
            isGeneratingSections={isGeneratingSections}
          />
        );
      case 2:
        if (isEditingSection) {
          return (
            <SectionEditorScreen
              section={sections.find(s => s.id === currentEditSection) || null}
              onSave={(updatedSection) => {
                console.log('Saving updated section in GeneratingView:', updatedSection);

                // Update both sections and generatedSections to ensure consistency
                setSections(prevSections =>
                  prevSections.map(section =>
                    section.id === updatedSection.id ? updatedSection : section
                  )
                );

                setGeneratedSections(prevSections =>
                  prevSections.map(section =>
                    section.id === updatedSection.id ? updatedSection : section
                  )
                );

                setIsEditingSection(false);
                setCurrentEditSection(null);
              }}
              onCancel={handleReturnFromEditing}
            />
          );
        }
        return (
          <Step3ContentStructuring
            generatedSections={generatedSections}
            onSaveAllSections={setSections}
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
    console.log('Editing section:', section);

    // Make sure the section exists in our sections array
    const sectionExists = sections.some(s => s.id === section.id);

    if (!sectionExists) {
      // If the section doesn't exist in our sections array, add it
      console.log('Section not found in sections array, adding it');
      setSections(prevSections => [...prevSections, section]);
    }

    // Set the current edit section ID
    setCurrentEditSection(section.id);
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
                  defaultTab={activeStep === 0 ? 0 : 1} // Preview SEO for Step 1, Real-time Scoring for Step 3
                />
              </Box>
            )}
          </Box>
        </form>
      </FormProvider>
    </DashboardContent>
  );
}
