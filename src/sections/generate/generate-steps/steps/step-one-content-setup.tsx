import type React from "react";
import type { InputKey } from "src/types/criteria.types";

import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useWatch, useFormContext } from "react-hook-form";

import { useTheme } from "@mui/material/styles";
import { Box, Grid, Stack, Button, Tooltip, Typography, CircularProgress } from "@mui/material";

// Components
import { Iconify } from "src/components/iconify";
import { FormInput } from "src/components/generate-article/FormInput";
import { FormContainer } from "src/components/generate-article/FormContainer";
import { TargetLanguageSelector } from "src/components/generate-article/TargetLanguageSelector";
import { GenerationLoadingAnimation } from "src/components/generate-article/GenerationLoadingAnimation";

import { KeywordChip } from "../../components/KeywordChip";
// Custom components
import { RegenerateButton } from "../../components/RegenerateButton";
// Custom hooks
import { GenerationPlaceholder } from "../../components/GenerationPlaceholder";

// Types
import type { GenerateArticleFormData } from "../../schemas";

export interface Step1ContentSetupProps {
  onGenerateTitle: () => Promise<string>;
  onGenerateSecondaryKeywords: () => Promise<void>;
  onOptimizeContentDescription: () => Promise<void>;
  onGenerateMeta: () => Promise<{ metaTitle: string; metaDescription: string; urlSlug: string }>;
  isGeneratingMeta: boolean;
  isGeneratingTitle?: boolean;
  isGeneratingKeywords?: boolean;
  isOptimizingDescription?: boolean;
  evaluateCriteria: (id: InputKey, value: string) => void;
}

export function Step1ContentSetup({
  onGenerateMeta,
  onGenerateSecondaryKeywords,
  onGenerateTitle,
  onOptimizeContentDescription,
  isGeneratingMeta,
  isGeneratingTitle: externalIsGeneratingTitle,
  isGeneratingKeywords: externalIsGeneratingKeywords,
  isOptimizingDescription: externalIsOptimizingDescription,
  evaluateCriteria,
}: Step1ContentSetupProps) {

  // Get the form from the state prop
  const form = useFormContext<GenerateArticleFormData>()

  const {
    register,
    formState: { errors },
    setValue,
    control
  } = form

  const theme = useTheme()

  const contentDescription = useWatch({
    control,
    name: "step1.contentDescription",
  })

  const primaryKeyword = useWatch({
    control,
    name: "step1.primaryKeyword",
  })

  const secondaryKeywords = useWatch({
    control,
    name: "step1.secondaryKeywords",
  })


  const title = useWatch({
    control,
    name: "step1.title",
  })

  const metaTitle = useWatch({
    control,
    name: "step1.metaTitle",
  })

  const metaDescription = useWatch({
    control,
    name: "step1.metaDescription",
  })

  const urlSlug = useWatch({
    control,
    name: "step1.urlSlug",
  })

  // Primary keyword should always be enabled since we have default values for language and targetCountry
  const isPrimaryKeywordDisabled = false
  const isSecondaryKeywordsDisabled = !primaryKeyword

  // Add state for keyword input
  const [keywordInput, setKeywordInput] = useState("");

  // Use external state if provided, otherwise use local state
  const [localIsGeneratingTitle, setLocalIsGeneratingTitle] = useState(false);
  const [localIsGeneratingSecondaryKeywords, setLocalIsGeneratingSecondaryKeywords] = useState(false);
  const [localIsOptimizingContentDescription, setLocalIsOptimizingContentDescription] = useState(false);

  // Track which fields have been generated at least once
  const [hasGeneratedTitle, setHasGeneratedTitle] = useState(false);
  const [hasGeneratedMeta, setHasGeneratedMeta] = useState(false);

  useEffect(() => {
    evaluateCriteria("primaryKeyword", primaryKeyword);
  }, [primaryKeyword, evaluateCriteria]);

  // Check if form already has generated content (e.g., from draft)
  useEffect(() => {
    if (title && !hasGeneratedTitle) {
      setHasGeneratedTitle(true);
    }
    if ((metaTitle || metaDescription || urlSlug) && !hasGeneratedMeta) {
      setHasGeneratedMeta(true);
    }
  }, [title, metaTitle, metaDescription, urlSlug, hasGeneratedTitle, hasGeneratedMeta]);

  // Use external values if provided, otherwise use local state
  const isGeneratingTitle = externalIsGeneratingTitle !== undefined ? externalIsGeneratingTitle : localIsGeneratingTitle;
  const isGeneratingSecondaryKeywords = externalIsGeneratingKeywords !== undefined ? externalIsGeneratingKeywords : localIsGeneratingSecondaryKeywords;
  const isOptimizingContentDescription = externalIsOptimizingDescription !== undefined ? externalIsOptimizingDescription : localIsOptimizingContentDescription;

  const handleDeleteKeyword = (keyword: string) => {
    setValue("step1.secondaryKeywords", secondaryKeywords.filter((k) => k !== keyword));
    toast.error(`Keyword "${keyword}" removed`);
  };

  const handleAddKeyword = (keyword: string) => {
    if (!keyword.trim()) return;
    setValue("step1.secondaryKeywords", [...secondaryKeywords, keyword]);
    setKeywordInput("");
    toast.success(`Keyword "${keyword}" added`);
  };

  const isGenerateDisabled = !primaryKeyword;

  const handleGenerateTitle = async () => {
    // Only set local state if external state is not provided
    if (externalIsGeneratingTitle === undefined) {
      setLocalIsGeneratingTitle(true);
    }

    try {
      const generatedTitle = await onGenerateTitle();
      setValue("step1.title", generatedTitle);
      setHasGeneratedTitle(true); // Mark that title has been generated
    } catch (error) {
      toast.error("Error generating title:");
    }
  };

  // Update the secondary keywords generation handler to use the state prop
  const handleGenerateSecondaryKeywordsWithValidation = async () => {
    // Only set local state if external state is not provided
    if (externalIsGeneratingKeywords === undefined) {
      setLocalIsGeneratingSecondaryKeywords(true);
    }

    const primaryKeywordValid = !!primaryKeyword;
    if (primaryKeywordValid) {
      try {
        await onGenerateSecondaryKeywords();
      } catch (error) {
        console.error("Error generating secondary keywords:", error);
      } finally {
        // Only set local state if external state is not provided
        if (externalIsGeneratingKeywords === undefined) {
          setLocalIsGeneratingSecondaryKeywords(false);
        }
      }
    }
  };

  const handleOptimizeContentDescription = async () => {
    // Only set local state if external state is not provided
    if (externalIsOptimizingDescription === undefined) {
      setLocalIsOptimizingContentDescription(true);
    }

    try {
      await onOptimizeContentDescription();
    } catch (error) {
      console.error("Error optimizing content description:", error);
    } finally {
      // Only set local state if external state is not provided
      if (externalIsOptimizingDescription === undefined) {
        setLocalIsOptimizingContentDescription(false);
      }
    }
  };

  const handleGenerateMeta = async () => {
    try {
      const generatedMeta = await onGenerateMeta();
      setValue("step1.metaTitle", generatedMeta.metaTitle);
      setValue("step1.metaDescription", generatedMeta.metaDescription);
      setValue("step1.urlSlug", generatedMeta.urlSlug);
      setHasGeneratedMeta(true); // Mark that meta has been generated
    } catch (error) {
      console.error("Error generating meta information:", error);
    }
  };

  // handle also the handle regenerate by of course doing the calculation of remaining generations number

  return (
    <Grid container spacing={1}>
      {/* Language & Region section - Enhanced with World Flags */}
      <Grid item xs={12}>
        <FormContainer title="Language & Region">
          <TargetLanguageSelector />
        </FormContainer>
      </Grid>

      {/* Keywords section - Enhanced */}
      <Grid item xs={12} sx={{ mt: -2 }}>
        <FormContainer title="Keywords" layout="column">
          <Box sx={{ width: "100%" }}>
            <FormInput
              {...register("step1.primaryKeyword", {
                onChange: (e) => evaluateCriteria("primaryKeyword", e.target.value)
              })}
              label="Primary Keyword"
              disabled={isPrimaryKeywordDisabled}
              tooltipText="Enter the main keyword for your content"
              placeholder="Enter primary keyword"
              fullWidth
              error={!!errors.step1?.primaryKeyword}
              helperText={errors.step1?.primaryKeyword ? "Primary keyword is required" : ""}
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
                error={errors.step1?.secondaryKeywords && secondaryKeywords.length === 0}
                helperText={
                  errors.step1?.secondaryKeywords && secondaryKeywords.length === 0
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
                  disabled={isGeneratingSecondaryKeywords}
                  startIcon={
                    isGeneratingSecondaryKeywords ? (
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
                    opacity: isGeneratingTitle ? 0.8 : 1,
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
                    {isGeneratingSecondaryKeywords ? "Generating Suggestions..." : "Generate Suggestions with AI"}
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
              {...register("step1.contentDescription", {
                required: true,
                onChange: (e) => evaluateCriteria("contentDescription", e.target.value)
              })}
              label="Content Description"
              tooltipText="Describe what your content is about"
              placeholder="Enter a detailed description of your content"
              multiline
              rows={4}
              value={contentDescription}
              fullWidth
              error={!!errors.step1?.contentDescription}
              helperText={errors.step1?.contentDescription ? "Content description is required" : ""}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: theme.palette.background.paper,
                  borderRadius: theme.shape.borderRadius / 6,
                },
              }}
            />

            {/* Optimize Content Description Button */}
            {contentDescription && primaryKeyword && (
              <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1, minHeight: theme.spacing(4) }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={handleOptimizeContentDescription}
                  disabled={isOptimizingContentDescription}
                  startIcon={
                    isOptimizingContentDescription ? (
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
                    opacity: isOptimizingContentDescription ? 0.8 : 1,
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
                    {isOptimizingContentDescription ? "Optimizing..." : "Optimize with AI"}
                  </Typography>
                </Button>
              </Box>
            )}

            {/* Content Description Optimization Loading Animation */}
            <AnimatePresence>
              {isOptimizingContentDescription && (
                <Box sx={{ mt: 2, position: 'relative' }}>
                  <GenerationLoadingAnimation
                    isLoading={isOptimizingContentDescription}
                    message="Optimizing your content description..."
                    size="medium"
                  />
                </Box>
              )}
            </AnimatePresence>
          </Box>
        </FormContainer>
      </Grid>

      <Grid item xs={12} sx={{ mt: -2 }}>
        {!hasGeneratedTitle ? (
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
              onClick={handleGenerateTitle}
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
                  {...register("step1.title", {
                    onChange: (e) => evaluateCriteria("title", e.target.value)
                  })}
                  value={title}
                  tooltipText="Article Title"
                  label="Article Title"
                  fullWidth
                  helperText={errors.step1?.title?.message}
                />
                {/* Regenerate Button */}
                <RegenerateButton
                  onClick={handleGenerateTitle}
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
        {!hasGeneratedMeta ? (
          <GenerationPlaceholder
            title="Generate SEO meta information for your content"
            buttonLabel="Generate Meta Info"
            onGenerate={handleGenerateMeta}
            isGenerating={isGeneratingMeta}
            isDisabled={isGenerateDisabled}
            height={16}
          />
        ) : (
          <FormContainer title="SEO Meta Information">
            <Stack spacing={1} sx={{ width: "100%" }}>
              {/* Meta Title */}
              <FormInput
                {...register("step1.metaTitle", {
                  onChange: (e) => evaluateCriteria("metaTitle", e.target.value)
                })}
                value={metaTitle}
                tooltipText="Meta title"
                label="Meta Title"
                fullWidth
                helperText={errors.step1?.metaTitle?.message}
              />

              {/* Meta Description */}
              <FormInput
                {...register("step1.metaDescription", {
                  onChange: (e) => evaluateCriteria("metaDescription", e.target.value)
                })}
                tooltipText="Meta Description"
                value={metaDescription}
                label="Meta Description"
                fullWidth
                multiline
                rows={3}
                helperText={errors.step1?.metaDescription?.message}
              />

              {/* URL Slug */}
              <FormInput
                {...register("step1.urlSlug", {
                  onChange: (e) => evaluateCriteria("urlSlug", e.target.value)
                })}
                tooltipText="URL Slug"
                value={urlSlug}
                label="URL Slug"
                fullWidth
                helperText={errors.step1?.urlSlug?.message}
              />

              {/* Regenerate Button */}
              <RegenerateButton
                onClick={handleGenerateMeta}
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
