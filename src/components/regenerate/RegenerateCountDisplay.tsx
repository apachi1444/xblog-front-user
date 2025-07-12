// Types

import React from 'react';
import { useTranslation } from 'react-i18next';

import { alpha } from '@mui/material/styles';
// Icons
import AutorenewIcon from '@mui/icons-material/Autorenew';
// MUI components
import { Box, Tooltip, useTheme, Typography } from '@mui/material';

import { useRegenerateManager } from 'src/sections/generate/hooks/useRegenerateManager';

export function RegenerateCountDisplay() {
  const { t } = useTranslation();
  const theme = useTheme();

  const { regenerationsAvailable, regenerationsTotal } = useRegenerateManager();

  // Calculate used regenerations
  const regenerationsUsed = regenerationsTotal - regenerationsAvailable;

  // Calculate percentage for color determination (based on available/total)
  const percentage = Math.min((regenerationsAvailable / regenerationsTotal) * 100, 100);

  // Determine color based on remaining regenerations
  const getRegenerateColor = () => {
    if (percentage <= 20) {
      return theme.palette.error.main; // Red for critical (less than 20%)
    } if (percentage <= 50) {
      return theme.palette.warning.main; // Orange/Yellow for low (less than 50%)
    }
    return theme.palette.success.main; // Green for high (more than 50%)
  };

  const regenerateColor = getRegenerateColor();

  // Create tooltip content with proper formatting
  const tooltipContent = (
    <Box sx={{ p: 1, maxWidth: 220 }}>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {t('regenerate.title', 'Regenerations')}
      </Typography>
      <Typography variant="body2">
        {t('regenerate.used', 'Used')}: {regenerationsUsed}/{regenerationsTotal}
      </Typography>
      <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold' }}>
        {t('resources.available', 'Available')}: {regenerationsAvailable}
      </Typography>
    </Box>
  );

  // Full version
  return (
    <Tooltip
      title={tooltipContent}
      placement="bottom"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 0.75,
          borderRadius: 2,
          bgcolor: alpha(regenerateColor, 0.1),
          border: `1px solid ${alpha(regenerateColor, 0.2)}`,
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: alpha(regenerateColor, 0.15),
          },
        }}
      >
        <AutorenewIcon sx={{ color: regenerateColor }} />
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              lineHeight: 1.2,
              color: theme.palette.text.primary,
              fontWeight: 600,
            }}
          >
            {regenerationsAvailable}/{regenerationsTotal} {t('regenerate.availableLabel', 'available')}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              lineHeight: 1,
              color: theme.palette.text.secondary,
              display: 'block',
            }}
          >
            {t('regenerate.label', 'Regenerations')}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
}
