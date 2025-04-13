import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

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
            percent={2.6}
            total={20}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
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
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={t('analytics.totalWebsites', 'Total Websites')}
            percent={-0.1}
            total={10}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
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
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={t('analytics.purchaseOrders', 'Purchase orders')}
            percent={2.8}
            total={1723315}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
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
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={t('analytics.messages', 'Messages')}
            percent={3.6}
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
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
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title={t('analytics.currentVisits', 'Current visits')}
            chart={{
              series: [
                { label: t('regions.america', 'America'), value: 3500 },
                { label: t('regions.asia', 'Asia'), value: 2500 },
                { label: t('regions.europe', 'Europe'), value: 1500 },
                { label: t('regions.africa', 'Africa'), value: 500 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title={t('analytics.websiteVisits', 'Website visits')}
            subheader={t('analytics.websiteVisitsSubheader', '(+43%) than last year')}
            chart={{
              categories: [
                t('months.jan', 'Jan'), 
                t('months.feb', 'Feb'), 
                t('months.mar', 'Mar'), 
                t('months.apr', 'Apr'), 
                t('months.may', 'May'), 
                t('months.jun', 'Jun'), 
                t('months.jul', 'Jul'), 
                t('months.aug', 'Aug'), 
                t('months.sep', 'Sep')
              ],
              series: [
                { name: t('analytics.teamA', 'Team A'), data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: t('analytics.teamB', 'Team B'), data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title={t('analytics.conversionRates', 'Conversion rates')}
            subheader={t('analytics.conversionRatesSubheader', '(+43%) than last year')}
            chart={{
              categories: [
                t('countries.italy', 'Italy'), 
                t('countries.japan', 'Japan'), 
                t('countries.china', 'China'), 
                t('countries.canada', 'Canada'), 
                t('countries.france', 'France')
              ],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title={t('analytics.orderTimeline', 'Order timeline')} list={_timeline} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite
            title={t('analytics.trafficBySite', 'Traffic by site')}
            list={[
              { value: 'facebook', label: 'Facebook', total: 323234 },
              { value: 'google', label: 'Google', total: 341212 },
              { value: 'linkedin', label: 'Linkedin', total: 411213 },
              { value: 'twitter', label: 'Twitter', total: 443232 },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title={t('analytics.tasks', 'Tasks')} list={_tasks} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
