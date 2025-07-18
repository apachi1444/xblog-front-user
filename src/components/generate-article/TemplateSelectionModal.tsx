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

import { Iconify } from 'src/components/iconify';

// Template definitions
const TEMPLATES = [
  {
    id: 'template1',
    name: 'Purple Pulse',
    icon: '🔮',
    description: 'A sleek, modern accordion style with a purple theme, interactive toggles, and clean spacing.',
    bestFor: 'tech blogs, SaaS platforms, digital services',
    color: '#9c27b0',
    gradient: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
  },
  {
    id: 'template2',
    name: 'Blue Breeze',
    icon: '🔵',
    description: 'A calming, professional FAQ with soft blue accents, minimalist borders, and smooth transitions.',
    bestFor: 'corporate websites, finance, healthcare, or legal industries',
    color: '#2196f3',
    gradient: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
  },
  {
    id: 'template3',
    name: 'Slate Glow',
    icon: '⚪',
    description: 'A neutral-toned, elegant accordion with gray hues and soft shadow effects. Polished yet approachable.',
    bestFor: 'product FAQs, agencies, portfolios',
    color: '#607d8b',
    gradient: 'linear-gradient(135deg, #607d8b 0%, #455a64 100%)',
  },
  {
    id: 'template4',
    name: 'Dual Grid Lite',
    icon: '🌤',
    description: 'A 2-column grid layout with clean cards and a soft gray background—great for visual browsing.',
    bestFor: 'eCommerce, lifestyle brands, or mobile-first designs',
    color: '#ff9800',
    gradient: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
  },
  {
    id: 'template5',
    name: 'Crystal Timeline',
    icon: '💎',
    description: 'A unique vertical timeline layout with left-aligned bullets and rich visual hierarchy.',
    bestFor: 'storytelling, process documentation, step-by-step guides',
    color: '#4caf50',
    gradient: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
  },
];

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

  const selectedTemplateData = TEMPLATES.find(template => template.id === selectedTemplate);

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
          {TEMPLATES.map((template) => (
            <Grid item xs={12} sm={6} key={template.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: selectedTemplate === template.id
                    ? `2px solid ${template.color}`
                    : `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
                  transform: selectedTemplate === template.id ? 'translateY(-4px)' : 'none',
                  boxShadow: selectedTemplate === template.id
                    ? `0 8px 25px ${alpha(template.color, 0.3)}`
                    : theme.shadows[1],
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${alpha(template.color, 0.2)}`,
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
                          background: alpha(template.color, 0.1),
                        }}
                      >
                        {template.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {template.name}
                        </Typography>
                        <Chip
                          label={template.id}
                          size="small"
                          sx={{
                            background: template.gradient,
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                      {selectedTemplate === template.id && (
                        <Iconify
                          icon="eva:checkmark-circle-2-fill"
                          sx={{ color: template.color, fontSize: '1.5rem' }}
                        />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                      {template.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Great for:
                      </Typography>
                      <Typography variant="caption" sx={{ color: template.color, fontWeight: 500 }}>
                        {template.bestFor}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {selectedTemplateData && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              background: alpha(selectedTemplateData.color, 0.05),
              border: `1px solid ${alpha(selectedTemplateData.color, 0.2)}`,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: selectedTemplateData.color }}>
              Selected: {selectedTemplateData.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedTemplateData.description}
            </Typography>
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
              background: selectedTemplateData?.gradient,
              '&:hover': {
                background: selectedTemplateData?.gradient,
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
