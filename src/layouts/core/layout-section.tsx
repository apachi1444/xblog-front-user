import type { Theme, SxProps, CSSObject } from '@mui/material/styles';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';

import { baseVars } from '../config-vars';
import { layoutClasses } from '../classes';

// ----------------------------------------------------------------------

export type LayoutSectionProps = {
  sx?: SxProps<Theme>;
  cssVars?: CSSObject;
  children?: React.ReactNode;
  footerSection?: React.ReactNode;
  headerSection?: React.ReactNode;
  sidebarSection?: React.ReactNode;
};

export function LayoutSection({
  sx,
  cssVars,
  children,
  footerSection,
  headerSection,
  sidebarSection,
}: LayoutSectionProps) {
  const theme = useTheme();

  const inputGlobalStyles = (
    <GlobalStyles
      styles={{
        body: {
          ...baseVars(theme),
          ...cssVars,
        },
      }}
    />
  );

  return (
    <>
      {inputGlobalStyles}

      <Box id="root__layout" className={layoutClasses.root} sx={{ bgcolor: theme.palette.background.default, ...sx }}>
        {/* Header now spans the full width */}
        {headerSection}

        <Box sx={{ display: 'flex', flex: '1 1 auto', position: 'relative' }}>
          {/* Sidebar */}
          {sidebarSection}

          {/* Main content */}
          <Box
            display="flex"
            flex="1 1 auto"
            flexDirection="column"
            className={layoutClasses.hasSidebar}
            sx={{ bgcolor: theme.palette.background.default }}
          >
            {children}
            {footerSection}
          </Box>
        </Box>
      </Box>
    </>
  );
}
