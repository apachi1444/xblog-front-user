import 'src/global.css';

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Provider, useDispatch } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { Iconify } from 'src/components/iconify';

import { store } from './services/store';
import { ToastProvider } from './contexts/ToastContext';
import { setThemeMode } from './services/slices/globalSlice';

// Get Google OAuth client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function App() {
  const dispatch = useDispatch();
  const { t, i18n: { changeLanguage, language } } = useTranslation();
  // const themeMode = useSelector((state : RootState) => state.global.themeMode);
  const themeMode = "light"
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [open, setOpen] = useState(false);

  useScrollToTop();

  // Toggle Language
  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "pt" : "en";
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  // Toggle Theme Mode
  const handleThemeToggle = () => {
    dispatch(setThemeMode(themeMode === "light" ? "dark" : "light"));
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <ToastProvider>
            <Router />
            {/* Floating Settings Button */}
            <Fab
              size="medium"
              aria-label="Settings"
              onClick={() => setOpen(true)}
              sx={{
                zIndex: 9,
                right: 20,
                bottom: 20,
                width: 44,
                height: 44,
                position: 'fixed',
                bgcolor: 'grey.800',
                color: 'common.white',
              }}
            >
              <Iconify width={24} icon="eva:settings-2-fill" />
            </Fab>

            {/* Settings Modal */}
            <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition>
              <Fade in={open}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>{t("Settings")}</Typography>

                  {/* Theme Toggle */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ mr: 2 }}>{t("Dark Mode")}</Typography>
                    <Switch checked={themeMode === "light"} onChange={handleThemeToggle} />
                  </Box>

                  {/* Language Toggle */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ mr: 2 }}>{t("Language")}: {currentLanguage.toUpperCase()}</Typography>
                    <Fab size="small" onClick={handleChangeLanguage} sx={{ ml: 1 }}>
                      {currentLanguage === "en" ? "PT" : "EN"}
                    </Fab>
                  </Box>
                </Box>
              </Fade>
            </Modal>
        </ToastProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
