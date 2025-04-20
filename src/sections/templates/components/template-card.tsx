import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import CardActionArea from '@mui/material/CardActionArea';

import { Iconify } from 'src/components/iconify';

import type { ArticleTemplate } from '../template-types';

// ----------------------------------------------------------------------

interface TemplateCardProps {
  template: ArticleTemplate;
  onSelect: () => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  
  const { title, description, icon, category, popular, isNew, difficulty, estimatedTime } = template;
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        position: 'relative',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.customShadows.z16,
        },
      }}
    >
      {/* Status badges */}
      <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 9, display: 'flex', gap: 1 }}>
        {isNew && (
          <Chip 
            label={t('templates.new', 'New')} 
            size="small" 
            color="info"
            sx={{ fontWeight: 'bold' }}
          />
        )}
        {popular && (
          <Chip 
            label={t('templates.popular', 'Popular')} 
            size="small" 
            color="error"
            sx={{ fontWeight: 'bold' }}
          />
        )}
      </Box>
      
      <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Icon */}
          <Box 
            sx={{ 
              mb: 2,
              width: 48,
              height: 48,
              display: 'flex',
              borderRadius: 1.5,
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            }}
          >
            <Iconify icon={icon} width={24} height={24} sx={{ color: 'primary.main' }} />
          </Box>
          
          {/* Title and description */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            {title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
            {description}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Metadata */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify icon="mdi:clock-outline" width={16} height={16} sx={{ color: 'text.disabled' }} />
              <Typography variant="caption" color="text.secondary">
                {estimatedTime}
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify 
                icon={
                  difficulty === 'easy' 
                    ? 'mdi:signal-cellular-1' 
                    : difficulty === 'medium' 
                      ? 'mdi:signal-cellular-2' 
                      : 'mdi:signal-cellular-3'
                } 
                width={16} 
                height={16} 
                sx={{ 
                  color: 
                    difficulty === 'easy' 
                      ? 'success.main' 
                      : difficulty === 'medium' 
                        ? 'warning.main' 
                        : 'error.main' 
                }} 
              />
              <Typography variant="caption" color="text.secondary">
                {t(`templates.difficulty.${difficulty}`, difficulty)}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
        
        {/* Action button */}
        <Box sx={{ p: 2, pt: 0 }}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect();
            }}
            endIcon={<Iconify icon="eva:arrow-forward-fill" />}
          >
            {t('templates.useTemplate', 'Use Template')}
          </Button>
        </Box>
      </CardActionArea>
    </Card>
  );
}