import type { TextFieldProps } from '@mui/material';

import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import React, { useRef, useState, useEffect, forwardRef } from 'react';

import {
  Box,
  Chip,
  Tooltip,
  useTheme,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
  InputAdornment,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface KeywordInputProps extends Omit<TextFieldProps, 'variant'> {
  label: string;
  tooltipText?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  icon?: React.ReactNode;
  endComponent?: React.ReactNode;
  error?: boolean;
  helperText?: React.ReactNode;
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onDeleteKeyword: (keyword: string) => void;
}

export const KeywordInput = forwardRef<HTMLInputElement, KeywordInputProps>(({
  label,
  tooltipText,
  tooltipPlacement = 'top',
  icon,
  endComponent,
  error,
  helperText,
  keywords,
  onAddKeyword,
  onDeleteKeyword,
  ...textFieldProps
}, ref) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input field when keywords change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [keywords.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addKeyword();
    }
  };

  const addKeyword = () => {
    if (inputValue.trim()) {
      onAddKeyword(inputValue.trim());
      setInputValue('');
    }
  };

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
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            inputRef={(input) => {
              if (typeof ref === 'function') {
                ref(input);
              } else if (ref) {
                ref.current = input;
              }
            }}
            InputProps={{
              startAdornment: icon,
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={t('keywords.tooltips.addKeyword', 'Add keyword')}>
                    <Box
                      onClick={addKeyword}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.palette.primary.main,
                        cursor: 'pointer',
                        p: 0.5,
                        borderRadius: '50%',
                        '&:hover': {
                          bgcolor: theme.palette.primary.lighter,
                        },
                      }}
                    >
                      <Iconify icon="eva:plus-fill" width={20} height={20} />
                    </Box>
                  </Tooltip>
                </InputAdornment>
              ),
              sx: {
                minHeight: theme.spacing(6.25),
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
                    : theme.palette.primary.main}`
                },
                '&.Mui-focused': {
                  border: `2px solid ${theme.palette.primary.main}`,
                  boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`
                },
                flexWrap: 'wrap',
                gap: 0.5,
                p: 1,
                alignItems: 'center',
              }
            }}
            {...textFieldProps}
          />

          {/* End component positioned outside the TextField */}
          {endComponent}
        </Box>

        {/* Display keywords as chips inside the input field */}
        {keywords.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              mt: 1,
              maxWidth: '100%'
            }}
          >
            {keywords.map((keyword, index) => (
              <Chip
                key={index}
                label={keyword}
                size="small"
                deleteIcon={<Iconify icon="eva:close-fill" width={16} height={16} />}
                onDelete={() => onDeleteKeyword(keyword)}
                sx={{
                  bgcolor: theme.palette.mode === 'dark'
                    ? `${theme.palette.primary.main}20`
                    : theme.palette.primary.lighter,
                  color: theme.palette.mode === 'dark'
                    ? theme.palette.primary.light
                    : theme.palette.primary.dark,
                  border: theme.palette.mode === 'dark'
                    ? `1px solid ${theme.palette.primary.main}40`
                    : 'none',
                  borderRadius: theme.shape.borderRadius,
                  animation: `fadeIn 0.3s ease-in-out ${index * 0.05}s both`,
                  "@keyframes fadeIn": {
                    "0%": { opacity: 0, transform: "translateY(5px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                  '& .MuiChip-deleteIcon': {
                    color: theme.palette.mode === 'dark'
                      ? theme.palette.primary.light
                      : theme.palette.primary.dark,
                    '&:hover': {
                      color: theme.palette.mode === 'dark'
                        ? theme.palette.primary.main
                        : theme.palette.primary.main,
                    },
                  },
                }}
              />
            ))}
          </Box>
        )}

        {helperText && (
          <FormHelperText>{helperText}</FormHelperText>
        )}
      </Box>
    </FormControl>
  );
});

