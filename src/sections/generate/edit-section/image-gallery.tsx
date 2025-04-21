/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';

import { 
  Box, 
  Card, 
  Grid, 
  Paper, 
  Button, 
  styled, 
  useTheme, 
  TextField, 
  Typography,
  InputAdornment,
  CircularProgress
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface ImageGalleryProps {
  onSelectImage: (imageUrl: string) => void;
}

const ImageContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.customShadows.z16,
  },
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: theme.palette.common.white,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 0.2s',
  '&:hover': {
    opacity: 1,
  },
}));

export function ImageGallery({ onSelectImage }: ImageGalleryProps) {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock images for demonstration
  const mockImages = [
    { id: '1', url: '/assets/images/placeholder1.jpg', title: 'Image 1' },
    { id: '2', url: '/assets/images/placeholder2.jpg', title: 'Image 2' },
    { id: '3', url: '/assets/images/placeholder3.jpg', title: 'Image 3' },
    { id: '4', url: '/assets/images/placeholder4.jpg', title: 'Image 4' },
    { id: '5', url: '/assets/images/placeholder5.jpg', title: 'Image 5' },
    { id: '6', url: '/assets/images/placeholder6.jpg', title: 'Image 6' },
  ];
  
  // Filter images based on search term
  const filteredImages = mockImages.filter(image => 
    image.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // Create a fake URL for the uploaded image
      const fakeImageUrl = previewUrl;
      
      // Reset state
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsUploading(false);
      
      // Select the uploaded image
      if (fakeImageUrl) {
        onSelectImage(fakeImageUrl);
      }
    }, 1500);
  };
  
  return (
    <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Image Gallery
      </Typography>
      
      <TextField
        fullWidth
        placeholder="Search images..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" />
            </InputAdornment>
          ),
        }}
      />
      
      <Box sx={{ mb: 3 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-image-button"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-image-button">
          <Button
            variant="outlined"
            component="span"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            sx={{ mb: 2 }}
            fullWidth
          >
            Upload New Image
          </Button>
        </label>
        
        {previewUrl && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img 
              src={previewUrl} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: 200, 
                borderRadius: theme.shape.borderRadius 
              }} 
            />
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={isUploading}
              startIcon={isUploading ? <CircularProgress size={20} /> : <Iconify icon="eva:checkmark-fill" />}
              sx={{ mt: 1 }}
            >
              {isUploading ? 'Uploading...' : 'Use This Image'}
            </Button>
          </Box>
        )}
      </Box>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Grid container spacing={2}>
          {filteredImages.map((image) => (
            <Grid item xs={6} key={image.id}>
              <ImageContainer onClick={() => onSelectImage(image.url)}>
                <Box
                  component="img"
                  src={image.url}
                  alt={image.title}
                  sx={{
                    width: '100%',
                    height: 120,
                    objectFit: 'cover',
                  }}
                />
                <ImageOverlay>
                  <Typography variant="caption">Select</Typography>
                </ImageOverlay>
              </ImageContainer>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );
}