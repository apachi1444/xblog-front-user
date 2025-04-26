import type { RootState } from 'src/services/store';
import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useStoreDependentData } from 'src/hooks/useStoreDependentData';

import { _langs, _notifications } from 'src/_mock';
import { setThemeMode } from 'src/services/slices/globalSlice';
import { getStores } from 'src/services/slices/stores/storeSlice';
import { useLazyGetStoresQuery } from 'src/services/apis/storesApi';
import { setSubscriptionDetails } from 'src/services/slices/auth/authSlice';
import { useLazyGetSubscriptionDetailsQuery } from 'src/services/apis/subscriptionApi';

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
  useStoreDependentData();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const isDarkMode = useSelector((state: RootState) => state.global);
  
  const [doGetStores] = useLazyGetStoresQuery();
  
  const storesData = useSelector((state: RootState) => state.stores);  
  
  const [doGetSubscriptionDetails] = useLazyGetSubscriptionDetailsQuery();

  // Fetch stores data when component mounts
  useEffect(() => {
    const fetchStoresData = async () => {
      try {
        const result = await doGetStores().unwrap();
        dispatch(getStores(result.stores));
      } catch (error) {
        dispatch(getStores(error.stores));
      }
    };
    
    fetchStoresData();
  }, [doGetStores, dispatch]);

  useEffect(() => {
    const fetchUserSubscriptionDetails = async () => {
      try {
        const result = await doGetSubscriptionDetails().unwrap();
        dispatch(setSubscriptionDetails(result));
      } catch (error) {
        console.log(error);
        dispatch(setSubscriptionDetails(error));
      }
    };
    
    fetchUserSubscriptionDetails();
  }, [doGetSubscriptionDetails, dispatch]);
  
  const [navOpen, setNavOpen] = useState(false);

  const layoutQuery: Breakpoint = 'lg';
  
  // Handle theme mode toggle
  const handleToggleTheme = () => {
    dispatch(setThemeMode());
  };

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
        plan: 'Free',
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
              sx: { 
                px: { [layoutQuery]: 5 }, 
                backgroundColor: `${theme.palette.secondary.lighter}`, 
                borderRadius: 40, 
                marginTop: 3,
                marginX: 10, 
                paddingY: 2 
              },
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton 
                  onClick={handleToggleTheme}
                  sx={{
                    width: 40,
                    height: 40,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { 
                      bgcolor: (themee) => themee.palette.action.hover,
                    },
                  }}
                >
                  <Iconify 
                    icon={isDarkMode ? 'material-symbols:light-mode' : 'material-symbols:dark-mode'} 
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
                      icon: <Iconify width={22} icon="material-symbols:home-outline-rounded" />,
                    },
                    {
                      label: 'Profile',
                      href: '/profile',
                      icon: <Iconify width={22} icon="material-symbols:supervised-user-circle-outline" />,
                    },
                    {
                      label: 'Settings',
                      href: '/settings',
                      icon: <Iconify width={22} icon="material-symbols:settings-outline" />,
                    },
                    {
                      label: 'My websites',
                      href: '/stores',
                      icon: <Iconify width={22} icon="material-symbols:storefront-outline-sharp" />,
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
              <Box>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="solar:add-circle-bold" />}
                  onClick={handleAddNewWebsite}
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
      <Main sx={{bgcolor : `${theme.palette.background.paper}`}}>{children}</Main>
    </LayoutSection>
  );
}
