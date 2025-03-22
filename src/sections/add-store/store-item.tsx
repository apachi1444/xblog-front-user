import type { Store } from 'src/types/store';

import { Link } from 'react-router-dom';

import { Box, Grid, Card, Badge, Avatar, Container, Typography, CardContent } from '@mui/material';

interface StoreItemProps {
  store: Store;
}

export function StoreItem({ store }: StoreItemProps) {
  return (
    <Link to="/stores/store">
      <Card variant="outlined" sx={{ transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
        <CardContent>
          {/* Store Header */}
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center">
              <Avatar src={store.logo || '/placeholder.svg'} alt={`${store.name} logo`} sx={{ width: 48, height: 48, mr: 2 }} />
              <Box>
                <Typography variant="h6">{store.name}</Typography>
                <Typography variant="body2" color="textSecondary">{store.url}</Typography>
              </Box>
            </Box>
            {/* Connection Status Indicator */}
            <Badge
              badgeContent={store.isConnected ? 'Online' : 'Offline'}
              color={store.isConnected ? 'primary' : 'error'}
              sx={{
                '& .MuiBadge-badge': {
                  right: -8,
                  top: 13,
                  border: `2px solid ${store.isConnected ? '#4caf50' : '#f44336'}`,
                  padding: '0 4px'
                }
              }}
            />
          </Box>
          {/* Store Statistics */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Articles</Typography>
              <Typography variant="subtitle1">{store.articlesCount}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Last Updated</Typography>
              <Typography variant="subtitle1">{store.lastUpdated}</Typography>
            </Grid>
          </Grid>
          {/* Performance Section */}
          <Box borderTop={1} borderColor="divider" pt={2}>
            <Typography variant="body2" gutterBottom>Performance (Last 30 days)</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="caption" color="textSecondary">Visitors</Typography>
                <Typography variant="body2">{store.performance.visitors.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="textSecondary">Sales</Typography>
                <Typography variant="body2">{store.performance.sales.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="textSecondary">Revenue</Typography>
                <Typography variant="body2">${store.performance.revenue.toLocaleString()}</Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}

export function StoreContainer({ stores }: { stores: Store[] }) {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Your Stores</Typography>
      <Grid container spacing={3}>
        {stores.map((store) => (
          <Grid item xs={12} md={6} lg={4} key={store.id}>
            <StoreItem store={store} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
