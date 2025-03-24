import React from 'react';
import { Box, TextField, Tooltip, Typography, TextFieldProps } from '@mui/material';
import { HelpCircle } from 'lucide-react';

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
  return (
    <Box sx={{ flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mb: 0.5 }}>
        <Typography 
          sx={{ 
            fontFamily: "'Poppins', Helvetica",
            fontWeight: 500,
            color: '#1f384c',
            fontSize: '0.75rem',
            letterSpacing: '0.5px',
            lineHeight: '23px'
          }}
        >
          {label}
        </Typography>
        {tooltipText && (
          <Tooltip title={tooltipText}>
            <Box component="span" sx={{ display: 'inline-flex', cursor: 'pointer' }}>
              <HelpCircle size={16} color="#5969cf" />
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
            height: '32px',
            bgcolor: '#f7f7fa',
            borderRadius: '5px',
            border: '0.5px solid #5969cf',
            fontSize: '0.75rem',
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