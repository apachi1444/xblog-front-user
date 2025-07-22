import { useTranslation } from 'react-i18next';

import { alpha, useTheme } from '@mui/material/styles';
import { Button, IconButton, Tooltip } from '@mui/material';

import { generateTemplatePreviewUrl } from 'src/utils/templateUtils';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface TemplatePreviewButtonProps {
  templateId: string;
  templateColor?: string;
  variant?: 'icon' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export function TemplatePreviewButton({
  templateId,
  templateColor,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
}: TemplatePreviewButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const handlePreviewTemplate = () => {
    const previewUrl = generateTemplatePreviewUrl(templateId);
    window.open(previewUrl, '_blank');
  };

  // Icon button variant
  if (variant === 'icon') {
    return (
      <Tooltip title={t('templates.previewInNewTab', 'Preview in new tab')}>
        <IconButton
          onClick={handlePreviewTemplate}
          size={size}
          sx={{
            color: templateColor || 'primary.main',
            '&:hover': {
              bgcolor: alpha(templateColor || theme.palette.primary.main, 0.1),
            }
          }}
        >
          <Iconify icon="mdi:eye-outline" />
        </IconButton>
      </Tooltip>
    );
  }

  // Button variants (outlined or contained)
  const buttonProps = {
    variant,
    size,
    fullWidth,
    startIcon: <Iconify icon="mdi:eye-outline" />,
    onClick: handlePreviewTemplate,
  };

  const buttonStyles = {
    fontWeight: 600,
    borderRadius: variant === 'contained' ? 3 : 2,
    transition: 'all 0.3s ease-in-out',
    ...(variant === 'outlined' && {
      borderColor: templateColor || 'primary.main',
      color: templateColor || 'primary.main',
      '&:hover': {
        bgcolor: alpha(templateColor || theme.palette.primary.main, 0.1),
        borderColor: templateColor || 'primary.dark',
        transform: 'translateY(-1px)',
        boxShadow: theme.shadows[4],
      },
    }),
    ...(variant === 'contained' && {
      bgcolor: templateColor || 'primary.main',
      color: 'white',
      boxShadow: theme.shadows[6],
      '&:hover': {
        bgcolor: templateColor || 'primary.dark',
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[12],
      },
    }),
  };

  if (size === 'large') {
    return (
      <Button
        {...buttonProps}
        sx={{
          ...buttonStyles,
          px: 4,
          py: 1.5,
          fontSize: '1.1rem',
        }}
      >
        {t('templates.previewTemplate', 'Preview Template')}
      </Button>
    );
  }

  return (
    <Button
      {...buttonProps}
      sx={buttonStyles}
    >
      {size === 'small' 
        ? t('templates.preview', 'Preview')
        : t('templates.previewTemplate', 'Preview Template')
      }
    </Button>
  );
}
