import type { RootState } from 'src/services/store';

import { useSelector } from 'react-redux';

import { Box, alpha, Typography, LinearProgress } from '@mui/material';

import { selectAllArticles } from 'src/services/slices/articles/selectors';

interface ResourceUsageProps {
  compact?: boolean;
}

export function ResourceUsage({ compact = false }: ResourceUsageProps) {
  // Get store data from Auth Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const articles = useSelector(selectAllArticles);

  const stores = useSelector((state: RootState) => state.stores.stores);
  
  // Articles usage data
  const articlesUsed = articles.length || 90;
  const articlesTotal = user?.articles?.total || 100;
  const articlesPercentage = Math.min((articlesUsed / articlesTotal) * 100, 100);
  const articlesRemaining = articlesTotal - articlesUsed;
  
  // Stores usage data - now using the actual stores count from the API
  const storesUsed = stores?.length || 3;
  const storesTotal = user?.stores?.total || 5;
  const storesPercentage = Math.min((storesUsed / storesTotal) * 100, 100);
  const storesRemaining = storesTotal - storesUsed;
  
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
        mb : compact? 1.5 : 2.5,
      }}
    >
      
      {/* Stores Usage */}
      <Box mb={compact ? 1.5 : 2.5}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.75}>
          <Typography 
            variant={compact ? "caption" : "body2"} 
            sx={{ 
              color: (theme) => theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            Websites
          </Typography>
          <Typography 
            variant={compact ? "caption" : "body2"} 
            sx={{ 
              color: (theme) => getProgressColor(theme, storesPercentage),
              fontWeight: 600,
            }}
          >
            {storesUsed}/{storesTotal}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={storesPercentage} 
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
              storesPercentage > 90 
                ? theme.palette.error.main 
                : storesPercentage > 70
                  ? theme.palette.warning.main
                  : theme.palette.text.secondary,
            fontWeight: 500,
            fontSize: compact ? '0.7rem' : '0.75rem'
          }}
        >
          {storesRemaining} websites remaining
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
            Articles
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
          {articlesRemaining} articles remaining
        </Typography>
      </Box>
    </Box>
  );
}