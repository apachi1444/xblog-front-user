import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullHeight?: boolean;
}

export default function LoadingSpinner({ 
  size = 40, 
  message = 'Loading data...', 
  fullHeight = false 
}: LoadingSpinnerProps) {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: fullHeight ? '100%' : 'auto',
        minHeight: fullHeight ? 'calc(100vh - 200px)' : '200px',
        p: 3,
      }}
    >
      <CircularProgress 
        size={size} 
        thickness={4}
        sx={{ 
          color: theme.palette.primary.main,
          mb: 2
        }} 
      />
      {message && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mt: 2,
            fontWeight: 500,
            textAlign: 'center'
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}