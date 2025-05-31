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
    actualValue?: string | number;
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
    const { step1 } = formData;

    switch (criterionIdToEvaluate) {
      case 202: { // keyword_density
        if (!step1.contentDescription || !step1.primaryKeyword) {
          return {
            actualValue: 'N/A',
            threshold: '1% - 3% (optimal)',
            explanation: 'Waiting for content and primary keyword to calculate density'
          };
        }

        const words = step1.contentDescription.toLowerCase().split(/\s+/).filter(word => word.length > 0);
        const keywordCount = words.filter(word => word.includes(step1.primaryKeyword.toLowerCase())).length;
        const density = (keywordCount / words.length) * 100;

        return {
          actualValue: `${density.toFixed(2)}%`,
          threshold: '1% - 3% (optimal)',
          explanation: `Found "${step1.primaryKeyword}" ${keywordCount} times in ${words.length} words`
        };
      }

      case 104: { // keyword_in_first_10
        if (!step1.contentDescription || !step1.primaryKeyword) {
          return {
            actualValue: 'N/A',
            threshold: 'First 10% of content',
            explanation: 'Waiting for content and primary keyword'
          };
        }

        const firstTenPercent = step1.contentDescription.substring(0, Math.floor(step1.contentDescription.length * 0.1));
        const found = firstTenPercent.toLowerCase().includes(step1.primaryKeyword.toLowerCase());

        return {
          actualValue: found ? 'Found' : 'Not found',
          threshold: 'First 10% of content',
          explanation: `Checking first ${Math.floor(step1.contentDescription.length * 0.1)} characters for "${step1.primaryKeyword}"`
        };
      }

      case 105: { // keyword_in_content
        if (!step1.contentDescription || !step1.primaryKeyword) {
          return {
            actualValue: 'N/A',
            threshold: 'At least once',
            explanation: 'Waiting for content and primary keyword'
          };
        }

        const found = step1.contentDescription.toLowerCase().includes(step1.primaryKeyword.toLowerCase());

        return {
          actualValue: found ? 'Found' : 'Not found',
          threshold: 'At least once',
          explanation: `Searching for "${step1.primaryKeyword}" in content`
        };
      }

      case 106: { // content_length
        if (!step1.contentDescription) {
          return {
            actualValue: '0 words',
            threshold: '1500+ words (optimal), 1000+ words (acceptable)',
            explanation: 'Waiting for content'
          };
        }

        const wordCount = step1.contentDescription.split(/\s+/).filter(word => word.length > 0).length;

        return {
          actualValue: `${wordCount} words`,
          threshold: '1500+ words (optimal), 1000+ words (acceptable)',
          explanation: `Content length affects SEO ranking potential`
        };
      }

      case 201: { // keyword_in_subheadings
        if (!step1.contentDescription || !step1.primaryKeyword) {
          return {
            actualValue: 'N/A',
            threshold: 'At least one subheading',
            explanation: 'Waiting for content and primary keyword'
          };
        }

        return {
          actualValue: 'Analysis pending',
          threshold: 'At least one subheading',
          explanation: `Looking for "${step1.primaryKeyword}" in H2, H3, H4 tags`
        };
      }

      case 401: { // table_of_contents
        if (!step1.contentDescription) {
          return {
            actualValue: 'N/A',
            threshold: 'Present in content',
            explanation: 'Waiting for content'
          };
        }

        return {
          actualValue: 'Analysis pending',
          threshold: 'Present in content',
          explanation: 'Checking for table of contents structure'
        };
      }

      case 402: { // short_paragraphs
        if (!step1.contentDescription) {
          return {
            actualValue: 'N/A',
            threshold: 'Most paragraphs under 150 words',
            explanation: 'Waiting for content'
          };
        }

        const paragraphs = step1.contentDescription.split('\n\n').filter(p => p.trim().length > 0);
        const avgWordsPerParagraph = paragraphs.reduce((acc, p) => acc + p.split(/\s+/).length, 0) / paragraphs.length;

        return {
          actualValue: `${avgWordsPerParagraph.toFixed(1)} words/paragraph`,
          threshold: 'Most paragraphs under 150 words',
          explanation: `${paragraphs.length} paragraphs analyzed`
        };
      }

      case 403: { // media_content
        if (!step1.contentDescription) {
          return {
            actualValue: 'N/A',
            threshold: 'Images or videos present',
            explanation: 'Waiting for content'
          };
        }

        return {
          actualValue: 'Analysis pending',
          threshold: 'Images or videos present',
          explanation: 'Checking for media references in content'
        };
      }

      default:
        return {
          actualValue: 'N/A',
          threshold: 'Criterion-specific',
          explanation: 'Evaluation details not available'
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
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
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
          p: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: alpha('#fff', 0.1),
          }
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: alpha('#fff', 0.2),
                backdropFilter: 'blur(10px)',
              }}
            >
              <Iconify icon="eva:info-fill" width={24} height={24} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                SEO Criterion Details
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {t(criterion.description)}
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'white',
              bgcolor: alpha('#fff', 0.1),
              '&:hover': { bgcolor: alpha('#fff', 0.2) }
            }}
          >
            <Iconify icon="eva:close-fill" width={20} height={20} />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        <Stack spacing={4}>
          {/* Header Info */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.info.main, 0.05)
                : alpha(theme.palette.info.main, 0.02),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={3}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: alpha(theme.palette.info.main, 0.1),
                }}
              >
                <Iconify icon="eva:file-text-fill" width={32} height={32} color={theme.palette.info.main} />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Content-Based Criterion
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This SEO criterion is evaluated based on your content structure and cannot be automatically optimized.
                </Typography>
              </Box>
            </Stack>
          </Card>

          {/* Current Score Overview */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.8)
                : alpha(theme.palette.grey[50], 0.8),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon="eva:trending-up-fill" width={20} height={20} />
              Current Score Analysis
            </Typography>

            <Stack spacing={3}>
              {/* Score Progress */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
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
                    }}
                  />
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={(state.currentScore / criterion.weight) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.grey[500], 0.2),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: state.currentStatus === 'success' ? theme.palette.success.main :
                               state.currentStatus === 'warning' ? theme.palette.warning.main :
                               theme.palette.error.main,
                      borderRadius: 4,
                    }
                  }}
                />
              </Box>

              {/* Status Message */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
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
              p: 3,
              borderRadius: 3,
              background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.8)
                : alpha(theme.palette.grey[50], 0.8),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon="eva:settings-2-fill" width={20} height={20} />
              Evaluation Logic
            </Typography>

            <Stack spacing={3}>
              {/* Actual Value */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Current Value
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                    {state.evaluationDetails.actualValue || 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Threshold */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Required Threshold
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {state.evaluationDetails.threshold || 'Criterion-specific'}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Explanation */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  How It s Calculated
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.grey[500], 0.05),
                    border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
                  }}
                >
                  <Typography variant="body2">
                    {state.evaluationDetails.explanation || 'Evaluation details not available'}
                  </Typography>
                </Box>
              </Box>

              {/* Scoring Breakdown for Ternary Criteria */}
              {criterion.statusType === 'ternary' && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Scoring Breakdown
                    </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip size="small" label="SUCCESS" sx={{ bgcolor: theme.palette.success.main, color: 'white', minWidth: 80 }} />
                        <Typography variant="body2">{criterion.weight} points - Meets optimal criteria</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip size="small" label="WARNING" sx={{ bgcolor: theme.palette.warning.main, color: 'white', minWidth: 80 }} />
                        <Typography variant="body2">{criterion.warningScore || Math.floor(criterion.weight * 0.75)} points - Partially meets criteria</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip size="small" label="ERROR" sx={{ bgcolor: theme.palette.error.main, color: 'white', minWidth: 80 }} />
                        <Typography variant="body2">0 points - Does not meet criteria</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </>
              )}
            </Stack>
          </Card>

          {/* Improvement Tips */}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  mt: 0.5,
                }}
              >
                <Iconify icon="eva:bulb-fill" width={20} height={20} color={theme.palette.success.main} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  💡 How to Improve This Score
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This criterion will be automatically re-evaluated when you update your content in the form.
                  Focus on adjusting your content structure, keywords, and formatting to meet the required thresholds.
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Stack>
      </DialogContent>

      {/* Footer */}
      <Box
        sx={{
          p: 3,
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
            sx={{ borderRadius: 2, px: 3 }}
          >
            Close
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}

export default CriterionDetailsModal;
