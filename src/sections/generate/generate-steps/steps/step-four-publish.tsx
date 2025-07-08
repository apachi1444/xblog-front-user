// External imports
// Types

import toast from 'react-hot-toast';
import { useFormContext } from 'react-hook-form';
import React, { useState, useEffect } from 'react';

// Material UI imports
import {
  Box,
  Chip,
  Link,
  List,
  Paper,
  Table,
  Button,
  Divider,
  ListItem,
  TableRow,
  Accordion,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  ListItemIcon,
  ListItemText,
  TableContainer,
  AccordionDetails,
  AccordionSummary
} from '@mui/material';

// API hooks



// Components
import { Iconify } from 'src/components/iconify';
import { HtmlIframeRenderer } from 'src/components/html-renderer';

import type {
  GenerateArticleFormData
} from '../../schemas';

interface Step4PublishProps {
  setActiveStep?: (step: number) => void;
}

export function Step4Publish({ setActiveStep }: Step4PublishProps = {} as Step4PublishProps) {
  // Get form data from context
  const { getValues } = useFormContext<GenerateArticleFormData>();
  const formData = getValues();

  // State to hold the HTML content
  const [htmlContent, setHtmlContent] = useState<string>('');

  // Load the aa.html file content
  useEffect(() => {
    const loadHtmlContent = async () => {
      try {
        // If we have generated HTML from API, use it
        if (formData.generatedHtml) {
          setHtmlContent(formData.generatedHtml);
          return;
        }

        // Otherwise, load the aa.html file directly
        const response = await fetch('/aa.html');
        const htmlText = await response.text();
        setHtmlContent(htmlText);
      } catch (error) {
        setHtmlContent('');
      }
    };

    loadHtmlContent();
  }, [formData.generatedHtml]);

  const { sections } = formData.step3;

  // No global CSS overrides - keep normal layout structure

  // If we have HTML content, show contained preview
  if (htmlContent) {
    return (
      <Box sx={{ pb: 2 }}>
        {/* Action Buttons */}
        <Box sx={{
          display: 'flex',
          gap: 2,
          mb: 2,
          justifyContent: 'flex-end'
        }}>
          {setActiveStep && (
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:edit-2-outline" />}
              onClick={() => setActiveStep(2)}
            >
              Edit Content
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:download-outline" />}
            onClick={() => {
              if (!htmlContent) {
                toast.error('No HTML content available to download');
                return;
              }

              try {
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${formData.step1?.title || 'article'}.html`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success('HTML file downloaded successfully');
              } catch (error) {
                console.error('Error downloading HTML file:', error);
                toast.error('Failed to download HTML file');
              }
            }}
          >
            Download HTML
          </Button>
        </Box>

        {/* HTML Content in Iframe */}
        <Box sx={{
          width: '100%',
          height: 'calc(100vh - 200px)', // Account for header (~80px) + footer (~80px) + padding (~40px)
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          overflow: 'hidden',
          backgroundColor: 'white'
        }}>
          <HtmlIframeRenderer
            htmlContent={htmlContent}
          />
        </Box>
      </Box>
    );
  }

  // Fallback: Show sections if available
  if (sections && sections.length > 0) {
    return (
      <Box sx={{ pb: 2 }}>
        {sections.map((section, index) => (
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
        ))}
      </Box>
    );
  }

  // No content available
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh'
    }}>
      <Typography variant="h6" color="text.secondary">
        No content available to preview
      </Typography>
    </Box>
  );
}