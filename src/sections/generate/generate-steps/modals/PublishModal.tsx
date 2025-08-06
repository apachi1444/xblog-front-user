// Types
import type { Store } from 'src/types/store';

import toast from 'react-hot-toast';
import { useMemo, useState, useEffect } from 'react';

import {
  Box,
  Modal,
  Radio,
  Alert,
  Button,
  Select,
  Divider,
  MenuItem,
  Typography,
  IconButton,
  InputLabel,
  RadioGroup,
  FormControl,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

// API hooks
import { useGetStoresQuery } from 'src/services/apis/storesApi';
import { PublishRequest, usePublishWordPressMutation } from 'src/services/apis/integrations/publishApi';

import { Iconify } from 'src/components/iconify';

import type { ArticleSection } from '../../schemas';

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
  };
  sections: ArticleSection[];
}

interface PublishResult {
  success: boolean;
  message?: string;
}

export const PublishModal = ({ open, onClose, articleId, articleInfo, sections }: PublishModalProps) => {
  // Hooks
  const router = useRouter();

  // API hooks
  const { data: storesData, isLoading: isLoadingStores } = useGetStoresQuery();
  const [publishWordPress] = usePublishWordPressMutation();

  // State
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [publishingSchedule, setPublishingSchedule] = useState('now');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingStep, setPublishingStep] = useState<'selection' | 'publishing' | 'success'>('selection');
  const [successMessage, setSuccessMessage] = useState('');
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  // Get stores from API with useMemo to prevent unnecessary re-renders
  const stores = useMemo(() => storesData?.stores || [], [storesData?.stores]);

  // Reset modal state when opened
  useEffect(() => {
    if (open) {
      console.log('📝 PublishModal opened with articleId:', articleId);
      setPublishingStep('selection');
      setIsPublishing(false);
      setSuccessMessage('');
      setSelectedStore(null); // Reset store selection to force user to choose
      setRedirectCountdown(3);
    }
  }, [open, articleId]);

  // Handle publish action
  const handlePublish = async () => {
    if (!selectedStore) {
      toast.error('Please select a store before publishing');
      return;
    }

    if (!articleId) {
      toast.error('Article ID is missing. Please save your article as a draft first.');
      return;
    }

    setIsPublishing(true);
    setPublishingStep('publishing');

    try {
      // Get selected store
      const store = stores.find(s => s.id === selectedStore);

      if (!store) {
        throw new Error('Store not found');
      }

      const publishData :  PublishRequest = {
        store_id: selectedStore,
        article_id: Number(articleId) || 0, // Use the actual article ID from props
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
        const errorMessage = error instanceof Error ? error.message : 'Failed to publish content. Please try again.';
        toast.error(errorMessage);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleClose = () => {
    if (!isPublishing) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="publish-modal-title"
    >
      <Box sx={{
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
              <Typography variant="subtitle2" gutterBottom>
                Select Store
              </Typography>
              {isLoadingStores ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : stores.length > 0 ? (
                <RadioGroup
                  value={selectedStore?.toString() || ''}
                  onChange={(e) => setSelectedStore(Number(e.target.value))}
                >
                  {stores.map((store: Store) => {
                    const isWordPress = store.category?.toLowerCase() === 'wordpress';

                    return (
                      <FormControlLabel
                        key={store.id}
                        value={store.id.toString()}
                        control={<Radio />}
                        disabled={!isWordPress}
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
                </RadioGroup>
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

            {/* Publishing Schedule */}
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Publishing Schedule</InputLabel>
                <Select
                  value={publishingSchedule}
                  label="Publishing Schedule"
                  onChange={(e) => setPublishingSchedule(e.target.value as string)}
                >
                  <MenuItem value="now">Publish Now</MenuItem>
                  <MenuItem value="schedule">Schedule for Later</MenuItem>
                  <MenuItem value="draft">Save as Draft</MenuItem>
                </Select>
              </FormControl>
            </Box>

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
                    !selectedStore ||
                    stores.length === 0 ||
                    stores.find(s => s.id === selectedStore)?.category?.toLowerCase() !== 'wordpress'
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
