import type { GenerateArticleFormData } from 'src/sections/generate/schemas';

import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Chip,
  Grid,
  Stack,
  Button,
  Dialog,
  Typography,
  IconButton,
  DialogContent,
  LinearProgress,
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

  // Get remaining status descriptions based on current status
  const getRemainingStatusDescriptions = useCallback((criterione: any, currentStatus: string) => {
    const remainingStatuses = [];

    if (criterione.statusType === 'ternary') {
      if (currentStatus === 'error') {
        // Show warning and success
        if (criterione.evaluationStatus.warning) {
          remainingStatuses.push({
            status: 'warning',
            description: t(criterione.evaluationStatus.warning),
            points: criterione.warningScore || Math.floor(criterione.weight * 0.75)
          });
        }
        remainingStatuses.push({
          status: 'success',
          description: t(criterione.evaluationStatus.success),
          points: criterione.weight
        });
      } else if (currentStatus === 'warning') {
        // Show success only
        remainingStatuses.push({
          status: 'success',
          description: t(criterione.evaluationStatus.success),
          points: criterione.weight
        });
      }
    } else if (criterione.statusType === 'binary') {
      if (currentStatus === 'error') {
        // Show success only
        remainingStatuses.push({
          status: 'success',
          description: t(criterione.evaluationStatus.success),
          points: criterione.weight
        });
      }
    }

    return remainingStatuses;
  }, [t]);

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
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          maxHeight: '90vh',
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
            : `linear-gradient(135deg, ${alpha('#fff', 0.98)} 0%, ${alpha(theme.palette.grey[50], 0.9)} 100%)`,
          backdropFilter: 'blur(20px)',
          boxShadow: theme.palette.mode === 'dark'
            ? `0 25px 50px ${alpha('#000', 0.5)}`
            : `0 25px 50px ${alpha('#000', 0.15)}`,
        }
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(8px)',
          backgroundColor: alpha('#000', 0.3),
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: state.currentStatus === 'success'
            ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
            : state.currentStatus === 'warning'
            ? `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`
            : `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
          color: 'white',
          p: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: alpha('#fff', 0.2),
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Iconify
                  icon={state.currentStatus === 'success' ? "eva:checkmark-circle-2-fill" :
                        state.currentStatus === 'warning' ? "eva:alert-triangle-fill" :
                        "eva:close-circle-fill"}
                  width={24}
                  height={24}
                />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {t(criterion.description)}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <IconButton
            onClick={onClose}
            size="large"
            sx={{
              color: 'white',
              bgcolor: alpha('#fff', 0.15),
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: alpha('#fff', 0.25),
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Iconify icon="eva:close-fill" width={20} height={20} />
          </IconButton>
        </Stack>
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
        <Stack spacing={2.5}>
          {/* Compact Score Header */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(
                state.currentStatus === 'success' ? theme.palette.success.main :
                state.currentStatus === 'warning' ? theme.palette.warning.main :
                theme.palette.error.main, 0.08
              )} 0%, ${alpha(
                state.currentStatus === 'success' ? theme.palette.success.main :
                state.currentStatus === 'warning' ? theme.palette.warning.main :
                theme.palette.error.main, 0.03
              )} 100%)`,
              border: `1px solid ${alpha(
                state.currentStatus === 'success' ? theme.palette.success.main :
                state.currentStatus === 'warning' ? theme.palette.warning.main :
                theme.palette.error.main, 0.2
              )}`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: alpha(
                    state.currentStatus === 'success' ? theme.palette.success.main :
                    state.currentStatus === 'warning' ? theme.palette.warning.main :
                    theme.palette.error.main, 0.1
                  ),
                  minWidth: 60,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 800, color:
                  state.currentStatus === 'success' ? theme.palette.success.main :
                  state.currentStatus === 'warning' ? theme.palette.warning.main :
                  theme.palette.error.main, lineHeight: 1
                }}>
                  {Math.round((state.currentScore / criterion.weight) * 100)}%
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {state.currentScore} / {criterion.weight} points
                  </Typography>
                  <Chip
                    label={state.currentStatus.toUpperCase()}
                    size="small"
                    sx={{
                      bgcolor: state.currentStatus === 'success' ? theme.palette.success.main :
                               state.currentStatus === 'warning' ? theme.palette.warning.main :
                               theme.palette.error.main,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 24,
                    }}
                  />
                </Stack>

                {/* Compact Progress Bar */}
                <LinearProgress
                  variant="determinate"
                  value={(state.currentScore / criterion.weight) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.grey[300], 0.3),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      bgcolor: state.currentStatus === 'success' ? theme.palette.success.main :
                               state.currentStatus === 'warning' ? theme.palette.warning.main :
                               theme.palette.error.main,
                    },
                  }}
                />
              </Box>
            </Stack>
          </Box>

          {/* Compact Evaluation Details */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.6)
                : alpha('#fff', 0.8),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify
                icon="eva:settings-2-fill"
                width={18}
                height={18}
                sx={{ color: theme.palette.primary.main }}
              />
              Evaluation Details
            </Typography>

            <Grid container spacing={2}>
              {/* Current Input Value */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify
                    icon="eva:edit-2-fill"
                    width={16}
                    height={16}
                    sx={{ color: theme.palette.info.main }}
                  />
                  Current Input Value
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: alpha(theme.palette.info.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    borderLeft: `3px solid ${theme.palette.info.main}`,
                    maxHeight: 100,
                    overflow: 'auto',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      fontSize: '0.9rem',
                      whiteSpace: 'pre-line', // Preserve line breaks for TOC formatting
                      fontFamily: state.evaluationDetails.inputValue?.includes('\n') ? 'monospace' : 'inherit', // Use monospace for structured content
                    }}
                  >
                    {state.evaluationDetails.inputValue || 'Not provided'}
                  </Typography>
                </Box>
              </Grid>

              {/* Success Criteria */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify
                    icon="eva:checkmark-circle-2-fill"
                    width={16}
                    height={16}
                    sx={{ color: theme.palette.success.main }}
                  />
                  Success Criteria
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: alpha(theme.palette.success.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    borderLeft: `3px solid ${theme.palette.success.main}`,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      fontSize: '0.9rem',
                    }}
                  >
                    {state.evaluationDetails.threshold || 'Criterion-specific requirements'}
                  </Typography>
                </Box>
              </Grid>

              {/* How It Works */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify
                    icon="eva:bulb-fill"
                    width={16}
                    height={16}
                    sx={{ color: theme.palette.grey[600] }}
                  />
                  How It Works
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: alpha(theme.palette.grey[600], 0.05),
                    border: `1px solid ${alpha(theme.palette.grey[600], 0.2)}`,
                    borderLeft: `3px solid ${theme.palette.grey[600]}`,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {state.evaluationDetails.explanation || 'Evaluation details not available'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Compact Improvement Suggestions */}
          {(state.evaluationDetails.suggestion || state.evaluationDetails.improvementTips) && (
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                background: alpha(theme.palette.secondary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.15)}`,
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify
                  icon="eva:lightbulb-fill"
                  width={18}
                  height={18}
                  sx={{ color: theme.palette.secondary.main }}
                />
                Improvement Suggestions
              </Typography>

              <Grid container spacing={2}>
                {/* Error Field and Suggestion */}
                {state.evaluationDetails.errorField && state.evaluationDetails.suggestion && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        📍 Focus on:
                      </Typography>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          background: alpha(theme.palette.error.main, 0.1),
                          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
                          {state.evaluationDetails.errorField}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        💡 Expand your content to meet the minimum word count
                      </Typography>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          background: alpha(theme.palette.secondary.main, 0.05),
                          border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                          borderLeft: `3px solid ${theme.palette.secondary.main}`,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                          {state.evaluationDetails.suggestion}
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          )}

          {/* Compact Score Improvement */}
          {state.currentStatus !== 'success' && (
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                background: alpha(theme.palette.success.main, 0.05),
                border: `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify
                  icon="eva:arrow-up-fill"
                  width={18}
                  height={18}
                  sx={{ color: theme.palette.success.main }}
                />
                How to Improve Your Score
              </Typography>

              <Stack spacing={1.5}>
                {getRemainingStatusDescriptions(criterion, state.currentStatus).map((statusInfo, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: alpha(
                        statusInfo.status === 'success' ? theme.palette.success.main : theme.palette.warning.main, 0.05
                      ),
                      border: `1px solid ${alpha(
                        statusInfo.status === 'success' ? theme.palette.success.main : theme.palette.warning.main, 0.2
                      )}`,
                      borderLeft: `3px solid ${statusInfo.status === 'success' ? theme.palette.success.main : theme.palette.warning.main}`,
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Chip
                        label={statusInfo.status.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor: statusInfo.status === 'success' ? theme.palette.success.main : theme.palette.warning.main,
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          height: 24,
                        }}
                      />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: statusInfo.status === 'success' ? theme.palette.success.main : theme.palette.warning.main }}>
                        +{statusInfo.points} points
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {statusInfo.description}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      {/* Enhanced Footer */}
      <Box
        sx={{
          p: 3,
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.grey[50], 0.9)} 0%, ${alpha('#fff', 0.8)} 100%)`,
          borderTop: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
          {/* Quick tip */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.7 }}>
            <Iconify icon="eva:lightbulb-fill" width={16} height={16} />
            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
              Tip: Improve your score by following the success criteria above
            </Typography>
          </Box>

          <Button
            onClick={onClose}
            variant="contained"
            size="large"
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                transform: 'translateY(-1px)',
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Got it!
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}

export default CriterionDetailsModal;
