import { formatDate } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { Box, Chip, alpha, useTheme, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Platform icons mapping
const PLATFORM_ICONS = {
  wordpress: { icon: 'mdi:wordpress', color: '#21759b', name: 'WordPress' },
  medium: { icon: 'mdi:medium', color: '#00ab6c', name: 'Medium' },
  ghost: { icon: 'simple-icons:ghost', color: '#15171a', name: 'Ghost' },
  webflow: { icon: 'simple-icons:webflow', color: '#4353ff', name: 'Webflow' },
  shopify: { icon: 'mdi:shopify', color: '#7ab55c', name: 'Shopify' },
  wix: { icon: 'simple-icons:wix', color: '#0c6efc', name: 'Wix' },
  squarespace: { icon: 'simple-icons:squarespace', color: '#000000', name: 'Squarespace' },
  default: { icon: 'mdi:web', color: '#6e7681', name: 'Website' }
};

interface StatusBadgeProps {
  status: 'draft' | 'publish' | 'scheduled';
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'prominent';
  scheduledDate?: string; // For scheduled articles, show the date
  platform?: string; // For published articles, show the platform
}

export function StatusBadge({ status, size = 'medium', variant = 'default', scheduledDate, platform }: StatusBadgeProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  // Check if we should show scheduled date
  const showScheduledDate = status === 'scheduled' && scheduledDate && variant === 'prominent';

  // Check if we should show platform (for published articles)
  const showPlatform = status === 'publish' && platform && variant === 'prominent';

  // Get platform info for display
  const getPlatformInfo = () => {
    if (!platform) return null;

    const platformKey = platform.toLowerCase();
    return PLATFORM_ICONS[platformKey as keyof typeof PLATFORM_ICONS] || PLATFORM_ICONS.default;
  };

  const platformInfo = getPlatformInfo();

  // Get status configuration based on status value
  const getStatusConfig = () => {
    const isProminent = variant === 'prominent';

    switch (status) {
      case 'publish':
        return {
          color: theme.palette.success.main,
          bgColor: isProminent
            ? alpha(theme.palette.success.main, 0.15)
            : alpha(theme.palette.success.main, 0.1),
          borderColor: isProminent
            ? alpha(theme.palette.success.main, 0.4)
            : alpha(theme.palette.success.main, 0.2),
          label: t('common.published', 'Published'),
          icon: 'mdi:check-circle',
          gradient: isProminent
            ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.2)} 0%, ${alpha(theme.palette.success.main, 0.1)} 100%)`
            : undefined,
        };
      case 'scheduled':
        return {
          color: theme.palette.info.main,
          bgColor: isProminent
            ? alpha(theme.palette.info.main, 0.15)
            : alpha(theme.palette.info.main, 0.1),
          borderColor: isProminent
            ? alpha(theme.palette.info.main, 0.4)
            : alpha(theme.palette.info.main, 0.2),
          label: t('common.scheduled', 'Scheduled'),
          icon: 'mdi:calendar-clock',
          gradient: isProminent
            ? `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.2)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`
            : undefined,
        };
      case 'draft':
      default:
        return {
          color: theme.palette.warning.main,
          bgColor: isProminent
            ? alpha(theme.palette.warning.main, 0.15)
            : alpha(theme.palette.warning.main, 0.1),
          borderColor: isProminent
            ? alpha(theme.palette.warning.main, 0.4)
            : alpha(theme.palette.warning.main, 0.2),
          label: t('common.draft', 'Draft'),
          icon: 'mdi:file-document-edit',
          gradient: isProminent
            ? `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.2)} 0%, ${alpha(theme.palette.warning.main, 0.1)} 100%)`
            : undefined,
        };
    }
  };

  const statusConfig = getStatusConfig();
  const isSmall = size === 'small';
  const isLarge = size === 'large';
  const isProminent = variant === 'prominent';

  // Enhanced sizing for different variants
  const getSizing = () => {
    if (isProminent) {
      return {
        px: isLarge ? 2 : isSmall ? 1 : 1.5,
        py: isLarge ? 1 : isSmall ? 0.5 : 0.75,
        fontSize: isLarge ? '0.875rem' : isSmall ? '0.7rem' : '0.75rem',
        iconSize: isLarge ? 18 : isSmall ? 14 : 16,
        dotSize: isLarge ? 8 : isSmall ? 6 : 7,
        borderRadius: isLarge ? 2 : 1.5,
      };
    }

    return {
      px: isSmall ? 0.75 : 1,
      py: isSmall ? 0.25 : 0.5,
      fontSize: isSmall ? '0.65rem' : '0.7rem',
      iconSize: isSmall ? 12 : 14,
      dotSize: isSmall ? 4 : 6,
      borderRadius: 1,
    };
  };

  const sizing = getSizing();

  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: (showScheduledDate || showPlatform) ? 'column' : 'row',
        alignItems: (showScheduledDate || showPlatform) ? 'flex-start' : 'center',
        px: sizing.px,
        py: sizing.py,
        borderRadius: sizing.borderRadius,
        background: statusConfig.gradient || statusConfig.bgColor,
        border: `1px solid ${statusConfig.borderColor}`,
        boxShadow: isProminent ? `0 2px 8px ${alpha(statusConfig.color, 0.15)}` : 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': isProminent ? {
          transform: 'translateY(-1px)',
          boxShadow: `0 4px 12px ${alpha(statusConfig.color, 0.2)}`,
        } : {},
      }}
    >
      {/* Main status row */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Icon or Dot */}
        {isProminent ? (
          <Iconify
            icon={statusConfig.icon}
            width={sizing.iconSize}
            height={sizing.iconSize}
            sx={{
              color: statusConfig.color,
              mr: 0.75,
              filter: `drop-shadow(0 1px 2px ${alpha(statusConfig.color, 0.3)})`,
            }}
          />
        ) : (
          <Box
            sx={{
              width: sizing.dotSize,
              height: sizing.dotSize,
              borderRadius: '50%',
              bgcolor: statusConfig.color,
              mr: 0.5,
              boxShadow: `0 0 0 2px ${alpha(statusConfig.color, 0.2)}`,
            }}
          />
        )}

        {/* Label */}
        <Typography
          variant="caption"
          sx={{
            color: statusConfig.color,
            fontWeight: isProminent ? 700 : 500,
            fontSize: sizing.fontSize,
            textTransform: isProminent ? 'uppercase' : 'none',
            letterSpacing: isProminent ? '0.5px' : 'normal',
            textShadow: isProminent ? `0 1px 2px ${alpha(statusConfig.color, 0.2)}` : 'none',
          }}
        >
          {statusConfig.label}
        </Typography>
      </Box>

      {/* Scheduled date display */}
      {showScheduledDate && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 0.75,
            gap: 0.75,
          }}
        >
          <Iconify
            icon="mdi:calendar-clock"
            width={16}
            height={16}
            sx={{ color: alpha(statusConfig.color, 0.8) }}
          />
          <Typography
            variant="caption"
            sx={{
              color: alpha(statusConfig.color, 0.9),
              fontWeight: 600,
              fontSize: '0.8rem',
              lineHeight: 1.2,
            }}
          >
            {formatDate(new Date(scheduledDate), 'MMM d • h:mm a')}
          </Typography>
        </Box>
      )}

      {/* Platform display for published articles */}
      {showPlatform && platformInfo && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 0.75,
            gap: 0.75,
          }}
        >
          <Chip
            size="small"
            icon={<Iconify icon={platformInfo.icon} />}
            label={platformInfo.name}
            sx={{
              height: 20,
              fontSize: '0.7rem',
              fontWeight: 'bold',
              bgcolor: alpha(platformInfo.color, 0.1),
              color: platformInfo.color,
              border: `1px solid ${alpha(platformInfo.color, 0.2)}`,
              '& .MuiChip-icon': {
                color: platformInfo.color,
                width: 14,
                height: 14,
              },
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
