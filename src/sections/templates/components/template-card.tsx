
import type { Template } from 'src/utils/templateUtils';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useGetSubscriptionPlansQuery, useGetSubscriptionDetailsQuery } from 'src/services/apis/subscriptionApi';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface TemplateCardProps {
  template: Template;
  onSelect: () => void;
}

// Helper function to check if a plan is free
const isFreeplan = (planName: string, planPrice: string): boolean => {
  const name = planName?.toLowerCase() || '';
  const price = planPrice || '0';

  return (
    name.includes('free') ||
    name.includes('trial') ||
    price === '0'
  );
};

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { title, description, popular, isNew, locked, comingSoon } = template;

  // State management
  const [isHovered, setIsHovered] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>('');

  // Load HTML template content
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        // Use the template files directly from public folder
        const templateFile = template.htmlFile || `template${template.id.replace('template-', '')}.html`;
        const response = await fetch(`/${templateFile}`);
        if (response.ok) {
          const content = await response.text();
          setHtmlContent(content);
        }
      } catch (error) {
        setHtmlContent('<div style="padding: 20px; text-align: center; color: #999;">Preview unavailable</div>');
      }
    };

    loadTemplate();
  }, [template.id, template.htmlFile]);

  // Get subscription data
  const { data: subscriptionDetails } = useGetSubscriptionDetailsQuery();
  const { data: availablePlans = [] } = useGetSubscriptionPlansQuery();

  // Find current plan and check access
  const currentPlan = availablePlans.find(plan => plan.id === subscriptionDetails?.plan_id);
  const isUserOnFreePlan = currentPlan ? isFreeplan(currentPlan.name, currentPlan.price) : true;



  // Event handlers
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
    }
  };

  const handleDemoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use the template files directly from public folder
    const templateFile = template.htmlFile || `template${template.id.replace('template-', '')}.html`;
    window.open(`/${templateFile}`, '_blank');
  };

  // Determine button state and action
  const getButtonConfig = () => {
    // Handle coming soon templates
    if (comingSoon) {
      return {
        label: t('common.comingSoon', 'Coming Soon'),
        disabled: true,
        action: () => {},
        color: 'inherit' as const,
        icon: 'mdi:clock-outline'
      };
    }

    // Handle free templates
    if (!locked) {
      return {
        label: t('common.generate', 'Generate'),
        disabled: false,
        action: onSelect,
        color: 'primary' as const,
        icon: 'mdi:lightning-bolt'
      };
    }

    // Template requires premium access
    if (isUserOnFreePlan) {
      return {
        label: t('common.upgrade', 'Upgrade'),
        disabled: false,
        action: () => navigate('/upgrade-license'),
        color: 'warning' as const,
        icon: 'mdi:crown'
      };
    }

    // User has premium access
    return {
      label: t('common.generate', 'Generate'),
      disabled: false,
      action: onSelect,
      color: 'primary' as const,
      icon: 'mdi:lightning-bolt'
    };
  };

  const buttonConfig = getButtonConfig();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: theme.shadows[10],
          },
        }}
      >
        {/* Template Preview Rectangle at the top */}
        <Box
          sx={{
            position: 'relative',
            height: 200,
            overflow: 'hidden',
            bgcolor: 'background.neutral',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* HTML Preview Content */}
          <Box
            sx={{
              height: '100%',
              width: '100%',
              overflow: 'hidden',
              position: 'relative',
              bgcolor: 'background.paper',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            {htmlContent ? (
              <iframe
                srcDoc={htmlContent}
                title={`${title} Preview`}
                style={{
                  width: '166.67%', // Scale compensation (1/0.6) to fill full width
                  height: '166.67%', // Scale compensation (1/0.6) to fill full height
                  border: 'none',
                  pointerEvents: 'none',
                  transform: 'scale(0.6)',
                  transformOrigin: 'top left',
                }}
              />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'text.disabled',
                  flexDirection: 'column',
                }}
              >
                <Iconify icon="mdi:file-document-outline" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="caption">Preview unavailable</Typography>
              </Box>
            )}
          </Box>

          {/* Demo Button Overlay - appears on hover over preview rectangle */}
          <AnimatePresence>
            {isHovered && (
              <>
                {/* Overlay for better button visibility */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.4)',
                    zIndex: 10,
                  }}
                />

                {/* Demo Button in center of preview */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20,
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleDemoClick}
                    startIcon={<Iconify icon="mdi:play" />}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: 4,
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        boxShadow: 6,
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Demo
                  </Button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </Box>

        {/* Card Content */}
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Header with badges and Free/Premium label */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1}>
              {popular && (
                <Chip
                  size="small"
                  color="warning"
                  label={t('common.popular', 'Popular')}
                  icon={<Iconify icon="mdi:fire" />}
                />
              )}

              {isNew && (
                <Chip
                  size="small"
                  color="info"
                  label={t('common.new', 'New')}
                  icon={<Iconify icon="mdi:star" />}
                />
              )}
            </Stack>

            {/* Free/Premium/Lock indicator */}
            {locked ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                  <Typography variant="subtitle2" sx={{ mr: 0.5 }}>
                    {t('common.premium', 'Premium')}
                  </Typography>
                  <Iconify icon="mdi:crown" />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  }}
                >
                  <Iconify
                    icon="mdi:lock"
                    sx={{
                      color: 'primary.main',
                      fontSize: 18,
                    }}
                  />
                </Box>
              </Stack>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                <Typography variant="subtitle2" sx={{ mr: 0.5 }}>
                  {t('common.free', 'Free')}
                </Typography>
                <Iconify icon="mdi:check-circle" />
              </Box>
            )}
          </Stack>

          {/* Title and Description */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2,
              lineHeight: 1.5,
            }}
          >
            {description}
          </Typography>
        </CardContent>

        {/* Action Button */}
        <Box sx={{ p: 3, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            color={buttonConfig.color}
            disabled={buttonConfig.disabled}
            onClick={buttonConfig.action}
            startIcon={<Iconify icon={buttonConfig.icon} />}
            sx={{
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              ...(buttonConfig.color === 'warning' && {
                background: `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.warning.dark}, ${theme.palette.warning.main})`,
                  transform: 'translateY(-1px)',
                  boxShadow: theme.shadows[4],
                },
              }),
              ...(buttonConfig.disabled && {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              }),
            }}
          >
            {buttonConfig.label}
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
}