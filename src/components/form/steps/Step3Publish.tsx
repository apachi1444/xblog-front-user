import React from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import { FormContainer } from '../FormContainer';

export function Step3Publish() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormContainer title="Preview & Publish">
          <Box sx={{ p: 4, bgcolor: 'background.neutral', borderRadius: 1, mb: 3 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Your generated content will appear here for review before publishing.
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="success"
              sx={{ 
                px: 4, 
                py: 1,
                bgcolor: 'success.main',
                '&:hover': {
                  bgcolor: 'success.dark',
                }
              }}
            >
              Publish Content
            </Button>
          </Box>
        </FormContainer>
      </Grid>
    </Grid>
  );
}