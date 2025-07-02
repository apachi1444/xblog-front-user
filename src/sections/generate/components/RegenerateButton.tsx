import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Tooltip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Typography, alpha, useTheme } from '@mui/material';

// Hooks

import { Iconify } from 'src/components/iconify';

import { useRegenerateManager } from '../hooks/useRegenerateManager';

interface RegenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  label?: string;
  tooltipText?: string;
  isFirstGeneration?: boolean; // If true, skip regeneration quota check
}

export function RegenerateButton({
  onClick,
  isGenerating,
  label = 'Regenerate',
  tooltipText,
  isFirstGeneration = false,
}: RegenerateButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { regenerationsAvailable, hasRegenerationsAvailable } = useRegenerateManager();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  console.log(regenerationsAvailable , "regenerationsAvailable");


  // Default tooltip text
  const defaultTooltip = isFirstGeneration
    ? 'Generate content with AI (Free)'
    : hasRegenerationsAvailable()
      ? t('regenerate.available', 'Regenerate ({{count}} remaining)', { count: regenerationsAvailable })
      : t('regenerate.notEnough', 'No regenerations available. Click to upgrade your plan.');

  // Use provided tooltip text or default
  const finalTooltipText = tooltipText || defaultTooltip;

  // Handle button click
  const handleClick = () => {
    // If it's first generation, always allow (free)
    if (isFirstGeneration || hasRegenerationsAvailable()) {
      onClick();
    } else {
      setShowUpgradeModal(true);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Tooltip title={finalTooltipText}>
          <span>
            <Button
              onClick={handleClick}
              disabled={isGenerating}
              startIcon={isGenerating ? <CircularProgress size={20} /> : <Iconify icon="eva:refresh-fill" />}
              sx={{
                borderRadius: 6,
              }}
            >
              {isGenerating ? 'Regenerating...' : label}
            </Button>
          </span>
        </Tooltip>
      </Box>

      {/* Upgrade Modal */}
      <Dialog
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Stack spacing={1} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon="eva:alert-triangle-fill" width={24} height={24} color={theme.palette.warning.main} />
            </Box>
            <Typography variant="h6" color="text.primary">
              {t('regenerate.quota_exhausted', 'Regeneration Quota Exhausted')}
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {t('regenerate.upgrade_modal_message', 'You have used all your regenerations for this billing period. Upgrade your plan to get more regenerations and unlock unlimited content optimization.')}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t('regenerate.remaining_count', 'Regenerations remaining: {{count}}', { count: regenerationsAvailable })}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={() => setShowUpgradeModal(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={() => {
              window.open('/upgrade-license', '_blank');
              setShowUpgradeModal(false);
            }}
            variant="contained"
            color="warning"
            sx={{ borderRadius: 2 }}
          >
            {t('regenerate.upgrade_now', 'Upgrade Now')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
