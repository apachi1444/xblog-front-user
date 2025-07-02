import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { 
  Box, 
  Paper, 
  Slide, 
  alpha, 
  Button, 
  useTheme, 
  Typography,
  CircularProgress 
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface SaveDraftToastProps {
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSaveDraft: (formData: any) => void;
  onDiscard?: () => void;
}

export const SaveDraftToast = ({
  hasUnsavedChanges,
  isSaving,
  onSaveDraft,
  onDiscard
}: SaveDraftToastProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const methods = useFormContext();

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      const formData = methods.getValues();
      onSaveDraft(formData);
    }
  };

  const handleDiscard = () => {
    if (onDiscard) {
      onDiscard();
    }
  };

  return (
    <Slide direction="up" in={hasUnsavedChanges} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1300,
          borderRadius: 3,
          overflow: 'hidden',
          minWidth: 400,
          maxWidth: 500,
          border: `2px solid ${theme.palette.warning.main}`,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.warning.lighter, 0.1)} 100%)`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
        }}
      >
        {/* Warning stripe */}
        <Box
          sx={{
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
          }}
        />
        
        <Box sx={{ p: 3 }}>
          {/* Header with icon and message */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.warning.main,
              }}
            >
              <Iconify icon="mdi:content-save-alert" width={20} height={20} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 0.5
                }}
              >
                {t('generate.unsavedChanges', 'You have unsaved changes')}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontSize: '0.875rem'
                }}
              >
                {t('generate.saveChangesPrompt', 'Save your progress to avoid losing your work')}
              </Typography>
            </Box>
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
            {onDiscard && (
              <Button
                variant="text"
                onClick={handleDiscard}
                disabled={isSaving}
                sx={{
                  color: theme.palette.text.secondary,
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.08),
                    color: theme.palette.error.main,
                  },
                }}
              >
                {t('generate.discardChanges', 'Discard')}
              </Button>
            )}
            
            <Button
              variant="contained"
              onClick={handleSaveDraft}
              disabled={isSaving}
              startIcon={
                isSaving ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <Iconify icon="mdi:content-save" width={16} height={16} />
                )
              }
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                backgroundColor: theme.palette.success.main,
                color: 'white',
                boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
                '&:hover': {
                  backgroundColor: theme.palette.success.dark,
                  boxShadow: `0 6px 16px ${alpha(theme.palette.success.main, 0.4)}`,
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {isSaving 
                ? t('generate.saving', 'Saving...') 
                : t('generate.saveDraft', 'Save Draft')
              }
            </Button>
          </Box>
        </Box>
      </Paper>
    </Slide>
  );
};
