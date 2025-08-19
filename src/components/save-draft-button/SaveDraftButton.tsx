import { useTranslation } from 'react-i18next';

import { 
  Box, 
  Fade, 
  alpha, 
  Button, 
  useTheme,
  Typography,
  CircularProgress 
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface SaveDraftButtonProps {
  hasChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  variant?: 'floating' | 'inline';
  size?: 'small' | 'medium' | 'large';
}

export function SaveDraftButton({
  hasChanges,
  isSaving,
  onSave,
  variant = 'floating',
  size = 'medium',
}: SaveDraftButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  if (!hasChanges && !isSaving) {
    return null;
  }

  const buttonContent = (
    <Button
      variant="contained"
      color="primary"
      onClick={onSave}
      disabled={isSaving}
      size={size}
      startIcon={
        isSaving ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <Iconify icon="mdi:content-save" width={16} height={16} />
        )
      }
      sx={{
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: variant === 'floating' ? 3 : 2,
        px: variant === 'floating' ? 3 : 2,
        py: variant === 'floating' ? 1.5 : 1,
        boxShadow: variant === 'floating' 
          ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
          : theme.shadows[2],
        '&:hover': {
          boxShadow: variant === 'floating'
            ? `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`
            : theme.shadows[4],
          transform: variant === 'floating' ? 'translateY(-1px)' : 'none',
        },
        '&:disabled': {
          boxShadow: variant === 'floating' 
            ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`
            : theme.shadows[1],
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {isSaving ? (
        <Typography variant="button" sx={{ ml: 0.5 }}>
          {t('common.saving', 'Saving...')}
        </Typography>
      ) : (
        <Typography variant="button">
          {t('common.saveDraft', 'Save Draft')}
        </Typography>
      )}
    </Button>
  );

  return (
    <Fade in={hasChanges || isSaving} timeout={300}>
      <Box>{buttonContent}</Box>
    </Fade>
  );
}
