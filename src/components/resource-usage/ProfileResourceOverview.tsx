import { useTranslation } from 'react-i18next';

import { Box, alpha, Tooltip, useTheme, Typography, LinearProgress } from '@mui/material';

import { useGetSubscriptionDetailsQuery } from 'src/services/apis/subscriptionApi';
import { useRegenerateManager } from 'src/sections/generate/hooks/useRegenerateManager';

import { Iconify } from 'src/components/iconify';

/**
 * Compact resource overview component for the profile popover
 * Shows a percentage-based overview with hover details
 */
export function ProfileResourceOverview() {
  const { t } = useTranslation();
  const theme = useTheme();

  // Get subscription details from API
  const { data: subscriptionDetails, isLoading } = useGetSubscriptionDetailsQuery(undefined);
  const { regenerationsAvailable, regenerationsTotal } = useRegenerateManager();

  if (isLoading || !subscriptionDetails) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {t('resources.loading', 'Loading...')}
        </Typography>
      </Box>
    );
  }

  // Calculate usage data
  const articlesUsed = subscriptionDetails.articles_created || 0;
  const articlesTotal = subscriptionDetails.articles_limit || 100;
  const articlesPercentage = Math.min((articlesUsed / articlesTotal) * 100, 100);
  const articlesRemaining = articlesTotal - articlesUsed;

  const websitesUsed = subscriptionDetails.connected_websites || 0;
  const websitesTotal = subscriptionDetails.websites_limit || 5;
  const websitesPercentage = Math.min((websitesUsed / websitesTotal) * 100, 100);
  const websitesRemaining = websitesTotal - websitesUsed;

  const regenerationsUsed = regenerationsTotal - regenerationsAvailable;
  const regenerationsPercentage = Math.min((regenerationsUsed / regenerationsTotal) * 100, 100);

  // Calculate overall usage percentage (average of all resources)
  const overallPercentage = (articlesPercentage + websitesPercentage + regenerationsPercentage) / 3;

  // Determine color based on overall usage
  const getColor = (percentage: number) => {
    if (percentage > 80) return theme.palette.error.main;
    if (percentage > 60) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const overallColor = getColor(overallPercentage);

  // Tooltip content with detailed breakdown
  const tooltipContent = (
    <Box sx={{ p: 1.5, maxWidth: 280 }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
        {t('resources.detailedUsage', 'Resource Usage Details')}
      </Typography>
      
      {/* Articles */}
      <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {t('resources.articles', 'Articles')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {articlesUsed}/{articlesTotal}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={articlesPercentage}
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: alpha(getColor(articlesPercentage), 0.1),
            '& .MuiLinearProgress-bar': {
              bgcolor: getColor(articlesPercentage),
              borderRadius: 2,
            },
          }}
        />
        <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
          {articlesRemaining} {t('resources.remaining', 'remaining')}
        </Typography>
      </Box>

      {/* Websites */}
      <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {t('resources.websites', 'Websites')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {websitesUsed}/{websitesTotal}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={websitesPercentage}
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: alpha(getColor(websitesPercentage), 0.1),
            '& .MuiLinearProgress-bar': {
              bgcolor: getColor(websitesPercentage),
              borderRadius: 2,
            },
          }}
        />
        <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
          {websitesRemaining} {t('resources.remaining', 'remaining')}
        </Typography>
      </Box>

      {/* Regenerations */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {t('regenerate.label', 'Regenerations')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {regenerationsUsed}/{regenerationsTotal}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={regenerationsPercentage}
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: alpha(getColor(regenerationsPercentage), 0.1),
            '& .MuiLinearProgress-bar': {
              bgcolor: getColor(regenerationsPercentage),
              borderRadius: 2,
            },
          }}
        />
        <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
          {regenerationsAvailable} {t('resources.remaining', 'remaining')}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Tooltip title={tooltipContent} placement="top" arrow>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.5,
          borderRadius: 2,
          bgcolor: alpha(overallColor, 0.08),
          border: `1px solid ${alpha(overallColor, 0.2)}`,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            bgcolor: alpha(overallColor, 0.12),
            transform: 'translateY(-1px)',
          },
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: alpha(overallColor, 0.15),
          }}
        >
          <Iconify icon="mdi:chart-donut" width={20} height={20} sx={{ color: overallColor }} />
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              lineHeight: 1.2,
              color: theme.palette.text.primary,
              fontWeight: 600,
            }}
          >
            {Math.round(100 - overallPercentage)}% {t('resources.available', 'Available')}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              lineHeight: 1,
              color: theme.palette.text.secondary,
              display: 'block',
            }}
          >
            {t('resources.overallUsage', 'Overall Usage')}
          </Typography>
        </Box>

        {/* Percentage Circle */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: `3px solid ${alpha(overallColor, 0.2)}`,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: `3px solid transparent`,
              borderTopColor: overallColor,
              transform: `rotate(${(overallPercentage / 100) * 360}deg)`,
              transition: 'transform 0.3s ease-in-out',
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontSize: '10px',
              fontWeight: 'bold',
              color: overallColor,
            }}
          >
            {Math.round(overallPercentage)}%
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
}
