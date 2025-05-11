import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useLanguage } from 'src/hooks/useLanguage';


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
  // Use the language hook directly
  const { language, setLanguage } = useLanguage();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: any) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleChangeLang = useCallback(
    (newLang: string) => {
      // Update language using the custom hook
      setLanguage(newLang);

      // Force close the popover immediately
      setOpenPopover(null);
    },
    [setLanguage]
  );

  const currentLang = data.find((lang) => lang.value === language) || data[0];

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
