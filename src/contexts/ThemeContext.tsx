import type { ReactNode} from 'react';

import React, { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

// Local storage key for theme preference
const THEME_STORAGE_KEY = 'theme_mode';

// Define the context type
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (darkMode: boolean) => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

// Props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

// Provider component that wraps the app
export function ThemeContextProvider({ children }: ThemeProviderProps) {
  // Initialize state from localStorage or default to light mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const storedValue = localStorage.getItem(THEME_STORAGE_KEY);
      return storedValue ? JSON.parse(storedValue) : false;
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
      return false; // Default to light mode on error
    }
  });

  // Update localStorage when theme changes
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(isDarkMode));
      
      // Dispatch a custom event so other components can react to theme changes
      window.dispatchEvent(new CustomEvent('themeChange', { detail: { isDarkMode } }));
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }, [isDarkMode]);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prevMode => !prevMode);
  }, []);

  // Set theme directly function
  const setTheme = useCallback((darkMode: boolean) => {
    setIsDarkMode(darkMode);
  }, []);

  // Create the context value object
  const contextValue = useMemo(() => ({
    isDarkMode,
    toggleTheme,
    setTheme,
  }), [isDarkMode, toggleTheme, setTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
}

