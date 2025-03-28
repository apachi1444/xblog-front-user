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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: `${pulse} 2s infinite ease-in-out`,
          p: 4,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: 3,
          maxWidth: 400,
        }}
      >
        <CircularProgress 
          size={80} 
          thickness={4} 
          sx={{ 
            color: '#5969cf',
            mb: 3
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 1,
            fontWeight: 600,
            color: '#5969cf',
            textAlign: 'center'
          }}
        >
          {message}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            textAlign: 'center'
          }}
        >
          We re analyzing your inputs and creating the perfect structure for your content.
        </Typography>
      </Box>
    </Box>
  );