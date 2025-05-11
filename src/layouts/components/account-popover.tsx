import type { IconButtonProps } from '@mui/material/IconButton';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';
import { useThemeMode } from 'src/hooks/useThemeMode';

import { _myAccount } from 'src/_mock';
import { logout } from 'src/services/slices/auth/authSlice';
import { selectAuthUser } from 'src/services/slices/auth/selectors';
import { selectSubscriptionDetails } from 'src/services/slices/subscription/subscriptionSlice';

import { Iconify } from 'src/components/iconify';

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
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeMode();

  const user = useSelector(selectAuthUser);
  const subscriptionDetails = useSelector(selectSubscriptionDetails);

  // Simple state for popover
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Simple open handler
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Simple close handler
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle menu item click
  const handleClickItem = (path: string) => {
    handleClose();
    setTimeout(() => {
      router.push(path);
    }, 100);
  };

  // Handle logout
  const handleLogOut = () => {
    handleClose();
    setTimeout(() => {
      dispatch(logout());
      router.push('/sign-in');
      localStorage.removeItem('auth');
      sessionStorage.removeItem('access_token');
    }, 100);
  };

  // Handle theme toggle
  const handleToggleTheme = () => {
    toggleTheme();
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          width: 40,
          height: 40,
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          ...sx,
        }}
        {...other}
      >
        <Avatar
          src={user?.avatar || _myAccount.photoURL}
          alt={_myAccount.displayName}
          sx={{
            width: 40,
            height: 40,
          }}
        >
          {_myAccount.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 240,
            maxHeight: '85vh',
            mt: 1.5,
            overflow: 'hidden',
            boxShadow: theme.customShadows.z16,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
            bgcolor: theme.palette.background.paper,
          },
        }}
      >
        {/* User Info Section */}
        <Box
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar
              src={user?.avatar || _myAccount.photoURL}
              alt={_myAccount.displayName}
              sx={{ width: 36, height: 36, mr: 1.5 }}
            >
              {_myAccount.displayName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" noWrap>
                {user?.name || _myAccount?.displayName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                {user?.email || _myAccount?.email}
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: theme.palette.text.secondary,
              fontWeight: 'medium'
            }}
          >
            {subscriptionDetails?.subscription_name || 'Free'}
          </Typography>
        </Box>

        {/* Menu Items */}
        <MenuList disablePadding>
          <MenuItem
            onClick={() => handleClickItem('/profile')}
            sx={{
              py: 1.5,
              px: 2.5,
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify
                icon="mdi:account-outline"
                sx={{
                  width: 20,
                  height: 20,
                  mr: 1,
                  color: 'text.secondary'
                }}
              />
              <Typography variant="body2">Profile</Typography>
            </Box>
          </MenuItem>

          <MenuItem
            onClick={() => handleClickItem('/settings')}
            sx={{
              py: 1.5,
              px: 2.5,
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify
                icon="mdi:settings-outline"
                sx={{
                  width: 20,
                  height: 20,
                  mr: 1,
                  color: 'text.secondary'
                }}
              />
              <Typography variant="body2">Settings</Typography>
            </Box>
          </MenuItem>

          <MenuItem
            onClick={() => handleClickItem('/stores')}
            sx={{
              py: 1.5,
              px: 2.5,
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify
                icon="mdi:storefront-outline"
                sx={{
                  width: 20,
                  height: 20,
                  mr: 1,
                  color: 'text.secondary'
                }}
              />
              <Typography variant="body2">My websites</Typography>
            </Box>
          </MenuItem>

          <MenuItem
            onClick={handleLogOut}
            sx={{
              py: 1.5,
              px: 2.5,
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify
                icon="mdi:logout"
                sx={{
                  width: 20,
                  height: 20,
                  mr: 1,
                  color: 'text.secondary'
                }}
              />
              <Typography variant="body2">Sign Out</Typography>
            </Box>
          </MenuItem>
        </MenuList>

        <Divider sx={{ my: 0.5 }} />

        {/* Preferences Section */}
        <Box sx={{ px: 2.5, pt: 1.5, pb: 1 }}>
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              color: 'text.secondary',
              fontWeight: 'medium',
              fontSize: '0.75rem',
              mb: 1
            }}
          >
            Preferences
          </Typography>
        </Box>

        {/* Theme Toggle */}
        <Box
          sx={{
            px: 2.5,
            pb: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="body2">Theme</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={handleToggleTheme}
              sx={{
                p: 0.5,
                color: !isDarkMode ? theme.palette.primary.main : 'text.secondary',
                bgcolor: !isDarkMode ? alpha(theme.palette.primary.main, 0.08) : 'transparent'
              }}
            >
              <Iconify icon="mdi:desktop-mac" width={18} height={18} />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleToggleTheme}
              sx={{
                p: 0.5,
                color: !isDarkMode ? 'text.secondary' : theme.palette.primary.main,
                bgcolor: !isDarkMode ? 'transparent' : alpha(theme.palette.primary.main, 0.08)
              }}
            >
              <Iconify icon="mdi:weather-sunny" width={18} height={18} />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleToggleTheme}
              sx={{
                p: 0.5,
                color: isDarkMode ? theme.palette.primary.main : 'text.secondary',
                bgcolor: isDarkMode ? alpha(theme.palette.primary.main, 0.08) : 'transparent'
              }}
            >
              <Iconify icon="mdi:weather-night" width={18} height={18} />
            </IconButton>
          </Box>
        </Box>

        {/* Upgrade Plan Button */}
        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => handleClickItem('/pricing')}
            sx={{
              py: 1,
              borderRadius: 1,
              fontWeight: 'medium',
              textTransform: 'none'
            }}
          >
            Upgrade Plan
          </Button>
        </Box>
      </Popover>
    </>
  );
}
