import React, { useState } from 'react';
import { X, Plus, HelpCircle } from 'lucide-react';

import { 
  Box, 
  Chip, 
  Button, 
  Tooltip, 
  TextField, 
  Typography
} from '@mui/material';

import { FormDropdown } from './FormDropdown';
import { FormContainer } from './FormContainer';

export function FormExampleTestMultipleInput() {
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [secondaryKeyword, setSecondaryKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>(['test', 'test']);
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
    <Box sx={{ position: 'relative', maxWidth: '800px', mx: 'auto' }}>
      {/* Next button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant="contained" 
          color="primary"
          endIcon={<Box component="span" sx={{ ml: 0.5 }}>›</Box>}
          sx={{ 
            bgcolor: '#919eff', 
            borderRadius: '8px',
            px: 3,
            '&:hover': {
              bgcolor: '#7a8bff'
            }
          }}
        >
          Next
        </Button>
      </Box>

      {/* Keywords section */}
      <FormContainer title="Keywords">
        {/* Primary Keyword */}
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
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
              Primary Keyword
            </Typography>
            <Tooltip title="Enter your main keyword">
              <Box component="span" sx={{ display: 'inline-flex', ml: 0.5, cursor: 'pointer' }}>
                <HelpCircle size={16} color="#5969cf" />
              </Box>
            </Tooltip>
          </Box>
          
          <TextField
            fullWidth
            size="small"
            placeholder="Main keyword..."
            value={primaryKeyword}
            onChange={(e) => setPrimaryKeyword(e.target.value)}
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
        </Box>

        {/* Secondary Keywords */}
        <Box sx={{ width: '100%', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
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
            <Tooltip title="Enter additional keywords">
              <Box component="span" sx={{ display: 'inline-flex', ml: 0.5, cursor: 'pointer' }}>
                <HelpCircle size={16} color="#5969cf" />
              </Box>
            </Tooltip>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Secondary keywords..."
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
      </FormContainer>
    </Box>
  );
}