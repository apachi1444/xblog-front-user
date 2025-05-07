import type { SectionItem } from 'src/components/generate-article/DraggableSectionList';

import toast from 'react-hot-toast';
import { useRef, useState, useEffect, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { FormContainer } from 'src/components/generate-article/FormContainer';


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
    setContent(newContent);
    setIsEdited(true);
  }, []);

  // Initialize form values when section changes - using a ref to avoid infinite loops
  const initializedRef = useRef(false);

  useEffect(() => {
    if (section) {
      console.log('Loading section data in SectionEditorScreen:', section);
      console.log('Section content to load:', section.content);

      // Make sure we're getting the latest data
      setTitle(section.title || '');
      setDescription(section.description || '');

      // Ensure content is properly loaded - only if we haven't initialized yet or if the section ID changed
      if (!initializedRef.current) {
        if (section.content !== undefined) {
          console.log('Setting content to:', section.content);
          setContent(section.content);
        } else {
          console.log('No content available, setting empty string');
          setContent('');
        }
      }

      setIsEdited(false);
    } else {
      console.log('No section data available');
      initializedRef.current = false;
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

    console.log('Saving section with content:', content);

    // Create a complete updated section with all properties
    const updatedSection: SectionItem = {
      ...section,
      id: section.id,
      title: title || section.title || 'Untitled Section',
      description: description || section.description || '',
      content: content || '',
    };

    console.log('Sending updated section to parent:', updatedSection);

    // Call the parent's onSave function with the updated section
    onSave(updatedSection);

    // Show success message
    toast.success("Section saved successfully!");
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
                width: '100%',
                height: '100%',
                bgcolor: 'background.paper',
                border: '1px solid #e0e0e0'
              }}>
                <Box sx={{ p: 2, width: '100%', height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    {title}
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    minRows={15}
                    maxRows={30}
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      setIsEdited(true);
                    }}
                    placeholder="Start writing your section content here..."
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'inherit',
                      }
                    }}
                    InputProps={{
                      sx: {
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6,
                        fontSize: '14px',
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </FormContainer>
        </Box>
      </Box>
    </Box>
  );
}
