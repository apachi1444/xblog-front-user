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
  onUpdateScore: (newScore: number) => void;
  onClose: () => void;
  fieldType: string;
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
  score
}: EditItemModalProps) {
  const { getValues, setValue } = useFormContext(); // Access form methods

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
      const initialValue = getValues(fieldType) || "";
      setFieldValue(initialValue);
      setOriginalValue(''); // Reset original value
      setOptimizedValue(null);
      setModalStep('initial');
      setError(null);
      setSuccess(null);
      setIsLoading(false);
      setProjectedScore(null);
      setEditingProjectedScore(null); // Reset editing projected score
    }
  }, [isOpen, fieldType, getValues]);

  // Add a handler for text field changes that updates the projected score
  const handleFieldValueChange = useCallback((value : string) => {
    const newValue = value;
    setFieldValue(newValue);

    if (newValue.length > 0) {
      const lengthImpact = Math.min(10, Math.floor(newValue.length / 20));
      const newProjectedScore = Math.min(100, score + lengthImpact);
      setEditingProjectedScore(newProjectedScore);
    } else {
      setEditingProjectedScore(null);
    }
  }, [score]);

  const handleOptimize = useCallback(async () => {
    setIsLoading(true);
    setModalStep('optimizing');
    setError(null);
    setSuccess(null);
    setOriginalValue(fieldValue);

    try {
      const result = await onOptimize(fieldType, fieldValue);
      setOptimizedValue(result);
      setModalStep('optimized');
      const newProjectedScore = Math.min(100, score + Math.floor(Math.random() * 15) + 5);
      setProjectedScore(newProjectedScore);
      setSuccess(`${fieldTypeName} optimized successfully. Review and apply.`);
    } catch (err: any) {
      setError(err.message || `Failed to optimize ${fieldTypeName}. Please try again.`);
      setModalStep('initial');
      setOriginalValue('');
    } finally {
      setIsLoading(false);
    }
  }, [fieldType, fieldValue, onOptimize, fieldTypeName, score]);

  const handleApplyOptimization = useCallback(async () => {
    if (optimizedValue === null) return;

    setIsLoading(true);
    setModalStep('applying');
    setError(null);
    setSuccess(null);

    try {
      setValue(fieldType, optimizedValue, { shouldValidate: true, shouldDirty: true });
      if (projectedScore !== null) {
        onUpdateScore(projectedScore);
      }
      setSuccess(`${fieldTypeName} updated successfully!`);
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err: any) {
      setError(err.message || `Failed to apply changes for ${fieldTypeName}.`);
      setModalStep('optimized');
      setIsLoading(false);
    }
  }, [fieldType, optimizedValue, setValue, onClose, fieldTypeName, projectedScore, onUpdateScore]);


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
          label={`${score}/100`}
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
          label={`${showProjectedScore}/100`}
          size="small"
          sx={{
            bgcolor: `${getScoreColor(showProjectedScore)}15`,
            color: getScoreColor(showProjectedScore),
            fontWeight: 'bold',
          }}
        />
      </Box>
    );

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