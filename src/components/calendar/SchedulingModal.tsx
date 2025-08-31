import type { Article } from 'src/types/article';

import { useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Chip,
  List,
  Fade,
  Modal,
  alpha,
  Stack,
  Button,
  Select,
  Checkbox,
  ListItem,
  useTheme,
  MenuItem,
  Collapse,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  FormControl,
  ListItemText,
  LinearProgress,
  CircularProgress,
} from '@mui/material';

import { convertLocalDateTimeToUTC } from 'src/utils/constants';

import { useGetStoresQuery } from 'src/services/apis/storesApi';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';

import { Iconify } from 'src/components/iconify';

interface SchedulingModalProps {
  open: boolean;
  onClose: () => void;
  selectedDay: Date | null;
  availableArticles: Article[];
  selectedArticles: number[];
  onArticleToggle: (articleId: number) => void;
  onScheduleSubmit: (scheduleData: {
    schedulingData: Array<{
      articleId: number;
      storeId: number;
      scheduledDateTime: string;
    }>;
  }) => void;
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

  // Get current store and all stores
  const currentStore = useSelector(selectCurrentStore);
  const { data: storesData } = useGetStoresQuery();
  const stores = storesData?.stores || [];

  // Enhanced scheduling state - individual settings per article
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
  const [articleSchedulingSettings, setArticleSchedulingSettings] = useState<Record<number, {
    storeId: number;
    date: string;
    time: string;
  }>>({});

  // Get current date and time for validation
  const now = new Date();
  const currentDate = format(now, 'yyyy-MM-dd');
  const currentTime = format(now, 'HH:mm');

  // Get minimum date (today)
  const minDate = currentDate;

  // Get minimum time (current time if date is today, otherwise 00:00)
  const getMinTime = (selectedDate: string) => selectedDate === currentDate ? currentTime : '00:00';

  // Get or create scheduling settings for an article
  const getArticleSettings = (articleId: number) => articleSchedulingSettings[articleId] || {
      storeId: currentStore?.id || 1,
      date: selectedDay && selectedDay >= now ? format(selectedDay, 'yyyy-MM-dd') : currentDate,
      time: currentTime
    };

  // Update scheduling settings for a specific article with validation
  const updateArticleSettings = (articleId: number, updates: Partial<{ storeId: number; date: string; time: string }>) => {
    const currentSettings = getArticleSettings(articleId);
    const validatedUpdates = { ...updates };

    // Validate date and time to prevent scheduling in the past
    if (updates.date || updates.time) {
      const finalDate = updates.date || currentSettings.date;
      const finalTime = updates.time || currentSettings.time;

      // If selecting today, ensure time is not in the past
      if (finalDate === currentDate && finalTime < currentTime) {
        validatedUpdates.time = currentTime;

        // Show warning toast
        toast.error(t('calendar.pastTimeWarning', 'Cannot schedule in the past. Time updated to current time.'), {
          duration: 3000,
          style: {
            background: '#F59E0B',
            color: 'white',
            fontWeight: '600',
            borderRadius: '8px',
          },
        });
      }
    }

    setArticleSchedulingSettings(prev => ({
      ...prev,
      [articleId]: {
        ...currentSettings,
        ...validatedUpdates
      }
    }));
  };

  // Handle enhanced schedule submit with individual article settings
  const handleEnhancedScheduleSubmit = () => {
    // Collect all scheduling data for selected articles
    const schedulingData = selectedArticles.map(articleId => {
      const settings = getArticleSettings(articleId);
      return {
        articleId,
        storeId: settings.storeId,
        scheduledDateTime: convertLocalDateTimeToUTC(settings.date, settings.time)
      };
    });

    onScheduleSubmit({ schedulingData });
  };

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
          onClick={(e) => e.stopPropagation()}
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
          <Box sx={{ p: 3, pt: 2, position: 'relative' }}>
            {/* Loading Overlay */}
            {isLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  borderRadius: 2,
                }}
              >
                <CircularProgress
                  size={48}
                  sx={{
                    mb: 2,
                    color: theme.palette.primary.main,
                  }}
                />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {t('calendar.scheduling', 'Scheduling Articles...')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
                  {t('calendar.schedulingProgress', 'Please wait while we schedule your articles')}
                </Typography>
                <LinearProgress
                  sx={{
                    width: '60%',
                    height: 6,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      bgcolor: theme.palette.primary.main,
                    }
                  }}
                />
              </Box>
            )}

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
                    <Box key={article.id}>
                      <ListItem
                        disablePadding
                      divider={index < availableArticles.length - 1}
                      secondaryAction={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {/* Arrow indicator for expanding scheduling options */}
                          {selectedArticles.includes(article.id) && (
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Toggle expanded state - only one article can be expanded at a time
                                setExpandedArticle(expandedArticle === article.id ? null : article.id);
                              }}
                              sx={{
                                color: theme.palette.primary.main,
                                transition: 'transform 0.2s ease',
                                transform: expandedArticle === article.id ? 'rotate(90deg)' : 'rotate(0deg)',
                              }}
                            >
                              <Iconify icon="eva:arrow-ios-forward-fill" width={16} height={16} />
                            </IconButton>
                          )}

                          <Checkbox
                            edge="end"
                            checked={selectedArticles.includes(article.id)}
                            onChange={() => {
                              onArticleToggle(article.id);

                              // Auto-expand dropdown when checkbox is checked
                              if (!selectedArticles.includes(article.id)) {
                                // Article is being selected - automatically show its details
                                setExpandedArticle(article.id);
                              } else {
                                // Article is being deselected - hide its details
                                // eslint-disable-next-line no-lonely-if
                                if (expandedArticle === article.id) {
                                  setExpandedArticle(null);
                                }
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              color: theme.palette.primary.main,
                              '&.Mui-checked': {
                                color: theme.palette.primary.main,
                              },
                            }}
                          />
                        </Box>
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
                      onClick={() => {
                        onArticleToggle(article.id);

                        // Auto-expand dropdown when checkbox is selected
                        if (!selectedArticles.includes(article.id)) {
                          // Article is being selected - automatically show its details
                          setExpandedArticle(article.id);
                        } else {
                          // Article is being deselected - hide its details
                          // eslint-disable-next-line no-lonely-if
                          if (expandedArticle === article.id) {
                            setExpandedArticle(null);
                          }
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {article.article_title || article.title || t('calendar.articlePlaceholder', 'Untitled Article')}
                          </Typography>
                        }
                      />
                    </ListItem>

                    {/* Enhanced Scheduling Options - Show when article is selected */}
                    <Collapse in={selectedArticles.includes(article.id) && expandedArticle === article.id}>
                      <Box
                        sx={{
                          p: 2,
                          mx: 2,
                          mb: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                          borderRadius: 2,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                          {t('calendar.schedulingOptions', 'Scheduling Options')}
                        </Typography>

                        <Stack spacing={2}>
                          {/* Store Selection */}
                          <FormControl fullWidth size="small">
                            <InputLabel>{t('calendar.selectStore', 'Select Store')}</InputLabel>
                            <Select
                              value={getArticleSettings(article.id).storeId}
                              onChange={(e) => updateArticleSettings(article.id, { storeId: Number(e.target.value) })}
                              label={t('calendar.selectStore', 'Select Store')}
                            >
                              {stores.map((store) => (
                                <MenuItem key={store.id} value={store.id}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {store.logo && (
                                      <Box
                                        component="img"
                                        src={store.logo}
                                        sx={{ width: 20, height: 20, borderRadius: 1 }}
                                      />
                                    )}
                                    <Typography>{store.name}</Typography>
                                    {store.id === currentStore?.id && (
                                      <Chip size="small" label="Current" color="primary" />
                                    )}
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          {/* Date and Time Selection */}
                          <Stack direction="row" spacing={2}>
                            <TextField
                              type="date"
                              label={t('calendar.selectDate', 'Select Date')}
                              value={getArticleSettings(article.id).date}
                              onChange={(e) => {
                                const newDate = e.target.value;
                                const currentSettings = getArticleSettings(article.id);

                                // If selecting today and current time is in the past, update time to current
                                if (newDate === currentDate && currentSettings.time < currentTime) {
                                  updateArticleSettings(article.id, {
                                    date: newDate,
                                    time: currentTime
                                  });
                                } else {
                                  updateArticleSettings(article.id, { date: newDate });
                                }
                              }}
                              size="small"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              inputProps={{
                                min: minDate, // Prevent selecting past dates
                              }}
                            />
                            <TextField
                              type="time"
                              label={t('calendar.selectTime', 'Select Time')}
                              value={getArticleSettings(article.id).time}
                              onChange={(e) => updateArticleSettings(article.id, { time: e.target.value })}
                              size="small"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              inputProps={{
                                min: getMinTime(getArticleSettings(article.id).date), // Prevent selecting past times for today
                              }}
                            />
                          </Stack>

                          {/* Preview of scheduled date/time */}
                          <Box
                            sx={{
                              p: 1.5,
                              bgcolor: alpha(theme.palette.info.main, 0.08),
                              borderRadius: 1,
                              border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`,
                            }}
                          >
                            <Typography variant="caption" color="info.main" sx={{ fontWeight: 600 }}>
                              {t('calendar.scheduledFor', 'Scheduled for')}: {format(new Date(`${getArticleSettings(article.id).date}T${getArticleSettings(article.id).time}`), 'EEEE, MMMM d, yyyy • h:mm a')}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Collapse>
                    </Box>
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
                onClick={handleEnhancedScheduleSubmit}
                disabled={selectedArticles.length === 0 || isLoading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  position: 'relative',
                  overflow: 'hidden',
                  minWidth: 140,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    transform: 'translateY(-1px)',
                    boxShadow: theme.shadows[4],
                  },
                  '&:disabled': {
                    background: alpha(theme.palette.action.disabled, 0.12),
                    color: theme.palette.action.disabled,
                  },
                  // Loading shimmer effect
                  ...(isLoading && {
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.3)}, transparent)`,
                      animation: 'shimmer 1.5s infinite',
                    },
                    '@keyframes shimmer': {
                      '0%': { left: '-100%' },
                      '100%': { left: '100%' },
                    },
                  }),
                  transition: 'all 0.2s ease',
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress
                      size={16}
                      sx={{
                        color: 'inherit',
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                      }}
                    />
                    {t('calendar.scheduling', 'Scheduling...')}
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="eva:calendar-fill" width={16} height={16} />
                    {t('calendar.schedule', 'Schedule')}
                  </Box>
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
