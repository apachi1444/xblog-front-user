import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronRight } from 'lucide-react';

import { Box, Grid, Card, Paper, alpha, Button, useTheme, Container, Typography } from '@mui/material';

// Real platform images
const PLATFORM_IMAGES = {
  wordpress: 'https://s.w.org/style/images/about/WordPress-logotype-standard.png',
  shopify: 'https://cdn.shopify.com/s/files/1/0070/7032/files/shopify-logo-green.png',
  WrapTextOutlined: 'https://clipground.com/images/wix-logo-png-9.jpg',
  magento: '/assets/images/platforms/magento.png',
  prestashop: '/assets/images/platforms/prestashop.png',
  custom: '/assets/images/platforms/custom-website.png',
};

interface SelectPlatformProps {
  platforms: { id: string; name: string; icon: string; description: string }[];
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
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleNext = () => {
    if (selectedPlatform) {
      onNext();
    }
  };

  // Get real platform image or fallback to the provided icon
  const getPlatformImage = (platformId: string, providedIcon: string) => PLATFORM_IMAGES[platformId as keyof typeof PLATFORM_IMAGES] || providedIcon;

  return (
    <Container maxWidth="md" component={motion.div} 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
          mb: 4
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
          {t('store.selectPlatform')}
        </Typography>
        
        <Typography 
          variant="body1" 
          align="center" 
          color="text.secondary" 
          sx={{ mb: 4 }}
        >
          {t('store.selectPlatformSubtitle')}
        </Typography>
        
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
          {platforms.map((platform, index) => (
            <Grid item xs={12} sm={6} md={4} key={platform.id} component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                onClick={() => onSelectPlatform(platform.id)}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: selectedPlatform === platform.id 
                    ? theme.palette.primary.main 
                    : alpha(theme.palette.divider, 0.1),
                  boxShadow: selectedPlatform === platform.id 
                    ? `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}` 
                    : 'none',
                  backgroundColor: selectedPlatform === platform.id 
                    ? alpha(theme.palette.primary.main, 0.05) 
                    : theme.palette.background.paper,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 20px ${alpha(theme.palette.grey[500], 0.2)}`,
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  },
                }}
              >
                <Box
                  component="img"
                  src={getPlatformImage(platform.id, platform.icon)}
                  alt={platform.name}
                  sx={{
                    width: 80,
                    height: 80,
                    mb: 2.5,
                    objectFit: 'contain',
                    transition: 'all 0.3s ease',
                    filter: selectedPlatform === platform.id ? 'none' : 'grayscale(30%)',
                    opacity: selectedPlatform === platform.id ? 1 : 0.8,
                  }}
                />
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  sx={{ 
                    mb: 1,
                    color: selectedPlatform === platform.id 
                      ? theme.palette.primary.main 
                      : theme.palette.text.primary
                  }}
                >
                  {t(`store.platforms.${platform.id}`)}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  align="center"
                  sx={{ 
                    mb: 2,
                    color: selectedPlatform === platform.id 
                      ? theme.palette.text.primary 
                      : theme.palette.text.secondary
                  }}
                >
                  {t(`store.${platform.id}.description`)}
                </Typography>
                
                {selectedPlatform === platform.id && (
                  <Box
                    component={motion.div}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    sx={{
                      mt: 1,
                      width: 28,
                      height: 28,
                      display: 'flex',
                      borderRadius: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.4)}`,
                    }}
                  >
                    <Check size={16} />
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
        
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
            {t('store.selectPlatformRequired')}
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
            {t('store.backToStores')}
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ChevronRight size={18} />}
            disabled={!selectedPlatform}
          >
            {t('store.next')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}