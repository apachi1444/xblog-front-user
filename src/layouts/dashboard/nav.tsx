import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import { Divider } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { NavUpgrade } from '../components/nav-upgrade';
import { WorkspacesPopover } from '../components/workspaces-popover';

import type { WorkspacesPopoverProps } from '../components/workspaces-popover';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    path: string;
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
  }[];
  bottomNavData: {
    path: string;
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  workspaces: WorkspacesPopoverProps['data'];
  emptyStoresAction?: React.ReactNode;
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  bottomNavData,
  slots,
  workspaces,
  layoutQuery,
  emptyStoresAction,
}: NavContentProps & {
  layoutQuery: Breakpoint;
  emptyStoresAction?: React.ReactNode;
}) {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Listen for sidebar collapse state changes
  useEffect(() => {
    const handleStorageChange = (event: CustomEvent<{isCollapsed: boolean}>) => {
      setIsCollapsed(event.detail.isCollapsed);
    };

    window.addEventListener('sidebarCollapsedChange', handleStorageChange as EventListener);

    // Initialize from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setIsCollapsed(JSON.parse(savedState));
    }

    return () => {
      window.removeEventListener('sidebarCollapsedChange', handleStorageChange as EventListener);
    };
  }, []);

  return (
    <Box
      sx={{
        pt: 2,
        px: isCollapsed ? 0 : 2,
        top: 64, // Position below the top header
        left: 0,
        height: 'calc(100% - 64px)', // Adjust height to account for top header
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: (customTheme) => customTheme.palette.mode === 'dark' ? '#121212' : customTheme.palette.background.paper,
        zIndex: 'var(--layout-nav-zIndex)',
        width: isCollapsed ? 'var(--layout-nav-vertical-width-collapsed)' : 'var(--layout-nav-vertical-width)',
        transition: theme.transitions.create(['width', 'padding'], {
          duration: theme.transitions.duration.standard,
        }),
        borderRight: `2px solid ${theme.palette.divider}`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >

      <NavContent
        data={data}
        slots={slots}
        workspaces={workspaces}
        bottomNavData={bottomNavData}
        emptyStoresAction={emptyStoresAction}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  bottomNavData,
  open,
  slots,
  onClose,
  workspaces,
  emptyStoresAction,
}: NavContentProps & {
  open: boolean;
  onClose: () => void;
  emptyStoresAction?: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const theme = useTheme();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2,
          px: 2,
          overflow: 'unset',
          bgcolor: (customTheme) => customTheme.palette.mode === 'dark' ? '#121212' : customTheme.palette.background.paper,
          width: 'var(--layout-nav-mobile-width)',
          borderRight: `2px solid ${theme.palette.divider}`,
          top: 64, // Position below the top header
          height: 'calc(100% - 64px)', // Adjust height to account for top header
          ...sx,
        },
      }}
    >
      <NavContent
        data={data}
        slots={slots}
        workspaces={workspaces}
        bottomNavData={bottomNavData}
        emptyStoresAction={emptyStoresAction}
      />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, workspaces, sx, bottomNavData, emptyStoresAction }: NavContentProps) {
  // Determine if we're in a mobile drawer by checking if we're inside a Drawer component
  const [isMobileDrawer, setIsMobileDrawer] = useState(false);

  useEffect(() => {
    // Check if this component is rendered inside a Drawer
    const isInsideDrawer = !!document.querySelector(`.${drawerClasses.root}`);
    setIsMobileDrawer(isInsideDrawer);
  }, []);
  const pathname = usePathname();
  const websitesLength = workspaces?.length ?? 0
  const theme = useTheme();
  const { t } = useTranslation();

  // Get collapsed state from localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });

  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));

    // Dispatch a custom event to notify other components
    const event = new CustomEvent('sidebarCollapsedChange', { detail: { isCollapsed } });
    window.dispatchEvent(event);
  }, [isCollapsed]);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev: boolean) => !prev);
  };

  return (
    <>
      {/* Toggle collapse button - only show in desktop mode */}
      {!isMobileDrawer && (
        <Box
          sx={{
            position: 'absolute',
            right: -12,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            cursor: 'pointer',
            boxShadow: theme.shadows[2],
            transition: theme.transitions.create(['right', 'transform'], {
              duration: theme.transitions.duration.standard,
            }),
          }}
          onClick={handleToggleCollapse}
        >
          <Iconify
            icon={isCollapsed ? 'eva:arrow-right-fill' : 'eva:arrow-left-fill'}
            width={16}
            height={16}
          />
        </Box>
      )}

      {!isCollapsed && slots?.topArea}

      {!isCollapsed && websitesLength > 0 ? (
        <WorkspacesPopover data={workspaces} sx={{ mb: 1.5 , mt: 0 }} />
      ) : !isCollapsed ? (
        emptyStoresAction
      ) : null}

      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.25} display="flex" flexDirection="column">
            {data.map((item) => {
              const isActive = item.path === pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={{
                      pl: isCollapsed ? 0 : 1.5,
                      py: 1,
                      gap: isCollapsed ? 0 : 2,
                      pr: isCollapsed ? 0 : 1.5,
                      borderRadius: 1,
                      typography: 'body2',
                      fontSize: '14px',
                      fontWeight: 'fontWeightMedium',
                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'var(--layout-nav-item-color)',
                      minHeight: '40px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'var(--layout-nav-item-hover-bg)',
                      },
                      ...(isActive && {
                        fontWeight: 'fontWeightSemiBold',
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'var(--layout-nav-item-active-bg)',
                        color: theme.palette.mode === 'dark' ? '#fff' : 'var(--layout-nav-item-active-color)',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'var(--layout-nav-item-hover-bg)',
                        },
                      }),
                    }}
                  >
                    <Box component="span" sx={{ width: 22, height: 22, display: 'flex', justifyContent: 'center' }}>
                      {item.icon}
                    </Box>

                    {!isCollapsed && (
                      <Box component="span" flexGrow={1} sx={{ fontSize: '14px' }}>
                        {t(`navigation.${item.title.toLowerCase().replace(/\s+/g, '_')}`, item.title)}
                      </Box>
                    )}

                    {!isCollapsed && item.info && item.info}
                  </ListItemButton>
                </ListItem>
              );
            })}

            <Divider />

            {bottomNavData.map((item) => {
              const isActive = item.path === pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={{
                      pl: isCollapsed ? 0 : 1.5,
                      py: 1,
                      gap: isCollapsed ? 0 : 2,
                      pr: isCollapsed ? 0 : 1.5,
                      borderRadius: 1,
                      typography: 'body2',
                      fontSize: '14px',
                      fontWeight: 'fontWeightMedium',
                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'var(--layout-nav-item-color)',
                      minHeight: '40px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'var(--layout-nav-item-hover-bg)',
                      },
                      ...(isActive && {
                        fontWeight: 'fontWeightSemiBold',
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'var(--layout-nav-item-active-bg)',
                        color: theme.palette.mode === 'dark' ? '#fff' : 'var(--layout-nav-item-active-color)',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'var(--layout-nav-item-hover-bg)',
                        },
                      }),
                    }}
                  >
                    <Box component="span" sx={{ width: 22, height: 22, display: 'flex', justifyContent: 'center' }}>
                      {item.icon}
                    </Box>

                    {!isCollapsed && (
                      <Box component="span" flexGrow={1} sx={{ fontWeight: 'fontWeightSemiBold', fontSize: '14px' }}>
                        {t(`navigation.${item.title.toLowerCase().replace(/\s+/g, '_')}`, item.title)}
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {!isCollapsed && slots?.bottomArea}
      {!isCollapsed && <NavUpgrade />}
    </>
  );
}
