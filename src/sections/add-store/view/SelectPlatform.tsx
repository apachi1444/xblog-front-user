import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Check, ChevronRight } from 'lucide-react';

import { Box, Grid, Card, Paper, alpha, Button, useTheme, Container, Typography } from '@mui/material';

// Platform images with working URLs
const PLATFORM_IMAGES = {
  // Websites
  wordpress: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/WordPress_blue_logo.svg/512px-WordPress_blue_logo.svg.png',
  shopify: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/512px-Shopify_logo_2018.svg.png',
  wix: 'https://cdn.worldvectorlogo.com/logos/wix-1.svg',
  ebay: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/512px-EBay_logo.svg.png',
  custom: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/512px-HTML5_logo_and_wordmark.svg.png',

  // Social Media
  linkedin: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/512px-LinkedIn_logo_initials.png',
  reddit: 'https://cdn.worldvectorlogo.com/logos/reddit-4.svg',
  quora: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Quora_logo_2015.svg/512px-Quora_logo_2015.svg.png',
  x: 'https://cdn.worldvectorlogo.com/logos/x-logo-black.svg',
  instagram: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/512px-Instagram_icon.png',
};

interface Platform {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  enabled: boolean;
}

interface SelectPlatformProps {
  platforms: Platform[];
  selectedPlatform: string;
  onSelectPlatform: (platform: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SelectPlatform({
  selectedPlatform,
  onSelectPlatform,
  onNext,
  onBack,
  platforms
}: SelectPlatformProps) {
  const theme = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleNext = () => {
    if (selectedPlatform) {
      onNext();
    }
  };

  // Use provided icon first (for local images), fallback to remote URLs
  const getPlatformImage = (platformId: string, providedIcon: string) => providedIcon || PLATFORM_IMAGES[platformId as keyof typeof PLATFORM_IMAGES];

  // Group platforms by category
  const websitePlatforms = platforms.filter(p => p.category === 'websites');
  const socialMediaPlatforms = platforms.filter(p => p.category === 'socialMedia');

  // Render platform cards
  const renderPlatformCards = (platformList: Platform[], delay = 0) => (
    platformList.map((platform, index) => (
      <Grid item xs={6} sm={4} md={3} lg={2.4} key={platform.id} component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.5, delay: (delay + index) * 0.1 }}
      >
        <Card
          onClick={() => platform.enabled && onSelectPlatform(platform.id)}
          sx={{
            p: 2.5,
            height: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: platform.enabled ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            borderRadius: 2,
            border: '1px solid',
            borderColor: selectedPlatform === platform.id
              ? theme.palette.primary.main
              : alpha(theme.palette.divider, 0.1),
            boxShadow: selectedPlatform === platform.id
              ? `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`
              : 'none',
            backgroundColor: platform.enabled
              ? (selectedPlatform === platform.id
                  ? alpha(theme.palette.primary.main, 0.05)
                  : theme.palette.background.paper)
              : alpha(theme.palette.grey[300], 0.3),
            opacity: platform.enabled ? 1 : 0.6,
            '&:hover': platform.enabled ? {
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 16px ${alpha(theme.palette.grey[500], 0.2)}`,
              borderColor: alpha(theme.palette.primary.main, 0.5),
            } : {},
            position: 'relative',
          }}
        >
          <Box
            component="img"
            src={getPlatformImage(platform.id, platform.icon)}
            alt={platform.name}
            sx={{
              width: 60,
              height: 60,
              mb: 2,
              objectFit: 'contain',
              transition: 'all 0.3s ease',
              filter: platform.enabled
                ? (selectedPlatform === platform.id ? 'none' : 'grayscale(30%)')
                : 'grayscale(100%)',
              opacity: platform.enabled
                ? (selectedPlatform === platform.id ? 1 : 0.8)
                : 0.5,
            }}
          />
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              mb: 0.75,
              fontSize: '1rem',
              color: platform.enabled
                ? (selectedPlatform === platform.id
                    ? theme.palette.primary.main
                    : theme.palette.text.primary)
                : theme.palette.text.disabled
            }}
          >
            {platform.name}
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{
              mb: 1,
              fontSize: '0.875rem',
              lineHeight: 1.3,
              color: platform.enabled
                ? (selectedPlatform === platform.id
                    ? theme.palette.text.primary
                    : theme.palette.text.secondary)
                : theme.palette.text.disabled,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {platform.description}
          </Typography>

          {/* Coming Soon badge for disabled platforms */}
          {!platform.enabled && (
            <>
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.grey[600], 0.8),
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px'
                }}
              >
                🔒
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: alpha(theme.palette.warning.main, 0.9),
                  color: 'white',
                  px: 1,
                  py: 0.25,
                  borderRadius: 0.5,
                  fontSize: '9px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Coming Soon
              </Box>
            </>
          )}

          {selectedPlatform === platform.id && (
            <Box
              component={motion.div}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 20,
                height: 20,
                display: 'flex',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                boxShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.4)}`,
              }}
            >
              <Check size={12} />
            </Box>
          )}
        </Card>
      </Grid>
    ))
  );

  return (
    <Container maxWidth="xl" component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          background: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
          mb: 3
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 1,
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Select Platform
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Choose where you want to publish your content
        </Typography>

        {/* Availability Notice */}
        <Box
          sx={{
            mb: 3,
            p: 1.5,
            borderRadius: 1.5,
            bgcolor: alpha(theme.palette.info.main, 0.1),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            maxWidth: 500,
            mx: 'auto'
          }}
        >
          <Typography
            variant="body2"
            align="center"
            sx={{
              color: theme.palette.info.main,
              fontWeight: 500,
              mb: 0.25,
              fontSize: '0.875rem'
            }}
          >
            🚀 Currently Available: WordPress
          </Typography>
          <Typography
            variant="caption"
            align="center"
            color="text.secondary"
            sx={{ fontSize: '0.75rem' }}
          >
            More platforms coming soon! We&apos;re working hard to bring you Shopify, Wix, and social media integrations.
          </Typography>
        </Box>

        {/* Websites Section */}
        {websitePlatforms.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: theme.palette.primary.main,
                }}
              />
              Websites & E-commerce
            </Typography>
            <Grid container spacing={2} justifyContent="flex-start">
              {renderPlatformCards(websitePlatforms, 0)}
            </Grid>
          </Box>
        )}

        {/* Social Media Section */}
        {socialMediaPlatforms.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: theme.palette.secondary.main,
                }}
              />
              Social Media Platforms
            </Typography>
            <Grid container spacing={2} justifyContent="flex-start">
              {renderPlatformCards(socialMediaPlatforms, websitePlatforms.length)}
            </Grid>
          </Box>
        )}
        
        {!selectedPlatform && (
          <Typography
            color="error"
            variant="body2"
            align="center"
            sx={{
              mb: 3,
              fontWeight: 500,
              opacity: 0.9,
              animation: !selectedPlatform ? 'pulse 1.5s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { opacity: 0.6 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.6 },
              },
            }}
          >
            Please select a platform to continue
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 2,
            pt: 3,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Button
            variant="outlined"
            onClick={onBack}
            size="large"
            sx={{
              borderRadius: 1.5,
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: theme.shadows[1],
              },
            }}
          >
            Back to Stores
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ChevronRight size={18} />}
            disabled={!selectedPlatform}
          >
            Next
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}