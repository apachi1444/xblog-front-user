import { useFormContext } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {
  Box,
  Chip,
  Alert,
  Paper,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  CircularProgress,
  DialogContentText,
} from '@mui/material';

interface EditItemModalProps {
  isOpen: boolean;
  score: number;
  maxScore: number;
  weight: number;
  onUpdateScore: (newScore: number) => void;
  onClose: () => void;
  fieldType: string;
  tooltip?: string;
  onOptimize: (fieldType: string, currentValue: string) => Promise<string>;
}

// Helper function to get a user-friendly name for the field
const getFieldTypeName = (type: string): string => {
  const names: Record<string, string> = {
    primaryKeyword: "Primary Keyword",
    title: "Article Title",
    metaTitle: "Meta Title",
    metaDescription: "Meta Description",
    contentDescription: "Content Description",
    urlSlug: "URL Slug",
    // Add other field mappings from your Step1FormData schema as needed
  };
  // Capitalize first letter if not found in map
  return names[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

// Define the steps for the modal flow
type ModalStep = 'initial' | 'optimizing' | 'optimized' | 'applying';

// Function to determine score color
const getScoreColor = (score: number): string => {
  if (score >= 80) return '#4caf50'; // Green for good scores
  if (score >= 60) return '#ff9800'; // Orange for medium scores
  return '#f44336'; // Red for low scores
};

export function EditItemModal({
  isOpen,
  onClose,
  fieldType,
  onOptimize,
  onUpdateScore,
  score,
  maxScore,
  weight,
  tooltip
}: EditItemModalProps) {
  const formContext = useFormContext(); // Access form methods
  const { getValues, setValue } = formContext;

  // Access the updateFieldInAllForms function if available
  // Use type assertion to access the custom property
  const updateFieldInAllForms = (formContext as any).updateFieldInAllForms;

  const [modalStep, setModalStep] = useState<ModalStep>('initial');
  const [fieldValue, setFieldValue] = useState<string>(''); // Value being edited initially
  const [originalValue, setOriginalValue] = useState<string>(''); // Store original value before optimization
  const [optimizedValue, setOptimizedValue] = useState<string | null>(null); // Store optimized result
  const [isLoading, setIsLoading] = useState(false); // Combined loading state
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [projectedScore, setProjectedScore] = useState<number | null>(null);

  const fieldTypeName = getFieldTypeName(fieldType);
  const isMultiline = fieldType === "contentDescription" || fieldType === "metaDescription";
  const scoreColor = getScoreColor(score);

  // Add a new state for tracking real-time projected score during editing
  const [editingProjectedScore, setEditingProjectedScore] = useState<number | null>(null);

  // Effect to reset state when the modal opens or fieldType changes
  useEffect(() => {
    if (isOpen) {
      // Try to get the current value from the form, checking both direct field and step1 field
      let currentFormValue = "";

      // First try to get the value from step1.fieldType
      const step1Value = getValues(`step1.${fieldType}`);

      // Then try to get the direct value
      const directValue = getValues(fieldType);

      // Use the step1 value if it exists, otherwise use the direct value
      if (step1Value !== undefined && step1Value !== "") {
        currentFormValue = step1Value;
        console.log(`Using step1.${fieldType} value:`, currentFormValue);
      } else if (directValue !== undefined && directValue !== "") {
        currentFormValue = directValue;
        console.log(`Using direct ${fieldType} value:`, currentFormValue);
      } else {
        console.log(`No existing value found for ${fieldType}, using empty string`);
      }

      console.log(`Final form value for ${fieldType}:`, currentFormValue);

      // Set both the field value and original value to the current form value
      setFieldValue(currentFormValue);
      setOriginalValue(currentFormValue); // Store the original value properly

      // Reset other state
      setOptimizedValue(null);
      setModalStep('initial');
      setError(null);
      setSuccess(null);
      setIsLoading(false);
      setProjectedScore(null);
      setEditingProjectedScore(null);
    }
  }, [isOpen, fieldType, getValues]);

  // Handler for text field changes that updates the projected score based on actual weight and maxScore
  const handleFieldValueChange = useCallback((value : string) => {
    const newValue = value;
    setFieldValue(newValue);

    if (newValue.length > 0) {
      // Calculate improvement based on content length and quality indicators
      let qualityScore = 0;

      // Basic quality checks
      if (fieldType === 'title' || fieldType === 'metaTitle') {
        // For titles, check optimal length (50-60 chars)
        const titleLength = newValue.length;
        if (titleLength >= 40 && titleLength <= 60) {
          qualityScore += 3;
        } else if (titleLength >= 30 && titleLength <= 70) {
          qualityScore += 2;
        } else {
          qualityScore += 1;
        }
      } else if (fieldType === 'metaDescription') {
        // For meta descriptions, check optimal length (150-160 chars)
        const descLength = newValue.length;
        if (descLength >= 140 && descLength <= 160) {
          qualityScore += 3;
        } else if (descLength >= 120 && descLength <= 180) {
          qualityScore += 2;
        } else {
          qualityScore += 1;
        }
      } else {
        // For other fields, base on content length
        const contentLength = newValue.length;
        qualityScore = Math.min(3, Math.floor(contentLength / 50));
      }

      // Calculate improvement as a percentage of the remaining potential
      const remainingPotential = maxScore - score;
      const improvement = Math.round(remainingPotential * (qualityScore / 5)); // 5 is max quality score

      // Ensure we don't exceed maxScore
      const newProjectedScore = Math.min(maxScore, score + improvement);
      setEditingProjectedScore(newProjectedScore);
    } else {
      setEditingProjectedScore(null);
    }
  }, [score, maxScore, fieldType]);

  const handleOptimize = useCallback(async () => {
    setIsLoading(true);
    setModalStep('optimizing');
    setError(null);
    setSuccess(null);

    // We already set originalValue in the useEffect, so we don't need to set it again here
    // This ensures we keep the original value from the form

    try {
      const result = await onOptimize(fieldType, fieldValue);
      setOptimizedValue(result);
      setModalStep('optimized');

      // Calculate the projected score based on the actual weight and maxScore
      // If the current score is less than maxScore, we can improve it
      let scoreImprovement = 0;

      if (score < maxScore) {
        // Calculate how much this item can improve based on its weight
        // The improvement is proportional to how much of the maxScore is still available
        const percentImprovement = 0.8; // Assume we can improve by 80% of the remaining potential
        const remainingPotential = maxScore - score;
        scoreImprovement = Math.round(remainingPotential * percentImprovement);
      }

      const newProjectedScore = Math.min(maxScore, score + scoreImprovement);
      setProjectedScore(newProjectedScore);

      // We don't automatically update the form value here anymore
      // Instead, we wait for the user to click "Apply Optimization"
      // This gives them a chance to review the changes before applying

      setSuccess(`${fieldTypeName} optimized successfully. Review and apply.`);
    } catch (err: any) {
      setError(err.message || `Failed to optimize ${fieldTypeName}. Please try again.`);
      setModalStep('initial');
      // Don't reset the original value on error
    } finally {
      setIsLoading(false);
    }
  }, [fieldType, fieldValue, onOptimize, fieldTypeName, score, maxScore]);

  const handleApplyOptimization = useCallback(async () => {
    if (optimizedValue === null) return;

    setIsLoading(true);
    setModalStep('applying');
    setError(null);
    setSuccess(null);

    try {
      // Update the form value with the optimized value
      if (updateFieldInAllForms) {
        // If we have the synchronization function, use it to update all forms
        console.log(`Using updateFieldInAllForms to apply ${fieldType} in all forms`);
        updateFieldInAllForms(`step1.${fieldType}`, optimizedValue);
      } else {
        // Fallback to regular setValue if synchronization function is not available
        console.log(`Using regular setValue to apply ${fieldType}`);
        setValue(fieldType, optimizedValue, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      }

      // Log the updated form value
      console.log(`Updated form value for ${fieldType}:`, getValues(fieldType));

      // Update the score if available
      if (projectedScore !== null) {
        onUpdateScore(projectedScore);
      }

      // Show success message
      setSuccess(`${fieldTypeName} updated successfully!`);

      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err: any) {
      setError(err.message || `Failed to apply changes for ${fieldTypeName}.`);
      setModalStep('optimized');
      setIsLoading(false);
    }
  }, [fieldType, optimizedValue, setValue, getValues, onClose, fieldTypeName, projectedScore, onUpdateScore, updateFieldInAllForms]);


  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const renderActions = () => {
    switch (modalStep) {
      case 'initial':
        return (
          <>
            <Button onClick={handleClose} disabled={isLoading} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleOptimize}
              disabled={isLoading || !fieldValue} // Disable if no content or loading
              variant="contained"
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
            >
              {isLoading ? 'Optimizing...' : 'Optimize'}
            </Button>
          </>
        );
      case 'optimizing':
        return (
          <>
            <Button onClick={handleClose} disabled variant="outlined">
              Cancel
            </Button>
            <Button disabled variant="contained" startIcon={<CircularProgress size={20} color="inherit" />}>
              Optimizing...
            </Button>
          </>
        );
      case 'optimized':
        return (
          <>
            <Button onClick={handleClose} disabled={isLoading} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleApplyOptimization}
              disabled={isLoading}
              variant="contained"
              color="success" // Use success color for apply
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleOutlineIcon />}
            >
              {isLoading ? 'Applying...' : 'Apply Optimization'}
            </Button>
          </>
        );
      case 'applying':
        return (
          <>
            <Button onClick={handleClose} disabled variant="outlined">
              Cancel
            </Button>
            <Button disabled variant="contained" startIcon={<CircularProgress size={20} color="inherit" />}>
              Applying...
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  // Score display component
  const renderScoreSection = () => {
    const currentScoreDisplay = (
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
        <Typography variant="body2" sx={{ mr: 1, fontWeight: 'medium' }}>
          Current Score:
        </Typography>
        <Chip
          icon={<SignalCellularAltIcon />}
          label={`${score}/${maxScore}`}
          size="small"
          sx={{
            bgcolor: `${scoreColor}15`, // Light background of score color
            color: scoreColor,
            fontWeight: 'bold',
          }}
        />
      </Box>
    );

    // Determine which projected score to show based on the modal step
    const showProjectedScore = modalStep === 'optimized' ? projectedScore : editingProjectedScore;

    const projectedScoreDisplay = showProjectedScore && (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mr: 1, fontWeight: 'medium' }}>
          Projected Score:
        </Typography>
        <Chip
          icon={<SignalCellularAltIcon />}
          label={`${showProjectedScore}/${maxScore}`}
          size="small"
          sx={{
            bgcolor: `${getScoreColor(showProjectedScore)}15`,
            color: getScoreColor(showProjectedScore),
            fontWeight: 'bold',
          }}
        />
      </Box>
    );

    // Get optimization tips based on field type
    const getOptimizationTips = () => {
      const commonTips = {
        title: [
          "Include your primary keyword near the beginning",
          "Keep it between 50-60 characters",
          "Make it compelling and descriptive",
          "Avoid using all caps or excessive punctuation"
        ],
        metaTitle: [
          "Include your primary keyword",
          "Keep it under 60 characters to avoid truncation in search results",
          "Make it unique from your page title",
          "Include your brand name at the end if possible"
        ],
        metaDescription: [
          "Include your primary keyword naturally",
          "Keep it between 150-160 characters",
          "Include a call-to-action",
          "Make it compelling to increase click-through rates"
        ],
        urlSlug: [
          "Include your primary keyword",
          "Use hyphens to separate words",
          "Keep it short and descriptive",
          "Avoid numbers and special characters"
        ],
        primaryKeyword: [
          "Choose a keyword with good search volume",
          "Ensure it's relevant to your content",
          "Consider long-tail keywords for less competition",
          "Avoid keyword stuffing in your content"
        ],
        secondaryKeywords: [
          "Choose keywords related to your primary keyword",
          "Include semantic variations",
          "Use keywords that support your main topic",
          "Distribute them naturally throughout your content"
        ],
        contentDescription: [
          "Include your primary keyword naturally",
          "Make it comprehensive and informative",
          "Structure with proper headings (H2, H3)",
          "Include relevant examples and data points"
        ],
        content: [
          "Include your primary keyword in the first paragraph",
          "Use secondary keywords throughout",
          "Structure with proper headings and subheadings",
          "Include internal and external links where relevant"
        ]
      };

      // Return tips for the current field type or general tips if not found
      return commonTips[fieldType as keyof typeof commonTips] || [
        "Make your content comprehensive and valuable",
        "Include relevant keywords naturally",
        "Structure your content logically",
        "Ensure proper formatting and readability"
      ];
    };

    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {fieldTypeName} Optimization
            </Typography>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}>
              {currentScoreDisplay}
              {showProjectedScore && projectedScoreDisplay}

              {showProjectedScore && (
                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                    +{showProjectedScore - score} points
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Optimization Tips Section */}
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
              <AutoFixHighIcon sx={{ fontSize: 18, mr: 0.5, color: 'primary.main' }} />
              Optimization Tips
            </Typography>

            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {getOptimizationTips().map((tip, index) => (
                <Typography
                  key={index}
                  component="li"
                  variant="body2"
                  sx={{
                    mb: 0.5,
                    color: 'text.secondary',
                    '&::marker': {
                      color: 'primary.main'
                    }
                  }}
                >
                  {tip}
                </Typography>
              ))}
            </Box>

            {/* Custom tooltip if provided */}
            {tooltip && (
              <Alert severity="info" sx={{ mt: 2, fontSize: '0.875rem' }}>
                {tooltip}
              </Alert>
            )}
          </Box>
        </Box>
      </Paper>
    );
  };


  // --- Main Render ---
  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Optimize {fieldTypeName}
      </DialogTitle>
      <DialogContent>
        {renderScoreSection()}

        <DialogContentText sx={{ mb: 2 }}>
          {modalStep === 'initial' && `Review or edit your ${fieldTypeName.toLowerCase()} below, then click Optimize.`}
          {modalStep === 'optimizing' && `Optimizing ${fieldTypeName.toLowerCase()}...`}
          {modalStep === 'optimized' && `Review the original and optimized ${fieldTypeName.toLowerCase()} below. Click Apply Optimization to save the optimized version.`}
          {modalStep === 'applying' && `Applying changes for ${fieldTypeName.toLowerCase()}...`}
        </DialogContentText>

        {modalStep === 'optimizing' && (
          <Box sx={{ width: '100%', mt: 1, mb: 3 }}>
            <LinearProgress />
          </Box>
        )}

        {/* --- Text Field Rendering Logic --- */}
        {modalStep === 'initial' && (
          <TextField
            autoFocus
            margin="dense"
            label={fieldTypeName} // Simple label in initial step
            type="text"
            fullWidth
            variant="outlined"
            multiline={isMultiline}
            rows={isMultiline ? 4 : 1}
            value={fieldValue}
            onChange={(e) => {
              handleFieldValueChange(e.target.value)
            }}
            disabled={isLoading}
          />
        )}

        {modalStep === 'optimized' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* Original Value Display */}
            <TextField
              margin="dense"
              label={`Original ${fieldTypeName}`} // Label indicating original
              type="text"
              fullWidth
              variant="outlined"
              multiline={isMultiline}
              rows={isMultiline ? 4 : 1}
              value={originalValue} // Show original value
              InputProps={{
                readOnly: true, // Make read-only
              }}
            />
            {/* Optimized Value Display */}
            <TextField
              margin="dense"
              label={`Optimized ${fieldTypeName}`} // Label indicating optimized
              type="text"
              fullWidth
              variant="outlined"
              multiline={isMultiline}
              rows={isMultiline ? 4 : 1}
              value={optimizedValue ?? ''} // Show optimized value
              InputProps={{
                readOnly: true, // Make read-only
              }}
            />
          </Box>
        )}

        {/* Keep a hidden or minimal text field during applying/optimizing if needed, or remove */}
        {(modalStep === 'applying') && (
             <TextField
                margin="dense"
                label={fieldTypeName}
                type="text"
                fullWidth
                variant="outlined"
                multiline={isMultiline}
                rows={isMultiline ? 4 : 1}
                value={optimizedValue ?? ''} // Show the value being applied
                InputProps={{ readOnly: true }}
                disabled // Disable fully
             />
        )}
        {/* --- End Text Field Rendering Logic --- */}


        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Show success message during optimized and applying steps */}
        {success && (modalStep === 'optimized' || modalStep === 'applying') && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        {renderActions()}
      </DialogActions>
    </Dialog>
  );
}