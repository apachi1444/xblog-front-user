import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Card,
  alpha,
  Button,
  useTheme,
  Typography,
  CardContent,
  CircularProgress
} from '@mui/material';

import { formatMetrics, getContentQuality, calculateArticleMetrics } from 'src/utils/articleMetrics';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetArticlesQuery } from 'src/services/apis/articlesApi';
import { useGetSubscriptionPlansQuery, useGetSubscriptionDetailsQuery } from 'src/services/apis/subscriptionApi';

import { Iconify } from 'src/components/iconify';

import { useRegenerateManager } from 'src/sections/generate/hooks/useRegenerateManager';

// Draft Articles Component
function DraftArticlesSection() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  // Fetch draft articles
  const { data: articles, isLoading } = useGetArticlesQuery({
    page: 1,
    limit: 5,
  });

  const draftArticles = articles?.articles?.filter((article: any) => article.status === 'draft') || [];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('dashboard.lastDocuments', 'Last documents')}
          </Typography>
          {draftArticles.length > 0 && (
            <Button
              size="small"
              onClick={() => navigate('/create')}
              sx={{ textTransform: 'none' }}
            >
              {t('dashboard.viewAll', 'View all')}
            </Button>
          )}
        </Box>

        {draftArticles.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.grey[500], 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Iconify
                icon="mdi:file-document-outline"
                width={40}
                height={40}
                sx={{ color: theme.palette.text.secondary }}
              />
            </Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              {t('dashboard.noDocs', 'No docs yet!')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('dashboard.createArticles', 'Create Articles That Are SEO-Optimized & Ready To Hit The Top of Google Searches.')}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/create')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              {t('dashboard.newDocument', 'New Document')}
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {draftArticles.map((article: any) => {
              const metrics = calculateArticleMetrics(article);
              const formattedMetrics = formatMetrics(metrics);
              const quality = getContentQuality(metrics);

              return (
                <Grid key={article.id} xs={12} sm={6} md={4}>
                  <Card
                    onClick={() => navigate(`/generate?articleId=${article.id}`)}
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4],
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      {/* Header with Icon and Quality Badge */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                        {/* Article Icon */}
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Iconify
                            icon="mdi:file-document-edit-outline"
                            width={20}
                            height={20}
                            sx={{ color: theme.palette.primary.main }}
                          />
                        </Box>

                        {/* Quality Badge */}
                        <Box
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: alpha(theme.palette[quality.color].main, 0.1),
                            border: `1px solid ${alpha(theme.palette[quality.color].main, 0.2)}`,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette[quality.color].main,
                              fontWeight: 600,
                              fontSize: '0.65rem',
                            }}
                          >
                            {quality.label}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Article Title */}
                      <Typography
                        variant="subtitle2"
                        sx={{
                          mb: 1.5,
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '2.5em',
                        }}
                      >
                        {article.article_title || article.title || t('dashboard.untitledArticle', 'Untitled Article')}
                      </Typography>

                      {/* Article Metrics */}
                      <Box sx={{ mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Iconify icon="mdi:text" width={14} height={14} sx={{ color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {formattedMetrics.wordCount}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Iconify icon="mdi:clock-outline" width={14} height={14} sx={{ color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {formattedMetrics.readingTime}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Primary Keyword */}
                        {article.primary_keyword && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Iconify icon="mdi:key" width={14} height={14} sx={{ color: 'text.secondary' }} />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {article.primary_keyword}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Last Modified */}
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5 }}>
                        {t('dashboard.lastModified', 'Created At')}: {new Date(article.created_at).toLocaleDateString()}
                      </Typography>

                      {/* Status Badge */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: theme.palette.warning.main,
                              mr: 0.5,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette.warning.main,
                              fontWeight: 500,
                              fontSize: '0.7rem',
                            }}
                          >
                            {t('dashboard.draft', 'Draft')}
                          </Typography>
                        </Box>

                        {/* Language Badge */}
                        {article.language && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              textTransform: 'uppercase',
                              fontSize: '0.65rem',
                              fontWeight: 500,
                            }}
                          >
                            {article.language}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}

// Clean License Information Component
function LicenseInfoSection() {
  const theme = useTheme();
  const navigate = useNavigate();

  const { data: subscriptionDetails, isLoading } = useGetSubscriptionDetailsQuery();
  const { regenerationsAvailable, regenerationsTotal } = useRegenerateManager();  
  const { data: availablePlans = [] } = useGetSubscriptionPlansQuery();

  if (isLoading || !subscriptionDetails) {
    return null;
  }

  let currentPlan = null;

  if (subscriptionDetails?.plan_id && availablePlans.length > 0) {
    // First try: Match by plan_id
    currentPlan = availablePlans.find(plan => plan.id === subscriptionDetails.plan_id || plan.id === String(subscriptionDetails.plan_id));

    // Second try: If no match by ID, try matching by name
    if (!currentPlan && subscriptionDetails.subscription_name) {
      currentPlan = availablePlans.find(plan =>
        plan.name.toLowerCase() === subscriptionDetails.subscription_name.toLowerCase()
      );
    
    }
  }

  const planName = currentPlan?.name || 'Free Plan';
  const isFreePlan = planName.toLowerCase().includes('free');
  const expirationDate = subscriptionDetails.expiration_date;

  // Calculate usage data
  const articlesUsed = subscriptionDetails.articles_created || 0;
  const articlesTotal = subscriptionDetails.articles_limit || 0;
  const articlesRemaining = articlesTotal - articlesUsed;

  const websitesUsed = subscriptionDetails.connected_websites || 0;
  const websitesTotal = subscriptionDetails.websites_limit || 0;
  const websitesRemaining = websitesTotal - websitesUsed;

  const regenerationsUsed = regenerationsTotal - regenerationsAvailable;

  // Calculate overall health
  const overallUsage = ((articlesUsed / articlesTotal) + (websitesUsed / websitesTotal) + (regenerationsUsed / regenerationsTotal)) / 3 * 100;
  const healthStatus = overallUsage < 70 ? 'excellent' : overallUsage < 85 ? 'good' : 'attention';

  const statusConfig = {
    excellent: { color: theme.palette.success.main, label: 'Excellent', icon: 'mdi:check-circle' },
    good: { color: theme.palette.info.main, label: 'Good', icon: 'mdi:information' },
    attention: { color: theme.palette.warning.main, label: 'Needs Attention', icon: 'mdi:alert-circle' }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Card
        sx={{
          border: 'none',
          boxShadow: `0 2px 12px ${alpha(theme.palette.grey[500], 0.08)}`,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify
                  icon={isFreePlan ? "mdi:account-outline" : "mdi:crown"}
                  width={28}
                  height={28}
                  sx={{ color: theme.palette.primary.main }}
                />
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                  {planName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Iconify
                    icon={statusConfig[healthStatus].icon}
                    width={16}
                    height={16}
                    sx={{ color: statusConfig[healthStatus].color }}
                  />
                  <Typography variant="body2" sx={{ color: statusConfig[healthStatus].color, fontWeight: 600 }}>
                    {statusConfig[healthStatus].label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {Math.round(100 - overallUsage)}% capacity remaining
                  </Typography>
                  {expirationDate && (
                    <>
                      <Typography variant="body2" color="text.secondary">•</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expires {new Date(expirationDate).toLocaleDateString()}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={() => navigate('/upgrade-license')}
              size="large"
              startIcon={
                <Iconify
                  icon="mdi:rocket-launch"
                  width={20}
                  height={20}
                />
              }
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  color: theme.palette.primary.dark,
                  boxShadow: 'none',
                  transform: 'translateY(-1px)',
                }
              }}
            >
              {isFreePlan ? 'Upgrade Plan' : 'Manage Plan'}
            </Button>
          </Box>

          {/* Resource Cards */}
          <Grid container spacing={3}>
            {/* Articles */}
            <Grid xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon="mdi:file-document-outline" width={20} height={20} sx={{ color: theme.palette.primary.main }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      Articles
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                      {articlesRemaining}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      of {articlesTotal} remaining
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${Math.min((articlesUsed / articlesTotal) * 100, 100)}%`,
                      bgcolor: theme.palette.primary.main,
                      borderRadius: 4,
                      transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Websites */}
            <Grid xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  bgcolor: alpha(theme.palette.secondary.main, 0.04),
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.08)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon="mdi:web" width={20} height={20} sx={{ color: theme.palette.secondary.main }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      Websites
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.secondary.main }}>
                      {websitesRemaining}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      of {websitesTotal} remaining
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${Math.min((websitesUsed / websitesTotal) * 100, 100)}%`,
                      bgcolor: theme.palette.secondary.main,
                      borderRadius: 4,
                      transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Regenerations */}
            <Grid xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  bgcolor: alpha(theme.palette.info.main, 0.04),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.08)}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon="mdi:autorenew" width={20} height={20} sx={{ color: theme.palette.info.main }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      Regenerations
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.info.main }}>
                      {regenerationsAvailable}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      of {regenerationsTotal} remaining
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${Math.min((regenerationsUsed / regenerationsTotal) * 100, 100)}%`,
                      bgcolor: theme.palette.info.main,
                      borderRadius: 4,
                      transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{mb: 4}}>
        <LicenseInfoSection />
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Draft Articles Section - Full Width */}
        <Grid xs={12}>
          <DraftArticlesSection />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
