import type { TextFieldProps } from '@mui/material';

import React from 'react';
import { HelpCircle } from 'lucide-react';

import { Box, Tooltip, TextField, Typography, useTheme } from '@mui/material';

interface FormInputProps extends Omit<TextFieldProps, 'variant'> {
  label: string;
  tooltipText?: string;
  icon?: React.ReactNode;
}

export function FormInput({ 
  label, 
  tooltipText, 
  icon,
  ...textFieldProps 
}: FormInputProps) {
  const theme = useTheme();
  
  return (
    <Box sx={{ flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
        <Typography 
          variant="caption"
          sx={{ 
            fontWeight: 500,
            color: theme.palette.text.primary,
            letterSpacing: '0.5px',
            lineHeight: 1.5
          }}
        >
          {label}
        </Typography>
        {tooltipText && (
          <Tooltip title={tooltipText}>
            <Box component="span" sx={{ display: 'inline-flex', cursor: 'pointer' }}>
              <HelpCircle size={16} color={theme.palette.primary.main} />
            </Box>
          </Tooltip>
        )}
      </Box>

      <TextField
        fullWidth
        size="small"
        variant="outlined"
        InputProps={{
          startAdornment: icon,
          sx: {
            minHeight: theme.spacing(6.25), // 50px equivalent using theme spacing
            bgcolor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius / 8,
            border: `0.5px solid ${theme.palette.primary.main}`,
            fontSize: theme.typography.button.fontSize,
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            }
          }
        }}
        {...textFieldProps}
      />
    </Box>
  );
}