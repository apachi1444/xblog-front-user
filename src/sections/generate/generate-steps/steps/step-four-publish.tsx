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

import { useArticleDraft } from 'src/hooks/useArticleDraft';

// API hooks
import { useGenerateFullArticleMutation } from 'src/services/apis/generateContentApi';

// Components
import { Iconify } from 'src/components/iconify';
import { HtmlIframeRenderer } from 'src/components/html-renderer';
import { TemplateSelectionModal } from 'src/components/generate-article/TemplateSelectionModal';

import type {
  GenerateArticleFormData
} from '../../schemas';

interface Step4PublishProps {
  setActiveStep?: (step: number) => void;
}

export function Step4Publish({ setActiveStep }: Step4PublishProps = {} as Step4PublishProps) {
  // Get form data from context with watch for real-time updates
  const { getValues, watch, setValue } = useFormContext<GenerateArticleFormData>();
  const formData = getValues();

  // Watch for changes in generatedHtml to trigger re-render
  const watchedGeneratedHtml = watch('generatedHtml');

  // State to hold the HTML content
  const [htmlContent, setHtmlContent] = useState<string>('');

  // Template selection state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isRegeneratingWithTemplate, setIsRegeneratingWithTemplate] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<string>('template1');

  // Load HTML content with intelligent priority system and detailed debugging
  useEffect(() => {
    const loadHtmlContent = async () => {
      try {
        // Debug: Log all form data to see what we have
        console.log('🔍 Step 4 Debug - Full form data:', formData);
        console.log('🔍 Step 4 Debug - generatedHtml exists:', !!formData.generatedHtml);
        console.log('🔍 Step 4 Debug - generatedHtml length:', formData.generatedHtml?.length || 0);
        console.log('🔍 Step 4 Debug - generatedHtml preview:', formData.generatedHtml?.substring(0, 200) || 'None');

        // Priority 1: Use API-generated HTML from generate-full-article endpoint
        if (formData.generatedHtml && formData.generatedHtml.trim()) {
          console.log('✅ Using API-generated HTML content from generate-full-article');
          setHtmlContent(formData.generatedHtml);
          return;
        }

        // Priority 2: Build HTML from form data if sections exist but no generated HTML
        if (formData.step3?.sections && formData.step3.sections.length > 0) {
          console.log('⚠️ No API HTML found, but sections exist. Consider calling generate-full-article API');
          console.log('🔍 Available sections:', formData.step3.sections.length);
          // You could trigger the API call here or show a message to the user
          // For now, fall back to static file
        }

        // Priority 3: Fallback to static aa.html file for demo/development purposes
        console.log('⚠️ No API content found, loading static aa.html file for demo');
        const response = await fetch('/aa.html');
        if (!response.ok) {
          throw new Error(`Failed to load aa.html: ${response.status}`);
        }
        const htmlText = await response.text();
        setHtmlContent(htmlText);

      } catch (error) {
        console.error('❌ Failed to load HTML content:', error);
        // Set empty content if all methods fail
        setHtmlContent('');
      }
    };

    loadHtmlContent();
  }, [formData, formData.generatedHtml, formData.step3.sections, watchedGeneratedHtml]);

  const { sections } = formData.step3;

  // API hooks for template regeneration
  const [generateFullArticle] = useGenerateFullArticleMutation();
  const articleDraft = useArticleDraft();

  // Template selection handlers
  const handleOpenTemplateModal = () => {
    setIsTemplateModalOpen(true);
  };

  const handleCloseTemplateModal = () => {
    setIsTemplateModalOpen(false);
  };

  const handleTemplateSelection = async (templateId: string) => {
    setIsRegeneratingWithTemplate(true);
    setCurrentTemplate(templateId);

    try {
      // Prepare the full article request with the new template - matching SectionGenerationAnimation structure exactly
      const fullArticleRequest = {
        title: formData.step1?.title || '',
        meta_title: formData.step1?.metaTitle || '',
        meta_description: formData.step1?.metaDescription || '',
        keywords: formData.step1?.primaryKeyword || '',
        author: 'AI Generated',
        featured_media: formData.step1?.featuredMedia || (formData.images && formData.images.length > 0 ? formData.images[0].img_url : ''),
        reading_time_estimate: 5,
        url: formData.step1?.urlSlug || '',
        faqs: formData.faq || [],
        external_links: formData.step2?.externalLinks?.map((link: any) => ({
          link_text: link.anchorText,
          link_url: link.url
        })) || [],
        table_of_contents: formData.toc || [],
        sections: formData.step3?.sections?.map((section: any) => ({
          key: section.title,
          content: section.content
        })) || [],
        images: formData.images || [],
        language: formData.step1?.language || 'english',
        template_name: templateId
      };

      // Generate new content with the selected template
      const result = await generateFullArticle(fullArticleRequest).unwrap();

      // Update the form data with the new generated HTML
      setValue('generatedHtml', result);

      // Update the HTML content state
      setHtmlContent(result);

      // 🔄 Update the article in the database with the new content
      const articleId = window.location.pathname.split('/').pop();
      if (articleId && articleId !== 'generate') {
        try {
          await articleDraft.updateArticle(articleId, {
            content: result,
            template_name: templateId
          })
        } catch (updateError) {
          toast.error('Content generated but failed to save. Please try saving manually.');
        }
      }

      // Close the modal
      setIsTemplateModalOpen(false);

      toast.success(`Template "${templateId}" applied successfully!`);
    } catch (error) {
      console.error('Failed to regenerate with template:', error);
      toast.error('Failed to apply template. Please try again.');
    } finally {
      setIsRegeneratingWithTemplate(false);
    }
  };

  // No global CSS overrides - keep normal layout structure

  // If we have HTML content, show contained preview
  if (htmlContent) {
    // Determine content source for user feedback
    const contentSource = formData.generatedHtml ? 'API Generated' : 'Demo Content';
    const isApiGenerated = !!formData.generatedHtml;

    return (
      <Box sx={{ pb: 2 }}>
        {/* Content Source Indicator */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          p: 1,
          bgcolor: isApiGenerated ? 'success.lighter' : 'warning.lighter',
          borderRadius: 1,
          border: 1,
          borderColor: isApiGenerated ? 'success.main' : 'warning.main'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify
              icon={isApiGenerated ? 'eva:checkmark-circle-2-fill' : 'eva:info-fill'}
              sx={{ color: isApiGenerated ? 'success.main' : 'warning.main' }}
            />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {contentSource}: {isApiGenerated ? 'Your article has been generated successfully!' : 'Showing demo content - generate your article to see the real result'}
            </Typography>
          </Box>
        </Box>

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
          {isApiGenerated && (
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mdi:palette" />}
              onClick={handleOpenTemplateModal}
              disabled={isRegeneratingWithTemplate}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: 'primary.lighter',
                }
              }}
            >
              {isRegeneratingWithTemplate ? 'Applying...' : 'Edit Styling'}
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

        {/* Template Selection Modal */}
        <TemplateSelectionModal
          open={isTemplateModalOpen}
          onClose={handleCloseTemplateModal}
          onSelectTemplate={handleTemplateSelection}
          isRegenerating={isRegeneratingWithTemplate}
          currentTemplate={currentTemplate}
        />
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
    <>
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

      {/* Template Selection Modal */}
      <TemplateSelectionModal
        open={isTemplateModalOpen}
        onClose={handleCloseTemplateModal}
        onSelectTemplate={handleTemplateSelection}
        isRegenerating={isRegeneratingWithTemplate}
        currentTemplate={currentTemplate}
      />
    </>
  );
}