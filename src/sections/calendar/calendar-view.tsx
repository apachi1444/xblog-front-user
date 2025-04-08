import { useState } from 'react';
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
  Checkbox, 
  useTheme, 
  Typography, 
  IconButton,
  ListItemText
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

// Mock data for scheduled articles - updated with dates relative to today
const getCurrentDateFormatted = () => {
  const today = new Date();
  return format(today, 'yyyy-MM-dd');
};

const getRelativeDateFormatted = (daysOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return format(date, 'yyyy-MM-dd');
};

// Mock data for scheduled articles
const scheduledArticles = [
  { id: '1', title: 'Tech Innovators Conference', date: getRelativeDateFormatted(-5), endDate: getRelativeDateFormatted(-3), color: '#90caf9', status: 'published' },
  { id: '2', title: 'Charity Gala Dinner', date: getRelativeDateFormatted(-2), color: '#a5d6a7', status: 'published' },
  { id: '3', title: 'Annual General Meeting', date: getCurrentDateFormatted(), color: '#ffcc80', status: 'upcoming' },
  { id: '4', title: 'Summer Music Festival', date: getRelativeDateFormatted(3), color: '#ce93d8', status: 'upcoming' },
  { id: '9', title: 'Product Launch', date: getRelativeDateFormatted(7), color: '#ffcc80', status: 'upcoming' },
  { id: '10', title: 'Team Building Event', date: getRelativeDateFormatted(10), color: '#ffcc80', status: 'upcoming' },
];

// Mock data for available articles
const availableArticles = [
  { id: '5', title: 'How to Improve Your SEO Strategy' },
  { id: '6', title: '10 Tips for Better Content Marketing' },
  { id: '7', title: 'The Future of AI in Digital Marketing' },
  { id: '8', title: 'Social Media Trends for 2023' },
];

export default function CalendarPage() {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date()); // Set to today's date
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
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
  const handleArticleToggle = (articleId: string) => {
    setSelectedArticles(prev => 
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };
  
  // Submit scheduled articles
  const handleScheduleSubmit = () => {
    // Here you would implement the API call to schedule the articles
    console.log('Scheduling articles:', selectedArticles, 'for date:', selectedDay);
    setIsModalOpen(false);
    setShowSuccessAlert(true);
  };
  
  // Get scheduled articles for a specific day
  const getScheduledArticlesForDay = (day: Date) => {
    const dateString = format(day, 'yyyy-MM-dd');
    return scheduledArticles.filter(article => {
      const articleStart = new Date(article.date);
      const articleEnd = article.endDate ? new Date(article.endDate) : articleStart;
      return day >= articleStart && day <= articleEnd;
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
    if (articles.some(article => article.status === 'upcoming')) return 'upcoming';
    return 'published';
  };

  // Determine if a day is interactive (can schedule articles)
  const isDayInteractive = (day: Date) => !isBefore(day, new Date()) || isToday(day);

  return (
    <DashboardContent>
      {/* Success alert */}
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
      
      {/* Calendar header with navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={prevMonth}><ChevronLeft /></IconButton>
        <Typography variant="h5">{format(currentDate, 'MMMM yyyy')}</Typography>
        <IconButton onClick={nextMonth}><ChevronRight /></IconButton>
      </Box>

      {/* Calendar grid - Updated to fill parent container */}
      <Paper sx={{ 
        overflow: 'hidden', 
        borderRadius: 2,
        height: 'calc(100vh - 200px)', // Adjust height to fill available space
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
                {getScheduledArticlesForDay(day).map((article, idx) => (
                  <Box key={idx} sx={{
                    position: 'absolute',
                    top: 24 + idx * 20,
                    left: 8,
                    right: 8,
                    bgcolor: article.status === 'published' ? theme.palette.success.main : article.color,
                    color: '#fff',
                    p: 0.5,
                    borderRadius: 1,
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {article.title}
                  </Box>
                ))}
              </Grid>
            );
          })}
        </Grid>
      </Paper>
      
      {/* Scheduling modal */}
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
          
          <Typography variant="subtitle2" gutterBottom>
            Select articles to schedule:
          </Typography>
          
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {availableArticles.map((article) => (
              <ListItem key={article.id} disablePadding>
                <Checkbox
                  edge="start"
                  checked={selectedArticles.includes(article.id)}
                  onChange={() => handleArticleToggle(article.id)}
                />
                <ListItemText primary={article.title} />
              </ListItem>
            ))}
          </List>
          
          <Box display="flex" justifyContent="flex-end" mt={3} gap={1}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleScheduleSubmit}
              disabled={selectedArticles.length === 0}
            >
              Schedule
            </Button>
          </Box>
        </Box>
      </Modal>
    </DashboardContent>
  );
}