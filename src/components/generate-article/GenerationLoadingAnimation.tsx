/* eslint-disable consistent-return */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

import { Box, useTheme, Typography, LinearProgress } from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface GenerationLoadingAnimationProps {
  isLoading: boolean;
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const GenerationLoadingAnimation: React.FC<GenerationLoadingAnimationProps> = ({
  isLoading,
  message = 'Generating...',
  size = 'medium',
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [progress, setProgress] = React.useState(0);
  const [dots, setDots] = React.useState('');

  React.useEffect(() => {
    if (!isLoading) return;

    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress((oldProgress) => {
        // Slow down as we approach 100%
        const increment = 100 - oldProgress > 30 ? 3 : 1;
        const newProgress = Math.min(oldProgress + increment, 95);
        return newProgress;
      });
    }, 300);

    // Dots animation for the message
    const dotsTimer = setInterval(() => {
      setDots((prevDots) => (prevDots.length >= 3 ? '' : `${prevDots  }.`));
    }, 500);

    return () => {
      clearInterval(progressTimer);
      clearInterval(dotsTimer);
    };
  }, [isLoading]);

  // Reset progress when loading stops
  React.useEffect(() => {
    if (!isLoading) {
      setProgress(0);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  // Size configurations
  const sizeConfig = {
    small: {
      height: '60px',
      iconSize: 18,
      fontSize: 'caption',
      progressHeight: 4,
    },
    medium: {
      height: '80px',
      iconSize: 24,
      fontSize: 'body2',
      progressHeight: 6,
    },
    large: {
      height: '100px',
      iconSize: 30,
      fontSize: 'body1',
      progressHeight: 8,
    },
  };

  const config = sizeConfig[size];

  // Particles animation for the "AI thinking" effect
  const particles = Array.from({ length: 5 }).map((_, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        x: Math.random() * 40 - 20,
        y: Math.random() * 40 - 20,
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        delay: i * 0.2,
        ease: "easeInOut"
      }}
      style={{
        position: 'absolute',
        width: Math.max(4, Math.random() * 8),
        height: Math.max(4, Math.random() * 8),
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.light,
      }}
    />
  ));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.9 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            height: config.height,
            width: '100%',
            borderRadius: theme.shape.borderRadius * 2,
            bgcolor: theme.palette.mode === 'dark'
              ? 'rgba(0, 0, 0, 0.2)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            boxShadow: theme.shadows[4],
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 2,
            border: `1px solid ${theme.palette.primary.lighter}`,
          }}
        >
          {/* Glowing background effect */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '30%',
              width: '40%',
              height: '40%',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${theme.palette.primary.lighter} 0%, rgba(255,255,255,0) 70%)`,
              opacity: 0.6,
              filter: 'blur(20px)',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 0.4, transform: 'scale(0.8)' },
                '50%': { opacity: 0.6, transform: 'scale(1.2)' },
                '100%': { opacity: 0.4, transform: 'scale(0.8)' },
              },
            }}
          />

          {/* Content */}
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
            {/* AI Icon with particles */}
            <Box sx={{ position: 'relative', mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify
                icon="eva:flash-fill"
                width={config.iconSize}
                height={config.iconSize}
                sx={{
                  color: theme.palette.primary.main,
                  animation: 'pulse 1.5s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 0.7, transform: 'scale(0.95)' },
                    '50%': { opacity: 1, transform: 'scale(1.05)' },
                    '100%': { opacity: 0.7, transform: 'scale(0.95)' },
                  },
                }}
              />
              {particles}
            </Box>

            {/* Message */}
            <Typography
              variant={size === 'small' ? 'caption' : 'body2'}
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
                flexGrow: 1,
              }}
            >
              {t(message)}{dots}
            </Typography>
          </Box>

          {/* Progress bar */}
          <Box sx={{ mt: 2, width: '100%', position: 'relative', zIndex: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: config.progressHeight,
                borderRadius: config.progressHeight / 2,
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: config.progressHeight / 2,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                },
              }}
            />
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};
