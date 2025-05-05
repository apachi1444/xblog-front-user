// Types

import React from 'react';
import { useTranslation } from 'react-i18next';

import { alpha } from '@mui/material/styles';
// Icons
import AutorenewIcon from '@mui/icons-material/Autorenew';
// MUI components
import { Box, Chip, Tooltip, useTheme, Typography } from '@mui/material';

import { useRegenerateManager } from 'src/sections/generate/hooks/useRegenerateManager';

interface RegenerateCountDisplayProps {
  compact?: boolean;
}

export function RegenerateCountDisplay({ compact = false }: RegenerateCountDisplayProps) {
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

  // Compact version (for mobile or sidebar)
  if (compact) {
    return (
      <Tooltip title={t('regenerate.remaining', 'Used: {{used}}/{{total}} regenerations', {
        used: regenerationsUsed,
        total: regenerationsTotal
      })}>
        <Chip
          icon={<AutorenewIcon fontSize="small" />}
          label={`${regenerationsUsed}/${regenerationsTotal}`}
          size="small"
          sx={{
            bgcolor: alpha(regenerateColor, 0.1),
            color: regenerateColor,
            fontWeight: 'bold',
            '& .MuiChip-icon': {
              color: regenerateColor,
            },
          }}
        />
      </Tooltip>
    );
  }

  // Full version
  return (
    <Tooltip
      title={t('regenerate.info', 'Regenerations allow you to recreate content. Each regeneration decreases your available count.')}
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
            {regenerationsUsed}/{regenerationsTotal}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              lineHeight: 1,
              color: theme.palette.text.secondary,
              display: 'block',
            }}
          >
            {t('regenerate.label', 'Used Regenerations')}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
}
