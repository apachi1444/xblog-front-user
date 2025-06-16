/* eslint-disable consistent-return */
import type { SubscriptionPlan } from 'src/services/apis/subscriptionApi';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Star, Close, Create, CheckCircle, AutoAwesome } from '@mui/icons-material';
import {
  Box,
  Fade,
  Zoom,
  Chip,
  Modal,
  Button,
  useTheme,
  Typography,
  IconButton,
} from '@mui/material';

interface SubscriptionSuccessAnimationProps {
  open: boolean;
  onClose: () => void;
  plan?: SubscriptionPlan; // Plan matched from Redux store using subscriptionId
  subscriptionId: string; // This is the same as the planId
}

export function SubscriptionSuccessAnimation({
  open,
  onClose,
  plan,
  subscriptionId
}: SubscriptionSuccessAnimationProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (open) {
      // Delay content animation for a smooth entrance
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } 
      setShowContent(false);
    
  }, [open]);

  const handleClose = () => {
    setShowContent(false);
    setTimeout(onClose, 200); // Delay to allow exit animation
  };

  const handleStartGenerating = () => {
    handleClose();
    // Navigate to generation page after animation closes
    setTimeout(() => {
      navigate('/generate');
    }, 300);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <Fade in={open} timeout={300}>
        <Box
          sx={{
            position: 'relative',
            width: { xs: '90%', sm: 500 },
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: theme.shadows[24],
            p: 4,
            textAlign: 'center',
            overflow: 'auto',
            border: `2px solid ${theme.palette.success.main}`,
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'text.secondary',
            }}
          >
            <Close />
          </IconButton>

          {/* Success Icon with Animation */}
          <Zoom in={showContent} timeout={600}>
            <Box
              sx={{
                mb: 3,
                position: 'relative',
                display: 'inline-block',
              }}
            >
              <CheckCircle
                sx={{
                  fontSize: 80,
                  color: 'success.main',
                  filter: 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))',
                }}
              />
              {/* Animated stars */}
              {[...Array(3)].map((_, index) => (
                <Star
                  key={index}
                  sx={{
                    position: 'absolute',
                    fontSize: 20,
                    color: 'warning.main',
                    animation: `sparkle 2s ease-in-out infinite ${index * 0.5}s`,
                    top: index === 0 ? -10 : index === 1 ? 10 : 30,
                    left: index === 0 ? -20 : index === 1 ? 60 : -15,
                    '@keyframes sparkle': {
                      '0%, 100%': {
                        opacity: 0,
                        transform: 'scale(0.5) rotate(0deg)',
                      },
                      '50%': {
                        opacity: 1,
                        transform: 'scale(1) rotate(180deg)',
                      },
                    },
                  }}
                />
              ))}
            </Box>
          </Zoom>

          {/* Success Message */}
          <Fade in={showContent} timeout={800}>
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  color: 'success.main',
                  mb: 2,
                }}
              >
                {t('subscription.success.title', 'Subscription Activated!')}
              </Typography>

              {/* Plan Name Highlight */}
              {plan && (
                <Zoom in={showContent} timeout={1000}>
                  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                    <Chip
                      icon={<AutoAwesome />}
                      label={`${plan.name} Plan`}
                      sx={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        py: 2.5,
                        px: 2,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        color: 'white',
                        boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
                        animation: 'planPulse 2s ease-in-out infinite',
                        '& .MuiChip-icon': {
                          color: 'white',
                          animation: 'iconSpin 3s linear infinite',
                        },
                        '@keyframes planPulse': {
                          '0%, 100%': {
                            transform: 'scale(1)',
                            boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
                          },
                          '50%': {
                            transform: 'scale(1.05)',
                            boxShadow: `0 6px 30px ${theme.palette.primary.main}60`,
                          },
                        },
                        '@keyframes iconSpin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                      }}
                    />
                  </Box>
                </Zoom>
              )}

              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  color: 'text.primary',
                  textAlign: 'center',
                }}
              >
                {plan
                  ? t('subscription.success.planMessage', `You have successfully activated the {{planName}} plan!`, { planName: plan.name })
                  : t('subscription.success.genericMessage', 'Your subscription has been successfully activated!')
                }
              </Typography>

              {/* Plan Details */}
              {plan && (
                <Box
                  sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {plan.name} Plan
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('subscription.success.subscriptionId', 'Subscription ID: {{id}}', { id: subscriptionId })}
                  </Typography>
                </Box>
              )}

              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: 'text.secondary',
                  textAlign: 'center',
                }}
              >
                {plan
                  ? t('subscription.success.planDescription', 'Your {{planName}} plan is now active! Unlock the full potential of AI-powered content creation.', { planName: plan.name })
                  : t('subscription.success.description', 'You can now enjoy all the features of your new plan. Start creating amazing content!')
                }
              </Typography>

              {/* Engaging CTA Button */}
              <Button
                variant="contained"
                size="large"
                onClick={handleStartGenerating}
                startIcon={<Create />}
                endIcon={<AutoAwesome />}
                sx={{
                  px: 5,
                  py: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: `0 12px 40px ${theme.palette.primary.main}60`,
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover::before': {
                    left: '100%',
                  },
                }}
              >
                {t('subscription.success.startCreating', 'Start Creating Amazing Content')}
              </Button>
            </Box>
          </Fade>
        </Box>
      </Fade>
    </Modal>
  );
}
