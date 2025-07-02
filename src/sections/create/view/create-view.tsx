
import { toast } from 'react-hot-toast';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

import { DashboardContent } from 'src/layouts/dashboard';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';
import { useGetArticlesQuery, useCreateArticleMutation } from 'src/services/apis/articlesApi';

import { Iconify } from 'src/components/iconify';


export function CreateView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Fetch articles and filter drafts
  const currentStore = useSelector(selectCurrentStore);
  const storeId = currentStore?.id || 1;
  const { data: articlesData, isLoading } = useGetArticlesQuery({ store_id: storeId });

  const [createArticle, { isLoading: isCreatingArticle }] = useCreateArticleMutation();

  // Filter and sort draft articles by most recent first
  const draftArticles = useMemo(() => {
    if (!articlesData?.articles) return [];
    return articlesData.articles
      .filter(article => article.status === 'draft')
      .sort((a, b) => {
        // Sort by updated_at if available, otherwise use created_at (most recent first)
        const dateA = new Date(a.updated_at || a.created_at).getTime();
        const dateB = new Date(b.updated_at || b.created_at).getTime();
        return dateB - dateA;
      });
  }, [articlesData]);

  const createOptions = [
    {
      id: 'generate',
      title: t('create.options.generate.title', 'Generate'),
      description: t('create.options.generate.description', 'Create from a one-line prompt in a few seconds'),
      icon: 'mdi:lightning-bolt',
      color: '#BBDEFB',
      popular: true
    },
    {
      id: 'template',
      title: t('create.options.template.title', 'Use Built In Template'),
      description: t('create.options.template.description', 'Create an article from an existing template'),
      icon: 'mdi:content-paste',
      color: '#F8BBD0',
      locked: true,
      comingSoon: true
    },
    {
      id: 'bulk',
      title: t('create.options.bulk.title', 'Bulk Generate'),
      description: t('create.options.bulk.description', 'Generate multiple articles in a single batch'),
      icon: 'mdi:file-multiple-outline',
      color: '#C8E6C9',
      locked: true,
      comingSoon: true
    },
  ];

  const handleOptionSelect = async (optionId: string, isLocked: boolean = false) => {
    // Don't do anything if the option is locked
    if (isLocked) return;

    setSelectedOption(optionId);

    // Navigate to the appropriate page based on selection
    if (optionId === 'generate') {
      try {
        // Create empty article first
        const newArticle = await createArticle({
          title: 'Untitled Article',
          content: '',
          meta_description: '',
          keywords: [],
          status: 'draft',
          website_id: undefined,
        }).unwrap();

        // Navigate to generate view with the new article ID
        navigate(`/generate?articleId=${newArticle.id}`);

        toast.success('New article created! Start editing...');
      } catch (error) {
        console.error('Failed to create article:', error);
        toast.error('Failed to create article. Please try again.');
      }
    }
    // Add other navigation options as needed
  };

  return (
    <DashboardContent>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {t('create.heading', 'Create with AI')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('create.subheading', 'How would you like to get started?')}
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center" sx={{ mb: 8 }}>
        {createOptions.map((option) => (
          <Grid key={option.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                bgcolor: option.id === selectedOption ? 'action.selected' : 'background.paper',
                position: 'relative',
                overflow: 'visible'
              }}
            >
              {option.popular && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: 16,
                    bgcolor: 'success.main',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    zIndex: 1,
                  }}
                >
                  {t('create.popular', 'Popular')}
                </Box>
              )}
              <CardActionArea
                onClick={() => handleOptionSelect(option.id, option.locked)}
                disabled={option.locked || (option.id === 'generate' && isCreatingArticle)}
                sx={{
                  height: '100%',
                  p: 2,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:hover': {
                    bgcolor: option.locked ? 'transparent' : 'primary.lighter',
                    transform: option.locked ? 'none' : 'translateY(-3px)',
                    boxShadow: option.locked ? 'none' : (theme) => theme.shadows[4],
                    '& .option-icon': {
                      transform: option.locked ? 'none' : 'scale(1.1)',
                    }
                  }
                }}
              >
                {/* Coming Soon Overlay */}
                {option.locked && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                      <Iconify
                        icon="mdi:lock"
                        width={40}
                        height={40}
                        sx={{ color: 'white', mb: 1 }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: 'white',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          px: 2
                        }}
                      >
                        {option.id === 'template'
                          ? t('create.comingSoonTemplate', 'Built-in Templates Coming Soon')
                          : t('create.comingSoonBulk', 'Bulk Generation Coming Soon')}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <CardContent>
                  <Box
                    sx={{
                      mb: 3,
                      p: 3,
                      borderRadius: 2,
                      bgcolor: `${option.color}40`,
                      width: '100%',
                      height: 140,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      filter: option.locked ? 'grayscale(0.8)' : 'none',
                    }}
                  >
                    <Iconify
                      icon={option.icon}
                      width={80}
                      height={80}
                      className="option-icon"
                      sx={{
                        color: option.color,
                        transition: 'transform 0.3s ease',
                        opacity: option.locked ? 0.7 : 1
                      }}
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ opacity: option.locked ? 0.7 : 1 }}>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: option.locked ? 0.7 : 1 }}>
                    {option.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {t('create.draftArticlesHeading', 'Draft Articles')}
        </Typography>

        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Loading draft articles...
            </Typography>
          </Box>
        ) : draftArticles.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No draft articles found. Start creating to see your drafts here.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {draftArticles.map(article => (
              <Card
                key={article.id}
                sx={{
                  bgcolor: 'background.paper',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'primary.lighter',
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => theme.shadows[4]
                  },
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/generate?articleId=${article.id}`)}
              >
                <CardContent sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    '& .chevron-icon': {
                      transform: 'translateX(4px)',
                    }
                  }
                }}>
                  <Box>
                    <Typography variant="subtitle1">{article.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {article.updated_at
                        ? t('create.lastUpdated', 'Last updated {{date}}', {
                            date: new Date(article.updated_at).toLocaleDateString()
                          })
                        : t('create.createdOn', 'Created on {{date}}', {
                            date: new Date(article.created_at).toLocaleDateString()
                          })
                      }
                    </Typography>
                  </Box>
                  <Iconify
                    icon="mdi:chevron-right"
                    className="chevron-icon"
                    sx={{ transition: 'transform 0.3s ease' }}
                  />
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </DashboardContent>
  );
}