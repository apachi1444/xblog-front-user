import type { RootState } from 'src/services/store';
import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { _langs, _notifications } from 'src/_mock';
import { setThemeMode } from 'src/services/slices/globalSlice';
import { useGetStoresQuery } from 'src/services/apis/storesApi';
import { useGetSubscriptionDetailsQuery } from 'src/services/apis/subscriptionApi';
import { getStores, setCurrentStore } from 'src/services/slices/stores/storeSlice';
import { setSubscriptionDetails} from 'src/services/slices/subscription/subscriptionSlice';

import { Iconify } from 'src/components/iconify';
import { RegenerateCountDisplay } from 'src/components/regenerate/RegenerateCountDisplay';

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
  const { t } = useTranslation();

  const isDarkMode = useSelector((state: RootState) => state.global);
  const currentStore = useSelector((state: RootState) => state.stores.currentStore);

  const { data: subscriptionData, error: subscriptionError } = useGetSubscriptionDetailsQuery();

  const { data: storesData, error: storesError } = useGetStoresQuery();

  const storesCount = storesData?.count ?? 0

  useEffect(() => {
    if (subscriptionData) {
      dispatch(setSubscriptionDetails(subscriptionData));
    }
    if (subscriptionError) {
      toast.error(t('errors.subscription.fetch', 'Failed to fetch subscription details'));
    }
  }, [subscriptionData, subscriptionError, dispatch, t]);

  useEffect(() => {
    if (storesData?.stores) {
      dispatch(getStores(storesData.stores));

      if (storesData.stores.length > 0 &&
          (!currentStore || currentStore.id !== storesData.stores[0].id)) {
        setTimeout(() => {
          dispatch(setCurrentStore(storesData.stores[0]));
        }, 0);
      }
    }

    if (storesError) {
      toast.error(t('errors.stores.fetch', 'Failed to fetch stores data'));
    }
  }, [storesData, storesError, dispatch, t, currentStore]);

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
  const customWorkspaces = storesCount > 0
    ? storesData?.stores.map(store => ({
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
                  workspaces={storesCount > 0 ? customWorkspaces : []}
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

                <RegenerateCountDisplay />
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
          workspaces={storesCount > 0 ? customWorkspaces : []}
          bottomNavData={bottomNavData}
          emptyStoresAction={
            storesCount === 0 ? (
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
