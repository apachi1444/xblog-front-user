import type { SectionItem } from 'src/components/generate-article/DraggableSectionList';

import toast from 'react-hot-toast';
import { useState, useEffect, useCallback } from 'react';

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

// Sample content for mock sections
const SAMPLE_CONTENT = [
  "This section will cover the introduction to the topic, providing background information and context for the reader. It will establish the importance of the subject matter and outline the key points that will be discussed in the article.",

  "Here we'll explore the main concepts and principles related to the topic. This section will dive deeper into the subject matter, explaining core ideas and their significance.",

  "This section examines practical applications and real-world examples. It demonstrates how the concepts discussed can be applied in various contexts and situations.",

  "In this section, we'll analyze the benefits and advantages of the approaches discussed earlier. We'll highlight positive outcomes and potential gains from implementing these ideas.",

  "This section addresses common challenges and potential obstacles. It provides strategies for overcoming these difficulties and offers solutions to typical problems.",

  "Here we'll look at future trends and developments in this field. This section discusses emerging technologies, evolving practices, and what readers might expect to see in the coming years."
];

interface Step3Props {
  generatedSections?: SectionItem[];
  onSaveAllSections?: (sections: SectionItem[]) => void;
  onEditSection?: (section: SectionItem) => void;
}

export function Step3ContentStructuring({
  generatedSections = [],
  onSaveAllSections,
  onEditSection: externalEditHandler,
}: Step3Props) {
  // Initialize with mock data if no sections are provided
  const initialSections = generatedSections.length > 0
    ? generatedSections
    : Array(4).fill(0).map((_, index) => ({
        id: (index + 1).toString(),
        title: `Section ${index + 1}: ${['Introduction', 'Main Concepts', 'Applications', 'Benefits'][index] || 'Additional Content'}`,
        status: ['Not Started', 'In Progress', 'Completed'][Math.floor(Math.random() * 3)] as "Not Started" | "In Progress" | "Completed",
        description: `This section covers ${['the basics', 'key concepts', 'practical applications', 'main benefits'][index] || 'important aspects'} of the topic.`,
        content: SAMPLE_CONTENT[index] || SAMPLE_CONTENT[0]
      }));

  const [sections, setSections] = useState<SectionItem[]>(initialSections);
  const [currentSection, setCurrentSection] = useState<SectionItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Update sections when generatedSections prop changes
  useEffect(() => {
    if (generatedSections.length > 0) {
      setSections(generatedSections);
    }
  }, [generatedSections]);

  // Save all sections when they change
  useEffect(() => {
    if (onSaveAllSections && sections.length > 0) {
      console.log('Saving all sections to parent component:', sections);
      onSaveAllSections(sections);
    }
  }, [sections, onSaveAllSections]);

  const handleSectionsChange = useCallback((newSections: SectionItem[]) => {
    setSections(newSections);
  }, []);

  const handleAddSection = useCallback(() => {
    const newId = (sections.length + 1).toString();
    const newSection: SectionItem = {
      id: newId,
      title: `Section ${newId}: New Section`,
      status: 'Not Started',
      description: 'Add your section description here',
      content: ''
    };

    setSections([...sections, newSection]);

    // Open edit dialog for the new section
    setCurrentSection(newSection);
    setEditDialogOpen(true);
  }, [sections]);

  const handleEditSection = useCallback((section: SectionItem) => {
    if (externalEditHandler) {
      // Use the external edit handler if provided (for dedicated screen editing)
      externalEditHandler(section);
    } else {
      // Otherwise use the dialog
      setCurrentSection(section);
      setEditDialogOpen(true);
    }
  }, [externalEditHandler]);

  const handleDeleteSection = useCallback((sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
    toast.success("Section deleted successfully!");
  }, [sections]);

  const handleSaveSection = useCallback((updatedSection: SectionItem) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === updatedSection.id ? updatedSection : section
      )
    );
    toast.success("Section updated successfully!");
  }, []);

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