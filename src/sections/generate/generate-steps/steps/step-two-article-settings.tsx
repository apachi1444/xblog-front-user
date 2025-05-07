import type { UseFormReturn } from 'react-hook-form';

import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Box, Grid, Button, Switch, Divider, Typography, FormControlLabel, CircularProgress } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { SectionGenerationAnimation } from 'src/components/generate-article/SectionGenerationAnimation';

import { useArticleSettingsForm } from '../../hooks/useArticleSettingsForm';
import { FormDropdown } from '../../../../components/generate-article/FormDropdown';
import { FormContainer } from '../../../../components/generate-article/FormContainer';
import { FormAutocompleteDropdown } from '../../../../components/generate-article/FormAutocompleteDropdown';

import type { Step2FormData } from '../../schemas';

export interface Step2State {
  form: UseFormReturn<Step2FormData>
  generation: {
    tableOfContents: {
      isGenerating: boolean
      isGenerated: boolean
      onGenerate: () => Promise<void>
    }
  }
}
interface Step2ArticleSettingsProps {
  state : Step2State
}

export function Step2ArticleSettings({ state }: Step2ArticleSettingsProps) {
  const { t } = useTranslation();
  // Get options and form handling from the hook
  const { options, handleGenerateTableOfContents: hookGenerateTableOfContents } = useArticleSettingsForm();

  const {
    form,
    generation: {
      tableOfContents: { isGenerating: isGeneratingTableOfContents, isGenerated: isGeneratedTableOfContents, onGenerate: onGenerateTableOfContents },
    },
  } = state

  // Define variables for button state
  const isGenerating = isGeneratingTableOfContents;

  const {
    register,
    watch,
    formState: { errors },
    setValue,
    control,
  } = form

  const articleType = watch("articleType")
  const articleSize = watch("articleSize")
  const toneOfVoice = watch("toneOfVoice")
  const includeVideos = watch('includeVideos');

  // Use options from the hook
  const {
    articleTypeOptions,
    articleSizeOptions,
    toneOptions,
    povOptions,
    aiCleaningOptions,
    imageQualityOptions,
    imagePlacementOptions,
    imageStyleOptions,
    linkingOptions,
    externalLinkingOptions,
    numberOptions,
    videoNumberOptions
  } = options;


  return (
    <Grid container spacing={3}>
      <SectionGenerationAnimation
        show={isGeneratingTableOfContents || isGeneratedTableOfContents}
        onComplete={() => {
          // Automatically navigate to next step when generation is complete
          if (isGeneratedTableOfContents) {
            // Use setTimeout to ensure the animation completes before navigating
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('generate-next-step'));
            }, 500);
          }
        }}
      />

      <Grid item xs={12}>
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
                <FormDropdown
                  label={t('article.settings.articleType', "Article Type")}
                  tooltipText={t('article.tooltips.articleType', "Choose the type of article that best fits your content goals")}
                  options={articleTypeOptions}
                  {...register("articleType", {
                    onChange: (e) => {
                      setValue("articleType", e.target.value, { shouldValidate: true });
                    }
                  })}
                  placeholder={t('article.placeholders.select', "Select article type")}
                  error={!!errors.articleType}
                  helperText={errors.articleType?.message}
                  value={articleType}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                    label={t('article.settings.articleSize', "Article Size")}
                    tooltipText={t('article.tooltips.articleSize', "Determines the length and depth of your article")}
                    placeholder={t('article.placeholders.select', "Select article size")}
                    options={articleSizeOptions}
                    {...register("articleSize", {
                      onChange: (e) => {
                        setValue("articleSize", e.target.value, { shouldValidate: true });
                      }
                    })}
                    error={!!errors.articleSize}
                    helperText={errors.articleSize?.message}
                    value={articleSize}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label={t('article.settings.toneOfVoice', "Tone of Voice")}
                  tooltipText={t('article.tooltips.toneOfVoice', "Sets the overall tone and style of writing for your article")}
                  placeholder={t('article.placeholders.select', "Select tone")}
                  options={toneOptions}
                  {...register("toneOfVoice", {
                    onChange: (e) => {
                      setValue("toneOfVoice", e.target.value, { shouldValidate: true });
                    }
                  })}
                  error={!!errors.toneOfVoice}
                  helperText={errors.toneOfVoice?.message}
                  value={toneOfVoice}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label={t('article.settings.pointOfView', "Point of View")}
                  tooltipText={t('article.tooltips.pointOfView', "Determines the perspective from which your article is written")}
                  options={povOptions}
                  {...register("pointOfView", {
                    onChange: (e) => {
                      setValue("pointOfView", e.target.value, { shouldValidate: true });
                    }
                  })}
                  placeholder={t('article.placeholders.select', "Select point of view")}
                  error={!!errors.pointOfView}
                  helperText={errors.pointOfView?.message}
                  value={watch("pointOfView")}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label={t('article.settings.aiContentCleaning', "AI Content Cleaning")}
                  tooltipText={t('article.tooltips.aiContentCleaning', "Controls how AI-generated text is processed to sound more natural")}
                  options={aiCleaningOptions}
                  {...register("aiContentCleaning", {
                    onChange: (e) => {
                      setValue("aiContentCleaning", e.target.value, { shouldValidate: true });
                    }
                  })}
                  placeholder={t('article.placeholders.select', "Select cleaning level")}
                  error={!!errors.aiContentCleaning}
                  helperText={errors.aiContentCleaning?.message}
                  value={watch("aiContentCleaning")}
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
                <FormDropdown
                  label={t('article.settings.imageQuality', "Image Quality")}
                  tooltipText={t('article.tooltips.imageQuality', "Sets the resolution and quality of generated images")}
                  options={imageQualityOptions}
                  {...register("imageSettingsQuality", {
                    onChange: (e) => {
                      setValue("imageSettingsQuality", e.target.value, { shouldValidate: true });
                    }
                  })}
                  placeholder={t('article.placeholders.select', "Select image quality")}
                  error={!!errors.imageSettingsQuality}
                  helperText={errors.imageSettingsQuality?.message}
                  value={watch("imageSettingsQuality")}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label={t('article.settings.imagePlacement', "Image Placement")}
                  tooltipText={t('article.tooltips.imagePlacement', "Determines where images will be placed within your article")}
                  options={imagePlacementOptions}
                  {...register("imageSettingsPlacement", {
                    onChange: (e) => {
                      setValue("imageSettingsPlacement", e.target.value, { shouldValidate: true });
                    }
                  })}
                  placeholder={t('article.placeholders.select', "Select image placement")}
                  error={!!errors.imageSettingsPlacement}
                  helperText={errors.imageSettingsPlacement?.message}
                  value={watch("imageSettingsPlacement")}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label={t('article.settings.imageStyle', "Image Style")}
                  tooltipText={t('article.tooltips.imageStyle', "Sets the visual style for generated images")}
                  options={imageStyleOptions}
                  {...register("imageSettingsStyle", {
                    onChange: (e) => {
                      setValue("imageSettingsStyle", e.target.value, { shouldValidate: true });
                    }
                  })}
                  placeholder={t('article.placeholders.select', "Select image style")}
                  error={!!errors.imageSettingsStyle}
                  helperText={errors.imageSettingsStyle?.message}
                  value={watch("imageSettingsStyle")}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label={t('article.settings.numberOfImages', "Number of Images")}
                  tooltipText={t('article.tooltips.numberOfImages', "Total number of images to include in your article")}
                  options={numberOptions}
                  {...register("imageSettingsCount", {
                    onChange: (e) => {
                      setValue("imageSettingsCount", e.target.value, { shouldValidate: true });
                    }
                  })}
                  placeholder={t('article.placeholders.select', "Select number")}
                  error={!!errors.imageSettingsCount}
                  helperText={errors.imageSettingsCount?.message}
                  value={watch("imageSettingsCount")}
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
                <FormDropdown
                  label={t('article.settings.numberOfVideos', "Number of Videos")}
                  tooltipText={t('article.tooltips.numberOfVideos', "Specify how many videos should be embedded in your article")}
                  options={videoNumberOptions}
                  {...register("numberOfVideos", {
                    onChange: (e) => {
                      setValue("numberOfVideos", e.target.value, { shouldValidate: true });
                    }
                  })}
                  placeholder={t('article.placeholders.select', "Select number")}
                  disabled={!includeVideos}
                  value={watch("numberOfVideos")}
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
                <FormDropdown
                  label={t('article.settings.internalLinking', "Internal Linking")}
                  tooltipText={t('article.tooltips.internalLinking', "Select which of your websites to link to within the article")}
                  options={linkingOptions}
                  {...register("internalLinking", {
                    onChange: (e) => {
                      setValue("internalLinking", e.target.value, { shouldValidate: true });
                    }
                  })}
                  placeholder={t('article.placeholders.select', "Select internal linking")}
                  error={!!errors.internalLinking}
                  helperText={errors.internalLinking?.message}
                  value={watch("internalLinking")}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormAutocompleteDropdown
                  label={t('article.settings.externalLinking', "External Linking")}
                  tooltipText={t('article.tooltips.externalLinking', "Choose which external sources to reference in your article or type your own")}
                  options={externalLinkingOptions}
                  placeholder={t('article.placeholders.selectOrType', "Select or type external linking")}
                  error={!!errors.externalLinking}
                  helperText={errors.externalLinking?.message}
                  value={watch("externalLinking")}
                  onChange={(newValue) => {
                    setValue("externalLinking", newValue, { shouldValidate: true });
                  }}
                  freeSolo
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
              onClick={() => hookGenerateTableOfContents(onGenerateTableOfContents)}
              disabled={isGenerating}
              startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="mdi:table-of-contents" />}
              sx={{
                borderRadius: '28px',
                px: 4
              }}
            >
              {isGenerating
                ? t('article.buttons.generating', 'Generating...')
                : t('article.buttons.generateTableOfContents', 'Generate Table of Contents')}
            </Button>
          </Box>
        </FormContainer>
      </Grid>
    </Grid>
  )
};