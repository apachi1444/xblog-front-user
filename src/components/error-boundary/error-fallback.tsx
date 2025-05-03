import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FallbackProps } from 'react-error-boundary';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: theme.customShadows.z16,
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              bgcolor: 'error.main',
            },
          }}
        >
          <Box
            component="img"
            src="/assets/illustrations/illustration_error.svg"
            alt="Error"
            sx={{
              height: 180,
              mb: 3,
              mx: 'auto',
              filter: theme.palette.mode === 'dark' ? 'brightness(0.8)' : 'none',
            }}
          />

          <Typography variant="h4" color="error" gutterBottom>
            {t('error.title', 'Something went wrong')}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t(
              'error.message',
              'We encountered an unexpected error. Please try again or contact support if the problem persists.'
            )}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={resetErrorBoundary}
              startIcon={<Iconify icon="mdi:refresh" />}
              sx={{ px: 3 }}
            >
              {t('error.retry', 'Try Again')}
            </Button>

            <Button
              variant="outlined"
              color="inherit"
              onClick={toggleDetails}
              endIcon={
                <Iconify
                  icon={showDetails ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                  width={20}
                  height={20}
                />
              }
            >
              {showDetails
                ? t('error.hideDetails', 'Hide Details')
                : t('error.showDetails', 'Show Details')}
            </Button>
          </Box>

          <Collapse in={showDetails}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mb: 3,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                borderRadius: 1,
                textAlign: 'left',
                fontFamily: 'monospace',
                position: 'relative',
              }}
            >
              <IconButton
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(error.stack || error.message);
                }}
                sx={{ position: 'absolute', top: 8, right: 8 }}
                title={t('error.copyToClipboard', 'Copy to clipboard')}
              >
                <Iconify icon="mdi:content-copy" width={18} />
              </IconButton>
              <Typography variant="subtitle2" color="error.main" gutterBottom>
                {error.name}: {error.message}
              </Typography>
              <Typography
                variant="caption"
                component="pre"
                sx={{
                  mt: 1,
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  color: 'text.secondary',
                  overflow: 'auto',
                  maxHeight: 300,
                  fontSize: '0.75rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {error.stack}
              </Typography>
            </Paper>
          </Collapse>

          <Typography variant="caption" color="text.secondary">
            {t('error.reportIssue', 'If this issue persists, please report it to our support team.')}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
