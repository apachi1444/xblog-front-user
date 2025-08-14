import type { Article } from 'src/types/article';

import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Box,
  List,
  Fade,
  Modal,
  alpha,
  Stack,
  Button,
  Checkbox,
  ListItem,
  useTheme,
  Typography,
  IconButton,
  ListItemText,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface SchedulingModalProps {
  open: boolean;
  onClose: () => void;
  selectedDay: Date | null;
  availableArticles: Article[];
  selectedArticles: number[];
  onArticleToggle: (articleId: number) => void;
  onScheduleSubmit: () => void;
  isLoading?: boolean;
}

export function SchedulingModal({
  open,
  onClose,
  selectedDay,
  availableArticles,
  selectedArticles,
  onArticleToggle,
  onScheduleSubmit,
  isLoading = false,
}: SchedulingModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="schedule-modal-title"
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
            width: 520,
            maxWidth: '90vw',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 24px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              : '0 24px 48px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }
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
                  <Iconify icon="eva:calendar-fill" width={24} height={24} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {t('calendar.scheduleArticles', 'Schedule Articles')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedDay ? format(selectedDay, 'EEEE, MMMM d, yyyy') : ''}
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
          <Box sx={{ p: 3, pt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              {t('calendar.selectArticles', 'Select articles to schedule:')}
            </Typography>

            <Box
              sx={{
                maxHeight: 400,
                overflow: 'auto',
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.background.paper, 0.4)
                  : alpha(theme.palette.grey[50], 0.5),
              }}
            >
              {availableArticles.length > 0 ? (
                <List disablePadding>
                  {availableArticles.map((article, index) => (
                    <ListItem
                      key={article.id}
                      disablePadding
                      divider={index < availableArticles.length - 1}
                      secondaryAction={
                        <Checkbox
                          edge="end"
                          checked={selectedArticles.includes(article.id)}
                          onChange={() => onArticleToggle(article.id)}
                          sx={{
                            color: theme.palette.primary.main,
                            '&.Mui-checked': {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />
                      }
                      sx={{
                        px: 2,
                        py: 1.5,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        ...(selectedArticles.includes(article.id) && {
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          borderLeft: `3px solid ${theme.palette.primary.main}`,
                        }),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        },
                      }}
                      onClick={() => onArticleToggle(article.id)}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {article.title || t('calendar.articlePlaceholder', 'Article #{{id}}', { id: article.id })}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {t(`common.statuses.${article.status}`, article.status)}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  <Iconify icon="eva:file-text-outline" width={48} height={48} sx={{ mb: 2, opacity: 0.5 }} />
                  <Typography variant="body2" sx={{ mb: 3 }}>
                    {t('calendar.noArticles', 'No articles available for scheduling')}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:plus-fill" width={20} height={20} />}
                    onClick={() => {
                      navigate('/create');
                      onClose();
                    }}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        transform: 'translateY(-1px)',
                        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {t('calendar.createNewArticle', 'Create New Article')}
                  </Button>
                </Box>
              )}
            </Box>
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
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  borderRadius: 2,
                  px: 3,
                }}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                variant="contained"
                onClick={onScheduleSubmit}
                disabled={selectedArticles.length === 0 || isLoading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  },
                }}
              >
                {isLoading ? (
                  <>
                    <Iconify icon="eva:loader-outline" width={16} height={16} sx={{ mr: 1, animation: 'spin 1s linear infinite' }} />
                    {t('calendar.scheduling', 'Scheduling...')}
                  </>
                ) : (
                  t('calendar.schedule', 'Schedule')
                )}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default SchedulingModal;
