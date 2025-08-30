import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ComingSoonPopover() {
  const theme = useTheme();
  const { t } = useTranslation();

  // Simple state for popover
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Enhanced open handler with proper anchor element handling
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    // Prevent default behavior to avoid any navigation
    event.preventDefault();
    event.stopPropagation();

    // Set the anchor element to the current target
    setAnchorEl(event.currentTarget);
  };

  // Features list - same as in ComingSoonCard
  const features = [
    {
      icon: 'mdi:content-paste',
      title: t('comingSoon.features.templates.title', 'Built-in Templates'),
      description: t('comingSoon.features.templates.description', 'Create articles from pre-designed templates for various content types'),
      eta: t('comingSoon.eta.soon', 'Coming soon')
    },
    {
      icon: 'mdi:file-multiple-outline',
      title: t('comingSoon.features.aiAgent.title', 'Bulk Generation'),
      description: t('comingSoon.features.aiAgent.description', 'Generate multiple articles in a single batch to save time'),
      eta: t('comingSoon.eta.soon', 'Coming soon')
    },
    // Add a third feature for the popover
    {
      icon: 'mdi:chart-timeline-variant',
      title: t('comingSoon.features.customModel.title', 'Advanced Analytics'),
      description: t('comingSoon.features.customModel.description', 'Get detailed insights into your content performance'),
      eta: t('comingSoon.eta.soon', 'Coming soon')
    }
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 1200, // Higher z-index for the container
      }}
    >
      <IconButton
        onClick={handleOpen}
        sx={{
          position: 'relative',
          p: 0.5,
          transition: 'all 0.2s ease',
          color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
        }}
      >
        <Badge
          badgeContent={features.length}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              top: 4,
              right: 4,
              fontSize: 10,
              minWidth: 16,
              height: 16,
            },
          }}
        >
          <Iconify icon="mdi:rocket-launch" width={24} height={24} />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        disableRestoreFocus // Prevents focus issues that can cause reopening
        disableScrollLock // Prevents scroll issues
        disablePortal={false} // Use portal for better positioning
        keepMounted={false} // Don't keep in DOM when closed
        slotProps={{
          paper: {
            sx: {
              width: 320,
              maxHeight: '85vh',
              mt: 1.5,
              overflow: 'hidden',
              boxShadow: theme.customShadows.z16,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
              bgcolor: theme.palette.background.paper,
              zIndex: 1300, // Higher z-index to ensure it appears above other elements
            },
          },
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Iconify
              icon="mdi:rocket-launch"
              width={24}
              height={24}
              sx={{
                color: theme.palette.primary.main,
                mr: 1
              }}
            />
            <Typography variant="subtitle1" fontWeight="bold">
              {t('comingSoon.title', 'Coming Soon')}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {t('comingSoon.description', 'We\'re constantly improving our platform. Here\'s what\'s coming next:')}
          </Typography>
        </Box>

        {/* Features List */}
        <Box sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                p: 1.5,
                mb: index < features.length - 1 ? 2 : 0,
                borderRadius: 1.5,
                border: `1px solid ${theme.palette.divider}`,
                background: alpha(theme.palette.background.default, 0.5),
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: theme.shadows[2],
                  transform: 'translateY(-2px)',
                  borderColor: theme.palette.primary.light,
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    p: 0.75,
                    borderRadius: 1,
                    background: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mr: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Iconify icon={feature.icon} width={18} height={18} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Chip
                      label={feature.eta}
                      size="small"
                      color="info"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.65rem' }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 0.5 }} />

        {/* Footer */}
        <Box sx={{ p: 1.5, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {t('comingSoon.stayTuned', 'Stay tuned for more exciting features!')}
          </Typography>
        </Box>
      </Popover>
    </Box>
  );
}
