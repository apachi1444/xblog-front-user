import { useTranslation } from 'react-i18next';

import { Box, Button, Tooltip, CircularProgress } from '@mui/material';

// Hooks

import { Iconify } from 'src/components/iconify';

import { useRegenerateManager } from '../hooks/useRegenerateManager';

interface RegenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  label?: string;
  tooltipText?: string;
}

export function RegenerateButton({
  onClick,
  isGenerating,
  label = 'Regenerate',
  tooltipText,
}: RegenerateButtonProps) {
  const { t } = useTranslation();
  const { regenerationsAvailable, hasRegenerationsAvailable } = useRegenerateManager();

  console.log(regenerationsAvailable , "regenerationsAvailable");
  

  // Default tooltip text
  const defaultTooltip = hasRegenerationsAvailable()
    ? t('regenerate.available', 'Regenerate ({{count}} remaining)', { count: regenerationsAvailable })
    : t('regenerate.notEnough', 'No regenerations available. Please upgrade your plan for more.');

  // Use provided tooltip text or default
  const finalTooltipText = tooltipText || defaultTooltip;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Tooltip title={finalTooltipText}>
        <span>
          <Button
            onClick={onClick}
            disabled={isGenerating || !hasRegenerationsAvailable()}
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
  );
}
