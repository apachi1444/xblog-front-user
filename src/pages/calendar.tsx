import { useState } from 'react';
import { X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isToday, addMonths, subMonths, endOfMonth, startOfMonth, eachDayOfInterval } from 'date-fns';

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
  Typography, 
  IconButton, 
  ListItemText 
} from '@mui/material';

// Mock data for scheduled articles
const scheduledArticles = [
  { id: '1', title: 'Tech Innovators Conference', date: '2020-08-04', endDate: '2020-08-06', color: 'lightblue', status: 'upcoming' },
  { id: '2', title: 'Charity Gala Dinner', date: '2020-08-10', color: 'lightgreen', status: 'upcoming' },
  { id: '3', title: 'Annual General Meeting', date: '2020-08-12', color: 'lightorange', status: 'upcoming' },
  { id: '4', title: 'Summer Music Festival', date: '2020-08-17', color: 'lightpurple', status: 'upcoming' },
];

// Mock data for available articles
const availableArticles = [
  { id: '5', title: 'How to Improve Your SEO Strategy' },
  { id: '6', title: '10 Tips for Better Content Marketing' },
  { id: '7', title: 'The Future of AI in Digital Marketing' },
  { id: '8', title: 'Social Media Trends for 2023' },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date('2020-08-01'));
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
    setSelectedDay(day);
    setSelectedArticles([]);
    setIsModalOpen(true);
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
    if (articles.length === 0) return 'none';
    if (articles.some(article => article.status === 'upcoming')) return 'upcoming';
    return 'published';
  };

  return (
    <Box>
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

      {/* Calendar grid */}
      <Paper sx={{ overflow: 'hidden', borderRadius: 2 }}>
        <Grid container>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <Grid item xs={12 / 7} key={index} sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="subtitle2">{day}</Typography>
            </Grid>
          ))}
        </Grid>

        <Grid container>
          {daysInMonth.map((day, index) => (
            <Grid 
              item 
              xs={12 / 7} 
              key={index} 
              sx={{ 
                border: '1px solid #ddd', 
                height: 100, 
                position: 'relative',
                bgcolor: isToday(day) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer'
                }
              }}
              onClick={() => handleDayClick(day)}
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
              
              {/* Plus button for adding articles */}
              <IconButton 
                size="small" 
                sx={{ 
                  position: 'absolute', 
                  top: 4, 
                  right: 4,
                  width: 20,
                  height: 20
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDayClick(day);
                }}
              >
                <Plus size={14} />
              </IconButton>
              
              {/* Display scheduled articles */}
              {getScheduledArticlesForDay(day).map((article, idx) => (
                <Box key={idx} sx={{
                  position: 'absolute',
                  top: 24 + idx * 20,
                  left: 0,
                  right: 0,
                  bgcolor: article.color,
                  color: '#fff',
                  p: 0.5,
                  borderRadius: 1,
                  textAlign: 'center',
                  fontSize: '0.75rem',
                }}>
                  {article.title}
                </Box>
              ))}
            </Grid>
          ))}
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
    </Box>
  );
}