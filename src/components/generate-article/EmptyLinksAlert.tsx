import { useTranslation } from 'react-i18next';

import { Box, Alert, alpha, useTheme, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface EmptyLinksAlertProps {
  type: 'internal' | 'external';
}

export function EmptyLinksAlert({ type }: EmptyLinksAlertProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Alert
      severity="info"
      sx={{
        borderRadius: 2,
        bgcolor: alpha(theme.palette.info.main, 0.05),
        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Iconify
          icon={type === 'internal' ? 'mdi:link' : 'mdi:open-in-new'}
          width={20}
          height={20}
          color="info.main"
        />
        <Typography variant="subtitle2" fontWeight={600}>
          {type === 'internal'
            ? t('links.noInternalLinksTitle', 'No Internal Links')
            : t('links.noExternalLinksTitle', 'No External Links')}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {type === 'internal'
          ? t('links.noInternalLinks', 'Generate AI-powered internal links or add them manually to improve your article\'s SEO and user experience.')
          : t('links.noExternalLinks', 'Generate relevant external links or add them manually to provide additional value and credibility to your content.')}
      </Typography>
    </Alert>
  );
}