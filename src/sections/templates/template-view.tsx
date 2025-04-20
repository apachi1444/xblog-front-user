import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { TemplateCard } from './components/template-card';
import { TemplateFilter } from './components/template-filter';
import { TemplateEmptyState } from './components/template-empty-state';
import { ARTICLE_TEMPLATES, TEMPLATE_CATEGORIES } from './template-data';

// ----------------------------------------------------------------------

export function TemplateView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');
  
  // Filter templates based on search query and selected category
  const filteredTemplates = ARTICLE_TEMPLATES.filter((template) => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    const matchesTab = currentTab === 'all' || 
                      (currentTab === 'popular' && template.popular) ||
                      (currentTab === 'new' && template.isNew);
    
    return matchesSearch && matchesCategory && matchesTab;
  });
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };
  
  const handleTemplateSelect = (templateId: string) => {
    // Navigate to generate page with template ID
    navigate(`/generate?template=${templateId}`);
  };
  
  return (
    <DashboardContent>
      <Container maxWidth={false}>
        {/* Header */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          sx={{ mb: 5 }}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              {t('templates.title', 'Article Templates')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('templates.subtitle', 'Choose from our SEO-optimized templates to create high-quality content')}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:lightning-bolt" />}
            onClick={() => navigate('/generate')}
          >
            {t('templates.createFromScratch', 'Create from Scratch')}
          </Button>
        </Stack>
        
        {/* Search and Filter */}
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={2} 
          alignItems={{ xs: 'stretch', md: 'center' }}
          sx={{ mb: 4 }}
        >
          <TextField
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t('templates.searchPlaceholder', 'Search templates...')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: { md: 280 } }}
          />
          
          <TemplateFilter 
            categories={TEMPLATE_CATEGORIES}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </Stack>
        
        {/* Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
              borderRadius: 1,
              '& .MuiTab-root': { minWidth: 100 },
            }}
          >
            <Tab 
              value="all" 
              label={t('templates.tabs.all', 'All')} 
              iconPosition="start"
              icon={<Iconify icon="mdi:view-grid" width={20} height={20} />}
            />
            <Tab 
              value="popular" 
              label={t('templates.tabs.popular', 'Popular')} 
              iconPosition="start"
              icon={<Iconify icon="mdi:fire" width={20} height={20} />}
            />
            <Tab 
              value="new" 
              label={t('templates.tabs.new', 'New')} 
              iconPosition="start"
              icon={<Iconify icon="mdi:star" width={20} height={20} />}
            />
          </Tabs>
        </Box>
        
        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <Grid container spacing={3}>
            {filteredTemplates.map((template) => (
              <Grid key={template.id} xs={12} sm={6} md={4}>
                <TemplateCard 
                  template={template} 
                  onSelect={() => handleTemplateSelect(template.id)} 
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <TemplateEmptyState 
            searchQuery={searchQuery}
            onClear={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setCurrentTab('all');
            }}
          />
        )}
      </Container>
    </DashboardContent>
  );
}