import React, { useState } from 'react';

import { 
  Box, 
  Tab, 
  Grid, 
  Tabs, 
  Chip, 
  Modal, 
  Paper, 
  Button, 
  Select, 
  Switch, 
  Divider, 
  MenuItem, 
  useTheme, 
  TextField,
  Typography,
  InputLabel,
  IconButton,
  FormControl,
  FormControlLabel
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { FormContainer } from '../FormContainer';

interface CopyModalProps {
  open: boolean;
  onClose: () => void;
}

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
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
          <Tab label="Image" />
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
            >
              Copy Plain Text
            </Button>
          </Box>
        )}
        
        {activeTab === 3 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Generate an image of your content to share on social media
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Iconify icon="mdi:image" />}
              sx={{ borderRadius: '24px', mb: 2 }}
            >
              Generate Image
            </Button>
            <Typography variant="caption" color="text.secondary">
              Note: Image generation may take a few moments
            </Typography>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

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

export function Step4Publish() {
  const theme = useTheme();
  
  // State for modals
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  
  // State for store selection
  const [selectedStore, setSelectedStore] = useState('');
  
  // Handle modal open/close
  const handleOpenCopyModal = () => setCopyModalOpen(true);
  const handleCloseCopyModal = () => setCopyModalOpen(false);
  const handleOpenExportModal = () => setExportModalOpen(true);
  const handleCloseExportModal = () => setExportModalOpen(false);
  
  // Handle publish action
  const handlePublish = () => {
    // Navigate to another page or show success message
    console.log('Publishing content...');
    // You can add navigation logic here
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
                How to Optimize Your Website for Better SEO Performance
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
                    {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify icon="mdi:account" width={16} height={16} sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    AI Generated
                  </Typography>
                </Box>
              </Box>
              
              {/* Featured Image Placeholder */}
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
              
              {/* Article Content - Simplified for better readability */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Introduction to SEO Optimization
                </Typography>
                <Typography variant="body1" paragraph>
                  Search Engine Optimization (SEO) is crucial for any website looking to increase visibility and attract organic traffic. In today s digital landscape, having a well-optimized website can make the difference between success and failure online.
                </Typography>
                <Typography variant="body1" paragraph>
                  Whether you re a small business owner, a content creator, or a marketing professional, understanding the fundamentals of SEO is essential for growing your online presence.
                </Typography>
              </Box>
              
              {/* More sections would continue here... */}
              <Box sx={{ 
                textAlign: 'center', 
                color: 'text.secondary', 
                my: 3,
                p: 2,
                bgcolor: 'background.neutral',
                borderRadius: 1
              }}>
                <Typography variant="body2">
                  [Preview truncated for brevity]
                </Typography>
              </Box>
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
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="mdi:publish" />}
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
                <TextField
                  fullWidth
                  label="Article Title"
                  value="How to Optimize Your Website for Better SEO Performance"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Title"
                  value="SEO Optimization Guide: Boost Your Website Performance"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Meta Description"
                  value="Learn proven strategies to optimize your website for search engines and improve your rankings with our comprehensive SEO guide."
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL Slug"
                  value="seo-optimization-guide"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Keywords
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['SEO', 'Website Optimization', 'Search Engine', 'Digital Marketing'].map((tag) => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      sx={{ 
                        bgcolor: 'primary.lighter', 
                        color: 'primary.main',
                        borderRadius: '16px',
                        mb: 0.5
                      }} 
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </FormContainer>
        </Grid>
        
        {/* Distribution Options */}
        <Grid item xs={12} md={6}>
          <FormContainer title="Distribution Options">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Store</InputLabel>
                  <Select
                    value={selectedStore}
                    label="Select Store"
                    onChange={(e) => setSelectedStore(e.target.value)}
                  >
                    <MenuItem value="store1">My WordPress Blog</MenuItem>
                    <MenuItem value="store2">Company Website</MenuItem>
                    <MenuItem value="store3">Personal Portfolio</MenuItem>
                    <MenuItem value="new">+ Create New Store</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Publishing Schedule</InputLabel>
                  <Select
                    value="now"
                    label="Publishing Schedule"
                  >
                    <MenuItem value="now">Publish Now</MenuItem>
                    <MenuItem value="schedule">Schedule for Later</MenuItem>
                    <MenuItem value="draft">Save as Draft</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Content Category</InputLabel>
                  <Select
                    value="digital-marketing"
                    label="Content Category"
                  >
                    <MenuItem value="digital-marketing">Digital Marketing</MenuItem>
                    <MenuItem value="seo">SEO</MenuItem>
                    <MenuItem value="web-development">Web Development</MenuItem>
                    <MenuItem value="content-strategy">Content Strategy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Allow Comments"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Share on Social Media"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<Iconify icon="mdi:rocket-launch" />}
                  onClick={handlePublish}
                  sx={{ 
                    borderRadius: '24px',
                    py: 1.5,
                    bgcolor: 'success.main',
                    '&:hover': {
                      bgcolor: 'success.dark',
                    }
                  }}
                >
                  Publish Content
                </Button>
              </Grid>
            </Grid>
          </FormContainer>
        </Grid>
      </Grid>
      
      {/* Modals */}
      <CopyModal open={copyModalOpen} onClose={handleCloseCopyModal} />
      <ExportModal open={exportModalOpen} onClose={handleCloseExportModal} />
    </Box>
  );
}