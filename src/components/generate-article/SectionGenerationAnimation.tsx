import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

import { Box, Paper, useTheme, Typography, LinearProgress } from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface SectionGenerationAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

export function SectionGenerationAnimation({ show, onComplete }: SectionGenerationAnimationProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);

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

  // Animation steps
  useEffect(() => {
    if (!show) {
      setStep(0);
      setShowCheckmark(false);
      return;
    }

    // Reset animation state when shown again
    setStep(0);
    setShowCheckmark(false);

    let currentDelay = 500; // Initial delay

    const timers: NodeJS.Timeout[] = [];

    // Create timers for each generation step
    generationSteps.forEach((_, index) => {
      const timer = setTimeout(() => setStep(index + 1), currentDelay);
      timers.push(timer);
      currentDelay += generationSteps[index].duration;
    });

    // Final step: Show checkmark and complete
    const finalTimer = setTimeout(() => {
      setStep(generationSteps.length + 1);
      setShowCheckmark(true);
    }, currentDelay);
    timers.push(finalTimer);

    // Complete animation
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, currentDelay + 1000);
    timers.push(completeTimer);

    // eslint-disable-next-line consistent-return
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [show, onComplete, generationSteps]);

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
        </Paper>
      </motion.div>
    </AnimatePresence>
  );
}
