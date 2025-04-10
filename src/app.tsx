import 'src/global.css';

import { I18nextProvider } from 'react-i18next';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Router } from 'src/routes/sections';

import { ThemeProvider } from 'src/theme/theme-provider';

import i18n from './locales/i18n';
import { AuthGuard } from './guards/AuthGuard';
import { ToastProvider } from './contexts/ToastContext';

// Get Google OAuth client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <I18nextProvider i18n={i18n}>  
        <ThemeProvider>
          <ToastProvider>
              <Router />
          </ToastProvider>
        </ThemeProvider>
      </I18nextProvider>
    </GoogleOAuthProvider>
  );
}
