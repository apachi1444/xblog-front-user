import React, { useState } from 'react';

import { 
  Box, 
  Tab, 
  Grid, 
  Tabs, 
  Modal, 
  Paper, 
  Button, 
  Select, 
  Divider, 
  MenuItem, 
  TextField, 
  Typography, 
  InputLabel, 
  IconButton,
  FormControl,
  Chip,
  FormControlLabel,
  Switch
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

export function Step3Publish() {
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
    <Grid container spacing={3}>
      {/* Article Preview */}
      <Grid item xs={12}>
        <FormContainer title="Article Preview">
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, mb: 3 }}>
            {/* Article Title */}
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
              How to Optimize Your Website for Better SEO Performance
            </Typography>
            
            {/* Article Meta */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, color: 'text.secondary' }}>
              <Iconify icon="mdi:calendar" width={16} height={16} sx={{ mr: 1 }} />
              <Typography variant="body2" sx={{ mr: 3 }}>
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
              <Iconify icon="mdi:account" width={16} height={16} sx={{ mr: 1 }} />
              <Typography variant="body2">
                AI Generated
              </Typography>
            </Box>
            
            {/* Featured Image Placeholder */}
            <Paper 
              sx={{ 
                height: 300, 
                width: '100%', 
                bgcolor: 'background.neutral', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 3,
                borderRadius: 2,
                backgroundImage: 'url(https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
             />
            
            {/* Article Content */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Introduction to SEO Optimization
              </Typography>
              <Typography variant="body1" paragraph>
                Search Engine Optimization (SEO) is crucial for any website looking to increase visibility and attract organic traffic. In today s digital landscape, having a well-optimized website can make the difference between success and failure online. This comprehensive guide will walk you through proven strategies to improve your website s SEO performance and achieve higher rankings in search engine results pages (SERPs).
              </Typography>
              <Typography variant="body1" paragraph>
                Whether you re a small business owner, a content creator, or a marketing professional, understanding the fundamentals of SEO is essential for growing your online presence. Let s dive into the key aspects of SEO optimization and explore actionable techniques you can implement right away.
              </Typography>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Understanding Search Engine Algorithms
              </Typography>
              <Typography variant="body1" paragraph>
                Search engines like Google use complex algorithms to determine which websites should rank for specific search queries. These algorithms consider hundreds of factors, including content relevance, website authority, user experience, and technical performance.
              </Typography>
              <Typography variant="body1" paragraph>
                Google regularly updates its algorithms to provide better search results for users. Staying informed about these updates is important for maintaining and improving your rankings. Some of the most significant algorithm updates include:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Core Web Vitals:</strong> Focuses on page experience metrics like loading performance, interactivity, and visual stability.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>BERT:</strong> Improves understanding of natural language and search context.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Mobile-First Indexing:</strong> Prioritizes the mobile version of websites for indexing and ranking.
                  </Typography>
                </li>
              </ul>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                On-Page SEO Techniques
              </Typography>
              <Typography variant="body1" paragraph>
                On-page SEO refers to the optimization of elements on your website that you can directly control. These include:
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                Keyword Research and Implementation
              </Typography>
              <Typography variant="body1" paragraph>
                Effective keyword research is the foundation of successful SEO. Identify relevant keywords that your target audience is searching for and strategically incorporate them into your content. Use tools like Google Keyword Planner, Ahrefs, or SEMrush to discover valuable keywords with good search volume and manageable competition.
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                Content Optimization
              </Typography>
              <Typography variant="body1" paragraph>
                High-quality, relevant content is essential for SEO success. Create comprehensive, well-structured content that addresses user intent and provides value. Include your target keywords naturally throughout your content, especially in important elements like headings, introductions, and conclusions.
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                Meta Tags and Descriptions
              </Typography>
              <Typography variant="body1" paragraph>
                Optimize your HTML elements to improve how search engines understand and display your content. This includes crafting compelling title tags, meta descriptions, and header tags (H1, H2, H3, etc.) that incorporate your target keywords while accurately describing your content.
              </Typography>
            </Box>
            
            {/* More sections would continue here... */}
            <Box sx={{ textAlign: 'center', color: 'text.secondary', my: 4 }}>
              <Typography variant="body2">
                [Preview truncated for brevity]
              </Typography>
            </Box>
          </Box>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mdi:content-copy" />}
              onClick={handleOpenCopyModal}
              sx={{ borderRadius: '24px', px: 3 }}
            >
              Copy
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mdi:export" />}
              onClick={handleOpenExportModal}
              sx={{ borderRadius: '24px', px: 3 }}
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
      
      {/* Article Information */}
      <Grid item xs={12} md={6}>
        <FormContainer title="Article Information">
          <Grid container spacing={3}>
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
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['SEO', 'Website Optimization', 'Search Engine', 'Digital Marketing'].map((tag) => (
                  <Chip 
                    key={tag} 
                    label={tag} 
                    sx={{ 
                      bgcolor: 'primary.lighter', 
                      color: 'primary.main',
                      borderRadius: '16px'
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
          <Grid container spacing={3}>
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
            
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Allow Comments"
              />
            </Grid>
            
            <Grid item xs={12}>
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
      
      {/* Modals */}
      <CopyModal open={copyModalOpen} onClose={handleCloseCopyModal} />
      <ExportModal open={exportModalOpen} onClose={handleCloseExportModal} />
    </Grid>
  );
}