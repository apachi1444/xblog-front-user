
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import InputAdornment from '@mui/material/InputAdornment';

import { DashboardContent } from 'src/layouts/dashboard';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';
import { useGetArticlesQuery, useCreateArticleMutation } from 'src/services/apis/articlesApi';

import { Iconify } from 'src/components/iconify';
import { LoadingSpinner } from 'src/components/loading';

import { PostItem } from '../post-item';
import { DraftItem } from '../draft-item';

// ----------------------------------------------------------------------

export function BlogView() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const currentStore = useSelector(selectCurrentStore);
  const storeId = currentStore?.id || 1;
  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    refetch: refetchArticles,
  } = useGetArticlesQuery(
    { store_id: storeId },
    {
      // Ensure the query runs immediately when component mounts
      refetchOnMountOrArgChange: true,
      // Skip the query only if storeId is null/undefined (not if it's 0 or 1)
      skip: !storeId && storeId !== 0,
    }
  );

  const [createArticle, { isLoading: isCreatingArticle }] = useCreateArticleMutation();

  const articles = useMemo(() => articlesData?.articles || [], [articlesData]);

  // Ensure articles are fetched when component mounts
  useEffect(() => {
    // If we have a valid storeId and no articles data yet, trigger refetch
    if (storeId && !articlesData && !isLoadingArticles) {
      console.log('🔄 Triggering articles fetch for store:', storeId);
      refetchArticles();
    }
  }, [storeId, articlesData, isLoadingArticles, refetchArticles]);

  // Combine articles and drafts
  const allPosts = useMemo(() => {
    const combinedPosts = [
      ...articles,

    ];
    return combinedPosts;
  }, [articles]);

  useEffect(() => {
    let sorted = [...allPosts];

    // Apply search filter
    if (searchQuery) {
      sorted = sorted.filter(post =>
        post?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (currentTab !== 'all') {
      sorted = sorted.filter(post => post.status.toLowerCase() === currentTab.toLowerCase());
    }

    // Apply sorting
    switch (sortBy) {
      case 'latest':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      default:
        break;
    }

    setFilteredPosts(sorted);
  }, [allPosts, sortBy, searchQuery, currentTab]);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleNewArticle = async () => {
    navigate('/create');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const notFound = !filteredPosts.length;
  const isDataEmpty = allPosts.length === 0;
  const isLoading = isLoadingArticles;

  // Pagination
  const postsPerPage = 8;
  const paginatedPosts = filteredPosts.slice((page - 1) * postsPerPage, page * postsPerPage);
  const pageCount = Math.ceil(filteredPosts.length / postsPerPage);

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
          onClick={handleNewArticle}
          disabled={isCreatingArticle}
          sx={{
            bgcolor: 'primary.main',
            color: 'text.light',
          }}
        >
          {isCreatingArticle ? 'Creating...' : 'New article'}
        </Button>
      </Box>

      {isLoading ? (
        <LoadingSpinner
          message="Loading your blogs..."
          fullHeight
        />
      ) : (
        <>
          {/* Search and Filter Section */}
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
              placeholder="Search articles..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: { md: 280 } }}
            />
          </Stack>

          {/* Status Tabs */}
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
                label="All"
                iconPosition="start"
                icon={<Iconify icon="mdi:view-grid" width={20} height={20} />}
              />
              <Tab
                value="publish"
                label="Published"
                iconPosition="start"
                icon={<Iconify icon="mdi:check-circle" width={20} height={20} />}
              />
              <Tab
                value="draft"
                label="Draft"
                iconPosition="start"
                icon={<Iconify icon="mdi:file-document-outline" width={20} height={20} />}
              />
              <Tab
                value="scheduled"
                label="Scheduled"
                iconPosition="start"
                icon={<Iconify icon="mdi:clock-outline" width={20} height={20} />}
              />
            </Tabs>
          </Box>

          {!isLoading && (notFound || isDataEmpty) && (
            <Box textAlign="center" py={5}>
              <Typography variant="h6">No articles found</Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or create a new article
              </Typography>
            </Box>
          )}

          <Grid container spacing={3}>
            {paginatedPosts.map((post, index) => {
              // Make all cards look like the first one (large featured style)
              const latestPostLarge = true;
              const latestPost = true;

              return (
                <Grid key={post.id} xs={12} sm={12} md={6}>
                  {post.isDraft ? (
                    <DraftItem
                      draft={post}
                      latestPost={latestPost}
                      latestPostLarge={latestPostLarge}
                    />
                  ) : (
                    <PostItem
                      post={post}
                      latestPost={latestPost}
                      latestPostLarge={latestPostLarge}
                    />
                  )}
                </Grid>
              );
            })}
          </Grid>
          </>
        )}

        {pageCount > 1 && (
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ mt: 8, mx: 'auto', display: 'flex', justifyContent: 'center' }}
          />
        )}

    </DashboardContent>
  );
}
