import type { GenerateArticleFormData } from 'src/sections/generate/schemas';

import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Card,
  Chip,
  Fade,
  Zoom,
  Stack,
  Alert,
  alpha,
  Button,
  Dialog,
  useTheme,
  TextField,
  Typography,
  IconButton,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { EVALUATION_FUNCTIONS, IMPROVEMENT_FUNCTIONS } from 'src/utils/seo-criteria-evaluators';

import { useGetSubscriptionDetailsQuery } from 'src/services/apis/subscriptionApi';

import { Iconify } from 'src/components/iconify';

import { useCriteriaEvaluation } from 'src/sections/generate/hooks/useCriteriaEvaluation';

interface OptimizationModalProps {
  open: boolean;
  onClose: () => void;
  criterionId: number | null;
  fieldPath: string; // e.g., "step1.contentDescription", "step2.toneOfVoice"
  currentValue: string; // Current value of the field
}

export function OptimizationModal({ open, onClose, criterionId, fieldPath, currentValue }: OptimizationModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const form = useFormContext<GenerateArticleFormData>();

  // Get subscription details
  const { data: subscriptionDetails } = useGetSubscriptionDetailsQuery();
  const isPremiumUser = subscriptionDetails?.subscription_name &&
    !subscriptionDetails.subscription_name.toLowerCase().includes('free');

  // Simplified state - no need to track field info since it's passed as props
  const [state, setState] = useState({
    // Content values
    currentValue: '',
    optimizedValue: '',

    // UI states
    isOptimizing: false,
    isApplying: false,
    optimizationSuccess: false,
    showScoreAnimation: false,
    showSuccessAnimation: false,
    aiProgress: 0,
    hasChanges: false,

    // Scores
    currentScore: 0,
    potentialScore: 0,
    currentStatus: 'pending' as 'success' | 'warning' | 'error' | 'pending',
    potentialStatus: 'pending' as 'success' | 'warning' | 'error' | 'pending',
  });

  const { getCriterionById, evaluateAllCriteria } = useCriteriaEvaluation();
  const criterion = criterionId ? getCriterionById(criterionId) : null;

  // Update state helper
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Simple evaluation function - uses fieldPath prop directly
  const evaluateCriterion = useCallback((criterionIdToEvaluate: number, value: string) => {
    if (!criterionIdToEvaluate || !criterion || !fieldPath) {
      return { status: 'pending', score: 0, message: '' };
    }

    try {
      const formValues = form.getValues();
      console.log('Original form values:', formValues);

      // Create a deep copy of form values to simulate the change (NOT updating actual form)
      const simulatedFormValues = JSON.parse(JSON.stringify(formValues));

      // Parse the fieldPath (e.g., "step1.contentDescription")
      const [stepName, fieldName] = fieldPath.split('.');

      // Ensure the step exists
      if (!simulatedFormValues[stepName]) {
        simulatedFormValues[stepName] = {};
      }

      // Update the specific field
      simulatedFormValues[stepName][fieldName] = value;
      console.log(`Updated field "${fieldPath}" to:`, value);
      console.log('Simulated form values for evaluation:', simulatedFormValues);

      const evaluationFn = EVALUATION_FUNCTIONS[criterionIdToEvaluate];
      if (evaluationFn) {
        const result = evaluationFn(null, simulatedFormValues);
        console.log('Evaluation function result:', result);
        return result;
      }

      console.log('No evaluation function found for criterion:', criterionIdToEvaluate);
      return { status: 'pending', score: 0, message: '' };
    } catch (error) {
      console.error('Evaluation error:', error);
      return { status: 'error', score: 0, message: 'Evaluation error' };
    }
  }, [criterion, fieldPath, form]);

  // Initialize modal when opened - much simpler now!
  useEffect(() => {
    if (open && criterion) {
      // Evaluate initial score using the passed currentValue
      const result = criterionId ? evaluateCriterion(criterionId, currentValue) : { score: 0, status: 'pending' };

      setState({
        currentValue,
        optimizedValue: '',
        isOptimizing: false,
        isApplying: false,
        optimizationSuccess: false,
        showScoreAnimation: false,
        showSuccessAnimation: false,
        aiProgress: 0,
        hasChanges: false,
        currentScore: result.score,
        potentialScore: 0,
        currentStatus: result.status as any,
        potentialStatus: 'pending',
      });
    }
  }, [open, criterion, criterionId, currentValue, evaluateCriterion]);

  // Real-time evaluation for current value changes (affects potential score)
  useEffect(() => {
    if (criterionId && fieldPath && state.currentValue !== undefined) {
      console.log('Evaluating current value for potential score:', state.currentValue);
      const result = evaluateCriterion(criterionId, state.currentValue);
      console.log('Current value evaluation result:', result);

      updateState({
        potentialScore: result.score,
        potentialStatus: result.status as any,
        hasChanges: state.currentValue !== currentValue, // Compare with original passed value
      });
    }
  }, [criterionId, state.currentValue, currentValue, fieldPath, evaluateCriterion, updateState]);

  // Real-time evaluation for optimized value (also affects potential score)
  useEffect(() => {
    if (criterionId && fieldPath && state.optimizedValue) {
      console.log('Evaluating optimized value for potential score:', state.optimizedValue);
      const result = evaluateCriterion(criterionId, state.optimizedValue);
      console.log('Optimized value evaluation result:', result);

      updateState({
        potentialScore: result.score,
        potentialStatus: result.status as any,
      });
    }
  }, [criterionId, state.optimizedValue, fieldPath, evaluateCriterion, updateState]);

  // Handle AI optimization
  const handleOptimize = async () => {
    if (!criterionId || !criterion || state.isOptimizing) return;

    if (!isPremiumUser) {
      updateState({ optimizedValue: state.currentValue });
      return;
    }

    updateState({ isOptimizing: true, aiProgress: 0 });

    try {
      // Progress animation
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          aiProgress: prev.aiProgress >= 90 ? 90 : prev.aiProgress + Math.random() * 15
        }));
      }, 200);

      // AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const improvementFn = IMPROVEMENT_FUNCTIONS[criterionId];
      const improved = improvementFn ? improvementFn(null, form.getValues()) : state.currentValue;

      // Immediately evaluate the optimized value to get potential score
      const optimizedResult = evaluateCriterion(criterionId, improved);
      console.log('AI optimization result evaluation:', optimizedResult);

      clearInterval(progressInterval);

      updateState({
        optimizedValue: improved,
        potentialScore: optimizedResult.score,
        potentialStatus: optimizedResult.status as any,
        aiProgress: 100,
        showScoreAnimation: true,
      });

      setTimeout(() => updateState({
        isOptimizing: false,
        aiProgress: 0,
        showScoreAnimation: false
      }), 500);

    } catch (error) {
      console.error('Optimization error:', error);
      updateState({ isOptimizing: false, aiProgress: 0 });
    }
  };

  // Handle apply changes - super simple now!
  const handleApply = () => {
    if (!fieldPath || state.isApplying) return;

    const valueToApply = state.optimizedValue || state.currentValue;
    if (!valueToApply) return;

    updateState({ isApplying: true, showSuccessAnimation: true, optimizationSuccess: true });

    try {
      console.log(`Updating form field at path: ${fieldPath}`);

      // Update form using the passed fieldPath
      form.setValue(fieldPath as any, valueToApply, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Re-evaluate criteria
      setTimeout(() => evaluateAllCriteria(), 100);

      onClose()

    } catch (error) {
      updateState({ isApplying: false, optimizationSuccess: false, showSuccessAnimation: false });
    }
  };

  if (!criterion) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
            : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
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
              <Iconify icon="eva:flash-fill" width={24} height={24} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                Optimize SEO Criterion
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
        {/* Score Analysis */}
        <Card
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.8)
              : alpha(theme.palette.grey[50], 0.8),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="eva:trending-up-fill" width={20} height={20} />
            Score Analysis
          </Typography>

          <Stack direction="row" spacing={4} justifyContent="center">
            {/* Current Score */}
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: `conic-gradient(${
                    state.currentStatus === 'success' ? theme.palette.success.main :
                    state.currentStatus === 'warning' ? theme.palette.warning.main :
                    theme.palette.error.main
                  } ${state.currentScore * 3.6}deg, ${alpha(theme.palette.grey[300], 0.3)} 0deg)`,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 6,
                    borderRadius: '50%',
                    background: theme.palette.background.paper,
                  }
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    position: 'relative',
                    fontWeight: 700,
                    color: state.currentStatus === 'success' ? theme.palette.success.main :
                           state.currentStatus === 'warning' ? theme.palette.warning.main :
                           theme.palette.error.main,
                  }}
                >
                  {state.currentScore}
                </Typography>
              </Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                Current Score
              </Typography>
            </Box>

            {/* Arrow - Show when there are changes or optimized value */}
            {(state.optimizedValue || state.hasChanges) && (
              <Fade in={!!(state.optimizedValue || state.hasChanges)}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify
                    icon="eva:arrow-right-fill"
                    width={32}
                    height={32}
                    sx={{ color: theme.palette.primary.main }}
                  />
                </Box>
              </Fade>
            )}

            {/* Potential Score - Show when there are changes or optimized value */}
            {(state.optimizedValue || state.hasChanges) && (
              <Zoom in={!!(state.optimizedValue || state.hasChanges)} style={{ transitionDelay: '200ms' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: `conic-gradient(${
                        state.potentialStatus === 'success' ? theme.palette.success.main :
                        state.potentialStatus === 'warning' ? theme.palette.warning.main :
                        theme.palette.error.main
                      } ${state.potentialScore * 3.6}deg, ${alpha(theme.palette.grey[300], 0.3)} 0deg)`,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 6,
                        borderRadius: '50%',
                        background: theme.palette.background.paper,
                      },
                      transform: state.showScoreAnimation ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        position: 'relative',
                        fontWeight: 700,
                        color: state.potentialStatus === 'success' ? theme.palette.success.main :
                               state.potentialStatus === 'warning' ? theme.palette.warning.main :
                               theme.palette.error.main,
                      }}
                    >
                      {state.potentialScore}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                    {state.optimizedValue ? 'AI Optimized Score' : 'Updated Score'}
                  </Typography>
                  {state.potentialScore > state.currentScore && (
                    <Chip
                      label={`+${state.potentialScore - state.currentScore} improvement`}
                      size="small"
                      color="success"
                      sx={{ mt: 1, fontWeight: 600 }}
                    />
                  )}
                  {state.potentialScore < state.currentScore && (
                    <Chip
                      label={`${state.potentialScore - state.currentScore} change`}
                      size="small"
                      color="warning"
                      sx={{ mt: 1, fontWeight: 600 }}
                    />
                  )}
                </Box>
              </Zoom>
            )}
          </Stack>
        </Card>

        {/* Content Sections */}
        <Stack spacing={3}>
          {/* Current Value */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon="eva:edit-outline" width={20} height={20} />
              Current Value
              {state.hasChanges && (
                <Chip
                  label="Modified"
                  size="small"
                  color="primary"
                  sx={{ ml: 1, fontWeight: 600 }}
                />
              )}
            </Typography>
            <TextField
              fullWidth
              multiline
              value={state.currentValue}
              onChange={(e) => updateState({ currentValue: e.target.value })}
              disabled={state.isOptimizing || state.isApplying || state.optimizedValue.length > 0}
              minRows={3}
              maxRows={6}
              placeholder="Enter your content here..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            {state.hasChanges && (
              <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                ✓ Changes detected - score updated in real-time
              </Typography>
            )}
          </Box>

          {/* Optimized Value or Generate Section */}
          {state.optimizedValue ? (
            <Fade in={!!state.optimizedValue}>
              <Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="eva:edit-2-outline" width={20} height={20} />
                    Optimized Value
                  </Typography>
                  {isPremiumUser && (
                    <Chip
                      icon={<Iconify icon="eva:star-fill" width={16} height={16} />}
                      label="AI Optimized"
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Stack>
                <TextField
                  fullWidth
                  multiline
                  value={state.optimizedValue}
                  onChange={(e) => updateState({ optimizedValue: e.target.value })}
                  disabled
                  minRows={3}
                  maxRows={6}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
            </Fade>
          ) : (
            <Card
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
                background: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.primary.main, 0.05)
                  : alpha(theme.palette.primary.main, 0.02),
                border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              {!isPremiumUser ? (
                <Stack spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '50%',
                      background: alpha(theme.palette.warning.main, 0.1),
                    }}
                  >
                    <Iconify icon="eva:lock-outline" width={32} height={32} color={theme.palette.warning.main} />
                  </Box>
                  <Typography variant="h6" color="text.primary">
                    AI Optimization Available with Premium
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
                    Upgrade to a premium plan to unlock AI-powered content optimization.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => updateState({ optimizedValue: state.currentValue })}
                    sx={{ borderRadius: 2 }}
                  >
                    Edit Manually Instead
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={2} alignItems="center">
                  {state.isOptimizing ? (
                    <>
                      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                          variant="determinate"
                          value={state.aiProgress}
                          size={60}
                          thickness={4}
                          sx={{ color: theme.palette.primary.main }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="caption" component="div" color="text.secondary">
                            {Math.round(state.aiProgress)}%
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h6" color="primary">
                        AI is optimizing your content...
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Analyzing and improving your content for better SEO performance.
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '50%',
                          background: alpha(theme.palette.primary.main, 0.1),
                        }}
                      >
                        <Iconify icon="eva:flash-fill" width={32} height={32} color={theme.palette.primary.main} />
                      </Box>
                      <Typography variant="h6" color="text.primary">
                        Ready to Optimize with AI
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
                        Let our AI analyze and optimize your content to improve SEO performance.
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleOptimize}
                        disabled={state.isOptimizing}
                        startIcon={<Iconify icon="eva:flash-fill" width={20} height={20} />}
                        sx={{ borderRadius: 2, px: 4 }}
                      >
                        Generate AI Optimization
                      </Button>
                    </>
                  )}
                </Stack>
              )}
            </Card>
          )}

          {/* Success Animation */}
          {state.showSuccessAnimation && (
            <Fade in={state.showSuccessAnimation}>
              <Alert
                severity="success"
                sx={{
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem',
                  }
                }}
                icon={<Iconify icon="eva:checkmark-circle-2-fill" width={24} height={24} />}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Optimization Applied Successfully!
                </Typography>
                <Typography variant="body2">
                  Your content has been updated and SEO scores have been recalculated.
                </Typography>
              </Alert>
            </Fade>
          )}
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
            variant="outlined"
            disabled={state.isApplying}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>

          {(state.hasChanges || state.optimizedValue) && (
            <Button
              onClick={handleApply}
              variant="contained"
              disabled={state.isOptimizing || state.isApplying}
              startIcon={
                state.isApplying ? (
                  <CircularProgress size={16} color="inherit" />
                ) : state.optimizationSuccess ? (
                  <Iconify icon="eva:checkmark-fill" width={20} height={20} />
                ) : state.optimizedValue ? (
                  <Iconify icon="eva:flash-outline" width={20} height={20} />
                ) : (
                  <Iconify icon="eva:save-outline" width={20} height={20} />
                )
              }
              sx={{ borderRadius: 2, px: 3 }}
            >
              {state.optimizationSuccess ? 'Applied!' :
               state.optimizedValue ? 'Apply Optimization' :
               'Save Changes'}
            </Button>
          )}
        </Stack>
      </Box>
    </Dialog>
  );
}

export default OptimizationModal;
