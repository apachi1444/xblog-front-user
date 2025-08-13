import { useTranslation } from 'react-i18next';

import { Box, alpha, useTheme, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface StatusBadgeProps {
  status: 'draft' | 'publish' | 'scheduled';
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'prominent';
}

export function StatusBadge({ status, size = 'medium', variant = 'default' }: StatusBadgeProps) {
  const { t } = useTranslation();
  const theme = useTheme();

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
        alignItems: 'center',
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
  );
}
