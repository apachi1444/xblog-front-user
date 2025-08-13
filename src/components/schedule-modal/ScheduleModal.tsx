import toast from 'react-hot-toast';
import dayjs, { type Dayjs } from 'dayjs';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { alpha, useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  Chip,
  Card,
  Alert,
  Stack,
  Dialog,
  Button,
  Divider,
  Typography,
  DialogTitle,
  CardContent,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import { useGetArticlesQuery, useUpdateArticleMutation } from 'src/services/apis/articlesApi';

import { Iconify } from 'src/components/iconify';



interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  articleId: string;
  articleTitle: string;
}

export function ScheduleModal({ open, onClose, articleId, articleTitle }: ScheduleModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  // API hooks
  const [updateArticle, { isLoading }] = useUpdateArticleMutation();
  const { data: articlesData } = useGetArticlesQuery({ page: 1, limit: 100 });

  // State management
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [error, setError] = useState<string | null>(null);

  // Get scheduled articles from API data
  const scheduledArticles = articlesData?.articles?.filter(article => article.status === 'scheduled') || [];

  // Filter articles for selected date
  const articlesOnSelectedDate = scheduledArticles.filter(article => {
    if (!selectedDate || !article.scheduled_publish_date) return false;
    const articleDate = dayjs(article.scheduled_publish_date);
    return articleDate.isSame(selectedDate, 'day');
  });

  // Check for time conflicts (within 30 minutes)
  const hasTimeConflict = (newDate: Dayjs) => articlesOnSelectedDate.some(article => {
      if (!article.scheduled_publish_date) return false;
      const existingDate = dayjs(article.scheduled_publish_date);
      const timeDiff = Math.abs(newDate.diff(existingDate, 'minute'));
      return timeDiff < 30; // 30 minutes
    });

  const timeConflict = selectedDate ? hasTimeConflict(selectedDate) : false;

  // Handle scheduling
  const handleSchedule = async () => {
    if (isLoading) return; // Prevent double-clicking

    if (!selectedDate) {
      setError('Please select a date and time');
      return;
    }

    if (selectedDate.isBefore(dayjs())) {
      setError('Please select a future date and time');
      return;
    }

    setError(null);

    try {
      // Call the update article API to schedule the article
      await updateArticle({
        id: articleId,
        data: {
          status: 'scheduled',
          scheduled_publish_date: selectedDate.toISOString(),
        }
      }).unwrap();

      // Success - close modal and show success message
      toast.success(t('schedule.success', 'Article scheduled successfully!'), {
        duration: 3000,
        icon: '📅',
      });

      // Close modal after a short delay to let user see the success message
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to schedule article. Please try again.');
      toast.error('Failed to schedule article. Please try again.');
    }
  };

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedDate(dayjs());
      setError(null);
    }
  }, [open]);

  const formatTime = (dateString: string) => dayjs(dateString).format('h:mm A');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            minHeight: 500,
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon="mdi:calendar-clock" width={20} height={20} sx={{ color: theme.palette.primary.main }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('schedule.title', 'Schedule Article')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {articleTitle}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3}>
            {/* Date Time Picker */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                {t('schedule.selectDateTime', 'Select Date & Time')}
              </Typography>
              <DateTimePicker
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                minDateTime={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error && !selectedDate,
                    helperText: !selectedDate ? 'Please select a date and time' : '',
                  }
                }}
              />
            </Box>

            {/* Time Conflict Warning */}
            {timeConflict && (
              <Alert severity="warning" icon={<Iconify icon="mdi:clock-alert" />}>
                <Typography variant="body2">
                  {t('schedule.timeConflict', 'Another article is scheduled within 30 minutes of this time. Consider choosing a different time to avoid conflicts.')}
                </Typography>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert severity="error" icon={<Iconify icon="mdi:alert-circle" />}>
                <Typography variant="body2">{error}</Typography>
              </Alert>
            )}

            {/* Scheduled Articles for Selected Date */}
            {selectedDate && articlesOnSelectedDate.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                  {t('schedule.scheduledArticles', 'Articles Scheduled for')} {selectedDate.format('MMMM D, YYYY')}
                </Typography>
                <Stack spacing={1}>
                  {articlesOnSelectedDate.map((article) => (
                    <Card key={article.id} variant="outlined" sx={{ bgcolor: alpha(theme.palette.info.main, 0.04) }}>
                      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {article.article_title || article.title || 'Untitled Article'}
                          </Typography>
                          <Chip
                            label={article.scheduled_publish_date ? formatTime(article.scheduled_publish_date) : 'No time set'}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Scheduling Tips */}
            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: theme.palette.primary.main }}>
                <Iconify icon="mdi:lightbulb" width={16} height={16} sx={{ mr: 0.5 }} />
                {t('schedule.tips', 'Scheduling Tips')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                • {t('schedule.tip1', 'Schedule during peak audience hours for better engagement')}<br />
                • {t('schedule.tip2', 'Allow at least 30 minutes between articles')}<br />
                • {t('schedule.tip3', 'You can reschedule or cancel anytime from the calendar')}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} variant="outlined" disabled={isLoading}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={handleSchedule}
            variant="contained"
            disabled={isLoading || !selectedDate || selectedDate.isBefore(dayjs())}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <Iconify icon="mdi:calendar-check" />}
            sx={{
              minWidth: 140,
              '&:disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              }
            }}
          >
            {isLoading ? t('schedule.scheduling', 'Scheduling...') : t('schedule.scheduleNow', 'Schedule Article')}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
