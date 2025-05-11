import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Card,
  Chip,
  alpha,
  Button,
  useTheme,
  Typography,
  CardContent
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { AnalyticsOrderTable } from '../analytics-order-table';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

// Generate Content Card Component
function GenerateContentCard() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleNavigateToGenerate = () => {
    navigate('/generate');
  };

  // Content generation benefits
  const benefits = [
    {
      icon: 'mdi:search-web',
      title: t('generate.benefits.seo', 'SEO Optimized'),
      description: t('generate.benefits.seoDesc', 'Content that ranks well in search engines')
    },
    {
      icon: 'mdi:clock-time-four-outline',
      title: t('generate.benefits.fast', 'Save Time'),
      description: t('generate.benefits.fastDesc', 'Create articles in minutes, not hours')
    }
  ];

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: theme.shadows[3],
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.8)}, ${alpha(theme.palette.background.paper, 0.9)})`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(theme.palette.background.paper, 0.9)})`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: alpha(theme.palette.primary.main, 0.1),
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: alpha(theme.palette.secondary.main, 0.1),
          zIndex: 0,
        }}
      />

      {/* Main content */}
      <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 2, md: 3 } }}>
        <Grid container spacing={3} alignItems="center">
          {/* Left side - Text content */}
          <Grid xs={12} md={7} sx={{ order: { xs: 2, md: 1 } }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}
              >
                {t('generate.startCreating', 'Supercharge Your Content Creation')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {t('generate.description', 'Our AI-powered platform helps you create high-quality, engaging content in minutes. Perfect for blogs, websites, and social media.')}
              </Typography>
            </Box>

            {/* Benefits */}
            <Box sx={{ mb: 3 }}>
              {benefits.map((benefit, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.light, 0.05),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      mr: 2,
                      p: 1.5,
                      borderRadius: 1.5,
                      background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.primary.main, 0.2)
                        : alpha(theme.palette.primary.lighter || theme.palette.primary.light, 0.3),
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 40,
                      minHeight: 40
                    }}
                  >
                    <Iconify icon={benefit.icon} width={22} height={22} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* CTA Button */}
            <Button
              variant="contained"
              size="large"
              color="primary"
              startIcon={<Iconify icon="mdi:rocket-launch" width={20} />}
              onClick={handleNavigateToGenerate}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                boxShadow: theme.shadows[4],
                '&:hover': {
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s',
              }}
            >
              {t('generate.createNow', 'Start Creating Now')}
            </Button>
          </Grid>

          {/* Right side - Illustration */}
          <Grid xs={12} md={5} sx={{ order: { xs: 1, md: 2 } }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                p: 2
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '15%',
                  left: '5%',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: theme.palette.background.paper,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                  animation: 'pulse 3s ease-in-out 1.5s infinite',
                  zIndex: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify icon="mdi:lightning-bolt" width={18} height={18} sx={{ color: theme.palette.warning.main, mr: 0.8 }} />
                  <Typography variant="body2" fontWeight="bold" sx={{ color: theme.palette.warning.main }}>AI Powered</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}

// Coming Soon Features Card Component
function ComingSoonCard() {
  const { t } = useTranslation();
  const theme = useTheme();

  const features = [
    {
      icon: 'mdi:content-paste',
      title: t('comingSoon.features.templates.title', 'Built-in Templates'),
      description: t('comingSoon.features.templates.description', 'Create articles from pre-designed templates for various content types'),
      eta: t('comingSoon.eta.soon', 'Coming soon')
    },
    {
      icon: 'mdi:file-multiple-outline',
      title: t('comingSoon.features.bulk.title', 'Bulk Generation'),
      description: t('comingSoon.features.bulk.description', 'Generate multiple articles in a single batch to save time'),
      eta: t('comingSoon.eta.soon', 'Coming soon')
    },
  ];

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: theme.shadows[3],
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Iconify
            icon="mdi:rocket-launch"
            width={28}
            height={28}
            sx={{
              color: theme.palette.info.main,
              mr: 1.5
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {t('comingSoon.title', 'Coming Soon')}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('comingSoon.description', 'We\'re constantly improving our platform. Here\'s what\'s coming next:')}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                background: alpha(theme.palette.background.default, 0.5),
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: theme.shadows[2],
                  transform: 'translateY(-2px)',
                  borderColor: theme.palette.primary.light,
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    background: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mr: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Iconify icon={feature.icon} width={20} height={20} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Chip
                      label={feature.eta}
                      size="small"
                      color="info"
                      variant="outlined"
                      sx={{ height: 24, fontSize: '0.7rem' }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export function OverviewAnalyticsView() {
  const { t } = useTranslation();

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <DashboardContent maxWidth="xl">
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
          color: isDarkMode ? 'common.white' : 'inherit',
          textShadow: isDarkMode ? '0 0 10px rgba(255, 255, 255, 0.2)' : 'none',
          display: 'flex',
          alignItems: 'center',
          '& .emoji': {
            display: 'inline-block',
            ml: 1,
            animation: 'wave 1.8s infinite',
            transformOrigin: '70% 70%',
            '@keyframes wave': {
              '0%': { transform: 'rotate(0deg)' },
              '10%': { transform: 'rotate(14deg)' },
              '20%': { transform: 'rotate(-8deg)' },
              '30%': { transform: 'rotate(14deg)' },
              '40%': { transform: 'rotate(-4deg)' },
              '50%': { transform: 'rotate(10deg)' },
              '60%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(0deg)' },
            }
          }
        }}
      >
        {t('analytics.welcome', 'Hi, Welcome back xBlogger')}<span className="emoji">👋</span>
      </Typography>

      <Grid container spacing={3}>
        {/* Supercharge Your Content Creation and Coming Soon in the same row */}
        <Grid xs={12} md={6} lg={6}>
          <GenerateContentCard />
        </Grid>

        {/* Coming Soon Features - Placed next to Generate Content */}
        <Grid xs={12} md={6} lg={6}>
          <ComingSoonCard />
        </Grid>

        {/* Key Metrics Row - Condensed and moved after promotional content */}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={t('analytics.articlesGenerated', 'Articles Generated')}
            percent={8.5}
            total={42}
            icon={<Iconify icon="mdi:file-document-edit-outline" width={48} height={48} />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={t('analytics.scheduledArticles', 'Scheduled Articles')}
            percent={16.7}
            total={14}
            color="warning"
            icon={<Iconify icon="mdi:calendar-clock" width={48} height={48} />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={t('analytics.regenerationsAvailable', 'Regenerations Available')}
            percent={-5.2}
            total={24}
            color="info"
            icon={<Iconify icon="mdi:autorenew" width={48} height={48} />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={t('analytics.totalWebsites', 'Connected Websites')}
            percent={12.5}
            total={8}
            color="secondary"
            icon={<Iconify icon="mdi:web" width={48} height={48} />}
          />
        </Grid>

        {/* Detailed Analytics Section - Moved to bottom as supplementary information */}
        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title={t('analytics.websiteIntegrations', 'Website Integrations')}
            subheader={t('analytics.websiteIntegrationsSubheader', 'Distribution by platform')}
            chart={{
              colors: [
                '#0073aa', // WordPress blue
                '#96bf48', // Shopify green
                '#faad4d', // Wix orange
                '#7d7d7d', // Other platforms gray
              ],
              series: [
                { label: t('platforms.wordpress', 'WordPress'), value: 65 },
                { label: t('platforms.shopify', 'Shopify'), value: 20 },
                { label: t('platforms.wix', 'Wix'), value: 12 },
                { label: t('platforms.other', 'Other'), value: 3 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsOrderTable
            title={t('analytics.purchaseHistory', 'Purchase History')}
            subheader={t('analytics.purchaseHistorySubheader', 'Recent subscription activity')}
            list={[
              {
                id: '1',
                title: t('analytics.purchases.premium', 'Premium Plan Subscription'),
                type: 'order1',
                status: 'completed',
                time: new Date().getTime() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
              },
              {
                id: '2',
                title: t('analytics.purchases.regenerationCredits', 'Purchased 50 Regeneration Credits'),
                type: 'order2',
                status: 'completed',
                time: new Date().getTime() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
              },
              {
                id: '3',
                title: t('analytics.purchases.starter', 'Starter Plan Subscription'),
                type: 'order3',
                status: 'completed',
                time: new Date().getTime() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
              },
              {
                id: '4',
                title: t('analytics.purchases.trial', 'Free Trial Started'),
                type: 'order4',
                status: 'completed',
                time: new Date().getTime() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
              },
            ]}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
