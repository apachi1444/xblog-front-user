import type { GenerateArticleFormData } from 'src/sections/generate/schemas';

import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Chip,
  Stack,
  Button,
  Dialog,
  Divider,
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

  // Get detailed evaluation information for specific criteria
  const getEvaluationDetails = useCallback((criterionIdToEvaluate: number, formData: GenerateArticleFormData) => {
    const { step1, step2 } = formData;

    switch (criterionIdToEvaluate) {
      case 101: { // keyword_in_title
        return {
          inputValue: step1?.title || 'Not provided',
          primaryKeyword: step1?.primaryKeyword || 'Not provided',
          threshold: 'Primary keyword must be present in title',
          explanation: 'Checks if the primary keyword appears anywhere in the article title'
        };
      }

      case 102: { // keyword_in_meta
        return {
          inputValue: step1?.metaDescription || 'Not provided',
          primaryKeyword: step1?.primaryKeyword || 'Not provided',
          threshold: 'Primary keyword must be present in meta description',
          explanation: 'Checks if the primary keyword appears in the meta description for better search visibility'
        };
      }

      case 103: { // keyword_in_url
        return {
          inputValue: step1?.urlSlug || 'Not provided',
          primaryKeyword: step1?.primaryKeyword || 'Not provided',
          threshold: 'Primary keyword words should be present in URL slug',
          explanation: 'Analyzes URL slug for keyword presence using fuzzy matching and stop word filtering'
        };
      }

      case 202: { // keyword_density
        const contentPreview = step1?.contentDescription ?
          (step1.contentDescription.length > 150 ?
            `${step1.contentDescription.substring(0, 150)  }...` :
            step1.contentDescription) : 'Not provided';

        return {
          inputValue: contentPreview,
          primaryKeyword: step1?.primaryKeyword || 'Not provided',
          threshold: '1% - 3% keyword density (optimal range)',
          explanation: 'Calculates how often the primary keyword appears relative to total word count'
        };
      }

      case 104: { // keyword_in_first_10
        const contentPreview = step1?.contentDescription ?
          (step1.contentDescription.length > 100 ?
            `${step1.contentDescription.substring(0, 100)  }...` :
            step1.contentDescription) : 'Not provided';

        return {
          inputValue: contentPreview,
          primaryKeyword: step1?.primaryKeyword || 'Not provided',
          threshold: 'Primary keyword must appear in first 10% of content',
          explanation: 'Ensures the primary keyword appears early in the content for better SEO ranking'
        };
      }

      case 201: { // images_included
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
          threshold: 'At least one image required',
          explanation: 'Articles with images have better engagement and SEO performance'
        };
      }

      case 203: { // keyword_in_subheadings
        let tocCount = 0;
        try {
          if (formData.toc && typeof formData.toc === 'string') {
            const parsedToc = JSON.parse(formData.toc);
            tocCount = parsedToc.length || 0;
          }
        } catch (error) {
          console.error('Error parsing TOC for criterion details:', error);
        }

        return {
          inputValue: tocCount > 0 ? `${tocCount} table of contents items` : 'No TOC generated',
          primaryKeyword: step1?.primaryKeyword || 'Not provided',
          threshold: 'Primary keyword should appear in at least one subheading',
          explanation: 'Checks if the primary keyword is used in article subheadings/table of contents'
        };
      }

      case 204: { // external_links
        const linkCount = step2?.externalLinks?.length || 0;
        return {
          inputValue: linkCount > 0 ? `${linkCount} external links added` : 'No external links added',
          threshold: 'At least one external link required',
          explanation: 'External links to authoritative sources improve content credibility and SEO'
        };
      }

      case 205: { // dofollow_links
        const linkCount = step2?.externalLinks?.length || 0;
        return {
          inputValue: linkCount > 0 ? `${linkCount} external links (dofollow by default)` : 'No external links added',
          threshold: 'At least one dofollow external link required',
          explanation: 'Dofollow links pass SEO authority to linked sites and show search engines you link to quality content'
        };
      }

      case 206: { // internal_links
        const linkCount = step2?.internalLinks?.length || 0;
        return {
          inputValue: linkCount > 0 ? `${linkCount} internal links added` : 'No internal links added',
          threshold: 'At least one internal link required',
          explanation: 'Internal links help users navigate your site and distribute page authority across your content'
        };
      }

      case 301: { // keyword_at_start
        return {
          inputValue: step1?.title || 'Not provided',
          primaryKeyword: step1?.primaryKeyword || 'Not provided',
          threshold: 'Primary keyword should appear at the beginning of title',
          explanation: 'Keywords at the start of titles have more SEO weight and better click-through rates'
        };
      }

      case 302: { // sentiment
        return {
          inputValue: step1?.title || 'Not provided',
          threshold: 'Title should contain positive sentiment words',
          explanation: 'Positive sentiment in titles improves click-through rates and user engagement'
        };
      }

      case 303: { // power_words
        return {
          inputValue: step1?.title || 'Not provided',
          threshold: 'Title should contain at least 2 power words',
          explanation: 'Power words create emotional impact and increase the likelihood of clicks and engagement'
        };
      }

      default:
        return {
          inputValue: 'Not available',
          threshold: 'Criterion-specific requirements',
          explanation: 'Detailed evaluation information not available for this criterion'
        };
    }
  }, []);

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
          overflow: 'hidden',
          maxHeight: '85vh',
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`
            : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
          color: 'white',
          p: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                p: 1,
                borderRadius: 1.5,
                background: alpha('#fff', 0.2),
              }}
            >
              <Iconify icon="eva:info-fill" width={20} height={20} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t(criterion.description)}
            </Typography>
          </Stack>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: 'white',
              bgcolor: alpha('#fff', 0.1),
              '&:hover': { bgcolor: alpha('#fff', 0.2) }
            }}
          >
            <Iconify icon="eva:close-fill" width={18} height={18} />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 2.5, maxHeight: '70vh', overflow: 'auto' }}>
        <Stack spacing={2.5}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: 2,
              background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.8)
                : alpha(theme.palette.grey[50], 0.8),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
              <Iconify icon="eva:trending-up-fill" width={18} height={18} />
              Current Score Analysis
            </Typography>

            <Stack spacing={2}>
              {/* Score Progress */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Score: {state.currentScore} / {criterion.weight}
                  </Typography>
                  <Chip
                    label={state.currentStatus.toUpperCase()}
                    size="small"
                    sx={{
                      bgcolor: state.currentStatus === 'success' ? theme.palette.success.main :
                               state.currentStatus === 'warning' ? theme.palette.warning.main :
                               theme.palette.error.main,
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                    }}
                  />
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={(state.currentScore / criterion.weight) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.grey[500], 0.2),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: state.currentStatus === 'success' ? theme.palette.success.main :
                               state.currentStatus === 'warning' ? theme.palette.warning.main :
                               theme.palette.error.main,
                      borderRadius: 3,
                    }
                  }}
                />
              </Box>

              {/* Status Message */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: state.currentStatus === 'success' ? alpha(theme.palette.success.main, 0.1) :
                           state.currentStatus === 'warning' ? alpha(theme.palette.warning.main, 0.1) :
                           alpha(theme.palette.error.main, 0.1),
                  border: `1px solid ${alpha(
                    state.currentStatus === 'success' ? theme.palette.success.main :
                    state.currentStatus === 'warning' ? theme.palette.warning.main :
                    theme.palette.error.main, 0.3
                  )}`,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {state.currentStatus === 'success' ? t(criterion.evaluationStatus.success) :
                   state.currentStatus === 'warning' && criterion.evaluationStatus.warning ? t(criterion.evaluationStatus.warning) :
                   t(criterion.evaluationStatus.error)}
                </Typography>
              </Box>
            </Stack>
          </Card>

          {/* Detailed Evaluation Logic */}
          <Card
            sx={{
              p: 2.5,
              borderRadius: 2,
              background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.8)
                : alpha(theme.palette.grey[50], 0.8),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
              <Iconify icon="eva:settings-2-fill" width={18} height={18} />
              Evaluation Logic
            </Typography>

            <Stack spacing={2}>
              {/* Input Value */}
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Iconify icon="eva:edit-2-fill" width={16} height={16} />
                  Input Value
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    maxHeight: 120,
                    overflow: 'auto'
                  }}
                >
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-word' }}>
                    {state.evaluationDetails.inputValue || 'Not provided'}
                  </Typography>
                </Box>
              </Box>

              {/* Primary Keyword (if applicable) */}
              {state.evaluationDetails.primaryKeyword && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Iconify icon="eva:search-fill" width={16} height={16} />
                    Primary Keyword
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.warning.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}`,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                      {state.evaluationDetails.primaryKeyword}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Requirement */}
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Iconify icon="eva:checkmark-circle-2-fill" width={16} height={16} />
                  Requirement
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {state.evaluationDetails.threshold || 'Criterion-specific requirements'}
                  </Typography>
                </Box>
              </Box>

              {/* Explanation */}
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Iconify icon="eva:info-fill" width={16} height={16} />
                  How It Works
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.grey[500], 0.05),
                    border: `1px solid ${alpha(theme.palette.grey[500], 0.15)}`,
                  }}
                >
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {state.evaluationDetails.explanation || 'Evaluation details not available'}
                  </Typography>
                </Box>
              </Box>

              {/* Scoring Breakdown for Ternary Criteria */}
              {criterion.statusType === 'ternary' && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: 'block', mb: 0.5 }}>
                      Scoring Breakdown
                    </Typography>
                    <Stack spacing={0.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Chip size="small" label="SUCCESS" sx={{ bgcolor: theme.palette.success.main, color: 'white', minWidth: 70, fontSize: '0.7rem' }} />
                        <Typography variant="caption">{criterion.weight} points - Meets optimal criteria</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Chip size="small" label="WARNING" sx={{ bgcolor: theme.palette.warning.main, color: 'white', minWidth: 70, fontSize: '0.7rem' }} />
                        <Typography variant="caption">{criterion.warningScore || Math.floor(criterion.weight * 0.75)} points - Partially meets criteria</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Chip size="small" label="ERROR" sx={{ bgcolor: theme.palette.error.main, color: 'white', minWidth: 70, fontSize: '0.7rem' }} />
                        <Typography variant="caption">0 points - Does not meet criteria</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </>
              )}
            </Stack>
          </Card>
        </Stack>
      </DialogContent>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          bgcolor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha(theme.palette.grey[50], 0.8),
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            onClick={onClose}
            variant="contained"
            size="small"
            sx={{ borderRadius: 2, px: 2.5 }}
          >
            Close
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}

export default CriterionDetailsModal;
