import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';

import { DraftStatus as DraftStatusEnum } from 'src/types/draft';

// ----------------------------------------------------------------------

interface DraftStatusProps {
  status: DraftStatusEnum;
  lastSaved?: Date | null;
  compact?: boolean;
}

export function DraftStatus({ status, lastSaved, compact = false }: DraftStatusProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const getStatusConfig = () => {
    switch (status) {
      case DraftStatusEnum.CREATING:
        return {
          label: t('draft.status.creating', 'Creating draft...'),
          color: 'info' as const,
          icon: <CircularProgress size={16} />,
        };
      case DraftStatusEnum.SAVING:
        return {
          label: t('draft.status.saving', 'Saving...'),
          color: 'warning' as const,
          icon: <CircularProgress size={16} />,
        };
      case DraftStatusEnum.SAVED:
        return {
          label: t('draft.status.saved', 'Saved'),
          color: 'success' as const,
          icon: <Iconify icon="mdi:check-circle" width={16} height={16} />,
        };
      case DraftStatusEnum.ERROR:
        return {
          label: t('draft.status.error', 'Save failed'),
          color: 'error' as const,
          icon: <Iconify icon="mdi:alert-circle" width={16} height={16} />,
        };
      case DraftStatusEnum.OFFLINE:
        return {
          label: t('draft.status.offline', 'Saved locally'),
          color: 'default' as const,
          icon: <Iconify icon="mdi:cloud-off" width={16} height={16} />,
        };
      default:
        return {
          label: '',
          color: 'default' as const,
          icon: null,
        };
    }
  };

  const { label, color, icon } = getStatusConfig();

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return t('draft.lastSaved.justNow', 'Just now');
    }
    
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return t('draft.lastSaved.minutesAgo', '{{minutes}} min ago', { minutes });
    }
    
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return t('draft.lastSaved.hoursAgo', '{{hours}}h ago', { hours });
    }
    
    return date.toLocaleDateString();
  };

  if (compact) {
    return (
      <Chip
        size="small"
        label={label}
        color={color}
        sx={{
          height: 24,
          '& .MuiChip-label': {
            fontSize: '0.75rem',
            px: 1,
          },
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        borderRadius: 1,
        bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {icon}
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      {lastSaved && status === DraftStatusEnum.SAVED && (
        <Typography variant="caption" color="text.disabled" sx={{ ml: 1 }}>
          • {formatLastSaved(lastSaved)}
        </Typography>
      )}
    </Box>
  );
}
