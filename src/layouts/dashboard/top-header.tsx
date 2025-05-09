import type { RootState } from 'src/services/store';

import { useSelector, useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

import { _notifications } from 'src/_mock';
import { setThemeMode } from 'src/services/slices/globalSlice';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { RegenerateCountDisplay } from 'src/components/regenerate/RegenerateCountDisplay';

import { AccountPopover } from '../components/account-popover';
import { NotificationsPopover } from '../components/notifications-popover';

// ----------------------------------------------------------------------

export function TopHeader() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.global.isDarkMode);

  const handleToggleTheme = () => {
    dispatch(setThemeMode());
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      sx={{
        boxShadow: 'none',
        height: 64, // Match the height of the logo container
        zIndex: theme.zIndex.drawer + 1, // Higher than the sidebar and main header
        width: '100%',
        left: 0,
        right: 0,
        top: 0,
        margin: 0,
        padding: 0,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.mode === 'dark'
          ? alpha(theme.palette.background.default, 0.95)
          : alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: 64,
          height: 64,
          px: 2,
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            height: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', // Space between logo and right elements
          }}
        >
          {/* Logo at the beginning of the header */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 2,
            pl: 0 
          }}>
            <Logo
              variant="full"
              sx={{
                height: 40,
                width: 'auto',
                maxHeight: '100%'
              }}
            />
          </Box>

          {/* Right side elements */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
            {/* Regeneration count display - using full version */}
            <RegenerateCountDisplay />

            {/* Notifications */}
            <NotificationsPopover
              data={_notifications}
              sx={{
                width: 32,
                height: 32,
                '& .MuiSvgIcon-root': {
                  width: 20,
                  height: 20,
                }
              }}
            />

            {/* Theme toggle */}
            <IconButton
              onClick={handleToggleTheme}
              sx={{
                p: 1,
                '&:hover': {
                  bgcolor: 'transparent',
                },
              }}
            >
              <Iconify
                icon={isDarkMode ? 'material-symbols:light-mode' : 'material-symbols:dark-mode'}
                width={24}
                height={24}
                sx={{
                  color: isDarkMode ? 'warning.main' : 'text.secondary',
                }}
              />
            </IconButton>

            {/* Account menu */}
            <AccountPopover
              data={[
                {
                  label: 'Home',
                  href: '/',
                  icon: <Iconify width={20} icon="material-symbols:home-outline-rounded" />,
                },
                {
                  label: 'Profile',
                  href: '/profile',
                  icon: <Iconify width={20} icon="material-symbols:supervised-user-circle-outline" />,
                },
                {
                  label: 'Settings',
                  href: '/settings',
                  icon: <Iconify width={20} icon="material-symbols:settings-outline" />,
                },
                {
                  label: 'My websites',
                  href: '/stores',
                  icon: <Iconify width={20} icon="material-symbols:storefront-outline-sharp" />,
                },
              ]}
              sx={{
                width: 32,
                height: 32,
                p: 0,
                '& .MuiAvatar-root': {
                  width: 28,
                  height: 28,
                }
              }}
            />
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
