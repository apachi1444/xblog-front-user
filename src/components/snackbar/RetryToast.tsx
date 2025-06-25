import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  alpha,
  Button,
  useTheme,
  Typography,
  IconButton,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface RetryToastProps {
  message: string;
  onRetry: () => void;
  onClose: () => void;
  isRetrying?: boolean;
}

export function RetryToast({ message, onRetry, onClose, isRetrying = false }: RetryToastProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        p: 1,
        minWidth: 300,
        maxWidth: 500,
        bgcolor: 'error.main',
        color: 'error.contrastText',
        borderRadius: 1,
        boxShadow: theme.shadows[8],
      }}
    >
      {/* Error Icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
        <Iconify 
          icon="mdi:alert-circle" 
          width={20} 
          height={20} 
          sx={{ color: 'error.contrastText', flexShrink: 0 }} 
        />
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'error.contrastText',
            lineHeight: 1.4,
            flex: 1,
          }}
        >
          {message}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        {/* Retry Button */}
        <Button
          size="small"
          variant="contained"
          onClick={onRetry}
          disabled={isRetrying}
          startIcon={
            isRetrying ? (
              <Iconify 
                icon="mdi:loading" 
                width={16} 
                height={16}
                sx={{ 
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
            ) : (
              <Iconify icon="mdi:refresh" width={16} height={16} />
            )
          }
          sx={{
            bgcolor: alpha(theme.palette.common.white, 0.15),
            color: 'error.contrastText',
            fontWeight: 600,
            fontSize: '0.75rem',
            px: 1.5,
            py: 0.5,
            minHeight: 32,
            '&:hover': {
              bgcolor: alpha(theme.palette.common.white, 0.25),
            },
            '&:disabled': {
              bgcolor: alpha(theme.palette.common.white, 0.1),
              color: alpha(theme.palette.error.contrastText, 0.6),
            },
          }}
        >
          {isRetrying ? t('common.retrying', 'Retrying...') : t('common.retry', 'Retry')}
        </Button>

        {/* Close Button */}
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: 'error.contrastText',
            p: 0.5,
            '&:hover': {
              bgcolor: alpha(theme.palette.common.white, 0.1),
            },
          }}
        >
          <Iconify icon="mdi:close" width={16} height={16} />
        </IconButton>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

// Helper function to show retry toast
export const showRetryToast = (
  message: string,
  onRetry: () => void,
  options?: {
    duration?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  }
) => 
  // This will be implemented with the toast system
  // For now, return the component props
   ({
    message,
    onRetry,
    ...options,
  })
;
