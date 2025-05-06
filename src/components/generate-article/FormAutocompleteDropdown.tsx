import React, { useState, forwardRef } from 'react';
import { HelpCircle } from 'lucide-react';

import {
  Box,
  Tooltip,
  useTheme,
  TextField,
  Typography,
  FormControl,
  Autocomplete,
  FormHelperText
} from '@mui/material';

interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
}

interface FormAutocompleteDropdownProps {
  label: string;
  options: DropdownOption[];
  tooltipText?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  freeSolo?: boolean;
  multiple?: boolean;
}

export const FormAutocompleteDropdown = forwardRef<HTMLInputElement, FormAutocompleteDropdownProps>(({
  label,
  options,
  tooltipText,
  placeholder,
  error,
  helperText,
  value,
  onChange,
  name,
  freeSolo = true,
  multiple = false,
  ...props
}, ref) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');

  // Find the selected option based on value
  const selectedOption = options.find(opt => opt.value === value);

  // For display in the Autocomplete
  const autocompleteValue = selectedOption || (value && freeSolo ? { value, label: value } : null);

  const handleChange = (_event: React.SyntheticEvent, newValue: any) => {
    if (!newValue) {
      onChange?.('');
      return;
    }

    // Handle both option objects and free text input
    const newValueToUse = typeof newValue === 'string' ? newValue : newValue.value;
    onChange?.(newValueToUse);
  };

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

      <Autocomplete
        freeSolo={freeSolo}
        options={options}
        getOptionLabel={(option) => {
          // Handle both string values and option objects
          if (typeof option === 'string') {
            return option;
          }
          return option.label || '';
        }}
        value={autocompleteValue}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder || 'Select or type...'}
            error={error}
            size="small"
            inputRef={ref}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: theme.spacing(6.25),
                bgcolor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius / 6,
                border: `0.5px solid ${error ? theme.palette.error.main : theme.palette.primary.main}`,
                fontSize: theme.typography.button.fontSize,
              }
            }}
          />
        )}
        renderOption={(newProps, option) => (
          <Box component="li" {...newProps}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {option.icon && (
                <Box component="span" sx={{ fontSize: '1.2em' }}>
                  {option.icon}
                </Box>
              )}
              {option.label}
            </Box>
          </Box>
        )}
        {...props}
      />

      {helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
});
