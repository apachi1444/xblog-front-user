import type { Article } from 'src/types/article';

import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Chip,
  Modal,
  Stack,
  Button,
  Divider,
  Typography,
  IconButton,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { LoadingSpinner } from 'src/components/loading';

interface ArticleDetailsModalProps {
  open: boolean;
  onClose: () => void;
  article: Article | null;
  onUnschedule?: () => void;
  onEdit?: () => void;
  isUnscheduling?: boolean;
}

export function ArticleDetailsModal({
  open,
  onClose,
  article,
  onUnschedule,
  onEdit,
  isUnscheduling = false,
}: ArticleDetailsModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  if (!article) return null;

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
                    size="small"
                    color={article.status === 'published' ? 'success' : article.status === 'scheduled' ? 'warning' : 'default'}
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
          <Box sx={{ p: 3, maxHeight: 400, overflow: 'auto' }}>
            <Stack spacing={3}>
              {/* Title */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  {t('common.title', 'Title')}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {article.title || t('calendar.articlePlaceholder', 'Article #{{id}}', { id: article.id })}
                </Typography>
              </Box>

              {/* Description */}
              {article.description && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    {t('common.description', 'Description')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {article.description}
                  </Typography>
                </Box>
              )}

              <Divider />

              {/* Metadata */}
              <Stack spacing={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('common.details', 'Details')}
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
                        {format(new Date(article.createdAt), 'MMMM d, yyyy • h:mm a')}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Scheduled Date */}
                  {article.scheduledAt && (
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
                          {t('common.scheduled', 'Scheduled')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(article.scheduledAt), 'MMMM d, yyyy • h:mm a')}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  {/* Published Date */}
                  {article.publishedAt && (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                        }}
                      >
                        <Iconify icon="eva:checkmark-circle-outline" width={16} height={16} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {t('common.published', 'Published')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(article.publishedAt), 'MMMM d, yyyy • h:mm a')}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  {/* Author */}
                  {article.author && (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                        }}
                      >
                        <Iconify icon="eva:person-outline" width={16} height={16} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {t('common.author', 'Author')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {article.author.name}
                        </Typography>
                      </Box>
                    </Stack>
                  )}
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
              {article.status === 'scheduled' && onUnschedule && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={onUnschedule}
                  disabled={isUnscheduling}
                  startIcon={isUnscheduling ? <LoadingSpinner size={16} /> : <Iconify icon="eva:calendar-outline" width={16} height={16} />}
                  sx={{ borderRadius: 2 }}
                >
                  {isUnscheduling ? t('calendar.unscheduling', 'Unscheduling...') : t('calendar.unschedule', 'Unschedule')}
                </Button>
              )}

              {/* Edit button */}
              {onEdit && (
                <Button
                  variant="outlined"
                  onClick={onEdit}
                  startIcon={<Iconify icon="eva:edit-outline" width={16} height={16} />}
                  sx={{ borderRadius: 2 }}
                >
                  {t('common.edit', 'Edit')}
                </Button>
              )}

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
