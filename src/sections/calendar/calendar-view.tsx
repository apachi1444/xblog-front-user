
import type { Article } from 'src/types/article';

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
import { useGetArticlesQuery } from 'src/services/apis/articlesApi';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';
import {
  useScheduleArticleMutation,
  useGetScheduledArticlesQuery
} from 'src/services/apis/calendarApis';

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

  const [selectedArticleDetails, setSelectedArticleDetails] = useState<Article | null>(null);
  const [isArticleDetailsModalOpen, setIsArticleDetailsModalOpen] = useState(false);

  const [scheduleArticle,  { isLoading }] = useScheduleArticleMutation();

  const currentStore = useSelector(selectCurrentStore);
  const storeId = currentStore?.id || 1;

  // Get articles data
  const {
    data: articlesData,
    isLoading: isLoadingArticles,
    refetch: refetchArticles
  } = useGetArticlesQuery({ store_id: storeId });

  // Get calendar/scheduled data
  const {
    data: calendarData,
    refetch: refetchCalendar
  } = useGetScheduledArticlesQuery();

  // Memoize articles and calendar data to prevent unnecessary re-renders
  const articles = useMemo(() => articlesData?.articles.filter(
    article => article.status === "scheduled"
  ) || [], [articlesData]);
  const calendarItems = useMemo(() => calendarData?.calendars || [], [calendarData]);

  const getCalendarInfoForArticle = useCallback((articleId: number) => calendarItems.find(item => item.article_id === articleId), [calendarItems]);
  // Handle showing article details
  const handleArticleClick = useCallback((article: Article) => {
    // Get calendar info for this article
    const calendarInfo = getCalendarInfoForArticle(article.id);

    // Add calendar info as dynamic properties
    const articleWithCalendarInfo = { ...article };
    if (calendarInfo) {
      (articleWithCalendarInfo as any).calendarId = calendarInfo.id;
      (articleWithCalendarInfo as any).scheduledDate = calendarInfo.scheduled_date;
    }

    setSelectedArticleDetails(articleWithCalendarInfo);
    setIsArticleDetailsModalOpen(true);
  }, [getCalendarInfoForArticle]);

  // Close article details modal
  const handleCloseArticleDetails = useCallback(() => {
    setIsArticleDetailsModalOpen(false);
    setSelectedArticleDetails(null);
  }, []);



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

  // Submit scheduled articles with parallel API calls and enhanced individual data
  const handleScheduleSubmit = useCallback(async (scheduleData?: {
    schedulingData: Array<{
      articleId: number;
      storeId: number;
      scheduledDateTime: string;
    }>;
  }) => {
    if (!selectedDay || selectedArticles.length === 0) return;

    try {
      // Execute all API calls in parallel with individual settings
      const schedulingPromises = scheduleData?.schedulingData
        ? scheduleData.schedulingData.map(({ articleId, storeId: articleStoreId, scheduledDateTime }) =>
            scheduleArticle({
              store_id: articleStoreId,
              article_id: Number(articleId),
              scheduled_date: scheduledDateTime
            }).unwrap()
          )
        : selectedArticles.map(articleId =>
            scheduleArticle({
              store_id: storeId,
              article_id: Number(articleId),
              scheduled_date: format(selectedDay, 'yyyy-MM-dd')
            }).unwrap()
          );

      // Wait for all scheduling operations to complete
      const results = await Promise.allSettled(schedulingPromises);

      // Check results and provide detailed feedback
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      if (failed === 0) {
        toast.success(
          t('calendar.scheduledSuccessfully', `🎉 All ${successful} articles scheduled successfully!`),
          {
            duration: 4000,
            style: {
              background: '#10B981',
              color: 'white',
              fontWeight: '600',
              borderRadius: '12px',
              padding: '16px 20px',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#10B981',
            },
          }
        );

        // Trigger confetti animation
        setTimeout(() => {
          if ((window as any).confetti) {
            (window as any).confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0']
            });

            // Second burst
            setTimeout(() => {
              (window as any).confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE']
              });
            }, 250);

            // Third burst
            setTimeout(() => {
              (window as any).confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#E9D5FF']
              });
            }, 400);
          }
        }, 500);

      } else if (successful > 0) {
        toast.success(
          t('calendar.partiallyScheduled', `⚠️ ${successful} articles scheduled, ${failed} failed.`),
          {
            duration: 5000,
            style: {
              background: '#F59E0B',
              color: 'white',
              fontWeight: '600',
              borderRadius: '12px',
              padding: '16px 20px',
              boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
            },
          }
        );
      } else {
        toast.error(
          t('calendar.schedulingFailed', '❌ Failed to schedule articles. Please try again.'),
          {
            duration: 4000,
            style: {
              background: '#EF4444',
              color: 'white',
              fontWeight: '600',
              borderRadius: '12px',
              padding: '16px 20px',
              boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
            },
          }
        );
      }

      setIsModalOpen(false);
      setSelectedArticles([]);

      // Refresh both articles and calendar data after scheduling
      refetchArticles();
      refetchCalendar();

    } catch (error) {
      console.error('Scheduling error:', error);
      toast.error(t('calendar.schedulingFailed', 'Failed to schedule articles. Please try again.'));
    }
  }, [selectedDay, selectedArticles, storeId, scheduleArticle, refetchArticles, refetchCalendar, t]);

  // Memoize the scheduled articles for each day using calendar API data
  const getScheduledArticlesForDay = useCallback((day: Date): Article[] => {
    const formattedDay = format(day, 'yyyy-MM-dd');

    // Get calendar items for this day
    const dayCalendarItems = calendarItems.filter((calendarItem: { scheduled_date: string | number | Date; }) => {
      if (!calendarItem.scheduled_date) return false;
      const calendarDate = format(new Date(calendarItem.scheduled_date), 'yyyy-MM-dd');
      return calendarDate === formattedDay;
    });

    // Map calendar items to articles
    return dayCalendarItems.map((calendarItem: { article_id: any; id: any; scheduled_date: any; }) => {
      const article = articles.find((a: { id: any; }) => a.id === calendarItem.article_id);
      if (!article) return null;

      // Return article with scheduled status
      return {
        ...article,
        status: 'scheduled' as const // Override status since it's scheduled
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null); // Remove any null articles with proper type guard
  }, [articles, calendarItems]);

  // Get status for a day (for styling) - memoized to prevent recalculation
  const getDayStatus = useCallback((day: Date) => {
    const scheduledArticles = getScheduledArticlesForDay(day);

    if (isBefore(day, new Date()) && !isToday(day)) {
      if (scheduledArticles.length === 0) return 'past-empty';
      if (scheduledArticles.some(article => article.status === 'publish')) return 'publish';
      return 'past-missed';
    }

    if (scheduledArticles.length === 0) return 'empty';
    if (scheduledArticles.some(article => article.status === 'draft')) return 'upcoming';
    return 'published';
  }, [getScheduledArticlesForDay]);

  // Determine if a day is interactive
  const isDayInteractive = (day: Date) => !isBefore(day, new Date()) || isToday(day);

  const getAvailableArticles = useMemo(() => articlesData?.articles.filter(
    article => article.status === "draft"
  ) || [], [articlesData]);

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
        availableArticles={getAvailableArticles}
        selectedArticles={selectedArticles}
        onArticleToggle={handleArticleToggle}
        onScheduleSubmit={handleScheduleSubmit}
        isLoading={isLoading}
      />

      {/* Article Details Modal */}
      <ArticleDetailsModal
        open={isArticleDetailsModalOpen}
        onClose={handleCloseArticleDetails}
        article={selectedArticleDetails}
        onRefresh={() => {
          refetchArticles();
          refetchCalendar();
        }}
      />
    </DashboardContent>
  );
}
