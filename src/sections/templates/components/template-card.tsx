
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

import { Iconify } from 'src/components/iconify';

import type { ArticleTemplate } from '../template-types';

// ----------------------------------------------------------------------

interface TemplateCardProps {
  template: ArticleTemplate;
  onSelect: () => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const { title, description, popular, isNew, locked } = template;
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[10],
        },
      }}
    >
      <CardActionArea 
        onClick={onSelect}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1}>
              {popular && (
                <Chip 
                  size="small" 
                  color="warning" 
                  label="Popular"
                  icon={<Iconify icon="mdi:fire" />} 
                />
              )}
              
              {isNew && (
                <Chip 
                  size="small" 
                  color="info" 
                  label="New"
                  icon={<Iconify icon="mdi:star" />} 
                />
              )}
            </Stack>
            
            {locked && (
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <Iconify 
                  icon="mdi:lock" 
                  sx={{ 
                    color: 'primary.main',
                    fontSize: 18,
                  }} 
                />
              </Box>
            )}
          </Stack>
          
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2,
            }}
          >
            {description}
          </Typography>
          
          <Box 
            sx={{ 
              mt: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
              }}
            >
              <Iconify icon="mdi:clock-outline" sx={{ mr: 0.5 }} />
              5 min
            </Typography>
            
            {locked ? (
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                <Typography variant="subtitle2" sx={{ mr: 0.5 }}>
                  Premium
                </Typography>
                <Iconify icon="mdi:crown" />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                <Typography variant="subtitle2" sx={{ mr: 0.5 }}>
                  Free
                </Typography>
                <Iconify icon="mdi:check-circle" />
              </Box>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}