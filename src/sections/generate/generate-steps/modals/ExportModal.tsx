import { useState } from 'react';
import toast from 'react-hot-toast';

import {
  Box,
  Tab,
  Tabs,
  Modal,
  Button,
  Divider,
  Typography,
  IconButton,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { GenerateArticleFormData } from '../../schemas';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  formData: GenerateArticleFormData;
}

export const ExportModal = ({ open, onClose, formData }: ExportModalProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      let content = '';
      let filename = '';
      let mimeType = '';

      // Extract article info from form data
      const articleInfo = {
        title: formData.step1?.title || 'Untitled Article',
        metaTitle: formData.step1?.metaTitle || '',
        metaDescription: formData.step1?.metaDescription || '',
        urlSlug: formData.step1?.urlSlug || '',
        primaryKeyword: formData.step1?.primaryKeyword || '',
        secondaryKeywords: formData.step1?.secondaryKeywords || [],
        language: formData.step1?.language || 'en',
        targetCountry: formData.step1?.targetCountry || '',
        contentDescription: formData.step1?.contentDescription || '',
        createdAt: new Date().toISOString(),
        articleType: formData.step2?.articleType || '',
        articleSize: formData.step2?.articleSize || '',
        toneOfVoice: formData.step2?.toneOfVoice || '',
      };

      const sections = formData.step3?.sections || [];

      switch (activeTab) {
        case 0: // Markdown
          filename = `${articleInfo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
          mimeType = 'text/markdown';
          break;
        case 1: // PDF (placeholder - would need PDF generation library)
          toast.error('PDF export is not yet implemented');
          setIsExporting(false);
          return;
        case 2: // HTML
          // For HTML export, use the generated HTML if available, otherwise convert from sections
          if (formData.generatedHtml) {
            content = formData.generatedHtml;
          } else {
            const { articleToHtml } = await import('src/utils/markdownConverter');
            content = articleToHtml(articleInfo, sections);
          }
          filename = `${articleInfo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
          mimeType = 'text/html';
          break;
        case 3: // JSON
          // Export complete form data with proper schema structure
          content = JSON.stringify({
            formData,
            exportedAt: new Date().toISOString(),
            version: '1.0'
          }, null, 2);
          filename = `${articleInfo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
          mimeType = 'application/json';
          break;
        default:
          throw new Error('Invalid export format');
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('File exported successfully!');
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export file. Please try again.');
    } finally {
      setIsExporting(false);
    }
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

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Choose the format to export your article
        </Typography>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Markdown" />
          <Tab label="PDF" />
          <Tab label="HTML" />
          <Tab label="JSON" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Export your content as a Markdown file (.md)
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:language-markdown" />}
              sx={{ borderRadius: '24px' }}
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export as Markdown'}
            </Button>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Export your content as a PDF file (Coming Soon)
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:file-pdf-box" />}
              sx={{ borderRadius: '24px' }}
              onClick={handleExport}
              disabled
            >
              Export as PDF (Coming Soon)
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
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export as HTML'}
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
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export as JSON'}
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};
