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
import { TemplateFilter } from './components/template-filter';
import { TemplateEmptyState } from './components/template-empty-state';
import { ARTICLE_TEMPLATES, TEMPLATE_CATEGORIES } from './template-data';

// ----------------------------------------------------------------------

// Feature flag to control whether the Templates feature is locked or available
const IS_FEATURE_LOCKED = true;

export function TemplateView() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');
  const [openModal, setOpenModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [notifyRequested, setNotifyRequested] = useState(false);

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


  const handlePreviewTemplate = () => {
    // Toggle the full preview display
    setShowFullPreview(true);
  };

  const handleClosePreview = () => {
    setShowFullPreview(false);
  };

  const handleUpgrade = (planId: string) => {
    // Handle upgrade logic here
    console.log(`Upgrading to plan: ${planId}`);
    setOpenModal(false);
    navigate(`/upgrade-license?plan=${planId}&template=${selectedTemplate?.id}`);
  };

  const handleNotifyMe = () => {
    setNotifyRequested(true);
    // Here you would typically send a request to the server to add the user to a notification list
    setTimeout(() => {
      setNotifyRequested(false);
    }, 3000);
  };

  // Render the locked state UI
  const renderLockedState = () => (
    <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <Iconify
          icon="mdi:file-document-outline"
          width={80}
          height={80}
          sx={{
            color: 'primary.main',
            opacity: 0.6,
          }}
        />
      </Box>

      <Typography variant="h4" gutterBottom>
        {t('templates.coming_soon', 'Coming Soon!')}
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto' }}>
        {t('templates.locked_message', 'Templates feature is currently in development and will be available soon. Stay tuned for updates!')}
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
        {t('templates.unlock_message', 'This feature will be available in the next update. Thank you for your patience!')}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Iconify icon={notifyRequested ? "mdi:check" : "mdi:bell"} />}
        onClick={handleNotifyMe}
        disabled={notifyRequested}
        sx={{ px: 3, py: 1 }}
      >
        {notifyRequested
          ? t('common.success', 'Success!')
          : t('templates.notify_me', 'Notify Me When Available')}
      </Button>
    </Box>
  );

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

        {/* Render either the locked state or the actual templates UI */}
        {IS_FEATURE_LOCKED ? (
          renderLockedState()
        ) : (
          <>
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
          </>
        )}
      </Container>

      {/* Premium Template Modal - Updated UI */}
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
                  {selectedTemplate.title}
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
              <Box sx={{ p: 2 }}>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {selectedTemplate.description}
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {t('templates.preview', 'Preview')}:
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: 'background.neutral',
                      border: `1px solid ${theme.palette.divider}`,
                      minHeight: 300,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {showFullPreview ? (
                      // Full preview content
                      <Box>
                        <Box sx={{ mb: 3, textAlign: 'right' }}>
                          <Button
                            size="small"
                            color="primary"
                            startIcon={<Iconify icon="mdi:close" />}
                            onClick={handleClosePreview}
                          >
                            {t('common.close', 'Close Preview')}
                          </Button>
                        </Box>

                        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                          {selectedTemplate.title}
                        </Typography>

                        <Typography variant="subtitle1" gutterBottom>
                          Introduction
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {selectedTemplate.previewContent ||
                            `This is a comprehensive template that will help you create engaging content that ranks well in search engines.
                            The structure is designed to maximize reader engagement and conversion rates.`}
                        </Typography>

                        <Typography variant="subtitle1" gutterBottom>
                          Main Sections
                        </Typography>
                        <Box component="ul" sx={{ pl: 2 }}>
                          {['Problem Statement', 'Solution Overview', 'Key Benefits', 'Implementation Steps', 'Case Studies', 'Conclusion'].map((section, index) => (
                            <Box component="li" key={index} sx={{ mb: 1 }}>
                              <Typography variant="body2">
                                <strong>{section}</strong>: {index % 2 === 0 ?
                                  'This section helps establish context and relevance for your readers.' :
                                  'This section provides valuable insights and actionable information.'}
                              </Typography>
                            </Box>
                          ))}
                        </Box>

                        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: `1px dashed ${theme.palette.primary.main}` }}>
                          <Typography variant="subtitle2" color="primary.main" gutterBottom>
                            <Iconify icon="mdi:lightbulb" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                            Pro Tip
                          </Typography>
                          <Typography variant="body2">
                            This template includes SEO-optimized headings and content structure that has been proven to increase engagement by up to 43% in our tests.
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      // Blurred preview with button
                      <>
                        <Typography variant="body2">
                          {selectedTemplate.previewContent || selectedTemplate.description}
                        </Typography>

                        {/* Blur overlay with eye icon */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(transparent, rgba(255,255,255,0.9))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Iconify icon="mdi:eye" />}
                            onClick={handlePreviewTemplate}
                            sx={{
                              mb: 2,
                              boxShadow: theme.customShadows.z8,
                            }}
                          >
                            {t('templates.viewPreview', 'View Preview')}
                          </Button>
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>

                {!showFullPreview && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {t('templates.benefits', 'Benefits')}:
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {['SEO-optimized', 'High conversion rate', 'Ready-to-use structure', 'Time-saving'].map((benefit, index) => (
                        <Grid key={index} xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify
                              icon="mdi:check-circle"
                              sx={{
                                color: 'success.main',
                                mr: 1,
                                fontSize: 20,
                              }}
                            />
                            <Typography variant="body2">{benefit}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                onClick={handleCloseModal}
                color="inherit"
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mdi:shopping-cart" />}
                onClick={() => {
                  handleUpgrade('premium');
                }}
              >
                {t('templates.continueToPurchase', 'Continue to Purchase')}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </DashboardContent>
  );
}