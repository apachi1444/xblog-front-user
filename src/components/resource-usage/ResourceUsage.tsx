import type { RootState } from 'src/services/store';

import { useSelector } from 'react-redux';

import { Box, Divider, Typography, LinearProgress } from '@mui/material';

interface ResourceUsageProps {
  compact?: boolean;
}

export function ResourceUsage({ compact = false }: ResourceUsageProps) {
  // Get store data from Auth Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const stores = useSelector((state: RootState) => state.stores.stores);
  
  // Articles usage data
  const articlesUsed = user?.articles?.used || 0;
  const articlesTotal = user?.articles?.total || 100;
  const articlesPercentage = Math.min((articlesUsed / articlesTotal) * 100, 100);
  const articlesRemaining = articlesTotal - articlesUsed;
  
  // Stores usage data - now using the actual stores count from the API
  const storesUsed = stores?.length || 0;
  const storesTotal = user?.stores?.total || 5;
  const storesPercentage = Math.min((storesUsed / storesTotal) * 100, 100);
  const storesRemaining = storesTotal - storesUsed;
  
  return (
    <Box
      sx={{
        width: '100%',
        p: compact ? 1.5 : 2,
        borderRadius: 1,
        bgcolor: (theme) => theme.palette.primary.main,
        border: (theme) => `1px solid ${theme.palette.primary.dark}`,
        color: (theme) => theme.palette.primary.contrastText,
      }}
    >
      
      {/* Stores Usage */}
      <Box mb={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography variant="body2" sx={{ color: 'inherit' }}>Stores</Typography>
          <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 'bold' }}>
            {storesUsed}/{storesTotal}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={storesPercentage} 
          sx={{ 
            height: compact ? 4 : 6, 
            borderRadius: 1,
            bgcolor: (theme) => theme.palette.primary.dark,
            '& .MuiLinearProgress-bar': {
              bgcolor: (theme) => 
                storesPercentage > 90 
                  ? theme.palette.error.light 
                  : theme.palette.secondary.light
            }
          }} 
        />
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            mt: 0.5,
            color: (theme) => 
              storesPercentage > 90 
                ? theme.palette.error.light 
                : theme.palette.primary.contrastText,
            fontWeight: 'medium'
          }}
        >
          {storesRemaining} stores remaining
        </Typography>
      </Box>
      
      {/* Articles Usage */}
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography variant="body2" sx={{ color: 'inherit' }}>Articles</Typography>
          <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 'bold' }}>
            {articlesUsed}/{articlesTotal}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={articlesPercentage} 
          sx={{ 
            height: compact ? 4 : 6, 
            borderRadius: 1,
            bgcolor: (theme) => theme.palette.primary.dark,
            '& .MuiLinearProgress-bar': {
              bgcolor: (theme) => 
                articlesPercentage > 90 
                  ? theme.palette.error.light 
                  : theme.palette.secondary.light
            }
          }} 
        />
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            mt: 0.5,
            color: (theme) => 
              articlesPercentage > 90 
                ? theme.palette.error.light 
                : theme.palette.primary.contrastText,
            fontWeight: 'medium'
          }}
        >
          {articlesRemaining} articles remaining
        </Typography>
      </Box>
    </Box>
  );
}