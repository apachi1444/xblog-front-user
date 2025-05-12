import { useTranslation } from 'react-i18next';

import { Box, alpha, Tooltip, useTheme, Typography } from '@mui/material';

import { useGetSubscriptionDetailsQuery } from 'src/services/apis/subscriptionApi';

import { Iconify } from 'src/components/iconify';

interface CompactResourceDisplayProps {
  type: 'articles' | 'websites';
}

export function CompactResourceDisplay({ type }: CompactResourceDisplayProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  // Get subscription details from API
  const { data: subscriptionDetails, isLoading } = useGetSubscriptionDetailsQuery();

  let used = 0;
  let total = 0;
  let remaining = 0;
  let percentage = 0;
  let icon = '';
  let label = '';
  let tooltipTitle = '';

  // Set default icon and tooltip based on type
  icon = type === 'articles' ? 'mdi:file-document-outline' : 'mdi:web';

  // We'll set the tooltip title later when we have the data

  // Show loading state
  if (isLoading) {
    label = '...';
  }
  // Set values based on type if not loading
  else if (subscriptionDetails) {
    if (type === 'articles') {
      used = subscriptionDetails.articles_created || 0;
      total = subscriptionDetails.articles_limit || 100;
      remaining = total - used;
      percentage = Math.min((used / total) * 100, 100);
      label = `${remaining}/${total} ${t('resources.availableLabel', 'available')}`;
    } else {
      used = subscriptionDetails.connected_websites || 0;
      total = subscriptionDetails.websites_limit || 5;
      remaining = total - used;
      percentage = Math.min((used / total) * 100, 100);
      label = `${remaining}/${total} ${t('resources.availableLabel', 'available')}`;
    }
  } else {
    // Fallback if no data
    label = '0/0';
  }

  // Determine color based on percentage
  const getColor = () => {
    if (percentage > 90) {
      return theme.palette.error.main; // Red for critical (more than 90% used)
    }
    if (percentage > 70) {
      return theme.palette.warning.main; // Orange/Yellow for high (more than 70% used)
    }
    return theme.palette.success.main; // Green for low usage
  };

  const color = getColor();

  // Get the label text based on type
  const labelText = type === 'articles' ? t('resources.articles', 'Articles') : t('resources.websites', 'Sites');

  // Set detailed tooltip content
  if (subscriptionDetails) {
    tooltipTitle = type === 'articles'
      ? `${t('resources.articlesUsed', 'Articles Used')}: ${used}/${total}\n${t('resources.articlesRemaining', 'Articles Remaining')}: ${remaining}`
      : `${t('resources.websitesUsed', 'Websites Used')}: ${used}/${total}\n${t('resources.websitesRemaining', 'Websites Remaining')}: ${remaining}`;
  } else {
    tooltipTitle = type === 'articles' ? t('resources.articles', 'Articles') : t('resources.websites', 'Websites');
  }

  // Create tooltip content with proper formatting
  const tooltipContent = (
    <Box sx={{ p: 1, maxWidth: 220 }}>
      {subscriptionDetails ? (
        type === 'articles' ? (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {t('resources.articles', 'Articles')}
            </Typography>
            <Typography variant="body2">
              {t('resources.used', 'Used')}: {used}/{total}
            </Typography>
            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold' }}>
              {t('resources.available', 'Available')}: {remaining}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {t('resources.websites', 'Websites')}
            </Typography>
            <Typography variant="body2">
              {t('resources.used', 'Used')}: {used}/{total}
            </Typography>
            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold' }}>
              {t('resources.available', 'Available')}: {remaining}
            </Typography>
          </>
        )
      ) : (
        <Typography variant="body2">
          {type === 'articles' ? t('resources.articles', 'Articles') : t('resources.websites', 'Websites')}
        </Typography>
      )}
    </Box>
  );

  return (
    <Tooltip title={tooltipContent} placement="bottom">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 0.75,
          borderRadius: 2,
          bgcolor: alpha(color, 0.1),
          border: `1px solid ${alpha(color, 0.2)}`,
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: alpha(color, 0.15),
          },
        }}
      >
        <Iconify icon={icon} width={20} height={20} sx={{ color }} />
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              lineHeight: 1.2,
              color: theme.palette.text.primary,
              fontWeight: 600,
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              lineHeight: 1,
              color: theme.palette.text.secondary,
              display: 'block',
            }}
          >
            {labelText}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
}
