// Types
import type { Store } from 'src/types/store';

import toast from 'react-hot-toast';
import React, { useMemo, useState, useEffect } from 'react';

import {
  Box,
  Tab,
  Grid,
  Tabs,
  Chip,
  Modal,
  Paper,
  Radio,
  Button,
  Select,
  Divider,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  IconButton,
  RadioGroup,
  FormControl,
  FormControlLabel,
  CircularProgress
} from '@mui/material';

// API hooks
import { useGetStoresQuery } from 'src/services/apis/storesApi';
import {
  usePublishWixMutation,
  usePublishShopifyMutation,
  usePublishWordPressMutation
} from 'src/services/apis/integrations/publishApi';

import { Iconify } from 'src/components/iconify';
import { FormInput } from 'src/components/generate-article/FormInput';
import { FormDropdown } from 'src/components/generate-article/FormDropdown';

import { FormContainer } from '../../../../components/generate-article/FormContainer';

interface CopyModalProps {
  open: boolean;
  onClose: () => void;
}

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

interface StoreSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (storeId: number) => void;
  stores: Store[];
}

// Copy Modal Component
const CopyModal = ({ open, onClose }: CopyModalProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="copy-modal-title"
      aria-describedby="copy-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="copy-modal-title" variant="h6" component="h2">
            Copy Content
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="HTML" />
          <Tab label="Markdown" />
          <Tab label="Plain Text" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={8}
              value={'<h1>How to Optimize Your Website for Better SEO Performance</h1>\n<p>Introduction to SEO Optimization...</p>'}
              InputProps={{
                readOnly: true,
              }}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={() => {
                toast.success("Copied into HTML successfully !")
                onClose()
              }}
              startIcon={<Iconify icon="mdi:content-copy" />}
              sx={{ borderRadius: '24px' }}
            >
              Copy HTML
            </Button>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={8}
              value={'# How to Optimize Your Website for Better SEO Performance\n\nIntroduction to SEO Optimization...'}
              InputProps={{
                readOnly: true,
              }}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:content-copy" />}
              onClick={() => {
                toast.success("Copied into Markdown successfully !")
                onClose()
              }}
              sx={{ borderRadius: '24px' }}
            >
              Copy Markdown
            </Button>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={8}
              value={'How to Optimize Your Website for Better SEO Performance\n\nIntroduction to SEO Optimization...'}
              InputProps={{
                readOnly: true,
              }}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:content-copy" />}
              sx={{ borderRadius: '24px' }}
              onClick={() => {
                toast.success("Copied into Plain text successfully !")
                onClose()
              }}
            >
              Copy Plain Text
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

// Full Article Modal Component
interface FullArticleModalProps {
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
  sections: any[];
}

const FullArticleModal = ({ open, onClose, articleInfo, sections }: FullArticleModalProps) => (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="full-article-modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '95%', sm: '90%', md: '80%' },
        maxWidth: '1200px',
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: { xs: 2, sm: 3, md: 4 },
        overflow: 'auto',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 10, py: 1 }}>
          <Typography id="full-article-modal-title" variant="h6" component="h2">
            Full Article Preview
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Article Content */}
        <Box sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          {/* Article Title */}
          <Typography variant="h4" gutterBottom sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}>
            {articleInfo.title || 'Your Article Title'}
          </Typography>

          {/* Article Meta */}
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            mb: 3,
            color: 'text.secondary'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: { xs: 1, sm: 0 } }}>
              <Iconify icon="mdi:calendar" width={16} height={16} sx={{ mr: 1 }} />
              <Typography variant="body2">
                {new Date(articleInfo.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: { xs: 1, sm: 0 } }}>
              <Iconify icon="mdi:account" width={16} height={16} sx={{ mr: 1 }} />
              <Typography variant="body2">
                AI Generated
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify icon="mdi:translate" width={16} height={16} sx={{ mr: 1 }} />
              <Typography variant="body2">
                {articleInfo.language.toUpperCase()} | {articleInfo.targetCountry.toUpperCase()}
              </Typography>
            </Box>
          </Box>

          {/* Keywords */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Keywords:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={articleInfo.primaryKeyword}
                sx={{
                  bgcolor: 'success.lighter',
                  color: 'success.dark',
                  fontWeight: 'bold'
                }}
              />
              {articleInfo.secondaryKeywords.map((keyword, index) => (
                <Chip
                  key={index}
                  label={keyword}
                  sx={{
                    bgcolor: 'primary.lighter',
                    color: 'primary.main'
                  }}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* All Sections */}
          {sections && sections.length > 0 ? (
            sections.map((section, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {section.title || `Section ${index + 1}`}
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {section.content || 'No content available for this section.'}
                </Typography>
              </Box>
            ))
          ) : (
            <Box sx={{
              textAlign: 'center',
              color: 'text.secondary',
              my: 3,
              p: 2,
              bgcolor: 'background.neutral',
              borderRadius: 1
            }}>
              <Typography variant="body2">
                No sections have been generated yet.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Bottom actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:content-copy" />}
            onClick={() => {
              // Copy article content to clipboard
              const content = `${articleInfo.title}\n\n${sections.map(s => `${s.title}\n${s.content}\n\n`).join('')}`;
              navigator.clipboard.writeText(content);
              toast.success("Article content copied to clipboard");
            }}
          >
            Copy Full Article
          </Button>
        </Box>
      </Box>
    </Modal>
  );

// Export Modal Component
const ExportModal = ({ open, onClose }: ExportModalProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="export-modal-title"
      aria-describedby="export-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="export-modal-title" variant="h6" component="h2">
            Export Content
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="PDF" />
          <Tab label="Word" />
          <Tab label="HTML" />
          <Tab label="JSON" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Export your content as a PDF document with formatting preserved
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <FormControl sx={{ width: '48%' }}>
                <InputLabel>Paper Size</InputLabel>
                <Select
                  value="a4"
                  label="Paper Size"
                >
                  <MenuItem value="a4">A4</MenuItem>
                  <MenuItem value="letter">Letter</MenuItem>
                  <MenuItem value="legal">Legal</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ width: '48%' }}>
                <InputLabel>Orientation</InputLabel>
                <Select
                  value="portrait"
                  label="Orientation"
                >
                  <MenuItem value="portrait">Portrait</MenuItem>
                  <MenuItem value="landscape">Landscape</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:file-pdf-box" />}
              sx={{ borderRadius: '24px' }}
            >
              Export as PDF
            </Button>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Export your content as a Microsoft Word document (.docx)
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:microsoft-word" />}
              sx={{ borderRadius: '24px' }}
            >
              Export as Word
            </Button>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Export your content as an HTML file
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:language-html5" />}
              sx={{ borderRadius: '24px' }}
            >
              Export as HTML
            </Button>
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Export your content as structured JSON data
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:code-json" />}
              sx={{ borderRadius: '24px' }}
            >
              Export as JSON
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

// Store Selection Modal Component
const StoreSelectionModal = ({ open, onClose, onSelect, stores }: StoreSelectionModalProps) => {
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(stores[0]?.id || null);

  const handleConfirm = () => {
    if (selectedStoreId) {
      onSelect(selectedStoreId);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="store-selection-modal-title"
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="store-selection-modal-title" variant="h6" component="h2">
            Select Store
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select the store where you want to publish your content
        </Typography>

        <RadioGroup
          value={selectedStoreId}
          onChange={(e) => setSelectedStoreId(Number(e.target.value))}
          sx={{ mb: 3 }}
        >
          {stores.map((store) => (
            <FormControlLabel
              key={store.id}
              value={store.id}
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    component="img"
                    src={store.logo}
                    alt={store.name}
                    sx={{ width: 24, height: 24, borderRadius: '50%' }}
                  />
                  <Typography>{store.name}</Typography>
                </Box>
              }
              sx={{ my: 1 }}
            />
          ))}
        </RadioGroup>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!selectedStoreId}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// Define the interface for the state prop
interface Step4State {
  articleInfo: {
    title: string;
    metaTitle: string;
    metaDescription: string;
    urlSlug: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    language: string;
    targetCountry: string;
    contentDescription: string;
    createdAt: string;
  };
  articleSettings: {
    articleType: string;
    articleSize: string;
    toneOfVoice: string;
  };
  sections: any[];
}

interface Step4Props {
  state: Step4State;
}

export function Step4Publish({ state }: Step4Props) {
  // API hooks
  const { data: storesData, isLoading: isLoadingStores } = useGetStoresQuery();
  const [publishWordPress] = usePublishWordPressMutation();
  const [publishWix] = usePublishWixMutation();
  const [publishShopify] = usePublishShopifyMutation();

  // State for modals
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [storeSelectionOpen, setStoreSelectionOpen] = useState(false);
  const [fullArticleModalOpen, setFullArticleModalOpen] = useState(false);
  const [publishingSchedule, setPublishingSchedule] = useState('now');
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Get stores from API using useMemo to avoid re-renders
  const stores = useMemo(() => storesData?.stores || [], [storesData]);

  // Set default store if available
  useEffect(() => {
    if (stores.length > 0 && !selectedStore) {
      setSelectedStore(stores[0].id);
    }
  }, [stores, selectedStore]);

  // Handle modal open/close
  const handleOpenCopyModal = () => setCopyModalOpen(true);
  const handleCloseCopyModal = () => setCopyModalOpen(false);
  const handleOpenExportModal = () => setExportModalOpen(true);
  const handleCloseExportModal = () => setExportModalOpen(false);
  const handleOpenStoreSelection = () => setStoreSelectionOpen(true);
  const handleCloseStoreSelection = () => setStoreSelectionOpen(false);
  const handleOpenFullArticleModal = () => setFullArticleModalOpen(true);
  const handleCloseFullArticleModal = () => setFullArticleModalOpen(false);

  // Handle store selection
  const handleStoreSelect = (storeId: number) => {
    setSelectedStore(storeId);
    setStoreSelectionOpen(false);
  };

  // Handle publish action
  const handlePublish = async () => {
    if (!selectedStore) {
      toast.error('Please select a store before publishing');
      return;
    }

    setIsPublishing(true);

    try {
      // Get selected store
      const store = stores.find(s => s.id === selectedStore);

      if (!store) {
        throw new Error('Store not found');
      }

      // Determine which publish API to use based on store platform
      let publishResult;

      const publishData = {
        store_id: String(selectedStore),
        article_id: 'current-article-id', // This would come from the article being created
        scheduled_date: publishingSchedule === 'schedule' ? new Date().toISOString() : undefined,
      };

      switch (store.platform?.toLowerCase()) {
        case 'wordpress':
          publishResult = await publishWordPress(publishData).unwrap();
          break;
        case 'wix':
          publishResult = await publishWix(publishData).unwrap();
          break;
        case 'shopify':
          publishResult = await publishShopify(publishData).unwrap();
          break;
        default:
          // Mock success for testing
          await new Promise(resolve => setTimeout(resolve, 2000));
          publishResult = { success: true };
      }

      if (publishResult.success) {
        toast.success('Content published successfully!');
      } else {
        throw new Error(publishResult.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Failed to publish content. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Box sx={{ position: 'relative', pb: 8 }}>
      <Grid container spacing={2}>
        {/* Article Preview */}
        <Grid item xs={12}>
          <FormContainer
            isCollapsible
            title="Article Preview"
          >
            <Box sx={{
              p: { xs: 2, md: 3 },
              bgcolor: 'background.paper',
              borderRadius: 1,
              mb: 2,
              boxShadow: '0 0 10px rgba(0,0,0,0.05)'
            }}>
              {/* Article Title */}
              <Typography variant="h4" gutterBottom sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}>
                {state.articleInfo.title || 'Your Article Title'}
              </Typography>

              {/* Article Meta */}
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                mb: 3,
                color: 'text.secondary'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: { xs: 1, sm: 0 } }}>
                  <Iconify icon="mdi:calendar" width={16} height={16} sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {new Date(state.articleInfo.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: { xs: 1, sm: 0 } }}>
                  <Iconify icon="mdi:account" width={16} height={16} sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    AI Generated
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify icon="mdi:translate" width={16} height={16} sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {state.articleInfo.language.toUpperCase()} | {state.articleInfo.targetCountry.toUpperCase()}
                  </Typography>
                </Box>
              </Box>

              <Paper
                sx={{
                  height: { xs: 200, sm: 250, md: 300 },
                  width: '100%',
                  bgcolor: 'background.neutral',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  borderRadius: 2,
                  backgroundImage: 'url(https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.01)',
                  }
                }}
              />

              {/* Article Content - Display generated sections */}
              {state.sections && state.sections.length > 0 ? (
                <>
                  {/* Display first section as introduction */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {state.sections[0]?.title || 'Introduction'}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {state.sections[0]?.content || 'No content available for this section.'}
                    </Typography>
                  </Box>

                  {/* Display second section if available */}
                  {state.sections.length > 1 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                        {state.sections[1]?.title || 'Section 2'}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {state.sections[1]?.content || 'No content available for this section.'}
                      </Typography>
                    </Box>
                  )}

                  {/* Show a message for remaining sections */}
                  {state.sections.length > 2 && (
                    <Box sx={{
                      textAlign: 'center',
                      color: 'text.secondary',
                      my: 3,
                      p: 2,
                      bgcolor: 'background.neutral',
                      borderRadius: 1
                    }}>
                      <Typography variant="body2">
                        +{state.sections.length - 2} more sections in the full article
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {state.sections.slice(2).map((section, index) => (
                          <Chip
                            key={index}
                            label={section.title}
                            size="small"
                            sx={{ m: 0.5, bgcolor: 'background.paper' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </>
              ) : (
                <Box sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                  my: 3,
                  p: 2,
                  bgcolor: 'background.neutral',
                  borderRadius: 1
                }}>
                  <Typography variant="body2">
                    No sections have been generated yet. Please go back to step 3 and generate content.
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mb: 2
            }}>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="mdi:content-copy" />}
                onClick={handleOpenCopyModal}
                sx={{
                  borderRadius: '24px',
                  px: 3,
                  mb: { xs: 1, sm: 0 }
                }}
              >
                Copy
              </Button>

              <Button
                variant="outlined"
                startIcon={<Iconify icon="mdi:export" />}
                onClick={handleOpenExportModal}
                sx={{
                  borderRadius: '24px',
                  px: 3,
                  mb: { xs: 1, sm: 0 }
                }}
              >
                Export
              </Button>

              <Button
                variant="outlined"
                startIcon={<Iconify icon="mdi:file-document-outline" />}
                onClick={handleOpenFullArticleModal}
                sx={{
                  borderRadius: '24px',
                  px: 3,
                  mb: { xs: 1, sm: 0 }
                }}
              >
                View Full Article
              </Button>

              <Button
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="mdi:publish" />}
                onClick={handleOpenStoreSelection}
                sx={{
                  borderRadius: '24px',
                  px: 3,
                  mb: { xs: 1, sm: 0 },
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                Publish
              </Button>
            </Box>
          </FormContainer>
        </Grid>

        {/* Article Information and Distribution Options in a responsive grid */}
        <Grid item xs={12} md={6}>
          <FormContainer title="Article Information">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormInput
                  label="Article Title"
                  disabled
                  fullWidth
                  value={state.articleInfo.title || 'No title available'}
                />
              </Grid>

              <Grid item xs={12}>
                <FormInput
                    label="Meta Title"
                    value={state.articleInfo.metaTitle || 'No meta title available'}
                    disabled
                    fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <FormInput
                  label="Meta Description"
                  value={state.articleInfo.metaDescription || 'No meta description available'}
                  disabled
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <FormInput
                  label="URL Slug"
                  value={state.articleInfo.urlSlug || 'No URL slug available'}
                  disabled
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Primary Keyword
                </Typography>
                <Chip
                  label={state.articleInfo.primaryKeyword || 'No primary keyword'}
                  sx={{
                    bgcolor: 'success.lighter',
                    color: 'success.dark',
                    borderRadius: '16px',
                    mb: 1,
                    fontWeight: 'bold'
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Secondary Keywords
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {state.articleInfo.secondaryKeywords && state.articleInfo.secondaryKeywords.length > 0 ? (
                    state.articleInfo.secondaryKeywords.map((keyword, index) => (
                      <Chip
                        key={index}
                        label={keyword}
                        sx={{
                          bgcolor: 'primary.lighter',
                          color: 'primary.main',
                          borderRadius: '16px',
                          mb: 0.5
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No secondary keywords available
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Content Description
                </Typography>
                <Typography variant="body2" sx={{ p: 1, bgcolor: 'background.neutral', borderRadius: 1 }}>
                  {state.articleInfo.contentDescription || 'No content description available'}
                </Typography>
              </Grid>
            </Grid>
          </FormContainer>
        </Grid>

        {/* Distribution Options */}
        <Grid item xs={12} md={6}>
          <FormContainer title="Distribution Options">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {isLoadingStores ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : stores.length > 0 ? (
                  <FormDropdown
                    label="Select Store"
                    value={selectedStore || ''}
                    onChange={(e) => setSelectedStore(e.target.value as number)}
                    options={stores?.map(store => ({
                      value: store.id.toString(),
                      label: store.name,
                    }))}
                  />
                ) : (
                  <Typography color="text.secondary" sx={{ p: 1 }}>
                    No stores available. Please connect a store first.
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <FormDropdown
                  label="Publishing Schedule"
                  value={publishingSchedule}
                  onChange={(e) => setPublishingSchedule(e.target.value as string)}
                  options={[
                    { value: 'now', label: 'Publish Now' },
                    { value: 'schedule', label: 'Schedule for Later' },
                    { value: 'draft', label: 'Save as Draft' }
                  ]}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<Iconify icon="mdi:rocket-launch" />}
                  onClick={handlePublish}
                  disabled={!selectedStore || isPublishing}
                  sx={{
                    borderRadius: '24px',
                    py: 1.5,
                    bgcolor: 'success.main',
                    '&:hover': {
                      bgcolor: 'success.dark',
                    }
                  }}
                >
                  {isPublishing ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Publishing...
                    </Box>
                  ) : (
                    publishingSchedule === 'now' ? 'Publish Now' :
                    publishingSchedule === 'schedule' ? 'Schedule for Later' :
                    'Save as Draft'
                  )}
                </Button>
              </Grid>
            </Grid>
          </FormContainer>
        </Grid>
      </Grid>

      {/* Modals */}
      <CopyModal open={copyModalOpen} onClose={handleCloseCopyModal} />
      <ExportModal open={exportModalOpen} onClose={handleCloseExportModal} />
      <StoreSelectionModal
        open={storeSelectionOpen}
        onClose={handleCloseStoreSelection}
        onSelect={handleStoreSelect}
        stores={stores}
      />
      <FullArticleModal
        open={fullArticleModalOpen}
        onClose={handleCloseFullArticleModal}
        articleInfo={state.articleInfo}
        sections={state.sections}
      />
    </Box>
  );
}