import type {} from '@mui/lab/themeAugmentation';
import type { RootState } from 'src/services/store';
import type {} from '@mui/material/themeCssVarsAugmentation';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

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
  // Get dark mode preference from Redux store
  const isDarkMode = useSelector((state: RootState) => state.userDashboard.preferences.darkMode);
  
  // Set the mode based on isDarkMode value
  const mode = isDarkMode ? ThemeVariantsProps.dark : ThemeVariantsProps.light;
  
  // Create theme with the appropriate mode and memoize it
  const activeTheme = useMemo(() => theme({ mode }), [mode]);

  console.log(activeTheme.breakpoints.values);
  

  return (
    <ThemeProvider theme={activeTheme} >
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
