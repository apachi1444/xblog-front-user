import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  CardContent,
  DialogContent,
  DialogActions,
  CardActionArea,
  CircularProgress,
} from '@mui/material';

import { UNIFIED_TEMPLATES } from 'src/utils/templateUtils';

import { Iconify } from 'src/components/iconify';
import { TemplatePreviewButton } from 'src/components/templates/TemplatePreviewButton';
import { TemplatePreviewSection } from 'src/components/templates/TemplatePreviewSection';

// Filter templates to only show design templates
const DESIGN_TEMPLATES = UNIFIED_TEMPLATES.filter(template => template.category === 'design');

interface TemplateSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  isRegenerating?: boolean;
  currentTemplate?: string;
}

export function TemplateSelectionModal({
  open,
  onClose,
  onSelectTemplate,
  isRegenerating = false,
  currentTemplate
}: TemplateSelectionModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [selectedTemplate, setSelectedTemplate] = useState<string>(currentTemplate || 'template1');

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleConfirm = () => {
    onSelectTemplate(selectedTemplate);
  };

  const selectedTemplateData = DESIGN_TEMPLATES.find(template => template.id === selectedTemplate);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="mdi:palette" sx={{ color: 'primary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('template.modal.title', 'Choose Content Template')}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('template.modal.subtitle', 'Select a template to style your generated content. This will regenerate your article with the new design.')}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          {DESIGN_TEMPLATES.map((template) => (
            <Grid item xs={12} sm={6} key={template.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: selectedTemplate === template.id
                    ? `2px solid ${template.color || theme.palette.primary.main}`
                    : `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
                  transform: selectedTemplate === template.id ? 'translateY(-4px)' : 'none',
                  boxShadow: selectedTemplate === template.id
                    ? `0 8px 25px ${alpha(template.color || theme.palette.primary.main, 0.3)}`
                    : theme.shadows[1],
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${alpha(template.color || theme.palette.primary.main, 0.2)}`,
                  }
                }}
              >
                <CardActionArea onClick={() => handleTemplateSelect(template.id)}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          fontSize: '2rem',
                          lineHeight: 1,
                          p: 1,
                          borderRadius: 1,
                          background: alpha(template.color || theme.palette.primary.main, 0.1),
                        }}
                      >
                        {template.icon || '📄'}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {template.name}
                        </Typography>
                        <Chip
                          label={template.id}
                          size="small"
                          sx={{
                            background: template.gradient || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>

                      <Stack direction="row" spacing={1} alignItems="center">
                        {/* Preview Button */}
                        <TemplatePreviewButton
                          templateId={template.id}
                          templateColor={template.color}
                          variant="icon"
                          size="small"
                        />

                        {selectedTemplate === template.id && (
                          <Iconify
                            icon="eva:checkmark-circle-2-fill"
                            sx={{ color: template.color || theme.palette.primary.main, fontSize: '1.5rem' }}
                          />
                        )}
                      </Stack>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                      {template.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Great for:
                      </Typography>
                      <Typography variant="caption" sx={{ color: template.color || theme.palette.primary.main, fontWeight: 500 }}>
                        {template.bestFor || 'General use'}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {selectedTemplateData && (
          <Box sx={{ mt: 3 }}>
            <TemplatePreviewSection
              template={selectedTemplateData}
              variant="compact"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isRegenerating}
            sx={{ flex: 1 }}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={isRegenerating || !selectedTemplate}
            startIcon={
              isRegenerating ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Iconify icon="mdi:magic-staff" />
              )
            }
            sx={{
              flex: 2,
              background: selectedTemplateData?.gradient || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              '&:hover': {
                background: selectedTemplateData?.gradient || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                filter: 'brightness(0.9)',
              }
            }}
          >
            {isRegenerating
              ? t('template.modal.regenerating', 'Applying Template...')
              : t('template.modal.apply', 'Apply Template & Regenerate')
            }
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
