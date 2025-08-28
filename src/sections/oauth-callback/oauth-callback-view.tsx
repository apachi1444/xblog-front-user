import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography, CircularProgress } from '@mui/material';

import { useAuth } from 'src/hooks/useAuth';

import { useConnectLinkedInOAuthMutation } from 'src/services/apis/integrations/linkedinApi';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function OAuthCallbackView() {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const [connectLinkedInOAuth] = useConnectLinkedInOAuthMutation();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      // Handle OAuth errors
      if (error) {
        console.error('OAuth error:', error);
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'LINKEDIN_ERROR', 
            error: error 
          }, window.location.origin);
        }
        window.close();
        return;
      }

      // Process successful OAuth
      if (code && state === 'linkedin_oauth') {
        try {
          const result = await connectLinkedInOAuth({
            authorization_code: code,
            redirect_uri: `${window.location.origin}/auth/callback`,
            state: state,
            profile_type: 'personal'
          }).unwrap();
          
          // Success - notify parent window
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'LINKEDIN_CONNECTED', 
              data: result 
            }, window.location.origin);
          }
          window.close();
        } catch (connectError: any) {
          console.error('LinkedIn connection error:', connectError);
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'LINKEDIN_ERROR', 
              error: connectError.message || 'Connection failed'
            }, window.location.origin);
          }
          window.close();
        }
      } else {
        // Invalid callback parameters
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'LINKEDIN_ERROR', 
            error: 'Invalid callback parameters'
          }, window.location.origin);
        }
        window.close();
      }
    };

    handleOAuthCallback();
  }, [connectLinkedInOAuth]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          maxWidth: 400,
          textAlign: 'center',
        }}
      >
        <Iconify 
          icon="mdi:linkedin" 
          width={64} 
          height={64} 
          sx={{ color: '#0077B5' }} 
        />
        
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {t('oauth.connecting', 'Connecting to LinkedIn')}
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          {t('oauth.processing', 'Processing your LinkedIn connection...')}
        </Typography>
        
        <CircularProgress size={40} />
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {t('oauth.closeWindow', 'This window will close automatically once the connection is complete.')}
        </Typography>
      </Box>
    </Box>
  );
}
