import type { SectionItem } from 'src/components/generate-article/DraggableSectionList';

import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';

import { 
  Box, 
  Grid, 
  Button,
  Typography
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { DraggableSectionList } from 'src/components/generate-article/DraggableSectionList';

import { FormContainer } from '../../../../components/generate-article/FormContainer';

interface Step3Props {
  generatedSections?: SectionItem[];
  onEditSection?: (section: SectionItem) => void; // Add this prop
}

export function Step3ContentStructuring({ 
  generatedSections = [],
  onEditSection, // Add this prop
}: Step3Props) {
  const [sections, setSections] = useState<SectionItem[]>(generatedSections);
  const [currentSection, setCurrentSection] = useState<SectionItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStatus, setEditStatus] = useState<"Not Started" | "In Progress" | "Completed">("Not Started");
  const [editDescription, setEditDescription] = useState('');

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

    if (!currentSection) return;
    
    // Instead of navigating, call the parent's onEditSection handler
    if (onEditSection) {
      onEditSection(currentSection);
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId))
    toast.success("Section deleted successfully !")
  };

  const handleSaveEdit = () => {
    if (!currentSection) return;
    
    const updatedSections = sections.map(section => 
      section.id === currentSection.id 
        ? { ...section, title: editTitle, status: editStatus, description: editDescription } 
        : section
    );
    
    setSections(updatedSections);
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
    </Grid>
  );
}