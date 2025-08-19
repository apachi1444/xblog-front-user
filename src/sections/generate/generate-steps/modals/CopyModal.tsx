import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

import {
  Box,
  Tab,
  Tabs,
  Modal,
  Button,
  Divider,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { GenerateArticleFormData } from '../../schemas';

interface CopyModalProps {
  open: boolean;
  onClose: () => void;
  formData: GenerateArticleFormData;
}

export const CopyModal = ({ open, onClose, formData }: CopyModalProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [htmlContent, setHtmlContent] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Load content when modal opens
  useEffect(() => {
    if (open && formData) {
      setIsLoading(true);

      try {
        // Import converters dynamically
        import('src/utils/markdownConverter').then(({ getHtmlContent, htmlToMarkdown }) => {
          // Get HTML content (from generatedHtml or fallback)
          const html = getHtmlContent(formData);

          // Convert HTML to markdown using Turndown
          const markdown = htmlToMarkdown(html);

          setHtmlContent(html);
          setMarkdownContent(markdown);
          setIsLoading(false);
        }).catch(error => {
          console.error('Error importing markdown converter:', error);

          // Fallback: use generatedHtml directly or create simple content
          const html = formData.generatedHtml || `<h1>${formData.step1?.title || 'Untitled Article'}</h1><p>No content available.</p>`;
          const markdown = `# ${formData.step1?.title || 'Untitled Article'}\n\nNo content available.`;

          setHtmlContent(html);
          setMarkdownContent(markdown);
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error in content conversion:', error);

        // Emergency fallback
        const html = formData.generatedHtml || `<h1>${formData.step1?.title || 'Untitled Article'}</h1><p>No content available.</p>`;
        const markdown = `# ${formData.step1?.title || 'Untitled Article'}\n\nNo content available.`;

        setHtmlContent(html);
        setMarkdownContent(markdown);
        setIsLoading(false);
      }
    } else if (open) {
      // Handle case where formData is empty
      const title = formData?.step1?.title || 'Untitled Article';
      setMarkdownContent(`# ${title}\n\nNo content available.`);
      setHtmlContent(`<h1>${title}</h1><p>No content available.</p>`);
      setIsLoading(false);
    }
  }, [open, formData]);

  // Copy content to clipboard
  const handleCopy = (content: string, format: string) => {
    navigator.clipboard.writeText(content);
    toast.success(`Copied as ${format} successfully!`);
    onClose();
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
        </Tabs>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {activeTab === 0 && (
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  value={htmlContent}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="mdi:content-copy" />}
                  onClick={() => handleCopy(htmlContent, 'HTML')}
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
                  value={markdownContent}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="mdi:content-copy" />}
                  onClick={() => handleCopy(markdownContent, 'Markdown')}
                  sx={{ borderRadius: '24px' }}
                >
                  Copy Markdown
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};
