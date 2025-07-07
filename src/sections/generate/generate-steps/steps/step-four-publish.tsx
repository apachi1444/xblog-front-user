// External imports
// Types
import type { Store } from 'src/types/store';

import toast from 'react-hot-toast';
import { useFormContext } from 'react-hook-form';
import React, { useMemo, useState, useEffect } from 'react';

// Material UI imports
import {
  Box,
  Tab,
  Chip,
  Link,
  List,
  Tabs,
  Modal,
  Paper,
  Radio,
  Table,
  Button,
  Select,
  Divider,
  ListItem,
  MenuItem,
  TableRow,
  Accordion,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  IconButton,
  InputLabel,
  RadioGroup,
  Typography,
  FormControl,
  ListItemIcon,
  ListItemText,
  TableContainer,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  FormControlLabel
} from '@mui/material';

// API hooks



// Components
import { Iconify } from 'src/components/iconify';

import type {
  ArticleSection,
  GenerateArticleFormData
} from '../../schemas';



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

interface ExportModalProps {
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

interface StoreSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (storeId: number) => void;
  stores: Store[];
}

// Copy Modal Component
const CopyModal = ({ open, onClose, articleInfo, sections }: CopyModalProps) => {
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

      // Import the markdown converter
      import('src/utils/markdownConverter').then(({ articleToMarkdown, articleToHtml }) => {
        // Create article info object
        const articleInfoObj = {
          title: articleInfo.title,
          metaTitle: articleInfo.metaTitle,
          metaDescription: articleInfo.metaDescription,
          primaryKeyword: articleInfo.primaryKeyword,
          secondaryKeywords: articleInfo.secondaryKeywords,
          language: articleInfo.language,
          targetCountry: articleInfo.targetCountry,
          createdAt: articleInfo.createdAt
        };

        // Generate content in different formats
        const markdown = articleToMarkdown(articleInfoObj, sections);
        const html = articleToHtml(articleInfoObj, sections);
        const plainText = `${articleInfo.title}\n\n${sections.map(s => `${s.title}\n${s.content || ''}\n\n`).join('')}`;

        setMarkdownContent(markdown);
        setHtmlContent(html);
        setPlainTextContent(plainText);
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
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
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
                  onClick={() => handleCopy(htmlContent, 'HTML')}
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
  sections: ArticleSection[];
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
              <Box key={index} sx={{ mb: 6 }}>
                {/* Section Title */}
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {section.title || `Section ${index + 1}`}
                </Typography>

                {/* Main Content - Display based on content type */}
                {section.content && (
                  <Box sx={{ mb: 2 }}>
                    {/* Content Type Badge */}
                    {(section.type === 'faq' || section.contentType) && (
                      <Chip
                        label={
                          section.type === 'faq'
                            ? 'FAQ Section'
                            : section.contentType === 'bullet-list'
                              ? 'List Section'
                              : section.contentType === 'table'
                                ? 'Table Section'
                                : section.contentType === 'image-gallery'
                                  ? 'Image Gallery'
                                  : section.contentType || 'Paragraph'
                        }
                        size="small"
                        sx={{
                          mb: 1.5,
                          bgcolor: 'background.neutral',
                          color: 'text.secondary',
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {section.content}
                    </Typography>
                  </Box>
                )}

                {/* Bullet Points */}
                {section.bulletPoints && section.bulletPoints.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <List disablePadding>
                      {section.bulletPoints.map((point, i) => (
                        <ListItem key={i} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Iconify icon="mdi:circle-small" />
                          </ListItemIcon>
                          <ListItemText primary={point} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Table Data */}
                {section.tableData && section.tableData.headers && section.tableData.rows && (
                  <TableContainer component={Paper} sx={{ mb: 2, overflow: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'background.neutral' }}>
                          {section.tableData.headers.map((header, i) => (
                            <TableCell key={i} sx={{ fontWeight: 'bold' }}>
                              {header}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {section.tableData.rows.map((row: string[], rowIndex: number) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell: string, cellIndex: number) => (
                              <TableCell key={cellIndex}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {/* FAQ Items */}
                {section.faqItems && section.faqItems.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {section.faqItems.map((faq, i) => (
                      <Accordion key={i} sx={{ mb: 1 }}>
                        <AccordionSummary expandIcon={<Iconify icon="mdi:chevron-down" />}>
                          <Typography variant="subtitle1">{faq.question}</Typography>
                        </AccordionSummary>
                        <Divider />
                        <AccordionDetails>
                          <Typography variant="body2">{faq.answer}</Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                )}

                {/* Images */}
                {section.images && section.images.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {section.images.map((image, i) => (
                      <Box key={i} sx={{ mb: 2, textAlign: 'center' }}>
                        <Box
                          component="img"
                          src={image.url}
                          alt={image.alt}
                          sx={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: 1,
                            mb: 1
                          }}
                        />
                        {image.caption && (
                          <Typography variant="caption" color="text.secondary">
                            {image.caption}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Internal Links */}
                {section.internalLinks && section.internalLinks.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Related Content:
                    </Typography>
                    <List disablePadding>
                      {section.internalLinks.map((link, i) => (
                        <ListItem key={i} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Iconify icon="mdi:link-variant" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Link href={link.url} color="primary" underline="hover">
                                {link.text}
                              </Link>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* External Links */}
                {section.externalLinks && section.externalLinks.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Sources:
                    </Typography>
                    <List disablePadding>
                      {section.externalLinks.map((link, i) => (
                        <ListItem key={i} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Iconify icon="mdi:open-in-new" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Link href={link.url} color="primary" underline="hover" target="_blank" rel="noopener">
                                {link.text}
                              </Link>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {index < sections.length - 1 && <Divider sx={{ my: 3 }} />}
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
              // Import the markdown converter
              import('src/utils/markdownConverter').then(({ articleToMarkdown }) => {
                // Convert article to markdown
                const markdownContent = articleToMarkdown(
                  {
                    title: articleInfo.title,
                    metaTitle: articleInfo.metaTitle,
                    metaDescription: articleInfo.metaDescription,
                    primaryKeyword: articleInfo.primaryKeyword,
                    secondaryKeywords: articleInfo.secondaryKeywords,
                    language: articleInfo.language,
                    targetCountry: articleInfo.targetCountry,
                    createdAt: articleInfo.createdAt
                  },
                  sections
                );

                // Copy markdown content to clipboard
                navigator.clipboard.writeText(markdownContent);
                toast.success("Article content copied to clipboard in Markdown format");
              }).catch(error => {
                console.error("Error converting to markdown:", error);
                // Fallback to simple text format if markdown conversion fails
                const content = `${articleInfo.title}\n\n${sections.map(s => `${s.title}\n${s.content}\n\n`).join('')}`;
                navigator.clipboard.writeText(content);
                toast.success("Article content copied to clipboard");
              });
            }}
          >
            Copy Full Article
          </Button>
        </Box>
      </Box>
    </Modal>
  );

// Export Modal Component
const ExportModal = ({ open, onClose, articleInfo, sections }: ExportModalProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Function to download content as a file
  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle export based on selected tab
  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Import the markdown converter
      const { articleToMarkdown, articleToHtml } = await import('src/utils/markdownConverter');

      // Create article info object
      const articleInfoObj = {
        title: articleInfo.title,
        metaTitle: articleInfo.metaTitle,
        metaDescription: articleInfo.metaDescription,
        primaryKeyword: articleInfo.primaryKeyword,
        secondaryKeywords: articleInfo.secondaryKeywords,
        language: articleInfo.language,
        targetCountry: articleInfo.targetCountry,
        createdAt: articleInfo.createdAt
      };

      // Generate file name base
      const fileName = articleInfo.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Handle export based on tab
      let content = '';
      let fileExtension = '';
      let contentType = '';
      let successMessage = '';

      if (activeTab === 0) { // PDF
        // For PDF, we'll use HTML as an intermediate format
        content = articleToHtml(articleInfoObj, sections);
        fileExtension = 'html';
        contentType = 'text/html';
        successMessage = 'Content exported as HTML (PDF generation not implemented)';
      } else if (activeTab === 1) { // Word
        // For Word, we'll use Markdown as an intermediate format
        content = articleToMarkdown(articleInfoObj, sections);
        fileExtension = 'md';
        contentType = 'text/markdown';
        successMessage = 'Content exported as Markdown (Word generation not implemented)';
      } else if (activeTab === 2) { // HTML
        content = articleToHtml(articleInfoObj, sections);
        fileExtension = 'html';
        contentType = 'text/html';
        successMessage = 'Content exported as HTML';
      } else if (activeTab === 3) { // JSON
        content = JSON.stringify({
          articleInfo: articleInfoObj,
          sections
        }, null, 2);
        fileExtension = 'json';
        contentType = 'application/json';
        successMessage = 'Content exported as JSON';
      }

      // Download the file
      downloadFile(content, `${fileName}.${fileExtension}`, contentType);
      toast.success(successMessage);
    } catch (error) {
      console.error('Error exporting content:', error);
      toast.error('Failed to export content. Please try again.');
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
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export as PDF'}
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
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export as Word'}
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

export function Step4Publish() {
  // Get form data from context
  const { getValues } = useFormContext<GenerateArticleFormData>();
  const formData = getValues();

  // Extract article info from form data
  const articleInfo = useMemo(() => ({
    title: formData.step1?.title || '',
    urlSlug: formData.step1?.urlSlug || '',
    metaTitle: formData.step1?.metaTitle || '',
    metaDescription: formData.step1?.metaDescription || '',
    primaryKeyword: formData.step1?.primaryKeyword || '',
    secondaryKeywords: formData.step1?.secondaryKeywords || [],
    language: formData.step1?.language || 'en-us',
    targetCountry: formData.step1?.targetCountry || 'us',
    contentDescription: formData.step1?.contentDescription || '',
    createdAt: new Date().toISOString(),
  }), [formData.step1]);

  const { sections } = formData.step3;

  return (
    <Box sx={{ pb: 2 }}>
      {/* Article Preview - Clean Layout */}
      <Box sx={{
        p: { xs: 2, md: 3 },
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: '0 0 10px rgba(0,0,0,0.05)'
      }}>
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

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="mdi:translate" width={16} height={16} sx={{ mr: 1 }} />
            <Typography variant="body2">
              {articleInfo.language.toUpperCase()} | {articleInfo.targetCountry.toUpperCase()}
            </Typography>
          </Box>
        </Box>

        {/* Keywords */}
        {(articleInfo.primaryKeyword || articleInfo.secondaryKeywords?.length > 0) && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Keywords:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {articleInfo.primaryKeyword && (
                <Chip
                  label={articleInfo.primaryKeyword}
                  sx={{
                    bgcolor: 'success.lighter',
                    color: 'success.dark',
                    fontWeight: 'bold'
                  }}
                />
              )}
              {articleInfo.secondaryKeywords?.map((keyword, index) => (
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
        )}

        <Divider sx={{ my: 3 }} />

        {/* Featured Image */}
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

        {/* Generated Article Content */}
        {formData.generatedHtml ? (
          <Box
            sx={{
              '& *': {
                maxWidth: '100%'
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto'
              },
              '& body': {
                margin: 0,
                padding: 0
              }
            }}
            dangerouslySetInnerHTML={{
              __html: (() => {
                // Extract body content from complete HTML document
                const parser = new DOMParser();
                const doc = parser.parseFromString(formData.generatedHtml, 'text/html');
                const bodyContent = doc.body?.innerHTML || formData.generatedHtml;
                return bodyContent;
              })()
            }}
          />
        ) : sections && sections.length > 0 ? (
          sections.map((section, index) => (
            <Box key={index} sx={{ mb: 6 }}>
              {/* Section Title */}
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                {section.title || `Section ${index + 1}`}
              </Typography>

              {/* Content Type Badge */}
              {(section.type === 'faq' || section.contentType) && (
                <Chip
                  label={
                    section.type === 'faq'
                      ? 'FAQ Section'
                      : section.contentType === 'bullet-list'
                        ? 'List Section'
                        : section.contentType === 'table'
                          ? 'Table Section'
                          : section.contentType === 'image-gallery'
                            ? 'Image Gallery'
                            : section.contentType || 'Paragraph'
                  }
                  size="small"
                  sx={{
                    mb: 1.5,
                    bgcolor: 'background.neutral',
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                />
              )}

              {/* Main Content */}
              {section.content && (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                  {section.content}
                </Typography>
              )}

              {/* Bullet Points */}
              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <List disablePadding>
                    {section.bulletPoints.map((point, i) => (
                      <ListItem key={i} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Iconify icon="mdi:circle-small" />
                        </ListItemIcon>
                        <ListItemText primary={point} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Table Data */}
              {section.tableData && section.tableData.headers && section.tableData.rows && (
                <TableContainer component={Paper} sx={{ mb: 2, overflow: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'background.neutral' }}>
                        {section.tableData.headers.map((header, i) => (
                          <TableCell key={i} sx={{ fontWeight: 'bold' }}>
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {section.tableData.rows.map((row: string[], rowIndex: number) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell: string, cellIndex: number) => (
                            <TableCell key={cellIndex}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* FAQ Items */}
              {section.faqItems && section.faqItems.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  {section.faqItems.map((faq, i) => (
                    <Accordion key={i} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<Iconify icon="mdi:chevron-down" />}>
                        <Typography variant="subtitle1">{faq.question}</Typography>
                      </AccordionSummary>
                      <Divider />
                      <AccordionDetails>
                        <Typography variant="body2">{faq.answer}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}

              {/* Internal and External Links */}
              {((section.internalLinks && section.internalLinks.length > 0) ||
                (section.externalLinks && section.externalLinks.length > 0)) && (
                <Box sx={{ mb: 2, mt: 2 }}>
                  {/* Internal Links */}
                  {section.internalLinks && section.internalLinks.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Related Content:
                      </Typography>
                      <List disablePadding>
                        {section.internalLinks.map((link, i) => (
                          <ListItem key={i} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Iconify icon="mdi:link-variant" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Link href={link.url} color="primary" underline="hover">
                                  {link.text}
                                </Link>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* External Links */}
                  {section.externalLinks && section.externalLinks.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Sources:
                      </Typography>
                      <List disablePadding>
                        {section.externalLinks.map((link, i) => (
                          <ListItem key={i} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Iconify icon="mdi:open-in-new" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Link href={link.url} color="primary" underline="hover" target="_blank" rel="noopener">
                                  {link.text}
                                </Link>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              )}

              {index < sections.length - 1 && <Divider sx={{ my: 3 }} />}
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
              No content has been generated yet.
            </Typography>
          </Box>
        )}
      </Box>

    </Box>
  );
}