import type { IconButtonProps } from '@mui/material/IconButton';

import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useRouter, usePathname } from 'src/routes/hooks';

import { _myAccount } from 'src/_mock';
import { logout } from 'src/services/slices/userSlice';
import { clearCredentials } from 'src/services/slices/auth/authSlice';

// ----------------------------------------------------------------------

export type AccountPopoverProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountPopover({ data = [], sx, ...other }: AccountPopoverProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { enqueueSnackbar } = useSnackbar();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleClickItem = useCallback(
    (path: string) => {
      handleClosePopover();
      router.push(path);
    },
    [handleClosePopover, router]
  );

  const handleLogOut = useCallback(() => {
    // Close the popover first
    handleClosePopover();
    
    // Clear user data from Redux store
    dispatch(logout());
    
    // Clear authentication credentials
    dispatch(clearCredentials());
    
    // Show success notification
    enqueueSnackbar('You have been successfully logged out', {
      variant: 'success',
      anchorOrigin: { vertical: 'top', horizontal: 'center' },
    });
    
    // Redirect to sign-in page
    router.push('/sign-in');
    
    // Optional: Clear any local storage items if needed
    localStorage.removeItem('auth');
    sessionStorage.removeItem('access_token');
    
  }, [dispatch, router, handleClosePopover, enqueueSnackbar]);

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          p: 0,
          width: 40,
          height: 40,
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: (theme) => theme.palette.background.paper,
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${alpha(theme.palette.primary.main, 0.3)}`,
          '&:hover': {
            transform: 'rotate(10deg)',
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${theme.palette.primary.main}`,
          },
          ...sx,
        }}
        {...other}
      >
        <Avatar 
          src={_myAccount.photoURL} 
          alt={_myAccount.displayName} 
          sx={{ 
            width: 40, 
            height: 40,
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {_myAccount.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { 
              width: 300,
              overflow: 'hidden',
              mt: 1.5,
              boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              borderRadius: 3,
              border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
            },
          },
        }}
      >
        <Box 
          sx={{ 
            position: 'relative',
            pt: 8,
            pb: 3,
            px: 3,
            textAlign: 'center',
            bgcolor: (theme) => alpha(theme.palette.primary.lighter, 0.5),
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
              zIndex: 0,
            }
          }}
        >
          <Avatar 
            src={_myAccount.photoURL} 
            alt={_myAccount.displayName} 
            sx={{ 
              width: 80, 
              height: 80,
              mx: 'auto',
              position: 'relative',
              zIndex: 1,
              border: (theme) => `4px solid ${theme.palette.background.paper}`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          >
            {_myAccount.displayName.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box sx={{ position: 'relative', zIndex: 1, mt: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {_myAccount?.displayName}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {_myAccount?.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2 }}>
          <MenuList
            disablePadding
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1,
            }}
          >
            {data.map((option) => (
              <MenuItem
                key={option.label}
                selected={option.href === pathname}
                onClick={() => handleClickItem(option.href)}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  height: 80,
                  transition: 'all 0.2s ease',
                  color: 'text.secondary',
                  '&:hover': { 
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                  },
                  '&.Mui-selected': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                    }
                  }
                }}
              >
                {option.icon && (
                  <Box sx={{ 
                    mb: 1,
                    color: option.href === pathname ? 'primary.main' : 'text.secondary',
                    '& svg': { width: 24, height: 24 }
                  }}>
                    {option.icon}
                  </Box>
                )}
                <Typography variant="body2" fontWeight="medium">
                  {option.label}
                </Typography>
              </MenuItem>
            ))}
          </MenuList>
        </Box>

        <Box 
          sx={{ 
            p: 2, 
            pt: 0,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Button 
            color="error" 
            onClick={handleLogOut}
            startIcon={<Box component="span" sx={{ display: 'flex', '& svg': { width: 16, height: 16 } }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </Box>}
            sx={{
              borderRadius: 6,
              py: 1,
              px: 2.5,
              fontWeight: 'medium',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  );
}
