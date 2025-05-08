import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { useScheduledArticles } from 'src/hooks/useScheduledArticles';
import { useSubscriptionExpiration } from 'src/hooks/useSubscriptionExpiration';
import { useBannerDisplay } from 'src/hooks/useBannerDisplay';
import { BannerType } from 'src/services/slices/banners/bannerSlice';

interface BannerProps {
  onClose?: () => void;
}

/**
 * Subscription expiration banner component
 */
export function SubscriptionExpirationBanner({ onClose }: BannerProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  // Get subscription expiration information
  const { isExpiringSoon, daysRemaining } = useSubscriptionExpiration(3);

  // Don't show if not expiring soon
  if (!isExpiringSoon || !daysRemaining || daysRemaining < 0) return null;

  // Handle banner close - this will call the dismissBanner action
  const handleClose = () => {
    if (onClose) onClose();
  };

  // Navigate to profile/subscription page
  const handleNavigateToSubscription = () => {
    navigate('/profile?tab=subscription');
  };

  return (
    <Alert
      severity="error"
      icon={<Iconify icon="mdi:alert-circle" width={24} height={24} />}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={handleClose}
        >
          <Iconify icon="mdi:close" width={20} height={20} />
        </IconButton>
      }
      sx={{
        borderRadius: 2,
        boxShadow: theme.shadows[3],
        backgroundColor: alpha(theme.palette.error.main, 0.1),
        '& .MuiAlert-icon': {
          color: theme.palette.error.main,
        },
        '& .MuiAlert-message': {
          width: '100%',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {t('subscription.expirationWarning', 'Your Subscription is Expiring Soon')}
          </Typography>
          <Typography variant="body2">
            {t('subscription.daysRemaining', 'Your subscription will expire in {{days}} days. Renew now to avoid service interruption.', {
              days: daysRemaining
            })}
          </Typography>
        </Box>

        <Box>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleNavigateToSubscription}
            startIcon={<Iconify icon="mdi:credit-card-outline" width={18} height={18} />}
            sx={{
              borderRadius: 6,
              textTransform: 'none',
              boxShadow: theme.shadows[2],
              mr: 1
            }}
          >
            {t('subscription.renewNow', 'Renew Now')}
          </Button>
        </Box>
      </Box>
    </Alert>
  );
}

/**
 * Scheduled article banner component
 */
export function ScheduledArticleBanner({ onClose }: BannerProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  // Get scheduled articles using our custom hook
  const { nextScheduledArticle } = useScheduledArticles('scheduled');

  // Handle banner close - this will call the dismissBanner action
  const handleClose = () => {
    if (onClose) onClose();
  };

  // Navigate to generate page
  const handleNavigateToGenerate = () => {
    navigate('/generate');
  };

  // Navigate to calendar page
  const handleNavigateToCalendar = () => {
    navigate('/calendar');
  };

  // Show different content based on scheduled articles
  return (
    <Alert
      severity={nextScheduledArticle ? "info" : "warning"}
      icon={
        nextScheduledArticle ? (
          <Iconify icon="mdi:calendar-clock" width={24} height={24} />
        ) : (
          <Iconify icon="mdi:calendar-plus" width={24} height={24} />
        )
      }
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={handleClose}
        >
          <Iconify icon="mdi:close" width={20} height={20} />
        </IconButton>
      }
      sx={{
        borderRadius: 2,
        boxShadow: theme.shadows[3],
        backgroundColor: nextScheduledArticle
          ? alpha(theme.palette.info.main, 0.1)
          : alpha(theme.palette.warning.main, 0.1),
        '& .MuiAlert-icon': {
          color: nextScheduledArticle
            ? theme.palette.info.main
            : theme.palette.warning.main,
        },
        '& .MuiAlert-message': {
          width: '100%',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Box>
          {nextScheduledArticle ? (
            <>
              <Typography variant="subtitle1" fontWeight="bold">
                {t('dashboard.nextScheduledArticle', 'Next Scheduled Article')}
              </Typography>
              <Typography variant="body2">
                {t('dashboard.articleScheduledFor', '"{{title}}" scheduled for {{date}}', {
                  title: nextScheduledArticle.title,
                  date: format(new Date(nextScheduledArticle.scheduledAt), 'PPP')
                })}
              </Typography>
              {nextScheduledArticle.timeRemaining && (
                <Typography variant="body2" fontWeight="medium" sx={{ mt: 0.5, color: theme.palette.info.dark }}>
                  {t('dashboard.timeRemaining', 'Time remaining: {{days}}d {{hours}}h {{minutes}}m', {
                    days: nextScheduledArticle.timeRemaining.days,
                    hours: nextScheduledArticle.timeRemaining.hours,
                    minutes: nextScheduledArticle.timeRemaining.minutes
                  })}
                </Typography>
              )}
            </>
          ) : (
            <>
              <Typography variant="subtitle1" fontWeight="bold">
                {t('dashboard.noScheduledArticles', 'No Scheduled Articles')}
              </Typography>
              <Typography variant="body2">
                {t('dashboard.scheduleArticlePrompt', 'Schedule your next article to maintain consistent content publishing')}
              </Typography>
            </>
          )}
        </Box>

        <Box>
          <Button
            variant="contained"
            color={nextScheduledArticle ? "info" : "warning"}
            size="small"
            onClick={nextScheduledArticle ? handleNavigateToCalendar : handleNavigateToGenerate}
            startIcon={
              <Iconify
                icon={nextScheduledArticle ? "mdi:calendar-month" : "mdi:file-document-plus"}
                width={18}
                height={18}
              />
            }
            sx={{
              borderRadius: 6,
              textTransform: 'none',
              boxShadow: theme.shadows[2],
              mr: 1
            }}
          >
            {nextScheduledArticle
              ? t('dashboard.viewCalendar', 'View Calendar')
              : t('dashboard.createArticle', 'Create Article')}
          </Button>
        </Box>
      </Box>
    </Alert>
  );
}

/**
 * Combined dashboard banners component
 * Shows subscription expiration banner and scheduled article banner
 * Only shows banners when the page is first loaded, not on navigation
 * Banners remain dismissed until the page is reloaded
 */
export default function DashboardBanners() {
  const {
    isSubscriptionBannerVisible,
    isScheduledArticleBannerVisible,
    dismissSubscriptionBanner,
    dismissScheduledArticleBanner
  } = useBannerDisplay();

  // If both banners are dismissed, don't render anything
  if (!isSubscriptionBannerVisible && !isScheduledArticleBannerVisible) {
    return null;
  }

  // Log banner visibility for debugging
  console.log('Banner visibility:', {
    subscription: isSubscriptionBannerVisible,
    scheduledArticle: isScheduledArticleBannerVisible
  });

  return (
    <Stack spacing={2}>
      {isSubscriptionBannerVisible && (
        <Collapse in={isSubscriptionBannerVisible}>
          <SubscriptionExpirationBanner
            onClose={() => {
              console.log('Dismissing subscription banner');
              dismissSubscriptionBanner();
            }}
          />
        </Collapse>
      )}

      {isScheduledArticleBannerVisible && (
        <Collapse in={isScheduledArticleBannerVisible}>
          <ScheduledArticleBanner
            onClose={() => {
              console.log('Dismissing scheduled article banner');
              dismissScheduledArticleBanner();
            }}
          />
        </Collapse>
      )}
    </Stack>
  );
}
