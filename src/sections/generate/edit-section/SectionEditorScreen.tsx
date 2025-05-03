import type { SectionItem } from 'src/components/generate-article/DraggableSectionList';

import { useRef, useState, useEffect, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { FormContainer } from 'src/components/generate-article/FormContainer';

import { Editor } from './section-editor';


interface SectionEditorScreenProps {
  section: SectionItem | undefined;
  onSave: (updatedSection: SectionItem) => void;
  onCancel: () => void;
}

export function SectionEditorScreen({ section, onSave, onCancel }: SectionEditorScreenProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const editorRef = useRef(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [isEdited, setIsEdited] = useState(false);


  const handleEditorChange = useCallback((newContent: string) => {
    console.log('Editor content changed in SectionEditorScreen:', newContent);
    console.log('Current content state:', content);

    setContent(newContent);
    setIsEdited(true);

    console.log('Is edited state set to:', true);
    console.log('Content state updated to:', newContent);

    setTimeout(() => {
      setIsEdited(true);
    }, 0);
  }, [content]);

  // Initialize form values when section changes
  useEffect(() => {
    if (section) {
      setTitle(section.title);
      setDescription(section.description || '');
      setContent(section.content || '');
      setIsEdited(false);
    } else {
      console.log('No section data available');
    }
  }, [section]);

  // Mark as edited when any field changes
  useEffect(() => {
    if (section) {
      const hasChanged =
        title !== section.title ||
        description !== (section.description || '') ||
        content !== (section.content || '');

      setIsEdited(hasChanged);
    }
  }, [title, description, content, section]);

  const handleSave = useCallback(() => {
    if (!section) return;

    const updatedSection: SectionItem = {
      ...section,
      title,
      description,
      content,
    };

    onSave(updatedSection);
  }, [section, title, description, content, onSave]);

  const handleCancel = useCallback(() => {
    if (isEdited) {
      if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  }, [isEdited, onCancel]);

  if (!section) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>No section selected for editing</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          This could happen if the section data has t been properly loaded or if there was an error finding the selected section.
        </Typography>
        <Button
          variant="contained"
          onClick={onCancel}
          sx={{ mt: 2 }}
        >
          Back to Sections List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header with title and actions */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        width : '100%',
        gap: 2
      }}>
        <Typography variant="h4">Edit Section</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleCancel}
            startIcon={<Iconify icon="eva:close-fill" />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!isEdited}
            startIcon={<Iconify icon="eva:save-fill" />}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {/* Main content area with flexible layout */}
      <Box sx={{
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
        gap: 3,
        height: 'calc(100% - 60px)',
        flexGrow: 1
      }}>
        {/* Section Content - Flexible width, takes remaining space */}
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: isSmallScreen ? '500px' : 'auto'
        }}>
          <FormContainer title="Section Content">
            <Box sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box sx={{
                flexGrow: 1,
                borderRadius: 1,
                overflow: 'hidden',
                minHeight: '400px',
                bgcolor: 'background.paper'
              }}>
                <Editor
                  initialContent={content}
                  onChange={handleEditorChange}
                  ref={editorRef}
                  key={`editor-${section.id}`}
                />
              </Box>
            </Box>
          </FormContainer>
        </Box>
      </Box>
    </Box>
  );
}
