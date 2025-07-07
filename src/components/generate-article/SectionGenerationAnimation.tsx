/* eslint-disable no-await-in-loop */
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';

import { Box, Paper, Alert, Button, useTheme, Typography, LinearProgress } from '@mui/material';

import {
  useGenerateFaqMutation,
  useGenerateImagesMutation,
  useGenerateSectionsMutation,
  useGenerateTableOfContentsMutation
} from 'src/services/apis/generateContentApi';

import { Iconify } from 'src/components/iconify';

interface SectionGenerationAnimationProps {
  show: boolean;
  onComplete?: () => void;
  onError?: (error: string, failedStep: string, completedSteps: string[]) => void;
}

export function SectionGenerationAnimation({ show, onComplete, onError }: SectionGenerationAnimationProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const methods = useFormContext();

  // State management
  const [step, setStep] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [failedStep, setFailedStep] = useState<string>('');
  const [showRetryUI, setShowRetryUI] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Ref to track if generation has already started for this show cycle
  const generationStartedRef = useRef(false);

  // API mutation hooks
  const [generateTableOfContents] = useGenerateTableOfContentsMutation();
  const [generateImages] = useGenerateImagesMutation();
  const [generateFaq] = useGenerateFaqMutation();
  const [generateSections] = useGenerateSectionsMutation();

  // Generation steps with translations
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generationSteps = [
    {
      key: 'tableOfContents',
      title: t('article.generation.modal.steps.tableOfContents', 'Generating table of contents'),
      description: t('article.generation.modal.progress.tableOfContents', "We're creating a structured outline for your article..."),
      icon: 'mdi:table-of-contents',
      duration: 1500
    },
    {
      key: 'images',
      title: t('article.generation.modal.steps.images', 'Generating image suggestions'),
      description: t('article.generation.modal.progress.images', 'Finding the perfect images to complement your content...'),
      icon: 'mdi:image-multiple',
      duration: 1200
    },
    {
      key: 'faq',
      title: t('article.generation.modal.steps.faq', 'Creating frequently asked questions'),
      description: t('article.generation.modal.progress.faq', 'Preparing helpful questions and answers for your readers...'),
      icon: 'mdi:help-circle',
      duration: 1000
    },
    {
      key: 'sections',
      title: t('article.generation.modal.steps.sections', 'Writing article sections'),
      description: t('article.generation.modal.progress.sections', 'Crafting engaging content for each section...'),
      icon: 'mdi:text-box-multiple',
      duration: 1800
    },
    {
      key: 'finalizing',
      title: t('article.generation.modal.steps.finalizing', 'Finalizing your content'),
      description: t('article.generation.modal.progress.finalizing', 'Putting everything together for the perfect article...'),
      icon: 'mdi:check-circle',
      duration: 1000
    }
  ];

  // Execute sequential API calls
  const executeSequentialGeneration = useCallback(async (startFromStep?: string) => {
    const formData = methods.getValues();
    const { primaryKeyword, secondaryKeywords, contentDescription, title, language } = formData.step1;

    const steps = ['tableOfContents', 'images', 'faq', 'sections'];
    const startIndex = startFromStep ? steps.indexOf(startFromStep) : 0;

    // Store generated data to pass between API calls
    let generatedToc = formData.toc || [];
    let generatedImages = formData.images || [];

    setIsGenerating(true);
    setShowRetryUI(false);
    setFailedStep('');

    // eslint-disable-next-line no-plusplus
    for (let i = startIndex; i < steps.length; i++) {
      const stepKey = steps[i];

      try {
        // Update current step
        setStep(i + 1);

        let result;

        switch (stepKey) {
          case 'tableOfContents':
            result = await generateTableOfContents({
              primary_keyword: primaryKeyword,
              secondary_keywords: secondaryKeywords || [],
              content_description: contentDescription,
              title,
              language: language || 'english'
            }).unwrap();

            // Store TOC in form and variable for later use
            generatedToc = result.table_of_contents;
            methods.setValue('toc', generatedToc);
            break;

          case 'images':
            result = await generateImages({
              topic: `${primaryKeyword} ${contentDescription}`,
              number_of_images: 3
            }).unwrap();

            // Store images in form and variable for later use
            generatedImages = result.images;
            methods.setValue('images', generatedImages);
            break;

          case 'faq':
            result = await generateFaq({
              title,
              primary_keyword: primaryKeyword,
              secondary_keywords: secondaryKeywords || [],
              content_description: contentDescription
            }).unwrap();

            // Store FAQ in form
            methods.setValue('faq', result.faq);
            break;

          case 'sections':
            // Log the data being sent to sections API
            console.log('📋 Sections API Request Data:', {
              toc: generatedToc,
              images: generatedImages,
              article_title: title,
              target_audience: 'general',
              tone: formData.step2?.toneOfVoice || 'friendly',
              point_of_view: formData.step2?.pointOfView || 'third-person',
              article_type: formData.step2?.articleType || 'how-to',
              article_size: formData.step2?.articleSize || 'medium'
            });

            result = await generateSections({
              toc: generatedToc, // ✅ Use freshly generated TOC
              article_title: title,
              target_audience: 'general',
              tone: formData.step2?.toneOfVoice || 'friendly',
              point_of_view: formData.step2?.pointOfView || 'third-person',
              article_type: formData.step2?.articleType || 'how-to',
              article_size: formData.step2?.articleSize || 'medium',
              links: [], // Will be populated by link generation APIs
              images: generatedImages, // ✅ Use freshly generated images
              language: language || 'english'
            }).unwrap();

            // Transform sections to match our schema
            // eslint-disable-next-line no-case-declarations
            const transformedSections = result.sections.map((section: any, index: number) => ({
              id: `section-${index + 1}`,
              title: section.title,
              content: section.content,
              status: 'generated'
            }));

            // Store sections in form - THIS IS CRITICAL FOR STEP 3 EDITING
            methods.setValue('step3.sections', transformedSections);
            break;
          default :
            break;
        }

        // Mark step as completed
        setCompletedSteps(prev => [...prev, stepKey]);

        // Add delay between API calls
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`Failed to generate ${stepKey}:`, error);

        // Mark step as failed and show retry UI
        setFailedStep(stepKey);
        setShowRetryUI(true);
        setIsGenerating(false);

        // Call error handler
        if (onError) {
          onError(`Failed to generate ${stepKey}`, stepKey, completedSteps);
        }

        throw error; // Stop the sequence
      }
    }

    // All steps completed successfully
    setIsGenerating(false);
    setStep(steps.length + 1);
    setShowCheckmark(true);

    // Wait for animation to complete before calling onComplete
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1000);

  }, [methods, generateTableOfContents, generateImages, generateFaq, generateSections, completedSteps, onComplete, onError]);

  // Retry failed generation step
  const handleRetryGeneration = useCallback(async () => {
    if (!failedStep) return;

    try {
      await executeSequentialGeneration(failedStep);
    } catch (error) {
      console.error('Retry failed:', error);
    }
  }, [failedStep, executeSequentialGeneration]);

  // Start generation when modal is shown
  useEffect(() => {
    if (!show) {
      setStep(0);
      setShowCheckmark(false);
      setCompletedSteps([]);
      setFailedStep('');
      setShowRetryUI(false);
      setIsGenerating(false);
      generationStartedRef.current = false;
      return;
    }

    // Only start generation if it hasn't been started for this show cycle
    if (!generationStartedRef.current) {
      generationStartedRef.current = true;

      // Reset state and start generation
      setStep(0);
      setShowCheckmark(false);
      setCompletedSteps([]);
      setFailedStep('');
      setShowRetryUI(false);

      // Start the generation process
      executeSequentialGeneration();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]); // Removed executeSequentialGeneration from dependencies to prevent infinite loop

  if (!show) return null;

  const currentStep = Math.min(step, generationSteps.length);
  const currentStepData = generationSteps[currentStep - 1];
  const progress = showCheckmark ? 100 : (currentStep / generationSteps.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9999,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 2,
            width: '90%',
            maxWidth: 600,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {showCheckmark
                ? t('article.generation.modal.completed', 'Content Generated Successfully!')
                : t('article.generation.modal.title', 'Generating Your Content')
              }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {showCheckmark
                ? t('article.generation.modal.completedMessage', 'Your article components are ready. You can now review and customize them.')
                : t('article.generation.modal.subtitle', 'Please wait while we create your article components')
              }
            </Typography>
          </Box>

          {/* Main Icon */}
          <Box sx={{ mb: 4 }}>
            {showCheckmark ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <Iconify
                  icon="eva:checkmark-circle-2-fill"
                  width={80}
                  height={80}
                  sx={{ color: theme.palette.success.main }}
                />
              </motion.div>
            ) : (
              <Box sx={{ position: 'relative', height: 80, width: 80, mx: 'auto' }}>
                {/* Spinning circle */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '50%',
                    border: `3px solid ${theme.palette.primary.main}`,
                    borderTopColor: 'transparent',
                  }}
                />
                {/* Center icon */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <Iconify
                    icon={currentStepData?.icon || 'mdi:table-of-contents'}
                    width={32}
                    height={32}
                    sx={{ color: theme.palette.primary.main }}
                  />
                </Box>
              </Box>
            )}
          </Box>

          {/* Current Step Display */}
          {!showCheckmark && currentStepData && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {currentStepData.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentStepData.description}
              </Typography>
            </Box>
          )}

          {/* Generation Steps List */}
          <Box sx={{ mb: 4, textAlign: 'left' }}>
            {generationSteps.map((stepData, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep && !showCheckmark;
              const isUpcoming = stepNumber > currentStep;

              return (
                <Box
                  key={stepData.key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                    opacity: isUpcoming ? 0.4 : 1,
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isCompleted || showCheckmark
                        ? theme.palette.success.main
                        : isCurrent
                        ? theme.palette.primary.main
                        : theme.palette.grey[300],
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {isCompleted || showCheckmark ? (
                      <Iconify icon="eva:checkmark-fill" width={14} height={14} />
                    ) : (
                      stepNumber
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isCurrent ? 600 : 400,
                      color: isCompleted || isCurrent || showCheckmark
                        ? 'text.primary'
                        : 'text.secondary',
                    }}
                  >
                    {stepData.title}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  bgcolor: showCheckmark ? theme.palette.success.main : theme.palette.primary.main,
                },
              }}
            />
          </Box>

          {/* Retry UI for failed steps */}
          {showRetryUI && failedStep && (
            <Box sx={{ mt: 3 }}>
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleRetryGeneration}
                    disabled={isGenerating}
                    startIcon={<Iconify icon="eva:refresh-fill" />}
                  >
                    Retry
                  </Button>
                }
              >
                Failed to generate {failedStep.replace(/([A-Z])/g, ' $1').toLowerCase()}.
                Click retry to continue from where it failed.
              </Alert>
            </Box>
          )}
        </Paper>
      </motion.div>
    </AnimatePresence>
  );
}
