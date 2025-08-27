/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
// Types
import type { Store } from 'src/types/store';
import type { PublishRequest} from 'src/services/apis/integrations/publishApi';

import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useMemo, useState, useEffect } from 'react';

import {
  Box,
  Chip,
  Modal,
  Alert,
  Radio,
  Stack,
  Button,
  Select,
  Divider,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  FormControl,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

// API hooks
import { useGetStoresQuery } from 'src/services/apis/storesApi';
import { useUpdateArticleMutation } from 'src/services/apis/articlesApi';
import { useScheduleArticleMutation } from 'src/services/apis/calendarApis';
import { usePublishWordPressMutation } from 'src/services/apis/integrations/publishApi';

import { Iconify } from 'src/components/iconify';

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  articleId?: string | null; // Add articleId prop
  articleInfo: {
    title: string;
    metaTitle: string;
    metaDescription: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    language: string;
    targetCountry: string;
    createdAt: string;
    status: string;
  };
}

export const PublishModal = ({ open, onClose, articleId, articleInfo }: PublishModalProps) => {
  // Hooks
  const router = useRouter();

  const articleStatus = articleInfo.status

  // API hooks
  const { data: storesData, isLoading: isLoadingStores } = useGetStoresQuery();
  const [updateArticle] = useUpdateArticleMutation();
  const [publishWordPress] = usePublishWordPressMutation();
  const [scheduleArticle] = useScheduleArticleMutation();

  // State
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [publishingSchedule, setPublishingSchedule] = useState(
    articleStatus === 'draft' ? 'now' : 'draft' // Default to 'draft' if article is already published/scheduled
  );
  const [schedulingSettings, setSchedulingSettings] = useState<{
    date: string;
    time: string;
  }>({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm')
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingStep, setPublishingStep] = useState<'selection' | 'publishing' | 'success'>('selection');
  const [successMessage, setSuccessMessage] = useState('');
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  // Get stores from API with useMemo to prevent unnecessary re-renders
  const stores = useMemo(() => storesData?.stores || [], [storesData?.stores]);

  // Helper functions for multi-store selection
  const selectStore = (storeId: number) => {
    setSelectedStore(storeId);
  };

  const deselectStore = () => {
    setSelectedStore(null);
  };

  const isStoreSelected = (storeId: number) => selectedStore === storeId;

  // Get current date and time for validation
  const now = new Date();
  const currentDate = format(now, 'yyyy-MM-dd');
  const currentTime = format(now, 'HH:mm');

  // Get minimum date (today)
  const minDate = currentDate;

  // Get minimum time (current time if date is today, otherwise 00:00)
  const getMinTime = (selectedDate: string) => selectedDate === currentDate ? currentTime : '00:00';

  // Update scheduling settings with validation
  const updateSchedulingSettings = (updates: Partial<typeof schedulingSettings>) => {
    const validatedUpdates = { ...updates };

    // Validate date and time to prevent scheduling in the past
    if (updates.date || updates.time) {
      const finalDate = updates.date || schedulingSettings.date;
      const finalTime = updates.time || schedulingSettings.time;

      // If selecting today, ensure time is not in the past
      if (finalDate === currentDate && finalTime < currentTime) {
        validatedUpdates.time = currentTime;

        // Show warning toast
        toast.error('Cannot schedule in the past. Time updated to current time.', {
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

    setSchedulingSettings(prev => ({
      ...prev,
      ...validatedUpdates
    }));
  };

  useEffect(() => {
    if (open) {
      setPublishingStep('selection');
      setIsPublishing(false);
      setSuccessMessage('');
      setSelectedStore(null); // Reset store selection to force user to choose
      // Reset scheduling settings
      setSchedulingSettings({
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm')
      });
      setPublishingSchedule(articleStatus === 'draft' ? 'now' : 'draft');
      setRedirectCountdown(3);
    }
  }, [open, articleId, articleStatus]);

  const handlePublish = async () => {
    if (publishingSchedule === 'draft') {
      try {
        // Only update status if it's not already draft
        if (articleStatus !== 'draft' && articleId) {
          await updateArticle({
            id: articleId,
            data: { status: 'draft' }
          }).unwrap();
          toast.success('Article saved as draft successfully!');
        }
        router.push('/blog');
        onClose();
        return;
      } catch (error) {
        toast.error('Failed to save as draft. Please try again.');
        return;
      }
    }

    // Validate store selection for publish/schedule
    if (!selectedStore) {
      toast.error('Please select a store before publishing');
      return;
    }

    if (!articleId) {
      toast.error('Article ID is missing. Please save your article as a draft first.');
      return;
    }

    // Validate date for scheduling
    if (publishingSchedule === 'schedule') {
      if (!schedulingSettings.date || !schedulingSettings.time) {
        toast.error('Please select a date and time for scheduling');
        return;
      }

      // Check if scheduling in the past
      const scheduledDateTime = `${schedulingSettings.date}T${schedulingSettings.time}:00.000Z`;
      const scheduledDate = new Date(scheduledDateTime);
      if (scheduledDate <= new Date()) {
        toast.error('Please select a future date and time');
        return;
      }
    }

    setIsPublishing(true);
    setPublishingStep('publishing');

    try {
      // Get selected store
      const store = stores.find(s => s.id === selectedStore);

      if (!store) {
        throw new Error('Store not found');
      }

      if (publishingSchedule === 'schedule') {
        // Handle scheduling
        const scheduledDateTime = `${schedulingSettings.date}T${schedulingSettings.time}:00.000Z`;
        const scheduleData = {
          store_id: selectedStore,
          article_id: Number(articleId),
          scheduled_date: scheduledDateTime,
        };
        await scheduleArticle(scheduleData).unwrap();
        setSuccessMessage('Article scheduled successfully!');
        setPublishingStep('success');

        // Start countdown for auto-redirect
        setRedirectCountdown(3);
        const countdownInterval = setInterval(() => {
          setRedirectCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              router.push('/blog');
              onClose();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Handle immediate publishing
        const publishData: PublishRequest = {
          store_id: selectedStore,
          article_id: Number(articleId) || 0,
          scheduled_date: new Date().toISOString(),
        };

        console.log('🚀 Publishing article with data:', publishData);

        const platform = store.category?.toLowerCase();

        if (platform === 'wordpress') {
          // Use WordPress API
          await publishWordPress(publishData).unwrap();
          setSuccessMessage('Content published successfully!');
          setPublishingStep('success');

          // Start countdown for auto-redirect
          setRedirectCountdown(3);
          const countdownInterval = setInterval(() => {
            setRedirectCountdown(prev => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                router.push('/blog');
                onClose();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          // For non-WordPress platforms, show not supported message
          throw new Error(`Publishing to ${store.platform || 'this platform'} is not supported yet. Only WordPress is currently available.`);
        }
      }

    } catch (error: any) {
      setIsPublishing(false);
      setPublishingStep('selection');

      // Handle different types of errors
      if (error?.status === 401) {
        toast.error('Authentication failed. Please reconnect your store.');
      } else if (error?.status === 403) {
        toast.error('Permission denied. Check your store permissions.');
      } else if (error?.status === 429) {
        toast.error('Rate limit exceeded. Please try again later.');
      } else if (error?.status === 500) {
        toast.error('Server error occurred. Please try again later.');
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Failed to process request. Please try again.';
        toast.error(errorMessage);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleClose = (event?: any) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (!isPublishing) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="publish-modal-title"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Box
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 500 },
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}>
        {publishingStep === 'selection' && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography id="publish-modal-title" variant="h6" component="h2">
                Publish Article
              </Typography>
              <IconButton onClick={handleClose} size="small">
                <Iconify icon="eva:close-fill" />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose where and when to publish your article
            </Typography>

            {/* Store Selection */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2">
                  Select Store {selectedStore && '(1 selected)'}
                </Typography>
                {selectedStore && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={deselectStore}
                    startIcon={<Iconify icon="eva:close-circle-outline" />}
                  >
                    Deselect
                  </Button>
                )}
              </Box>

              {selectedStore && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Selected store:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(() => {
                      const store = stores.find(s => s.id === selectedStore);
                      return store ? (
                        <Chip
                          key={selectedStore}
                          label={`${selectedStore}. ${store.name}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                          onDelete={() => deselectStore()}
                        />
                      ) : null;
                    })()}
                  </Box>
                </Box>
              )}
              {isLoadingStores ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : stores.length > 0 ? (
                <Box>
                  {stores.map((store: Store) => {
                    const isWordPress = store.category?.toLowerCase() === 'wordpress';
                    const isSelected = isStoreSelected(store.id);
                    console.log('🏪 Store:', store.name, 'Category:', store.category, 'isWordPress:', isWordPress, 'isSelected:', isSelected);

                    return (
                      <FormControlLabel
                        key={store.id}
                        control={
                          <Radio
                            checked={isSelected}
                            onChange={() => {
                              console.log('📻 Radio onChange for store:', store.id, store.name);
                              selectStore(store.id);
                            }}
                            name="store-selection"
                          />
                        }
                        disabled={!isWordPress}
                        onClick={() => {
                          console.log('🖱️ FormControlLabel clicked for store:', store.id, store.name);
                          if (isWordPress) {
                            selectStore(store.id);
                          }
                        }}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {store.logo ? (
                              <img
                                src={store.logo}
                                alt={store.name}
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  opacity: isWordPress ? 1 : 0.5
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  bgcolor: 'primary.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  opacity: isWordPress ? 1 : 0.5
                                }}
                              >
                                {store.name.charAt(0).toUpperCase()}
                              </Box>
                            )}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 500,
                                  opacity: isWordPress ? 1 : 0.5
                                }}
                              >
                                {store.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    opacity: isWordPress ? 1 : 0.5
                                  }}
                                >
                                  {store.category || 'Unknown Platform'}
                                </Typography>
                                {!isWordPress && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: 'warning.main',
                                      fontWeight: 'bold',
                                      fontSize: '10px'
                                    }}
                                  >
                                    (Not Supported)
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        }
                        sx={{
                          my: 0.5,
                          opacity: isWordPress ? 1 : 0.6
                        }}
                      />
                    );
                  })}
                </Box>
              ) : (
                <Alert
                  severity="warning"
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        router.push('/websites/add');
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
                      Add Website
                    </Button>
                  }
                >
                  No stores available. Please connect a store first.
                </Alert>
              )}
            </Box>

            {/* Status Info Alert */}
            {articleStatus !== 'draft' && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  {articleStatus === 'published'
                    ? 'This article is already published. You can only save changes as a draft.'
                    : 'This article is scheduled for publishing. You can only save changes as a draft.'
                  }
                </Typography>
              </Alert>
            )}

            {/* Publishing Schedule */}
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Publishing Schedule</InputLabel>
                <Select
                  value={publishingSchedule}
                  label="Publishing Schedule"
                  onChange={(e) => setPublishingSchedule(e.target.value as string)}
                >
                  {/* Show "Publish Now" only for draft articles */}
                  {articleStatus === 'draft' && (
                    <MenuItem value="now">Publish Now</MenuItem>
                  )}

                  {/* Show "Schedule for Later" only for draft articles */}
                  {articleStatus === 'draft' && (
                    <MenuItem value="schedule">Schedule for Later</MenuItem>
                  )}

                  {/* Always show "Save as Draft" */}
                  <MenuItem value="draft">Save as Draft</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Date and Time Selection - Show only when scheduling */}
            {publishingSchedule === 'schedule' && (
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <TextField
                  type="date"
                  label="Select Date"
                  value={schedulingSettings.date}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    // If selecting today and current time is in the past, update time to current
                    if (newDate === currentDate && schedulingSettings.time < currentTime) {
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
                  sx={{
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                      cursor: 'pointer',
                      fontSize: '16px',
                      opacity: 0.7,
                      '&:hover': {
                        opacity: 1,
                      },
                    },
                  }}
                />
                <TextField
                  type="time"
                  label="Select Time"
                  value={schedulingSettings.time}
                  onChange={(e) => updateSchedulingSettings({ time: e.target.value })}
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: getMinTime(schedulingSettings.date), // Prevent selecting past times for today
                  }}
                  sx={{
                    '& input[type="time"]::-webkit-calendar-picker-indicator': {
                      cursor: 'pointer',
                      fontSize: '16px',
                      opacity: 0.7,
                      '&:hover': {
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Stack>
            )}

            {/* Draft Info - Show when Save as Draft is selected */}
            {publishingSchedule === 'draft' && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Your article will be saved and you&apos;ll be redirected to the blog page. You can publish it later from there.
                </Typography>
              </Alert>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={handleClose}>
                Cancel
              </Button>

              {/* Show "Add Website" button when no stores available */}
              {stores.length === 0 ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    router.push('/websites/add');
                    onClose();
                  }}
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  sx={{
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    }
                  }}
                >
                  Add Website
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handlePublish}
                  disabled={
                    isPublishing ||
                    // For draft, no validation needed
                    (publishingSchedule === 'draft' ? false :
                    // For publish/schedule, need store selection
                    !selectedStore ||
                    // For schedule, also need date and time selection
                    (publishingSchedule === 'schedule' && (!schedulingSettings.date || !schedulingSettings.time)) ||
                    // Check if store supports WordPress
                    (() => {
                      const store = stores.find(s => s.id === selectedStore);
                      return publishingSchedule !== 'draft' && store?.category?.toLowerCase() !== 'wordpress';
                    })())
                  }
                  startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                  sx={{
                    bgcolor: 'success.main',
                    '&:hover': {
                      bgcolor: 'success.dark',
                    }
                  }}
                >
                  {publishingSchedule === 'now' ? 'Publish Now' :
                   publishingSchedule === 'schedule' ? 'Schedule' :
                   'Save as Draft'}
                </Button>
              )}
            </Box>
          </>
        )}

        {publishingStep === 'publishing' && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              {/* Enhanced loading animation */}
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  size={80}
                  thickness={4}
                  sx={{
                    color: 'primary.main',
                    animationDuration: '1.5s'
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" component="div" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    📝
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ maxWidth: 400 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Publishing your article...
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {(() => {
                    const store = stores.find(s => s.id === selectedStore);
                    return `Publishing to ${store?.name || 'selected store'} via ${store?.category || 'Unknown Platform'}`;
                  })()}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Please wait while we publish your content to WordPress...
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {publishingStep === 'success' && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Iconify
              icon="eva:checkmark-circle-2-fill"
              sx={{ fontSize: 64, color: 'success.main', mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              {publishingSchedule === 'now' ? 'Article Published Successfully!' :
               publishingSchedule === 'schedule' ? 'Article Scheduled Successfully!' :
               publishingSchedule === 'draft' ? 'Article Saved as Draft!' :
               'Action Completed Successfully!'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
              {successMessage || 'Your article has been processed successfully.'}
            </Typography>

            {/* Additional info based on publishing type */}
            {publishingSchedule === 'schedule' && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                You will receive a notification when the article is published.
              </Typography>
            )}

            {publishingSchedule === 'draft' && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                You can publish this draft anytime from your store&apos;s admin panel.
              </Typography>
            )}

            {/* Countdown and redirect info */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Redirecting to blog page in {redirectCountdown} seconds...
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{ borderRadius: '24px' }}
              >
                Stay Here
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  router.push('/blog');
                  onClose();
                }}
                sx={{ borderRadius: '24px' }}
              >
                Go to Blog Now
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};
