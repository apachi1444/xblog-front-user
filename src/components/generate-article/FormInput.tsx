import type { TextFieldProps } from '@mui/material';

import React, { forwardRef } from 'react';
import { HelpCircle } from 'lucide-react';

import {
  Box,
  Tooltip,
  useTheme,
  TextField,
  Typography,
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

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  label,
  tooltipText,
  tooltipPlacement = 'top',
  icon,
  endComponent,
  error,
  helperText,
  ...textFieldProps
}, ref) => {
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
            value={textFieldProps.value}
            fullWidth
            size="small"
            variant="outlined"
            error={error}
            inputRef={ref}
            InputProps={{
              startAdornment: icon,
              sx: {
                minHeight: theme.spacing(6.25), // 50px equivalent using theme spacing
                bgcolor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius / 8,
                border: `1px solid ${error
                  ? theme.palette.error.main
                  : theme.palette.mode === 'dark'
                    ? theme.palette.grey[700]
                    : theme.palette.grey[300]}`,
                fontSize: theme.typography.button.fontSize,
                color: theme.palette.text.primary,
                transition: 'all 0.2s ease',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : theme.palette.grey[50],
                  border: `1px solid ${error
                    ? theme.palette.error.main
                    : theme.palette.mode === 'dark'
                      ? theme.palette.primary.main
                      : theme.palette.primary.main}`
                },
                '&.Mui-focused': {
                  bgcolor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : theme.palette.background.paper,
                  border: `2px solid ${theme.palette.primary.main}`,
                  boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`
                }
              }
            }}
            // Log the value for debugging
            onChange={(e) => {
              if (textFieldProps.onChange) {
                textFieldProps.onChange(e);
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
});