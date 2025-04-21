import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { TemplateCard } from './components/template-card';
import { PricingPlans } from './components/pricing-plans';
import { TemplateFilter } from './components/template-filter';
import { TemplateEmptyState } from './components/template-empty-state';
import { ARTICLE_TEMPLATES, TEMPLATE_CATEGORIES } from './template-data';

// ----------------------------------------------------------------------

export function TemplateView() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');
  const [openModal, setOpenModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  
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
  
  const handleTemplateSelect = (template: any) => {
    if (template.locked) {
      // Open modal for locked templates
      setSelectedTemplate(template);
      setOpenModal(true);
    } else {
      // Navigate to generate page with template ID
      navigate(`/generate?template=${template.id}`);
    }
  };
  
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  
  const handleUpgrade = (planId: string) => {
    // Handle upgrade logic here
    console.log(`Upgrading to plan: ${planId}`);
    setOpenModal(false);
    navigate(`/upgrade-license?plan=${planId}&template=${selectedTemplate?.id}`);
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
                  onSelect={() => handleTemplateSelect(template)} 
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

      {/* Premium Template Modal */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        {selectedTemplate && (
          <>
            <DialogTitle>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h5">
                  {t('templates.premiumTemplate', 'Premium Template')}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    bgcolor: 'primary.lighter', 
                    color: 'primary.main',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  <Iconify icon="mdi:crown" sx={{ mr: 0.5 }} />
                  <Typography variant="subtitle2">
                    {t('templates.premiumOnly', 'Premium Only')}
                  </Typography>
                </Box>
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid xs={12} md={5}>
                  <Box 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      borderRadius: 2,
                      bgcolor: 'background.neutral',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {selectedTemplate.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {selectedTemplate.description}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('templates.preview', 'Preview')}:
                      </Typography>
                      <Box 
                        sx={{ 
                          p: 2, 
                          borderRadius: 1, 
                          bgcolor: 'background.paper',
                          border: `1px dashed ${theme.palette.divider}`,
                          height: 200,
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <Typography variant="body2">
                          {selectedTemplate.previewContent || selectedTemplate.description}
                        </Typography>
                        
                        {/* Blur overlay */}
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            bottom: 0, 
                            left: 0, 
                            right: 0, 
                            height: '70%', 
                            background: 'linear-gradient(transparent, rgba(255,255,255,0.9))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                          }}
                        >
                          <Iconify icon="mdi:lock" sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                          <Typography variant="subtitle1" color="primary.main">
                            {t('templates.unlockToAccess', 'Unlock to access')}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mt: 'auto', pt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('templates.benefits', 'Benefits')}:
                      </Typography>
                      <Stack spacing={1}>
                        {['SEO-optimized', 'High conversion rate', 'Ready-to-use structure'].map((benefit, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify icon="mdi:check-circle" sx={{ color: 'success.main', mr: 1 }} />
                            <Typography variant="body2">{benefit}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid xs={12} md={7}>
                  <Typography variant="h6" gutterBottom>
                    {t('templates.choosePlan', 'Choose a plan to unlock this template')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {t('templates.unlockAllTemplates', 'Upgrade your plan to unlock all premium templates and more features')}
                  </Typography>
                  
                  <PricingPlans onSelectPlan={handleUpgrade} />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>
                {t('common.cancel', 'Cancel')}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DashboardContent>
  );
}