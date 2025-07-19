import type { Template } from 'src/utils/templateUtils';

import { useState, useEffect } from 'react';
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

import { Iconify } from 'src/components/iconify';
import { HtmlIframeRenderer } from 'src/components/html-renderer';

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
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Load fake article content when template changes
  useEffect(() => {
    const loadFakeContent = async () => {
      if (!template || !open) return;

      setIsLoadingPreview(true);
      try {
        // For now, use aa.html for all templates
        // TODO: In the future, each template will have its own fake article
        const response = await fetch('/aa.html');
        if (!response.ok) {
          throw new Error(`Failed to load preview: ${response.status}`);
        }
        const htmlText = await response.text();
        setHtmlContent(htmlText);
      } catch (error) {
        console.error('Failed to load template preview:', error);
        setHtmlContent('<p>Preview not available</p>');
      } finally {
        setIsLoadingPreview(false);
      }
    };

    loadFakeContent();
  }, [template, open]);

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
          <Stack direction="row" spacing={4} alignItems="center">
            {template.estimatedTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon="mdi:clock-outline" sx={{ color: 'text.secondary' }} />
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
        </Box>

        {/* Preview Content */}
        <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {isLoadingPreview ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                {t('templates.loadingPreview', 'Loading preview...')}
              </Typography>
            </Box>
          ) : htmlContent ? (
            <Box sx={{ height: '100%', position: 'relative' }}>
              <HtmlIframeRenderer
                htmlContent={htmlContent}
              />
              
              {/* Preview Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(transparent 60%, rgba(255,255,255,0.95) 100%)',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />
              
              {/* Preview Label */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 2,
                }}
              >
                <Chip
                  label={t('templates.preview', 'Preview')}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.common.black, 0.7),
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Iconify icon="mdi:file-document-outline" sx={{ fontSize: 48, color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary">
                {t('templates.previewNotAvailable', 'Preview not available')}
              </Typography>
            </Box>
          )}
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
