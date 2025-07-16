import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';
import type { ContainerProps } from '@mui/material/Container';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { layoutClasses } from 'src/layouts/classes';


// ----------------------------------------------------------------------

export function Main({ children, sx, ...other }: BoxProps) {
  const theme = useTheme();

  return (
    <Box
      component="main"
      className={layoutClasses.main}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        bgcolor: theme.palette.background.default,
        pt: '64px', // Add padding top to account for the top header
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

type DashboardContentProps = ContainerProps & {
  disablePadding?: boolean;
};

export function DashboardContent({
  sx,
  children,
  disablePadding,
  maxWidth = 'xl',
  ...other
}: DashboardContentProps) {
  const theme = useTheme();

  const layoutQuery: Breakpoint = 'lg';

  return (
    <>
      {/* Banners above the content */}
      <Box sx={{ px: { xs: 2, sm: 3, md: 5 }, mb: 2, mt: 1, mx: { xs: 2, sm: 3, md: 5 } }}/>
      <Container
        className={layoutClasses.content}
        maxWidth={maxWidth || false}
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          pt: 'var(--layout-dashboard-content-pt)',
          pb: 'var(--layout-dashboard-content-pb)',
          bgcolor: theme.palette.background.paper, // Use theme background for content area
          borderRadius: 1,
          [theme.breakpoints.up(layoutQuery)]: {
            px: 'var(--layout-dashboard-content-px)',
          },
          ...(disablePadding && {
            p: {
              xs: 0,
              sm: 0,
              md: 0,
              lg: 0,
              xl: 0,
            },
          }),
          ...sx,
        }}
        {...other}
      >
        {children}
      </Container>
    </>
  );
}
