import type { Store } from 'src/types/store';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import ButtonBase from '@mui/material/ButtonBase';
import { alpha, useTheme } from '@mui/material/styles';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useGetStoresQuery } from 'src/services/apis/storesApi';
import { setCurrentStore } from 'src/services/slices/stores/storeSlice';
import { selectCurrentStore } from 'src/services/slices/stores/selectors';

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
  const navigate = useNavigate();
  const currentStore = useSelector(selectCurrentStore);
  const theme = useTheme();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleChangeWorkspace = useCallback(
    (newStore: Store) => {
      dispatch(setCurrentStore(newStore));
      handleClosePopover();
    },
    [dispatch, handleClosePopover]
  );

  const handleAddNewWebsite = useCallback(() => {
    navigate('/stores/add');
    handleClosePopover();
  }, [navigate, handleClosePopover]);

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

  if (isLoading || !currentStore) {
    return null; // Or a loading state
  }

  console.log(currentStore);
  

  return (
    <>
      <ButtonBase
        disableRipple
        onClick={handleOpenPopover}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 1,
          p: 2,
          borderRadius: 2,
          transition: 'all 0.2s ease-in-out',
          background: currentStore.isConnected
            ? alpha(theme.palette.success.main, 0.08)
            : alpha(theme.palette.error.main, 0.08),
          border: '1px solid',
          borderColor: currentStore.isConnected
            ? alpha(theme.palette.success.main, 0.2)
            : alpha(theme.palette.error.main, 0.2),
          textAlign: 'left',
          minHeight: 64,
          ...sx,
        }}
        {...other}
      >
        {/* Left: Store name + Platform + Status */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, overflow: 'hidden' }}>
          {/* Store Name */}
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {currentStore.name}
          </Typography>

          {/* Second row with Platform Badge and Connection Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Platform Badge */}
            {currentStore.platform && (
              <Typography
                component="span"
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  backgroundColor: 'action.selected',
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {getPlatformDisplayName(currentStore.platform)}
              </Typography>
            )}

            {/* Connection Status */}
            <Typography
              variant="caption"
              noWrap
              sx={{
                color: currentStore.isConnected
                  ? theme.palette.success.main
                  : theme.palette.error.main,
                fontWeight: 600,
              }}
            >
              {currentStore.isConnected ? 'Connected' : 'Disconnected'}
            </Typography>
          </Box>
        </Box>

        {/* Right Chevron */}
        <Iconify
          icon="eva:chevron-down-fill"
          width={18}
          sx={{ color: 'text.secondary' }}
        />
      </ButtonBase>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 260,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              p: 1.5,
              gap: 1.5,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: {
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
            },
          }}
        >
          {stores?.stores.map((store) => (
            <MenuItem
              key={store.id}
              selected={store.id === currentStore.id}
              onClick={() => handleChangeWorkspace(store)}
            >
              {renderAvatar(store.name, store.logo, store.platform)}
              <Box component="span" sx={{ flexGrow: 1 }}>
                {store.name}
              </Box>
            </MenuItem>
          ))}

          {/* Divider */}
          <Divider sx={{ my: 1 }} />

          {/* Add New Website Button */}
          <Box sx={{ p: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleAddNewWebsite}
              sx={{
                borderStyle: 'dashed',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderStyle: 'solid',
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              Add New Website
            </Button>
          </Box>
        </MenuList>
      </Popover>
    </>
  );
}
