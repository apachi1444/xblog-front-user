
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isToday, isBefore, addMonths, subMonths, endOfMonth, startOfMonth, eachDayOfInterval } from 'date-fns';

import {
  Box,
  Grid,
  Paper,
  useTheme,
  IconButton,
  Typography,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';
import { useScheduleArticleMutation } from 'src/services/apis/calendarApis';
import { useGetArticlesQuery, useUnscheduleArticleMutation } from 'src/services/apis/articlesApi';

import { LoadingSpinner } from 'src/components/loading';
import {
  SchedulingModal,
  CalendarDayCell,
  ArticleDetailsModal
} from 'src/components/calendar';

export default function CalendarPage() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);

  const [selectedArticleDetails, setSelectedArticleDetails] = useState<any>(null);
  const [isArticleDetailsModalOpen, setIsArticleDetailsModalOpen] = useState(false);



  const [scheduleArticle] = useScheduleArticleMutation();
  const [unscheduleArticle, { isLoading: isUnscheduling }] = useUnscheduleArticleMutation();

  const currentStore = useSelector(selectCurrentStore);
  const storeId = currentStore?.id || 1;
  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    refetch: refetchArticles
  } = useGetArticlesQuery({ store_id: storeId });

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
  const handleArticleToggle = (articleId: number) => {
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
          article_id: articleId.toString(),
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

      // For now, just use created_at as the scheduled date since scheduledAt doesn't exist in API
      const scheduledDate = article.created_at;
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
          {daysInMonth.map((day, index) => (
            <CalendarDayCell
              key={index}
              day={day}
              scheduledArticles={getScheduledArticlesForDay(day)}
              isInteractive={isDayInteractive(day)}
              dayStatus={getDayStatus(day)}
              onDayClick={handleDayClick}
              onArticleClick={handleArticleClick}
            />
          ))}
        </Grid>
      </Paper>

      {/* Scheduling Modal */}
      <SchedulingModal
        open={isModalOpen}
        onClose={handleCloseModal}
        selectedDay={selectedDay}
        availableArticles={getAvailableArticles()}
        selectedArticles={selectedArticles}
        onArticleToggle={handleArticleToggle}
        onScheduleSubmit={handleScheduleSubmit}
      />

      {/* Article Details Modal */}
      <ArticleDetailsModal
        open={isArticleDetailsModalOpen}
        onClose={handleCloseArticleDetails}
        article={selectedArticleDetails}
        onUnschedule={handleUnscheduleArticle}
        isUnscheduling={isUnscheduling}
      />
    </DashboardContent>
  );
}
