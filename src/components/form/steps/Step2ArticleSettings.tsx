import React, { useState } from 'react';

import { Box , Grid, Button, Switch, Divider, Typography, FormControlLabel } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { FormDropdown } from '../FormDropdown';
import { FormContainer } from '../FormContainer';

interface Step2ArticleSettingsProps {
  // Props will be added as needed in the future
}

export function Step2ArticleSettings(props: Step2ArticleSettingsProps = {}) {
  // State for form values
  const [articleType, setArticleType] = useState('');
  const [articleSize, setArticleSize] = useState('');
  const [toneOfVoice, setToneOfVoice] = useState('');
  const [pointOfView, setPointOfView] = useState('');
  const [aiContentCleaning, setAiContentCleaning] = useState('');
  
  const [imageQuality, setImageQuality] = useState('');
  const [imagePlacement, setImagePlacement] = useState('');
  const [imageStyle, setImageStyle] = useState('');
  const [numberOfImages, setNumberOfImages] = useState('');
  const [includeVideos, setIncludeVideos] = useState(false);
  const [numberOfVideos, setNumberOfVideos] = useState('');
  
  const [internalLinking, setInternalLinking] = useState('');
  const [externalLinking, setExternalLinking] = useState('');

  // Options for dropdowns
  const articleTypeOptions = [
    { value: "how-to", label: "How-to guide" },
    { value: "listicle", label: "Listicle" },
    { value: "tutorial", label: "Tutorial" },
    { value: "review", label: "Review" },
    { value: "case-study", label: "Case Study" }
  ];

  const articleSizeOptions = [
    { value: "small", label: "Small (1200 - 2400 words, 2-3 headings)" },
    { value: "medium", label: "Medium (2400 - 3600 words, 4-5 headings)" },
    { value: "large", label: "Large (3600 - 5000 words, 6+ headings)" }
  ];

  const toneOptions = [
    { value: "friendly", label: "Friendly" },
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "formal", label: "Formal" },
    { value: "enthusiastic", label: "Enthusiastic" }
  ];

  const povOptions = [
    { value: "first-person", label: "First Person (I, We)" },
    { value: "second-person", label: "Second Person (You)" },
    { value: "third-person", label: "Third Person (He, She, They)" }
  ];

  const aiCleaningOptions = [
    { value: "no-removal", label: "No AI Words Removal" },
    { value: "light", label: "Light Cleaning" },
    { value: "moderate", label: "Moderate Cleaning" },
    { value: "thorough", label: "Thorough Cleaning" }
  ];

  const imageQualityOptions = [
    { value: "high", label: "High Quality (costs 20 tokens)" },
    { value: "optimized", label: "Optimized" },
    { value: "low", label: "Low Quality" }
  ];

  const imagePlacementOptions = [
    { value: "each-section", label: "Each Section" },
    { value: "after-h1", label: "After H1" },
    { value: "after-h2", label: "After H2" },
    { value: "none", label: "None" }
  ];

  const imageStyleOptions = [
    { value: "normal", label: "Normal" },
    { value: "cartoon", label: "Cartoon" },
    { value: "anime", label: "Anime" },
    { value: "realistic", label: "Realistic" },
    { value: "abstract", label: "Abstract" }
  ];

  const numberOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" }
  ];

  const videoNumberOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" }
  ];

  const linkingOptions = [
    { value: "none", label: "None" },
    { value: "website1", label: "My Website" },
    { value: "website2", label: "Blog Website" },
    { value: "website3", label: "E-commerce Site" }
  ];

  const externalLinkingOptions = [
    { value: "none", label: "None" },
    { value: "wikipedia", label: "Wikipedia" },
    { value: "authority", label: "Authority Sites" },
    { value: "news", label: "News Sources" }
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormContainer title="Article Settings">
          {/* Main Settings Section - Grid of 4 */}
          <Box sx={{ width: '100%', mb: 4 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2, 
                fontWeight: 600, 
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: '100%'
              }}
            >
              <Iconify icon="mdi:cog-outline" width={20} height={20} />
              Main Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="Article Type"
                  options={articleTypeOptions}
                  value={articleType}
                  onChange={(e) => setArticleType(e.target.value as string)}
                  placeholder="Select article type"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="Article Size"
                  options={articleSizeOptions}
                  value={articleSize}
                  onChange={(e) => setArticleSize(e.target.value as string)}
                  placeholder="Select article size"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="Tone of Voice"
                  options={toneOptions}
                  value={toneOfVoice}
                  onChange={(e) => setToneOfVoice(e.target.value as string)}
                  placeholder="Select tone"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="Point of View"
                  options={povOptions}
                  value={pointOfView}
                  onChange={(e) => setPointOfView(e.target.value as string)}
                  placeholder="Select point of view"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="AI Content Cleaning"
                  options={aiCleaningOptions}
                  value={aiContentCleaning}
                  onChange={(e) => setAiContentCleaning(e.target.value as string)}
                  placeholder="Select cleaning level"
                />
              </Grid>
            </Grid>
          </Box>
          
          <Divider sx={{ my: 3, width: '100%' }} />
          
          {/* Media Settings Section - Grid of 4 */}
          <Box sx={{ width: '100%', mb: 4 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2, 
                fontWeight: 600, 
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: '100%'
              }}
            >
              <Iconify icon="mdi:image-outline" width={20} height={20} />
              Media Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="Image Quality"
                  options={imageQualityOptions}
                  value={imageQuality}
                  onChange={(e) => setImageQuality(e.target.value as string)}
                  placeholder="Select image quality"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="Image Placement"
                  options={imagePlacementOptions}
                  value={imagePlacement}
                  onChange={(e) => setImagePlacement(e.target.value as string)}
                  placeholder="Select image placement"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="Image Style"
                  options={imageStyleOptions}
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value as string)}
                  placeholder="Select image style"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="Number of Images"
                  options={numberOptions}
                  value={numberOfImages}
                  onChange={(e) => setNumberOfImages(e.target.value as string)}
                  placeholder="Select number"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={includeVideos}
                      onChange={(e) => setIncludeVideos(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Include Videos"
                  sx={{ ml: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="Number of Videos"
                  options={videoNumberOptions}
                  value={numberOfVideos}
                  onChange={(e) => setNumberOfVideos(e.target.value as string)}
                  placeholder="Select number"
                  disabled={!includeVideos}
                />
              </Grid>
            </Grid>
          </Box>
          
          <Divider sx={{ my: 3, width: '100%' }} />
          
          {/* Linking Settings Section - Grid of 2 */}
          <Box sx={{ width: '100%', mb: 4 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2, 
                fontWeight: 600, 
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: '100%'
              }}
            >
              <Iconify icon="mdi:link-variant" width={20} height={20} />
              Linking Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormDropdown
                  label="Internal Linking"
                  options={linkingOptions}
                  value={internalLinking}
                  onChange={(e) => setInternalLinking(e.target.value as string)}
                  placeholder="Select internal linking"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormDropdown
                  label="External Linking"
                  options={externalLinkingOptions}
                  value={externalLinking}
                  onChange={(e) => setExternalLinking(e.target.value as string)}
                  placeholder="Select external linking"
                />
              </Grid>
            </Grid>
          </Box>
          
          {/* Action Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, width: '100%' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mdi:table-of-contents" />}
              sx={{
                borderRadius: '24px',
                px: 4,
                py: 1,
                fontWeight: 600
              }}
            >
              Generate Table of Contents
            </Button>
          </Box>
        </FormContainer>
      </Grid>
    </Grid>
  );
}