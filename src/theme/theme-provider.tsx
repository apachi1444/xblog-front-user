import type {} from '@mui/lab/themeAugmentation';
import type {} from '@mui/material/themeCssVarsAugmentation';

import { useMemo } from 'react';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import { useThemeMode } from 'src/hooks/useThemeMode';
import { ThemeContextProvider } from 'src/contexts/ThemeContext';
import { theme } from './create-theme';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};


export enum ThemeVariantsProps {
  light = 'light',
  dark = 'dark',
}


export function CustomThemeProvider({ children }: Props) {
  return (
    <ThemeContextProvider>
      <ThemeContent children={children} />
    </ThemeContextProvider>
  );
}

// Separate component to access theme context
function ThemeContent({ children }: Props) {
  // Get dark mode preference from custom hook
  const { isDarkMode } = useThemeMode();

  // Set the mode based on isDarkMode value
  const mode = isDarkMode ? ThemeVariantsProps.dark : ThemeVariantsProps.light;

  // Create theme with the appropriate mode and memoize it
  const activeTheme = useMemo(() => theme({ mode }), [mode]);

  return (
    <ThemeProvider theme={activeTheme} >
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
