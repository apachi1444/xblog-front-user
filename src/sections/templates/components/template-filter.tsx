import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import type { TemplateCategory } from '../template-types';

// ----------------------------------------------------------------------

interface TemplateFilterProps {
  categories: TemplateCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function TemplateFilter({ categories, selectedCategory, onCategoryChange }: TemplateFilterProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  
  return (
    <Stack 
      direction="row" 
      spacing={1} 
      alignItems="center" 
      sx={{ 
        flexWrap: 'wrap', 
        gap: 1,
        py: 1,
        flexGrow: 1,
        overflowX: { xs: 'auto', md: 'visible' },
      }}
    >
      <Typography variant="body2" sx={{ color: 'text.secondary', mr: 1 }}>
        {t('templates.filter.categories', 'Categories:')}
      </Typography>
      
      <Chip
        clickable
        variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
        color={selectedCategory === 'all' ? 'primary' : 'default'}
        label={t('templates.filter.all', 'All')}
        onClick={() => onCategoryChange('all')}
        sx={{ 
          borderRadius: 1,
          '& .MuiChip-label': { px: 1.5 },
        }}
      />
      
      {categories.map((category) => (
        <Chip
          key={category.id}
          clickable
          variant={selectedCategory === category.id ? 'filled' : 'outlined'}
          color={selectedCategory === category.id ? 'primary' : 'default'}
          label={t(`templates.categories.${category.id}`, category.name)}
          icon={
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <Iconify icon={category.icon} width={16} height={16} />
            </Box>
          }
          onClick={() => onCategoryChange(category.id)}
          sx={{ 
            borderRadius: 1,
            '& .MuiChip-label': { px: 1.5 },
          }}
        />
      ))}
    </Stack>
  );
}