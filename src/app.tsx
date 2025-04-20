import 'src/global.css';

import { Toaster } from 'react-hot-toast';
import { I18nextProvider } from 'react-i18next';
import { GoogleOAuthProvider } from '@react-oauth/google';

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
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Define default options
              className: '',
              duration: 5000,
              removeDelay: 1000,
              style: {
                background: '#363636',
                color: '#fff',
              },

              // Default options for specific types
              success: {
                duration: 3000,
                iconTheme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
            }}
          />
          <ToastProvider>
              <Router />
          </ToastProvider>
        </CustomThemeProvider>
      </I18nextProvider>
    </GoogleOAuthProvider>
  );
}
