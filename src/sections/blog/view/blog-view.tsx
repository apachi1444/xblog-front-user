import type { Article } from 'src/types/article';

import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

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
import { useLazyGetArticlesQuery } from 'src/services/apis/articlesApi';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';

import { Iconify } from 'src/components/iconify';
import { LoadingSpinner } from 'src/components/loading';

import { PostItem } from '../post-item';

// ----------------------------------------------------------------------

export function BlogView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  
  const [articles, setArticles] = useState<Article[]>([]);
  const currentStore = useSelector(selectCurrentStore);
  
  const [doGetArticles, { isLoading , isFetching }] = useLazyGetArticlesQuery();

  useEffect(() => {
    if (currentStore?.id) {
      doGetArticles({ store_id: currentStore.id })
        .unwrap()
        .then((result) => {   
          toast.success("Successfully get blogs")
          const articlesFromApi = result.drafts_articles.concat(result.published_articles);
          setArticles(articlesFromApi)
        })
        .catch((err) => {
          toast.error(err.error.data.message);
        });
    }
  }, [currentStore?.id, doGetArticles, dispatch, currentStore]);
  
  useEffect(() => {
    let sorted = [...articles];
    
    // Apply search filter
    if (searchQuery) {
      sorted = sorted.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (currentTab !== 'all') {
      sorted = sorted.filter(post => post.status.toLowerCase() === currentTab.toLowerCase());
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'latest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      default:
        break;
    }
    
    setFilteredPosts(sorted);
  }, [articles, sortBy, searchQuery, currentTab]);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  const handleNewArticle = () => {
    navigate('/generate');
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const notFound = !filteredPosts.length;
  const isDataEmpty = articles.length === 0;
  
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
          sx={{
            bgcolor: 'primary.main',
            color: 'text.light',
          }}
        >
          New article
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
                value="published" 
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

          {!isLoading && (notFound || isDataEmpty) && !isFetching  && (
            <Box textAlign="center" py={5}>
              <Typography variant="h6">No articles found</Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or create a new article
              </Typography>
            </Box>
          )}

          <Grid container spacing={3}>
            {paginatedPosts.map((post, index) => {
              const latestPostLarge = index === 0 && page === 1;
              const latestPost = (index === 1 || index === 2) && page === 1;

              return (
                <Grid key={post.id} xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
                  <PostItem post={post} latestPost={latestPost} latestPostLarge={latestPostLarge} />
                </Grid>
              );
            })}
          </Grid>

          {pageCount > 1 && (
            <Pagination 
              count={pageCount} 
              page={page}
              onChange={handlePageChange}
              color="primary" 
              sx={{ mt: 8, mx: 'auto', display: 'flex', justifyContent: 'center' }} 
            />
          )}
        </>
      )}
    </DashboardContent>
  );
}
