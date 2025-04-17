import axios from 'axios';
import React, { useState } from 'react';

import { useTheme } from '@mui/material/styles';
import { Box , Grid, Stack, Button, Tooltip, Typography, CircularProgress } from '@mui/material';

import { Iconify } from 'src/components/iconify'; // Add axios import for API calls
import { FormInput } from '../FormInput';
import { FormDropdown } from '../FormDropdown';
import { FormContainer } from '../FormContainer'; // Import Tooltip

interface Step1Props {
  primaryKeyword: string;
  setPrimaryKeyword: (value: string) => void;
  secondaryKeyword: string;
  setSecondaryKeyword: (value: string) => void;
  secondaryKeywords: string[];
  setSecondaryKeywords: (keywords: string[]) => void;
  targetCountry: string;
  setTargetCountry: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  handleAddKeyword: () => void;
  handleRemoveKeyword: (keyword: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  // New props
  isTitleGenerated: boolean;
  isMetaGenerated: boolean;
  isGeneratingTitle: boolean;
  isGeneratingMeta: boolean;
  metaTitle: string;
  title: string;
  metaDescription: string;
  urlSlug: string;
  setTitle: (value: string) => void;
  setMetaTitle: (value: string) => void;
  setMetaDescription: (value: string) => void;
  setUrlSlug: (value: string) => void;
  handleGenerateTitle: () => void;
  handleGenerateMeta: () => void;
  handleRegenerateTitle: () => void;
  handleRegenerateMeta: () => void;
  contentDescription: string;
  setContentDescription: (value: string) => void;
  onNextStep?: () => void;
  handleGenerateSecondaryKeywords?: () => void; // Make this optional since we'll implement it internally
  isGeneratingSecondaryKeywords?: boolean; // Make this optional since we'll track it internally
}

export function Step1ContentSetup({
  primaryKeyword,
  title,
  setTitle,
  setPrimaryKeyword,
  secondaryKeyword,
  setSecondaryKeyword,
  secondaryKeywords,
  setSecondaryKeywords,
  targetCountry,
  setTargetCountry,
  language,
  setLanguage,
  handleAddKeyword,
  handleRemoveKeyword,
  handleKeyPress,
  // New props
  isTitleGenerated,
  isMetaGenerated,
  isGeneratingTitle,
  isGeneratingMeta,
  metaTitle,
  metaDescription,
  urlSlug,
  setMetaTitle,
  setMetaDescription,
  setUrlSlug,
  handleGenerateTitle,
  handleGenerateMeta,
  handleRegenerateTitle,
  handleRegenerateMeta,
  // Added props
  contentDescription,
  setContentDescription,
  onNextStep,
  handleGenerateSecondaryKeywords, // Keep this prop for backward compatibility
  isGeneratingSecondaryKeywords: externalIsGeneratingSecondaryKeywords, // Rename to avoid conflict
}: Step1Props) {
  const theme = useTheme();
  
  // Add state for field validation errors
  const [errors, setErrors] = useState({
    contentDescription: false,
    primaryKeyword: false,
    secondaryKeywords: false
  });
  
  // Add internal state for secondary keywords generation
  const [isGeneratingSecondaryKeywords, setIsGeneratingSecondaryKeywords] = useState(false);
  
  // Update error states when input values change
  React.useEffect(() => {
    setErrors(prev => ({
      ...prev,
      contentDescription: contentDescription ? false : prev.contentDescription
    }));
  }, [contentDescription]);
  
  React.useEffect(() => {
    setErrors(prev => ({
      ...prev,
      primaryKeyword: primaryKeyword ? false : prev.primaryKeyword
    }));
  }, [primaryKeyword]);
  
  React.useEffect(() => {
    setErrors(prev => ({
      ...prev,
      secondaryKeywords: secondaryKeywords.length > 0 ? false : prev.secondaryKeywords
    }));
  }, [secondaryKeywords]);
  
  // Validation function
  const validateFields = () => {
    const newErrors = {
      contentDescription: !contentDescription,
      primaryKeyword: !primaryKeyword,
      secondaryKeywords: secondaryKeywords.length === 0
    };
    
    setErrors(newErrors);
    
    // Return true if all fields are valid
    return !Object.values(newErrors).some(error => error);
  };
  
  // Wrap the generate handlers with validation
  const handleGenerateTitleWithValidation = () => {
    if (validateFields()) {
      handleGenerateTitle();
    }
  };
  
  const handleGenerateMetaWithValidation = () => {
    if (validateFields()) {
      handleGenerateMeta();
    }
  };
  
  // Implement the secondary keywords generation function
  const generateSecondaryKeywords = async () => {
    // Use the external handler if provided
    if (handleGenerateSecondaryKeywords) {
      handleGenerateSecondaryKeywords();
      return;
    }
    
    // Otherwise, implement our own logic
    setIsGeneratingSecondaryKeywords(true);
    
    try {
      // Simulate a slight delay for smoother animation (remove if using real API)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Example API call - replace with your actual API endpoint
      const response = await axios.post('/api/generate-keywords', {
        primaryKeyword,
        language,
        targetCountry
      });
      
      // Update the secondary keywords with the response
      if (response.data) {
        // Handle different possible response structures
        let keywords = [];
        
        if (Array.isArray(response.data)) {
          // If response.data is directly an array
          keywords = response.data;
        } else if (response.data.keywords && Array.isArray(response.data.keywords)) {
          // If response.data has a keywords property that is an array
          keywords = response.data.keywords;
        } else if (typeof response.data === 'object') {
          // If response.data is an object with other structure
          // Try to extract any array or convert object values to array
          const possibleKeywords = Object.values(response.data).find(val => Array.isArray(val));
          if (possibleKeywords) {
            keywords = possibleKeywords;
          } else {
            // As a fallback, if we can't find an array, create one from the response
            keywords = Object.values(response.data)
              .filter(val => typeof val === 'string')
              .map(val => val.toString());
          }
        }
        
        // Filter out any empty strings and ensure unique values
        const validKeywords = [...new Set(keywords.filter(k => k && typeof k === 'string' && k.trim() !== ''))];
        
        if (validKeywords.length > 0) {
          // Use the setter function to update the state
          setSecondaryKeywords(validKeywords);
        } else {
          // Fallback with some default keywords based on the primary keyword
          const fallbackKeywords = [
            `${primaryKeyword} guide`, 
            `best ${primaryKeyword}`, 
            `${primaryKeyword} tips`,
            `${primaryKeyword} tutorial`,
            `${primaryKeyword} examples`
          ];
          setSecondaryKeywords(fallbackKeywords);
        }
      } else {
        // If no data is returned, use fallback keywords
        const fallbackKeywords = [
          `${primaryKeyword} guide`, 
          `best ${primaryKeyword}`, 
          `${primaryKeyword} tips`,
          `${primaryKeyword} tutorial`,
          `${primaryKeyword} examples`
        ];
        setSecondaryKeywords(fallbackKeywords);
      }
    } catch (error) {
      console.error('Error generating secondary keywords:', error);
      // Fallback with some default keywords based on the primary keyword
      const fallbackKeywords = [
        `${primaryKeyword} guide`, 
        `best ${primaryKeyword}`, 
        `${primaryKeyword} tips`,
        `${primaryKeyword} tutorial`,
        `${primaryKeyword} examples`
      ];
      setSecondaryKeywords(fallbackKeywords);
    } finally {
      // Add a small delay before removing the loading state for smoother transition
      setTimeout(() => {
        setIsGeneratingSecondaryKeywords(false);
      }, 300);
    }
  };
  
  // New handler for generating secondary keywords with validation
  const handleGenerateSecondaryKeywordsWithValidation = () => {
    // Only need primary keyword for this action
    const primaryKeywordValid = !!primaryKeyword;
    setErrors(prev => ({ ...prev, primaryKeyword: !primaryKeywordValid }));

    if (primaryKeywordValid) {
      console.log('Generating secondary keywords for:', primaryKeyword);
      generateSecondaryKeywords();
    }
  };
  
  // Data for country options
  const countries = [
    { value: "us", label: "English (US)" },
    { value: "uk", label: "English (UK)"},
    { value: "fr", label: "French" }
  ];

  // Data for language options
  const languages = [
    { value: "en-us", label: "English (US)" },
    { value: "en-gb", label: "English (UK)" },
    { value: "fr-fr", label: "French"}
  ];

  // Determine which loading state to use
  const isLoadingSecondaryKeywords = externalIsGeneratingSecondaryKeywords || isGeneratingSecondaryKeywords;

  return (
    <Grid container spacing={1}>
    
      {/* Language & Region section */}
      <Grid item xs={12}>
        <FormContainer title="Language & Region">
          <FormDropdown
            label="Language"
            options={languages}
            tooltipText="Select the language for your content"
            placeholder="Select language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as string)}
          />
          
          <FormDropdown
            label="Target Country"
            options={countries}
            tooltipText="Select the target country for your content"
            placeholder="Select country"
            value={targetCountry}
            onChange={(e) => setTargetCountry(e.target.value as string)}
          />
        </FormContainer>
      </Grid>
      
      {/* Keywords section */}
      <Grid item xs={12} sx={{ mt: -2 }}>
        {/* Increased negative margin from -1 to -2 */}
        <FormContainer title="Keywords" layout="column">
          <Box sx={{ width: '100%' }}>
            <FormInput
              label="Primary Keyword"
              tooltipText="Enter the main keyword for your content"
              placeholder="Enter primary keyword"
              value={primaryKeyword}
              onChange={(e) => setPrimaryKeyword(e.target.value)}
              fullWidth
              error={errors.primaryKeyword}
              helperText={errors.primaryKeyword ? "Primary keyword is required" : ""}
            />
          </Box>
          
          {/* Secondary Keywords */}
          <Box sx={{ width: '100%' }}>  
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}> {/* Changed alignItems */}
              <FormInput
                label='Secondary Keywords'
                placeholder="Add secondary keywords manually or generate with AI" // Updated placeholder
                tooltipText='Add relevant secondary keywords to improve SEO ranking' // Updated tooltip
                value={secondaryKeyword}
                onChange={(e) => setSecondaryKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                fullWidth
                error={errors.secondaryKeywords && secondaryKeywords.length === 0} // Show error only if empty and touched
                helperText={errors.secondaryKeywords && secondaryKeywords.length === 0 ? "Add or generate at least one secondary keyword" : ""} // Updated helper text
                sx={{ flexGrow: 1 }}
                endComponent={
                  <Tooltip title="Add keyword manually">
                  <Box 
                    onClick={handleAddKeyword}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      width: theme.spacing(6.25),
                      height: theme.spacing(6.25),
                      borderRadius: theme.shape.borderRadius / 6,
                      cursor: 'pointer',
                      flexShrink: 0, // Prevent shrinking
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      }
                    }}
                  >
                    <Box component="span" sx={{ fontSize: theme.typography.pxToRem(18), fontWeight: 'bold' }}>+</Box>
                  </Box>
                </Tooltip> 
                }
              />
            </Box>

            {/* AI Suggestion Button - Conditionally Rendered */}
            {primaryKeyword && (secondaryKeywords.length === 0 || isLoadingSecondaryKeywords) && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1, minHeight: theme.spacing(4) }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={handleGenerateSecondaryKeywordsWithValidation}
                  disabled={isLoadingSecondaryKeywords}
                  startIcon={
                    isLoadingSecondaryKeywords ? 
                    <CircularProgress 
                      size={16} 
                      color="inherit" 
                      sx={{ 
                        animation: 'spin 1.2s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' }
                        }
                      }} 
                    /> : 
                    <Iconify icon="eva:sparkle-fill" width={16} />
                  }
                  sx={{ 
                    borderRadius: theme.spacing(3),
                    borderColor : theme.palette.secondary.dark,
                    textTransform: 'none',
                    fontSize: theme.typography.pxToRem(12),
                    transition: 'all 0.3s ease',
                    opacity: isLoadingSecondaryKeywords ? 0.8 : 1,
                    color: theme.palette.secondary.dark,
                    '&:hover': {
                      color: theme.palette.secondary.dark,
                    },
                  }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'inherit',
                      fontWeight: 500
                    }}
                  >
                    {isLoadingSecondaryKeywords ? 'Generating Suggestions...' : 'Generate Suggestions with AI'}
                  </Typography>
                </Button>
              </Box>
            )}
            
            {/* Display secondary keywords as chips */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1, 
                mt: 1.5,
                minHeight: secondaryKeywords.length > 0 ? 'auto' : 0,
                maxHeight: secondaryKeywords.length > 0 ? '200px' : 0,
                opacity: secondaryKeywords.length > 0 ? 1 : 0,
                overflow: 'auto',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {secondaryKeywords.map((keyword, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: theme.palette.primary.lighter,
                    color: theme.palette.primary.dark,
                    borderRadius: theme.shape.borderRadius * 2,
                    py: 0.5,
                    px: 1.5,
                    fontSize: theme.typography.pxToRem(12),
                    animation: `fadeIn 0.3s ease-in-out ${index * 0.05}s both`,
                    '@keyframes fadeIn': {
                      '0%': { opacity: 0, transform: 'translateY(5px)' },
                      '100%': { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}
                >
                  {keyword}
                  <Box
                    component="span"
                    onClick={() => handleRemoveKeyword(keyword)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ml: 0.5,
                      cursor: 'pointer',
                      fontSize: theme.typography.pxToRem(14), // Slightly larger close icon
                      lineHeight: 1,
                      transition: 'opacity 0.2s ease',
                      '&:hover': { opacity: 0.7 }
                    }}
                  >
                    ×
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </FormContainer>
      </Grid>
      
      {/* Content Description */}
      <Grid item xs={12} sx={{ mt: -2 }}>
        {/* Increased negative margin from -1 to -2 */}
        <FormContainer title="Content Description">
          <Box sx={{ width: '100%' }}>
            <FormInput
              label="Content Description"
              tooltipText="Describe what your content is about"
              placeholder="Enter a detailed description of your content"
              value={contentDescription}
              onChange={(e) => setContentDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
              error={errors.contentDescription}
              helperText={errors.contentDescription ? "Content description is required" : ""}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.palette.background.paper,
                  borderRadius: theme.shape.borderRadius / 6,
                }
              }}
            />
          </Box>
        </FormContainer>
      </Grid>

      <Grid item xs={12} sx={{ mt: -2 }}>
        {/* Increased negative margin from -1 to -2 */}
        
        {/* Title generation section */}
        {!isTitleGenerated ? (
            <Box 
              sx={{ 
                width: '100%', 
                height: theme.spacing(14), // Further reduced height from 16 to 14
                borderRadius: theme.shape.borderRadius / 6, 
                position: 'relative',
                overflow: 'hidden',
                mb: 5, // Reduced margin bottom from 2 to 1
                bgcolor: theme.palette.background.neutral,
                backdropFilter: 'blur(8px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed',
                borderColor: theme.palette.primary.main,
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                Generate a compelling title for your content
              </Typography>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateTitleWithValidation}
                disabled={isGeneratingTitle}
                startIcon={isGeneratingTitle ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="eva:flash-fill" />}
                sx={{ 
                  borderRadius: theme.spacing(3),
                  px: 3,
                }}
              >
                {isGeneratingTitle ? 'Generating...' : 'Generate Title'}
              </Button>
            </Box>
          ) : (
            <Box sx={{ width: '100%', mb: 1 }}>
              {/* Reduced margin bottom from 2 to 1 */}
              <FormContainer title="Generated Title">
                <Box sx={{ position: 'relative', width: '100%' }}>
                  <FormInput
                    tooltipText="Article Title"
                    label="Article Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth  
                  />
                  {/* Regenerate Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      onClick={handleRegenerateTitle}
                      disabled={isGeneratingTitle}
                      startIcon={isGeneratingTitle ? <CircularProgress size={20} /> : <Iconify icon="eva:refresh-fill" />}
                      sx={{
                        borderRadius: theme.spacing(3),
                      }}
                    >
                      {isGeneratingTitle ? 'Regenerating...' : 'Regenerate Article Title'}
                    </Button>
                  </Box>
                </Box>
              </FormContainer>
            </Box>
          )}

        {/* Meta information generation section */}
        {!isMetaGenerated ? (
          <Box 
            sx={{ 
              width: '100%', 
              height: theme.spacing(16), // Reduced height from 18 to 16
              borderRadius: theme.shape.borderRadius / 6, 
              position: 'relative',
              overflow: 'hidden',
              mb: 1, // Reduced margin bottom from 2 to 1
              bgcolor: theme.palette.background.neutral,
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed',
              borderColor: theme.palette.primary.main,
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.text.secondary }}>
              Generate SEO meta information for your content
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateMetaWithValidation}
              disabled={isGeneratingMeta}
              startIcon={isGeneratingMeta ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="eva:flash-fill" />}
              sx={{ 
                borderRadius: theme.spacing(3),
                px: 3,
              }}
            >
              {isGeneratingMeta ? 'Generating...' : 'Generate Meta Info'}
            </Button>
          </Box>
        ) : (
          <FormContainer title="SEO Meta Information">
            <Stack spacing={1} sx={{ width: '100%' }}>
              {/* Reduced spacing from 1.5 to 1 */}
              
              {/* Meta Title */}
              <FormInput
                tooltipText='Meta title'
                label="Meta Title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                fullWidth
              />
              
              {/* Meta Description */}
              <FormInput
                tooltipText='Meta Description'
                label="Meta Description"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
              
              {/* URL Slug */}
              <FormInput
                tooltipText='URL Slug'
                label="URL Slug"
                value={urlSlug}
                onChange={(e) => setUrlSlug(e.target.value)}
                fullWidth
              />
              
              {/* Regenerate Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  onClick={handleRegenerateMeta}
                  disabled={isGeneratingMeta}
                  startIcon={isGeneratingMeta ? <CircularProgress size={20} /> : <Iconify icon="eva:refresh-fill" />}
                  sx={{
                    borderRadius: theme.spacing(3),
                  }}
                >
                  {isGeneratingMeta ? 'Regenerating...' : 'Regenerate All'}
                </Button>
              </Box>
            </Stack>
          </FormContainer>
        )}
      </Grid>
    </Grid>
  );
}