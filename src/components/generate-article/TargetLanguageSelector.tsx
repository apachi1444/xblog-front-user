import { useState } from 'react';
import Flag from 'react-world-flags';
import { Controller, useFormContext } from 'react-hook-form';

import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Button,
  Popover,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';

import { COUNTRIES, LANGUAGES } from 'src/utils/constants';

import { Iconify } from 'src/components/iconify';

export function TargetLanguageSelector() {
  const { control, watch } = useFormContext();

  // Watch for country and language changes (nested under step1)
  const selectedCountry = watch('step1.targetCountry') || '';
  const selectedLanguage = watch('step1.language') || '';

  // State for popovers
  const [countryAnchorEl, setCountryAnchorEl] = useState<HTMLElement | null>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<HTMLElement | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');

  // Filter countries and languages based on search
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredLanguages = LANGUAGES.filter(language =>
    language.name.toLowerCase().includes(languageSearch.toLowerCase())
  );

  // Get country and language display info
  const selectedCountryInfo = COUNTRIES.find(c => c.code === selectedCountry);
  const selectedLanguageInfo = LANGUAGES.find(l => l.code === selectedLanguage);



  // Note: Default values are now handled by the form's getDefaultValues function
  // This ensures proper defaults for new articles while preserving draft data
  // No need to override form defaults here

  return (
    <Grid container spacing={2}>
      {/* Country Selector */}
      <Grid item xs={12} md={6}>
        <Controller
          name="step1.targetCountry"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Target Country
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                onClick={(e) => setCountryAnchorEl(e.currentTarget)}
                endIcon={<KeyboardArrowDownIcon />}
                startIcon={selectedCountry && selectedCountry !== 'global' ?
                  <Flag code={selectedCountry} height="16" /> :
                  <Iconify icon="mdi:earth" width={16} height={16} />
                }
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  py: 1.5,
                  color: 'text.primary',
                  bgcolor: (theme) => theme.palette.mode === 'dark'
                    ? theme.palette.background.neutral
                    : theme.palette.background.paper,
                  border: (theme) => `1px solid ${theme.palette.mode === 'dark'
                    ? theme.palette.grey[700]
                    : theme.palette.grey[300]}`,
                  '& .MuiButton-startIcon': { marginRight: 1 },
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark'
                      ? theme.palette.background.neutral
                      : theme.palette.background.paper,
                    borderColor: (theme) => theme.palette.mode === 'dark'
                      ? theme.palette.grey[600]
                      : 'divider'
                  }
                }}
              >
                {selectedCountryInfo ? selectedCountryInfo.name : 'Select Country'}
              </Button>

              {error && (
                <Typography color="error" variant="caption">
                  {error.message}
                </Typography>
              )}

              <Popover
                open={Boolean(countryAnchorEl)}
                anchorEl={countryAnchorEl}
                onClose={() => setCountryAnchorEl(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                slotProps={{
                  paper: {
                    sx: {
                      width: 320,
                      maxHeight: 400,
                      p: 2,
                      bgcolor: (theme) => theme.palette.mode === 'dark'
                        ? theme.palette.background.neutral
                        : theme.palette.background.paper,
                      boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 8px 16px rgba(0,0,0,0.4)'
                        : '0 8px 16px rgba(0,0,0,0.1)'
                    }
                  }
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search countries"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                  size="small"
                />

                <Paper
                  sx={{
                    maxHeight: 300,
                    overflow: 'auto',
                    bgcolor: (theme) => theme.palette.mode === 'dark'
                      ? theme.palette.background.neutral
                      : theme.palette.background.paper,
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(0,0,0,0.2)',
                      borderRadius: '4px',
                    }
                  }}
                >
                  <Stack spacing={0.5}>
                    {filteredCountries.map((country) => (
                      <Button
                        key={country.code}
                        fullWidth
                        onClick={() => {
                          field.onChange(country.code);
                          setCountryAnchorEl(null);
                          setCountrySearch('');
                        }}
                        startIcon={country.code === 'global' ?
                          <Iconify icon="mdi:earth" width={16} height={16} /> :
                          <Flag code={country.code} height="16" />
                        }
                        sx={{
                          justifyContent: 'flex-start',
                          py: 1,
                          px: 2,
                          borderRadius: 1,
                          backgroundColor: (theme) => selectedCountry === country.code
                            ? theme.palette.mode === 'dark'
                              ? alpha(theme.palette.primary.main, 0.2)
                              : theme.palette.action.selected
                            : 'transparent',
                          color: 'text.primary',
                          '&:hover': {
                            backgroundColor: (theme) => theme.palette.mode === 'dark'
                              ? alpha(theme.palette.primary.main, 0.1)
                              : theme.palette.action.hover
                          }
                        }}
                      >
                        {country.name}
                      </Button>
                    ))}

                    {filteredCountries.length === 0 && (
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                          No countries found
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              </Popover>
            </>
          )}
        />
      </Grid>

      {/* Language Selector - Independent from country */}
      <Grid item xs={12} md={6}>
        <Controller
          name="step1.language"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Target Language
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                onClick={(e) => setLanguageAnchorEl(e.currentTarget)}
                endIcon={<KeyboardArrowDownIcon />}
                startIcon={selectedLanguageInfo && selectedLanguageInfo.countryCode ?
                  <Flag code={selectedLanguageInfo.countryCode} height="16" /> : null
                }
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  py: 1.5,
                  color: 'text.primary',
                  bgcolor: (theme) => theme.palette.mode === 'dark'
                    ? theme.palette.background.neutral
                    : theme.palette.background.paper,
                  border: (theme) => `1px solid ${theme.palette.mode === 'dark'
                    ? theme.palette.grey[700]
                    : theme.palette.grey[300]}`,
                  '& .MuiButton-startIcon': { marginRight: 1 },
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark'
                      ? theme.palette.background.neutral
                      : theme.palette.background.paper,
                    borderColor: (theme) => theme.palette.mode === 'dark'
                      ? theme.palette.grey[600]
                      : 'divider'
                  }
                }}
              >
                {selectedLanguageInfo ? selectedLanguageInfo.name : 'Select Language'}
              </Button>

              {error && (
                <Typography color="error" variant="caption">
                  {error.message}
                </Typography>
              )}

              <Popover
                open={Boolean(languageAnchorEl)}
                anchorEl={languageAnchorEl}
                onClose={() => setLanguageAnchorEl(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                slotProps={{
                  paper: {
                    sx: {
                      width: 320,
                      maxHeight: 400,
                      p: 2,
                      bgcolor: (theme) => theme.palette.mode === 'dark'
                        ? theme.palette.background.neutral
                        : theme.palette.background.paper,
                      boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 8px 16px rgba(0,0,0,0.4)'
                        : '0 8px 16px rgba(0,0,0,0.1)'
                    }
                  }
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search languages"
                  value={languageSearch}
                  onChange={(e) => setLanguageSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                  size="small"
                />

                <Paper
                  sx={{
                    maxHeight: 300,
                    overflow: 'auto',
                    bgcolor: (theme) => theme.palette.mode === 'dark'
                      ? theme.palette.background.neutral
                      : theme.palette.background.paper,
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(0,0,0,0.2)',
                      borderRadius: '4px',
                    }
                  }}
                >
                  <Stack spacing={0.5}>
                    {filteredLanguages.map((language) => (
                      <Button
                        key={language.code}
                        fullWidth
                        onClick={() => {
                          field.onChange(language.code);
                          setLanguageAnchorEl(null);
                          setLanguageSearch('');
                        }}
                        startIcon={language.countryCode ?
                          <Flag code={language.countryCode} height="16" /> : null
                        }
                        sx={{
                          justifyContent: 'flex-start',
                          py: 1,
                          px: 2,
                          borderRadius: 1,
                          backgroundColor: (theme) => selectedLanguage === language.code
                            ? theme.palette.mode === 'dark'
                              ? alpha(theme.palette.primary.main, 0.2)
                              : theme.palette.action.selected
                            : 'transparent',
                          color: 'text.primary',
                          '&:hover': {
                            backgroundColor: (theme) => theme.palette.mode === 'dark'
                              ? alpha(theme.palette.primary.main, 0.1)
                              : theme.palette.action.hover
                          }
                        }}
                      >
                        {language.name}
                      </Button>
                    ))}

                    {filteredLanguages.length === 0 && (
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                          No languages found
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              </Popover>
            </>
          )}
        />
      </Grid>
    </Grid>
  );
}
