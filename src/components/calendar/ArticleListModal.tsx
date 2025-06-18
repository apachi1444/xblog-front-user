import type { Article } from 'src/types/article';

import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import {
  Box,
  List,
  Chip,
  Fade,
  Modal,
  Stack,
  alpha,
  ListItem,
  useTheme,
  Typography,
  IconButton,
  ListItemText,
  ListItemButton,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface ArticleListModalProps {
  open: boolean;
  onClose: () => void;
  articles: Article[];
  date: Date;
  onArticleClick: (article: Article) => void;
}

export function ArticleListModal({
  open,
  onClose,
  articles,
  date,
  onArticleClick,
}: ArticleListModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();

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
            width: 480,
            maxWidth: '90vw',
            maxHeight: '80vh',
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
                  <Iconify icon="eva:list-fill" width={24} height={24} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {t('calendar.scheduledArticles', 'Scheduled Articles')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(date, 'EEEE, MMMM d, yyyy')} • {articles.length} {articles.length === 1 ? 'article' : 'articles'}
                  </Typography>
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
          <Box
            sx={{
              maxHeight: 400,
              overflow: 'auto',
            }}
          >
            <List disablePadding>
              {articles.map((article, index) => (
                <ListItem
                  key={article.id}
                  disablePadding
                  divider={index < articles.length - 1}
                >
                  <ListItemButton
                    onClick={() => onArticleClick(article)}
                    sx={{
                      px: 3,
                      py: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
                            {article.title || t('calendar.articlePlaceholder', 'Article #{{id}}', { id: article.id })}
                          </Typography>
                          <Chip
                            label={t(`common.statuses.${article.status}`, article.status)}
                            size="small"
                            color={article.status === 'published' ? 'success' : 'warning'}
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          />
                        </Stack>
                      }
                      secondary={
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                          <Iconify 
                            icon="eva:clock-outline" 
                            width={14} 
                            height={14} 
                            sx={{ color: 'text.secondary' }} 
                          />
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(article.created_at), 'h:mm a')}
                          </Typography>
                          {article.content && (
                            <>
                              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: 200,
                                }}
                              >
                                {article.content}
                              </Typography>
                            </>
                          )}
                        </Stack>
                      }
                    />
                    <IconButton
                      size="small"
                      sx={{
                        ml: 1,
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      <Iconify icon="eva:arrow-ios-forward-fill" width={16} height={16} />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.4)
                : alpha(theme.palette.grey[50], 0.5),
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {t('calendar.clickToViewDetails', 'Click on any article to view details')}
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default ArticleListModal;
