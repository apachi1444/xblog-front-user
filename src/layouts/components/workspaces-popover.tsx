import type { Store } from 'src/types/store';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
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
  const dispatch = useDispatch();
  const { data: stores, isLoading } = useGetStoresQuery();
  
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

  const renderAvatar = (alt: string, src: string) => (
    <Box 
      component="img" 
      alt={alt} 
      src={src} 
      sx={{ width: 24, height: 24, borderRadius: '50%' }} 
    />
  );

  const getPlatformDisplayName = (platform: string | undefined) => {
    if (!platform) return '';
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  if (isLoading || !currentStore) {
    return null; // Or a loading state
  }

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
              {renderAvatar(store.name, store.logo)}
              <Box component="span" sx={{ flexGrow: 1 }}>
                {store.name}
              </Box>
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
}
