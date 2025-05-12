import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import {
  Box,
  Chip,
  Modal,
  Paper,
  Stack,
  Button,
  Divider,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';

import { getScoringRulesForItem } from 'src/utils/seoScoringCalculator';

interface OptimizeInputModalProps {
  open: boolean;
  onClose: () => void;
  inputType: string;
  inputLabel: string;
  currentValue: string;
  scoringItemId: number;
  context: Record<string, any>;
  onSave: (newValue: string) => void;
}

export function OptimizeInputModal({
  open,
  onClose,
  inputType,
  inputLabel,
  currentValue,
  scoringItemId,
  context,
  onSave,
}: OptimizeInputModalProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  
  const [value, setValue] = useState(currentValue);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  
  // Get the scoring rules for this item
  const scoringRules = getScoringRulesForItem(scoringItemId);
  
  const handleOptimize = async () => {
    console.log('Optimizing with AI...');
  };
  
  const handleSave = () => {
    onSave(value);
    onClose();
  };
  
  const handleCancel = () => {
    setValue(currentValue);
    setOptimizationComplete(false);
    onClose();
  };
  
  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="optimize-input-modal-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '80%', md: '60%' },
          maxWidth: 700,
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
          <Typography variant="h6" component="h2" id="optimize-input-modal-title">
            {t('Optimize')} {inputLabel}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCancel}
            sx={{
              color: 'primary.contrastText',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Content */}
        <Box sx={{ p: 3, overflow: 'auto', flexGrow: 1 }}>
          {/* Scoring Rules */}
          {scoringRules && (
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.02)'
              }}
            >
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                {t('Optimization Target')}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {scoringRules.description}
              </Typography>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                {t('Scoring Rules')}:
              </Typography>
              
              <Stack spacing={1} sx={{ mt: 1 }}>
                {Object.entries(scoringRules.scoring_rules).map(([score, description]) => (
                  <Box key={score} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Chip 
                      label={`${score} ${t('points')}`} 
                      size="small" 
                      color={
                        Number(score) === scoringRules.max_score 
                          ? 'success' 
                          : Number(score) > 0 
                            ? 'primary' 
                            : 'error'
                      }
                      sx={{ mt: 0.3 }}
                    />
                    <Typography variant="body2">
                      {description}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}
          
          {/* Input Field */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label={inputLabel}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOptimizationComplete(false);
            }}
            disabled={isOptimizing}
            sx={{ mb: 2 }}
          />
          
          {/* Optimization Status */}
          {optimizationComplete && (
            <Box sx={{ mb: 2, p: 1, bgcolor: 'success.light', borderRadius: 1, color: 'success.contrastText' }}>
              <Typography variant="body2">
                {t('Content has been optimized successfully!')}
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Actions */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleCancel} disabled={isOptimizing}>
            {t('Cancel')}
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={isOptimizing ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
              onClick={handleOptimize}
              disabled={isOptimizing}
            >
              {isOptimizing ? t('Optimizing...') : t('Optimize with AI')}
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isOptimizing}
            >
              {t('Save')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
