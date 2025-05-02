import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';

import { Box, Grid, Button, Switch, Divider, Typography, FormControlLabel, CircularProgress } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { SectionGenerationAnimation } from 'src/components/generate-article/SectionGenerationAnimation';

import { FormDropdown } from '../../../../components/generate-article/FormDropdown';
import { FormContainer } from '../../../../components/generate-article/FormContainer';

// Define the form schema type
interface ArticleSettingsFormData {
  articleType: string;
  articleSize: string;
  toneOfVoice: string;
  pointOfView: string;
  aiContentCleaning: string;
  imageQuality: string;
  imagePlacement: string;
  imageStyle: string;
  numberOfImages: string;
  includeVideos: boolean;
  numberOfVideos: string;
  internalLinking: string;
  externalLinking: string;
}

// Add a new prop to receive the function that will set the table of contents
interface Step2ArticleSettingsProps {
  onNextStep?: () => void;
  onGenerateTableOfContents?: (tableOfContents: any) => void;
  isGeneratingSections?: boolean;
}


export function Step2ArticleSettings({ onNextStep, onGenerateTableOfContents, isGeneratingSections }: Step2ArticleSettingsProps) {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);

  // Options for dropdowns
  const articleTypeOptions = [
    { value: "how-to", label: t('article.type.howTo', "How-to guide") },
    { value: "listicle", label: t('article.type.listicle', "Listicle") },
    { value: "tutorial", label: t('article.type.tutorial', "Tutorial") },
    { value: "review", label: t('article.type.review', "Review") },
    { value: "case-study", label: t('article.type.caseStudy', "Case Study") }
  ];

  const articleSizeOptions = [
    { value: "small", label: t('article.size.small', "Small (1200 - 2400 words, 2-3 headings)") },
    { value: "medium", label: t('article.size.medium', "Medium (2400 - 3600 words, 4-5 headings)") },
    { value: "large", label: t('article.size.large', "Large (3600 - 5000 words, 6+ headings)") }
  ];

  const toneOptions = [
    { value: "friendly", label: t('article.tone.friendly', "Friendly") },
    { value: "professional", label: t('article.tone.professional', "Professional") },
    { value: "casual", label: t('article.tone.casual', "Casual") },
    { value: "formal", label: t('article.tone.formal', "Formal") },
    { value: "enthusiastic", label: t('article.tone.enthusiastic', "Enthusiastic") }
  ];

  const povOptions = [
    { value: "first-person", label: t('article.pov.firstPerson', "First Person (I, We)") },
    { value: "second-person", label: t('article.pov.secondPerson', "Second Person (You)") },
    { value: "third-person", label: t('article.pov.thirdPerson', "Third Person (He, She, They)") }
  ];

  const aiCleaningOptions = [
    { value: "no-removal", label: t('article.aiCleaning.none', "No AI Words Removal") },
    { value: "light", label: t('article.aiCleaning.light', "Light Cleaning") },
    { value: "moderate", label: t('article.aiCleaning.moderate', "Moderate Cleaning") },
    { value: "thorough", label: t('article.aiCleaning.thorough', "Thorough Cleaning") }
  ];

  const imageQualityOptions = [
    { value: "high", label: t('article.imageQuality.high', "High Quality (costs 20 tokens)") },
    { value: "optimized", label: t('article.imageQuality.optimized', "Optimized") },
    { value: "low", label: t('article.imageQuality.low', "Low Quality") }
  ];

  const imagePlacementOptions = [
    { value: "each-section", label: t('article.imagePlacement.eachSection', "Each Section") },
    { value: "after-h1", label: t('article.imagePlacement.afterH1', "After H1") },
    { value: "after-h2", label: t('article.imagePlacement.afterH2', "After H2") },
    { value: "none", label: t('article.imagePlacement.none', "None") }
  ];

  const imageStyleOptions = [
    { value: "normal", label: t('article.imageStyle.normal', "Normal") },
    { value: "cartoon", label: t('article.imageStyle.cartoon', "Cartoon") },
    { value: "anime", label: t('article.imageStyle.anime', "Anime") },
    { value: "realistic", label: t('article.imageStyle.realistic', "Realistic") },
    { value: "abstract", label: t('article.imageStyle.abstract', "Abstract") }
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
    { value: "none", label: t('article.linking.none', "None") },
    { value: "website1", label: t('article.linking.myWebsite', "My Website") },
    { value: "website2", label: t('article.linking.blogWebsite', "Blog Website") },
    { value: "website3", label: t('article.linking.ecommerce', "E-commerce Site") }
  ];

  const externalLinkingOptions = [
    { value: "none", label: t('article.externalLinking.none', "None") },
    { value: "wikipedia", label: t('article.externalLinking.wikipedia', "Wikipedia") },
    { value: "authority", label: t('article.externalLinking.authority', "Authority Sites") },
    { value: "news", label: t('article.externalLinking.news', "News Sources") }
  ];

  // Initialize form with react-hook-form
  const { control, handleSubmit, watch, formState: { errors } } = useForm<ArticleSettingsFormData>({
    defaultValues: {
      articleType: articleTypeOptions[0].value,
      articleSize: articleSizeOptions[0].value,
      toneOfVoice: toneOptions[0].value,
      pointOfView: povOptions[0].value,
      aiContentCleaning: aiCleaningOptions[0].value,
      imageQuality: imageQualityOptions[0].value,
      imagePlacement: imagePlacementOptions[0].value,
      imageStyle: imageStyleOptions[0].value,
      numberOfImages: numberOptions[0].value,
      includeVideos: false,
      numberOfVideos: videoNumberOptions[0].value,
      internalLinking: linkingOptions[0].value,
      externalLinking: externalLinkingOptions[0].value,
    },
    mode: 'onBlur',
  });

  // Watch the includeVideos field to conditionally render the number of videos dropdown
  const includeVideos = watch('includeVideos');

  // Handle generate table of contents
  const handleGenerateTableOfContents = async (data: ArticleSettingsFormData) => {
    setIsGenerating(true);

    try {
      if (onGenerateTableOfContents) {
        // Pass the form data to the parent component
        onGenerateTableOfContents({
          title: "Generated Table of Contents",
          sections: [],
          settings: data // Include all form data
        });
      }
    } catch (error) {
      toast.error(t('article.error.generateTableOfContents', 'Error generating table of contents'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <SectionGenerationAnimation
        show={isGeneratingSections || false}
        onComplete={() => {}} // We don't need to do anything on complete as the parent component handles it
      />

      <Grid item xs={12}>
        <form onSubmit={handleSubmit(handleGenerateTableOfContents)}>
          <FormContainer title={t('article.settings.title', "Article Settings")}>
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
                {t('article.settings.mainSettings', "Main Settings")}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="articleType"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <FormDropdown
                        label={t('article.settings.articleType', "Article Type")}
                        tooltipText={t('article.tooltips.articleType', "Choose the type of article that best fits your content goals")}
                        options={articleTypeOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('article.placeholders.select', "Select article type")}
                        error={!!fieldState.error}
                        helperText={fieldState.error ? t('article.errors.required', "Required field") : ""}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="articleSize"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <FormDropdown
                        label={t('article.settings.articleSize', "Article Size")}
                        tooltipText={t('article.tooltips.articleSize', "Determines the length and depth of your article")}
                        options={articleSizeOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('article.placeholders.select', "Select article size")}
                        error={!!fieldState.error}
                        helperText={fieldState.error ? t('article.errors.required', "Required field") : ""}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="toneOfVoice"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <FormDropdown
                        label={t('article.settings.toneOfVoice', "Tone of Voice")}
                        tooltipText={t('article.tooltips.toneOfVoice', "Sets the overall tone and style of writing for your article")}
                        options={toneOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('article.placeholders.select', "Select tone")}
                        error={!!fieldState.error}
                        helperText={fieldState.error ? t('article.errors.required', "Required field") : ""}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="pointOfView"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <FormDropdown
                        label={t('article.settings.pointOfView', "Point of View")}
                        tooltipText={t('article.tooltips.pointOfView', "Determines the perspective from which your article is written")}
                        options={povOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('article.placeholders.select', "Select point of view")}
                        error={!!fieldState.error}
                        helperText={fieldState.error ? t('article.errors.required', "Required field") : ""}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="aiContentCleaning"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <FormDropdown
                        label={t('article.settings.aiContentCleaning', "AI Content Cleaning")}
                        tooltipText={t('article.tooltips.aiContentCleaning', "Controls how AI-generated text is processed to sound more natural")}
                        options={aiCleaningOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('article.placeholders.select', "Select cleaning level")}
                        error={!!fieldState.error}
                        helperText={fieldState.error ? t('article.errors.required', "Required field") : ""}
                      />
                    )}
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
                {t('article.settings.mediaSettings', "Media Settings")}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="imageQuality"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <FormDropdown
                        label={t('article.settings.imageQuality', "Image Quality")}
                        tooltipText={t('article.tooltips.imageQuality', "Sets the resolution and quality of generated images")}
                        options={imageQualityOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('article.placeholders.select', "Select image quality")}
                        error={!!fieldState.error}
                        helperText={fieldState.error ? t('article.errors.required', "Required field") : ""}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="imagePlacement"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <FormDropdown
                        label={t('article.settings.imagePlacement', "Image Placement")}
                        tooltipText={t('article.tooltips.imagePlacement', "Determines where images will be placed within your article")}
                        options={imagePlacementOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('article.placeholders.select', "Select image placement")}
                        error={!!fieldState.error}
                        helperText={fieldState.error ? t('article.errors.required', "Required field") : ""}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="imageStyle"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <FormDropdown
                        label={t('article.settings.imageStyle', "Image Style")}
                        tooltipText={t('article.tooltips.imageStyle', "Sets the visual style for generated images")}
                        options={imageStyleOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('article.placeholders.select', "Select image style")}
                        error={!!fieldState.error}
                        helperText={fieldState.error ? t('article.errors.required', "Required field") : ""}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="numberOfImages"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <FormDropdown
                        label={t('article.settings.numberOfImages', "Number of Images")}
                        tooltipText={t('article.tooltips.numberOfImages', "Total number of images to include in your article")}
                        options={numberOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('article.placeholders.select', "Select number")}
                        error={!!fieldState.error}
                        helperText={fieldState.error ? t('article.errors.required', "Required field") : ""}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Controller
                      name="includeVideos"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                              color="primary"
                            />
                          }
                          label={t('article.settings.includeVideos', "Include Videos")}
                        />
                      )}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Controller
                    name="numberOfVideos"
                    control={control}
                    render={({ field }) => (
                      <FormDropdown
                        label={t('article.settings.numberOfVideos', "Number of Videos")}
                        tooltipText={t('article.tooltips.numberOfVideos', "Specify how many videos should be embedded in your article")}
                        options={videoNumberOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('article.placeholders.select', "Select number")}
                        disabled={!includeVideos}
                      />
                    )}
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
                {t('article.settings.linkingSettings', "Linking Settings")}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="internalLinking"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <FormDropdown
                        label={t('article.settings.internalLinking', "Internal Linking")}
                        tooltipText={t('article.tooltips.internalLinking', "Select which of your websites to link to within the article")}
                        options={linkingOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('article.placeholders.select', "Select internal linking")}
                        error={!!fieldState.error}
                        helperText={fieldState.error ? t('article.errors.required', "Required field") : ""}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="externalLinking"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <FormDropdown
                        label={t('article.settings.externalLinking', "External Linking")}
                        tooltipText={t('article.tooltips.externalLinking', "Choose which external sources to reference in your article")}
                        options={externalLinkingOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('article.placeholders.select', "Select external linking")}
                        error={!!fieldState.error}
                        helperText={fieldState.error ? t('article.errors.required', "Required field") : ""}
                      />
                    )}
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
                type="submit"
                disabled={isGenerating || isGeneratingSections}
                startIcon={isGenerating || isGeneratingSections ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="mdi:table-of-contents" />}
                sx={{
                  borderRadius: '28px',
                  px: 4
                }}
              >
                {isGenerating || isGeneratingSections
                  ? t('article.buttons.generating', 'Generating...')
                  : t('article.buttons.generateTableOfContents', 'Generate Table of Contents')}
              </Button>
            </Box>
          </FormContainer>
        </form>
      </Grid>
    </Grid>
  )
};