import type { SectionItem } from 'src/components/generate-article/DraggableSectionList';

import toast from 'react-hot-toast';
import { useState, useCallback } from 'react';

import {
  Box,
  Grid,
  Button,
  Typography
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { SectionEditDialog } from 'src/components/generate-article/SectionEditDialog';
import { DraggableSectionList } from 'src/components/generate-article/DraggableSectionList';

import { FormContainer } from '../../../../components/generate-article/FormContainer';

export interface Step3State {
  tableOfContents: {
    generatedSections: SectionItem[];
    onSaveSection?: (section: SectionItem) => void;
    onEditSection?: (section: SectionItem) => void;
  }
}

interface Step3Props {
  state: Step3State
}

export function Step3ContentStructuring({state}: Step3Props) {

  const {tableOfContents} = state
  const { generatedSections, onSaveSection, onEditSection } = tableOfContents

  const sections = generatedSections;

  const [currentSection, setCurrentSection] = useState<SectionItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);


  const handleSectionsChange = useCallback((newSections: SectionItem[]) => {
    // Update the parent component's state directly
    if (onSaveSection) {
      // Since we can't update the entire array at once with the current API,
      // we'll update each section individually
      newSections.forEach(section => {
        onSaveSection(section);
      });
    }
  }, [onSaveSection]);

  const handleAddSection = useCallback(() => {
    const newId = (sections.length + 1).toString();
    const newSection: SectionItem = {
      id: newId,
      title: `Section ${newId}: New Section`,
      description: 'Add your section description here',
      content: ''
    };

    // Update the parent component's state directly
    if (onSaveSection) {
      onSaveSection(newSection);
    }

    // Open edit dialog for the new section
    setCurrentSection(newSection);
    setEditDialogOpen(true);
  }, [sections, onSaveSection]);

  const handleDeleteSection = useCallback((sectionId: string) => {
    // We can't directly delete from the parent state, so we'll create a new array without the deleted section
    // and update each section in the parent state
    const updatedSections = sections.filter(section => section.id !== sectionId);

    // Update the parent component's state directly
    if (onSaveSection && updatedSections.length > 0) {
      // Since we can't update the entire array at once with the current API,
      // we'll update each section individually
      updatedSections.forEach(section => {
        onSaveSection(section);
      });
    }

    toast.success("Section deleted successfully!");
  }, [sections, onSaveSection]);

  const handleSaveSection = useCallback((updatedSection: SectionItem) => {
    // Update the parent component's state directly
    if (onSaveSection) {
      onSaveSection(updatedSection);
    }

    toast.success("Section updated successfully!");
  }, [onSaveSection]);

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
                onEditSection={onEditSection}
                onDeleteSection={handleDeleteSection}
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

      {/* Section Edit Dialog */}
      <SectionEditDialog
        open={editDialogOpen}
        section={currentSection}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSaveSection}
      />
    </Grid>
  );
}