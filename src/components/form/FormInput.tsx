import type { TextFieldProps } from '@mui/material';

import React from 'react';
import { HelpCircle } from 'lucide-react';

import { 
  Box, 
  Tooltip, 
  TextField, 
  Typography, 
  useTheme, 
  FormControl, 
  FormHelperText 
} from '@mui/material';

interface FormInputProps extends Omit<TextFieldProps, 'variant'> {
  label: string;
  tooltipText?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  icon?: React.ReactNode;
  endComponent?: React.ReactNode;
  error?: boolean;
  helperText?: React.ReactNode;
}

export function FormInput({ 
  label, 
  tooltipText, 
  tooltipPlacement = 'top',
  icon,
  endComponent,
  error,
  helperText,
  ...textFieldProps 
}: FormInputProps) {
  const theme = useTheme();
  
  return (
    <FormControl fullWidth error={error}>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <Typography 
            variant="caption"
            sx={{ 
              fontWeight: 500,
              color: error ? theme.palette.error.main : theme.palette.text.primary,
              letterSpacing: '0.5px',
              lineHeight: 1.5
            }}
          >
            {label}
          </Typography>
          {tooltipText && (
            <Tooltip title={tooltipText} placement={tooltipPlacement}>
              <Box component="span" sx={{ display: 'inline-flex', cursor: 'pointer' }}>
                <HelpCircle size={16} color={error ? theme.palette.error.main : theme.palette.primary.main} />
              </Box>
            </Tooltip>
          )}
        </Box>

        {/* Input field with end component layout */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            error={error}
            InputProps={{
              startAdornment: icon,
              sx: {
                minHeight: theme.spacing(6.25), // 50px equivalent using theme spacing
                bgcolor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius / 8,
                border: `0.5px solid ${error ? theme.palette.error.main : theme.palette.primary.main}`,
                fontSize: theme.typography.button.fontSize,
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                }
              }
            }}
            {...textFieldProps}
          />
          
          {/* End component positioned outside the TextField */}
          {endComponent}
        </Box>
        
        {helperText && (
          <FormHelperText>{helperText}</FormHelperText>
        )}
      </Box>
    </FormControl>
  );
}