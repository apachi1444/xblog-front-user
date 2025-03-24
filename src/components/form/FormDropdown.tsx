import React from 'react';
import { Box, Select, Tooltip, MenuItem, Typography, FormControl, SelectProps } from '@mui/material';
import { HelpCircle } from 'lucide-react';

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

      <FormControl fullWidth size="small">
        <Select
          displayEmpty
          sx={{
            height: '32px',
            bgcolor: '#f7f7fa',
            borderRadius: '5px',
            border: '0.5px solid #5969cf',
            fontSize: '0.75rem',
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              py: 0.5
            }
          }}
          renderValue={(selected) => {
            if (!selected) {
              return (
                <Typography sx={{ opacity: 0.3, fontSize: '0.75rem' }}>
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