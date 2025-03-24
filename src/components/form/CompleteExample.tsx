import React, { useState } from 'react';
import { Box, Button, Chip, TextField, Typography, Grid } from '@mui/material';
import { Plus, X, HelpCircle } from 'lucide-react';

import { SEODashboard } from './SEODashboard';
import { FormInput } from './FormInput';
import { FormDropdown } from './FormDropdown';
import { FormContainer } from './FormContainer';

export function CompleteExample() {
  const [targetCountry, setTargetCountry] = useState('us');
  const [language, setLanguage] = useState('en-us');
  const [title, setTitle] = useState('');
  const [secondaryKeyword, setSecondaryKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>([]);
  const [contentDescription, setContentDescription] = useState('');

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

  return (
    <Box>
      <Grid container spacing={3}>
        
        {/* Forms on the left */}
        <Grid item xs={12} md={7} lg={8}>
          <FormContainer title="Keywords" layout="column">
            {/* Primary Keyword */}
            <Box sx={{ width: '100%' }}>
              <FormInput
                label="Primary Keyword"
                tooltipText="Enter the title of your content"
                placeholder="Enter primary keyword"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />
            </Box>
            
            {/* Secondary Keywords */}
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mb: 0.5 }}>
                <Typography 
                  sx={{ 
                    fontFamily: "'Poppins', Helvetica",
                    fontWeight: 500,
                    color: '#1f384c',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px',
                    lineHeight: '23px'
                  }}
                >
                  Secondary Keywords
                </Typography>
                <Box component="span" sx={{ display: 'inline-flex', cursor: 'pointer' }}>
                  <HelpCircle size={16} color="#5969cf" />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter secondary keywords..."
                  value={secondaryKeyword}
                  onChange={(e) => setSecondaryKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '32px',
                      bgcolor: '#f7f7fa',
                      borderRadius: '5px',
                      border: '0.5px solid #5969cf',
                      fontSize: '0.75rem',
                      '& fieldset': { border: 'none' }
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleAddKeyword}
                  sx={{ 
                    height: '32px', 
                    minWidth: 'auto',
                    px: 1.5,
                    bgcolor: '#919eff',
                    borderRadius: '5px',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      bgcolor: '#7a8bff'
                    }
                  }}
                  endIcon={<Plus size={16} />}
                >
                  Add keyword
                </Button>
              </Box>
              
              {/* Keyword chips */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {secondaryKeywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    onDelete={() => handleRemoveKeyword(keyword)}
                    deleteIcon={<X size={14} />}
                    sx={{
                      height: '24px',
                      bgcolor: '#f0f0ff',
                      color: '#5969cf',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      '& .MuiChip-deleteIcon': {
                        color: '#5969cf',
                        fontSize: '0.75rem',
                        '&:hover': {
                          color: '#3a4db1'
                        }
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
            
            {/* Content Description */}
            <Box sx={{ width: '100%' }}>
              <FormInput
                fullWidth
                multiline
                rows={4}
                label="Content Description"
                tooltipText="Describe your content"
                placeholder="Content Description..."
                value={contentDescription}
                onChange={(e) => setContentDescription(e.target.value)}
              />
            </Box>
          </FormContainer>
          
          <FormContainer title="Language">
            <FormDropdown
              label="Target Country"
              tooltipText="Select your target country"
              options={countries}
              value={targetCountry}
              onChange={(e) => setTargetCountry(e.target.value as string)}
              placeholder="Select country"
            />
            
            <FormDropdown
              label="Language"
              tooltipText="Select your preferred language"
              options={languages}
              value={language}
              onChange={(e) => setLanguage(e.target.value as string)}
              placeholder="Select language"
            />
          </FormContainer>
        </Grid>

        {/* SEODashboard on the right */}
        <Grid item xs={12} md={5} lg={4}>
          <SEODashboard />
        </Grid>
      </Grid>
    </Box>
  );
}