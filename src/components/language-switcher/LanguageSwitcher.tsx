import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import { Iconify } from 'src/components/iconify';

const LANGUAGES = [
  {
    value: 'en',
    label: 'English',
    icon: 'flagpack:us',
  },
  {
    value: 'fr',
    label: 'Français',
    icon: 'flagpack:fr',
  },
  {
    value: 'pt',
    label: 'Português',
    icon: 'flagpack:br',
  },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    handleClose();
  };

  const currentLanguage = LANGUAGES.find((lang) => lang.value === i18n.language) || LANGUAGES[0];

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <Iconify icon={currentLanguage.icon} />
      </IconButton>

      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {LANGUAGES.map((language) => (
          <MenuItem
            key={language.value}
            selected={language.value === i18n.language}
            onClick={() => handleLanguageChange(language.value)}
          >
            <ListItemIcon>
              <Iconify icon={language.icon} width={20} />
            </ListItemIcon>
            <ListItemText primary={language.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}