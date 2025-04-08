import React, { useState } from 'react';

import { Box, Button } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { RecentPromptsAndDrafts } from 'src/sections/generate/view/RecentPromptsAndDrafts';

import { SEODashboard } from './SEODashboard';
import { StepperComponent } from './FormStepper';
import { Step4Publish } from './steps/Step4Publish';
import { Step1ContentSetup } from './steps/Step1ContentSetup';
import { Step2ArticleSettings } from './steps/Step2ArticleSettings';
import { Step3ContentStructuring } from './steps/Step3ContentStructuring';

import type { SectionItem } from './DraggableSectionList';

export function GeneratingView() {
  const [activeStep, setActiveStep] = useState(0);
  // Add state for SEO dashboard collapse
  const [isSEODashboardCollapsed, setIsSEODashboardCollapsed] = useState(false);
  
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

  // Define button placement configuration for each step
  const stepButtonsConfig = [
    { position: 'bottom' }, // Step 1: Content Setup
    { position: 'top' },    // Step 2: Article Settings
    { position: 'top' },    // Step 3: Content Structuring
    { position: 'top' }     // Step 4: Publish
  ];
  
  // Navigation handlers
  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };
  
  // Render navigation buttons based on position
  const renderNavigationButtons = (position: string) => {
    // Only render if current step's button position matches
    if (stepButtonsConfig[activeStep].position !== position) {
      return null;
    }

    const isNextButtonDisabled = activeStep === steps.length - 1
    const isPreviousButtonDisabled = activeStep === 0
    
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mt: position === 'bottom' ? 4 : 0,
          mb: position === 'top' ? 4 : 0,
          pt: position === 'bottom' ? 3 : 0,
          pb: position === 'top' ? 3 : 0,
          borderTop: position === 'bottom' ? '1px solid' : 'none',
          borderBottom: position === 'top' ? '1px solid' : 'none',
          borderColor: 'divider',
        }}
      >
        <Box>
          {!isPreviousButtonDisabled && (
            <Button
              variant="outlined"
              onClick={handleBack}
              startIcon={<Iconify icon="eva:arrow-back-fill" />}
              sx={{ px: 3 }}
            >
              Back
            </Button>
          )}
        </Box>

        <Box>
          {!isNextButtonDisabled && (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<Iconify icon="eva:arrow-forward-fill" />}
              sx={{ px: 3 }}
            >
              {activeStep === steps.length - 2 ? 'Finish' : 'Next'}
            </Button>
          )}
        </Box>
      </Box>
    );
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
            contentDescription={contentDescription}
            setContentDescription={setContentDescription}
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
        return <Step4Publish />;
      default:
        return null;
    }
  };

  // Determine if SEO Dashboard should be visible based on current step
  const isSEODashboardVisible = activeStep !== 1 && activeStep !== 3; // Hide in Article Settings and Publish steps

  // Handle SEO dashboard collapse state change
  const handleSEODashboardCollapseChange = (collapsed: boolean) => {
    setIsSEODashboardCollapsed(!collapsed);
  };

  // Determine button position based on current step
  const getButtonPosition = () => {
    switch (activeStep) {
      case 0: // Content Setup
        return 'bottom';
      case 1: // Article Settings
        return 'top';
      case 2: // Content Structuring
        return 'bottom';
      case 3: // Publish
        return 'top';
      default:
        return 'bottom';
    }
  };

  const mockPrompts = [
    { id: '1', title: 'Presentation of React Native', timestamp: '1 minute ago' },
    { id: '2', title: 'SEO Optimization Tips', timestamp: '2 days ago' },
  ];
  
  const mockDrafts = [
    { id: '1', title: 'React Native vs React', status: 'Draft' },
    { id: '2', title: 'Understanding SEO', status: 'Draft' },
  ];

  return (
    <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
      {/* Stepper */}
      <StepperComponent steps={steps} activeStep={activeStep} />
      
      {/* Top Navigation Buttons (if configured for this step) */}
      {getButtonPosition() === 'top' && renderNavigationButtons('top')}
      
      <Box sx={{ display: 'flex', width: '100%' }}>
        {/* Forms on the left - adjust width based on SEO dashboard visibility and collapse state */}
        <Box 
          sx={{ 
            flexGrow: 1,
            width: isSEODashboardVisible ? 
              (isSEODashboardCollapsed ? 'calc(100% - 40px)' : '70%') : 
              '100%',
            transition: (theme) => theme.transitions.create(['width'], {
              duration: theme.transitions.duration.standard,
            }),
            pr: isSEODashboardVisible ? 2 : 0
          }}
        >
          {/* Remove the existing navigation buttons here since we're using renderNavigationButtons */}
          
          <Box sx={{ width: '100%' }}>
            {renderStepContent()}
          </Box>
          
          {/* Bottom Navigation Buttons (if configured for this step) */}
          {getButtonPosition() === 'bottom' && renderNavigationButtons('bottom')}
        </Box>
        
        {/* SEO Dashboard on the right - only visible on certain steps */}
        {isSEODashboardVisible && (
          <Box 
            sx={{ 
              width: isSEODashboardCollapsed ? '40px' : '30%',
              transition: (theme) => theme.transitions.create(['width'], {
                duration: theme.transitions.duration.standard,
              }),
            }}
          >
            <SEODashboard 
              title={title}
              metaTitle={metaTitle}
              metaDescription={metaDescription}
              onGenerateMeta={handleGenerateMeta}
              urlSlug={urlSlug}
              currentStep={activeStep}
              isVisible
              onCollapseChange={handleSEODashboardCollapseChange}
            />
          </Box>
        )}
      </Box>
      <RecentPromptsAndDrafts prompts={mockPrompts} drafts={mockDrafts} />
    </Box>
  );
}