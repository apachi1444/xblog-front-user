import { useTranslation } from 'react-i18next';

import {
  Box,
  Stack,
  alpha,
  Button,
  Dialog,
  useTheme,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface SubscriptionLimitModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  limitType: 'articles' | 'regenerations' | 'websites';
  currentCount?: number;
  maxCount?: number;
}

export function SubscriptionLimitModal({
  open,
  onClose,
  onUpgrade,
  limitType,
  currentCount,
  maxCount,
}: SubscriptionLimitModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const getLimitInfo = () => {
    switch (limitType) {
      case 'articles':
        return {
          icon: 'eva:file-text-fill',
          title: t('subscription.limit.articles.title', 'Article Limit Reached'),
          message: t(
            'subscription.limit.articles.message',
            "You've reached your article limit. Upgrade your plan to create more articles and unlock advanced features."
          ),
          color: theme.palette.primary.main,
        };
      case 'regenerations':
        return {
          icon: 'eva:refresh-fill',
          title: t('subscription.limit.regenerations.title', 'Regeneration Limit Reached'),
          message: t(
            'subscription.limit.regenerations.message',
            "You've used all your regenerations. Upgrade to get more regenerations and continue improving your content."
          ),
          color: theme.palette.warning.main,
        };
      case 'websites':
        return {
          icon: 'eva:globe-fill',
          title: t('subscription.limit.websites.title', 'Website Limit Reached'),
          message: t(
            'subscription.limit.websites.message',
            "You've reached your website limit. Upgrade to manage more websites and expand your content creation."
          ),
          color: theme.palette.info.main,
        };
      default:
        return {
          icon: 'eva:alert-circle-fill',
          title: t('subscription.limit.generic.title', 'Limit Reached'),
          message: t(
            'subscription.limit.generic.message',
            "You've reached your plan limit. Upgrade to continue using all features."
          ),
          color: theme.palette.error.main,
        };
    }
  };

  const limitInfo = getLimitInfo();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: alpha(limitInfo.color, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify
              icon={limitInfo.icon}
              width={32}
              height={32}
              sx={{ color: limitInfo.color }}
            />
          </Box>

          {/* Title */}
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {limitInfo.title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', px: 3, py: 2 }}>
        <Stack spacing={2}>
          {/* Main Message */}
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {limitInfo.message}
          </Typography>

          {/* Count Information (if provided) */}
          {currentCount !== undefined && maxCount !== undefined && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(limitInfo.color, 0.05),
                border: `1px solid ${alpha(limitInfo.color, 0.2)}`,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {t('subscription.limit.usage', 'Current usage:')}
              </Typography>
              <Typography variant="h6" sx={{ color: limitInfo.color, fontWeight: 600 }}>
                {currentCount} / {maxCount}
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ flex: 1 }}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={onUpgrade}
            variant="contained"
            sx={{
              flex: 1,
              bgcolor: limitInfo.color,
              '&:hover': {
                bgcolor: alpha(limitInfo.color, 0.8),
              },
            }}
            startIcon={<Iconify icon="eva:arrow-up-fill" />}
          >
            {t('subscription.limit.upgrade', 'Upgrade Plan')}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
