import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';

import { UNIFIED_TEMPLATES } from 'src/utils/templateUtils';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface ParentTemplateCardProps {
  parentTemplate: any; // Parent template from PARENT_TEMPLATES
  onSelect: (childTemplateId: string) => void;
}

export function ParentTemplateCard({ parentTemplate, onSelect }: ParentTemplateCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const { parent_id, title, popular, isNew, icon } = parentTemplate;

  // Get child templates for this parent
  const children = UNIFIED_TEMPLATES.filter(child => child.parent_id === parent_id);
  
  // State management
  const [isHovered, setIsHovered] = useState(false);
  const [currentChildIndex, setCurrentChildIndex] = useState(0);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  // Use refs to store interval and animation frame IDs
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const slideshowIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slideshow functionality - pause when hovering
  useEffect(() => {
    // Clear existing interval
    if (slideshowIntervalRef.current) {
      clearInterval(slideshowIntervalRef.current);
      slideshowIntervalRef.current = null;
    }

    if (children.length <= 1 || isHovered) return; // Pause when hovering or single child

    slideshowIntervalRef.current = setInterval(() => {
      setCurrentChildIndex(prev => (prev + 1) % children.length);
    }, 3000); // Change every 3 seconds

    // eslint-disable-next-line consistent-return
    return () => {
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
        slideshowIntervalRef.current = null;
      }
    };
  }, [children.length, isHovered]);

  // Enhanced HTML content processing with proper iframe setup
  const processHtmlContent = (htmlString: string): string => {
    // Add responsive viewport meta tag and ensure proper scaling
    const enhancedHtml = htmlString.replace(
      /<head>/i,
      `<head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <style>
          /* Ensure the iframe content scales properly */
          * {
            box-sizing: border-box;
          }
          
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            -webkit-text-size-adjust: none;
            -moz-text-size-adjust: none;
            -ms-text-size-adjust: none;
            text-size-adjust: none;
          }
          
          body {
            transform-origin: top left;
            /* Scale down content to fit preview */
            transform: scale(0.7);
            width: 142.86%; /* 100% / 0.7 to compensate for scaling */
          }
          
          /* Prevent any fixed positioning issues */
          * {
            position: relative !important;
          }
          
          /* Ensure images and media scale properly */
          img, video, iframe {
            max-width: 100%;
            height: auto;
          }
          
          /* Remove any potential scroll bars */
          ::-webkit-scrollbar {
            display: none;
          }
          
          /* Ensure text is readable at smaller scales */
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        </style>`
    );

    return enhancedHtml;
  };

  // Load HTML content for current child - optimized with enhanced processing
  useEffect(() => {
    let isCancelled = false;

    const loadTemplate = async () => {
      if (children.length === 0) return;

      try {
        const currentChild = children[currentChildIndex];
        if (!currentChild?.htmlFile) {
          setHtmlContent(`
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    text-align: center;
                    color: #999;
                    background: #f5f5f5;
                  }
                </style>
              </head>
              <body>
                <div>
                  <h3>Preview Unavailable</h3>
                  <p>Template file not found</p>
                </div>
              </body>
            </html>
          `);
          return;
        }

        const response = await fetch(`/${currentChild.htmlFile}`);
        if (response.ok) {
          const content = await response.text();
          if (!isCancelled) {
            // Process the HTML content for better iframe display
            const processedContent = processHtmlContent(content);
            setHtmlContent(processedContent);
          }
        }
      } catch (error) {
        if (!isCancelled) {
          setHtmlContent(`
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    text-align: center;
                    color: #999;
                    background: #f5f5f5;
                  }
                </style>
              </head>
              <body>
                <div>
                  <h3>Preview Unavailable</h3>
                  <p>Error loading template</p>
                </div>
              </body>
            </html>
          `);
        }
      }
    };

    loadTemplate();

    return () => {
      isCancelled = true;
    };
  }, [currentChildIndex, children]);

  // Auto-scroll functionality on hover - optimized
  useEffect(() => {
    // Clear existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (isAutoScrolling && htmlContent) {
      const startTime = Date.now();
      const scrollDuration = 10000; // 10 seconds to scroll through entire content
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed % scrollDuration) / scrollDuration;
        
        // Scroll smoothly through the content
        // Since iframe height is increased to 200%, we can scroll up to 50% to show all content
        const maxScrollPercentage = 50; // This will show the bottom half of the 200% height iframe
        const newScrollPosition = progress * maxScrollPercentage;

        setScrollPosition(newScrollPosition);

        if (isAutoScrolling) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isAutoScrolling, htmlContent]);

  // Reset scroll position when changing templates
  useEffect(() => {
    setScrollPosition(0);
    setIsAutoScrolling(false);
  }, [currentChildIndex]);

  // Cleanup on unmount
  useEffect(() => () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
      }
    }, []);

  // Event handlers
  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsAutoScrolling(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsAutoScrolling(false);
    setScrollPosition(0); // Reset to starting position
  };

  const handleDemoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (children.length > 0) {
      const currentChild = children[currentChildIndex];
      const templateFile = currentChild.htmlFile || `template${currentChild.id.replace('template', '')}.html`;
      window.open(`/${templateFile}`, '_blank');
    }
  };

  const handleBulletClick = (index: number) => {
    setCurrentChildIndex(index);
  };

  const handleSelectTemplate = () => {
    if (children.length > 0) {
      const currentChild = children[currentChildIndex];
      onSelect(currentChild.id);
    }
  };

  // Button configuration based on current child template
  const getButtonConfig = () => {
    const isUserOnFreePlan = true; // Simplified for now
    const currentChild = children[currentChildIndex];

    if (!currentChild) {
      return {
        label: t('common.generate', 'Generate'),
        disabled: true,
        action: () => {},
        color: 'inherit' as const,
        icon: 'mdi:lightning-bolt',
      };
    }

    // Since children are now from UNIFIED_TEMPLATES, we can directly check properties
    // Handle coming soon templates
    if (currentChild.comingSoon) {
      return {
        label: t('common.comingSoon', 'Coming Soon'),
        disabled: true,
        action: () => {},
        color: 'inherit' as const,
        icon: 'mdi:clock-outline',
      };
    }

    // Handle locked/premium templates
    if (currentChild.locked) {
      // Template requires premium access
      if (isUserOnFreePlan) {
        return {
          label: t('common.upgrade', 'Upgrade'),
          disabled: false,
          action: () => navigate('/upgrade-license'),
          color: 'warning' as const,
          icon: 'mdi:crown',
        };
      }

      // User has premium access
      return {
        label: t('common.generate', 'Generate'),
        disabled: false,
        action: handleSelectTemplate,
        color: 'primary' as const,
        icon: 'mdi:lightning-bolt',
      };
    }

    // Handle free templates
    return {
      label: t('common.generate', 'Generate'),
      disabled: false,
      action: handleSelectTemplate,
      color: 'primary' as const,
      icon: 'mdi:lightning-bolt',
    };
  };

  const buttonConfig = getButtonConfig();
  const currentChild = children[currentChildIndex];

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
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          background: theme.palette.background.paper,
          '&:hover': {
            boxShadow: theme.shadows[8],
            borderColor: alpha(theme.palette.primary.main, 0.3),
          },
        }}
      >
        {/* PARENT TEMPLATE HEADER - Compact & Neutral */}
        <CardContent sx={{ p: 2, pb: 1.5 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Neutral Template Icon */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.grey[100]} 0%, ${theme.palette.grey[200]} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0,
                color: theme.palette.grey[600],
              }}
            >
              {icon}
            </Box>

            {/* Compact Template Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Title and Use Case in same line */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {parentTemplate.name}
                </Typography>
              </Stack>

              {/* Compact Badges */}
              <Stack direction="row" spacing={1}>
                <Chip
                  size="small"
                  label="Layout Family"
                  sx={{
                    bgcolor: alpha(theme.palette.grey[500], 0.1),
                    color: theme.palette.grey[700],
                    fontWeight: 500,
                    fontSize: '0.7rem',
                    height: 20,
                  }}
                />
                {popular && (
                  <Chip
                    size="small"
                    color="warning"
                    label={t('common.popular', 'Popular')}
                    icon={<Iconify icon="mdi:fire" />}
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                )}
                {isNew && (
                  <Chip
                    size="small"
                    color="info"
                    label={t('common.new', 'New')}
                    icon={<Iconify icon="mdi:star" />}
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>
        </CardContent>

        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.3) }} />

        {/* CHILD TEMPLATES SHOWCASE SECTION */}
        <Box sx={{ p: 2.5, pt: 1.5 }}>
          {/* Child Template Preview - Larger Height */}
          <Box
            sx={{
              position: 'relative',
              height: 340, // Increased from 200 to 340
              overflow: 'hidden',
              bgcolor: 'background.neutral',
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              '&:hover': {
                borderColor: alpha(theme.palette.primary.main, 0.3),
                boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.1)}`,
              },
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* HTML Preview Content with Enhanced iframe */}
            {htmlContent ? (
              <iframe
                key={`${currentChildIndex}-${currentChild?.id}`} // Force re-render on template change
                srcDoc={htmlContent}
                title={`${currentChild?.title || title} Preview`}
                sandbox="allow-same-origin allow-scripts"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '200%', // Make iframe taller to contain more content
                  border: 'none',
                  pointerEvents: 'none',
                  transform: `translateY(-${scrollPosition}%)`,
                  transformOrigin: 'top left',
                  transition: isAutoScrolling ? 'none' : 'transform 0.3s ease-out',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  background: 'white',
                  // Ensure iframe content is properly scaled
                  zoom: 1,
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

            {/* Auto-scroll Progress Indicator */}
            {isAutoScrolling && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 4,
                  height: 60,
                  bgcolor: alpha(theme.palette.common.white, 0.3),
                  borderRadius: 2,
                  zIndex: 5,
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: `${(scrollPosition / 50) * 100}%`, // Adjust for 50% max scroll range
                    bgcolor: theme.palette.primary.main,
                    borderRadius: 2,
                    transition: 'height 0.05s linear',
                  }}
                />
              </Box>
            )}

            {/* Demo Button Overlay */}
            <AnimatePresence>
              {isHovered && (
                <>
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
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        boxShadow: 4,
                        fontSize: '0.9rem',
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
        </Box>

        {/* PARENT TEMPLATE CONTROLS */}
        <Box sx={{ p: 3, pt: 0 }}>
          {/* Bullet Navigation - Clearly separated from child content */}
          {children.length > 1 && (
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1} justifyContent="center">
                {children.map((child, index) => (
                  <Box
                    key={child.id}
                    onClick={() => handleBulletClick(index)}
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: index === currentChildIndex
                        ? theme.palette.primary.main
                        : alpha(theme.palette.grey[500], 0.3),
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: `2px solid ${index === currentChildIndex
                        ? alpha(theme.palette.primary.main, 0.3)
                        : 'transparent'}`,
                      '&:hover': {
                        bgcolor: theme.palette.primary.main,
                        transform: 'scale(1.3)',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Action Buttons */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color={buttonConfig.color}
              disabled={buttonConfig.disabled}
              onClick={buttonConfig.action}
              startIcon={<Iconify icon={buttonConfig.icon} />}
              sx={{
                flex: '0 0 70%',
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                transition: 'all 0.3s ease',
              }}
            >
              {buttonConfig.label}
            </Button>

            <Button
              variant="outlined"
              onClick={handleDemoClick}
              startIcon={<Iconify icon="mdi:play" />}
              sx={{
                flex: '0 0 28%',
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                borderColor: alpha(theme.palette.primary.main, 0.3),
                color: theme.palette.primary.main,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  transform: 'translateY(-1px)',
                  boxShadow: theme.shadows[2],
                },
              }}
            >
              Demo
            </Button>
          </Stack>
        </Box>
      </Card>
    </motion.div>
  );
}