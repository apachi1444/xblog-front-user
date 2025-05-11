import { useLanguageContext } from '../contexts/LanguageContext';

/**
 * Custom hook for managing language with localStorage persistence
 * This is now a wrapper around the LanguageContext for backward compatibility
 *
 * @returns {Object} Language state and functions
 */
export function useLanguage() {
  // Use the language context directly
  return useLanguageContext();
}
