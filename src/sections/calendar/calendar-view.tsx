
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isToday, isBefore, addMonths, subMonths, endOfMonth, startOfMonth, eachDayOfInterval } from 'date-fns';

import { 
  Box, 
  Grid, 
  Fade, 
  List, 
  Paper, 
  Modal, 
  Alert, 
  Button, 
  Divider, 
  ListItem, 
  useTheme, 
  Typography, 
  IconButton,
  ListItemText,
  CircularProgress
} from '@mui/material';

import { useToast } from 'src/contexts/ToastContext';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetArticlesQuery } from 'src/services/apis/articlesApi';
import { useScheduleArticleMutation, useGetScheduledArticlesQuery } from 'src/services/apis/calendarApis';

import { LoadingSpinner } from 'src/components/loading';

export default function CalendarPage() {
  const theme = useTheme();
  const { showToast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  // Get current store ID from Redux store
  const storeId = 1;
  
  // Fetch scheduled articles from API
  const { 
    data: calendarData, 
    isLoading: isLoadingCalendar, 
    error: calendarError,
    refetch: refetchCalendar
  } = useGetScheduledArticlesQuery();
  
  // Fetch available articles from API
  const { 
    data: articlesData, 
    isLoading: isLoadingArticles,
    error: articlesError,
    isError,
    isSuccess
  } = useGetArticlesQuery({ store_id: storeId.toString() });

  
  // Success effect
  useEffect(() => {
    if (isSuccess && articlesData) {
      toast.success("Successfully loaded articles");
    }
  }, [isSuccess, articlesData]);

  // Error effect
  useEffect(() => {
    if (isError && articlesError) {
      toast.error("Successfully loaded articles");
    }
  }, [isError, articlesError]);
  
  // Schedule article mutation
  const [scheduleArticle, { isLoading: isScheduling }] = useScheduleArticleMutation();
  
  // Handle API errors
  useEffect(() => {
    if (calendarError) {
      showToast('Failed to load scheduled articles. Please try again.', 'error');
    }
    if (articlesError) {
      showToast('Failed to load available articles. Please try again.', 'error');
    }
  }, [calendarError, articlesError, showToast]);
  
  // Get days for the current month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Navigation functions
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
  // Handle day click to open scheduling modal
  const handleDayClick = (day: Date) => {
    // Only allow scheduling for current or future dates
    if (!isBefore(day, new Date()) || isToday(day)) {
      setSelectedDay(day);
      setSelectedArticles([]);
      setIsModalOpen(true);
    }
  };
  
  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
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
  const handleScheduleSubmit = async () => {
    if (!selectedDay || selectedArticles.length === 0) return;
    
    try {
      // Format date for API
      const scheduledDate = format(selectedDay, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      
      // Schedule each selected article
      const promises = selectedArticles.map(articleId => 
        scheduleArticle({
          store_id: storeId,
          article_id: articleId,
          scheduled_date: scheduledDate
        })
      );
      
      await Promise.all(promises);
      
      setIsModalOpen(false);
      showToast('Articles successfully scheduled!', 'success');
      setShowSuccessAlert(true);
      
      // Refresh calendar data
      refetchCalendar();
      
      // Auto-hide success alert after 3 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
      
    } catch (error) {
      showToast('Failed to schedule articles. Please try again.', 'error');
    }
  };
  
  // Get scheduled articles for a specific day
  const getScheduledArticlesForDay = (day: Date) => {
    if (!calendarData?.calendars) return [];
    
    const formattedDay = format(day, 'yyyy-MM-dd');
    
    return calendarData.calendars.filter(article => {
      const articleDate = article.scheduled_date.split('T')[0];
      return articleDate === formattedDay;
    });
  };
  
  // Get status for a day (for styling)
  const getDayStatus = (day: Date) => {
    const articles = getScheduledArticlesForDay(day);
    
    // If day is in the past, check if it had published articles
    if (isBefore(day, new Date()) && !isToday(day)) {
      if (articles.length === 0) return 'past-empty';
      if (articles.some(article => article.status === 'published')) return 'published';
      return 'past-missed';
    }
    
    // Current or future days
    if (articles.length === 0) return 'empty';
    if (articles.some(article => article.status === 'scheduled')) return 'upcoming';
    return 'published';
  };

  // Determine if a day is interactive (can schedule articles)
  const isDayInteractive = (day: Date) => !isBefore(day, new Date()) || isToday(day);

  // Get available articles for scheduling
  const getAvailableArticles = () => {
    if (!articlesData) return [];
    
    // Combine draft and published articles
    const allArticles = [
      ...(articlesData.drafts_articles || []),
      ...(articlesData.published_articles || [])
    ];
    
    return allArticles;
  };

  return (
    <DashboardContent>
      {isLoadingCalendar ? (
        <LoadingSpinner 
          message="Loading your calendar..." 
          fullHeight 
        />
      ) : (
        <>
          {showSuccessAlert && (
            <Fade in={showSuccessAlert}>
              <Alert 
                severity="success" 
                sx={{ mb: 3 }}
                onClose={() => setShowSuccessAlert(false)}
              >
                Articles successfully scheduled!
              </Alert>
            </Fade>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={prevMonth}><ChevronLeft /></IconButton>
            <Typography variant="h5">{format(currentDate, 'MMMM yyyy')}</Typography>
            <IconButton onClick={nextMonth}><ChevronRight /></IconButton>
          </Box>
    
          {/* Calendar grid */}
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
                
                // Determine background color based on status
                let bgColor = 'transparent';
                if (isToday(day)) {
                  bgColor = 'rgba(25, 118, 210, 0.08)';
                } else if (dayStatus === 'published') {
                  bgColor = 'rgba(76, 175, 80, 0.08)'; // Light green for published
                } else if (dayStatus === 'upcoming') {
                  bgColor = 'rgba(255, 152, 0, 0.08)'; // Light orange for upcoming
                } else if (dayStatus === 'past-missed') {
                  bgColor = 'rgba(244, 67, 54, 0.08)'; // Light red for missed
                } else if (dayStatus === 'past-empty') {
                  bgColor = 'rgba(158, 158, 158, 0.15)'; // Light grey for past empty days
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
                    
                    {/* Plus button for adding articles - only for interactive days */}
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
                    
                    {/* Display scheduled articles */}
                    {scheduledArticles.map((article, idx) => (
                      <Box key={idx} sx={{
                        position: 'absolute',
                        top: 24 + idx * 20,
                        left: 8,
                        right: 8,
                        bgcolor: article.status === 'published' ? theme.palette.success.main : article.color || theme.palette.warning.main,
                        color: '#fff',
                        p: 0.5,
                        borderRadius: 1,
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {`Article #${article.article_id}`}
                      </Box>
                    ))}
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
          
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
              width: 400,
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
              
              {isLoadingArticles ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress size={30} />
                </Box>
              ) : (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Select articles to schedule:
                  </Typography>
                  
                  <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {getAvailableArticles().map((article) => (
                      <ListItem key={article.id} disablePadding>
                        <ListItemText 
                          primary={article.title || `Article #${article.id}`} 
                          secondary={article.status}
                        />
                      </ListItem>
                    ))}
                    
                    {getAvailableArticles().length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                        No articles available for scheduling
                      </Typography>
                    )}
                  </List>
                </>
              )}
              
              <Box display="flex" justifyContent="flex-end" mt={3} gap={1}>
                <Button variant="outlined" onClick={handleCloseModal} disabled={isScheduling}>
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleScheduleSubmit}
                  disabled={selectedArticles.length === 0 || isScheduling}
                  startIcon={isScheduling ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isScheduling ? 'Scheduling...' : 'Schedule'}
                </Button>
              </Box>
            </Box>
          </Modal>
          </>
        )
      } 
    </DashboardContent>
  );
}