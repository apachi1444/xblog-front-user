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
  Snackbar,
  Container,
  Typography,
  IconButton,
  ListItemText
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';

// Mock data for scheduled articles
const scheduledArticles = [
  { id: '1', title: 'How to Boost Your SEO Rankings', date: '2025-03-22', status: 'upcoming' },
  { id: '2', title: 'The Ultimate Guide to Content Marketing', date: '2025-03-14', status: 'published' },
];

// Mock data for available articles
const availableArticles = [
  { id: '3', title: 'Top 10 Digital Marketing Strategies', status: 'draft' },
  { id: '4', title: 'Social Media Marketing in 2025', status: 'draft' },
  { id: '5', title: 'Email Marketing Best Practices', status: 'draft' },
  { id: '6', title: 'Content Creation Tips for Beginners', status: 'draft' },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
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
  
  // Handle article selection in modal
  const handleArticleToggle = (articleId: string) => {
    setSelectedArticles(prev => 
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };
  
  // Handle scheduling submission
  const handleScheduleSubmit = () => {
    // Here you would implement the API call to schedule the articles
    console.log('Scheduling articles:', selectedArticles, 'for date:', selectedDay);
    setIsModalOpen(false);
    setShowSuccessAlert(true);
  };
  
  // Get scheduled articles for a specific day
  const getScheduledArticlesForDay = (day: Date) => {
    const dateString = format(day, 'yyyy-MM-dd');
    return scheduledArticles.filter(article => article.date === dateString);
  };
  
  // Determine day status (has upcoming, published, or no articles)
  const getDayStatus = (day: Date) => {
    const articles = getScheduledArticlesForDay(day);
    if (articles.length === 0) return 'none';
    if (articles.some(article => article.status === 'upcoming')) return 'upcoming';
    return 'published';
  };
  
  return (
    <DashboardContent>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Content Calendar
        </Typography>
        
        {/* Calendar Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <IconButton onClick={prevMonth}>
            <ChevronLeft />
          </IconButton>
          
          <Typography variant="h5">
            {format(currentDate, 'MMMM yyyy').toUpperCase()}
          </Typography>
          
          <IconButton onClick={nextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
      
      {/* Calendar Grid */}
      <Paper sx={{ 
        flex: 1, 
        border: '1px solid', 
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Weekday Headers */}
        <Grid container sx={{ borderBottom: '1px dashed', borderColor: 'divider' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <Grid 
              item 
              xs={12/7} 
              key={i}
              sx={{ 
                p: 1, 
                textAlign: 'center',
                borderRight: i < 6 ? '1px dashed' : 'none',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle2">{day}</Typography>
            </Grid>
          ))}
        </Grid>
        
        {/* Calendar Days */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Grid container sx={{ flex: 1 }}>
            {daysInMonth.map((day, i) => {
              const dayStatus = getDayStatus(day);
              const isCurrentDay = isToday(day);
              
              return (
                <Grid 
                  item 
                  xs={12/7} 
                  key={i}
                  sx={{ 
                    height: '20%',
                    position: 'relative',
                    p: 1,
                    borderRight: (i + 1) % 7 !== 0 ? '1px dashed' : 'none',
                    borderBottom: '1px dashed',
                    borderColor: 'divider',
                    bgcolor: isCurrentDay ? 'action.selected' : 'background.paper',
                    '&:hover .add-button': {
                      opacity: 1,
                    },
                  }}
                >
                  <Box sx={{ 
                    height: '100%',
                    p: 1,
                    borderRadius: 1,
                    bgcolor: dayStatus === 'upcoming' 
                      ? 'success.light' 
                      : dayStatus === 'published' 
                        ? 'warning.light' 
                        : 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: isCurrentDay ? 'bold' : 'regular',
                      }}
                    >
                      {format(day, 'd')}
                    </Typography>
                    
                    {/* Day content - scheduled articles */}
                    <Box sx={{ mt: 1, flex: 1 }}>
                      {getScheduledArticlesForDay(day).map((article, idx) => (
                        <Typography 
                          key={idx} 
                          variant="caption" 
                          sx={{ 
                            display: 'block',
                            mb: 0.5,
                            color: article.status === 'upcoming' ? 'success.dark' : 'warning.dark',
                            fontWeight: 'medium',
                          }}
                        >
                          {article.title.length > 20 ? `${article.title.substring(0, 20)}...` : article.title}
                        </Typography>
                      ))}
                    </Box>
                    
                    {/* Add button (visible on hover) */}
                    <IconButton
                      className="add-button"
                      size="small"
                      onClick={() => handleDayClick(day)}
                      sx={{ 
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                        },
                      }}
                    >
                      <Plus size={16} />
                    </IconButton>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Paper>
      
      {/* Scheduling Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeAfterTransition
      >
        <Fade in={isModalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 600 },
              maxHeight: '90vh',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              overflow: 'auto',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">
                Schedule Content for {selectedDay ? format(selectedDay, 'MMMM d, yyyy') : ''}
              </Typography>
              <IconButton onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </IconButton>
            </Box>
            
            {/* Already scheduled content section */}
            {selectedDay && getScheduledArticlesForDay(selectedDay).length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  Already Scheduled
                </Typography>
                <List disablePadding>
                  {getScheduledArticlesForDay(selectedDay).map(article => (
                    <ListItem 
                      key={article.id}
                      sx={{ 
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <ListItemText 
                        primary={article.title}
                        secondary={`Status: ${article.status === 'upcoming' ? 'Scheduled' : 'Published'}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            {/* Available articles to schedule */}
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              Available Articles
            </Typography>
            
            {availableArticles.length > 0 ? (
              <>
                <List disablePadding>
                  {availableArticles.map(article => (
                    <ListItem 
                      key={article.id}
                      sx={{ 
                        bgcolor: 'background.default',
                        borderRadius: 1,
                        mb: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Checkbox
                        checked={selectedArticles.includes(article.id)}
                        onChange={() => handleArticleToggle(article.id)}
                      />
                      <ListItemText 
                        primary={article.title}
                        secondary={`Status: ${article.status}`}
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsModalOpen(false)}
                    sx={{ mr: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleScheduleSubmit}
                    disabled={selectedArticles.length === 0}
                  >
                    Schedule Selected
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No articles available for scheduling. Create new content first.
              </Typography>
            )}
          </Box>
        </Fade>
      </Modal>
      
      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={4000}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessAlert(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          Articles scheduled successfully!
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
} 