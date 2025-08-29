import type { Article } from 'src/types/article';

import toast from 'react-hot-toast';
import { formatDate } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { convertUTCToLocalDate } from 'src/utils/constants';

import {
  Box,
  Chip,
  Fade,
  Modal,
  Stack,
  alpha,
  Button,
  Divider,
  useTheme,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';

import { navigateToArticle } from 'src/utils/articleIdEncoder';

import { useDeleteCalendarMutation } from 'src/services/apis/calendarApis';

import { Iconify } from 'src/components/iconify';

interface ArticleDetailsModalProps {
  open: boolean;
  onClose: () => void;
  article: Article | null;
  onRefresh?: () => void;
}

export function ArticleDetailsModal({
  open,
  onClose,
  article,
  onRefresh,
}: ArticleDetailsModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  // API hooks for unscheduling
  const [deleteCalendar, { isLoading: isUnscheduling }] = useDeleteCalendarMutation();

  if (!article) return null;

  // Handle unscheduling using the calendar ID from the article object
  const handleUnschedule = async () => {
    try {
      // Check if we have the calendar ID from the article object (added as dynamic property)
      const calendarId = (article as any)?.calendarId;
      if (!calendarId) {
        toast.error('Calendar entry not found. Please try again.');
        return;
      }

      toast.loading('Unscheduling article...', { id: 'unschedule-article' });

      // Delete the calendar entry using the calendar_id
      await deleteCalendar(calendarId).unwrap();

      toast.success('Article unscheduled successfully!', { id: 'unschedule-article' });

      // Close modal and refresh data
      onClose();
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      toast.error('Failed to unschedule article. Please try again.', { id: 'unschedule-article' });
    }
  };

  // Handle edit navigation
  const handleEdit = () => {
    navigateToArticle(navigate, article.id.toString());
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            width: 560,
            maxWidth: '90vw',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 24px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              : '0 24px 48px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            position: 'relative',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              pb: 2,
              background: theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.grey[900], 0.9)} 100%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.grey[50], 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                >
                  <Iconify icon="eva:file-text-fill" width={24} height={24} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {t('calendar.articleDetails', 'Article Details')}
                  </Typography>
                  <Chip
                    label={t(`common.statuses.${article.status}`, article.status)}
                    color={article.status === 'publish' ? 'success' : article.status === 'scheduled' ? 'warning' : 'default'}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Stack>
              <IconButton
                onClick={onClose}
                sx={{
                  bgcolor: alpha(theme.palette.grey[500], 0.08),
                  '&:hover': { 
                    bgcolor: alpha(theme.palette.grey[500], 0.16),
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Iconify icon="eva:close-fill" width={20} height={20} />
              </IconButton>
            </Stack>
          </Box>

          {/* Content */}
          <Box sx={{ p: 3, maxHeight: 500, overflow: 'auto' }}>
            <Stack spacing={3}>
              {/* Title */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Article Title
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                  {article.article_title || article.title || "No Title Found"}
                </Typography>
              </Box>

              {/* Content Description */}
              {article.content_description && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Content Description
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {article.content_description}
                  </Typography>
                </Box>
              )}

              {/* Keywords Section */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                  Keywords
                </Typography>
                <Stack spacing={1.5}>
                  {/* Primary Keyword */}
                  {article.primary_keyword && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        Primary Keyword
                      </Typography>
                      <Chip
                        label={article.primary_keyword}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                  )}

                  {/* Secondary Keywords */}
                  {article.secondary_keywords && (() => {
                    try {
                      const keywords = JSON.parse(article.secondary_keywords);
                      return (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                            Secondary Keywords
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {keywords.slice(0, 4).map((keyword: string, index: number) => (
                              <Chip
                                key={index}
                                label={keyword}
                                size="small"
                                variant="outlined"
                                color="secondary"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            ))}
                            {keywords.length > 4 && (
                              <Chip
                                label={`+${keywords.length - 4} more`}
                                size="small"
                                variant="outlined"
                                color="default"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            )}
                          </Box>
                        </Box>
                      );
                    } catch {
                      return null;
                    }
                  })()}
                </Stack>
              </Box>

              {/* SEO Information */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                  SEO Information
                </Typography>
                <Stack spacing={1.5}>
                  {/* Meta Title */}
                  {article.meta_title && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        Meta Title
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {article.meta_title}
                      </Typography>
                    </Box>
                  )}

                  {/* Meta Description */}
                  {article.meta_description && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        Meta Description
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {article.meta_description}
                      </Typography>
                    </Box>
                  )}

                  {/* URL Slug */}
                  {article.url_slug && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        URL Slug
                      </Typography>
                      <Typography variant="body2" sx={{
                        fontFamily: 'monospace',
                        bgcolor: alpha(theme.palette.grey[500], 0.1),
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.875rem'
                      }}>
                        /{article.url_slug}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* Article Configuration */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                  Article Configuration
                </Typography>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {/* Language & Country */}
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        Language & Country
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {article.language?.toUpperCase() || 'EN'} • {article.target_country?.toUpperCase() || 'US'}
                      </Typography>
                    </Box>

                    {/* Article Type */}
                    {article.article_type && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                          Article Type
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                          {article.article_type}
                        </Typography>
                      </Box>
                    )}

                    {/* Article Size */}
                    {article.article_size && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                          Article Size
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                          {article.article_size}
                        </Typography>
                      </Box>
                    )}

                    {/* Tone of Voice */}
                    {article.tone_of_voice && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                          Tone of Voice
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                          {article.tone_of_voice}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Features */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                      Features
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {article.include_images && (
                        <Chip label="Images" size="small" variant="outlined" color="info" />
                      )}
                      {article.include_videos && (
                        <Chip label="Videos" size="small" variant="outlined" color="info" />
                      )}
                      {article.include_cta && (
                        <Chip label="CTA" size="small" variant="outlined" color="info" />
                      )}
                      {article.plagiat_removal && (
                        <Chip label="Plagiarism Check" size="small" variant="outlined" color="success" />
                      )}
                      {article.template_name && (
                        <Chip label={`Template: ${article.template_name}`} size="small" variant="outlined" color="secondary" />
                      )}
                    </Box>
                  </Box>
                </Stack>
              </Box>

              <Divider />

              {/* Metadata */}
              <Stack spacing={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Timeline & Status
                </Typography>
                
                <Stack spacing={1.5}>
                  {/* Created Date */}
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                      }}
                    >
                      <Iconify icon="eva:calendar-outline" width={16} height={16} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {t('common.created', 'Created')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(article.created_at, 'MMMM d, yyyy • h:mm a')}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Scheduled Date - Only show for scheduled articles */}
                  {article.status === 'scheduled' && ((article as any).scheduledDate || article.scheduled_publish_date) && (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          color: theme.palette.warning.main,
                        }}
                      >
                        <Iconify icon="eva:clock-outline" width={16} height={16} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {t('calendar.scheduledDate', 'Scheduled Date')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(convertUTCToLocalDate((article as any).scheduledDate || article.scheduled_publish_date), 'MMMM d, yyyy • h:mm a')}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  {/* Platform */}
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <Iconify icon="eva:globe-outline" width={16} height={16} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {t('common.platform', 'Platform')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {article.platform}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 3,
              pt: 2,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.4)
                : alpha(theme.palette.grey[50], 0.5),
            }}
          >
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              {/* Unschedule button for scheduled articles */}
              {article.status === 'scheduled' && (
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={handleUnschedule}
                  disabled={isUnscheduling}
                  startIcon={isUnscheduling ? <CircularProgress size={16} /> : <Iconify icon="mdi:calendar-remove" width={16} height={16} />}
                  sx={{ borderRadius: 2 }}
                >
                  {isUnscheduling ? t('common.unscheduling', 'Unscheduling...') : t('common.unschedule', 'Unschedule')}
                </Button>
              )}

              {/* Edit button */}
              <Button
                variant="outlined"
                onClick={handleEdit}
                startIcon={<Iconify icon="eva:edit-outline" width={16} height={16} />}
                sx={{ borderRadius: 2 }}
              >
                {t('common.edit', 'Edit')}
              </Button>

              {/* Close button */}
              <Button
                variant="contained"
                onClick={onClose}
                sx={{
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                }}
              >
                {t('common.close', 'Close')}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default ArticleDetailsModal;
