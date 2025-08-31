
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Fade,
  Modal,
  Stack,
  alpha,
  Alert,
  Button,
  Select,
  useTheme,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { convertLocalDateTimeToUTC } from 'src/utils/constants';

import { useGetStoresQuery } from 'src/services/apis/storesApi';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';
import { useDeleteCalendarMutation, useScheduleArticleMutation, useGetScheduledArticlesQuery } from 'src/services/apis/calendarApis';

import { Iconify } from 'src/components/iconify';

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  articleId: string;
  articleTitle: string;
  isReschedule?: boolean; // Flag to indicate this is a reschedule operation
}

export function ScheduleModal({ open, onClose, articleId, articleTitle, isReschedule = false }: ScheduleModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  // Get current store and all stores
  const currentStore = useSelector(selectCurrentStore);
  const { data: storesData } = useGetStoresQuery();
  const stores = storesData?.stores || [];

  // API hooks
  const [scheduleArticle, { isLoading }] = useScheduleArticleMutation();
  const [deleteCalendar] = useDeleteCalendarMutation();
  const { data: calendarData } = useGetScheduledArticlesQuery();

  // Enhanced scheduling state - similar to SchedulingModal
  const [articleSchedulingSettings, setArticleSchedulingSettings] = useState<{
    storeId: number;
    date: string;
    time: string;
  }>({
    storeId: currentStore?.id || 1,
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm')
  });

  // Get current date and time for validation
  const now = new Date();
  const currentDate = format(now, 'yyyy-MM-dd');
  const currentTime = format(now, 'HH:mm');

  // Get minimum date (today)
  const minDate = currentDate;

  // Get minimum time (current time if date is today, otherwise 00:00)
  const getMinTime = (selectedDate: string) => selectedDate === currentDate ? currentTime : '00:00';

  // Update scheduling settings with validation
  const updateSchedulingSettings = (updates: Partial<typeof articleSchedulingSettings>) => {
    const validatedUpdates = { ...updates };

    // Validate date and time to prevent scheduling in the past
    if (updates.date || updates.time) {
      const finalDate = updates.date || articleSchedulingSettings.date;
      const finalTime = updates.time || articleSchedulingSettings.time;

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
      ...validatedUpdates
    }));
  };

  // Handle scheduling
  const handleSchedule = async () => {
    if (isLoading) return;
    // Validate inputs
    if (!articleSchedulingSettings.storeId) {
      toast.error('Please select a store before scheduling');
      return;
    }

    if (!articleSchedulingSettings.date || !articleSchedulingSettings.time) {
      toast.error('Please select a date and time');
      return;
    }

    // Check if scheduling in the past - convert local time to UTC for comparison
    const scheduledDateTimeUTC = convertLocalDateTimeToUTC(
      articleSchedulingSettings.date,
      articleSchedulingSettings.time
    );
    const scheduledDate = new Date(scheduledDateTimeUTC);
    if (scheduledDate <= new Date()) {
      toast.error('Please select a future date and time');
      return;
    }

    try {
      // If this is a reschedule operation, first delete the existing schedule
      if (isReschedule) {
        // Find the existing calendar entry for this article
        const existingEntry = calendarData?.calendars?.find(
          (entry) => entry.article_id === parseInt(articleId, 10)
        );

        if (existingEntry) {
          // Show loading toast for unscheduling
          toast.loading('Unscheduling existing appointment...', { id: 'unschedule' });

          try {
            await deleteCalendar(existingEntry.id).unwrap();
            toast.success('Existing schedule removed', { id: 'unschedule' });
          } catch (deleteError) {
            toast.error('Failed to remove existing schedule', { id: 'unschedule' });
            throw deleteError; // Stop the process if unscheduling fails
          }
        } else {
          console.warn('No existing schedule found for rescheduling');
        }
      }
      toast.loading('Creating new schedule...', { id: 'schedule' });

      // Create the new schedule - send UTC datetime to backend
      await scheduleArticle({
        store_id: articleSchedulingSettings.storeId,
        article_id: Number(articleId),
        scheduled_date: scheduledDateTimeUTC,
      }).unwrap()

      // Success - close modal and show success message
      const successMessage = isReschedule
        ? t('schedule.rescheduleSuccess', 'Article rescheduled successfully!')
        : t('schedule.success', 'Article scheduled successfully!');

      // Clear any loading toasts and show success
      toast.dismiss('unschedule');
      toast.dismiss('schedule');

      toast.success(successMessage, {
        duration: 3000,
        icon: '📅',
      });

      onClose();
    } catch (error: any) {
      // Clear any loading toasts
      toast.dismiss('unschedule');
      toast.dismiss('schedule');

      const errorMessage = error?.data?.message || 'Failed to schedule. Please try again.';
      toast.error(errorMessage);
    }
  };

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      if (isReschedule) {
        // For reschedule, find and pre-populate with existing schedule
        const existingEntry = calendarData?.calendars?.find(
          (entry) => entry.article_id === parseInt(articleId, 10)
        );

        if (existingEntry && existingEntry.scheduled_date) {
          const existingDate = new Date(existingEntry.scheduled_date);
          setArticleSchedulingSettings({
            storeId: existingEntry.store_id || currentStore?.id || 1,
            date: format(existingDate, 'yyyy-MM-dd'),
            time: format(existingDate, 'HH:mm')
          });
        } else {
          // Fallback to current date/time if no existing schedule found
          setArticleSchedulingSettings({
            storeId: currentStore?.id || 1,
            date: format(new Date(), 'yyyy-MM-dd'),
            time: format(new Date(), 'HH:mm')
          });
        }
      } else {
        // For new schedule, use current date/time
        setArticleSchedulingSettings({
          storeId: currentStore?.id || 1,
          date: format(new Date(), 'yyyy-MM-dd'),
          time: format(new Date(), 'HH:mm')
        });
      }
    }
  }, [open, currentStore, isReschedule, calendarData, articleId]);

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
          sx={{
            width: { xs: '90%', sm: 500 },
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="eva:calendar-fill" width={24} height={24} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {isReschedule
                      ? t('calendar.rescheduleArticle', 'Reschedule Article')
                      : t('calendar.scheduleArticle', 'Schedule Article')
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    maxWidth: 300,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {articleTitle}
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
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 3,
            }}
          >
            <Stack spacing={3}>
              {/* Store Selection */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                  {t('calendar.selectStore', 'Select Store')}
                </Typography>
                {stores.length > 0 ? (
                  <FormControl fullWidth size="small">
                    <InputLabel>{t('calendar.store', 'Store')}</InputLabel>
                    <Select
                      value={articleSchedulingSettings.storeId}
                      label={t('calendar.store', 'Store')}
                      onChange={(e) => updateSchedulingSettings({ storeId: Number(e.target.value) })}
                    >
                      {stores.map((store) => (
                        <MenuItem key={store.id} value={store.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {store.logo ? (
                              <img
                                src={store.logo}
                                alt={store.name}
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  bgcolor: 'primary.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '10px',
                                  fontWeight: 'bold',
                                }}
                              >
                                {store.name.charAt(0).toUpperCase()}
                              </Box>
                            )}
                            <Typography variant="body2">{store.name}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Alert
                    severity="warning"
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          router.push('/stores/add');
                          onClose();
                        }}
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        sx={{
                          borderColor: 'warning.main',
                          color: 'warning.main',
                          '&:hover': {
                            borderColor: 'warning.dark',
                            backgroundColor: 'warning.light',
                          }
                        }}
                      >
                        {t('stores.addWebsite', 'Add Website')}
                      </Button>
                    }
                  >
                    {t('stores.noStoresAvailable', 'No stores available. Please connect a store first.')}
                  </Alert>
                )}
              </Box>

              {/* Date and Time Selection */}
              <Stack direction="row" spacing={2}>
                <TextField
                  type="date"
                  label={t('calendar.selectDate', 'Select Date')}
                  value={articleSchedulingSettings.date}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    // If selecting today and current time is in the past, update time to current
                    if (newDate === currentDate && articleSchedulingSettings.time < currentTime) {
                      updateSchedulingSettings({
                        date: newDate,
                        time: currentTime
                      });
                    } else {
                      updateSchedulingSettings({ date: newDate });
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
                  value={articleSchedulingSettings.time}
                  onChange={(e) => updateSchedulingSettings({ time: e.target.value })}
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: getMinTime(articleSchedulingSettings.date), // Prevent selecting past times for today
                  }}
                />
              </Stack>
            </Stack>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 3,
              borderTop: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
              bgcolor: 'background.paper',
            }}
          >
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={onClose}
                disabled={isLoading}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                variant="contained"
                onClick={handleSchedule}
                disabled={isLoading || !articleSchedulingSettings.storeId || !articleSchedulingSettings.date || !articleSchedulingSettings.time}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 140,
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
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
