import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  Chip,
  Button,
  Avatar,
  Dialog,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { useDisconnectSocialMediaMutation } from 'src/services/apis/integrations/linkedinApi';

import { Iconify } from 'src/components/iconify';

import type { SocialMediaConnection } from 'src/services/apis/integrations/linkedinApi';

// ----------------------------------------------------------------------

interface SocialMediaConnectionCardProps {
  connection: SocialMediaConnection;
  onDisconnect?: () => void;
}

export function SocialMediaConnectionCard({ connection, onDisconnect }: SocialMediaConnectionCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [disconnectDialog, setDisconnectDialog] = useState(false);
  
  const [disconnectSocialMedia, { isLoading: isDisconnecting }] = useDisconnectSocialMediaMutation();

  const handleDisconnect = async () => {
    try {
      await disconnectSocialMedia(connection.id).unwrap();
      toast.success(t('connections.disconnectSuccess', 'Successfully disconnected from {{platform}}', { 
        platform: connection.platform 
      }));
      onDisconnect?.();
    } catch (error) {
      toast.error(t('connections.disconnectError', 'Failed to disconnect. Please try again.'));
    }
    setDisconnectDialog(false);
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return '#0077B5';
      case 'twitter':
      case 'x':
        return '#1DA1F2';
      case 'facebook':
        return '#1877F2';
      case 'instagram':
        return '#E4405F';
      default:
        return theme.palette.primary.main;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return 'mdi:linkedin';
      case 'twitter':
      case 'x':
        return 'mdi:twitter';
      case 'facebook':
        return 'mdi:facebook';
      case 'instagram':
        return 'mdi:instagram';
      default:
        return 'mdi:account-circle';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  const isTokenExpiring = () => {
    if (!connection.token_expires_at) return false;
    const expiryDate = new Date(connection.token_expires_at);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7; // Show warning if expires within 7 days
  };

  return (
    <>
      <Card
        sx={{
          p: 3,
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme.customShadows.z8,
            transform: 'translateY(-2px)',
          },
        }}
      >
        {/* Platform Icon */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: alpha(getPlatformColor(connection.platform), 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Iconify 
            icon={getPlatformIcon(connection.platform)} 
            width={20} 
            height={20} 
            sx={{ color: getPlatformColor(connection.platform) }}
          />
        </Box>

        {/* Connection Info */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Avatar
            src={connection.avatar}
            alt={connection.name}
            sx={{
              width: 48,
              height: 48,
              border: `2px solid ${alpha(getPlatformColor(connection.platform), 0.2)}`,
            }}
          />
          
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {connection.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={connection.platform.charAt(0).toUpperCase() + connection.platform.slice(1)}
                size="small"
                sx={{
                  bgcolor: alpha(getPlatformColor(connection.platform), 0.1),
                  color: getPlatformColor(connection.platform),
                  fontWeight: 600,
                }}
              />
              
              <Chip
                label={connection.profile_type}
                size="small"
                variant="outlined"
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              {t('connections.connectedOn', 'Connected on')} {formatDate(connection.created_at)}
            </Typography>
          </Box>
        </Box>

        {/* Status and Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: connection.connection_status === 'connected' ? 'success.main' : 'error.main',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {connection.connection_status === 'connected' ? 
                t('connections.connected', 'Connected') : 
                t('connections.disconnected', 'Disconnected')
              }
            </Typography>
            
            {isTokenExpiring() && (
              <Chip
                label={t('connections.expiringSoon', 'Expires Soon')}
                size="small"
                color="warning"
                variant="outlined"
              />
            )}
          </Box>
          
          <IconButton
            onClick={() => setDisconnectDialog(true)}
            size="small"
            sx={{
              color: 'error.main',
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            <Iconify icon="mdi:unlink" width={20} height={20} />
          </IconButton>
        </Box>
      </Card>

      {/* Disconnect Confirmation Dialog */}
      <Dialog
        open={disconnectDialog}
        onClose={() => setDisconnectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="mdi:unlink" sx={{ color: 'error.main' }} />
            {t('connections.confirmDisconnect', 'Confirm Disconnect')}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('connections.disconnectMessage', 'Are you sure you want to disconnect from {{name}}? You will need to reconnect to continue sharing content.', {
              name: connection.name
            })}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDisconnectDialog(false)} variant="outlined">
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button 
            onClick={handleDisconnect} 
            variant="contained" 
            color="error"
            disabled={isDisconnecting}
            startIcon={isDisconnecting ? <CircularProgress size={16} /> : <Iconify icon="mdi:unlink" />}
          >
            {isDisconnecting ? 
              t('connections.disconnecting', 'Disconnecting...') : 
              t('connections.disconnect', 'Disconnect')
            }
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
