import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Box, Paper, useTheme, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface SectionGenerationAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

export function SectionGenerationAnimation({ show, onComplete }: SectionGenerationAnimationProps) {
  const theme = useTheme();
  const [step, setStep] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);

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

    // Step 1: Show the initial animation
    const timer1 = setTimeout(() => setStep(1), 500);

    // Step 2: Show sections being generated
    const timer2 = setTimeout(() => setStep(2), 1500);

    // Step 3: Show sections being organized
    const timer3 = setTimeout(() => setStep(3), 3000);

    // Step 4: Show checkmark
    const timer4 = setTimeout(() => {
      setStep(4);
      setShowCheckmark(true);
    }, 4500);

    // Step 5: Complete animation
    const timer5 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5500);

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [show, onComplete]);

  if (!show) return null;

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
            maxWidth: 500,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ mb: 3 }}>
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

                {/* Document icon in the middle */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <Iconify
                    icon="eva:file-text-outline"
                    width={40}
                    height={40}
                    sx={{ color: theme.palette.primary.main }}
                  />
                </Box>
              </Box>
            )}
          </Box>

          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            {step === 4 ? 'Sections Generated!' : 'Generating Article Sections...'}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                opacity: step >= 1 ? 1 : 0.3,
                transition: 'opacity 0.3s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1
              }}
            >
              <Iconify
                icon={step >= 1 ? "eva:checkmark-circle-2-fill" : "eva:clock-outline"}
                width={20}
                height={20}
                sx={{
                  mr: 1,
                  color: step >= 1 ? theme.palette.success.main : theme.palette.text.secondary
                }}
              />
              Analyzing content requirements
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                opacity: step >= 2 ? 1 : 0.3,
                transition: 'opacity 0.3s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1
              }}
            >
              <Iconify
                icon={step >= 2 ? "eva:checkmark-circle-2-fill" : "eva:clock-outline"}
                width={20}
                height={20}
                sx={{
                  mr: 1,
                  color: step >= 2 ? theme.palette.success.main : theme.palette.text.secondary
                }}
              />
              Creating optimized sections
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                opacity: step >= 3 ? 1 : 0.3,
                transition: 'opacity 0.3s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1
              }}
            >
              <Iconify
                icon={step >= 3 ? "eva:checkmark-circle-2-fill" : "eva:clock-outline"}
                width={20}
                height={20}
                sx={{
                  mr: 1,
                  color: step >= 3 ? theme.palette.success.main : theme.palette.text.secondary
                }}
              />
              Organizing content structure
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                opacity: step >= 4 ? 1 : 0.3,
                transition: 'opacity 0.3s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Iconify
                icon={step >= 4 ? "eva:checkmark-circle-2-fill" : "eva:clock-outline"}
                width={20}
                height={20}
                sx={{
                  mr: 1,
                  color: step >= 4 ? theme.palette.success.main : theme.palette.text.secondary
                }}
              />
              Finalizing article structure
            </Typography>
          </Box>

          {/* Progress bar */}
          <Box sx={{ position: 'relative', height: 6, bgcolor: theme.palette.grey[200], borderRadius: 3, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
              style={{
                height: '100%',
                backgroundColor: theme.palette.primary.main,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          </Box>
        </Paper>
      </motion.div>
    </AnimatePresence>
  );
}
