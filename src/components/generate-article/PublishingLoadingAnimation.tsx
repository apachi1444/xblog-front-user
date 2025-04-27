import React from 'react';

import { keyframes } from '@mui/system';
import { Box, Typography, CircularProgress } from '@mui/material';

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.7;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

interface LoadingAnimationProps {
  message?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  message = "Generating your content outline..." 
}) => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      zIndex: 9999,
      animation: `${fadeIn} 0.3s ease-in-out`,
    }}
  >
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        borderRadius: 2,
        maxWidth: 400,
        textAlign: 'center',
      }}
    >
      <CircularProgress 
        size={60} 
        thickness={4} 
        color="primary" 
        sx={{ mb: 3 }}
      />
      
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          animation: `${pulse} 2s infinite ease-in-out`,
          fontWeight: 600,
        }}
      >
        {message}
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary"
      >
        Please wait while we prepare your content for publishing...
      </Typography>
    </Box>
  </Box>
);