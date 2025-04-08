import type { SectionItem } from 'src/components/form/DraggableSectionList';

import React, { useState, useEffect } from 'react';

import { 
  Box, 
  Grid, 
  Fade, 
  Paper, 
  Button, 
  Dialog, 
  Typography
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { DraggableSectionList } from 'src/components/form/DraggableSectionList';

import { FormContainer } from '../FormContainer';

interface Step3Props {
  generatedSections?: SectionItem[];
  onNextStep?: () => void;
}

export function Step3ContentStructuring({ 
  generatedSections = [],
  onNextStep,
}: Step3Props) {
  const [sections, setSections] = useState<SectionItem[]>(generatedSections);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<SectionItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStatus, setEditStatus] = useState<"Not Started" | "In Progress" | "Completed">("Not Started");
  const [editDescription, setEditDescription] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
        status: 'Not Started',
        description: 'Add your section description here'
      }
    ]);
    
    // Open edit dialog for the new section
    handleEditSection({
      id: newId,
      title: `Section ${newId}: New Section`,
      status: 'Not Started',
      description: 'Add your section description here'
    });
  };

  const handleEditSection = (section: SectionItem) => {
    setCurrentSection(section);
    setEditTitle(section.title);
    setEditStatus(section.status);
    setEditDescription(section.description || '');
    setEditDialogOpen(true);
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
    setSuccessMessage('Section deleted successfully!');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleSaveEdit = () => {
    if (!currentSection) return;
    
    const updatedSections = sections.map(section => 
      section.id === currentSection.id 
        ? { ...section, title: editTitle, status: editStatus, description: editDescription } 
        : section
    );
    
    setSections(updatedSections);
    setEditDialogOpen(false);
    
    // Show success message
    setSuccessMessage('Section updated successfully!');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormContainer title="Content Outline">
          {showSuccessMessage && (
            <Fade in={showSuccessMessage}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  bgcolor: 'success.lighter', 
                  color: 'success.darker',
                  borderRadius: 1
                }}
              >
                <Typography variant="body2">
                  {successMessage}
                </Typography>
              </Paper>
            </Fade>
          )}
          
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
                onEditSection={handleEditSection}
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

      {/* Section Edit Dialog remains unchanged */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        {/* Dialog content remains unchanged */}
      </Dialog>
    </Grid>
  );
}