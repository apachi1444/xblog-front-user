import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useBannerDisplay } from 'src/hooks/useBannerDisplay';
import { useScheduledArticles } from 'src/hooks/useScheduledArticles';
import { useSubscriptionExpiration } from 'src/hooks/useSubscriptionExpiration';

import { Iconify } from 'src/components/iconify';

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
    navigate('/create');
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
 * Compact version of the subscription expiration banner for header display
 */
function CompactSubscriptionBanner({ onClose }: BannerProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  // Get subscription expiration information
  const { isExpiringSoon, daysRemaining } = useSubscriptionExpiration(3);

  // Don't show if not expiring soon
  if (!isExpiringSoon || !daysRemaining || daysRemaining < 0) return null;

  // Navigate to profile/subscription page
  const handleNavigateToSubscription = () => {
    navigate('/profile?tab=subscription');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.5,
        height: 36,
        borderRadius: 18,
        bgcolor: alpha(theme.palette.error.main, 0.1),
        color: theme.palette.error.main,
        fontSize: '0.75rem',
        fontWeight: 'medium',
        maxWidth: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
      }}
    >
      <Iconify icon="mdi:alert-circle" width={16} height={16} />
      <Box component="span" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {t('subscription.expirationWarningShort', 'Subscription expires in {{days}} days', { days: daysRemaining })}
      </Box>
      <Button
        size="small"
        variant="text"
        color="error"
        onClick={handleNavigateToSubscription}
        sx={{
          minWidth: 'auto',
          px: 1,
          py: 0.25,
          fontSize: '0.75rem',
          lineHeight: 1,
        }}
      >
        {t('subscription.renewNowShort', 'Renew')}
      </Button>
    </Box>
  );
}

/**
 * Compact version of the scheduled article banner for header display
 */
function CompactScheduledBanner({ onClose }: BannerProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  // Get scheduled articles using our custom hook
  const { nextScheduledArticle } = useScheduledArticles('scheduled');

  // Navigate to calendar page
  const handleNavigate = () => {
    navigate(nextScheduledArticle ? '/calendar' : '/generate');
  };

  const color = nextScheduledArticle ? theme.palette.info.main : theme.palette.warning.main;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.5,
        height: 36,
        borderRadius: 18,
        bgcolor: alpha(color, 0.1),
        color,
        fontSize: '0.75rem',
        fontWeight: 'medium',
        maxWidth: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        border: `1px solid ${alpha(color, 0.2)}`,
      }}
    >
      <Iconify
        icon={nextScheduledArticle ? "mdi:calendar-clock" : "mdi:calendar-plus"}
        width={16}
        height={16}
      />
      <Box component="span" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {nextScheduledArticle
          ? t('dashboard.nextArticleShort', 'Next: "{{title}}"', {
              title: nextScheduledArticle.title
            })
          : t('dashboard.noScheduledArticlesShort', 'No scheduled articles')
        }
      </Box>
      <Button
        size="small"
        variant="text"
        color={nextScheduledArticle ? "info" : "warning"}
        onClick={handleNavigate}
        sx={{
          minWidth: 'auto',
          px: 1,
          py: 0.25,
          fontSize: '0.75rem',
          lineHeight: 1,
        }}
      >
        {nextScheduledArticle
          ? t('dashboard.viewShort', 'View')
          : t('dashboard.createShort', 'Create')
        }
      </Button>
    </Box>
  );
}

/**
 * Combined dashboard banners component
 * Shows subscription expiration banner and scheduled article banner
 * Only shows banners when the page is first loaded, not on navigation
 * Banners remain dismissed until the page is reloaded
 *
 * @param compact - Whether to show compact version for header display
 */
export default function DashboardBanners({ compact = false }: { compact?: boolean }) {
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

  // For compact mode (header display)
  if (compact) {
    // Show only one banner at a time in compact mode, prioritizing subscription
    if (isSubscriptionBannerVisible) {
      return <CompactSubscriptionBanner onClose={() => dismissSubscriptionBanner()} />;
    }

    if (isScheduledArticleBannerVisible) {
      return <CompactScheduledBanner onClose={() => dismissScheduledArticleBanner()} />;
    }

    return null;
  }

  // Standard mode (full banners)
  return (
    <Stack spacing={2}>
      {isSubscriptionBannerVisible && (
        <Collapse in={isSubscriptionBannerVisible}>
          <SubscriptionExpirationBanner
            onClose={() => {
              dismissSubscriptionBanner();
            }}
          />
        </Collapse>
      )}

      {isScheduledArticleBannerVisible && (
        <Collapse in={isScheduledArticleBannerVisible}>
          <ScheduledArticleBanner
            onClose={() => {
              dismissScheduledArticleBanner();
            }}
          />
        </Collapse>
      )}
    </Stack>
  );
}
