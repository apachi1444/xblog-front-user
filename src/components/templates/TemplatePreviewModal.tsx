import { useTranslation } from 'react-i18next';

import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Chip,
  Stack,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import { type Template } from 'src/utils/templateUtils';

import { Iconify } from 'src/components/iconify';
import { TemplatePreviewButton } from './TemplatePreviewButton';
import { TemplatePreviewSection } from './TemplatePreviewSection';

// ----------------------------------------------------------------------

interface TemplatePreviewModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (templateId: string) => void;
  template: Template | null;
  isGenerating?: boolean;
}

export function TemplatePreviewModal({
  open,
  onClose,
  onGenerate,
  template,
  isGenerating = false,
}: TemplatePreviewModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();



  const handleGenerate = () => {
    if (template) {
      onGenerate(template.id);
    }
  };

  if (!template) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '95vh',
          height: '95vh',
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: template.color ? alpha(template.color, 0.1) : alpha(theme.palette.primary.main, 0.1),
                  color: template.color || 'primary.main',
                  fontSize: '1.5rem',
                }}
              >
                {template.icon || '📄'}
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {template.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {template.description}
                </Typography>
              </Box>
            </Stack>
          </Box>
          
          <Stack direction="row" spacing={1}>
            {template.isNew && (
              <Chip
                label="New"
                size="small"
                sx={{
                  bgcolor: 'success.main',
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            )}
            {template.popular && (
              <Chip
                label="Popular"
                size="small"
                sx={{
                  bgcolor: 'warning.main',
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            )}
            {template.difficulty && (
              <Chip
                label={template.difficulty}
                size="small"
                variant="outlined"
                sx={{ textTransform: 'capitalize' }}
              />
            )}
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Template Info */}
        <Box sx={{ px: 3, py: 2, bgcolor: alpha(theme.palette.grey[500], 0.05) }}>
          <Stack direction="row" spacing={4} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={4} alignItems="center">
              {template.estimatedTime && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {template.estimatedTime}
                  </Typography>
                </Box>
              )}
              {template.bestFor && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="mdi:target" sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Best for: {template.bestFor}
                  </Typography>
                </Box>
              )}
            </Stack>

            {/* Prominent Preview Button */}
            <TemplatePreviewButton
              templateId={template.id}
              templateColor={template.color}
              variant="outlined"
              size="medium"
            />
          </Stack>
        </Box>

        {/* Template Details */}
        <Box sx={{ flex: 1, p: 3 }}>
          <Stack spacing={4}>
            {/* Central Preview Section */}
            <TemplatePreviewSection template={template} variant="full" />

            {/* Template Features */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {t('templates.features', 'Template Features')}
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon="mdi:palette" sx={{ color: 'primary.main', fontSize: 18 }} />
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {t('templates.customStyling', 'Custom styling and layout')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon="mdi:responsive" sx={{ color: 'primary.main', fontSize: 18 }} />
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {t('templates.responsive', 'Responsive design for all devices')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon="mdi:search-web" sx={{ color: 'primary.main', fontSize: 18 }} />
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {t('templates.seoOptimized', 'SEO optimized structure')}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isGenerating}
            sx={{ flex: 1 }}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={isGenerating}
            startIcon={
              isGenerating ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Iconify icon="mdi:magic-staff" />
              )
            }
            sx={{
              flex: 2,
              background: template.gradient || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              '&:hover': {
                background: template.gradient || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                filter: 'brightness(0.9)',
              }
            }}
          >
            {isGenerating
              ? t('templates.generating', 'Generating Article...')
              : t('templates.generateWithTemplate', 'Generate Article with This Template')
            }
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
