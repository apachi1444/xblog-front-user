import React from 'react';

import { Box, Grid, Stack, Button, TextField, Typography, CircularProgress } from '@mui/material';

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
  handleRegenerateMeta
}: Step1Props) {
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
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormContainer title="Keywords" layout="column">
          
        <Box sx={{ width: '100%' }}>
            <FormInput
              label="Primary Keyword"
              tooltipText="Enter the main keyword for your content"
              placeholder="Enter primary keyword"
              value={primaryKeyword}
              onChange={(e) => setPrimaryKeyword(e.target.value)}
              fullWidth
            />
          </Box>
          
          {/* Secondary Keywords */}
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mb: 0.5 }}>
              <Typography 
                sx={{ 
                  fontWeight: 500,
                  color: 'text.primary',
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px',
                  lineHeight: '23px'
                }}
              >
                Secondary Keywords
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormInput
                label=""
                placeholder="Add secondary keywords"
                value={secondaryKeyword}
                onChange={(e) => setSecondaryKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                fullWidth
              />
              <Box 
                onClick={handleAddKeyword}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 32,
                  height: 32,
                  borderRadius: '5px',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                <Box component="span" sx={{ fontSize: 18, fontWeight: 'bold' }}>+</Box>
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
                    bgcolor: 'primary.lighter',
                    color: 'primary.dark',
                    borderRadius: '16px',
                    py: 0.5,
                    px: 1.5,
                    fontSize: '0.75rem',
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

      <Grid item xs={12}>
        <FormContainer title="Language & Region">
          <FormDropdown
            label="Target Country"
            options={countries}
            tooltipText="Select the target country for your content"
            placeholder="Select country"
            value={targetCountry}
            onChange={(e) => setTargetCountry(e.target.value as string)}
          />
          
          <FormDropdown
            label="Language"
            options={languages}
            tooltipText="Select the language for your content"
            placeholder="Select language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as string)}
          />
        </FormContainer>
      </Grid>

      <Grid item xs={12}>

      {!isTitleGenerated ? (
            <Box 
              sx={{ 
                width: '100%', 
                height: 150, 
                borderRadius: 2, 
                position: 'relative',
                overflow: 'hidden',
                mb: 3,
                bgcolor: 'background.neutral',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed',
                borderColor: 'primary.main',
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
                Generate a compelling title for your content
              </Typography>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateTitle}
                disabled={isGeneratingTitle}
                startIcon={isGeneratingTitle ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="eva:flash-fill" />}
                sx={{ 
                  borderRadius: '24px',
                  px: 3,
                }}
              >
                {isGeneratingTitle ? 'Generating...' : 'Generate Title'}
              </Button>
            </Box>
          ) : (
            <Box sx={{ width: '100%', mb: 3 }}>
              <FormContainer title="Generated Title">
                <Box sx={{ position: 'relative', width: '100%' }}>
                  <TextField
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#f7f7fa',
                      }
                    }}
                  />
                  <Button
                    onClick={handleRegenerateTitle}
                    disabled={isGeneratingTitle}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      minWidth: 'auto',
                      p: 1,
                    }}
                  >
                    {isGeneratingTitle ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Iconify icon="eva:refresh-fill" />
                    )}
                  </Button>
                </Box>
              </FormContainer>
            </Box>
          )}

        {!isMetaGenerated ? (
          <Box 
            sx={{ 
              width: '100%', 
              height: 180, 
              borderRadius: 2, 
              position: 'relative',
              overflow: 'hidden',
              mb: 3,
              bgcolor: 'background.neutral',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed',
              borderColor: 'primary.main',
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
              Generate SEO meta information for your content
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateMeta}
              disabled={isGeneratingMeta}
              startIcon={isGeneratingMeta ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="eva:flash-fill" />}
              sx={{ 
                borderRadius: '24px',
                px: 3,
              }}
            >
              {isGeneratingMeta ? 'Generating...' : 'Generate Meta Info'}
            </Button>
          </Box>
        ) : (
          <FormContainer title="SEO Meta Information">
            <Stack spacing={2} sx={{ width: '100%' }}>
              {/* Meta Title */}
              <Box sx={{ position: 'relative', width: '100%' }}>
                <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                  Meta Title
                </Typography>
                <TextField
                  fullWidth
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#f7f7fa',
                    }
                  }}
                />
              </Box>
              
              {/* Meta Description */}
              <Box sx={{ position: 'relative', width: '100%' }}>
                <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                  Meta Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#f7f7fa',
                    }
                  }}
                />
              </Box>
              
              {/* URL Slug */}
              <Box sx={{ position: 'relative', width: '100%' }}>
                <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                  URL Slug
                </Typography>
                <TextField
                  fullWidth
                  value={urlSlug}
                  onChange={(e) => setUrlSlug(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Box component="span" sx={{ color: 'text.disabled', mr: 0.5 }}>
                        /
                      </Box>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#f7f7fa',
                    }
                  }}
                />
              </Box>
              
              {/* Regenerate Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  onClick={handleRegenerateMeta}
                  disabled={isGeneratingMeta}
                  startIcon={isGeneratingMeta ? <CircularProgress size={20} /> : <Iconify icon="eva:refresh-fill" />}
                  sx={{
                    borderRadius: '24px',
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