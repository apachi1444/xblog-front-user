import type { SelectProps } from '@mui/material';

import React, { forwardRef } from 'react';
import { HelpCircle } from 'lucide-react';

import {
  Box,
  Select,
  Tooltip,
  MenuItem,
  useTheme,
  Typography,
  FormControl,
  FormHelperText
} from '@mui/material';

interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
}

interface FormDropdownProps extends Omit<SelectProps, 'renderValue'> {
  label: string;
  options: DropdownOption[];
  tooltipText?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  error?: boolean;
  helperText?: React.ReactNode;
}

export const FormDropdown = forwardRef<HTMLInputElement, FormDropdownProps>(({
  label,
  options,
  tooltipText,
  icon,
  placeholder,
  error,
  helperText,
  ...selectProps
}, ref) => {
  const theme = useTheme();

  return (
    <FormControl fullWidth size="small" error={error}>
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
          <Tooltip title={tooltipText}>
            <Box component="span" sx={{ display: 'inline-flex', cursor: 'pointer' }}>
              <HelpCircle size={16} color={error ? theme.palette.error.main : theme.palette.primary.main} />
            </Box>
          </Tooltip>
        )}
      </Box>

      <Select
        displayEmpty
        error={error}
        inputRef={ref}
        sx={{
          height: theme.spacing(6.25),
          bgcolor: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius / 6,
          border: `0.5px solid ${error ? theme.palette.error.main : theme.palette.primary.main}`,
          fontSize: theme.typography.button.fontSize,
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1),
            py: 0.5
          }
        }}
        onChange={(e) => {
          // Log the value for debugging
          console.log(`Dropdown ${label} changed to:`, e.target.value);

          // Call the original onChange handler from selectProps
          if (selectProps.onChange) {
            // @ts-ignore - The onChange handler might have different parameter requirements
            selectProps.onChange(e);
          }

          // Add a small delay to allow the form to update before validation
          setTimeout(() => {
            // Trigger validation immediately after selection
            if (selectProps.name && selectProps.onChange) {
              // This will trigger validation for this field
              const event = new Event('change', { bubbles: true });
              document.getElementsByName(selectProps.name)[0]?.dispatchEvent(event);
            }
          }, 0);
        }}
        renderValue={(selected) => {
          if (!selected) {
            return (
              <Typography
                sx={{
                  opacity: 0.3,
                  fontSize: theme.typography.caption.fontSize
                }}
              >
                {placeholder || 'Select an option'}
              </Typography>
            );
          }

          const option = options.find(opt => opt.value === selected);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {option?.icon && (
                <Box component="span" sx={{ fontSize: '1.2em' }}>
                  {option.icon}
                </Box>
              )}
              <Typography
                sx={{
                  fontSize: theme.typography.caption.fontSize,
                  fontWeight: 500
                }}
              >
                {String(option?.label || selected)}
              </Typography>
            </Box>
          );
        }}
        {...selectProps}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {option.icon && (
                <Box component="span" sx={{ fontSize: '1.2em' }}>
                  {option.icon}
                </Box>
              )}
              {option.label}
            </Box>
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
});