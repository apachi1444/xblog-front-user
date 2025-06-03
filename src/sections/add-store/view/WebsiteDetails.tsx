import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';

import { 
  Box, 
  Paper,
  alpha, 
  Button, 
  Dialog,
  Tooltip,
  useTheme,
  Container,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  CircularProgress
} from '@mui/material';

import WordPressForm from './platform-forms/WordPressForm';

// Video mapping for each platform
const PLATFORM_VIDEOS = {
  wordpress: 'https://www.youtube.com/embed/example-wordpress',
  shopify: 'https://www.youtube.com/embed/example-shopify',
  wix: 'https://www.youtube.com/embed/example-wix',
};

interface WebsiteDetailsProps {
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function WebsiteDetails({
  onSubmit,
  onBack,
  isLoading = false,
}: WebsiteDetailsProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  const formData = {
    platform: 'wordpress',
  };
  
  // Update the handleSubmit function
  const handleSubmit = async () => {
    const isValid = true;
    
    if (isValid) {
      onSubmit();
    } else {
      toast.error(t('store.formErrors'));
    }
  };
  
  // Update the renderPlatformForm function
  const renderPlatformForm = () => {
    switch (formData.platform) {
      case 'wordpress':
        return (
          <WordPressForm />
        );
      case 'shopify':
        return (
          <WordPressForm />
        );
      case 'wix':
        return (
          <WordPressForm />
        );
      case 'other':
      default:
        return (
          <Typography color="error" variant="body1" align="center">
            {t('store.selectPlatformFirst', 'Please select a platform first')}
          </Typography>
        );
    }
  };

  // Get the appropriate video URL based on the selected platform
  const getVideoUrl = () => PLATFORM_VIDEOS[formData.platform as keyof typeof PLATFORM_VIDEOS] || '';

  // Get platform display name
  const getPlatformDisplayName = () => {
    if (!formData.platform || formData.platform === 'other') return '';
    return t(`store.platforms.${formData.platform}`, formData.platform);
  };

  // Make sure we're actually rendering content
  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Form Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              flex: '1 1 60%',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                {t('store.integrationTitle', { platform: getPlatformDisplayName() })}
              </Typography>
              
              <Tooltip title={t('store.guide.watchTooltip')}>
                <IconButton 
                  color="primary" 
                  onClick={() => setVideoDialogOpen(true)}
                  disabled={!formData.platform}
                >
                  <HelpCircle size={20} />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('store.integrationSubtitle', { platform: getPlatformDisplayName() })}
            </Typography>
            
            {renderPlatformForm()}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={onBack}
                startIcon={<ChevronLeft size={16} />}
                disabled={isLoading}
              >
                {t('store.back')}
              </Button>
              
              <Button
                variant="contained"
                onClick={handleSubmit}
                endIcon={isLoading ? null : <ChevronRight size={16} />}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    {t('store.connecting')}
                  </>
                ) : (
                  t('store.connect')
                )}
              </Button>
            </Box>
          </Paper>

          {/* Video Guide Section - Visible alongside the form */}
          {formData.platform && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                flex: '1 1 40%',
                display: { xs: 'none', md: 'block' }, // Hide on mobile, show on desktop
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t('store.guide.title')}
              </Typography>
              
              <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%', mb: 2 }}>
                <iframe
                  src={getVideoUrl()}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={t('store.guide.videoTitle', { platform: getPlatformDisplayName() })}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                {t('store.guide.description', { platform: getPlatformDisplayName() })}
              </Typography>
              
              {/* Mobile-only button to open full-screen video */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setVideoDialogOpen(true)}
                  startIcon={<HelpCircle size={16} />}
                  fullWidth
                >
                  {t('store.guide.watchButton')}
                </Button>
              </Box>
            </Paper>
          )}
        </Box>
      </motion.div>

      {/* Video Guide Dialog - For full-screen viewing */}
      <Dialog
        open={videoDialogOpen}
        onClose={() => setVideoDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {t('store.guide.dialogTitle', { platform: getPlatformDisplayName() })}
          </Typography>
          <IconButton onClick={() => setVideoDialogOpen(false)} size="small">
            <Box component="span" sx={{ fontSize: '1.5rem' }}>&times;</Box>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
            <iframe
              src={getVideoUrl()}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '8px',
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={t('store.guide.videoTitle', { platform: getPlatformDisplayName() })}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {t('store.guide.dialogDescription', { platform: getPlatformDisplayName() })}
          </Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
}