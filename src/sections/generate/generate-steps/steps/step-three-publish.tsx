// External imports
// Types

import type { UpdateArticleRequest } from 'src/services/apis/articlesApi';
// API hooks
import type { GenerateFullArticleRequest} from 'src/services/apis/generateContentApi';

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

import { useGenerateFullArticleMutation } from 'src/services/apis/generateContentApi';

// Components
import { Iconify } from 'src/components/iconify';
import { HtmlIframeRenderer } from 'src/components/html-renderer';
import { TemplateSelectionModal } from 'src/components/generate-article/TemplateSelectionModal';

import type {
  GenerateArticleFormData
} from '../../schemas';

interface Step4PublishProps {
  articleId ?: string | null;
  setActiveStep?: (step: number) => void;
  onTriggerFeedback?: () => void;
}

export function Step4Publish({ setActiveStep, onTriggerFeedback, articleId }: Step4PublishProps = {} as Step4PublishProps) {
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

  useEffect(() => {
    const loadHtmlContent = async () => {
      try {
        if (formData.generatedHtml && formData.generatedHtml.trim()) {
          setHtmlContent(formData.generatedHtml);

          // Trigger feedback modal if content is generated and feedback hasn't been shown
          if (!feedbackShown && onTriggerFeedback) {
            setTimeout(() => {
              onTriggerFeedback();
              setFeedbackShown(true);
            }, 20000);
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
      // Parse string data back to arrays for API call
      let parsedImages = [];
      let parsedFaq = [];
      let parsedToc = [];

      try {
        if (formData.images && typeof formData.images === 'string') {
          parsedImages = JSON.parse(formData.images);
        }
        if (formData.faq && typeof formData.faq === 'string') {
          parsedFaq = JSON.parse(formData.faq);
        }
        if (formData.toc && typeof formData.toc === 'string') {
          parsedToc = JSON.parse(formData.toc);
        }
      } catch (error) {
        console.error('Error parsing form data:', error);
      }

      // Prepare the full article request with the new template - matching SectionGenerationAnimation structure exactly
      const fullArticleRequest : GenerateFullArticleRequest = {
        title: formData.step1?.title || '',
        meta_title: formData.step1?.metaTitle || '',
        meta_description: formData.step1?.metaDescription || '',
        keywords: formData.step1?.primaryKeyword || '',
        author: 'AI Generated',
        featured_media: formData.step1?.featuredMedia || (parsedImages && parsedImages.length > 0 ? parsedImages[0].img_url : ''),
        reading_time_estimate: 5,
        url: formData.step1?.urlSlug || '',
        faqs: parsedFaq || [],
        external_links: formData.step2?.externalLinks?.map((link: any) => ({
          link_text: link.anchorText,
          link_url: link.url
        })) || [],
        table_of_contents: parsedToc || [],
        sections: formData.step3?.sections?.map((section: any) => ({
          key: section.title,
          content: section.content
        })) || [],
        language: formData.step1?.language || 'english',
        template_name: templateId
      };

      // Generate new content with the selected template
      const result = await generateFullArticle(fullArticleRequest).unwrap();

      // Update the form data with the new generated HTML
      setValue('generatedHtml', result);

      // Update the HTML content state
      setHtmlContent(result);

      if (articleId) {
        try {
          // Get the latest form data after HTML generation
          const updatedFormData = getValues();

          // Prepare complete request body with all form data
          const requestBody: UpdateArticleRequest = {
            // Step 1 fields
            article_title: updatedFormData.step1?.title || undefined,
            content__description: updatedFormData.step1?.contentDescription || undefined,
            meta_title: updatedFormData.step1?.metaTitle || undefined,
            meta_description: updatedFormData.step1?.metaDescription || undefined,
            url_slug: updatedFormData.step1?.urlSlug || undefined,
            primary_keyword: updatedFormData.step1?.primaryKeyword || undefined,
            secondary_keywords: updatedFormData.step1?.secondaryKeywords?.length ? JSON.stringify(updatedFormData.step1.secondaryKeywords) : undefined,
            target_country: updatedFormData.step1?.targetCountry || 'global',
            language: updatedFormData.step1?.language || 'english',

            // Step 2 fields
            article_type: updatedFormData.step2?.articleType || undefined,
            article_size: updatedFormData.step2?.articleSize || undefined,
            tone_of_voice: updatedFormData.step2?.toneOfVoice || undefined,
            point_of_view: updatedFormData.step2?.pointOfView || undefined,
            plagiat_removal: updatedFormData.step2?.plagiaRemoval || false,
            include_images: updatedFormData.step2?.includeImages || false,
            include_videos: updatedFormData.step2?.includeVideos || false,
            internal_links: updatedFormData.step2?.internalLinks?.length ? JSON.stringify(updatedFormData.step2.internalLinks) : '',
            external_links: updatedFormData.step2?.externalLinks?.length ? JSON.stringify(updatedFormData.step2.externalLinks) : '',

            // Generated content - including the new HTML content
            content: result, // This is the newly generated HTML
            sections: updatedFormData.step3?.sections?.length ? JSON.stringify(updatedFormData.step3.sections) : '',
            toc: updatedFormData.toc || null,
            images: updatedFormData.images || null,
            faq: updatedFormData.faq || null,
            featured_media: updatedFormData.step1?.featuredMedia || undefined,

            // Template information
            template_name: templateId,

            status: 'draft' as const,
          };

          await articleDraft.updateArticle(articleId, requestBody);
        } catch (updateError) {
          toast.error('Content generated but failed to save. Please try saving manually.');
        }
      }

      // Close the modal
      setIsTemplateModalOpen(false);

      toast.success(`Template "${templateId}" applied successfully!`);
    } catch (error) {
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