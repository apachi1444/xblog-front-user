import type { RootState } from 'src/services/store';
import type { IconButtonProps } from '@mui/material/IconButton';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { setLanguage } from 'src/services/slices/userDashboardSlice';

// Updated languages configuration with all requested languages
const DEFAULT_LANGUAGES = [
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/flags/ic_flag_en.svg',
  },
  {
    value: 'es',
    label: 'Español',
    icon: '/assets/icons/flags/ic_flag_en.svg',
  },
  {
    value: 'ar',
    label: 'العربية',
    icon: '/assets/icons/flags/ic_flag_en.svg',
  },
  {
    value: 'fr',
    label: 'Français',
    icon: '/assets/icons/flags/ic_flag_fr.svg',
  },
  {
    value: 'pt',
    label: 'Português',
    icon: '/assets/icons/flags/ic_flag_en.svg',
  },
  {
    value: 'ru',
    label: 'Русский',
    icon: '/assets/icons/flags/ic_flag_en.svg',
  },
];

// ----------------------------------------------------------------------

export type LanguagePopoverProps = IconButtonProps & {
  data?: {
    value: string;
    label: string;
    icon: string;
  }[];
};

export function LanguagePopover({ data = DEFAULT_LANGUAGES, sx, ...other }: LanguagePopoverProps) {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  
  // Get language from Redux store
  const storedLanguage = useSelector((state: RootState) => state.userDashboard.preferences.language);
  
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  // Initialize locale from Redux store or fallback to i18n current language
  const [locale, setLocale] = useState<string>(storedLanguage || i18n.language || data[0].value);

  // Sync Redux language with i18n when component mounts
  useEffect(() => {
    if (storedLanguage && storedLanguage !== i18n.language) {
      i18n.changeLanguage(storedLanguage);
    }
  }, [storedLanguage, i18n]);

  const handleOpenPopover = useCallback((event: any) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleChangeLang = useCallback(
    (newLang: string) => {
      setLocale(newLang);
      
      // Update Redux store
      dispatch(setLanguage(newLang));
      
      // Update i18n language
      i18n.changeLanguage(newLang);
      
      // Force close the popover immediately
      setOpenPopover(null);
    },
    [dispatch, i18n]
  );

  const currentLang = data.find((lang) => lang.value === locale) || data[0];

  const renderFlag = (label?: string, icon?: string) => (
    <Box
      component="img"
      alt={label}
      src={icon}
      sx={{ width: 26, height: 20, borderRadius: 0.5, objectFit: 'cover' }}
    />
  );

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          width: 40,
          height: 40,
          transition: 'all 0.2s ease-in-out',
          ...(openPopover && { 
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          }),
          '&:hover': { 
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          },
          ...sx,
        }}
        {...other}
      >
        {renderFlag(currentLang?.label, currentLang?.icon)}
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { 
              mt: 1.5,
              overflow: 'hidden',
              boxShadow: (theme) => theme.customShadows?.dropdown || '0 0 24px rgba(0,0,0,0.08)',
              borderRadius: 1.5,
            },
          },
        }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 1,
            gap: 0.5,
            width: 180,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1.5,
              py: 1,
              gap: 2,
              borderRadius: 1,
              [`&.${menuItemClasses.selected}`]: {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                color: 'primary.main',
                fontWeight: 'fontWeightMedium',
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                },
              },
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
              },
            },
          }}
        >
          {data?.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === currentLang?.value}
              onClick={() => handleChangeLang(option.value)}
            >
              {renderFlag(option.label, option.icon)}
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
}
