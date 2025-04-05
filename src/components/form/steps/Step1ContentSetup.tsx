import React, { useState } from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Grid, Stack, Button, Typography, CircularProgress } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { FormInput } from '../FormInput';
import { FormDropdown } from '../FormDropdown';
import { FormContainer } from '../FormContainer';

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
  setContentDescription
}: Step1Props) {
  const theme = useTheme();
  
  // Add state for field validation errors
  const [errors, setErrors] = useState({
    contentDescription: false,
    primaryKeyword: false,
    secondaryKeywords: false
  });
  
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
  
  // Data for country options
  const countries = [
    { value: "us", label: "English (US)", icon: "🇺🇸" },
    { value: "uk", label: "English (UK)", icon: "🇬🇧" },
    { value: "fr", label: "French", icon: "🇫🇷" }
  ];

  // Data for language options
  const languages = [
    { value: "en-us", label: "English (US)", icon: "🇺🇸" },
    { value: "en-gb", label: "English (UK)", icon: "🇬🇧" },
    { value: "fr-fr", label: "French", icon: "🇫🇷" }
  ];

  return (
    <Grid container spacing={1}>
      {/* Reduced spacing from 2 to 1 in the container */}
      
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
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FormInput
                label='Secondary Keywords'
                placeholder="Add secondary keywords"
                tooltipText='Secondary keywords'
                value={secondaryKeyword}
                onChange={(e) => setSecondaryKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                fullWidth
                error={errors.secondaryKeywords}
                helperText={errors.secondaryKeywords ? "At least one secondary keyword is required" : ""}
              />
              <Box 
                onClick={handleAddKeyword}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mt: 2.5,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  width: theme.spacing(6.25),
                  height: theme.spacing(6.25),
                  borderRadius: theme.shape.borderRadius / 6,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  }
                }}
              >
                <Box component="span" sx={{ fontSize: theme.typography.pxToRem(18), fontWeight: 'bold' }}>+</Box>
              </Box>
            </Box>
            
            {/* Display secondary keywords as chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
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