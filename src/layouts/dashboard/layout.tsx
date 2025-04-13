import type { RootState } from 'src/services/store';
import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { _langs, _notifications } from 'src/_mock';
import { setThemeMode } from 'src/services/slices/globalSlice';
import { toggleDarkMode } from 'src/services/slices/userDashboardSlice';

import { Iconify } from 'src/components/iconify';

import { Main } from './main';
import { layoutClasses } from '../classes';
import { NavMobile, NavDesktop } from './nav';
import { _workspaces } from '../config-nav-workspace';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { AccountPopover } from '../components/account-popover';
import { navData, bottomNavData } from '../config-nav-dashboard';
import { LanguagePopover } from '../components/language-popover';
import { NotificationsPopover } from '../components/notifications-popover';

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({ sx, children, header }: DashboardLayoutProps) {
  const theme = useTheme();
  const dispatch = useDispatch();
  
  // Get dark mode preference from Redux store
  const isDarkMode = useSelector((state: RootState) => state.userDashboard.preferences.darkMode);
  
  const [navOpen, setNavOpen] = useState(false);

  const layoutQuery: Breakpoint = 'lg';
  
  // Handle theme mode toggle
  const handleToggleTheme = () => {
    dispatch(toggleDarkMode());
    dispatch(setThemeMode(isDarkMode ? 'light' : 'dark'));
  };
  
  // Sync theme mode with system on initial load
  useEffect(() => {
    dispatch(setThemeMode(isDarkMode ? 'dark' : 'light'));
  }, [dispatch, isDarkMode]);

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: {
              maxWidth: false,
              sx: { px: { [layoutQuery]: 5 }, backgroundColor: 'none' },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            // Update the leftArea in the HeaderSection to use the Logo component
            leftArea: (
              <>
                <MenuButton
                  onClick={() => setNavOpen(true)}
                  sx={{
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <NavMobile
                  bottomNavData={bottomNavData}
                  data={navData}
                  open={navOpen}
                  onClose={() => setNavOpen(false)}
                  workspaces={_workspaces}
                />
              </>
            ),
            rightArea: (
              <Box gap={1} display="flex" alignItems="center">
                <IconButton 
                  onClick={handleToggleTheme}
                  sx={{
                    width: 40,
                    height: 40,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { 
                      bgcolor: (themee) => theme.palette.action.hover,
                    },
                  }}
                >
                  <Iconify 
                    icon={isDarkMode ? 'solar:sun-bold-duotone' : 'solar:moon-bold-duotone'} 
                    width={24} 
                    height={24}
                    sx={{
                      color: isDarkMode ? 'warning.main' : 'text.primary',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  />
                </IconButton>
             
                <LanguagePopover data={_langs} />
                <NotificationsPopover data={_notifications} />
                <AccountPopover
                  data={[
                    {
                      label: 'Home',
                      href: '/',
                      icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
                    },
                    {
                      label: 'Profile',
                      href: '/profile',
                      icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
                    },
                    {
                      label: 'Settings',
                      href: '/settings',
                      icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
                    },
                    {
                      label: 'My websites',
                      href: '/stores',
                      icon: <Iconify width={22} icon="solar:cart-bold-duotone" />,
                    },
                  ]}
                />
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={
        <NavDesktop data={navData} layoutQuery={layoutQuery} workspaces={_workspaces} bottomNavData={bottomNavData}/>
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        '--layout-nav-vertical-width': '245px',
        '--layout-dashboard-content-pt': theme.spacing(5),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
