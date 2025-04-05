import React, { useState } from 'react';

import { Box, Grid, Button, Switch, Divider, Typography, FormControlLabel, CircularProgress } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { FormDropdown } from '../FormDropdown';
import { FormContainer } from '../FormContainer';

// Add a new prop to receive the function that will set the table of contents
// Update the interface to include the onGenerateTableOfContents prop
interface Step2ArticleSettingsProps {
  onNextStep?: () => void;
  onGenerateTableOfContents?: (tableOfContents: any) => void;
}


export function Step2ArticleSettings({ onNextStep, onGenerateTableOfContents }: Step2ArticleSettingsProps) {
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

  // Add the missing isGenerated state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  // Options for dropdowns remain the same
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

  
// Add error state
const [errors, setErrors] = useState({
  articleType: false,
  articleSize: false,
  toneOfVoice: false,
  pointOfView: false,
  aiContentCleaning: false,
  imageQuality: false,
  imagePlacement: false,
  imageStyle: false,
  numberOfImages: false,
  internalLinking: false,
  externalLinking: false,
});

// Update error states when input values change
React.useEffect(() => {
  if (articleType) {
    setErrors(prev => ({ ...prev, articleType: false }));
  }
}, [articleType]);

React.useEffect(() => {
  if (articleSize) {
    setErrors(prev => ({ ...prev, articleSize: false }));
  }
}, [articleSize]);

React.useEffect(() => {
  if (toneOfVoice) {
    setErrors(prev => ({ ...prev, toneOfVoice: false }));
  }
}, [toneOfVoice]);

React.useEffect(() => {
  if (pointOfView) {
    setErrors(prev => ({ ...prev, pointOfView: false }));
  }
}, [pointOfView]);

React.useEffect(() => {
  if (aiContentCleaning) {
    setErrors(prev => ({ ...prev, aiContentCleaning: false }));
  }
}, [aiContentCleaning]);

React.useEffect(() => {
  if (imageQuality) {
    setErrors(prev => ({ ...prev, imageQuality: false }));
  }
}, [imageQuality]);

React.useEffect(() => {
  if (imagePlacement) {
    setErrors(prev => ({ ...prev, imagePlacement: false }));
  }
}, [imagePlacement]);

React.useEffect(() => {
  if (imageStyle) {
    setErrors(prev => ({ ...prev, imageStyle: false }));
  }
}, [imageStyle]);

React.useEffect(() => {
  if (numberOfImages) {
    setErrors(prev => ({ ...prev, numberOfImages: false }));
  }
}, [numberOfImages]);

React.useEffect(() => {
  if (internalLinking) {
    setErrors(prev => ({ ...prev, internalLinking: false }));
  }
}, [internalLinking]);

React.useEffect(() => {
  if (externalLinking) {
    setErrors(prev => ({ ...prev, externalLinking: false }));
  }
}, [externalLinking]);

// Validation function
const validateFields = () => {
  const newErrors = {
    articleType: !articleType,
    articleSize: !articleSize,
    toneOfVoice: !toneOfVoice,
    pointOfView: !pointOfView,
    aiContentCleaning: !aiContentCleaning,
    imageQuality: !imageQuality,
    imagePlacement: !imagePlacement,
    imageStyle: !imageStyle,
    numberOfImages: !numberOfImages,
    internalLinking: !internalLinking,
    externalLinking: !externalLinking,
  };
  
  setErrors(newErrors);
  
  // Return true if all fields are valid
  return !Object.values(newErrors).some(error => error);
};

// Handle generate table of contents with validation
const handleGenerateTableOfContentsWithValidation = async () => {
  if (validateFields()) {
    setIsGenerating(true);
    
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate fake table of contents data
      const generatedTableOfContents = {
        title: "How to Optimize Your Website for Better SEO Performance",
        sections: [
          {
            id: 1,
            title: "Introduction to SEO Optimization",
            content: "Brief overview of SEO and why it matters for website performance."
          },
          {
            id: 2,
            title: "Understanding Search Engine Algorithms",
            content: "Explanation of how search engines rank websites and what factors influence rankings."
          },
          {
            id: 3,
            title: "On-Page SEO Techniques",
            subsections: [
              { id: 3.1, title: "Keyword Research and Implementation", content: "How to find and use the right keywords." },
              { id: 3.2, title: "Content Optimization", content: "Creating content that ranks well in search engines." },
              { id: 3.3, title: "Meta Tags and Descriptions", content: "Optimizing HTML elements for better SEO." }
            ]
          },
          {
            id: 4,
            title: "Off-Page SEO Strategies",
            content: "Building backlinks and improving domain authority."
          },
          {
            id: 5,
            title: "Technical SEO Improvements",
            subsections: [
              { id: 5.1, title: "Site Speed Optimization", content: "Making your website load faster." },
              { id: 5.2, title: "Mobile Responsiveness", content: "Ensuring your site works well on all devices." },
              { id: 5.3, title: "URL Structure and Site Architecture", content: "Creating a logical site structure." }
            ]
          },
          {
            id: 6,
            title: "Measuring SEO Success",
            content: "Tools and metrics to track your SEO performance."
          },
          {
            id: 7,
            title: "Conclusion",
            content: "Summary of key points and next steps for improving your website's SEO."
          }
        ]
      };
      
      // Pass the generated data to the parent component
      if (onGenerateTableOfContents) {
        onGenerateTableOfContents(generatedTableOfContents);
      }
      
      // Set generated to true
      setIsGenerated(true);
      
      // After successful API call, navigate to next step
      if (onNextStep) {
        onNextStep();
      }
    } catch (error) {
      console.error('Error generating table of contents:', error);
    } finally {
      setIsGenerating(false);
    }
  };
};

  // Handle generate table of contents
  const handleGenerateTableOfContents = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate fake table of contents data
      const generatedTableOfContents = {
        title: "How to Optimize Your Website for Better SEO Performance",
        sections: [
          {
            id: 1,
            title: "Introduction to SEO Optimization",
            content: "Brief overview of SEO and why it matters for website performance."
          },
          {
            id: 2,
            title: "Understanding Search Engine Algorithms",
            content: "Explanation of how search engines rank websites and what factors influence rankings."
          },
          {
            id: 3,
            title: "On-Page SEO Techniques",
            subsections: [
              { id: 3.1, title: "Keyword Research and Implementation", content: "How to find and use the right keywords." },
              { id: 3.2, title: "Content Optimization", content: "Creating content that ranks well in search engines." },
              { id: 3.3, title: "Meta Tags and Descriptions", content: "Optimizing HTML elements for better SEO." }
            ]
          },
          {
            id: 4,
            title: "Off-Page SEO Strategies",
            content: "Building backlinks and improving domain authority."
          },
          {
            id: 5,
            title: "Technical SEO Improvements",
            subsections: [
              { id: 5.1, title: "Site Speed Optimization", content: "Making your website load faster." },
              { id: 5.2, title: "Mobile Responsiveness", content: "Ensuring your site works well on all devices." },
              { id: 5.3, title: "URL Structure and Site Architecture", content: "Creating a logical site structure." }
            ]
          },
          {
            id: 6,
            title: "Measuring SEO Success",
            content: "Tools and metrics to track your SEO performance."
          },
          {
            id: 7,
            title: "Conclusion",
            content: "Summary of key points and next steps for improving your website's SEO."
          }
        ]
      };
      
      // Pass the generated data to the parent component
      if (onGenerateTableOfContents) {
        onGenerateTableOfContents(generatedTableOfContents);
      }
      
      // Set generated to true
      setIsGenerated(true);
      
      // After successful API call, navigate to next step
      if (onNextStep) {
        onNextStep();
      }
    } catch (error) {
      console.error('Error generating table of contents:', error);
    } finally {
      setIsGenerating(false);
    }
  };

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
                  tooltipText="Choose the type of article that best fits your content goals"
                  options={articleTypeOptions}
                  value={articleType}
                  onChange={(e) => setArticleType(e.target.value as string)}
                  placeholder="Select article type"
                  error={errors.articleType}
                  helperText={errors.articleType ? "Required field" : ""}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="Article Size"
                  tooltipText="Determines the length and depth of your article"
                  options={articleSizeOptions}
                  value={articleSize}
                  onChange={(e) => setArticleSize(e.target.value as string)}
                  placeholder="Select article size"
                  error={errors.articleSize}
                  helperText={errors.articleSize ? "Required field" : ""}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="Tone of Voice"
                  tooltipText="Sets the overall tone and style of writing for your article"
                  options={toneOptions}
                  value={toneOfVoice}
                  onChange={(e) => setToneOfVoice(e.target.value as string)}
                  placeholder="Select tone"
                  error={errors.toneOfVoice}
                  helperText={errors.toneOfVoice ? "Required field" : ""}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="Point of View"
                  tooltipText="Determines the perspective from which your article is written"
                  options={povOptions}
                  value={pointOfView}
                  onChange={(e) => setPointOfView(e.target.value as string)}
                  placeholder="Select point of view"
                  error={errors.pointOfView}
                  helperText={errors.pointOfView ? "Required field" : ""}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="AI Content Cleaning"
                  tooltipText="Controls how AI-generated text is processed to sound more natural"
                  options={aiCleaningOptions}
                  value={aiContentCleaning}
                  onChange={(e) => setAiContentCleaning(e.target.value as string)}
                  placeholder="Select cleaning level"
                  error={errors.aiContentCleaning}
                  helperText={errors.aiContentCleaning ? "Required field" : ""}
                />
              </Grid>
            </Grid>
          </Box>
          
          <Divider sx={{ my: 1, width: '100%' }} />
          
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
                  tooltipText="Sets the resolution and quality of generated images"
                  options={imageQualityOptions}
                  value={imageQuality}
                  onChange={(e) => setImageQuality(e.target.value as string)}
                  placeholder="Select image quality"
                  error={errors.imageQuality}
                  helperText={errors.imageQuality ? "Required field" : ""}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="Image Placement"
                  tooltipText="Determines where images will be placed within your article"
                  options={imagePlacementOptions}
                  value={imagePlacement}
                  onChange={(e) => setImagePlacement(e.target.value as string)}
                  placeholder="Select image placement"
                  error={errors.imagePlacement}
                  helperText={errors.imagePlacement ? "Required field" : ""}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="Image Style"
                  tooltipText="Sets the visual style for generated images"
                  options={imageStyleOptions}
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value as string)}
                  placeholder="Select image style"
                  error={errors.imageStyle}
                  helperText={errors.imageStyle ? "Required field" : ""}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="Number of Images"
                  tooltipText="Total number of images to include in your article"
                  options={numberOptions}
                  value={numberOfImages}
                  onChange={(e) => setNumberOfImages(e.target.value as string)}
                  placeholder="Select number"
                  error={errors.numberOfImages}
                  helperText={errors.numberOfImages ? "Required field" : ""}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={includeVideos}
                        onChange={(e) => setIncludeVideos(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Include Videos"
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label="Number of Videos"
                  tooltipText="Specify how many videos should be embedded in your article"
                  options={videoNumberOptions}
                  value={numberOfVideos}
                  onChange={(e) => setNumberOfVideos(e.target.value as string)}
                  placeholder="Select number"
                  disabled={!includeVideos}
                />
              </Grid>
            </Grid>
          </Box>
          
          <Divider sx={{ my: 1, width: '100%' }} />
          
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
                  tooltipText="Select which of your websites to link to within the article"
                  options={linkingOptions}
                  value={internalLinking}
                  onChange={(e) => setInternalLinking(e.target.value as string)}
                  placeholder="Select internal linking"
                  error={errors.internalLinking}
                  helperText={errors.internalLinking ? "Required field" : ""}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormDropdown
                  label="External Linking"
                  tooltipText="Choose which external sources to reference in your article"
                  options={externalLinkingOptions}
                  value={externalLinking}
                  onChange={(e) => setExternalLinking(e.target.value as string)}
                  placeholder="Select external linking"
                  error={errors.externalLinking}
                  helperText={errors.externalLinking ? "Required field" : ""}
                />
              </Grid>
            </Grid>
          </Box>
          
          {/* Generate Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleGenerateTableOfContentsWithValidation}
              disabled={isGenerating}
              startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="mdi:table-of-contents" />}
              sx={{ 
                borderRadius: '28px',
                px: 4
              }}
            >
              {isGenerating ? 'Generating...' : 'Generate Table of Contents'}
            </Button>
          </Box>
          
          {/* Next Step Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={onNextStep}
              disabled={!isGenerated}
              endIcon={<Iconify icon="mdi:arrow-right" />}
            >
              Next Step
            </Button>
          </Box>
        </FormContainer>
      </Grid>
    </Grid>
  );
}