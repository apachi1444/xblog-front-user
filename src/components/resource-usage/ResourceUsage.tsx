import type { RootState } from 'src/services/store';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Box, alpha, Typography, LinearProgress } from '@mui/material';

interface ResourceUsageProps {
  compact?: boolean;
}

export function ResourceUsage({ compact = false }: ResourceUsageProps) {
  const { t } = useTranslation();
  
  // Get subscription details from Redux store
  const subscriptionDetails = useSelector((state: RootState) => state.auth.subscriptionDetails);
  
  // Articles usage data from subscription details
  const articlesUsed = subscriptionDetails?.articles_created || 0;
  const articlesTotal = subscriptionDetails?.articles_limit || 100;
  const articlesPercentage = Math.min((articlesUsed / articlesTotal) * 100, 100);
  const articlesRemaining = articlesTotal - articlesUsed;
  
  // Websites usage data from subscription details
  const websitesUsed = subscriptionDetails?.connected_websites || 0;
  const websitesTotal = subscriptionDetails?.websites_limit || 5;
  const websitesPercentage = Math.min((websitesUsed / websitesTotal) * 100, 100);
  const websitesRemaining = websitesTotal - websitesUsed;
  
  // Dynamic color calculation function based on percentage
  const getProgressColor = (theme: any, percentage: number) => {
    if (percentage <= 30) {
      return theme.palette.secondary.main; // Green for low usage
    } if (percentage <= 60) {
      return theme.palette.info.main; // Blue for moderate usage
    } if (percentage <= 85) {
      return theme.palette.warning.main; // Orange/Yellow for high usage
    } 
      return theme.palette.primary.main; // Red for critical usage
  };
  
  return (
    <Box
      sx={{
        width: '100%',
        p: compact ? 1.5 : 2,
        borderRadius: 2,
        bgcolor: 'var(--layout-nav-bg)',
        border: (theme) => `2px solid ${alpha(theme.palette.primary.main, 0.9)}`,
        color: (theme) => theme.palette.text.primary,
        mb: compact ? 1.5 : 2.5,
      }}
    >
      
      {/* Websites Usage */}
      <Box mb={compact ? 1.5 : 2.5}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.75}>
          <Typography 
            variant={compact ? "caption" : "body2"} 
            sx={{ 
              color: (theme) => theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            {t('resources.websites', 'Websites')}
          </Typography>
          <Typography 
            variant={compact ? "caption" : "body2"} 
            sx={{ 
              color: (theme) => getProgressColor(theme, websitesPercentage),
              fontWeight: 600,
            }}
          >
            {websitesUsed}/{websitesTotal}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={websitesPercentage} 
          sx={{ 
            height: compact ? 5 : 7, 
            borderRadius: 10,
            bgcolor: (theme) => theme.palette.secondary.main,
            '& .MuiLinearProgress-bar': {
              bgcolor: (theme) => theme.palette.primary.main,
              borderRadius: 10,
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }
          }} 
        />
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            mt: 0.75,
            color: (theme) => 
              websitesPercentage > 90 
                ? theme.palette.error.main 
                : websitesPercentage > 70
                  ? theme.palette.warning.main
                  : theme.palette.text.secondary,
            fontWeight: 500,
            fontSize: compact ? '0.7rem' : '0.75rem'
          }}
        >
          {t('resources.websitesRemaining', '{{count}} websites remaining', { count: websitesRemaining })}
        </Typography>
      </Box>
      
      {/* Articles Usage */}
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.75}>
          <Typography 
            variant={compact ? "caption" : "body2"} 
            sx={{ 
              color: (theme) => theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            {t('resources.articles', 'Articles')}
          </Typography>
          <Typography 
            variant={compact ? "caption" : "body2"} 
            sx={{ 
              color: (theme) => getProgressColor(theme, articlesPercentage),
              fontWeight: 600,
            }}
          >
            {articlesUsed}/{articlesTotal}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={articlesPercentage} 
          sx={{ 
            height: compact ? 5 : 7, 
            borderRadius: 10,
            bgcolor: (theme) => theme.palette.secondary.main,
            '& .MuiLinearProgress-bar': {
              bgcolor: (theme) => theme.palette.primary.main,
              borderRadius: 10,
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }
          }} 
        />
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            mt: 0.75,
            color: (theme) => 
              articlesPercentage > 90 
                ? theme.palette.error.main 
                : articlesPercentage > 70
                  ? theme.palette.warning.main
                  : theme.palette.text.secondary,
            fontWeight: 500,
            fontSize: compact ? '0.7rem' : '0.75rem'
          }}
        >
          {t('resources.articlesRemaining', '{{count}} articles remaining', { count: articlesRemaining })}
        </Typography>
      </Box>
    </Box>
  );
}
