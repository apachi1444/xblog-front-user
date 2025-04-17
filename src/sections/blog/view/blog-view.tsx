import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

import { DashboardContent } from 'src/layouts/dashboard';
import { useLazyGetArticlesQuery } from 'src/services/apis/articlesApi';
import { setArticles } from 'src/services/slices/articles/articleSlice';
import { selectAllArticles } from 'src/services/slices/articles/selectors';

import { Iconify } from 'src/components/iconify';
import { FullPageLoader } from 'src/components/loader';

import { PostItem } from '../post-item';
import { PostSort } from '../post-sort';

// ----------------------------------------------------------------------

export function BlogView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const articles = useSelector(selectAllArticles);
  
  const [doGetArticles] = useLazyGetArticlesQuery();
  
  useEffect(() => {
    setIsLoading(true);
    doGetArticles()
        .unwrap()
        .then((result) => {
          const articlesFromApi = result.drafts_articles.concat(result.published_articles);
          dispatch(setArticles(articlesFromApi));
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err);
        });
  }, [doGetArticles, dispatch]);
  
  useEffect(() => {
    // Apply sorting and filtering
    let sorted = [...articles];
    
    // Apply search filter
    if (searchQuery) {
      sorted = sorted.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
  }, [articles, sortBy, searchQuery]);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);
  
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on new search
  }, []);
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  const handleNewArticle = () => {
    navigate('/generate');
  };
  
  // Pagination
  const postsPerPage = 8;
  const paginatedPosts = filteredPosts.slice((page - 1) * postsPerPage, page * postsPerPage);
  const pageCount = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <DashboardContent>
      <FullPageLoader open={isLoading} />
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

      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
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

      {!isLoading && filteredPosts.length === 0 ? (
        <Box textAlign="center" py={5}>
          <Typography variant="h6">No articles found</Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or create a new article
          </Typography>
        </Box>
      ) : (
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
