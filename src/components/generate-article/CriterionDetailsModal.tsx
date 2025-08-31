import type { GenerateArticleFormData } from 'src/sections/generate/schemas';

import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Stack,
  Button,
  Dialog,
  Typography,
  IconButton,
  DialogContent,
} from '@mui/material';

import { EVALUATION_FUNCTIONS } from 'src/utils/seo-criteria-evaluators';

import { Iconify } from 'src/components/iconify';

import { useCriteriaEvaluation } from 'src/sections/generate/hooks/useCriteriaEvaluation';

interface CriterionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  criterionId: number | null;
  fieldPath: string;
  currentValue: string;
}

interface ModalState {
  currentScore: number;
  currentStatus: 'success' | 'warning' | 'error' | 'pending';
  evaluationMessage: string;
  evaluationDetails: {
    inputValue?: string;
    primaryKeyword?: string;
    threshold?: string;
    explanation?: string;
    errorField?: string;
    suggestion?: string;
    improvementTips?: string[];
  };
}

export function CriterionDetailsModal({
  open,
  onClose,
  criterionId,
  fieldPath,
  currentValue,
}: CriterionDetailsModalProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const form = useFormContext<GenerateArticleFormData>();

  const [state, setState] = useState<ModalState>({
    currentScore: 0,
    currentStatus: 'pending',
    evaluationMessage: '',
    evaluationDetails: {},
  });

  const { getCriterionById } = useCriteriaEvaluation();
  const criterion = criterionId ? getCriterionById(criterionId) : null;

  
  // Helper function to format TOC for display
  const formatTocForDisplay = useCallback((tocData: any): string => {
    if (!tocData) return 'No TOC generated';

    try {
      let parsedToc = tocData;
      if (typeof tocData === 'string') {
        parsedToc = JSON.parse(tocData);
      }

      if (!Array.isArray(parsedToc) || parsedToc.length === 0) {
        return 'No TOC generated';
      }

      // Format TOC items with proper indentation
      return parsedToc.map((item: any, index: number) => {
        if (typeof item === 'string') {
          return `${index + 1}. ${item}`;
        } if (item && typeof item === 'object') {
          const title = item.title || item.text || item.heading || 'Untitled';
          const level = item.level || 1;
          const indent = '  '.repeat(Math.max(0, level - 1));
          return `${indent}${index + 1}. ${title}`;
        }
        return `${index + 1}. ${String(item)}`;
      }).join('\n');
    } catch (error) {
      console.error('Error formatting TOC:', error);
      return 'TOC format error';
    }
  }, []);

  // Get detailed evaluation information for specific criteria
  const getEvaluationDetails = useCallback((criterionIdToEvaluate: number, formData: GenerateArticleFormData) => {
    const { step1, step2 } = formData;

    switch (criterionIdToEvaluate) {
      case 101: { // keyword_in_title (Focus keyword used in SEO title)
        return {
          inputValue: step1?.title || 'Not provided',
          primaryKeyword: step1?.primaryKeyword || 'Not provided',
          threshold: 'Primary keyword must be present in title',
          explanation: 'Checks if the primary keyword appears anywhere in the article title',
          errorField: 'SEO Title',
          suggestion: step1?.primaryKeyword ? `Include "${step1.primaryKeyword}" in your title` : 'Add your focus keyword to the title',
          improvementTips: [
            'Place the focus keyword naturally in your title',
            'Ensure the title remains readable and engaging',
            'Consider placing the keyword at the beginning for better SEO impact'
          ]
        };
      }

      case 102: { // keyword_in_meta (Focus keyword used in meta description)
        return {
          inputValue: step1?.metaDescription || 'Not provided',
          primaryKeyword: step1?.primaryKeyword || 'Not provided',
          threshold: 'Primary keyword must be present in meta description',
          explanation: 'Checks if the primary keyword appears in the meta description for better search visibility',
          errorField: 'Meta Description',
          suggestion: step1?.primaryKeyword ? `Include "${step1.primaryKeyword}" in your meta description` : 'Add your focus keyword to the meta description',
          improvementTips: [
            'Include the focus keyword naturally in the meta description',
            'Keep the description between 150-160 characters',
            'Make it compelling to encourage clicks from search results'
          ]
        };
      }

      case 103: { // keyword_in_url (Focus keyword used in URL slug)
        return {
          inputValue: step1?.urlSlug || 'Not provided',
          primaryKeyword: step1?.primaryKeyword || 'Not provided',
          threshold: 'Primary keyword words should be present in URL slug',
          explanation: 'Analyzes URL slug for keyword presence using fuzzy matching and stop word filtering',
          errorField: 'URL Slug',
          suggestion: step1?.primaryKeyword ? `Include "${step1.primaryKeyword}" in your URL slug` : 'Add your focus keyword to the URL slug',
          improvementTips: [
            'Use hyphens to separate words in the URL',
            'Keep the URL short and descriptive',
            'Remove unnecessary words like "a", "the", "and"',
            'Use lowercase letters only'
          ]
        };
      }

      case 104: { // keyword_in_first_10 (Focus keyword appears in the first 10% of the content)
        return {
          inputValue: 'Content (too long to display)',
          primaryKeyword: step1?.primaryKeyword || 'Not provided',
          threshold: 'Primary keyword must appear in first 10% of content',
          explanation: 'Ensures the primary keyword appears early in the content for better SEO ranking',
          errorField: 'Content',
          suggestion: step1?.primaryKeyword ? `Include "${step1.primaryKeyword}" in the first paragraph` : 'Add your focus keyword early in the content',
          improvementTips: [
            'Place the focus keyword in the first 10% of your content',
            'Include it naturally in the introduction or first paragraph',
            'Ensure it flows naturally with the content'
          ]
        };
      }

      case 105: { // keyword_in_content (Focus keyword found in the content)
        return {
          inputValue: 'Content (too long to display)',
          primaryKeyword: step1?.primaryKeyword || 'Not provided',
          threshold: 'Primary keyword must appear in the content',
          explanation: 'Checks if the primary keyword appears anywhere in the article content',
          errorField: 'Content',
          suggestion: step1?.primaryKeyword ? `Include "${step1.primaryKeyword}" throughout your content` : 'Add your focus keyword to the content',
          improvementTips: [
            'Use the focus keyword naturally throughout the content',
            'Maintain a keyword density of 1-3%',
            'Include variations and synonyms of the keyword'
          ]
        };
      }

      case 106: { // content_length (Overall content length)
        return {
          inputValue: 'Content (too long to display)',
          primaryKeyword: step1?.primaryKeyword || 'Not provided',
          threshold: 'Content should be at least 300 words for good SEO',
          explanation: 'Longer content typically performs better in search rankings',
          errorField: 'Content',
          suggestion: 'Expand your content to meet the minimum word count',
          improvementTips: [
            'Aim for at least 300 words for basic SEO',
            'Consider 1000+ words for competitive keywords',
            'Focus on quality and value, not just word count',
            'Break content into readable sections'
          ]
        };
      }

      case 202: { // keyword_density (Focus keyword appearing times)
        return {
          inputValue: 'Content (too long to display)',
          primaryKeyword: step1?.primaryKeyword || 'Not provided',
          threshold: '1% - 3% keyword density (optimal range)',
          explanation: 'Calculates how often the primary keyword appears relative to total word count',
          errorField: 'Content',
          suggestion: step1?.primaryKeyword ? `Optimize "${step1.primaryKeyword}" density to 1-3%` : 'Balance keyword usage in content',
          improvementTips: [
            'Maintain keyword density between 1-3%',
            'Use the keyword naturally, not forced',
            'Include related keywords and synonyms',
            'Focus on user experience over keyword stuffing'
          ]
        };
      }

      case 201: { // keyword_in_subheadings (Focus keyword used in subheadings)
        const tocDisplay = formatTocForDisplay(formData.toc);

        return {
          inputValue: tocDisplay,
          primaryKeyword: step1?.primaryKeyword || 'Not provided',
          threshold: 'Primary keyword should appear in at least one subheading',
          explanation: 'Checks if the primary keyword is used in article subheadings/table of contents',
          errorField: 'Table of Contents',
          suggestion: step1?.primaryKeyword ? `Include "${step1.primaryKeyword}" in your subheadings` : 'Add your focus keyword to subheadings',
          improvementTips: [
            'Use the focus keyword in H2 or H3 headings',
            'Create descriptive subheadings that include the keyword naturally',
            'Structure your content with clear headings hierarchy'
          ]
        };
      }

      case 203: { // url_slug_length (URL slug contains reasonable number of descriptive words)
        const descriptiveWords = ['guide', 'tips', 'how', 'best', 'complete', 'ultimate', 'essential', 'advanced', 'beginner', 'professional'];

        return {
          inputValue: step1?.urlSlug || 'Not provided',
          threshold: 'URL should contain 3-5 descriptive words',
          explanation: 'URL slugs should be concise but descriptive for better SEO and user experience',
          errorField: 'URL Slug',
          suggestion: `Use descriptive words like: ${descriptiveWords.join(', ')}`,
          improvementTips: [
            'Keep URL between 3-5 words',
            'Use descriptive words that explain the content',
            'Remove stop words (a, the, and, or, but)',
            'Use hyphens to separate words'
          ]
        };
      }

      case 204: { // external_links (External links are included)
        const linkCount = step2?.externalLinks?.length || 0;
        return {
          inputValue: linkCount > 0 ? `${linkCount} external links added` : 'No external links added',
          threshold: 'At least one external link required',
          explanation: 'External links to authoritative sources improve content credibility and SEO',
          errorField: 'External Links',
          suggestion: 'Add external links to authoritative sources',
          improvementTips: [
            'Link to reputable websites in your industry',
            'Add links to government, educational, or well-known sources',
            'Try to generate them in step two of the article creation',
            'Ensure links are relevant to your content'
          ]
        };
      }

      case 205: { // dofollow_links (At least one external link with DoFollow)
        const linkCount = step2?.externalLinks?.length || 0;
        return {
          inputValue: linkCount > 0 ? `${linkCount} external links (dofollow by default)` : 'No external links added',
          threshold: 'At least one dofollow external link required',
          explanation: 'Dofollow links pass SEO authority to linked sites and show search engines you link to quality content',
          errorField: 'External Links',
          suggestion: 'Add dofollow external links to quality sources',
          improvementTips: [
            'Most external links are dofollow by default',
            'Link to high-authority, relevant websites',
            'Ensure the linked content adds value to your readers',
            'Balance between dofollow and nofollow links if needed'
          ]
        };
      }

      case 206: { // internal_links (Internal links are included)
        const linkCount = step2?.internalLinks?.length || 0;
        return {
          inputValue: linkCount > 0 ? `${linkCount} internal links added` : 'No internal links added',
          threshold: 'At least one internal link required',
          explanation: 'Internal links help users navigate your site and distribute page authority across your content',
          errorField: 'Internal Links',
          suggestion: 'Add internal links to related content on your website',
          improvementTips: [
            'Link to related articles on your website',
            'Use descriptive anchor text for internal links',
            'Try to generate them in step two of the article creation',
            'Create a logical linking structure'
          ]
        };
      }

      case 301: { // keyword_at_start (Focus keyword used in the start of SEO title)
        return {
          inputValue: step1?.title || 'Not provided',
          primaryKeyword: step1?.primaryKeyword || 'Not provided',
          threshold: 'Primary keyword should appear at the beginning of title',
          explanation: 'Keywords at the start of titles have more SEO weight and better click-through rates',
          errorField: 'SEO Title',
          suggestion: step1?.primaryKeyword ? `Start your title with "${step1.primaryKeyword}"` : 'Place your focus keyword at the beginning of the title',
          improvementTips: [
            'Place the focus keyword within the first 3 words',
            'Ensure the title still reads naturally',
            'Consider the user experience alongside SEO benefits'
          ]
        };
      }

      case 302: { // sentiment (Title has a positive or negative sentiment)
        const positiveWords = ['amazing', 'best', 'ultimate', 'complete', 'essential', 'proven', 'effective', 'powerful', 'incredible', 'outstanding'];
        const negativeWords = ['avoid', 'mistakes', 'problems', 'issues', 'wrong', 'bad', 'terrible', 'worst', 'dangerous', 'harmful'];

        return {
          inputValue: step1?.title || 'Not provided',
          threshold: 'Title should contain positive or negative sentiment words',
          explanation: 'Sentiment words in titles improve click-through rates and user engagement',
          errorField: 'Title',
          suggestion: `Use sentiment words like: ${[...positiveWords.slice(0, 5), ...negativeWords.slice(0, 5)].join(', ')}`,
          improvementTips: [
            `Positive words: ${positiveWords.join(', ')}`,
            `Negative words: ${negativeWords.join(', ')}`,
            'Choose words that match your content tone',
            'Ensure the sentiment aligns with your article content'
          ]
        };
      }

      case 303: { // power_words (Title contains 2 power words)
        const powerWords = ['ultimate', 'complete', 'essential', 'proven', 'secret', 'exclusive', 'advanced', 'professional', 'expert', 'master', 'breakthrough', 'revolutionary', 'cutting-edge', 'comprehensive', 'definitive'];

        return {
          inputValue: step1?.title || 'Not provided',
          threshold: 'Title should contain at least 2 power words',
          explanation: 'Power words create emotional impact and increase the likelihood of clicks and engagement',
          errorField: 'Title',
          suggestion: `Include power words like: ${powerWords.slice(0, 8).join(', ')}`,
          improvementTips: [
            `Power words: ${powerWords.join(', ')}`,
            'Use 2-3 power words for maximum impact',
            'Ensure power words fit naturally in your title',
            'Choose words that match your content value'
          ]
        };
      }

      case 401: { // table_of_contents (TOC is included)
        const tocDisplay = formatTocForDisplay(formData.toc);

        return {
          inputValue: tocDisplay,
          threshold: 'Article should include a table of contents',
          explanation: 'Table of contents improves user experience and helps search engines understand content structure',
          errorField: 'Table of Contents',
          suggestion: 'Generate a table of contents for your article',
          improvementTips: [
            'Try to regenerate the article due to server problems',
            'Ensure your article has clear headings structure',
            'Use H2, H3 headings to create logical sections',
            'Keep TOC items descriptive and relevant'
          ]
        };
      }

      case 402: { // short_paragraphs (Short paragraphs are used)
        return {
          inputValue: 'Content (too long to display)',
          threshold: 'Paragraphs should be 3-4 sentences maximum',
          explanation: 'Short paragraphs improve readability and user engagement',
          errorField: 'Content',
          suggestion: 'Break long paragraphs into shorter, more readable sections',
          improvementTips: [
            'Keep paragraphs to 3-4 sentences maximum',
            'Use white space to improve readability',
            'Check your content structure again',
            'Consider bullet points for lists'
          ]
        };
      }

      case 403: { // media_content (Content contains images and/or videos)
        let imageCount = 0;
        try {
          if (formData.images && typeof formData.images === 'string') {
            const parsedImages = JSON.parse(formData.images);
            imageCount = parsedImages.length || 0;
          }
        } catch (error) {
          console.error('Error parsing images for criterion details:', error);
        }

        return {
          inputValue: imageCount > 0 ? `${imageCount} images generated` : 'No images generated',
          threshold: 'Article should include images or videos',
          explanation: 'Visual content improves engagement and helps break up text',
          errorField: 'Images',
          suggestion: 'Add images or videos to your article',
          improvementTips: [
            'Try to regenerate the article due to server problems',
            'Include relevant images that support your content',
            'Use alt text for all images',
            'Consider infographics or charts for data'
          ]
        };
      }

      default:
        return {
          inputValue: 'Not available',
          threshold: 'Criterion-specific requirements',
          explanation: 'Detailed evaluation information not available for this criterion',
          errorField: 'Unknown',
          suggestion: 'Check the specific requirements for this criterion',
          improvementTips: [
            'Review the criterion requirements',
            'Contact support if you need assistance',
            'Check the documentation for more details'
          ]
        };
    }
  }, [formatTocForDisplay]);

  // Simple evaluation function
  const evaluateCriterion = useCallback((criterionIdToEvaluate: number, value: string) => {
    if (!criterionIdToEvaluate || !criterion || !fieldPath) {
      return { status: 'pending', score: 0, message: '' };
    }

    try {
      const formValues = form.getValues();

      // Create a deep copy of form values to simulate the change
      const simulatedFormValues = JSON.parse(JSON.stringify(formValues));

      // Parse the fieldPath (e.g., "step1.contentDescription")
      const [stepName, fieldName] = fieldPath.split('.');

      // Ensure the step exists
      if (!simulatedFormValues[stepName]) {
        simulatedFormValues[stepName] = {};
      }

      // Update the specific field
      simulatedFormValues[stepName][fieldName] = value;

      const evaluationFn = EVALUATION_FUNCTIONS[criterionIdToEvaluate];
      if (evaluationFn) {
        const result = evaluationFn(null, simulatedFormValues);
        return result;
      }

      return { status: 'pending', score: 0, message: '' };
    } catch (error) {
      console.error('Evaluation error:', error);
      return { status: 'error', score: 0, message: 'Evaluation error' };
    }
  }, [criterion, fieldPath, form]);

  // Initialize modal when opened
  useEffect(() => {
    if (open && criterion && criterionId) {
      const result = evaluateCriterion(criterionId, currentValue);
      const formData = form.getValues();
      const details = getEvaluationDetails(criterionId, formData);

      setState({
        currentScore: result.score,
        currentStatus: result.status as any,
        evaluationMessage: result.message || '',
        evaluationDetails: details,
      });
    }
  }, [open, criterion, criterionId, currentValue, evaluateCriterion, form, getEvaluationDetails]);

  if (!criterion) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh',
        }
      }}
    >
      {/* Simple Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t(criterion.description)}
        </Typography>

        <IconButton onClick={onClose} size="small">
          <Iconify icon="eva:close-fill" width={20} height={20} />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          p: 4,
          maxHeight: '70vh',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(theme.palette.grey[300], 0.2),
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(theme.palette.primary.main, 0.3),
            borderRadius: 4,
            '&:hover': {
              background: alpha(theme.palette.primary.main, 0.5),
            },
          },
        }}
      >
        <Stack spacing={3}>
          {/* Simple Score Display */}
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: theme.palette.grey[50],
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {state.currentScore} / {criterion.weight} points
              </Typography>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: state.currentStatus === 'success' ? theme.palette.success.light :
                           state.currentStatus === 'warning' ? theme.palette.warning.light :
                           theme.palette.error.light,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: state.currentStatus === 'success' ? theme.palette.success.dark :
                           state.currentStatus === 'warning' ? theme.palette.warning.dark :
                           theme.palette.error.dark,
                  }}
                >
                  {state.currentStatus === 'success' ? 'GOOD' :
                   state.currentStatus === 'warning' ? 'NEEDS WORK' :
                   'NEEDS WORK'}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Simple What to Fix */}
          {state.evaluationDetails.suggestion && (
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: theme.palette.grey[50],
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                What to fix:
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {state.evaluationDetails.suggestion}
              </Typography>
            </Box>
          )}




        </Stack>
      </DialogContent>

      {/* Enhanced Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: 1,
            px: 3,
          }}
        >
          Got it
        </Button>
      </Box>
    </Dialog>
  );
}

export default CriterionDetailsModal;
