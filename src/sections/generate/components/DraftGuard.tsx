import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useArticleLimits } from 'src/hooks/useArticleLimits';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface DraftGuardProps {
  children: React.ReactNode;
  onLimitExceeded?: () => void;
}

export function DraftGuard({ children, onLimitExceeded }: DraftGuardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  
  const { 
    canCreateMore, 
    articlesRemaining, 
    articlesLimit, 
    articlesCreated,
    isLoading 
  } = useArticleLimits();

  // Show loading state while checking limits
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
        }}
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          {t('draft.guard.checkingLimits', 'Checking article limits...')}
        </Typography>
      </Box>
    );
  }

  // Check if user can create more articles
  if (!canCreateMore) {
    return (
      <>
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 3,
          }}
        >
          <Iconify 
            icon="mdi:file-document-alert" 
            width={64} 
            height={64} 
            sx={{ color: 'warning.main', mb: 3 }}
          />
          
          <Typography variant="h5" gutterBottom>
            {t('draft.guard.limitReached.title', 'Article Limit Reached')}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
            {t(
              'draft.guard.limitReached.description',
              'You have reached your article creation limit ({{created}}/{{limit}}). Upgrade your plan to create more articles.',
              { created: articlesCreated, limit: articlesLimit }
            )}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/blog')}
              startIcon={<Iconify icon="mdi:arrow-left" />}
            >
              {t('draft.guard.backToBlog', 'Back to Blog')}
            </Button>
            
            <Button
              variant="contained"
              onClick={() => navigate('/upgrade-license')}
              startIcon={<Iconify icon="mdi:rocket-launch" />}
            >
              {t('draft.guard.upgradePlan', 'Upgrade Plan')}
            </Button>
          </Box>
        </Box>

        {/* Limit exceeded dialog */}
        <Dialog
          open={showLimitDialog}
          onClose={() => setShowLimitDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon="mdi:alert-circle" color="warning.main" />
              {t('draft.guard.dialog.title', 'Article Limit Reached')}
            </Box>
          </DialogTitle>
          
          <DialogContent>
            <Typography variant="body1">
              {t(
                'draft.guard.dialog.message',
                'You have used all {{limit}} articles in your current plan. To create more articles, please upgrade your subscription.',
                { limit: articlesLimit }
              )}
            </Typography>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => setShowLimitDialog(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/upgrade-license')}
            >
              {t('draft.guard.upgradePlan', 'Upgrade Plan')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Show remaining articles info if close to limit
  const showWarning = articlesRemaining <= 3 && articlesRemaining > 0;

  return (
    <>
      {showWarning && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 1,
            bgcolor: 'warning.lighter',
            border: '1px solid',
            borderColor: 'warning.main',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Iconify icon="mdi:alert" color="warning.main" />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="warning.dark">
              {t('draft.guard.warning.title', 'Low Article Count')}
            </Typography>
            <Typography variant="body2" color="warning.dark">
              {t(
                'draft.guard.warning.message',
                'You have {{remaining}} articles remaining in your plan.',
                { remaining: articlesRemaining }
              )}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            color="warning"
            onClick={() => navigate('/upgrade-license')}
          >
            {t('draft.guard.upgrade', 'Upgrade')}
          </Button>
        </Box>
      )}
      
      {children}
    </>
  );
}
