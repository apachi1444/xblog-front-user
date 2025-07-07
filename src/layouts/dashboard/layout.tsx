import type { RootState } from 'src/services/store';
import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

import { useWelcomePopup } from 'src/hooks/useWelcomePopup';

import { useGetStoresQuery } from 'src/services/apis/storesApi';
import { setCurrentStore } from 'src/services/slices/stores/storeSlice';
import { useGetSubscriptionDetailsQuery } from 'src/services/apis/subscriptionApi';
import { setSubscriptionDetails} from 'src/services/slices/subscription/subscriptionSlice';

import { Iconify } from 'src/components/iconify';
import { WelcomeVideoPopup } from 'src/components/welcome/WelcomeVideoPopup';

import { Main } from './main';
import { NavDesktop } from './nav';
import { TopHeader } from './top-header';
import { layoutClasses } from '../classes';
import { LayoutSection } from '../core/layout-section';
import { navData, bottomNavData } from '../config-nav-dashboard';

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

  const currentStore = useSelector((state: RootState) => state.stores.currentStore);

  const { data: subscriptionData, error: subscriptionError } = useGetSubscriptionDetailsQuery(undefined, {
    // Don't refetch on mount - use cached data
    refetchOnMountOrArgChange: false,
  });

  const { data: storesData, error: storesError } = useGetStoresQuery();

  const storesCount = storesData?.count ?? 0

  // Get sidebar collapsed state from localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });

  // Listen for sidebar collapse state changes
  useEffect(() => {
    const handleSidebarCollapsedChange = (event: CustomEvent<{isCollapsed: boolean}>) => {
      setIsSidebarCollapsed(event.detail.isCollapsed);
    };

    window.addEventListener('sidebarCollapsedChange', handleSidebarCollapsedChange as EventListener);

    // Also listen for storage events (for cross-tab synchronization)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'sidebarCollapsed') {
        const newValue = event.newValue ? JSON.parse(event.newValue) : false;
        setIsSidebarCollapsed(newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('sidebarCollapsedChange', handleSidebarCollapsedChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
      // Only auto-select the first store if:
      // 1. There are stores available
      // 2. No store is currently selected
      // 3. The stored store from localStorage doesn't exist in the current stores list
      if (storesData.stores.length > 0 && !currentStore) {
        dispatch(setCurrentStore(storesData.stores[0]));
      } else if (currentStore && storesData.stores.length > 0) {
        // Validate that the current store still exists in the stores list
        const storeExists = storesData.stores.some(store => store.id === currentStore.id);
        if (!storeExists) {
          // If the current store no longer exists, select the first available store
          dispatch(setCurrentStore(storesData.stores[0]));
        } else {
          // Update the current store data with fresh data from the API
          const updatedStore = storesData.stores.find(store => store.id === currentStore.id);
          if (updatedStore && JSON.stringify(updatedStore) !== JSON.stringify(currentStore)) {
            dispatch(setCurrentStore(updatedStore));
          }
        }
      }
    }

    if (storesError) {
      toast.error(t('errors.stores.fetch', 'Failed to fetch stores data'));
    }
  }, [storesData, storesError, dispatch, t, currentStore]);

  const layoutQuery: Breakpoint = 'lg';

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

  // Use the welcome popup hook (which now uses the context)
  const { showPopup, closePopup } = useWelcomePopup();

  return (
    <>
      {/* Top header with profile, notifications, etc. */}
      <TopHeader />

      {/* Welcome Video Popup */}
      <WelcomeVideoPopup
        open={showPopup}
        onClose={closePopup}
      />

      <LayoutSection
        /** **************************************
         * Header
         *************************************** */
        headerSection={null}
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
        '--layout-nav-vertical-width': '240px',
        '--layout-nav-vertical-width-collapsed': '64px',
        '--layout-dashboard-content-pt': theme.spacing(2), // Reduced top padding
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: isSidebarCollapsed ? 'var(--layout-nav-vertical-width-collapsed)' : 'var(--layout-nav-vertical-width)',
            transition: theme.transitions.create(['padding-left'], {
              duration: theme.transitions.duration.standard,
            }),
          },
        },
        ...sx,
      }}
    >
      <Main sx={{bgcolor : `${theme.palette.background.paper}`}}>{children}</Main>
    </LayoutSection>
    </>
  );
}
