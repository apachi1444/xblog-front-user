
// Third-party imports
import { useTranslation } from 'react-i18next';
// React imports
import { memo, useMemo, useState, useCallback } from 'react';

// MUI components
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import { useMediaQuery } from '@mui/material';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

// Custom hooks
import { useThemeMode } from 'src/hooks/useThemeMode';

// Redux and API
import { useGetStoresQuery } from 'src/services/apis/storesApi';

// Components
import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { CompactResourceDisplay } from 'src/components/resource-usage';
import { RegenerateCountDisplay } from 'src/components/regenerate/RegenerateCountDisplay';
import { RewardsButton } from 'src/components/rewards';

// Local components
import { NavMobile } from './nav';
import { AccountPopover } from '../components/account-popover';
import { ComingSoonPopover } from '../components/coming-soon-popover';
import { navData, primaryCTA, bottomNavData } from '../config-nav-dashboard';

// ----------------------------------------------------------------------

// Extracted styles for reuse
const HEADER_HEIGHT = 64;

// Extracted ResourceDisplays component for better organization and memoization
const ResourceDisplays = memo(() => (
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
));

// Extracted ThemeToggle component with memoization
const ThemeToggle = memo(({ isDarkMode, onToggle }: { isDarkMode: boolean; onToggle: () => void }) => (
  <IconButton
    onClick={onToggle}
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
));

export function TopHeader() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useThemeMode();
  const [openNav, setOpenNav] = useState(false);

  // Fetch stores data for the workspaces popover
  const { data: storesData } = useGetStoresQuery();

  // Transform stores data for the workspaces popover - memoized to prevent unnecessary recalculations
  const workspaces = useMemo(() =>
    storesData?.stores.map(store => ({
      id: store.id,
      name: store.name,
      logo: store.logo || `/assets/icons/workspaces/logo-1.webp`,
      plan: 'Free',
    })) || [],
    [storesData]
  );

  // Check if screen is mobile size
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  // Memoized event handlers to prevent unnecessary re-renders
  const handleToggleTheme = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const handleOpenNav = useCallback(() => {
    setOpenNav(true);
  }, []);

  const handleCloseNav = useCallback(() => {
    setOpenNav(false);
  }, []);

  // Memoize account menu items to prevent unnecessary re-renders
  const accountMenuItems = useMemo(() => [
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
  ], []);

  // Memoize navigation handler
  const handleNavigateToNewStore = useCallback(() => {
    window.location.href = '/stores/new';
  }, []);

  // Memoize empty stores action to prevent unnecessary re-renders
  const emptyStoresAction = useMemo(() =>
    workspaces.length === 0 ? (
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Iconify icon="solar:add-circle-bold" />}
          onClick={handleNavigateToNewStore}
          sx={{
            py: 2,
            my: 2,
            borderRadius: 1,
            borderColor: 'rgba(79, 70, 229, 0.3)',
            color: 'rgba(79, 70, 229, 0.8)',
            bgcolor: 'rgba(79, 70, 229, 0.02)',
            boxShadow: 'none',
            '&:hover': {
              borderColor: 'rgba(79, 70, 229, 0.5)',
              bgcolor: 'rgba(79, 70, 229, 0.08)',
              color: 'primary.main',
            }
          }}
        >
          {t('websites.addNew', 'Add New Website')}
        </Button>
      </Box>
    ) : undefined,
    [workspaces.length, t, handleNavigateToNewStore]
  );

  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        sx={{
          boxShadow: 'none',
          height: HEADER_HEIGHT,
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
            minHeight: HEADER_HEIGHT,
            height: HEADER_HEIGHT,
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
              {/* Use the extracted ResourceDisplays component */}
              <ResourceDisplays />

              {/* Rewards Button */}
              <RewardsButton />

              {/* Coming Soon Features Popover */}
              <ComingSoonPopover />

              {/* Use the extracted ThemeToggle component */}
              <ThemeToggle isDarkMode={isDarkMode} onToggle={handleToggleTheme} />

              {/* Account menu */}
              <AccountPopover
                data={accountMenuItems}
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
        primaryCTA={primaryCTA}
        bottomNavData={bottomNavData}
        workspaces={workspaces}
        emptyStoresAction={emptyStoresAction}
      />
    </>
  );
}
