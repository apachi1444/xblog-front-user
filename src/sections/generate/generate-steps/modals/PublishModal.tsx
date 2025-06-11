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

// API hooks
import { useGetStoresQuery } from 'src/services/apis/storesApi';
import {
  usePublishWixMutation,
  usePublishShopifyMutation,
  usePublishWordPressMutation
} from 'src/services/apis/integrations/publishApi';

import { Iconify } from 'src/components/iconify';

import type { ArticleSection } from '../../schemas';

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
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

export const PublishModal = ({ open, onClose, articleInfo, sections }: PublishModalProps) => {
  // API hooks
  const { data: storesData, isLoading: isLoadingStores } = useGetStoresQuery();
  const [publishWordPress] = usePublishWordPressMutation();
  const [publishWix] = usePublishWixMutation();
  const [publishShopify] = usePublishShopifyMutation();

  // State
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [publishingSchedule, setPublishingSchedule] = useState('now');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingStep, setPublishingStep] = useState<'selection' | 'publishing' | 'success'>('selection');
  const [successMessage, setSuccessMessage] = useState('');

  // Get stores from API with useMemo to prevent unnecessary re-renders
  const stores = useMemo(() => storesData?.stores || [], [storesData?.stores]);

  useEffect(() => {
    if (stores.length > 0 && !selectedStore) {
      setSelectedStore(stores[0].id);
    }
  }, [stores, selectedStore]);

  // Reset modal state when opened
  useEffect(() => {
    if (open) {
      setPublishingStep('selection');
      setIsPublishing(false);
      setSuccessMessage('');
    }
  }, [open]);

  // Handle publish action
  const handlePublish = async () => {
    if (!selectedStore) {
      toast.error('Please select a store before publishing');
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

      // Determine which publish API to use based on store platform
      let publishResult: PublishResult;

      const publishData = {
        store_id: String(selectedStore),
        article_id: 'current-article-id', // This would come from the article being created
        scheduled_date: publishingSchedule === 'schedule' ? new Date().toISOString() : undefined,
      };

      switch (store.platform?.toLowerCase()) {
        case 'wordpress':
          publishResult = await publishWordPress(publishData).unwrap() as PublishResult;
          break;
        case 'wix':
          publishResult = await publishWix(publishData).unwrap() as PublishResult;
          break;
        case 'shopify':
          publishResult = await publishShopify(publishData).unwrap() as PublishResult;
          break;
        default:
          // Mock API call for testing - simulate different publishing modes
          await new Promise(resolve => setTimeout(resolve, 3000));

          // Simulate different responses based on publishing schedule
          if (publishingSchedule === 'now') {
            publishResult = {
              success: true,
              message: `Article "${articleInfo.title}" has been published successfully to ${store.name}!`
            };
          } else if (publishingSchedule === 'schedule') {
            publishResult = {
              success: true,
              message: `Article "${articleInfo.title}" has been scheduled for later publication on ${store.name}!`
            };
          } else if (publishingSchedule === 'draft') {
            publishResult = {
              success: true,
              message: `Article "${articleInfo.title}" has been saved as draft on ${store.name}!`
            };
          } else {
            publishResult = {
              success: true,
              message: `Article "${articleInfo.title}" has been processed successfully!`
            };
          }

          // Simulate occasional failures for testing (10% chance)
          if (Math.random() < 0.1) {
            publishResult = {
              success: false,
              message: 'Mock error: Connection timeout. Please try again.'
            };
          }
      }

      if (publishResult.success) {
        setSuccessMessage(publishResult.message || 'Content published successfully!');
        setPublishingStep('success');
        toast.success(publishResult.message || 'Content published successfully!');
      } else {
        throw new Error(publishResult.message || 'Unknown error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish content. Please try again.';
      toast.error(errorMessage);
      setPublishingStep('selection');
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
                  {stores.map((store: Store) => (
                    <FormControlLabel
                      key={store.id}
                      value={store.id.toString()}
                      control={<Radio />}
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
                                objectFit: 'cover'
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
                                fontWeight: 'bold'
                              }}
                            >
                              {store.name.charAt(0).toUpperCase()}
                            </Box>
                          )}
                          <Typography>{store.name}</Typography>
                        </Box>
                      }
                      sx={{ my: 0.5 }}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <Alert severity="warning">
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
              <Button
                variant="contained"
                onClick={handlePublish}
                disabled={!selectedStore || stores.length === 0}
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
            </Box>
          </>
        )}

        {publishingStep === 'publishing' && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={48} />
              <Typography variant="h6" gutterBottom>
                Publishing your article...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we publish your content
              </Typography>
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

            <Button
              variant="contained"
              onClick={handleClose}
              sx={{ borderRadius: '24px', mt: 1 }}
            >
              Done
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};
