import type { Store } from 'src/types/store';

import { useState, useCallback } from 'react';

import Pagination from '@mui/material/Pagination';
import { Box, Grid, Button, Typography } from '@mui/material';

import { _posts } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { StoreItem } from './store-item';
import { PostSort } from '../blog/post-sort';
import { PostSearch } from '../blog/post-search';

const stores: Store[] = [
  {
    id: "1",
    name: "WordPress",
    url: "https://itClevers.com",
    logo: "/placeholder.svg",
    isConnected : true,
    articlesCount: 42,
    lastUpdated: "2023-05-15",
    performance: {
      visitors: 15000,
      sales: 500,
      revenue: 25000,
    },
  },
  // Add more dummy stores here...
]


// ----------------------------------------------------------------------

export function StoresView() {
  
  const [sortBy, setSortBy] = useState('latest');
  
  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);
  
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Blog
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New post
        </Button>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <PostSearch posts={_posts} />
        <PostSort
          sortBy={sortBy}
          onSort={handleSort}
          options={[
            { value: 'latest', label: 'Latest' },
            { value: 'popular', label: 'Popular' },
            { value: 'oldest', label: 'Oldest' },
          ]}
        />
      </Box>
    
      <Grid container spacing={3}>
        {stores.map((store, index) => (
            <Grid key={store.id} xs={12}>
              <StoreItem  store={store}/>
            </Grid>
          ))}
      </Grid>
    
      <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} />
    </DashboardContent>
  );
}
