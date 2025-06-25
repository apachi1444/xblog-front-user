import toast from 'react-hot-toast';
import { useFormContext } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Card,
  Grid,
  Button,
  Select,
  Divider,
  MenuItem,
  Collapse,
  TextField,
  CardHeader,
  Typography,
  IconButton,
  CardContent,
  FormControl
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { Editor } from '../../edit-section/section-editor';
import { FormContainer } from '../../../../components/generate-article/FormContainer';

import type { ArticleSection, GenerateArticleFormData } from '../../schemas';

// Type alias for content types
type ContentType = 'paragraph' | 'bullet-list' | 'table' | 'faq' | 'image-gallery';

export function Step3ContentStructuring() {
  const { setValue, getValues } = useFormContext<GenerateArticleFormData>();

  // State for tracking which section is being edited
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContentType, setEditContentType] = useState<ContentType>("paragraph");

  // State for tracking expanded sections
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Force re-render state
  const [refreshKey, setRefreshKey] = useState(0);
  const [sectionsCache, setSectionsCache] = useState<ArticleSection[]>([]);

  // Get sections and update cache when refreshKey changes
  useEffect(() => {
    const currentSections = getValues('step3.sections') || [];
    setSectionsCache(currentSections);
  }, [refreshKey, getValues]);

  const sections = sectionsCache;

  // Function to toggle section expansion
  const toggleSectionExpansion = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Function to strip HTML tags and get plain text
  const stripHtmlTags = useCallback((html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  }, []);

  // Function to start editing a section
  const handleEditSection = useCallback((section: ArticleSection) => {
    setEditingSectionId(section.id);
    setEditContent(section.content || "");
    setEditTitle(section.title || "");
    setEditContentType(section.contentType || "paragraph");
  }, []);

  // Function to save the edited section
  const handleSaveSection = useCallback(() => {
    if (!editingSectionId) return;

    // Get the current sections from the form to ensure we have the latest state
    const currentSections = sections;

    const updatedSections = currentSections.map(section =>
      section.id === editingSectionId
        ? {
            ...section,
            content: editContent,
            title: editTitle,
            contentType: editContentType
          }
        : section
    );

    setValue('step3.sections', updatedSections, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    // Force a re-render to ensure the UI updates
    setRefreshKey(prev => prev + 1);

    toast.success("Section updated successfully!");
    setEditingSectionId(null);
  }, [editingSectionId, sections, setValue, editContent, editTitle, editContentType]);



  // Function to add a new section
  const handleAddSection = useCallback(() => {
    const newId = (sections.length + 1).toString();
    const newSection: ArticleSection = {
      id: newId,
      title: `Section ${newId}: New Section`,
      content: 'Add your section content here',
      status: 'draft',
      type: 'regular',
      contentType: 'paragraph'
    };

    // Add the new section and start editing it
    const updatedSections = [...sections, newSection];
    setValue('step3.sections', updatedSections, { shouldValidate: true });

    // Start editing the new section
    handleEditSection(newSection);

    toast.success("New section added. You can now edit it.");
  }, [sections, setValue, handleEditSection]);

  // Function to delete a section
  const handleDeleteSection = useCallback((sectionId: string) => {
    // Create a new array without the deleted section
    const updatedSections = sections.filter(section => section.id !== sectionId);

    // Update the form with the new sections array
    setValue('step3.sections', updatedSections, { shouldValidate: true });

    toast.success("Section deleted successfully!");
  }, [sections, setValue]);

  // If we're currently editing a section
  if (editingSectionId) {
    const currentSection = sections.find(section => section.id === editingSectionId);

    if (!currentSection) {
      return null;
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormContainer title="Edit Section">
            <Box sx={{ width: '100%', p: 2 }}>
              {/* Back and Save buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => setEditingSectionId(null)}
                  startIcon={<Iconify icon="eva:arrow-back-fill" />}
                >
                  Back to Sections
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveSection}
                  startIcon={<Iconify icon="eva:save-fill" />}
                >
                  Save Changes
                </Button>
              </Box>

              {/* Section title */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Section Title
                </Typography>
                <TextField
                  fullWidth
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Enter section title"
                  variant="outlined"
                />
              </Box>

              {/* Content type selector */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Content Type
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={editContentType}
                    onChange={(e) => setEditContentType(e.target.value as ContentType)}
                    displayEmpty
                  >
                    <MenuItem value="paragraph">Paragraph</MenuItem>
                    <MenuItem value="bullet-list">Bullet List</MenuItem>
                    <MenuItem value="table">Table</MenuItem>
                    <MenuItem value="faq">FAQ</MenuItem>
                    <MenuItem value="image-gallery">Image Gallery</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Section content */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Section Content
                </Typography>
                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, minHeight: '300px' }}>
                  <Editor
                    initialContent={editContent}
                    onChange={setEditContent}
                  />
                </Box>
              </Box>
            </Box>
          </FormContainer>
        </Grid>
      </Grid>
    );
  }

  // Default view - section list
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormContainer title="Content Outline">
          {sections.length > 0 ? (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Review and edit your content sections. Click on the edit button to modify section details.
                </Typography>
              </Box>

              {/* Section list */}
              <Box sx={{ mb: 3 }} key={refreshKey}>
                {sections.map((section) => {
                  const isExpanded = expandedSections.has(section.id);
                  const plainTextContent = stripHtmlTags(section.content || '');
                  const previewContent = plainTextContent.length > 200
                    ? `${plainTextContent.substring(0, 200)}...`
                    : plainTextContent;

                  return (
                    <Card key={section.id} sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}>
                      <CardHeader
                        title={section.title}
                        action={
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={() => toggleSectionExpansion(section.id)}
                              sx={{
                                transition: 'transform 0.2s',
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                              }}
                            >
                              <Iconify icon="eva:chevron-down-fill" />
                            </IconButton>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleEditSection(section)}
                              startIcon={<Iconify icon="eva:edit-2-fill" />}
                              sx={{ borderRadius: '20px' }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteSection(section.id)}
                              startIcon={<Iconify icon="eva:trash-2-fill" />}
                              sx={{ borderRadius: '20px' }}
                            >
                              Delete
                            </Button>
                          </Box>
                        }
                      />
                      <Divider />
                      <CardContent sx={{ pt: 2 }}>
                        {!isExpanded ? (
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                            {previewContent}
                          </Typography>
                        ) : null}
                        <Collapse in={isExpanded}>
                          <Box
                            sx={{
                              '& p': { mb: 1 },
                              '& ul, & ol': { pl: 2, mb: 1 },
                              '& li': { mb: 0.5 },
                              '& h1, & h2, & h3, & h4, & h5, & h6': { mb: 1, mt: 1 },
                              '& blockquote': { pl: 2, borderLeft: '3px solid', borderColor: 'divider', mb: 1 },
                              '& table': { width: '100%', borderCollapse: 'collapse', mb: 1 },
                              '& td, & th': { border: '1px solid', borderColor: 'divider', p: 1 }
                            }}
                            dangerouslySetInnerHTML={{ __html: section.content || '' }}
                          />
                        </Collapse>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="eva:plus-fill" />}
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