/* eslint-disable no-plusplus */
import type { AffectedCriterion } from 'src/sections/generate/hooks/seoScoring/types';

import { useFormContext } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { getFormFieldsForScoringItem } from 'src/utils/seoInputMapping';

import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
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

import { AffectedCriteriaList } from './AffectedCriteriaList';

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
  initialValue: string;
  simulateFieldChange?: (fieldName: string, newValue: any) => AffectedCriterion[];
  selectedItem?: {
    id: number;
    text: string;
    status: string;
    action?: string | null;
    score?: number;
    maxScore?: number;
    points?: number;
    maxPoints?: number;
    tooltip?: string;
  };
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
    internalLinks: "Internal Links",
    externalLinks: "External Links",
    secondaryKeywords: "Secondary Keywords",
    language: "Language and Target Country",
    content: "Article Content"
  };
  return names[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

// Define the steps for the modal flow
type ModalStep = 'initial' | 'optimizing' | 'optimized' | 'applying' | 'comparing';

// Function to determine score color
const getScoreColor = (score: number): string => {
  if (score >= 80) return '#4caf50'; // Green for good scores
  if (score >= 60) return '#ff9800'; // Orange for medium scores
  return '#f44336'; // Red for low scores
};

// Function to find and highlight differences between two strings
const highlightDifferences = (original: string, optimized: string): {
  originalHighlighted: React.ReactNode,
  optimizedHighlighted: React.ReactNode
} => {
  // If either string is empty, return them as is
  if (!original || !optimized) {
    return {
      originalHighlighted: original,
      optimizedHighlighted: optimized
    };
  }

  // Split the strings into words
  const originalWords = original.split(/(\s+)/);
  const optimizedWords = optimized.split(/(\s+)/);

  // Create arrays to hold the highlighted words
  const originalHighlighted: React.ReactNode[] = [];
  const optimizedHighlighted: React.ReactNode[] = [];

  // Find the longest common subsequence
  const lcs = longestCommonSubsequence(originalWords, optimizedWords);

  // Highlight the differences
  let originalIndex = 0;
  let optimizedIndex = 0;
  let lcsIndex = 0;

  while (originalIndex < originalWords.length || optimizedIndex < optimizedWords.length) {
    // If we've reached the end of the LCS, highlight the remaining words
    if (lcsIndex >= lcs.length) {
      while (originalIndex < originalWords.length) {
        originalHighlighted.push(
          <span key={`orig-${originalIndex}`} style={{ backgroundColor: 'rgba(244, 67, 54, 0.1)', textDecoration: 'line-through' }}>
            {originalWords[originalIndex]}
          </span>
        );
        originalIndex++;
      }
      while (optimizedIndex < optimizedWords.length) {
        optimizedHighlighted.push(
          <span key={`opt-${optimizedIndex}`} style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
            {optimizedWords[optimizedIndex]}
          </span>
        );
        optimizedIndex++;
      }
      break;
    }

    // If the current words match the LCS, add them without highlighting
    if (originalIndex < originalWords.length && originalWords[originalIndex] === lcs[lcsIndex]) {
      originalHighlighted.push(originalWords[originalIndex]);
      originalIndex++;
      lcsIndex++;
    } else {
      // Highlight the removed word
      originalHighlighted.push(
        <span key={`orig-${originalIndex}`} style={{ backgroundColor: 'rgba(244, 67, 54, 0.1)', textDecoration: 'line-through' }}>
          {originalWords[originalIndex]}
        </span>
      );
      originalIndex++;
    }

    // If the current words match the LCS, add them without highlighting
    if (optimizedIndex < optimizedWords.length && optimizedWords[optimizedIndex] === lcs[lcsIndex - 1]) {
      optimizedHighlighted.push(optimizedWords[optimizedIndex]);
      optimizedIndex++;
    } else {
      // Highlight the added word
      optimizedHighlighted.push(
        <span key={`opt-${optimizedIndex}`} style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
          {optimizedWords[optimizedIndex]}
        </span>
      );
      optimizedIndex++;
    }
  }

  return {
    originalHighlighted: <>{originalHighlighted}</>,
    optimizedHighlighted: <>{optimizedHighlighted}</>
  };
};

// Function to find the longest common subsequence of two arrays
const longestCommonSubsequence = <T,>(a: T[], b: T[]): T[] => {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

  // Fill the dp table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Reconstruct the LCS
  const lcs: T[] = [];
  let i = m; let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      lcs.unshift(a[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return lcs;
};

export function EditItemModal({
  isOpen,
  onClose,
  fieldType,
  initialValue,
  onOptimize,
  onUpdateScore,
  score,
  maxScore,
  weight: _weight, // Prefix with underscore to indicate it's not used
  tooltip,
  simulateFieldChange,
  selectedItem
}: EditItemModalProps) {
  const formContext = useFormContext(); // Access form methods
  const { getValues, setValue } = formContext;

  // Access the updateFieldInAllForms function if available
  // Use type assertion to access the custom property
  const {updateFieldInAllForms} = (formContext as any);

  const [modalStep, setModalStep] = useState<ModalStep>('initial');
  const [fieldValue, setFieldValue] = useState<string>(''); // Value being edited initially
  const [originalValue, setOriginalValue] = useState<string>(''); // Store original value before optimization
  const [optimizedValue, setOptimizedValue] = useState<string | null>(null); // Store optimized result
  const [isLoading, setIsLoading] = useState(false); // Combined loading state
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [projectedScore, setProjectedScore] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [affectedCriteria, setAffectedCriteria] = useState<AffectedCriterion[]>([]);

  const fieldTypeName = getFieldTypeName(fieldType);
  const isMultiline = fieldType === "contentDescription" || fieldType === "metaDescription";
  const scoreColor = getScoreColor(score);

  // Get related fields that might also affect this scoring item
  const getRelatedFields = useCallback((itemId: number, primaryField: string): string[] => {
    // Get all fields that affect this scoring item
    const allFields = getFormFieldsForScoringItem(itemId);
    // Filter out the primary field
    return allFields.filter(field => field !== primaryField);
  }, []);

  // Add a new state for tracking real-time projected score during editing
  const [editingProjectedScore, setEditingProjectedScore] = useState<number | null>(null);

  // Memoize the highlighted differences to avoid recalculating on every render
  const highlightedDifferences = useMemo(() => {
    if (showDiff && originalValue && optimizedValue) {
      return highlightDifferences(originalValue, optimizedValue as string);
    }
    return null;
  }, [showDiff, originalValue, optimizedValue]);

  // Effect to reset state when the modal opens or fieldType changes
  useEffect(() => {
    if (isOpen) {
      // Try to get the value from the form context first
      let valueFromForm = '';

      try {
        // Try different paths to find the field value
        const directValue = getValues(fieldType);
        const step1Value = getValues(`step1.${fieldType}`);
        const step2Value = getValues(`step2.${fieldType}`);
        const step3Value = getValues(`step3.${fieldType}`);

        // Use the first non-empty value found
        valueFromForm = directValue || step1Value || step2Value || step3Value || '';
      } catch (_) { /* empty */ }

      // Use the form value if available, otherwise fall back to initialValue
      const valueToUse = valueFromForm || initialValue || '';

      // Set both the field value and original value
      setFieldValue(valueToUse);
      setOriginalValue(valueToUse); // Store the original value properly

      // Reset other state
      setOptimizedValue(null);
      setModalStep('initial');
      setError(null);
      setSuccess(null);
      setIsLoading(false);
      setProjectedScore(null);
      setEditingProjectedScore(null);

      // Force a re-render after a short delay to ensure the value is displayed
      setTimeout(() => {
        setFieldValue(prev => prev || valueToUse); // Ensure we still have the value
      }, 100);
    }
  }, [isOpen, fieldType, initialValue, getValues]);

  // Handler for text field changes that updates the projected score based on actual weight and maxScore
  const handleFieldValueChange = useCallback((value : string) => {
    // Use functional update to avoid closure issues
    setFieldValue(value);

    if (value.length > 0) {
      // Calculate improvement based on content length and quality indicators
      let qualityScore = 0;

      // Basic quality checks
      if (fieldType === 'title' || fieldType === 'metaTitle') {
        // For titles, check optimal length (50-60 chars)
        const titleLength = value.length;
        if (titleLength >= 40 && titleLength <= 60) {
          qualityScore += 3;
        } else if (titleLength >= 30 && titleLength <= 70) {
          qualityScore += 2;
        } else {
          qualityScore += 1;
        }
      } else if (fieldType === 'metaDescription') {
        // For meta descriptions, check optimal length (150-160 chars)
        const descLength = value.length;
        if (descLength >= 140 && descLength <= 160) {
          qualityScore += 3;
        } else if (descLength >= 120 && descLength <= 180) {
          qualityScore += 2;
        } else {
          qualityScore += 1;
        }
      } else {
        // For other fields, base on content length
        const contentLength = value.length;
        qualityScore = Math.min(3, Math.floor(contentLength / 50));
      }

      // Calculate improvement as a percentage of the remaining potential
      const remainingPotential = maxScore - score;
      const improvement = Math.round(remainingPotential * (qualityScore / 5)); // 5 is max quality score

      // Ensure we don't exceed maxScore
      const newProjectedScore = Math.min(maxScore, score + improvement);

      // Use functional update to avoid closure issues
      setEditingProjectedScore(newProjectedScore);

      // Simulate how this change would affect other criteria
      if (simulateFieldChange) {
        const affected = simulateFieldChange(fieldType, value);
        setAffectedCriteria(affected);
      }
    } else {
      setEditingProjectedScore(null);
      setAffectedCriteria([]);
    }
  }, [score, maxScore, fieldType, simulateFieldChange]);

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
      try {
        console.log(`Applying optimized value for ${fieldType}:`, optimizedValue);

        // Method 1: Use updateFieldInAllForms if available
        if (updateFieldInAllForms) {
          console.log(`Using updateFieldInAllForms for ${fieldType}`);
          // Update in all forms (this will handle the correct step)
          updateFieldInAllForms(fieldType, optimizedValue);
        }

        // Try to update in all possible locations to ensure the value is updated
        const updateOptions = {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        };

        // Method 2: Update using direct field name
        try {
          setValue(fieldType, optimizedValue, updateOptions);
          console.log(`Updated direct field: ${fieldType}`);
        } catch (err) {
          console.warn(`Failed to update direct field: ${fieldType}`, err);
        }

        // Method 3: Try to update in step1
        try {
          setValue(`step1.${fieldType}`, optimizedValue, updateOptions);
          console.log(`Updated step1.${fieldType}`);
        } catch (err) {
          console.warn(`Failed to update step1.${fieldType}`, err);
        }

        // Method 4: Try to update in step2
        try {
          setValue(`step2.${fieldType}`, optimizedValue, updateOptions);
          console.log(`Updated step2.${fieldType}`);
        } catch (err) {
          console.warn(`Failed to update step2.${fieldType}`, err);
        }

        // Method 5: Try to update in step3
        try {
          setValue(`step3.${fieldType}`, optimizedValue, updateOptions);
          console.log(`Updated step3.${fieldType}`);
        } catch (err) {
          console.warn(`Failed to update step3.${fieldType}`, err);
        }
      } catch (err) {
        console.error(`Error updating form values:`, err);
        // Continue execution even if some methods fail
      }

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
  }, [fieldType, optimizedValue, setValue, onClose, fieldTypeName, projectedScore, onUpdateScore, updateFieldInAllForms]);

  // Handler for copying the optimized value to clipboard
  const handleCopy = useCallback(() => {
    if (optimizedValue) {
      navigator.clipboard.writeText(optimizedValue)
        .then(() => {
          setCopySuccess('Copied to clipboard!');
          setTimeout(() => setCopySuccess(null), 2000);
        })
        .catch(() => {
          setError('Failed to copy to clipboard.');
        });
    }
  }, [optimizedValue]);

  // Handler for toggling the diff view
  const handleToggleDiff = useCallback(() => {
    setShowDiff(prev => !prev);
  }, []);

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
              sx={{ ml: 1 }}
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
              onClick={handleCopy}
              disabled={isLoading || !optimizedValue}
              variant="outlined"
              color="info"
              startIcon={<ContentCopyIcon />}
              sx={{ ml: 1 }}
            >
              Copy
            </Button>
            <Button
              onClick={handleToggleDiff}
              disabled={isLoading || !optimizedValue}
              variant="outlined"
              color="secondary"
              startIcon={<CompareArrowsIcon />}
              sx={{ ml: 1 }}
            >
              {showDiff ? 'Hide Diff' : 'Show Diff'}
            </Button>
            <Button
              onClick={handleApplyOptimization}
              disabled={isLoading}
              variant="contained"
              color="success" // Use success color for apply
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleOutlineIcon />}
              sx={{ ml: 1 }}
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
          "Use emotional words to increase engagement",
          "Include power words to make it compelling",
          "Make it descriptive and relevant to the content"
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
          "Avoid special characters and numbers"
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
          "Include sufficient number of secondary keywords",
          "Ensure they're relevant to the main topic"
        ],
        contentDescription: [
          "Include your primary keyword naturally",
          "Make it comprehensive and informative",
          "Structure with proper headings (H2, H3)",
          "Include relevant examples and data points",
          "Make it clear, focused, and easy to understand"
        ],
        content: [
          "Include your primary keyword in the first paragraph",
          "Use secondary keywords throughout",
          "Structure with proper headings and subheadings",
          "Include internal and external links where relevant"
        ],
        internalLinks: [
          "Link to relevant pages within your website",
          "Use descriptive anchor text that includes keywords",
          "Ensure links are contextually relevant",
          "Don't overdo it - 2-3 internal links per 1000 words is ideal"
        ],
        externalLinks: [
          "Link to high-authority sources in your industry",
          "Choose reputable sites with good domain authority",
          "Make sure external links open in a new tab",
          "Use descriptive anchor text that explains the link destination"
        ],
        language: [
          "Specify the primary language of your content",
          "Ensure the target country is compatible with your language choice",
          "Consider regional language variations if targeting specific markets",
          "Use proper language tags in your HTML"
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

            {/* Related Fields Section */}
            {selectedItem && (
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
                  <SignalCellularAltIcon sx={{ fontSize: 18, mr: 0.5, color: 'secondary.main' }} />
                  Related Fields
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  These fields also affect this scoring item:
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {getRelatedFields(selectedItem.id, fieldType).map((relatedField) => (
                    <Chip
                      key={relatedField}
                      label={getFieldTypeName(relatedField)}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                  {getRelatedFields(selectedItem.id, fieldType).length === 0 && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                      No other fields directly affect this item.
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

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
          <>
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
              onChange={(e) => handleFieldValueChange(e.target.value)}
              disabled={isLoading}
              // Use a stable key that doesn't change when typing
              key={`${fieldType}-field`}
            />

            {/* Show affected criteria if any */}
            {affectedCriteria.length > 0 && simulateFieldChange && (
              <AffectedCriteriaList
                criteria={affectedCriteria}
                title="Other criteria affected by this change"
                showImpactOnly={false}
              />
            )}
          </>
        )}

        {modalStep === 'optimized' && !showDiff && (
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

        {/* Diff View */}
        {modalStep === 'optimized' && showDiff && highlightedDifferences && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper'
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Original {fieldTypeName} (with deletions highlighted)
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.default',
                  minHeight: isMultiline ? '100px' : 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace'
                }}
              >
                {highlightedDifferences.originalHighlighted}
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper'
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Optimized {fieldTypeName} (with additions highlighted)
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.default',
                  minHeight: isMultiline ? '100px' : 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace'
                }}
              >
                {highlightedDifferences.optimizedHighlighted}
              </Box>
            </Paper>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: 'rgba(244, 67, 54, 0.1)', mr: 1, border: '1px solid rgba(244, 67, 54, 0.3)' }} />
                <Typography variant="caption">Deleted text</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, bgcolor: 'rgba(76, 175, 80, 0.1)', mr: 1, border: '1px solid rgba(76, 175, 80, 0.3)' }} />
                <Typography variant="caption">Added text</Typography>
              </Box>
            </Box>
          </Box>
        )}

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

        {/* Copy success message */}
        {copySuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {copySuccess}
          </Alert>
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