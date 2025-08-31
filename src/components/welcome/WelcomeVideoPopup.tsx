import { useState } from 'react';

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

// Define the tutorial website URL
const TUTORIAL_WEBSITE_URL = 'https://xblog.ai';

interface WelcomeVideoPopupProps {
  open: boolean;
  onClose: (dontShowAgain?: boolean) => void;
}

export function WelcomeVideoPopup({ open, onClose }: WelcomeVideoPopupProps) {
  const theme = useTheme();
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

  // Handle "Watch Tutorial" button click
  const handleWatchTutorial = () => {
    window.open(TUTORIAL_WEBSITE_URL, '_blank');
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
          Welcome to XBlog!
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
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            p: 4,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Iconify
              icon="mdi:play-circle"
              width={80}
              height={80}
              sx={{ mb: 2, opacity: 0.9 }}
            />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Watch Our Tutorial
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, fontWeight: 400 }}>
              Learn how to create amazing content in minutes
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={handleWatchTutorial}
              startIcon={<Iconify icon="mdi:external-link" />}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                fontSize: '1.1rem',
                boxShadow: theme.shadows[4],
                '&:hover': {
                  bgcolor: alpha('#fff', 0.9),
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8],
                },
                transition: 'all 0.3s ease',
              }}
            >
              Visit xblog.ai
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
            Complete Video Tutorial Available
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', textAlign: 'center' }}>
            We ve created a comprehensive video tutorial on our website that walks you through all the features step by step.
          </Typography>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mt: 3,
            p: 2,
            bgcolor: alpha(theme.palette.info.main, 0.05),
            borderRadius: 1,
            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
          }}>
            {[
              {
                icon: 'mdi:video-outline',
                title: 'Step-by-Step Tutorial',
                description: 'Complete walkthrough of all features',
              },
              {
                icon: 'mdi:lightbulb-outline',
                title: 'Best Practices',
                description: 'Tips for creating high-quality content',
              },
              {
                icon: 'mdi:rocket-launch-outline',
                title: 'Quick Start Guide',
                description: 'Get up and running in minutes',
              },
            ].map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Iconify
                  icon={feature.icon}
                  width={24}
                  height={24}
                  sx={{ color: 'info.main', mt: 0.5 }}
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
              Don t show this again
            </Typography>
          }
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleWatchTutorial}
            startIcon={<Iconify icon="mdi:external-link" />}
            sx={{
              px: 3,
              borderRadius: 6,
            }}
          >
            Watch Tutorial
          </Button>

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
            Get Started
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
