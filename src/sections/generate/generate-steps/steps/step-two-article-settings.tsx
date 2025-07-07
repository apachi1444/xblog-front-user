
import { useTranslation } from 'react-i18next';
import { useWatch, Controller, useFormContext } from 'react-hook-form';

import { Box, Grid, Button, Switch, Divider, Typography, FormControlLabel, CircularProgress } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { LinkManagementSection } from 'src/components/generate-article/LinkManagementSection';
import { SectionGenerationAnimation } from 'src/components/generate-article/SectionGenerationAnimation';

import { useLinkGeneration } from '../../hooks/useLinkGeneration';
import { useArticleSettingsForm } from '../../hooks/useArticleSettingsForm';
import { FormDropdown } from '../../../../components/generate-article/FormDropdown';
import { FormContainer } from '../../../../components/generate-article/FormContainer';

import type { ArticleSection, GenerateArticleFormData } from '../../schemas';

interface Step2ArticleSettingsProps {
  isGenerating: boolean
  isGenerated: boolean
  onGenerate: () => Promise<ArticleSection[]>
  onRegenerateRequest?: () => void
  setActiveStep: (step: number) => void
}

export function Step2ArticleSettings({ isGenerated, isGenerating, onGenerate, onRegenerateRequest, setActiveStep }: Step2ArticleSettingsProps) {
  const { t } = useTranslation();
  const { options } = useArticleSettingsForm();
  const {
    isGeneratingInternal,
    isGeneratingExternal,
    generateInternalLinks,
    generateExternalLinks,
  } = useLinkGeneration();

  const {
    register,
    watch,
    formState: { errors },
    setValue,
    control,
  } = useFormContext<GenerateArticleFormData>()

  // Check if sections have already been generated - use isGenerated prop instead of form data
  // This ensures the button shows "Generate" initially and "Regenerate" only after successful generation
  const hasGeneratedSections = isGenerated;

  const articleType = useWatch({
    control,
    name: 'step2.articleType'
  })

  const articleSize = useWatch({
    control,
    name: 'step2.articleSize'
  })

  const toneOfVoice = useWatch({
    control,
    name: 'step2.toneOfVoice'
  })

  // Use options from the hook
  const {
    articleTypeOptions,
    articleSizeOptions,
    toneOptions,
    povOptions,
  } = options;


  return (
    <Grid container spacing={3}>
      <SectionGenerationAnimation
        show={isGenerating}
        onComplete={() => {
          setActiveStep(2);
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
                  {...register("step2.articleType", {
                    onChange: (e) => {
                      setValue("step2.articleType", e.target.value, { shouldValidate: true });
                    }
                  })}
                  placeholder={t('article.placeholders.select', "Select article type")}
                  error={!!errors.step2?.articleType}
                  helperText={errors.step2?.articleType?.message}
                  value={articleType}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                    label={t('article.settings.articleSize', "Article Size")}
                    tooltipText={t('article.tooltips.articleSize', "Determines the length and depth of your article")}
                    placeholder={t('article.placeholders.select', "Select article size")}
                    options={articleSizeOptions}
                    {...register("step2.articleSize", {
                      onChange: (e) => {
                        setValue("step2.articleSize", e.target.value, { shouldValidate: true });
                      }
                    })}
                    error={!!errors.step2?.articleSize}
                    helperText={errors.step2?.articleSize?.message}
                    value={articleSize}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label={t('article.settings.toneOfVoice', "Tone of Voice")}
                  tooltipText={t('article.tooltips.toneOfVoice', "Sets the overall tone and style of writing for your article")}
                  placeholder={t('article.placeholders.select', "Select tone")}
                  options={toneOptions}
                  {...register("step2.toneOfVoice", {
                    onChange: (e) => {
                      setValue("step2.toneOfVoice", e.target.value, { shouldValidate: true });
                    }
                  })}
                  error={!!errors.step2?.toneOfVoice}
                  helperText={errors.step2?.toneOfVoice?.message}
                  value={toneOfVoice}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormDropdown
                  label={t('article.settings.pointOfView', "Point of View")}
                  tooltipText={t('article.tooltips.pointOfView', "Determines the perspective from which your article is written")}
                  options={povOptions}
                  {...register("step2.pointOfView", {
                    onChange: (e) => {
                      setValue("step2.pointOfView", e.target.value, { shouldValidate: true });
                    }
                  })}
                  placeholder={t('article.placeholders.select', "Select point of view")}
                  error={!!errors.step2?.pointOfView}
                  helperText={errors.step2?.pointOfView?.message}
                  value={watch("step2.pointOfView")}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {t('article.settings.plagiaRemoval', "Plagia Removal")}
                  </Typography>
                  <Controller
                    name="step2.plagiaRemoval"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                            color="primary"
                          />
                        }
                        label={field.value ? t('common.enabled', "Enabled") : t('common.disabled', "Disabled")}
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontSize: '0.875rem',
                            color: field.value ? 'primary.main' : 'text.secondary'
                          }
                        }}
                      />
                    )}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 1, width: '100%' }} />

          {/* Media Settings Section - Simplified */}
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
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                  <Controller
                    name="step2.includeImages"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={Boolean(field.value)}
                            onChange={field.onChange}
                            color="primary"
                          />
                        }
                        label={t('article.settings.includeImages', "Include Images")}
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontSize: '1rem',
                            fontWeight: 500
                          }
                        }}
                      />
                    )}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                  <Controller
                    name="step2.includeVideos"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={Boolean(field.value)}
                            onChange={field.onChange}
                            color="primary"
                          />
                        }
                        label={t('article.settings.includeVideos', "Include Videos")}
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontSize: '1rem',
                            fontWeight: 500
                          }
                        }}
                      />
                    )}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        

          <Divider sx={{ my: 1, width: '100%' }} />

          {/* Advanced Link Management Section */}
          <Box sx={{ width: '100%', mb: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: '100%'
              }}
            >
              <Iconify icon="mdi:link-variant" width={20} height={20} />
              {t('links.management.title', "Advanced Link Management")}
            </Typography>

            {/* Link Management Sections */}
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <LinkManagementSection
                  type="internal"
                  title={t('links.internal.title', "Internal Links")}
                  icon="mdi:link"
                  onGenerateLinks={generateInternalLinks}
                  isGenerating={isGeneratingInternal}
                  showWebsiteUrlInput
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <LinkManagementSection
                  type="external"
                  title={t('links.external.title', "External Links")}
                  icon="mdi:open-in-new"
                  onGenerateLinks={generateExternalLinks}
                  isGenerating={isGeneratingExternal}
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
              onClick={() => {
                if (hasGeneratedSections && onRegenerateRequest) {
                  // If sections already exist and we have a regenerate request handler, call it
                  onRegenerateRequest();
                } else {
                  // If no sections exist, generate directly
                  onGenerate();
                }
              }}
              disabled={isGenerating}
              startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="mdi:table-of-contents" />}
              sx={{
                borderRadius: '28px',
                px: 4
              }}
            >
              {isGenerating
                ? t('article.buttons.generating', 'Generating...')
                : hasGeneratedSections
                  ? t('article.buttons.regenerateTableOfContents', 'Regenerate Table of Contents')
                  : t('article.buttons.generateTableOfContents', 'Generate Table of Contents')}
            </Button>
          </Box>
        </FormContainer>
      </Grid>
    </Grid>
  )
};