
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isToday, isBefore, addMonths, subMonths, endOfMonth, startOfMonth, eachDayOfInterval } from 'date-fns';

import {
  Box,
  Grid,
  List,
  Paper,
  Modal,
  Button,
  Divider,
  Checkbox,
  ListItem,
  useTheme,
  Typography,
  IconButton,
  ListItemText
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetArticlesQuery } from 'src/services/apis/articlesApi';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';
import { useScheduleArticleMutation } from 'src/services/apis/calendarApis';

import { LoadingSpinner } from 'src/components/loading';

export default function CalendarPage() {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  const currentStore = useSelector(selectCurrentStore);
  const storeId = currentStore?.id || 1;

  const [scheduleArticle] = useScheduleArticleMutation();

  const {
    data: articlesData,
    isLoading: isLoadingArticles,
  } = useGetArticlesQuery({ store_id: storeId });

  // Log articles data only when it changes
  useEffect(() => {
    if (articlesData) {
      console.log("articlesData", articlesData);
    }
  }, [articlesData]);

  const articles = articlesData?.articles || [];


  // Get days for the current month view
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
  const handleScheduleSubmit = async () => {
    if (!selectedDay || selectedArticles.length === 0) return;

    try {
      await Promise.all(selectedArticles.map(articleId =>
        scheduleArticle({
          store_id: storeId,
          article_id: articleId,
          scheduled_date: format(selectedDay, 'yyyy-MM-dd')
        })
      ));

      toast.success('Articles scheduled successfully!');
      setIsModalOpen(false);
      setSelectedArticles([]);
    } catch (error) {
      toast.error('Failed to schedule articles. Please try again.');
    }
  };

  // Get scheduled articles for a specific day
  const getScheduledArticlesForDay = (day: Date) => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    return articles.filter(article => {
      if (article.status !== 'scheduled') return false;
      const articleDate = article.publishedAt ? format(new Date(article.publishedAt), 'yyyy-MM-dd') : null;
      return articleDate === formattedDay;
    });
  };

  // Get status for a day (for styling)
  const getDayStatus = (day: Date) => {
    const scheduledArticles = getScheduledArticlesForDay(day);

    if (isBefore(day, new Date()) && !isToday(day)) {
      if (scheduledArticles.length === 0) return 'past-empty';
      if (scheduledArticles.some(article => article.status === 'published')) return 'published';
      return 'past-missed';
    }

    if (scheduledArticles.length === 0) return 'empty';
    if (scheduledArticles.some(article => article.status === 'draft')) return 'upcoming';
    return 'published';
  };

  // Determine if a day is interactive
  const isDayInteractive = (day: Date) => !isBefore(day, new Date()) || isToday(day);

  // Get available articles (not yet scheduled)
  const getAvailableArticles = () => articles.filter(article => article.status !== 'scheduled');

  if (isLoadingArticles) {
    return (
      <DashboardContent>
        <LoadingSpinner message="Loading your calendar..." fullHeight />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={prevMonth}><ChevronLeft /></IconButton>
        <Typography variant="h5">{format(currentDate, 'MMMM yyyy')}</Typography>
        <IconButton onClick={nextMonth}><ChevronRight /></IconButton>
      </Box>

      {/* Calendar Grid */}
      <Paper sx={{
        overflow: 'hidden',
        borderRadius: 2,
        height: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Grid container>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <Grid item xs={12 / 7} key={index} sx={{ textAlign: 'center', p: 1 }}>
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
              bgColor = 'rgba(25, 118, 210, 0.08)';
            } else if (dayStatus === 'published') {
              bgColor = 'rgba(76, 175, 80, 0.08)';
            } else if (dayStatus === 'upcoming') {
              bgColor = 'rgba(255, 152, 0, 0.08)';
            } else if (dayStatus === 'past-missed') {
              bgColor = 'rgba(244, 67, 54, 0.08)';
            } else if (dayStatus === 'past-empty') {
              bgColor = 'rgba(158, 158, 158, 0.15)';
            }

            return (
              <Grid
                item
                xs={12 / 7}
                key={index}
                sx={{
                  border: '1px solid #ddd',
                  height: 'auto',
                  minHeight: 80,
                  position: 'relative',
                  bgcolor: bgColor,
                  opacity: isInteractive ? 1 : 0.7,
                  '&:hover': {
                    bgcolor: isInteractive ? 'rgba(0, 0, 0, 0.04)' : bgColor,
                    cursor: isInteractive ? 'pointer' : 'default'
                  }
                }}
                onClick={() => isInteractive && handleDayClick(day)}
              >
                <Typography
                  variant="body2"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    fontWeight: isToday(day) ? 'bold' : 'normal'
                  }}
                >
                  {format(day, 'd')}
                </Typography>

                {isInteractive && (
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 32,
                      height: 32,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDayClick(day);
                    }}
                  >
                    <Plus size={20} />
                  </IconButton>
                )}

                {scheduledArticles.map((article, idx) => (
                  <Box key={idx} sx={{
                    position: 'absolute',
                    top: 24 + idx * 20,
                    left: 8,
                    right: 8,
                    bgcolor: article.status === 'published' ? theme.palette.success.main : theme.palette.warning.main,
                    color: '#fff',
                    p: 0.5,
                    borderRadius: 1,
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {article.title || `Article #${article.id}`}
                  </Box>
                ))}
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
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography id="schedule-modal-title" variant="h6" component="h2">
              Schedule Articles for {selectedDay ? format(selectedDay, 'MMMM d, yyyy') : ''}
            </Typography>
            <IconButton size="small" onClick={handleCloseModal}>
              <X size={18} />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Select articles to schedule:
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
                    primary={article.title || `Article #${article.id}`}
                    secondary={article.status}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button
              variant="outlined"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={selectedArticles.length === 0}
              onClick={handleScheduleSubmit}
            >
              Schedule
            </Button>
          </Box>
        </Box>
      </Modal>
    </DashboardContent>
  );
}
