
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, useCallback } from 'react';
import { X, Plus, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isToday, isBefore, addMonths, subMonths, endOfMonth, startOfMonth, eachDayOfInterval } from 'date-fns';

import {
  Box,
  Chip,
  Grid,
  List,
  alpha,
  Modal,
  Paper,
  Button,
  Divider,
  Checkbox,
  ListItem,
  useTheme,
  IconButton,
  Typography,
  ListItemText
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';
import { useScheduleArticleMutation } from 'src/services/apis/calendarApis';
import { useGetArticlesQuery, useUnscheduleArticleMutation } from 'src/services/apis/articlesApi';

import { Iconify } from 'src/components/iconify';
import { LoadingSpinner } from 'src/components/loading';
import { useNavigate } from 'react-router-dom';

export default function CalendarPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  const [selectedArticleDetails, setSelectedArticleDetails] = useState<any>(null);
  const [isArticleDetailsModalOpen, setIsArticleDetailsModalOpen] = useState(false);

  const currentStore = useSelector(selectCurrentStore);
  const storeId = currentStore?.id || 1;

  const [scheduleArticle] = useScheduleArticleMutation();
  const [unscheduleArticle, { isLoading: isUnscheduling }] = useUnscheduleArticleMutation();

  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    refetch: refetchArticles
  } = useGetArticlesQuery({ store_id: storeId });

  const navigate = useNavigate();
  

  // Memoize articles to prevent unnecessary re-renders
  const articles = useMemo(() => articlesData?.articles || [], [articlesData]);
  // Handle showing article details
  const handleArticleClick = useCallback((article: any) => {
    setSelectedArticleDetails(article);
    setIsArticleDetailsModalOpen(true);
  }, []);

  // Close article details modal
  const handleCloseArticleDetails = useCallback(() => {
    setIsArticleDetailsModalOpen(false);
    setSelectedArticleDetails(null);
  }, []);

  // Handle unscheduling an article
  const handleUnscheduleArticle = useCallback(async () => {
    if (!selectedArticleDetails) return;

    try {
      await unscheduleArticle({
        article_id: selectedArticleDetails.id,
        store_id: storeId
      }).unwrap();

      toast.success(t('calendar.unscheduledSuccessfully', 'Article unscheduled successfully'));
      setIsArticleDetailsModalOpen(false);
      setSelectedArticleDetails(null);

      // Refresh articles data after unscheduling
      refetchArticles();
    } catch (error) {
      console.error('Error unscheduling article:', error);
      toast.error(t('calendar.unschedulingFailed', 'Failed to unschedule article. Please try again.'));
    }
  }, [selectedArticleDetails, storeId, unscheduleArticle, refetchArticles, t]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Navigation functions
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Handle day click to open scheduling modal
  const handleDayClick = (day: Date) => {
    if (!isBefore(day, new Date()) || isToday(day)) {
      setSelectedDay(day);
      setSelectedArticles([]);
      setIsModalOpen(true);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticles([]);
  };

  // Toggle article selection
  const handleArticleToggle = (articleId: string) => {
    setSelectedArticles(prev =>
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  // Submit scheduled articles
  const handleScheduleSubmit = useCallback(async () => {
    if (!selectedDay || selectedArticles.length === 0) return;

    try {
      const scheduledDate = format(selectedDay, 'yyyy-MM-dd');

      // Log the scheduling attempt
      console.log(`Scheduling articles for ${scheduledDate}:`, selectedArticles);

      await Promise.all(selectedArticles.map(articleId =>
        scheduleArticle({
          store_id: storeId,
          article_id: articleId,
          scheduled_date: scheduledDate
        })
      ));

      toast.success(t('calendar.scheduledSuccessfully', 'Articles scheduled successfully!'));
      setIsModalOpen(false);
      setSelectedArticles([]);

      // Refresh articles data after scheduling
      refetchArticles();

    } catch (error) {
      toast.error(t('calendar.schedulingFailed', 'Failed to schedule articles. Please try again.'));
    }
  }, [selectedDay, selectedArticles, storeId, scheduleArticle, refetchArticles, t]);

  // Memoize the scheduled articles for each day to avoid recalculating on every render
  const getScheduledArticlesForDay = useCallback((day: Date) => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    return articles.filter(article => {
      if (article.status !== 'scheduled') return false;

      const scheduledDate = article.scheduledAt || article.publishedAt;
      if (!scheduledDate) return false;

      const articleDate = format(new Date(scheduledDate), 'yyyy-MM-dd');
      return articleDate === formattedDay;
    });
  }, [articles]);

  // Get status for a day (for styling) - memoized to prevent recalculation
  const getDayStatus = useCallback((day: Date) => {
    const scheduledArticles = getScheduledArticlesForDay(day);

    if (isBefore(day, new Date()) && !isToday(day)) {
      if (scheduledArticles.length === 0) return 'past-empty';
      if (scheduledArticles.some(article => article.status === 'published')) return 'published';
      return 'past-missed';
    }

    if (scheduledArticles.length === 0) return 'empty';
    if (scheduledArticles.some(article => article.status === 'draft')) return 'upcoming';
    return 'published';
  }, [getScheduledArticlesForDay]);

  // Determine if a day is interactive
  const isDayInteractive = (day: Date) => !isBefore(day, new Date()) || isToday(day);

  // Get available articles (not yet scheduled) - memoized to prevent recalculation
  const getAvailableArticles = useCallback(() =>
    articles.filter(article => article.status !== 'scheduled'),
  [articles]);

  if (isLoadingArticles) {
    return (
      <DashboardContent>
        <LoadingSpinner message={t('calendar.loading', 'Loading your calendar...')} fullHeight />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={prevMonth} aria-label={t('calendar.previousMonth', 'Previous month')}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h5">{format(currentDate, 'MMMM yyyy')}</Typography>
        <IconButton onClick={nextMonth} aria-label={t('calendar.nextMonth', 'Next month')}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Calendar Grid */}
      <Paper sx={{
        overflow: 'hidden',
        borderRadius: 2,
        height: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.paper
      }}>
        <Grid container>
          {[
            t('calendar.days.sunday', 'Sun'),
            t('calendar.days.monday', 'Mon'),
            t('calendar.days.tuesday', 'Tue'),
            t('calendar.days.wednesday', 'Wed'),
            t('calendar.days.thursday', 'Thu'),
            t('calendar.days.friday', 'Fri'),
            t('calendar.days.saturday', 'Sat')
          ].map((day, index) => (
            <Grid item xs={12 / 7} key={index} sx={{
              textAlign: 'center',
              p: 1,
              borderBottom: `1px solid ${theme.palette.divider}`
            }}>
              <Typography variant="subtitle2">{day}</Typography>
            </Grid>
          ))}
        </Grid>

        <Grid container sx={{ flexGrow: 1 }}>
          {daysInMonth.map((day, index) => {
            const dayStatus = getDayStatus(day);
            const isInteractive = isDayInteractive(day);
            const scheduledArticles = getScheduledArticlesForDay(day);

            let bgColor = 'transparent';
            if (isToday(day)) {
              bgColor = alpha(theme.palette.primary.main, 0.08);
            } else if (dayStatus === 'published') {
              bgColor = alpha(theme.palette.success.main, 0.08);
            } else if (dayStatus === 'upcoming') {
              bgColor = alpha(theme.palette.warning.main, 0.08);
            } else if (dayStatus === 'past-missed') {
              bgColor = alpha(theme.palette.error.main, 0.08);
            } else if (dayStatus === 'past-empty') {
              bgColor = alpha(theme.palette.grey[500], 0.15);
            }

            return (
              <Grid
                item
                xs={12 / 7}
                key={index}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  height: 'auto',
                  minHeight: 100, // Increased minimum height
                  position: 'relative',
                  bgcolor: bgColor,
                  opacity: isInteractive ? 1 : 0.7,
                  padding: 1, // Add some padding
                  // Remove hover effect from the entire grid cell
                }}
              >
                {/* Day number and add button in the same row */}
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1.5 // Add margin bottom to separate from articles
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isToday(day) ? 'bold' : 'normal'
                    }}
                  >
                    {format(day, 'd')}
                  </Typography>

                  {isInteractive && (
                    <IconButton
                      size="small"
                      aria-label={t('calendar.addArticle', 'Add article')}
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.background.paper, 0.95),
                          cursor: 'pointer',
                          transform: 'scale(1.1)',
                          boxShadow: theme.shadows[2]
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                      onClick={() => handleDayClick(day)}
                    >
                      <Plus size={16} />
                    </IconButton>
                  )}
                </Box>

                {/* Container for scheduled articles with proper spacing */}
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2, // Add space between articles
                    mt: 1 // Add margin top
                  }}
                >
                  {scheduledArticles.map((article, idx) => (
                    <Box
                      key={idx}
                      onClick={() => handleArticleClick(article)}
                      sx={{
                        bgcolor: article.status === 'published' ? theme.palette.success.main : theme.palette.warning.main,
                        color: theme.palette.getContrastText(
                          article.status === 'published' ? theme.palette.success.main : theme.palette.warning.main
                        ),
                        p: 0.75, // Slightly more padding
                        borderRadius: 1,
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer',
                        boxShadow: theme.shadows[1],
                        '&:hover': {
                          filter: 'brightness(1.1)',
                          boxShadow: theme.shadows[2],
                          transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {article.title || t('calendar.articlePlaceholder', 'Article #{{id}}', { id: article.id })}
                    </Box>
                  ))}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Scheduling Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="schedule-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          maxWidth: '90vw',
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[24],
          p: 4,
          borderRadius: 2
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography id="schedule-modal-title" variant="h6" component="h2">
              {t('calendar.scheduleArticles', 'Schedule Articles for {{date}}', {
                date: selectedDay ? format(selectedDay, 'MMMM d, yyyy') : ''
              })}
            </Typography>
            <IconButton
              size="small"
              onClick={handleCloseModal}
              aria-label={t('common.close', 'Close')}
            >
              <X size={18} />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            {t('calendar.selectArticles', 'Select articles to schedule:')}
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              maxHeight: 300,
              overflow: 'auto',
              mt: 1,
              mb: 2
            }}
          >
            {getAvailableArticles().length > 0 ? (
              <List disablePadding>
                {getAvailableArticles().map((article) => (
                  <ListItem
                    key={article.id}
                    disablePadding
                    divider
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        checked={selectedArticles.includes(article.id)}
                        onChange={() => handleArticleToggle(article.id)}
                        inputProps={{ 'aria-labelledby': `article-${article.id}` }}
                      />
                    }
                    sx={{
                      px: 2,
                      py: 1,
                      ...(selectedArticles.includes(article.id) && {
                        bgcolor: 'primary.lighter',
                      }),
                    }}
                  >
                    <ListItemText
                      primary={article.title || t('calendar.articlePlaceholder', 'Article #{{id}}', { id: article.id })}
                      secondary={t(`common.statuses.${article.status}`, article.status)}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 4,
                  px: 3,
                  textAlign: 'center'
                }}
              >
                <Iconify
                  icon="mdi:file-document-plus-outline"
                  width={60}
                  height={60}
                  sx={{
                    color: 'text.secondary',
                    opacity: 0.6,
                    mb: 2
                  }}
                />

                <Typography variant="h6" gutterBottom>
                  {t('calendar.noArticlesTitle', 'No Articles Available')}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, maxWidth: 300 }}
                >
                  {t('calendar.noArticlesDescription', 'You don\'t have any articles ready for scheduling. Generate new content first.')}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="mdi:plus" />}
                  onClick={() => {
                    handleCloseModal();
                    navigate('/generate');
                  }}
                >
                  {t('calendar.generateArticleButton', 'Generate New Article')}
                </Button>
              </Box>
            )}
          </Paper>

          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button
              variant="outlined"
              onClick={handleCloseModal}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              variant="contained"
              disabled={selectedArticles.length === 0}
              onClick={handleScheduleSubmit}
            >
              {t('calendar.schedule', 'Schedule')}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Article Details Modal */}
      <Modal
        open={isArticleDetailsModalOpen}
        onClose={handleCloseArticleDetails}
        aria-labelledby="article-details-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          maxWidth: '90vw',
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[24],
          p: 4,
          borderRadius: 2
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography id="article-details-modal-title" variant="h6" component="h2">
              {t('calendar.articleDetails', 'Article Details')}
            </Typography>
            <IconButton
              size="small"
              onClick={handleCloseArticleDetails}
              aria-label={t('common.close', 'Close')}
            >
              <X size={18} />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {selectedArticleDetails && (
            <>
              <Typography variant="h5" gutterBottom>
                {selectedArticleDetails.title || t('calendar.articlePlaceholder', 'Article #{{id}}', { id: selectedArticleDetails.id })}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', mr: 2 }}>
                    <Info size={16} style={{ marginRight: 4 }} />
                    {t('common.status', 'Status')}: <Chip
                      size="small"
                      color={selectedArticleDetails.status === 'published' ? 'success' : 'warning'}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </Typography>
              </Box>

              {selectedArticleDetails.description && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>{t('common.description', 'Description')}:</Typography>
                  <Typography variant="body2">{selectedArticleDetails.description}</Typography>
                </Box>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>{t('calendar.scheduleInfo', 'Schedule Information')}:</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">
                    <strong>{t('calendar.scheduledDate', 'Scheduled Date')}:</strong> {selectedArticleDetails.scheduledAt ?
                      format(new Date(selectedArticleDetails.scheduledAt), 'MMMM d, yyyy') :
                      t('calendar.notScheduled', 'Not scheduled')}
                  </Typography>
                  {selectedArticleDetails.publishedAt && (
                    <Typography variant="body2">
                      <strong>{t('calendar.publishedDate', 'Published Date')}:</strong> {format(new Date(selectedArticleDetails.publishedAt), 'MMMM d, yyyy')}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    <strong>{t('common.created', 'Created')}:</strong> {format(new Date(selectedArticleDetails.createdAt), 'MMMM d, yyyy')}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" justifyContent="flex-end" gap={1} mt={3}>
                {/* Only show Unschedule button for scheduled articles */}
                {selectedArticleDetails.status === 'scheduled' && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleUnscheduleArticle}
                    disabled={isUnscheduling}
                    startIcon={isUnscheduling ? <LoadingSpinner size={16} /> : null}
                  >
                    {isUnscheduling ? t('calendar.unscheduling', 'Unscheduling...') : t('calendar.unschedule', 'Unschedule')}
                  </Button>
                )}
                <Button
                  variant="outlined"
                  onClick={handleCloseArticleDetails}
                >
                  {t('common.close', 'Close')}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </DashboardContent>
  );
}
