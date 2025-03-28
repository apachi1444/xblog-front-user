import type { SectionItem } from 'src/components/form/DraggableSectionList';

import React, { useState, useEffect } from 'react';

import { Box, Grid, Button, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { DraggableSectionList } from 'src/components/form/DraggableSectionList';

import { FormContainer } from '../FormContainer';

interface Step3Props {
  generatedSections?: SectionItem[];
}

export function Step3ContentStructuring({ 
  generatedSections = []
}: Step3Props) {
  const [sections, setSections] = useState<SectionItem[]>(generatedSections);

  // Update sections when generatedSections prop changes
  useEffect(() => {
    if (generatedSections.length > 0) {
      setSections(generatedSections);
    }
  }, [generatedSections]);

  const handleSectionsChange = (newSections: SectionItem[]) => {
    setSections(newSections);
  };

  const handleAddSection = () => {
    const newId = (sections.length + 1).toString();
    setSections([
      ...sections,
      { 
        id: newId, 
        title: `Section ${newId}: New Section`, 
        status: 'Not Started' 
      }
    ]);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormContainer title="Content Outline">
          {sections.length > 0 ? (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Drag and drop sections to reorder them. Click on the edit icon to modify section details.
                </Typography>
              </Box>
              
              <DraggableSectionList 
                sections={sections} 
                onSectionsChange={handleSectionsChange} 
              />
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="mdi:plus" />}
                  onClick={handleAddSection}
                  sx={{ borderRadius: '20px' }}
                >
                  Add Section
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 3, bgcolor: 'background.neutral', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                No content outline has been generated yet. Please go back to the previous step and generate a table of contents.
              </Typography>
            </Box>
          )}
        </FormContainer>
      </Grid>
    </Grid>
  );
}