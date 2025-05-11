import Flag from 'react-world-flags';
import { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { alpha } from '@mui/material/styles';
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

// Types
interface CountryOption {
  code: string;
  name: string;
}

interface LanguageOption {
  code: string;
  name: string;
  countryCode?: string; // Optional country code for flag display
}

// Country data
const COUNTRIES: CountryOption[] = [
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
  { code: 'fr', name: 'France' },
  { code: 'de', name: 'Germany' },
  { code: 'es', name: 'Spain' },
  { code: 'it', name: 'Italy' },
  { code: 'jp', name: 'Japan' },
  { code: 'cn', name: 'China' },
  { code: 'br', name: 'Brazil' },
  { code: 'ru', name: 'Russia' },
  { code: 'in', name: 'India' },
  { code: 'mx', name: 'Mexico' },
  { code: 'nl', name: 'Netherlands' },
  { code: 'se', name: 'Sweden' },
  { code: 'kr', name: 'South Korea' },
  { code: 'sa', name: 'Saudi Arabia' },
  { code: 'za', name: 'South Africa' },
  { code: 'sg', name: 'Singapore' },
];

// Language data with associated country for flag display
const LANGUAGES: LanguageOption[] = [
  { code: 'en-us', name: 'English (US)', countryCode: 'us' },
  { code: 'en-gb', name: 'English (UK)', countryCode: 'gb' },
  { code: 'en-ca', name: 'English (Canada)', countryCode: 'ca' },
  { code: 'en-au', name: 'English (Australia)', countryCode: 'au' },
  { code: 'en-in', name: 'English (India)', countryCode: 'in' },
  { code: 'en-za', name: 'English (South Africa)', countryCode: 'za' },
  { code: 'en-sg', name: 'English (Singapore)', countryCode: 'sg' },
  { code: 'fr-fr', name: 'French (France)', countryCode: 'fr' },
  { code: 'fr-ca', name: 'French (Canada)', countryCode: 'ca' },
  { code: 'es-es', name: 'Spanish (Spain)', countryCode: 'es' },
  { code: 'es-mx', name: 'Spanish (Mexico)', countryCode: 'mx' },
  { code: 'de-de', name: 'German', countryCode: 'de' },
  { code: 'it-it', name: 'Italian', countryCode: 'it' },
  { code: 'pt-br', name: 'Portuguese (Brazil)', countryCode: 'br' },
  { code: 'nl-nl', name: 'Dutch', countryCode: 'nl' },
  { code: 'sv-se', name: 'Swedish', countryCode: 'se' },
  { code: 'ru-ru', name: 'Russian', countryCode: 'ru' },
  { code: 'ja-jp', name: 'Japanese', countryCode: 'jp' },
  { code: 'zh-cn', name: 'Chinese (Simplified)', countryCode: 'cn' },
  { code: 'zh-sg', name: 'Chinese (Singapore)', countryCode: 'sg' },
  { code: 'ko-kr', name: 'Korean', countryCode: 'kr' },
  { code: 'ar-sa', name: 'Arabic', countryCode: 'sa' },
  { code: 'hi-in', name: 'Hindi', countryCode: 'in' },
];

export function TargetLanguageSelector() {
  const { control, watch, setValue } = useFormContext();

  // Watch for country and language changes
  const selectedCountry = watch('targetCountry') || '';
  const selectedLanguage = watch('language') || '';

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

  // Set default values if none are selected (to ensure form values are properly updated)
  useEffect(() => {
    // If no country is selected, set a default (US)
    if (!selectedCountry) {
      setValue('targetCountry', 'us', { shouldValidate: true });
    }

    // If no language is selected, set a default (English US)
    if (!selectedLanguage) {
      setValue('language', 'en-us', { shouldValidate: true });
    }
  }, [selectedCountry, selectedLanguage, setValue]);

  return (
    <Grid container spacing={2}>
      {/* Country Selector */}
      <Grid item xs={12} md={6}>
        <Controller
          name="targetCountry"
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
                startIcon={selectedCountry ?
                  <Flag code={selectedCountry} height="16" /> : null
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
                        startIcon={<Flag code={country.code} height="16" />}
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
          name="language"
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
