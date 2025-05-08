import { useTranslation } from 'react-i18next';

import { useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { AnalyticsOrderTable } from '../analytics-order-table';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

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
            title={t('analytics.totalWebsites', 'Connected Websites')}
            percent={12.5}
            total={8}
            color="secondary"
            icon={<Iconify icon="mdi:web" width={48} height={48} />}
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
            title={t('analytics.scheduledArticles', 'Scheduled Articles')}
            percent={16.7}
            total={14}
            color="warning"
            icon={<Iconify icon="mdi:calendar-clock" width={48} height={48} />}
          />
        </Grid>

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
