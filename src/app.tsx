import 'src/global.css';

import { Toaster } from 'react-hot-toast';
import { I18nextProvider } from 'react-i18next';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { useTheme } from '@mui/material/styles';

import { Router } from 'src/routes/sections';

import { useAxiosAuth } from 'src/hooks/useAxiosAuth';

import { CustomThemeProvider } from 'src/theme/theme-provider';

import i18n from './locales/i18n';
import { ToastProvider } from './contexts/ToastContext';

// Get Google OAuth client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log(GOOGLE_CLIENT_ID);

export default function App() {
  useAxiosAuth()
  return (
    <GoogleOAuthProvider clientId="116914976486-bkkcrqu1202aau2g8s1pcfbdq59066uj.apps.googleusercontent.com">
      <I18nextProvider i18n={i18n}>  
        <CustomThemeProvider>
          <ToasterWithTheme />
          <ToastProvider>
              <Router />
          </ToastProvider>
        </CustomThemeProvider>
      </I18nextProvider>
    </GoogleOAuthProvider>
  );
}

// Separate component to access theme context
function ToasterWithTheme() {
  const theme = useTheme();
  
  return (
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      gutter={12}
      toastOptions={{
        // Define default options
        className: '',
        duration: 5000,
        removeDelay: 1000,
        style: {
          background: theme.palette.mode === 'dark' 
            ? theme.palette.background.paper 
            : theme.palette.background.default,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '8px',
          boxShadow: theme.shadows[3],
          padding: '12px 16px',
          fontSize: '14px',
        },

        // Default options for specific types
        success: {
          duration: 3000,
          style: {
            background: theme.palette.mode === 'dark'
              ? theme.palette.success.dark
              : theme.palette.success.light,
            color: theme.palette.mode === 'dark'
              ? theme.palette.common.white
              : theme.palette.success.dark,
          },
          iconTheme: {
            primary: theme.palette.success.main,
            secondary: theme.palette.mode === 'dark'
              ? theme.palette.common.black
              : theme.palette.common.white,
          },
        },
        error: {
          duration: 4000,
          style: {
            background: theme.palette.mode === 'dark'
              ? theme.palette.error.dark
              : theme.palette.error.light,
            color: theme.palette.mode === 'dark'
              ? theme.palette.common.white
              : theme.palette.error.dark,
          },
          iconTheme: {
            primary: theme.palette.error.main,
            secondary: theme.palette.mode === 'dark'
              ? theme.palette.common.black
              : theme.palette.common.white,
          },
        },
      }}
    />
  );
}
