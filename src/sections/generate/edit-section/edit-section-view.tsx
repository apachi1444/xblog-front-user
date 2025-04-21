
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { 
  Box, 
  Grid, 
  Card, 
  Stack, 
  Button, 
  Divider, 
  useTheme,
  Container,
  Typography,
  CircularProgress
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { LoadingSpinner } from 'src/components/loading';

import { ImageGallery } from './image-gallery';
import { SectionEditor } from './section-editor';

// Mock data for demonstration
const mockSectionData = {
  title: 'Introduction to Content Marketing',
  content: '<p>Content marketing is a strategic marketing approach focused on creating and distributing valuable, relevant, and consistent content to attract and retain a clearly defined audience — and, ultimately, to drive profitable customer action.</p><p>Instead of pitching your products or services, you are providing truly relevant and useful content to your prospects and customers to help them solve their issues.</p><h2>Why Content Marketing is Important</h2><p>Content marketing is important because it answers your audience\'s questions and helps you build trust, develop relationships, improve conversions, and generate leads.</p><p>In today\'s age of information abundance and attention scarcity, content marketing provides a way to cut through the noise and connect with your audience in a meaningful way.</p>',
};

export function EditSectionView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { sectionId } = useParams();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching section data
  useEffect(() => {
    const timer = setTimeout(() => {
      setTitle(mockSectionData.title);
      setContent(mockSectionData.content);
      setIsLoading(false);
    }, 800); // Simulate loading delay
    
    return () => clearTimeout(timer);
  }, [sectionId]);

  // Handle content change
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Handle save
  const handleSave = async () => {
    if (!sectionId) return;
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Section updated successfully!');
      setIsSaving(false);
      navigate(-1); // Go back to previous page
    }, 1000);
  };

  // Handle back
  const handleBack = () => {
    navigate(-1);
  };

  // Toggle image gallery
  const toggleGallery = () => {
    setShowGallery(!showGallery);
  };

  // Insert image into editor
  const handleInsertImage = (imageUrl: string) => {
    // This function will be implemented to insert images at cursor position
    const imageHtml = `<img src="${imageUrl}" alt="Content image" style="max-width: 100%; height: auto; margin: 1rem 0;" />`;
    setContent(prev => prev + imageHtml); // Simple implementation - in reality would insert at cursor
    setShowGallery(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <DashboardContent>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<Iconify icon="eva:arrow-back-fill" />}
            onClick={handleBack}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
          
          <Typography variant="h4" gutterBottom>
            Edit Section
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Edit your section content and layout. Use the toolbar to format text and add media.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={showGallery ? 8 : 12}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Section Title
                </Typography>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '1.2rem',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '8px',
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="eva:image-fill" />}
                    onClick={toggleGallery}
                  >
                    {showGallery ? 'Hide Gallery' : 'Show Gallery'}
                  </Button>
                </Stack>
              </Box>
              
              <SectionEditor 
                content={content} 
                onChange={handleContentChange} 
              />
            </Card>
          </Grid>
          
          {showGallery && (
            <Grid item xs={12} md={4}>
              <ImageGallery onSelectImage={handleInsertImage} />
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={isSaving}
                startIcon={isSaving ? <CircularProgress size={20} /> : <Iconify icon="eva:save-fill" />}
                sx={{ 
                  borderRadius: '8px',
                  px: 3,
                  py: 1,
                  boxShadow: theme.customShadows.primary
                }}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </DashboardContent>
  );
}