import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  CircularProgress,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Iconify } from 'src/components/iconify';

interface SessionExpiredModalProps {
  open: boolean;
  countdown: number;
}

export function SessionExpiredModal({ open, countdown }: SessionExpiredModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          minWidth: 400,
          maxWidth: 500,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <Iconify
            icon="mdi:clock-alert-outline"
            sx={{
              width: 48,
              height: 48,
              color: theme.palette.warning.main,
              mr: 1,
            }}
          />
        </Box>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {t('auth.sessionExpired.title', 'Session Expired')}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', pt: 0, pb: 4 }}>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, lineHeight: 1.6 }}
        >
          {t(
            'auth.sessionExpired.message',
            'Your session has expired for security reasons. You will be redirected to the sign-in page.'
          )}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            p: 2,
            bgcolor: theme.palette.grey[50],
            borderRadius: 1,
            border: `1px solid ${theme.palette.grey[200]}`,
          }}
        >
          <CircularProgress
            size={24}
            thickness={4}
            sx={{ color: theme.palette.primary.main }}
          />
          <Typography variant="body2" color="text.secondary">
            {t(
              'auth.sessionExpired.redirecting',
              'Redirecting in {{seconds}} seconds...',
              { seconds: countdown }
            )}
          </Typography>
        </Box>

        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ mt: 2, display: 'block' }}
        >
          {t(
            'auth.sessionExpired.autoRedirect',
            'This page will automatically redirect you to maintain security.'
          )}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
