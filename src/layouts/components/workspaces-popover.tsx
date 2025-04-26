import type { Store } from 'src/types/store';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { selectStores } from 'src/services/slices/stores/selectors';
import { setCurrentStore } from 'src/services/slices/stores/storeSlice';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type WorkspacesPopoverProps = ButtonBaseProps & {
  data?: {
    id: string;
    name: string;
    logo: string;
    plan: string;
  }[];
};

export function WorkspacesPopover({ data = [], sx, ...other }: WorkspacesPopoverProps) {
  const dispatch = useDispatch();
  const stores = useSelector(selectStores);
  const [workspace, setWorkspace] = useState(stores[0]);
  const theme = useTheme()

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleChangeWorkspace = useCallback(
    (newStore: Store) => {
      setWorkspace(newStore);
      dispatch(setCurrentStore(newStore));
      handleClosePopover();
    },
    [dispatch, handleClosePopover]
  );

  const renderAvatar = (alt: string, src: string) => (
    <Box component="img" alt={alt} src={src} sx={{ width: 24, height: 24, borderRadius: '50%' }} />
  );

  return (
    <>
      <ButtonBase
        disableRipple
        onClick={handleOpenPopover}
        sx={{
          pl: 2,
          py: 3,
          gap: 1.5,
          pr: 1.5,
          width: 1,
          borderRadius: 1.5,
          textAlign: 'center',
          justifyContent: 'flex-start', // Changed from 'center' to 'flex-start'
          color : 'white',
          background: `linear-gradient(to left, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          ...sx,
        }}
        {...other}
      >
        {renderAvatar(workspace?.name, workspace?.logo)}

        <Box
          flexGrow={1}
          display="flex"
          alignItems="center"
          sx={{ 
            typography: 'body2', 
            fontWeight: 'fontWeightSemiBold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 'calc(100% - 50px)' // Ensure text doesn't overflow
          }}
        >
          {workspace?.name}
        </Box>

        <Iconify width={16} icon="carbon:chevron-sort" />
      </ButtonBase>

      <Popover open={!!openPopover} anchorEl={openPopover} onClose={handleClosePopover}>
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
          {stores.map((store) => (
            <MenuItem
              key={store.id}
              selected={store.id === workspace?.id}
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
