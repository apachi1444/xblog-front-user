import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Grid,
  Card,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { useAuth } from 'src/hooks/useAuth';

import { 
  useGetSocialMediaConnectionsQuery,
  useLazyGetLinkedInOAuthUrlQuery 
} from 'src/services/apis/integrations/linkedinApi';

import { Iconify } from 'src/components/iconify';

import { SocialMediaConnectionCard } from './SocialMediaConnectionCard';

// ----------------------------------------------------------------------

export function SocialMediaConnectionsList() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { accessToken } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showLinkedInFlow, setShowLinkedInFlow] = useState(false);
  const [linkedInAuthUrl, setLinkedInAuthUrl] = useState<string | null>(null);

  const { 
    data: connectionsData, 
    isLoading, 
    refetch 
  } = useGetSocialMediaConnectionsQuery();
  
  const [getLinkedInOAuthUrl] = useLazyGetLinkedInOAuthUrlQuery();

  const connections = connectionsData?.social_media_connections || [];

  const handleStartLinkedInFlow = async () => {
    setIsConnecting(true);

    try {
      const redirectUri = `${window.location.origin}/auth/callback`;
      const { data: oauthData } = await getLinkedInOAuthUrl({
        redirect_uri: redirectUri,
        state: 'linkedin_oauth'
      });

      if (oauthData?.auth_url) {
        setLinkedInAuthUrl(oauthData.auth_url);
        setShowLinkedInFlow(true);
      } else {
        throw new Error('Failed to get LinkedIn authorization URL');
      }
    } catch (error: any) {
      console.error('LinkedIn connection failed:', error);
      toast.error(t('connections.linkedinError', 'LinkedIn connection failed'));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleProceedToLinkedIn = () => {
    if (!linkedInAuthUrl) return;

    setIsConnecting(true);

    // Open LinkedIn OAuth in popup
    const popup = window.open(
      linkedInAuthUrl,
      'linkedin-oauth',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );

    // Listen for OAuth completion
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'LINKEDIN_CONNECTED') {
        toast.success(t('connections.linkedinConnected', 'LinkedIn account connected successfully!'));
        refetch(); // Refresh the connections list
        window.removeEventListener('message', messageHandler);
        setShowLinkedInFlow(false);
        setLinkedInAuthUrl(null);
      } else if (event.data.type === 'LINKEDIN_ERROR') {
        toast.error(event.data.error || t('connections.linkedinError', 'LinkedIn connection failed'));
        window.removeEventListener('message', messageHandler);
      }

      setIsConnecting(false);
    };

    window.addEventListener('message', messageHandler);

    // Monitor popup closure
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageHandler);
        setIsConnecting(false);
      }
    }, 1000);
  };

  const handleCancelLinkedInFlow = () => {
    setShowLinkedInFlow(false);
    setLinkedInAuthUrl(null);
    setIsConnecting(false);
  };

  const handleConnectionUpdate = () => {
    refetch(); // Refresh the connections list when a connection is updated
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            {t('connections.socialMedia', 'Social Media Connections')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('connections.socialMediaDescription', 'Connect your social media accounts to share content automatically')}
          </Typography>
        </Box>
        
        {!showLinkedInFlow ? (
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:linkedin" />}
            onClick={handleStartLinkedInFlow}
            disabled={isConnecting}
            sx={{
              bgcolor: '#0077B5',
              '&:hover': {
                bgcolor: '#005885',
              },
            }}
          >
            {isConnecting ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                {t('connections.connecting', 'Connecting...')}
              </>
            ) : (
              t('connections.connectLinkedIn', 'Connect LinkedIn')
            )}
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleCancelLinkedInFlow}
              disabled={isConnecting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleProceedToLinkedIn}
              disabled={isConnecting}
              sx={{
                bgcolor: '#0077B5',
                '&:hover': {
                  bgcolor: '#005885',
                },
              }}
            >
              {isConnecting ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                  Opening LinkedIn...
                </>
              ) : (
                'Next'
              )}
            </Button>
          </Box>
        )}
      </Box>

      {/* Connections Grid */}
      {connections.length > 0 ? (
        <Grid container spacing={3}>
          {connections.map((connection) => (
            <Grid item xs={12} sm={6} md={4} key={connection.id}>
              <SocialMediaConnectionCard 
                connection={connection} 
                onDisconnect={handleConnectionUpdate}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: alpha(theme.palette.grey[500], 0.04),
            border: `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <Iconify 
              icon="mdi:account-network" 
              width={40} 
              height={40} 
              sx={{ color: 'primary.main' }}
            />
          </Box>
          
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            {t('connections.noConnections', 'No Social Media Connections')}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            {t('connections.noConnectionsDescription', 'Connect your social media accounts to automatically share your content and reach a wider audience.')}
          </Typography>
          
          {!showLinkedInFlow ? (
            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:linkedin" />}
              onClick={handleStartLinkedInFlow}
              disabled={isConnecting}
              sx={{
                bgcolor: '#0077B5',
                '&:hover': {
                  bgcolor: '#005885',
                },
              }}
            >
              {isConnecting ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                  {t('connections.connecting', 'Connecting...')}
                </>
              ) : (
                t('connections.connectLinkedIn', 'Connect LinkedIn')
              )}
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleCancelLinkedInFlow}
                disabled={isConnecting}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleProceedToLinkedIn}
                disabled={isConnecting}
                sx={{
                  bgcolor: '#0077B5',
                  '&:hover': {
                    bgcolor: '#005885',
                  },
                }}
              >
                {isConnecting ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                    Opening LinkedIn...
                  </>
                ) : (
                  'Next'
                )}
              </Button>
            </Box>
          )}
        </Card>
      )}
    </Box>
  );
}
