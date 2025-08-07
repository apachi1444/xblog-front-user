import { useTranslation } from 'react-i18next';

import { Box, alpha, useTheme, Typography } from '@mui/material';

// ----------------------------------------------------------------------

interface StatusBadgeProps {
  status: 'draft' | 'publish' | 'scheduled';
  size?: 'small' | 'medium';
}

export function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  // Get status configuration based on status value
  const getStatusConfig = () => {
    switch (status) {
      case 'publish':
        return {
          color: theme.palette.success.main,
          bgColor: alpha(theme.palette.success.main, 0.1),
          borderColor: alpha(theme.palette.success.main, 0.2),
          label: t('status.published', 'Published'),
        };
      case 'scheduled':
        return {
          color: theme.palette.info.main,
          bgColor: alpha(theme.palette.info.main, 0.1),
          borderColor: alpha(theme.palette.info.main, 0.2),
          label: t('status.scheduled', 'Scheduled'),
        };
      case 'draft':
      default:
        return {
          color: theme.palette.warning.main,
          bgColor: alpha(theme.palette.warning.main, 0.1),
          borderColor: alpha(theme.palette.warning.main, 0.2),
          label: t('status.draft', 'Draft'),
        };
    }
  };

  const statusConfig = getStatusConfig();
  const isSmall = size === 'small';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: isSmall ? 0.75 : 1,
        py: isSmall ? 0.25 : 0.5,
        borderRadius: 1,
        bgcolor: statusConfig.bgColor,
        border: `1px solid ${statusConfig.borderColor}`,
      }}
    >
      <Box
        sx={{
          width: isSmall ? 4 : 6,
          height: isSmall ? 4 : 6,
          borderRadius: '50%',
          bgcolor: statusConfig.color,
          mr: 0.5,
        }}
      />
      <Typography
        variant="caption"
        sx={{
          color: statusConfig.color,
          fontWeight: 500,
          fontSize: isSmall ? '0.65rem' : '0.7rem',
        }}
      >
        {statusConfig.label}
      </Typography>
    </Box>
  );
}
