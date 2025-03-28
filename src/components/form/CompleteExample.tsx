import React, { useState } from 'react';

import { Box, Grid, Stack, Button } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { SEODashboard } from './SEODashboard';
import { StepperComponent } from './FormStepper';
import { Step3Publish } from './steps/Step4Publish';
import { Step1ContentSetup } from './steps/Step1ContentSetup';
import { Step2ArticleSettings } from './steps/Step2ArticleSettings';
import { Step3ContentStructuring } from './steps/Step3ContentStructuring';
import { SectionItem } from './DraggableSectionList';

export function CompleteExample() {
  const [activeStep, setActiveStep] = useState(0);
  
  // Form state
  const [targetCountry, setTargetCountry] = useState('us');
  const [language, setLanguage] = useState('en-us');
  const [title, setTitle] = useState('');
  const [secondaryKeyword, setSecondaryKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>([]);
  const [contentDescription, setContentDescription] = useState('');

  // Steps configuration - Updated to 4 steps
  const steps = [
    { id: 1, label: "Content Setup" },
    { id: 2, label: "Article Settings" },
    { id: 3, label: "Content Structuring" },
    { id: 4, label: "Publish" }
  ];

  // Handle adding a secondary keyword
  const handleAddKeyword = () => {
    if (secondaryKeyword.trim() !== '') {
      setSecondaryKeywords([...secondaryKeywords, secondaryKeyword.trim()]);
      setSecondaryKeyword('');
    }
  };

  // Handle removing a secondary keyword
  const handleRemoveKeyword = (keyword: string) => {
    setSecondaryKeywords(secondaryKeywords.filter(k => k !== keyword));
  };

  // Handle Enter key press in secondary keyword field
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  // Navigation handlers
  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  
  // New state variables for generation features
  const [isTitleGenerated, setIsTitleGenerated] = useState(false);
  const [isMetaGenerated, setIsMetaGenerated] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [urlSlug, setUrlSlug] = useState('');
  
  // Generate title handler
  const handleGenerateTitle = () => {
    setIsGeneratingTitle(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setTitle('How to Optimize Your Website for Better SEO Performance');
      setIsGeneratingTitle(false);
      setIsTitleGenerated(true);
    }, 1500);
  };
  
  // Generate meta information handler
  const handleGenerateMeta = () => {
    setIsGeneratingMeta(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setMetaTitle('SEO Optimization Guide: Boost Your Website Performance');
      setMetaDescription('Learn proven strategies to optimize your website for search engines and improve your rankings with our comprehensive SEO guide.');
      setUrlSlug('seo-optimization-guide');
      setIsGeneratingMeta(false);
      setIsMetaGenerated(true);
    }, 2000);
  };
  
  // Regenerate title handler
  const handleRegenerateTitle = () => {
    setIsGeneratingTitle(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setTitle('10 Effective SEO Strategies to Improve Your Website Ranking');
      setIsGeneratingTitle(false);
    }, 1500);
  };
  
  // Regenerate meta information handler
  const handleRegenerateMeta = () => {
    setIsGeneratingMeta(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setMetaTitle('SEO Guide: 10 Ways to Boost Your Website Rankings');
      setMetaDescription('Discover 10 proven SEO techniques to improve your website visibility, drive more traffic, and achieve higher search engine rankings.');
      setUrlSlug('seo-guide-boost-rankings');
      setIsGeneratingMeta(false);
    }, 2000);
  };

    // Add state for storing the generated table of contents
    const [generatedSections, setGeneratedSections] = useState<SectionItem[]>([]);
  
    // Handle table of contents generation
    const handleGenerateTableOfContents = (tableOfContents: any) => {
      // Convert the table of contents format to the SectionItem format
      const sections = tableOfContents.sections.map((section: any, index: number) => ({
        id: section.id.toString(),
        title: section.title,
        content: section.content || '',
        status: 'Not Started',
        subsections: section.subsections 
          ? section.subsections.map((sub: any) => ({
              id: sub.id.toString(),
              title: sub.title,
              content: sub.content || '',
              status: 'Not Started'
            }))
          : []
      }));
      
      setGeneratedSections(sections);
    };
    

  // Render the current step content - Updated to include the new step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Step1ContentSetup
            primaryKeyword={primaryKeyword}
            setPrimaryKeyword={setPrimaryKeyword}
            title={title}
            setTitle={setTitle}
            secondaryKeyword={secondaryKeyword}
            setSecondaryKeyword={setSecondaryKeyword}
            secondaryKeywords={secondaryKeywords}
            setSecondaryKeywords={setSecondaryKeywords}
            targetCountry={targetCountry}
            setTargetCountry={setTargetCountry}
            language={language}
            setLanguage={setLanguage}
            handleAddKeyword={handleAddKeyword}
            handleRemoveKeyword={handleRemoveKeyword}
            handleKeyPress={handleKeyPress}
            handleGenerateMeta={handleGenerateMeta}
            handleGenerateTitle={handleGenerateTitle}
            handleRegenerateMeta={handleRegenerateMeta}
            handleRegenerateTitle={handleRegenerateTitle}
            isGeneratingMeta={isGeneratingMeta}
            isGeneratingTitle={isGeneratingTitle}
            isMetaGenerated={isMetaGenerated}
            isTitleGenerated={isTitleGenerated}
            metaDescription={metaDescription}
            metaTitle={metaTitle}
            setMetaDescription={setMetaDescription}
            setMetaTitle={setMetaTitle}
            setUrlSlug={setUrlSlug}
            urlSlug={urlSlug}
          />
        );
      // In the renderStepContent function, update the Step2ArticleSettings and Step3ContentStructuring components
      case 1:
        return (
          <Step2ArticleSettings 
            onNextStep={handleNext}
            onGenerateTableOfContents={handleGenerateTableOfContents}
          />
        );
      case 2:
        return (
          <Step3ContentStructuring 
            generatedSections={generatedSections}
          />
        );
      case 3:
        return <Step3Publish />;
      default:
        return null;
    }
  };

  // Determine if SEO Dashboard should be visible based on current step
  const isSEODashboardVisible = activeStep !== 1 && activeStep !== 3; // Hide in Article Settings and Publish steps

  return (
    <Box>
      {/* Stepper */}
      <StepperComponent steps={steps} activeStep={activeStep} />
      
      <Grid container spacing={3}>
        {/* Forms on the left */}
        <Grid item xs={12} md={isSEODashboardVisible ? 7 : 12} lg={isSEODashboardVisible ? 8 : 12}>
          {/* Navigation buttons at the top of the form section */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<Iconify icon="eva:arrow-back-fill" />}
                sx={{
                  minWidth: 100,
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                  borderRadius: '24px',
                  py: 1,
                  px: 3,
                  '&:hover': {
                    bgcolor: 'primary.lighter',
                  },
                  '&:disabled': {
                    bgcolor: 'grey.200',
                    color: 'grey.500'
                  }
                }}
              >
                Back
              </Button>
              
              {activeStep !== steps.length - 1 && (
                <Button
                  onClick={handleNext}
                  disabled={activeStep === steps.length - 1}
                  endIcon={<Iconify icon="eva:arrow-forward-fill" />}
                  sx={{
                    minWidth: 100,
                    bgcolor: 'primary.lighter',
                    color: 'primary.main',
                    borderRadius: '24px',
                    py: 1,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                    '&:disabled': {
                      bgcolor: 'grey.200',
                      color: 'grey.500'
                    }
                  }}
                >
                  Next
                </Button>
              )}
            </Stack>
          </Box>
          
          <Box sx={{ width: '100%' }}>
            {renderStepContent()}
          </Box>
        </Grid>
        
        {/* SEO Dashboard on the right - only visible on certain steps */}
        {isSEODashboardVisible && (
          <Grid item xs={12} md={5} lg={4}>
            <SEODashboard 
              title={title}
              metaTitle={metaTitle}
              metaDescription={metaDescription}
              urlSlug={urlSlug}
              currentStep={activeStep}
              isVisible={isSEODashboardVisible}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}