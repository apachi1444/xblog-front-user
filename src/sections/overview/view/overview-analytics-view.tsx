import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Card,
  Button,
  useTheme,
  Typography,
  CardContent,
  CircularProgress
} from '@mui/material';

import { useScheduledArticles } from 'src/hooks/useScheduledArticles';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetStoresQuery } from 'src/services/apis/storesApi';
import { useGetUserInvoicesQuery, useGetSubscriptionDetailsQuery, useGetSubscriptionPlansQuery, type Invoice } from 'src/services/apis/subscriptionApi';
import { generateInvoicePdf } from 'src/services/invoicePdfService';

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

  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        background: isDarkMode
          ? theme.palette.background.paper
          : theme.palette.common.white,
        border: `1px solid ${isDarkMode ? varAlpha(theme.palette.grey['500Channel'], 0.2) : varAlpha(theme.palette.grey['500Channel'], 0.15)}`,
        boxShadow: isDarkMode
          ? `0 8px 20px ${varAlpha(theme.palette.common.blackChannel, 0.4)}`
          : `0 4px 16px ${varAlpha(theme.palette.grey['500Channel'], 0.12)}`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: isDarkMode
            ? `0 12px 32px ${varAlpha(theme.palette.common.blackChannel, 0.5)}`
            : `0 8px 24px ${varAlpha(theme.palette.grey['500Channel'], 0.16)}`,
        },
      }}
    >
      {/* Subtle background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${varAlpha(theme.palette.primary.mainChannel, 0.03)}, transparent)`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -15,
          left: -15,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${varAlpha(theme.palette.secondary.mainChannel, 0.02)}, transparent)`,
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
                  fontWeight: 700,
                  mb: 1,
                  color: 'text.primary',
                  lineHeight: 1.2,
                }}
              >
                {t('generate.startCreating', 'Supercharge Your Content Creation')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                {t('generate.description', 'Our AI-powered platform helps you create high-quality, engaging content in minutes. Perfect for blogs, websites, and social media.')}
              </Typography>
            </Box>

            {/* Refined Benefits */}
            <Box sx={{ mb: 3 }}>
              {benefits.map((benefit, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1.5,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: isDarkMode
                      ? varAlpha(theme.palette.background.defaultChannel, 0.4)
                      : varAlpha(theme.palette.grey['50Channel'], 0.8),
                    border: `1px solid ${isDarkMode ? varAlpha(theme.palette.grey['500Channel'], 0.08) : varAlpha(theme.palette.grey['500Channel'], 0.05)}`,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: isDarkMode
                        ? varAlpha(theme.palette.background.defaultChannel, 0.6)
                        : varAlpha(theme.palette.grey['100Channel'], 0.8),
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      mr: 2,
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: isDarkMode
                        ? varAlpha(theme.palette.primary.mainChannel, 0.15)
                        : varAlpha(theme.palette.primary.mainChannel, 0.08),
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 44,
                      minHeight: 44
                    }}
                  >
                    <Iconify icon={benefit.icon} width={20} height={20} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      {benefit.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Refined CTA Button */}
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
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: isDarkMode
                  ? `0 4px 12px ${varAlpha(theme.palette.primary.mainChannel, 0.3)}`
                  : `0 4px 12px ${varAlpha(theme.palette.primary.mainChannel, 0.2)}`,
                '&:hover': {
                  boxShadow: isDarkMode
                    ? `0 8px 20px ${varAlpha(theme.palette.primary.mainChannel, 0.4)}`
                    : `0 8px 20px ${varAlpha(theme.palette.primary.mainChannel, 0.3)}`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease-in-out',
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
                  border: `1px solid ${varAlpha(theme.palette.warning.mainChannel, 0.3)}`,
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

// Premium Features Card Component
function PremiumFeaturesCard() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/upgrade-license');
  };

  const features = [
    {
      icon: 'mdi:text-box-check-outline',
      text: t('premium.features.unlimitedArticles', 'Unlimited article generation')
    },
    {
      icon: 'mdi:search-web',
      text: t('premium.features.seoTools', 'Advanced SEO optimization tools')
    },
    {
      icon: 'mdi:headset',
      text: t('premium.features.prioritySupport', 'Priority customer support')
    }
  ];

  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        background: isDarkMode
          ? `linear-gradient(135deg, ${varAlpha(theme.palette.primary.darkerChannel, 0.15)}, ${varAlpha(theme.palette.background.paperChannel, 0.95)})`
          : `linear-gradient(135deg, ${varAlpha(theme.palette.primary.mainChannel, 0.08)}, ${varAlpha(theme.palette.common.whiteChannel, 0.95)})`,
        border: `2px solid ${isDarkMode ? varAlpha(theme.palette.primary.mainChannel, 0.3) : varAlpha(theme.palette.primary.mainChannel, 0.2)}`,
        boxShadow: isDarkMode
          ? `0 8px 24px ${varAlpha(theme.palette.primary.mainChannel, 0.2)}, 0 4px 12px ${varAlpha(theme.palette.common.blackChannel, 0.3)}`
          : `0 6px 20px ${varAlpha(theme.palette.primary.mainChannel, 0.15)}, 0 2px 8px ${varAlpha(theme.palette.grey['500Channel'], 0.1)}`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: isDarkMode
            ? `0 12px 32px ${varAlpha(theme.palette.primary.mainChannel, 0.3)}, 0 8px 24px ${varAlpha(theme.palette.common.blackChannel, 0.4)}`
            : `0 10px 28px ${varAlpha(theme.palette.primary.mainChannel, 0.2)}, 0 8px 24px ${varAlpha(theme.palette.grey['500Channel'], 0.15)}`,
        },
      }}
    >
      {/* Refined Premium badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          display: 'flex',
          alignItems: 'center',
          bgcolor: isDarkMode
            ? varAlpha(theme.palette.warning.mainChannel, 0.15)
            : varAlpha(theme.palette.warning.mainChannel, 0.1),
          color: theme.palette.warning.main,
          borderRadius: 2,
          px: 1.5,
          py: 0.75,
          border: `1px solid ${varAlpha(theme.palette.warning.mainChannel, 0.2)}`,
        }}
      >
        <Iconify icon="mdi:crown" width={16} height={16} sx={{ color: theme.palette.warning.main, mr: 0.5 }} />
        <Typography variant="caption" fontWeight="bold" sx={{ color: theme.palette.warning.main }}>
          {t('premium.label', 'Pro Plan')}
        </Typography>
      </Box>

      {/* Subtle decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -15,
          right: -15,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${varAlpha(theme.palette.primary.mainChannel, 0.05)}, transparent)`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -20,
          left: '20%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${varAlpha(theme.palette.secondary.mainChannel, 0.03)}, transparent)`,
          zIndex: 0,
        }}
      />

      <CardContent sx={{ position: 'relative', zIndex: 1, p: 3, flexGrow: 1 }}>
        <Typography
          variant="h5"
          component="h3"
          fontWeight="bold"
          color="text.primary"
          sx={{ mb: 1, mt: 3 }}
        >
          {t('premium.title', 'Unlock Premium Features')}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, lineHeight: 1.6 }}
        >
          {t('premium.description', 'Upgrade to Pro and get unlimited articles, advanced SEO tools, and priority support.')}
        </Typography>

        <Box sx={{ mb: 3 }}>
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1.5,
                p: 1.5,
                borderRadius: 2,
                backgroundColor: isDarkMode
                  ? varAlpha(theme.palette.background.defaultChannel, 0.3)
                  : varAlpha(theme.palette.grey['50Channel'], 0.6),
                border: `1px solid ${isDarkMode ? varAlpha(theme.palette.grey['500Channel'], 0.05) : varAlpha(theme.palette.grey['500Channel'], 0.03)}`,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: isDarkMode
                    ? varAlpha(theme.palette.background.defaultChannel, 0.5)
                    : varAlpha(theme.palette.grey['100Channel'], 0.6),
                }
              }}
            >
              <Iconify
                icon={feature.icon}
                width={20}
                height={20}
                sx={{
                  color: theme.palette.primary.main,
                  mr: 1.5,
                }}
              />
              <Typography
                variant="body2"
                color="text.primary"
                sx={{ fontWeight: 500 }}
              >
                {feature.text}
              </Typography>
            </Box>
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={handleUpgrade}
          endIcon={<Iconify icon="mdi:arrow-right" />}
          fullWidth
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 600,
            textTransform: 'none',
            py: 1.5,
            borderRadius: 2,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
            boxShadow: isDarkMode
              ? `0 4px 12px ${varAlpha(theme.palette.primary.mainChannel, 0.3)}`
              : `0 4px 12px ${varAlpha(theme.palette.primary.mainChannel, 0.2)}`,
          }}
        >
          {t('premium.upgradeButton', 'Upgrade to Pro')}
        </Button>
      </CardContent>
    </Card>
  );
}

export function OverviewAnalyticsView() {
  const { t } = useTranslation();

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Fetch subscription details from API
  const { data: subscriptionDetails, isLoading: isLoadingSubscription } = useGetSubscriptionDetailsQuery();

  // Fetch stores data for platform distribution
  const { data: storesData } = useGetStoresQuery();

  // Fetch invoices data for purchase history
  const { data: invoicesData } = useGetUserInvoicesQuery();

  // Fetch subscription plans for plan names
  const { data: plansData } = useGetSubscriptionPlansQuery();

  const articles_limit = subscriptionDetails?.articles_limit || 0;

  // Handle PDF download for invoices
  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      await generateInvoicePdf(invoice, plansData);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Get scheduled articles count
  const { scheduledArticles } = useScheduledArticles('scheduled');

  // Calculate platform distribution
  const platformCounts = useMemo(() => {
    if (!storesData?.stores || storesData.stores.length === 0) {
      return {
        wordpress: 0,
        shopify: 0,
        wix: 0,
        other: 0
      };
    }

    const counts = {
      wordpress: 0,
      shopify: 0,
      wix: 0,
      other: 0
    };

    storesData.stores.forEach(store => {
      const platform = (store.platform || '').toLowerCase();
      if (platform.includes('wordpress')) {
        counts.wordpress += 1;
      } else if (platform.includes('shopify')) {
        counts.shopify += 1;
      } else if (platform.includes('wix')) {
        counts.wix += 1;
      } else {
        counts.other += 1;
      }
    });

    return counts;
  }, [storesData]);

  return (
    <DashboardContent
      maxWidth="xl"
      sx={{
        backgroundColor: isDarkMode
          ? varAlpha(theme.palette.background.defaultChannel, 0.4)
          : varAlpha(theme.palette.grey['50Channel'], 0.3),
        minHeight: '100vh',
        borderRadius: 0,
      }}
    >
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

      <Grid container spacing={4}>
        {isLoadingSubscription ? (
          // Show loading spinner in the center while data is being fetched
          <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <Grid xs={12} sm={6} md={3}>
              <AnalyticsWidgetSummary
                title={t('analytics.articlesGenerated', 'Articles Generated')}
                percent={
                  subscriptionDetails &&
                  subscriptionDetails.articles_created > 0 &&
                  subscriptionDetails.articles_limit > 0
                    ? Number(((subscriptionDetails.articles_created / subscriptionDetails.articles_limit) * 100).toFixed(1))
                    : 0
                }
                total={subscriptionDetails?.articles_created || 0}
                icon={<Iconify icon="mdi:file-document-edit-outline" width={48} height={48} />}
              />
            </Grid>

            {/* For scheduled articles, we use the scheduledArticles hook */}
            <Grid xs={12} sm={6} md={3}>
              <AnalyticsWidgetSummary
                title={t('analytics.scheduledArticles', 'Scheduled Articles')}
                percent={
                  scheduledArticles &&
                  scheduledArticles.length > 0 &&
                  articles_limit > 0
                    ? Number(((scheduledArticles.length / articles_limit) * 100).toFixed(1))
                    : 0
                }
                total={scheduledArticles?.length || 0}
                color="warning"
                icon={<Iconify icon="mdi:calendar-clock" width={48} height={48} />}
              />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <AnalyticsWidgetSummary
                title={t('analytics.regenerationsAvailable', 'Regenerations Available')}
                percent={
                  subscriptionDetails &&
                  subscriptionDetails.regeneration_number > 0 &&
                  subscriptionDetails.regeneration_limit > 0
                    ? Number(((subscriptionDetails.regeneration_number / subscriptionDetails.regeneration_limit) * 100).toFixed(1))
                    : 0
                }
                total={subscriptionDetails?.regeneration_number || 0}
                color="info"
                icon={<Iconify icon="mdi:autorenew" width={48} height={48} />}
              />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <AnalyticsWidgetSummary
                title={t('analytics.totalWebsites', 'Connected Websites')}
                percent={
                  subscriptionDetails &&
                  subscriptionDetails.connected_websites > 0 &&
                  subscriptionDetails.websites_limit > 0
                    ? Number(((subscriptionDetails.connected_websites / subscriptionDetails.websites_limit) * 100).toFixed(1))
                    : 0
                }
                total={subscriptionDetails?.connected_websites || 0}
                color="secondary"
                icon={<Iconify icon="mdi:web" width={48} height={48} />}
              />
            </Grid>
          </>
        )}

        {/* Section Divider */}
        <Grid xs={12} sx={{ my: 2 }}>
          <Box
            sx={{
              height: 1,
              background: isDarkMode
                ? `linear-gradient(90deg, transparent, ${varAlpha(theme.palette.grey['500Channel'], 0.2)}, transparent)`
                : `linear-gradient(90deg, transparent, ${varAlpha(theme.palette.grey['500Channel'], 0.15)}, transparent)`,
              mx: 2,
            }}
          />
        </Grid>

        {/* Supercharge Your Content Creation and Coming Soon in the same row */}
        <Grid xs={12} md={6} lg={6}>
          <GenerateContentCard />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <PremiumFeaturesCard />
        </Grid>

        {/* Section Divider */}
        <Grid xs={12} sx={{ my: 3 }}>
          <Box
            sx={{
              height: 1,
              background: isDarkMode
                ? `linear-gradient(90deg, transparent, ${varAlpha(theme.palette.grey['500Channel'], 0.2)}, transparent)`
                : `linear-gradient(90deg, transparent, ${varAlpha(theme.palette.grey['500Channel'], 0.15)}, transparent)`,
              mx: 2,
            }}
          />
        </Grid>

        {/* Detailed Analytics Section - Moved to bottom as supplementary information */}
        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title={t('analytics.websiteIntegrations', 'Website Integrations')}
            subheader={t('analytics.websiteIntegrationsSubheader', 'Distribution by platform')}
            emptyText={t('analytics.noWebsiteIntegrations', 'No website integrations yet. Connect your first website to see platform distribution.')}
            chart={{
              colors: [
                theme.palette.primary.main,
                theme.palette.secondary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
              ],
              series: [
                {
                  label: t('platforms.wordpress', 'WordPress'),
                  value: platformCounts.wordpress || 0
                },
                {
                  label: t('platforms.shopify', 'Shopify'),
                  value: platformCounts.shopify || 0
                },
                {
                  label: t('platforms.wix', 'Wix'),
                  value: platformCounts.wix || 0
                },
                {
                  label: t('platforms.other', 'Other'),
                  value: platformCounts.other || 0
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsOrderTable
            title={t('analytics.purchaseHistory', 'Purchase History')}
            subheader={t('analytics.purchaseHistorySubheader', 'Recent subscription activity')}
            emptyText={t('analytics.noPurchaseHistory', 'No billing history available yet. Your purchase records will appear here.')}
            onDownloadInvoice={handleDownloadInvoice}
            list={
              invoicesData?.invoices && invoicesData.invoices.length > 0
                ? invoicesData.invoices.map((invoice, index) => {
                    // Find the plan name from the plans data
                    const planDetails = plansData?.find(plan => plan.id === invoice.plan_id);
                    const planName = planDetails?.name || `Plan ID: ${invoice.plan_id}`;

                    return {
                      id: invoice.payment_id?.toString() || String(index + 1),
                      title: planName || 'Subscription Payment',
                      type: `order${index + 1}`,
                      status: invoice.status === 'paid' ? 'completed' : 'pending',
                      time: invoice.created_at ? new Date(invoice.created_at).getTime() : new Date().getTime(),
                      invoice, // Add invoice data for download
                    };
                  })
                : []
            }
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
