import type { RootState } from 'src/services/store';
import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { _langs, _notifications } from 'src/_mock';
import { setThemeMode } from 'src/services/slices/globalSlice';
import { getStores } from 'src/services/slices/stores/storeSlice';
import { setCredentials } from 'src/services/slices/auth/authSlice';
import { useLazyGetStoresQuery } from 'src/services/apis/storesApi';
import { useLazyGetCurrentUserQuery } from 'src/services/apis/userApi';
import { toggleDarkMode } from 'src/services/slices/userDashboardSlice';

import { Iconify } from 'src/components/iconify';

import { Main } from './main';
import { layoutClasses } from '../classes';
import { NavMobile, NavDesktop } from './nav';
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
  const navigate = useNavigate();
  
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Get dark mode preference from Redux store
  const isDarkMode = useSelector((state: RootState) => state.userDashboard.preferences.darkMode);
  
  // Use lazy queries for more control
  const [getCurrentUser] = useLazyGetCurrentUserQuery();
  const [doGetStores] = useLazyGetStoresQuery();
  
  // State for stores data
  const [storesData, setStoresData] = useState<{ count: number, stores: any[] }>({ count: 0, stores: [] });
  
  // Fetch user data when component mounts or token changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userData = await getCurrentUser().unwrap();
          dispatch(setCredentials({accessToken, user: userData}));
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };
    
    fetchUserData();
  }, [accessToken, user, getCurrentUser, dispatch]);
  
  // Fetch stores data when component mounts
  useEffect(() => {
    const fetchStoresData = async () => {
      try {
        const result = await doGetStores().unwrap();
          setStoresData({ count: result.count, stores: result.stores });
          dispatch(getStores(result.stores));
        } catch (error) {
          console.error('Failed to fetch stores data:', error);
          setStoresData({ count: 0, stores: [] });
        }
    };
    
    fetchStoresData();
  }, [doGetStores, dispatch]);
  
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

  // Handle navigation to add new website
  const handleAddNewWebsite = () => {
    navigate('/stores/add');
  };

  // Create custom workspaces based on stores data
  const customWorkspaces = storesData.count > 0 
    ? storesData.stores.map(store => ({
        id: store.id,
        name: store.name,
        logo: store.logo || `/assets/icons/workspaces/logo-1.webp`,
        plan: store.plan || 'Free',
      }))
    : [];

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
                  workspaces={storesData.count > 0 ? customWorkspaces : []}
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
        <NavDesktop 
          data={navData} 
          layoutQuery={layoutQuery} 
          workspaces={storesData.count > 0 ? customWorkspaces : []} 
          bottomNavData={bottomNavData}
          emptyStoresAction={
            storesData.count === 0 ? (
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="solar:add-circle-bold" />}
                  onClick={handleAddNewWebsite}
                  sx={{
                    py: 1,
                    mt: 1,
                    borderRadius: 1,
                    boxShadow: theme.shadows[3],
                    '&:hover': {
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  Add New Website
                </Button>
              </Box>
            ) : undefined
          }
        />
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
