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
}

export function ConfirmDialog({ title, action, open, onClose,count }: ConfirmDialogProps) {
  const theme = useTheme();

  const { t } = useTranslation();

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
              background: theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
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
      gap: 1.5,
      p: 2.5,
      backgroundColor: 'error.light',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'error.main',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: 'error.main',
        borderRadius: '4px 0 0 4px'
      }
    }}>
      <WarningAmberIcon 
        sx={{ 
          color: 'error.main', 
          fontSize: 24,
          mt: 0.1,
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
        }} 
      />
      <Box sx={{ flex: 1 }}>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'error.dark',
            fontWeight: 500,
            lineHeight: 1.5,
            mb: 0.5
          }}
        >
          {t('regenerate.confirmMessage', 'Regenerating the table of contents will override your current sections and consume one regeneration credit from your balance.')}
        </Typography>
      </Box>
    </Box>

    {/* Credits Info Section */}
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1.5,
      p: 2,
      backgroundColor: 'warning.light',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'warning.main',
      background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.08) 0%, rgba(255, 193, 7, 0.04) 100%)'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: 'warning.main',
        color: 'white',
        boxShadow: '0 2px 8px rgba(255, 193, 7, 0.3)'
      }}>
        <AccountBalanceWalletIcon sx={{ fontSize: 20 }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'warning.dark',
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
              sx={{ 
                height: 20, 
                fontSize: '0.7rem',
                fontWeight: 600,
                ml: 1
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
                gap: 1,
                p: 3,
                pt: 1,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Button variant="outlined" color="inherit" onClick={onClose}>
                Cancel
              </Button>
              {action}
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Modal>
  );
}