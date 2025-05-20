import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from 'react';

// MUI icons
import CloseIcon from '@mui/icons-material/Close';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// MUI components
import {
  Box,
  Grid,
  Modal,
  Button,
  Divider,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';

// Custom hooks and utilities
import { useCriteriaEvaluation } from '../../sections/generate/hooks/useCriteriaEvaluation';
import { 
  getCriterionById, 
  EVALUATION_FUNCTIONS,
  IMPROVEMENT_FUNCTIONS,
  getInputFieldsByCriterion
} from '../../utils/seo-criteria-evaluators';

// Types
import type { CriterionStatus } from '../../types/criteria.types';
import type {
  FormData
} from '../../utils/seo-criteria-evaluators';

interface CriteriaOptimizationModalProps {
  open: boolean;
  onClose: () => void;
  criterionId: number;
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
    content: "Article Content",
    secondaryKeywords: "Secondary Keywords",
    language: "Language",
    targetCountry: "Target Country"
  };
  return names[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

// Helper function to get status icon
const getStatusIcon = (status: CriterionStatus) => {
  switch (status) {
    case 'success':
      return <CheckCircleOutlineIcon color="success" />;
    case 'warning':
      return <WarningAmberIcon color="warning" />;
    case 'error':
      return <ErrorOutlineIcon color="error" />;
    default:
      return null;
  }
};

export function CriteriaOptimizationModal({
  open,
  onClose,
  criterionId
}: CriteriaOptimizationModalProps) {
  const { t } = useTranslation();
  const formMethods = useFormContext();
  
  // Get criterion details
  const criterion = useMemo(() => getCriterionById(criterionId), [criterionId]);
  
  // Get input fields that affect this criterion
  const inputFields = useMemo(() => 
    getInputFieldsByCriterion(criterionId), [criterionId]);
  
  // Use criteria evaluation hook
  const { 
    evaluateCriteria, 
  } = useCriteriaEvaluation(formMethods);
  
  // Local state for input values
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [originalValues, setOriginalValues] = useState<Record<string, string>>({});
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  
  // Initialize input values when modal opens
  useEffect(() => {
    if (open && inputFields.length > 0) {
      const values: Record<string, string> = {};
      const originals: Record<string, string> = {};
      
      inputFields.forEach(field => {
        // Try to get value from different form paths
        const value = 
          formMethods.getValues(field) || 
          formMethods.getValues(`step1.${field}`) || 
          formMethods.getValues(`step2.${field}`) || 
          formMethods.getValues(`step3.${field}`) || 
          '';
        
        values[field] = value;
        originals[field] = value;
      });
      
      setInputValues(values);
      setOriginalValues(originals);
    }
  }, [open, inputFields, formMethods]);
  
  // Evaluate criterion with current input values
  const evaluateCriterionWithCurrentValues = useCallback(() => {
    // Create form data object with current values
    const formData: FormData = {
      title: formMethods.getValues('title') || formMethods.getValues('step1.title') || '',
      metaTitle: formMethods.getValues('metaTitle') || formMethods.getValues('step2.metaTitle') || '',
      metaDescription: formMethods.getValues('metaDescription') || formMethods.getValues('step2.metaDescription') || '',
      urlSlug: formMethods.getValues('urlSlug') || formMethods.getValues('step2.urlSlug') || '',
      primaryKeyword: formMethods.getValues('primaryKeyword') || formMethods.getValues('step1.primaryKeyword') || '',
      secondaryKeywords: formMethods.getValues('secondaryKeywords') || formMethods.getValues('step1.secondaryKeywords') || '',
      content: formMethods.getValues('content') || formMethods.getValues('step3.content') || '',
      contentDescription: formMethods.getValues('contentDescription') || formMethods.getValues('step1.contentDescription') || '',
      language: formMethods.getValues('language') || formMethods.getValues('step1.language') || '',
      targetCountry: formMethods.getValues('targetCountry') || formMethods.getValues('step1.targetCountry') || '',
    };
    
    // Override with current input values
    Object.entries(inputValues).forEach(([field, value]) => {
      formData[field as keyof FormData] = value;
    });
    
    // Get evaluation function
    const evaluationFn = EVALUATION_FUNCTIONS[criterionId];
    if (evaluationFn) {
      return evaluationFn(null, formData);
    }
    
    return null;
  }, [criterionId, inputValues, formMethods]);
  
  // Current evaluation result
  const currentEvaluation = useMemo(() => 
    evaluateCriterionWithCurrentValues(), 
    [evaluateCriterionWithCurrentValues]);
  
  // Handle input change
  const handleInputChange = useCallback((field: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);
  
  // Handle optimize button click
  const handleOptimize = useCallback(() => {
    setIsOptimizing(true);
    
    try {
      // Get improvement function
      const improvementFn = IMPROVEMENT_FUNCTIONS[criterionId];
      if (improvementFn) {
        // Create form data with current input values
        const formData: FormData = {
          title: inputValues.title || formMethods.getValues('title') || formMethods.getValues('step1.title') || '',
          metaTitle: inputValues.metaTitle || formMethods.getValues('metaTitle') || formMethods.getValues('step2.metaTitle') || '',
          metaDescription: inputValues.metaDescription || formMethods.getValues('metaDescription') || formMethods.getValues('step2.metaDescription') || '',
          urlSlug: inputValues.urlSlug || formMethods.getValues('urlSlug') || formMethods.getValues('step2.urlSlug') || '',
          primaryKeyword: inputValues.primaryKeyword || formMethods.getValues('primaryKeyword') || formMethods.getValues('step1.primaryKeyword') || '',
          secondaryKeywords: inputValues.secondaryKeywords || formMethods.getValues('secondaryKeywords') || formMethods.getValues('step1.secondaryKeywords') || '',
          content: inputValues.content || formMethods.getValues('content') || formMethods.getValues('step3.content') || '',
          contentDescription: inputValues.contentDescription || formMethods.getValues('contentDescription') || formMethods.getValues('step1.contentDescription') || '',
          language: inputValues.language || formMethods.getValues('language') || formMethods.getValues('step1.language') || '',
          targetCountry: inputValues.targetCountry || formMethods.getValues('targetCountry') || formMethods.getValues('step1.targetCountry') || '',
        };
        
        // Get improved value
        const result = improvementFn(null, formData);
        
        // Handle composite criteria that return an object with field and value
        if (result && typeof result === 'object' && 'field' in result) {
          const field = result.field as string;
          const value = result.value as string;
          
          // Update input values
          setInputValues(prev => ({
            ...prev,
            [field.split('.').pop() || field]: value
          }));
        } else {
          // Handle simple criteria that return a direct value
          const primaryInputField = inputFields[0]; // Use the first input field as primary
          
          // Update input values
          setInputValues(prev => ({
            ...prev,
            [primaryInputField]: result
          }));
        }
        
        // Show comparison
        setShowComparison(true);
      }
    } finally {
      setIsOptimizing(false);
    }
  }, [criterionId, inputValues, inputFields, formMethods]);
  
  // Handle save button click
  const handleSave = useCallback(() => {
    // Update form values
    Object.entries(inputValues).forEach(([field, value]) => {
      // Try to update in all possible locations
      const updateOptions = {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      };
      
      // Try direct field
      try {
        formMethods.setValue(field, value, updateOptions);
      } catch (err) {
        console.warn(`Failed to update direct field: ${field}`, err);
      }
      
      // Try step1
      try {
        formMethods.setValue(`step1.${field}`, value, updateOptions);
      } catch (err) {
        console.warn(`Failed to update step1.${field}`, err);
      }
      
      // Try step2
      try {
        formMethods.setValue(`step2.${field}`, value, updateOptions);
      } catch (err) {
        console.warn(`Failed to update step2.${field}`, err);
      }
      
      // Try step3
      try {
        formMethods.setValue(`step3.${field}`, value, updateOptions);
      } catch (err) {
        console.warn(`Failed to update step3.${field}`, err);
      }
      
      // Re-evaluate criteria
      evaluateCriteria(field, value);
    });
    
    // Close modal
    onClose();
  }, [inputValues, formMethods, evaluateCriteria, onClose]);
  
  // If no criterion found, don't render
  if (!criterion) {
    return null;
  }
  
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="criteria-optimization-modal-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '80%', md: '70%' },
          maxWidth: 800,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <Typography variant="h6" component="h2" id="criteria-optimization-modal-title">
            {t('Optimize')}: {t(criterion.description)}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: 'primary.contrastText',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Content */}
        <Box sx={{ p: 3, overflow: 'auto' }}>
          {/* Criterion status */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t('Current Status')}:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getStatusIcon(currentEvaluation?.status || 'pending')}
              <Typography>
                {currentEvaluation?.message || t('Pending evaluation')}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Input fields */}
          <Typography variant="subtitle1" gutterBottom>
            {t('Related Input Fields')}:
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {inputFields.map(field => (
              <Grid item xs={12} key={field}>
                <Typography variant="body2" gutterBottom>
                  {getFieldTypeName(field)}:
                </Typography>
                <TextField
                  fullWidth
                  multiline={field === 'content' || field === 'contentDescription' || field === 'metaDescription'}
                  rows={field === 'content' ? 6 : field === 'contentDescription' || field === 'metaDescription' ? 3 : 1}
                  value={inputValues[field] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  variant="outlined"
                  size="small"
                />
                
                {/* Show comparison if optimized */}
                {showComparison && originalValues[field] !== inputValues[field] && (
                  <Box sx={{ mt: 1, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t('Original')}:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        p: 1, 
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                        textDecoration: 'line-through',
                        color: 'text.secondary'
                      }}
                    >
                      {originalValues[field]}
                    </Typography>
                  </Box>
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Actions */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onClose} disabled={isOptimizing}>
            {t('Cancel')}
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {currentEvaluation?.status !== 'success' && (
              <Button
                variant="outlined"
                startIcon={isOptimizing ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
                onClick={handleOptimize}
                disabled={isOptimizing}
              >
                {isOptimizing ? t('Optimizing...') : t('Optimize')}
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isOptimizing || JSON.stringify(inputValues) === JSON.stringify(originalValues)}
            >
              {t('Save')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default CriteriaOptimizationModal;
