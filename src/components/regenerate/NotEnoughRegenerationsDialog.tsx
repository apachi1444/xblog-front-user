import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// Icons
import AutorenewIcon from '@mui/icons-material/Autorenew';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
// MUI components
import {
  Box,
  Button,
  Dialog,
  useTheme,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

interface NotEnoughRegenerationsDialogProps {
  open: boolean;
  onClose: () => void;
  regenerationsAvailable: number;
}

export function NotEnoughRegenerationsDialog({
  open,
  onClose,
  regenerationsAvailable,
}: NotEnoughRegenerationsDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Handle upgrade click
  const handleUpgradeClick = () => {
    navigate('/upgrade-license');
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningAmberIcon color="warning" />
          {t('regenerate.notEnough', 'No Regenerations Available')}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: theme.palette.warning.lighter,
              color: theme.palette.warning.main,
              mb: 2,
            }}
          >
            <AutorenewIcon sx={{ fontSize: 40 }} />
          </Box>
          
          <Typography variant="h6" gutterBottom>
            {t('regenerate.notEnough', 'No Regenerations Available')}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            {t('regenerate.upgradeMessage', 'Upgrade your plan to get more regenerations.')}
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              my: 3,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: theme.palette.background.neutral,
                textAlign: 'center',
                minWidth: 100,
              }}
            >
              <Typography variant="h5" color="error.main">
                {regenerationsAvailable}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('regenerate.remaining', { count: regenerationsAvailable })}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpgradeClick}
          startIcon={<AutorenewIcon />}
        >
          {t('points.upgradePlan', 'Upgrade Plan')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
