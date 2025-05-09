import type { RootState } from 'src/services/store';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import { useMediaQuery } from '@mui/material';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

import { setThemeMode } from 'src/services/slices/globalSlice';
import { useGetStoresQuery } from 'src/services/apis/storesApi';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { CompactResourceDisplay } from 'src/components/resource-usage';
import { RegenerateCountDisplay } from 'src/components/regenerate/RegenerateCountDisplay';

import { NavMobile } from './nav';
import { AccountPopover } from '../components/account-popover';
import { navData, bottomNavData } from '../config-nav-dashboard';

// ----------------------------------------------------------------------

export function TopHeader() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isDarkMode = useSelector((state: RootState) => state.global.isDarkMode);
  const [openNav, setOpenNav] = useState(false);

  // Fetch stores data for the workspaces popover
  const { data: storesData } = useGetStoresQuery();

  // Transform stores data for the workspaces popover
  const workspaces = storesData?.stores.map(store => ({
    id: store.id,
    name: store.name,
    logo: store.logo || `/assets/icons/workspaces/logo-1.webp`,
    plan: 'Free',
  })) || [];

  // Check if screen is mobile size
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const handleToggleTheme = () => {
    dispatch(setThemeMode());
  };

  const handleOpenNav = () => {
    setOpenNav(true);
  };

  const handleCloseNav = () => {
    setOpenNav(false);
  };

  return (
    <>
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
            {/* Left side with burger menu on mobile and logo */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 2,
              pl: 0
            }}>
              {/* Burger menu icon - only visible on mobile */}
              {isMobile && (
                <IconButton
                  onClick={handleOpenNav}
                  sx={{
                    mr: 1,
                    color: 'text.primary',
                    display: { lg: 'none' }
                  }}
                >
                  <Iconify icon="eva:menu-2-fill" width={24} height={24} />
                </IconButton>
              )}

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
              {/* Resource usage displays - hide on small screens */}
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  gap: 1.5,
                  alignItems: 'center'
                }}
              >
                <CompactResourceDisplay type="articles" />
                <CompactResourceDisplay type="websites" />
                <RegenerateCountDisplay />
              </Box>

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

      {/* Mobile Navigation Drawer */}
      <NavMobile
        open={openNav}
        onClose={handleCloseNav}
        data={navData}
        bottomNavData={bottomNavData}
        workspaces={workspaces}
        emptyStoresAction={
          workspaces.length === 0 ? (
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="solar:add-circle-bold" />}
                onClick={() => {window.location.href = '/stores/new'}}
                sx={{
                  py: 2,
                  my: 2,
                  borderRadius: 1,
                  boxShadow: theme.shadows[3],
                }}
              >
                {t('websites.addNew', 'Add New Website')}
              </Button>
            </Box>
          ) : undefined
        }
      />
    </>
  );
}
