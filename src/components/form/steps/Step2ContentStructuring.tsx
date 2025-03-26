import React from 'react';
import { Box, Grid, Typography, TextField } from '@mui/material';
import { FormContainer } from '../FormContainer';

interface Step2Props {
  contentDescription: string;
  setContentDescription: (value: string) => void;
}

export function Step2ContentStructuring({ contentDescription, setContentDescription }: Step2Props) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormContainer title="Content Structure">
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
                Content Description
              </Typography>
            </Box>
            
            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Describe what you want in your content..."
              value={contentDescription}
              onChange={(e) => setContentDescription(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#f7f7fa',
                  borderRadius: '5px',
                  border: '0.5px solid',
                  borderColor: 'primary.main',
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  }
                }
              }}
            />
          </Box>
        </FormContainer>
      </Grid>
      
      <Grid item xs={12}>
        <FormContainer title="Content Outline">
          <Box sx={{ p: 3, bgcolor: 'background.neutral', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Your content outline will be generated here after you provide the necessary information.
            </Typography>
          </Box>
        </FormContainer>
      </Grid>
    </Grid>
  );
}