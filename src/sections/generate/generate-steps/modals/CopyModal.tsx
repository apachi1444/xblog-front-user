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

import type { ArticleSection } from '../../schemas';

interface CopyModalProps {
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

export const CopyModal = ({ open, onClose, articleInfo, sections }: CopyModalProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [htmlContent, setHtmlContent] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [plainTextContent, setPlainTextContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Load content when modal opens
  useEffect(() => {
    if (open && sections && sections.length > 0) {
      setIsLoading(true);

      // Import converters dynamically
      import('src/utils/markdownConverter').then(({ articleToMarkdown, articleToHtml }) => {
        const markdown = articleToMarkdown(articleInfo, sections);
        const html = articleToHtml(articleInfo, sections);

        setMarkdownContent(markdown);
        setHtmlContent(html);
        setIsLoading(false);
      }).catch(error => {
        console.error('Error generating content:', error);
        // Fallback to simple text format
        const plainText = `${articleInfo.title}\n\n${sections.map(s => `${s.title}\n${s.content || ''}\n\n`).join('')}`;
        setPlainTextContent(plainText);
        setMarkdownContent(plainText);
        setHtmlContent(`<h1>${articleInfo.title}</h1><p>${plainText.replace(/\n/g, '<br>')}</p>`);
        setIsLoading(false);
      });
    }
  }, [open, articleInfo, sections]);

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
          <Tab label="Plain Text" />
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

            {activeTab === 2 && (
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  value={plainTextContent}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="mdi:content-copy" />}
                  sx={{ borderRadius: '24px' }}
                  onClick={() => handleCopy(plainTextContent, 'Plain Text')}
                >
                  Copy Plain Text
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};
