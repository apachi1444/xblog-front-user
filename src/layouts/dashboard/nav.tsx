import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import { Divider } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { ResourceUsage } from 'src/components/resource-usage';

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

  return (
    <Box
      sx={{
        pt: 2,
        px: 2,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: (customTheme) => customTheme.palette.mode === 'dark' ? '#121212' : customTheme.palette.background.paper,
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
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
  const pathname = usePathname();

  const websitesLength = workspaces?.length ?? 0

  const theme = useTheme();

  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
        <Logo />
      </Box>

      {slots?.topArea}

      {websitesLength > 0 ? (
        <WorkspacesPopover data={workspaces} sx={{ my: 1.5 }} />
      ) : (
        emptyStoresAction
      )}

      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.25} display="flex" flexDirection="column">
            {data.map((item) => {
              const isActived = item.path === pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={{
                      pl: 1.5,
                      py: 1,
                      gap: 2,
                      pr: 1.5,
                      borderRadius: 1,
                      typography: 'body2',
                      fontSize: '14px',
                      fontWeight: 'fontWeightMedium',
                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'var(--layout-nav-item-color)',
                      minHeight: '40px',
                      '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'var(--layout-nav-item-hover-bg)',
                      },
                      ...(isActived && {
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

                    <Box component="span" flexGrow={1} sx={{ fontSize: '14px' }}>
                      {t(`navigation.${item.title.toLowerCase().replace(/\s+/g, '_')}`, item.title)}
                    </Box>

                    {item.info && item.info}
                  </ListItemButton>
                </ListItem>
              );
            })}

            <Divider />

            {bottomNavData.map((item) => {
              const isActived = item.path === pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={{
                      pl: 1.5,
                      py: 1,
                      gap: 2,
                      pr: 1.5,
                      borderRadius: 1,
                      typography: 'body2',
                      fontSize: '14px',
                      fontWeight: 'fontWeightMedium',
                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'var(--layout-nav-item-color)',
                      minHeight: '40px',
                      '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'var(--layout-nav-item-hover-bg)',
                      },
                      ...(isActived && {
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

                    <Box component="span" flexGrow={1} sx={{ fontWeight: 'fontWeightSemiBold', fontSize: '14px' }}>
                      {t(`navigation.${item.title.toLowerCase().replace(/\s+/g, '_')}`, item.title)}
                    </Box>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}

      <ResourceUsage />
      <NavUpgrade />
    </>
  );
}
