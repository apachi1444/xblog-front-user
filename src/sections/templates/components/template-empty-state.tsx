import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface TemplateEmptyStateProps {
  searchQuery: string;
  onClear: () => void;
}

export function TemplateEmptyState({ searchQuery, onClear }: TemplateEmptyStateProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  
  return (
    <Box 
      sx={{ 
        py: 10,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        component="img"
        src="/assets/illustrations/illustration_empty_content.svg"
        sx={{ height: 240, mb: 3 }}
      />
      
      <Typography variant="h5" gutterBottom>
        {searchQuery
          ? t('templates.emptyState.noResults', 'No templates found')
          : t('templates.emptyState.noTemplates', 'No templates available')}
      </Typography>
      
      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 480, mx: 'auto', mb: 4 }}>
        {searchQuery
          ? t(
              'templates.emptyState.tryDifferentSearch',
              'We couldn\'t find any templates matching your search. Try different keywords or clear your filters.'
            )
          : t(
              'templates.emptyState.checkBack',
              'We\'re constantly adding new templates. Check back soon or create content from scratch.'
            )}
      </Typography>
      
      {searchQuery && (
        <Button
          color="primary"
          onClick={onClear}
          startIcon={<Iconify icon="mdi:refresh" />}
        >
          {t('templates.emptyState.clearFilters', 'Clear Filters')}
        </Button>
      )}
    </Box>
  );
}