import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  emptyText?: string;
  chart: {
    colors?: string[];
    series: {
      label: string;
      value: number;
    }[];
    options?: ChartOptions;
  };
};

export function AnalyticsCurrentVisits({
  title,
  subheader,
  chart,
  emptyText = 'No data available',
  ...other
}: Props) {
  const theme = useTheme();

  const chartSeries = chart.series.map((item) => item.value);

  const isDarkMode = theme.palette.mode === 'dark';

  // Use more vibrant colors in dark mode
  const chartColors = chart.colors ?? (
    isDarkMode ? [
      '#6366F1', // Indigo
      '#F59E0B', // Amber
      '#10B981', // Emerald
      '#EF4444', // Red
    ] : [
      theme.palette.primary.main,
      theme.palette.warning.main,
      theme.palette.secondary.dark,
      theme.palette.error.main,
    ]
  );

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: chart.series.map((item) => item.label),
    stroke: { width: 0 },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `${seriesName}` },
      },
    },
    plotOptions: { pie: { donut: { labels: { show: false } } } },
    ...chart.options,
  });

  return (
    <Card
      {...other}
      sx={{
        transition: 'all 0.3s ease-in-out',
        boxShadow: isDarkMode ? `0 8px 16px 0 ${theme.palette.common.black}20` : theme.customShadows.card,
        ...(isDarkMode && {
          backgroundImage: 'none',
          backgroundColor: theme.palette.background.paper,
          backdropFilter: 'blur(8px)'
        }),
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isDarkMode
            ? `0 12px 20px 0 ${theme.palette.common.black}30`
            : theme.customShadows.z12,
        },
      }}
    >
      <CardHeader
        title={title}
        subheader={subheader}
        sx={{
          '& .MuiCardHeader-title': {
            color: isDarkMode ? theme.palette.grey[100] : 'inherit',
            fontWeight: 600
          },
          '& .MuiCardHeader-subheader': {
            color: isDarkMode ? theme.palette.grey[500] : 'inherit'
          }
        }}
      />

      {chartSeries.length === 0 || chartSeries.every(value => value === 0) ? (
        <Box
          sx={{
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            p: 5,
          }}
        >
          <Iconify
            icon="mdi:web-off"
            width={60}
            height={60}
            sx={{
              mb: 3,
              color: isDarkMode ? alpha(theme.palette.primary.main, 0.6) : theme.palette.primary.light,
              opacity: 0.8,
            }}
          />
          <Typography
            variant="body1"
            sx={{
              color: isDarkMode ? theme.palette.grey[400] : theme.palette.text.secondary,
              textAlign: 'center',
              maxWidth: 250,
            }}
          >
            {emptyText}
          </Typography>
        </Box>
      ) : (
        <>
          <Chart
            type="pie"
            series={chartSeries}
            options={chartOptions}
            width={{ xs: 240, xl: 260 }}
            height={{ xs: 240, xl: 260 }}
            sx={{
              my: 6,
              mx: 'auto',
              filter: isDarkMode ? 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))' : 'none'
            }}
          />

          <Divider sx={{
            borderStyle: 'dashed',
            borderColor: isDarkMode ? theme.palette.grey[700] : 'inherit'
          }} />

          <ChartLegends
            labels={chartOptions?.labels}
            colors={chartOptions?.colors}
            sx={{
              p: 3,
              justifyContent: 'center',
              '& .MuiTypography-root': {
                color: isDarkMode ? theme.palette.grey[300] : 'inherit'
              }
            }}
          />
        </>
      )}
    </Card>
  );
}
