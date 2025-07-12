import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Chip from '@mui/material/Chip';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// ----------------------------------------------------------------------

interface ConfirmDialogProps {
  title: React.ReactNode;
  action: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
  count: number;
  requiredCredits?: number;
}

export function ConfirmDialog({ title, action, open, onClose, count, requiredCredits = 5 }: ConfirmDialogProps) {
  const theme = useTheme();

  const { t } = useTranslation();

  const hasInsufficientCredits = requiredCredits > count;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backgroundColor: alpha(theme.palette.common.black, 0.7),
            backdropFilter: 'blur(8px)',
          },
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 480 },
            maxHeight: '90vh',
            outline: 'none',
          }}
        >
          <Paper
            elevation={24}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.customShadows.dialog,
            }}
          >
            {/* Header */}
            <Box sx={{ p: 3, pb: 2 }}>
              <Typography variant="h6" component="h2">
                {title}
              </Typography>
            </Box>

            {/* Content */}

<Box sx={{ px: 3, pb: 2 }}>
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 2.5,
    position: 'relative'
  }}>
    
    {/* Warning Section */}
    <Box sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 2,
      p: 3,
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha(hasInsufficientCredits ? theme.palette.error.main : theme.palette.warning.main, 0.1)
        : alpha(hasInsufficientCredits ? theme.palette.error.main : theme.palette.warning.main, 0.08),
      borderRadius: 2,
      border: `1px solid ${alpha(hasInsufficientCredits ? theme.palette.error.main : theme.palette.warning.main, 0.3)}`,
      position: 'relative'
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: alpha(hasInsufficientCredits ? theme.palette.error.main : theme.palette.warning.main, 0.15),
        color: hasInsufficientCredits ? 'error.main' : 'warning.main',
        flexShrink: 0
      }}>
        <WarningAmberIcon
          sx={{
            fontSize: 20
          }}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body1"
          sx={{
            color: 'text.primary',
            fontWeight: 500,
            lineHeight: 1.6,
            mb: 0.5,
            '& strong': {
              color: hasInsufficientCredits ? 'error.main' : 'warning.main',
              fontWeight: 700
            }
          }}
          dangerouslySetInnerHTML={{
            __html: hasInsufficientCredits
              ? t('regenerate.insufficientCredits', 'You need <strong>{{required}} regenerations</strong> but only have <strong>{{available}}</strong> available.', { required: requiredCredits, available: count })
              : t('regenerate.confirmMessage', 'This will override your current sections and consume <strong>5 regenerations</strong>.')
          }}
        />
      </Box>
    </Box>

    {/* Credits Info Section */}
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1.5,
      p: 2,
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.info.main, 0.1)
        : alpha(theme.palette.info.main, 0.05),
      borderRadius: 2,
      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: alpha(theme.palette.info.main, 0.15),
        color: 'info.main'
      }}>
        <AccountBalanceWalletIcon sx={{ fontSize: 20 }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          <span>
            {t('regenerate.availableCredits', 'You have {{count}} regeneration credits available.', { count })}
          </span>
          {count <= 3 && (
            <Chip
              label="Low"
              size="small"
              color="warning"
              variant="outlined"
              sx={{
                height: 22,
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            />
          )}
        </Typography>
      </Box>
    </Box>

    {/* Additional Info */}
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      pt: 1
    }}>
      <InfoOutlinedIcon sx={{ 
        color: 'text.secondary', 
        fontSize: 18 
      }} />
      <Typography 
        variant="caption" 
        sx={{ 
          color: 'text.secondary',
          fontStyle: 'italic'
        }}
      >
        This action cannot be undone. Make sure to save any important changes.
      </Typography>
    </Box>

  </Box>
</Box>

            {/* Actions */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                p: 3,
                pt: 2,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}
            >
              <Button
                variant="outlined"
                color="inherit"
                onClick={onClose}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 500
                }}
              >
                Cancel
              </Button>
              {hasInsufficientCredits ? (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => window.open('/upgrade-license', '_blank')}
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }}
                  >
                    {t('regenerate.upgradeButton', 'Upgrade Plan')}
                  </Button>
                  <Button
                    variant="contained"
                    disabled
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      fontWeight: 500
                    }}
                  >
                    {t('regenerate.insufficientCreditsButton', 'Insufficient Credits')}
                  </Button>
                </>
              ) : (
                action
              )}
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Modal>
  );
}