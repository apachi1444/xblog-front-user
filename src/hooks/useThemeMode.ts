import { useThemeContext } from '../contexts/ThemeContext';

/**
 * Custom hook for managing theme mode with localStorage persistence
 * This is now a wrapper around the ThemeContext for backward compatibility
 *
 * @returns {Object} Theme mode state and functions
 */
export function useThemeMode() {
  // Use the theme context directly
  return useThemeContext();
}
