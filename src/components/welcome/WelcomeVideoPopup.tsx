import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  alpha,
  Dialog,
  Button,
  Checkbox,
  useTheme,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// Define the video URL - this should be replaced with your actual tutorial video
const TUTORIAL_VIDEO_URL = 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Replace with your actual video URL

interface WelcomeVideoPopupProps {
  open: boolean;
  onClose: (dontShowAgain?: boolean) => void;
}

export function WelcomeVideoPopup({ open, onClose }: WelcomeVideoPopupProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Handle checkbox change
  const handleDontShowAgainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDontShowAgain(event.target.checked);
  };

  // Handle close button click
  const handleClose = () => {
    onClose(dontShowAgain);
  };

  // Handle "Get Started" button click
  const handleGetStarted = () => {
    onClose(dontShowAgain);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[10],
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 2,
        }}
      >
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {t('welcome.title', 'Welcome to XBlog!')}
        </Typography>
        <IconButton 
          onClick={handleClose} 
          size="small" 
          sx={{ color: 'primary.contrastText' }}
        >
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
          <iframe
            src={TUTORIAL_VIDEO_URL}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={t('welcome.videoTitle', 'How to use XBlog')}
          />
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('welcome.learnTitle', 'Learn how to use XBlog in minutes')}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            {t(
              'welcome.description',
              'This quick tutorial will show you how to generate high-quality content, publish to your website, and schedule posts for maximum impact.'
            )}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2, 
            mt: 3,
            p: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 1,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}>
            {[
              {
                icon: 'mdi:file-document-plus',
                title: t('welcome.feature1.title', 'Generate Content'),
                description: t('welcome.feature1.description', 'Create SEO-optimized articles with AI'),
              },
              {
                icon: 'mdi:publish',
                title: t('welcome.feature2.title', 'Publish'),
                description: t('welcome.feature2.description', 'Publish directly to your website'),
              },
              {
                icon: 'mdi:calendar-month',
                title: t('welcome.feature3.title', 'Schedule'),
                description: t('welcome.feature3.description', 'Plan your content calendar'),
              },
            ].map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Iconify
                  icon={feature.icon}
                  width={24}
                  height={24}
                  sx={{ color: 'primary.main', mt: 0.5 }}
                />
                <Box>
                  <Typography variant="subtitle2">{feature.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <FormControlLabel
          control={
            <Checkbox 
              checked={dontShowAgain} 
              onChange={handleDontShowAgainChange} 
              color="primary"
            />
          }
          label={
            <Typography variant="body2" color="text.secondary">
              {t('welcome.dontShowAgain', "Don't show this again")}
            </Typography>
          }
        />
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGetStarted}
          startIcon={<Iconify icon="mdi:rocket-launch" />}
          sx={{ 
            px: 3,
            borderRadius: 6,
            boxShadow: theme.shadows[3],
          }}
        >
          {t('welcome.getStarted', 'Get Started')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
