import type { CardProps } from '@mui/material/Card';
import type { TimelineItemProps } from '@mui/lab/TimelineItem';

import { formatDate } from 'date-fns';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { alpha, useTheme } from '@mui/material/styles';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: {
    id: string;
    type: string;
    title: string;
    time: string | number | null;
    amount?: number;
    status?: 'active' | 'completed' | 'pending' | 'cancelled';
    description?: string;
    features?: string[];
  }[];
};

export function AnalyticsOrderTimeline({ title, subheader, list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Timeline
        sx={{
          m: 0,
          p: 3,
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {list.map((item, index) => (
          <Item key={item.id} item={item} lastItem={index === list.length - 1} />
        ))}
      </Timeline>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = TimelineItemProps & {
  lastItem: boolean;
  item: Props['list'][number];
};

function Item({ item, lastItem, ...other }: ItemProps) {
  const theme = useTheme();

  // Determine color based on type
  const dotColor =
    (item.type === 'order1' && 'primary') ||
    (item.type === 'order2' && 'success') ||
    (item.type === 'order3' && 'info') ||
    (item.type === 'order4' && 'warning') ||
    'error';

  // Determine status color and label
  const getStatusColor = (status?: string) => {
    switch(status) {
      case 'active': return theme.palette.success.main;
      case 'pending': return theme.palette.warning.main;
      case 'cancelled': return theme.palette.error.main;
      default: return theme.palette.success.main; // Default to completed
    }
  };

  const getStatusLabel = (status?: string) => {
    switch(status) {
      case 'active': return 'Active';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return 'Completed';
    }
  };

  return (
    <TimelineItem {...other}>
      <TimelineSeparator>
        <TimelineDot color={dotColor} />
        {lastItem ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent sx={{ pb: 3 }}>
        <Grid container spacing={1}>
          <Grid xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {item.title}
              </Typography>

              {item.status && (
                <Chip
                  label={getStatusLabel(item.status)}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.75rem',
                    color: getStatusColor(item.status),
                    bgcolor: alpha(getStatusColor(item.status), 0.1),
                    borderColor: alpha(getStatusColor(item.status), 0.2),
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              )}
            </Box>
          </Grid>

          <Grid xs={12}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              {formatDate(item.time || new Date(), 'dd MMM yyyy')}
            </Typography>
          </Grid>

          {item.description && (
            <Grid xs={12}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {item.description}
              </Typography>
            </Grid>
          )}

          {item.amount !== undefined && (
            <Grid xs={12}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 1,
                p: 1,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.04)
              }}>
                <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                  {fCurrency(item.amount)}
                </Typography>
              </Box>
            </Grid>
          )}

          {item.features && item.features.length > 0 && (
            <Grid xs={12}>
              <Box sx={{ mt: 1 }}>
                {item.features.map((feature, index) => (
                  <Typography
                    key={index}
                    variant="caption"
                    component="div"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text.secondary',
                      '&:before': {
                        content: '""',
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        bgcolor: 'text.disabled',
                        mr: 1
                      }
                    }}
                  >
                    {feature}
                  </Typography>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </TimelineContent>
    </TimelineItem>
  );
}
