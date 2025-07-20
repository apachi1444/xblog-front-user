// External imports
// Types

import toast from 'react-hot-toast';
import { useFormContext } from 'react-hook-form';
import React, { useState, useEffect } from 'react';

// Material UI imports
import {
  Box,
  Button,
  Typography
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
  onTriggerFeedback?: () => void;
}

export function Step4Publish({ setActiveStep, onTriggerFeedback }: Step4PublishProps = {} as Step4PublishProps) {
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

  // Feedback state
  const [feedbackShown, setFeedbackShown] = useState(false);

  // Load HTML content with intelligent priority system and detailed debugging
  useEffect(() => {
    const loadHtmlContent = async () => {
      try {
        // Priority 1: Use API-generated HTML from generate-full-article endpoint
        if (formData.generatedHtml && formData.generatedHtml.trim()) {
          setHtmlContent(formData.generatedHtml);

          // Trigger feedback modal if content is generated and feedback hasn't been shown
          if (!feedbackShown && onTriggerFeedback) {
            setTimeout(() => {
              onTriggerFeedback();
              setFeedbackShown(true);
            }, 1500); // Show feedback modal after 1.5 seconds
          }
          return;
        }

        const response = await fetch('/aa.html');
        if (!response.ok) {
          throw new Error(`Failed to load aa.html: ${response.status}`);
        }
        const htmlText = await response.text();
        setHtmlContent(htmlText);

      } catch (error) {
        // Set empty content if all methods fail
        setHtmlContent('');
      }
    };

    loadHtmlContent();
  }, [formData, formData.generatedHtml, formData.step3.sections, watchedGeneratedHtml, feedbackShown, onTriggerFeedback]);

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