import { useTranslation } from 'react-i18next';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';

import type { Template } from 'src/utils/templateUtils';

import { Iconify } from 'src/components/iconify';

import { TemplatePreviewButton } from './TemplatePreviewButton';

// ----------------------------------------------------------------------

interface TemplatePreviewSectionProps {
  template: Template;
  variant?: 'full' | 'compact';
}

export function TemplatePreviewSection({ 
  template, 
  variant = 'full' 
}: TemplatePreviewSectionProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  if (variant === 'compact') {
    return (
      <Box 
        sx={{ 
          p: 3, 
          borderRadius: 2, 
          bgcolor: alpha(template.color || theme.palette.primary.main, 0.05),
          border: `1px solid ${alpha(template.color || theme.palette.primary.main, 0.2)}`,
          textAlign: 'center',
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: template.color || 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: theme.shadows[4],
            }}
          >
            <Iconify 
              icon="mdi:eye-outline" 
              sx={{ 
                fontSize: 24, 
                color: 'white',
              }} 
            />
          </Box>
          
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {t('templates.previewTitle', 'See This Template in Action')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('templates.previewSubtitle', 'Experience the full design and layout in a new tab')}
            </Typography>
          </Box>

          <TemplatePreviewButton
            templateId={template.id}
            templateColor={template.color}
            variant="contained"
            size="medium"
          />
        </Stack>
      </Box>
    );
  }

  // Full variant
  return (
    <Box 
      sx={{ 
        p: 4, 
        borderRadius: 3, 
        bgcolor: alpha(template.color || theme.palette.primary.main, 0.05),
        border: `2px solid ${alpha(template.color || theme.palette.primary.main, 0.2)}`,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <Stack spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
            {t('templates.previewTitle', 'See This Template in Action')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t('templates.previewSubtitle', 'Experience the full design and layout in a new tab')}
          </Typography>
        </Box>

        <TemplatePreviewButton
          templateId={template.id}
          templateColor={template.color}
          variant="contained"
          size="large"
        />
      </Stack>
    </Box>
  );
}
