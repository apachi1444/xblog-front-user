import type { SectionItem } from 'src/components/form/DraggableSectionList';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Box, Button } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { SEODashboard } from 'src/components/form/SEODashboard';
import { FormStepper } from 'src/components/stepper/FormStepper';
import { Step4Publish } from 'src/components/form/steps/Step4Publish';
import { Step1ContentSetup } from 'src/components/form/steps/Step1ContentSetup';
import { Step2ArticleSettings } from 'src/components/form/steps/Step2ArticleSettings';
import { Step3ContentStructuring } from 'src/components/form/steps/Step3ContentStructuring';

export function GenerateStepView() {
  const { stepId } = useParams();
  const navigate = useNavigate();
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
  
  // New state variables for generation features
  const [isTitleGenerated, setIsTitleGenerated] = useState(false);
  const [isMetaGenerated, setIsMetaGenerated] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [urlSlug, setUrlSlug] = useState('');
  
  // Add state for storing the generated table of contents
  const [generatedSections, setGeneratedSections] = useState<SectionItem[]>([]);

  // Steps configuration
  const steps = [
    { id: 1, label: "Content Setup" },
    { id: 2, label: "Article Settings" },
    { id: 3, label: "Content Structuring" },
    { id: 4, label: "Publish" }
  ];

  // Parse step ID from URL and set active step - improved validation
  useEffect(() => {
    const parsedStepId = parseInt(stepId || '1', 10);
    
    // Validate step ID with proper error handling
    if (parsedStepId < 1 || parsedStepId > steps.length || Number.isNaN(parsedStepId)) {
      // If invalid, redirect to the first step
      navigate('/generate/step/1', { replace: true });
      return;
    }
    
    // Set the active step (0-based index)
    setActiveStep(parsedStepId - 1);
  }, [stepId, navigate, steps.length]);

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
  
  // Navigation handlers with route-based navigation
  const handleNext = () => {
    const nextStep = activeStep + 1;
    if (nextStep < steps.length) {
      navigate(`/generate/step/${nextStep + 1}`);
    }
  };

  const handleBack = () => {
    const prevStep = activeStep - 1;
    if (prevStep >= 0) {
      navigate(`/generate/step/${prevStep + 1}`);
    }
  };
  
  // Render navigation buttons based on position
  const renderNavigationButtons = (position: string) => {
    // Only render if current step's button position matches
    if (stepButtonsConfig[activeStep].position !== position) {
      return null;
    }

    const isNextButtonDisabled = activeStep === steps.length - 1;
    const isPreviousButtonDisabled = activeStep === 0;
    
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

  // Render the appropriate step content
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
            onNextStep={handleNext}
          />
        );
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
            onNextStep={handleNext}
          />
        );
      case 3:
        return <Step4Publish />;
      default:
        return <div>Unknown step</div>;
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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Stepper */}
      <FormStepper 
        steps={steps.map(step => step.label)} 
        activeStep={activeStep} 
        title="Create Your Article" 
        baseUrl="/generate"
      />
      
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
    </Box>
  );
}