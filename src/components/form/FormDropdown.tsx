import type { SelectProps} from '@mui/material';

import React from 'react';
import { HelpCircle } from 'lucide-react';

import { Box, Select, Tooltip, MenuItem, useTheme, Typography, FormControl } from '@mui/material';

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
}

export function FormDropdown({ 
  label, 
  options, 
  tooltipText, 
  icon,
  placeholder,
  ...selectProps 
}: FormDropdownProps) {
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

      <FormControl fullWidth size="small">
        <Select
          displayEmpty
          sx={{
            height: theme.spacing(6.25),
            bgcolor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius / 6,
            border: `0.5px solid ${theme.palette.primary.main}`,
            fontSize: theme.typography.button.fontSize,
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing(1),
              py: 0.5
            }
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
                {option?.icon && <span>{option.icon}</span>}
                <span>{option?.label}</span>
              </Box>
            );
          }}
          {...selectProps}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {option.icon && <span>{option.icon}</span>}
                <span>{option.label}</span>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}