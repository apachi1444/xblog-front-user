import type { Theme } from '@mui/material/styles';

import { createTheme } from '@mui/material/styles';

import { shadows, typography, components, darkPalette, lightPalette, customShadows } from './core';

import type { ThemeVariantsProps } from './theme-provider';

// ----------------------------------------------------------------------

export const theme = ({ mode }: { mode: ThemeVariantsProps }): Theme =>
  createTheme({
      palette: {
        mode,
        ...(mode === 'light' ? lightPalette : darkPalette),
      },
      shadows: shadows(),
      customShadows: customShadows(),
      shape: { borderRadius: 8 },
      components,
      typography,
    });
