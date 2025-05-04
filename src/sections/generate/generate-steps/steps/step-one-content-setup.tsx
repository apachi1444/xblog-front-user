import type React from "react";
import type { UseFormReturn } from "react-hook-form";

import { AnimatePresence } from "framer-motion";

import { useTheme } from "@mui/material/styles";
import { Box, Grid, Stack, Button, Tooltip, Typography, CircularProgress } from "@mui/material";

// Components
import { Iconify } from "src/components/iconify";
import { FormInput } from "src/components/generate-article/FormInput";
import { FormDropdown } from "src/components/generate-article/FormDropdown";
import { FormContainer } from "src/components/generate-article/FormContainer";
import { GenerationLoadingAnimation } from "src/components/generate-article/GenerationLoadingAnimation";

import { KeywordChip } from "../../components/KeywordChip";
// Custom components
import { RegenerateButton } from "../../components/RegenerateButton";
// Custom hooks
import { useKeywordManagement } from "../../hooks/useKeywordManagement";
import { GenerationPlaceholder } from "../../components/GenerationPlaceholder";

// Types
import type { Step1FormData } from "../../schemas";

export interface Step1State {
  form: UseFormReturn<Step1FormData>
  generation: {
    title: {
      isGenerating: boolean
      isGenerated: boolean
      onGenerate: () => Promise<void>
    }
    meta: {
      isGenerating: boolean
      isGenerated: boolean
      onGenerate: () => Promise<void>
    }
    secondaryKeywords: {
      isGenerating: boolean
      handleAddKeyword: (arg: string) => void
      handleDeleteKeyword: (arg: string) => void
      onGenerate: () => Promise<void>
    }
  }
}

interface Step1ContentSetupProps {
  state: Step1State
}

export function Step1ContentSetup({ state }: Step1ContentSetupProps) {
  // const { t } = useTranslation(); // Initialize the translation hook if needed

  const {
    form,
    generation: {
      title: { isGenerating: isGeneratingTitle, isGenerated: isTitleGenerated, onGenerate: onGenerateTitle },
      meta: { isGenerating: isGeneratingMeta, isGenerated: isMetaGenerated, onGenerate: onGenerateMeta },
      secondaryKeywords: {
        isGenerating: isGeneratingSecondaryKeywords,
        onGenerate: onGenerateSecondaryKeywords,
        handleAddKeyword: originalHandleAddKeyword,
        handleDeleteKeyword,
      },
    },
  } = state

  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = form

  const theme = useTheme()

  // Watch form fields for conditional rendering
  const language = watch("language")
  const targetCountry = watch("targetCountry")
  const primaryKeyword = watch("primaryKeyword")
  const secondaryKeywords = watch("secondaryKeywords")
  const contentDescription = watch("contentDescription")

  const title = watch("title")
  const metaTitle = watch("metaTitle")
  const metaDescription = watch("metaDescription")
  const urlSlug = watch("urlSlug")

  const isPrimaryKeywordDisabled = !language || !targetCountry
  const isSecondaryKeywordsDisabled = !primaryKeyword

  // Handler for generating secondary keywords with validation
  const handleGenerateSecondaryKeywordsWithValidation = () => {
    const primaryKeywordValid = !!primaryKeyword
    if (primaryKeywordValid) {
      onGenerateSecondaryKeywords()
    }
  }

  // Data for country options
  const countries = [
    { value: "us", label: "English (US)" },
    { value: "uk", label: "English (UK)" },
    { value: "fr", label: "French" },
  ]

  // Data for language options
  const languages = [
    { value: "en-us", label: "English (US)" },
    { value: "en-gb", label: "English (UK)" },
    { value: "fr-fr", label: "French" },
  ]

  const isLoadingSecondaryKeywords = isGeneratingSecondaryKeywords

  // Handle primary keyword change explicitly
  const handlePrimaryKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    setValue("primaryKeyword", value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
  }

  // Use the keyword management hook
  const {
    keywordInput,
    setKeywordInput,
    handleAddKeyword,
  } = useKeywordManagement(form, originalHandleAddKeyword, handleDeleteKeyword);

  const isGenerateDisabled = false;

  return (
    <Grid container spacing={1}>
      {/* Language & Region section - Enhanced */}
      <Grid item xs={12}>
        <FormContainer title="Language & Region">
          <FormDropdown
            {...register("language", {
              onChange: (e) => {
                setValue("language", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                });
              }
            })}
            label="Language"
            options={languages}
            error={!!errors.language}
            helperText={errors.language?.message}
            value={language}
          />

          <FormDropdown
            {...register("targetCountry", {
              onChange: (e) => {
                setValue("targetCountry", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                });
              }
            })}
            label="Target Country"
            options={countries}
            error={!!errors.targetCountry}
            helperText={errors.targetCountry?.message}
            value={targetCountry} // Explicitly set the value
          />
        </FormContainer>
      </Grid>

      {/* Keywords section - Enhanced */}
      <Grid item xs={12} sx={{ mt: -2 }}>
        <FormContainer title="Keywords" layout="column">
          <Box sx={{ width: "100%" }}>
            <FormInput
              {...register("primaryKeyword", {
                onChange: (e) => {
                  setValue("primaryKeyword", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                  });
                }
              })}
              label="Primary Keyword"
              disabled={isPrimaryKeywordDisabled}
              tooltipText="Enter the main keyword for your content"
              placeholder="Enter primary keyword"
              fullWidth
              error={!!errors.primaryKeyword}
              onChange={handlePrimaryKeywordChange}
              helperText={errors.primaryKeyword ? "Primary keyword is required" : ""}
              value={primaryKeyword} // Explicitly set the value
            />
          </Box>

          <Box sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
              <FormInput
                value={keywordInput}
                disabled={isSecondaryKeywordsDisabled}
                label="Secondary Keywords"
                placeholder="Add secondary keywords manually or generate with AI"
                tooltipText="Add relevant secondary keywords to improve SEO ranking"
                fullWidth
                onChange={(e) => { setKeywordInput(e.target.value)} }
                error={errors.secondaryKeywords && secondaryKeywords.length === 0}
                helperText={
                  errors.secondaryKeywords && secondaryKeywords.length === 0
                    ? "Add or generate at least one secondary keyword"
                    : ""
                }
                sx={{ flexGrow: 1 }}
                endComponent={
                  <Tooltip title="Add keyword manually">
                    <Box
                      onClick={() => {
                        handleAddKeyword(keywordInput);
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        width: theme.spacing(6.25),
                        height: theme.spacing(6.25),
                        borderRadius: theme.shape.borderRadius / 6,
                        cursor: "pointer",
                        flexShrink: 0,
                        "&:hover": {
                          bgcolor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      <Box component="span" sx={{ fontSize: theme.typography.pxToRem(18), fontWeight: "bold" }}>
                        +
                      </Box>
                    </Box>
                  </Tooltip>
                }
              />

            </Box>

            {primaryKeyword && (
              <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1, minHeight: theme.spacing(4) }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={handleGenerateSecondaryKeywordsWithValidation}
                  disabled={isLoadingSecondaryKeywords}
                  startIcon={
                    isLoadingSecondaryKeywords ? (
                      <CircularProgress
                        size={16}
                        color="inherit"
                        sx={{
                          animation: "spin 1.2s linear infinite",
                          "@keyframes spin": {
                            "0%": { transform: "rotate(0deg)" },
                            "100%": { transform: "rotate(360deg)" },
                          },
                        }}
                      />
                    ) : (
                      <Iconify icon="eva:sparkle-fill" width={16} />
                    )
                  }
                  sx={{
                    borderRadius: theme.spacing(3),
                    borderColor: theme.palette.secondary.dark,
                    textTransform: "none",
                    fontSize: theme.typography.pxToRem(12),
                    transition: "all 0.3s ease",
                    opacity: isLoadingSecondaryKeywords ? 0.8 : 1,
                    color: theme.palette.secondary.dark,
                    "&:hover": {
                      color: theme.palette.secondary.dark,
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "inherit",
                      fontWeight: 500,
                    }}
                  >
                    {isLoadingSecondaryKeywords ? "Generating Suggestions..." : "Generate Suggestions with AI"}
                  </Typography>
                </Button>
              </Box>
            )}

            {/* Display secondary keywords as chips */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mt: 1.5,
                minHeight: secondaryKeywords?.length > 0 ? "auto" : 0,
                maxHeight: secondaryKeywords?.length > 0 ? "200px" : 0,
                opacity: secondaryKeywords?.length > 0 ? 1 : 0,
                overflow: "auto",
                transition: "all 0.3s ease-in-out",
              }}
            >
              {secondaryKeywords?.map((keyword, index) => (
                <KeywordChip
                  key={index}
                  keyword={keyword}
                  index={index}
                  onDelete={handleDeleteKeyword}
                />
              ))}
            </Box>
          </Box>
        </FormContainer>
      </Grid>

      {/* Content Description - Enhanced */}
      <Grid item xs={12} sx={{ mt: -2 }}>
        <FormContainer title="Content Description">
          <Box sx={{ width: "100%" }}>
            <FormInput
              {...register("contentDescription", {
                required: true,
                onChange: (e) => {
                  setValue("contentDescription", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                  });
                }
              })}
              label="Content Description"
              tooltipText="Describe what your content is about"
              placeholder="Enter a detailed description of your content"
              multiline
              rows={4}
              value={contentDescription}
              fullWidth
              error={!!errors.contentDescription}
              helperText={errors.contentDescription ? "Content description is required" : ""}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: theme.palette.background.paper,
                  borderRadius: theme.shape.borderRadius / 6,
                },
              }}
            />
          </Box>
        </FormContainer>
      </Grid>

      <Grid item xs={12} sx={{ mt: -2 }}>
        {/* Title generation section */}
        {!isTitleGenerated ? (
          <Box
            sx={{
              width: "100%",
              height: theme.spacing(14),
              borderRadius: theme.shape.borderRadius / 6,
              position: "relative",
              overflow: "hidden",
              mb: 5,
              bgcolor: theme.palette.background.neutral,
              backdropFilter: "blur(8px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed",
              borderColor: theme.palette.primary.main,
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.text.secondary }}>
              Generate a compelling title for your content
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={onGenerateTitle}
              disabled={isGeneratingTitle || isGenerateDisabled}
              startIcon={
                isGeneratingTitle ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="eva:flash-fill" />
              }
              sx={{
                borderRadius: theme.spacing(3),
                px: 3,
              }}
            >
              {isGeneratingTitle ? "Generating..." : "Generate Title"}
            </Button>

            <AnimatePresence>
              {isGeneratingTitle && (
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', zIndex: 10 }}>
                  <GenerationLoadingAnimation
                    isLoading={isGeneratingTitle}
                    message="Generating your title..."
                    size="medium"
                  />
                </Box>
              )}
            </AnimatePresence>
          </Box>
        ) : (
          <Box sx={{ width: "100%", mb: 1 }}>
            <FormContainer title="Generated Title">
              <Box sx={{ position: "relative", width: "100%" }}>
                <FormInput
                  {...register("title", {
                    onChange: (e) => {
                      setValue("title", e.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true
                      });
                    }
                  })}
                  value={title}
                  tooltipText="Article Title"
                  label="Article Title"
                  fullWidth
                  helperText={errors.title?.message}
                />
                {/* Regenerate Button */}
                <RegenerateButton
                  onClick={onGenerateTitle}
                  isGenerating={isGeneratingTitle}
                  label="Regenerate Article Title"
                />

                {/* Title Regeneration Loading Animation */}
                <AnimatePresence>
                  {isGeneratingTitle && (
                    <Box sx={{ mt: 2, position: 'relative' }}>
                      <GenerationLoadingAnimation
                        isLoading={isGeneratingTitle}
                        message="Regenerating your title..."
                        size="medium"
                      />
                    </Box>
                  )}
                </AnimatePresence>
              </Box>
            </FormContainer>
          </Box>
        )}

        {/* Meta information generation section */}
        {!isMetaGenerated ? (
          <GenerationPlaceholder
            title="Generate SEO meta information for your content"
            buttonLabel="Generate Meta Info"
            onGenerate={onGenerateMeta}
            isGenerating={isGeneratingMeta}
            isDisabled={isGenerateDisabled}
            height={16}
          />
        ) : (
          <FormContainer title="SEO Meta Information">
            <Stack spacing={1} sx={{ width: "100%" }}>
              {/* Meta Title */}
              <FormInput
                {...register("metaTitle", {
                  onChange: (e) => {
                    setValue("metaTitle", e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true
                    });
                  }
                })}
                value={metaTitle}
                tooltipText="Meta title"
                label="Meta Title"
                fullWidth
                helperText={errors.metaTitle?.message}
              />

              {/* Meta Description */}
              <FormInput
                {...register("metaDescription", {
                  onChange: (e) => {
                    setValue("metaDescription", e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true
                    });
                  }
                })}
                tooltipText="Meta Description"
                value={metaDescription}
                label="Meta Description"
                fullWidth
                multiline
                rows={3}
                helperText={errors.metaDescription?.message}
              />

              {/* URL Slug */}
              <FormInput
                {...register("urlSlug", {
                  onChange: (e) => {
                    setValue("urlSlug", e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true
                    });
                  }
                })}
                tooltipText="URL Slug"
                value={urlSlug}
                label="URL Slug"
                fullWidth
                helperText={errors.urlSlug?.message}
              />

              {/* Regenerate Button */}
              <RegenerateButton
                onClick={onGenerateMeta}
                isGenerating={isGeneratingMeta}
                label="Regenerate All"
              />

              {/* Meta Regeneration Loading Animation */}
              <AnimatePresence>
                {isGeneratingMeta && (
                  <Box sx={{ mt: 2, position: 'relative' }}>
                    <GenerationLoadingAnimation
                      isLoading={isGeneratingMeta}
                      message="Regenerating SEO meta information..."
                      size="medium"
                    />
                  </Box>
                )}
              </AnimatePresence>
            </Stack>
          </FormContainer>
        )}
      </Grid>
    </Grid>
  )
}
