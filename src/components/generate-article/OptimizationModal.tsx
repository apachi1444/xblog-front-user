import type { GenerateArticleFormData } from 'src/sections/generate/schemas';

import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import {
  Box,
  Alert,
  Button,
  Dialog,
  Divider,
  useTheme,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import { EVALUATION_FUNCTIONS, IMPROVEMENT_FUNCTIONS } from 'src/utils/seo-criteria-evaluators';

import { useCriteriaEvaluation } from 'src/sections/generate/hooks/useCriteriaEvaluation';

interface OptimizationModalProps {
  open: boolean;
  onClose: () => void;
  criterionId: number | null;
}

export function OptimizationModal({ open, onClose, criterionId }: OptimizationModalProps) {
  const { t } = useTranslation();
  const form = useFormContext<GenerateArticleFormData>();
  const formValues = form.getValues();

  const [optimizedValue, setOptimizedValue] = useState<string>('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationSuccess, setOptimizationSuccess] = useState(false);
  const [fieldToUpdate, setFieldToUpdate] = useState<string>('');
  const [originalValue, setOriginalValue] = useState<string>('');
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [potentialScore, setPotentialScore] = useState<number>(0);
  const [currentStatus, setCurrentStatus] = useState<'success' | 'warning' | 'error' | 'pending'>('pending');
  const [potentialStatus, setPotentialStatus] = useState<'success' | 'warning' | 'error' | 'pending'>('pending');

  const theme = useTheme();

  const {
    getCriterionById,
    evaluateAllCriteria,
    criteriaState,
  } = useCriteriaEvaluation();

  // Get criterion details
  const criterion = criterionId ? getCriterionById(criterionId) : null;

  // Function to evaluate a criterion with a specific value
  const evaluateCriterion = useCallback((criterionIdToEvaluate: number, value: string) => {
    if (!criterionIdToEvaluate || !criterion) return { status: 'pending', score: 0, message: '' };

    // Create a copy of the form values to simulate the change
    const updatedFormValues = { ...formValues };

    // Update the field value in the copy
    if (fieldToUpdate && updatedFormValues.step1) {
      updatedFormValues.step1 = {
        ...updatedFormValues.step1,
        [fieldToUpdate as keyof typeof updatedFormValues.step1]: value
      };
    }

    // Get the evaluation function for this criterion
    const evaluationFn = EVALUATION_FUNCTIONS[criterionIdToEvaluate];

    if (evaluationFn) {
      // Apply the evaluation function with the updated form values
      return evaluationFn(null, updatedFormValues);
    }

    return { status: 'pending', score: 0, message: '' };
  }, [criterion, fieldToUpdate, formValues]);

  // Reset state when modal opens or criterion changes
  useEffect(() => {
    if (open && criterion) {
      setOptimizedValue('');
      setIsOptimizing(false);
      setOptimizationSuccess(false);

      // Determine which field to update based on criterion input keys
      if (criterion.inputKeys.length > 0) {
        // For simplicity, we'll use the first input key that's not primaryKeyword
        // In a more complex implementation, you might want to handle multiple fields
        const primaryField = criterion.inputKeys.find(key => key !== 'primaryKeyword') || criterion.inputKeys[0];
        setFieldToUpdate(primaryField);

        // Get the current value of the field - focus only on step1 fields
        let currentValue = '';

        if (formValues.step1) {
          // For simplicity, we'll only handle step1 fields
          currentValue = formValues.step1[primaryField as keyof typeof formValues.step1] as string || '';
        }

        setOriginalValue(currentValue || '');

        // Evaluate current score
        if (criterionId) {
          const result = evaluateCriterion(criterionId, currentValue);
          setCurrentScore(result.score);
          setCurrentStatus(result.status as 'success' | 'warning' | 'error' | 'pending');
        }
      }
    }
  }, [open, criterion, criterionId, formValues, evaluateCriterion]);

  // Update potential score when optimized value changes
  useEffect(() => {
    if (criterionId && optimizedValue) {
      const result = evaluateCriterion(criterionId, optimizedValue);
      setPotentialScore(result.score);
      setPotentialStatus(result.status as 'success' | 'warning' | 'error' | 'pending');
    }
  }, [criterionId, optimizedValue, evaluateCriterion]);

  // Handle optimization
  const handleOptimize = async () => {
    if (!criterionId || !criterion) return;

    setIsOptimizing(true);

    try {
      // Get the improvement function for this criterion
      const improvementFn = IMPROVEMENT_FUNCTIONS[criterionId];

      if (improvementFn) {
        // Apply the improvement function
        const improved = improvementFn(null, formValues);
        setOptimizedValue(improved);
      } else {
        // Fallback if no improvement function is found
        setOptimizedValue(originalValue);
      }

      // Simulate a delay for better UX
      setTimeout(() => {
        setIsOptimizing(false);
      }, 800);
    } catch (error) {
      console.error('Error optimizing:', error);
      setIsOptimizing(false);
    }
  };

  // Apply the optimized value to the form
  const handleApply = () => {
    if (!fieldToUpdate || !optimizedValue) return;

    // Update the form value - focus only on step1 fields
    form.setValue(`step1.${fieldToUpdate as keyof typeof formValues.step1}` as const, optimizedValue, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Re-evaluate criteria
    evaluateAllCriteria();

    // Show success message
    setOptimizationSuccess(true);

    // Close modal after a delay
    setTimeout(() => {
      onClose();
      setOptimizationSuccess(false);
    }, 1500);
  };

  if (!criterion) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <AutoFixHighIcon color="primary" />
          {t('seo.optimization.title', 'Optimize SEO Criterion')}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t(criterion.description)}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {criterion.statusType === 'binary'
              ? t(criterion.evaluationStatus.error)
              : t(criterion.evaluationStatus.warning || criterion.evaluationStatus.error)}
          </Typography>

          {/* Score information */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
            <Box>
              <Typography variant="subtitle2">
                {t('seo.optimization.current_score', 'Current Score')}:
              </Typography>
              <Typography variant="h4" color={
                currentStatus === 'success' ? 'success.main' :
                currentStatus === 'warning' ? 'warning.main' :
                'error.main'
              }>
                {currentScore}
              </Typography>
            </Box>

            {optimizedValue && (
              <Box>
                <Typography variant="subtitle2">
                  {t('seo.optimization.potential_score', 'Potential Score')}:
                </Typography>
                <Typography variant="h4" color={
                  potentialStatus === 'success' ? 'success.main' :
                  potentialStatus === 'warning' ? 'warning.main' :
                  'error.main'
                }>
                  {potentialScore}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            {t('seo.optimization.current_value', 'Current Value')}:
          </Typography>

          <TextField
            fullWidth
            multiline
            disabled
            value={originalValue}
            minRows={2}
            maxRows={4}
            sx={{ mb: 3 }}
          />

          {optimizedValue ? (
            <>
              <Typography variant="subtitle1" gutterBottom>
                {t('seo.optimization.optimized_value', 'Optimized Value')}:
              </Typography>

              <TextField
                fullWidth
                multiline
                value={optimizedValue}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setOptimizedValue(newValue);

                  // Real-time evaluation of the new value
                  if (criterionId) {
                    const result = evaluateCriterion(criterionId, newValue);
                    setPotentialScore(result.score);
                    setPotentialStatus(result.status as 'success' | 'warning' | 'error' | 'pending');
                  }
                }}
                minRows={2}
                maxRows={4}
                sx={{ mb: 2 }}
              />

              {optimizationSuccess && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {t('seo.optimization.success', 'Optimization applied successfully!')}
                </Alert>
              )}
            </>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Button
                variant="contained"
                startIcon={isOptimizing ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
                onClick={handleOptimize}
                disabled={isOptimizing}
              >
                {isOptimizing
                  ? t('seo.optimization.optimizing', 'Optimizing...')
                  : t('seo.optimization.generate', 'Generate Optimization')}
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t('common.cancel', 'Cancel')}
        </Button>

        {optimizedValue && (
          <Button
            onClick={handleApply}
            variant="contained"
            disabled={isOptimizing || optimizationSuccess}
          >
            {t('seo.optimization.apply', 'Apply Optimization')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default OptimizationModal;
