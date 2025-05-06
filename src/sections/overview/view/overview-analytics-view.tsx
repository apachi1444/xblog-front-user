import { useTranslation } from 'react-i18next';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { t } = useTranslation();

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        {t('analytics.welcome', 'Hi, Welcome back xBlogger👋')}
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={t('analytics.articlesGenerated', 'Articles Generated')}
            percent={8.5}
            total={42}
            icon={<Iconify icon="mdi:file-document-edit-outline" width={48} height={48} />}
            chart={{
              categories: [
                t('months.jan', 'Jan'),
                t('months.feb', 'Feb'),
                t('months.mar', 'Mar'),
                t('months.apr', 'Apr'),
                t('months.may', 'May'),
                t('months.jun', 'Jun'),
                t('months.jul', 'Jul'),
                t('months.aug', 'Aug')
              ],
              series: [5, 8, 12, 15, 20, 25, 32, 42],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={t('analytics.totalWebsites', 'Connected Websites')}
            percent={12.5}
            total={8}
            color="secondary"
            icon={<Iconify icon="mdi:web" width={48} height={48} />}
            chart={{
              categories: [
                t('months.jan', 'Jan'),
                t('months.feb', 'Feb'),
                t('months.mar', 'Mar'),
                t('months.apr', 'Apr'),
                t('months.may', 'May'),
                t('months.jun', 'Jun'),
                t('months.jul', 'Jul'),
                t('months.aug', 'Aug')
              ],
              series: [2, 3, 3, 4, 5, 6, 7, 8],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={t('analytics.regenerationsAvailable', 'Regenerations Available')}
            percent={-5.2}
            total={24}
            color="info"
            icon={<Iconify icon="mdi:autorenew" width={48} height={48} />}
            chart={{
              categories: [
                t('months.jan', 'Jan'),
                t('months.feb', 'Feb'),
                t('months.mar', 'Mar'),
                t('months.apr', 'Apr'),
                t('months.may', 'May'),
                t('months.jun', 'Jun'),
                t('months.jul', 'Jul'),
                t('months.aug', 'Aug')
              ],
              series: [50, 45, 38, 35, 32, 30, 28, 24],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={t('analytics.scheduledArticles', 'Scheduled Articles')}
            percent={16.7}
            total={14}
            color="warning"
            icon={<Iconify icon="mdi:calendar-clock" width={48} height={48} />}
            chart={{
              categories: [
                t('months.jan', 'Jan'),
                t('months.feb', 'Feb'),
                t('months.mar', 'Mar'),
                t('months.apr', 'Apr'),
                t('months.may', 'May'),
                t('months.jun', 'Jun'),
                t('months.jul', 'Jul'),
                t('months.aug', 'Aug')
              ],
              series: [4, 5, 7, 8, 9, 10, 12, 14],
            }}
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
          <AnalyticsOrderTimeline
            title={t('analytics.purchaseHistory', 'Purchase History')}
            subheader={t('analytics.purchaseHistorySubheader', 'Recent subscription activity')}
            list={[
              {
                id: '1',
                title: t('analytics.purchases.premium', 'Premium Plan Subscription'),
                type: 'order1',
                time: new Date().getTime() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
              },
              {
                id: '2',
                title: t('analytics.purchases.regenerationCredits', 'Purchased 50 Regeneration Credits'),
                type: 'order2',
                time: new Date().getTime() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
              },
              {
                id: '3',
                title: t('analytics.purchases.starter', 'Starter Plan Subscription'),
                type: 'order3',
                time: new Date().getTime() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
              },
              {
                id: '4',
                title: t('analytics.purchases.trial', 'Free Trial Started'),
                type: 'order4',
                time: new Date().getTime() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
              },
            ]}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
