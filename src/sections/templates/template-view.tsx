import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
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
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { type Template, PARENT_TEMPLATES, TEMPLATE_CATEGORIES } from 'src/utils/templateUtils';

import { DashboardContent } from 'src/layouts/dashboard';
import { useCreateArticleMutation } from 'src/services/apis/articlesApi';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';

import { Iconify } from 'src/components/iconify';
import { TemplatePreviewModal } from 'src/components/templates/TemplatePreviewModal';

import { TemplateFilter } from './components/template-filter';
import { TemplateEmptyState } from './components/template-empty-state';
import { ParentTemplateCard } from './components/parent-template-card-new';

// ----------------------------------------------------------------------

export function TemplateView() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');
  const [openModal, setOpenModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // API hooks
  const [createArticle] = useCreateArticleMutation();

  // Filter parent templates based on search query and selected category
  const filteredTemplates = PARENT_TEMPLATES.filter((template) => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.name.toLowerCase().includes(searchQuery.toLowerCase());

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

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTemplate(null);
  };

  // Fetch articles and filter drafts
  const currentStore = useSelector(selectCurrentStore);
  const storeId = currentStore?.id || 1;

  // Handle template generation - create article and navigate to /generate
  const handleGenerateWithTemplate = async (templateId: string) => {
    setIsGenerating(true);

    try {
        await createArticle({
          title: 'Untitled Article',
          content: '',
          meta_description: '',
          keywords: [],
          status: 'draft',
          website_id: storeId.toString(), // Use actual store ID instead of undefined
        }).unwrap();

      // Store template selection in localStorage for the generate page
      localStorage.setItem('selectedTemplate', templateId);
      localStorage.setItem('isNewArticle', 'true');

      // Navigate to generate page with the new article ID
      navigate(`/generate?template=${templateId}`);

      toast.success(t('templates.articleCreated', 'Article created! Starting with your selected template.'));

    } catch (error) {
      toast.error(t('templates.createError', 'Failed to create article. Please try again.'));
    } finally {
      setIsGenerating(false);
      setOpenModal(false);
      setSelectedTemplate(null);
    }
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
            onClick={() => navigate('/create')}
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
            {filteredTemplates.map((parentTemplate) => (
              <Grid key={parentTemplate.parent_id} xs={12} sm={6} md={4}>
                <ParentTemplateCard
                  parentTemplate={parentTemplate}
                  onSelect={(childTemplateId) => handleGenerateWithTemplate(childTemplateId)}
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

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        open={openModal}
        onClose={handleCloseModal}
        onGenerate={handleGenerateWithTemplate}
        template={selectedTemplate}
        isGenerating={isGenerating}
      />
    </DashboardContent>
  );
}