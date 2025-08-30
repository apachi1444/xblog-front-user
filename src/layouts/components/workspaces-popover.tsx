import type { Store } from 'src/types/store';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import ButtonBase from '@mui/material/ButtonBase';
import DialogTitle from '@mui/material/DialogTitle';
import { alpha, useTheme } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { setCurrentStore } from 'src/services/slices/stores/storeSlice';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';
import {
  useGetStoresQuery,
  useReconnectStoreMutation,
  useDisconnectStoreMutation
} from 'src/services/apis/storesApi';

import { Iconify } from 'src/components/iconify';

// Platform images mapping
const PLATFORM_IMAGES = {
  wordpress: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/WordPress_blue_logo.svg/512px-WordPress_blue_logo.svg.png',
  shopify: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/512px-Shopify_logo_2018.svg.png',
  wix: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Wix.com_website_logo.svg/512px-Wix.com_website_logo.svg.png',
  magento: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Magento_Logo.svg/512px-Magento_Logo.svg.png',
  prestashop: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/PrestaShop_logo.svg/512px-PrestaShop_logo.svg.png',
  default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/512px-HTML5_logo_and_wordmark.svg.png',
};

// ----------------------------------------------------------------------

export type WorkspacesPopoverProps = ButtonBaseProps & {
  data?: {
    id: number;
    name: string;
    logo: string;
    plan: string;
  }[];
};

export function WorkspacesPopover({ data = [], sx, ...other }: WorkspacesPopoverProps) {
  const { data: stores, isLoading } = useGetStoresQuery();
  const dispatch = useDispatch();
  const currentStore = useSelector(selectCurrentStore);
  const theme = useTheme();
  const location = useLocation();
  const [reconnectStore, { isLoading: isReconnecting }] = useReconnectStoreMutation();
  const [disconnectStore, { isLoading: isDisconnecting }] = useDisconnectStoreMutation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: 'reconnect' | 'disconnect';
    store: Store | null;
  }>({ open: false, action: 'reconnect', store: null });

  const open = Boolean(anchorEl);

  // Force close popover on component unmount or route change
  useEffect(() => () => {
      setAnchorEl(null);
    }, []);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleChangeWorkspace = useCallback(
    (newStore: Store) => {
      // Close popover FIRST
      setAnchorEl(null);
      dispatch(setCurrentStore(newStore));
    },
    [dispatch]
  );

  // Optimized navigation logic with route checking
  const handleAddNewWebsite = useCallback(() => {
    // Close popover immediately
    setAnchorEl(null);

    // Force immediate closing of the popover (same as account-popover)
    document.body.click();

    // Check if we're already on the target page to avoid unnecessary navigation
    if (location.pathname === '/stores/add') {
      // Already on the target page, no need to navigate
      return;
    }

    // Navigate after a very short delay to ensure popover is closed (same as account-popover)
    setTimeout(() => {
      // Use direct navigation for more reliable routing (same as account-popover)
      window.location.href = '/stores/add';
    }, 10);
  }, [location.pathname]);



  const handleConfirmAction = useCallback(async () => {
    if (!confirmDialog.store) return;

    try {
      if (confirmDialog.action === 'reconnect') {
        await reconnectStore(confirmDialog.store.id).unwrap();
        toast.success(`${confirmDialog.store.name} reconnected successfully`);
      } else {
        await disconnectStore(confirmDialog.store.id).unwrap();
        toast.success(`${confirmDialog.store.name} disconnected successfully`);
      }
    } catch (error) {
      toast.error(`Failed to ${confirmDialog.action} store. Please try again.`);
    }

    setConfirmDialog({ open: false, action: 'reconnect', store: null });
  }, [confirmDialog, reconnectStore, disconnectStore]);

  const handleCancelAction = useCallback(() => {
    setConfirmDialog({ open: false, action: 'reconnect', store: null });
  }, []);

  // Helper function to get platform image
  const getPlatformImage = (platform: string): string => {
    const platformKey = platform?.toLowerCase() as keyof typeof PLATFORM_IMAGES;
    return PLATFORM_IMAGES[platformKey] || PLATFORM_IMAGES.default;
  };

  const renderAvatar = (alt: string, src: string, platform?: string) => (
    <Box
      component="img"
      alt={alt}
      src={platform ? getPlatformImage(platform) : src}
      sx={{
        width: 24,
        height: 24,
        borderRadius: platform ? 0.5 : '50%',
        objectFit: 'contain'
      }}
    />
  );

  const getPlatformDisplayName = (platform: string | undefined) => {
    if (!platform) return '';
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  // Helper function to get a proper display name for the store
  const getStoreDisplayName = (store: Store) => {
    // If name looks like an email, try to use URL or create a better display name
    if (store.name && store.name.includes('@')) {
      if (store.url) {
        // Extract domain from URL
        try {
          const domain = new URL(store.url.startsWith('http') ? store.url : `https://${store.url}`).hostname;
          return domain.replace('www.', '');
        } catch {
          // If URL parsing fails, use the URL as is
          return store.url.replace(/^https?:\/\//, '').replace('www.', '');
        }
      }
      // If no URL, create a name from email domain
      const emailDomain = store.name.split('@')[1];
      return emailDomain || store.name;
    }
    // If name doesn't look like email, use it as is
    return store.name;
  };

  // Helper function to get subtitle for the store
  const getStoreSubtitle = (store: Store) => {
    // If name is an email and we have URL, show the email as subtitle
    if (store.name && store.name.includes('@') && store.url) {
      return store.name;
    }
    // If we have URL and it's different from name, show URL
    if (store.url && store.url !== store.name) {
      return store.url.replace(/^https?:\/\//, '').replace('www.', '');
    }
    // Otherwise, show platform info
    return getPlatformDisplayName(store.category);
  };

  if (isLoading || !currentStore) {
    return null;
  }

  return (
    <>
      <ButtonBase
        disableRipple
        onClick={handleClick}
        aria-describedby={open ? 'workspaces-popover' : undefined}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 1,
          p: 2,
          borderRadius: 2,
          transition: 'all 0.2s ease-in-out',
          background: currentStore.is_active
            ? alpha(theme.palette.success.main, 0.08)
            : alpha(theme.palette.error.main, 0.08),
          border: '1px solid',
          borderColor: currentStore.is_active
            ? alpha(theme.palette.success.main, 0.2)
            : alpha(theme.palette.error.main, 0.2),
          textAlign: 'left',
          minHeight: 64,
          ...sx,
        }}
        {...other}
      >
        {/* Left: Store name + Platform + Status */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, overflow: 'hidden', maxWidth: '80%', minWidth: 0 }}>
          {/* Store Name */}
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {getStoreDisplayName(currentStore)}
          </Typography>

          {/* Second row with Subtitle and Connection Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            {/* Subtitle (URL or Email) */}
            <Typography
              variant="caption"
              noWrap
              sx={{
                color: 'text.secondary',
                flex: 1,
                fontSize: '0.75rem',
              }}
            >
              {getStoreSubtitle(currentStore)}
            </Typography>

            {/* Connection Status */}
            <Typography
              variant="caption"
              noWrap
              sx={{
                color: currentStore.is_active
                  ? theme.palette.success.main
                  : theme.palette.error.main,
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              {currentStore.is_active ? 'Connected' : 'Disconnected'}
            </Typography>
          </Box>
        </Box>

        {/* Right Chevron */}
        <Iconify
          icon="eva:chevron-down-fill"
          width={18}
          sx={{ 
            color: 'text.secondary',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease-in-out',
          }}
        />
      </ButtonBase>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disableRestoreFocus
        disableScrollLock
        disablePortal={false}
        keepMounted={false}
        slotProps={{
          paper: {
            sx: {
              width: 260,
              maxHeight: '85vh',
              mt: 1.5,
              overflow: 'hidden',
              boxShadow: theme.customShadows.z16,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
              bgcolor: theme.palette.background.paper,
              zIndex: 1300,
            },
          },
        }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            [`& .${menuItemClasses.root}`]: {
              px: 1.5,
              py: 1,
              gap: 1.5,
              borderRadius: 1,
              minHeight: 44,
              [`&.${menuItemClasses.selected}`]: {
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
              '&:hover': {
                bgcolor: 'action.hover',
              },
            },
          }}
        >
          {/* Websites Section */}
          {/* Filter out social media platforms: LinkedIn, Reddit, Quora, X (Twitter), Instagram, Facebook */}
          {(stores?.stores?.filter(store => !['linkedin', 'reddit', 'quora', 'x', 'instagram', 'facebook', 'twitter'].includes(store.category?.toLowerCase() || '')) || []).length > 0 && (
            <>
              <Box sx={{ px: 2, py: 1, bgcolor: 'grey.50' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  🌐 WEBSITES
                </Typography>
              </Box>
              {stores?.stores
                ?.filter(store => !['linkedin', 'reddit', 'quora', 'x', 'instagram', 'facebook', 'twitter'].includes(store.category?.toLowerCase() || ''))
                .map((store) => (
                <MenuItem
                  key={store.id}
                  selected={store.id === currentStore.id}
                  onClick={() => handleChangeWorkspace(store)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, maxWidth: '75%' }}>
                    {renderAvatar(getStoreDisplayName(store), store.avatar || store.logo || '', store.category)}
                    <Box component="span" sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                        {getStoreDisplayName(store)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Direct disconnect switch */}
                  <Switch
                    size="small"
                    checked={store.is_active}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (store.is_active) {
                        setConfirmDialog({
                          open: true,
                          action: 'disconnect',
                          store
                        });
                      } else {
                        setConfirmDialog({
                          open: true,
                          action: 'reconnect',
                          store
                        });
                      }
                    }}
                    color="success"
                    disabled={isReconnecting || isDisconnecting}
                  />
                </MenuItem>
              ))}
            </>
          )}

          {/* Social Media Section */}
          {(stores?.stores?.filter(store => ['linkedin', 'reddit', 'quora', 'x', 'instagram', 'facebook', 'twitter'].includes(store.category?.toLowerCase() || '')) || []).length > 0 && (
            <>
              <Box sx={{ px: 2, py: 1, bgcolor: 'grey.50', mt: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  📱 SOCIAL MEDIA
                </Typography>
              </Box>
              {stores?.stores
                ?.filter(store => ['linkedin', 'reddit', 'quora', 'x', 'instagram', 'facebook', 'twitter'].includes(store.category?.toLowerCase() || ''))
                .map((store) => (
                <MenuItem
                  key={store.id}
                  selected={store.id === currentStore.id}
                  onClick={() => handleChangeWorkspace(store)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, maxWidth: '75%' }}>
                    {renderAvatar(getStoreDisplayName(store), store.avatar || store.logo || '', store.category)}
                    <Box component="span" sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                        {getStoreDisplayName(store)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Direct disconnect switch */}
                  <Switch
                    size="small"
                    checked={store.is_active}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (store.is_active) {
                        setConfirmDialog({
                          open: true,
                          action: 'disconnect',
                          store
                        });
                      } else {
                        setConfirmDialog({
                          open: true,
                          action: 'reconnect',
                          store
                        });
                      }
                    }}
                    color="success"
                    disabled={isReconnecting || isDisconnecting}
                  />
                </MenuItem>
              ))}
            </>
          )}

          <Divider sx={{ my: 0.5 }} />

          <Box sx={{ p: 0.5 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleAddNewWebsite}
              sx={{
                py: 1,
                borderStyle: 'dashed',
                borderColor: 'rgba(79, 70, 229, 0.4)',
                color: 'rgba(79, 70, 229, 0.7)',
                bgcolor: 'rgba(79, 70, 229, 0.02)',
                '&:hover': {
                  borderStyle: 'solid',
                  borderColor: 'rgba(79, 70, 229, 0.6)',
                  backgroundColor: 'rgba(79, 70, 229, 0.08)',
                  color: 'primary.main',
                },
              }}
            >
              Add New Website
            </Button>
          </Box>
        </MenuList>
      </Popover>



      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCancelAction}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {confirmDialog.action === 'reconnect' ? 'Reconnect Website' : 'Disconnect Website'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.action === 'reconnect'
              ? `Are you sure you want to reconnect "${confirmDialog.store?.name}"? This will enable all publishing features for this website.`
              : `Are you sure you want to disconnect "${confirmDialog.store?.name}"? This will disable publishing features but keep the connection intact.`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAction}>Cancel</Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color={confirmDialog.action === 'reconnect' ? 'success' : 'warning'}
            disabled={isReconnecting || isDisconnecting}
            startIcon={
              (isReconnecting || isDisconnecting) ? <CircularProgress size={16} /> : null
            }
          >
            {(isReconnecting || isDisconnecting)
              ? (confirmDialog.action === 'reconnect' ? 'Reconnecting...' : 'Disconnecting...')
              : (confirmDialog.action === 'reconnect' ? 'Reconnect' : 'Disconnect')
            }
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}